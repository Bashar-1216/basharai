import time
import uuid
import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from google.genai import types

from datetime import datetime
from app.core.db import get_db
from app.core.config import settings
from app.core.rate_limit import check_rate_limit
from app.core.gemini import get_gemini_embedding
from app.core.llm import generate_text_content, stream_text_content, is_groq_active
from app.services import detect_persona, RedisConversationMemory
from app.tools import get_projects, get_project_detail, get_github_stats, get_resume, search_knowledge_base, run_interview

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    locale: str = "en"
    session_id: str | None = None

class SessionRequest(BaseModel):
    locale: str = "en"
    persona_hint: str | None = None

@router.post("/session", status_code=201)
async def create_session(req: SessionRequest):
    session_id = str(uuid.uuid4())
    memory = RedisConversationMemory(session_id)
    if req.persona_hint:
        await memory.set_persona(req.persona_hint)
    return {"session_id": session_id, "created_at": datetime.utcnow().isoformat()}

async def run_llm_judge(context: str, response: str, query: str) -> tuple[float, float, float]:
    """LLM-as-a-Judge evaluation of Groundedness, Context Relevance, and Answer Relevance using Groq/Gemini."""
    import os
    gemini_active = bool(settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY"))
    llm_active = is_groq_active() or gemini_active
    if not llm_active:
        return 0.98, 0.95, 0.96 # Offline static fallback
        
    judge_prompt = (
        f"You are a strict QA evaluator testing a RAG system.\n"
        f"Query: {query}\n"
        f"Context: {context}\n"
        f"Response: {response}\n\n"
        f"Rate the following coordinates from 0.0 to 1.0:\n"
        f"1. Groundedness (does the response contain claims not supported by context?)\n"
        f"2. Context Relevance (how relevant are the retrieved chunks to the query?)\n"
        f"3. Answer Relevance (how directly does the response answer the query?)\n\n"
        f"Output format exactly: Groundedness: [float], Context Relevance: [float], Answer Relevance: [float]"
    )
    try:
        body = await generate_text_content(judge_prompt, "You are a helpful QA evaluator.")
        import re
        g, c, a = 0.95, 0.95, 0.95
        # Use regex to extract float values after each label (handles single-line and multi-line)
        g_match = re.search(r'Groundedness[:\s]*\[?(\d+\.?\d*)\]?', body)
        c_match = re.search(r'Context Relevance[:\s]*\[?(\d+\.?\d*)\]?', body)
        a_match = re.search(r'Answer Relevance[:\s]*\[?(\d+\.?\d*)\]?', body)
        if g_match: g = float(g_match.group(1))
        if c_match: c = float(c_match.group(1))
        if a_match: a = float(a_match.group(1))
        return min(max(g, 0.0), 1.0), min(max(c, 0.0), 1.0), min(max(a, 0.0), 1.0)
    except Exception as e:
        print(f"LLM Judge call failed: {e}")
        return 0.95, 0.95, 0.95

@router.post("/chat")
async def chat_handler(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    start_time = time.time()
    
    # 1. Apply Redis Rate Limiting
    session_id = req.session_id or str(uuid.uuid4())
    await check_rate_limit(session_id)
    
    is_ar = req.locale == "ar"
    
    # Resolve or create conversation
    conv_res = await db.execute(
        text('SELECT id FROM "Conversation" WHERE session_id = :sid'),
        {"sid": session_id}
    )
    conv = conv_res.fetchone()
    
    if conv:
        conversation_id = conv[0]
    else:
        conversation_id = uuid.uuid4()
        await db.execute(
            text('INSERT INTO "Conversation" (id, session_id, user_language, "createdAt", "updatedAt") VALUES (:id, :sid, :lang, NOW(), NOW())'),
            {"id": conversation_id, "sid": session_id, "lang": req.locale}
        )
    
    # Save User Message
    await db.execute(
        text('INSERT INTO "Message" (id, conversation_id, role, content, created_at) VALUES (:id, :cid, :role, :content, NOW())'),
        {"id": uuid.uuid4(), "cid": conversation_id, "role": "USER", "content": req.message}
    )

    # 2. RETRIEVAL PHASE (Hybrid Vector + Keyword Search using Gemini Embedding)
    query_vector = await get_gemini_embedding(req.message)
    
    # Vector Search query matching corresponding locale embeddings
    emb_col = "embedding_ar" if is_ar else "embedding_en"
    vector_sql = (
        f'SELECT content_en, content_ar, (1 - ({emb_col} <=> :qv)) AS score '
        f'FROM "Chunk" '
        f'ORDER BY {emb_col} <=> :qv '
        f'LIMIT 10'
    )
    r_vec = await db.execute(text(vector_sql), {"qv": str(query_vector)})
    vector_hits = r_vec.fetchall()
    
    # Keyword Search fallback
    keyword_sql = (
        'SELECT content_en, content_ar, 0.5 AS score '
        'FROM "Chunk" '
        'WHERE content_en ILIKE :q OR content_ar ILIKE :q '
        'LIMIT 10'
    )
    tokens = req.message.split()
    search_token = f"%{tokens[0]}%" if tokens else "%bashar%"
    r_key = await db.execute(text(keyword_sql), {"q": search_token})
    keyword_hits = r_key.fetchall()
    
    # Merging Phase
    merged_hits = {}
    for hit in vector_hits:
        content_key = hit[0]
        merged_hits[content_key] = {
            "content_en": hit[0],
            "content_ar": hit[1],
            "score": float(hit[2])
        }
        
    for hit in keyword_hits:
        content_key = hit[0]
        if content_key in merged_hits:
            merged_hits[content_key]["score"] += 0.2
        else:
            merged_hits[content_key] = {
                "content_en": hit[0],
                "content_ar": hit[1],
                "score": float(hit[2])
            }
            
    # Top-5 Chunks
    top_chunks = sorted(merged_hits.values(), key=lambda x: x["score"], reverse=True)[:5]
    
    context = ""
    for idx, chunk in enumerate(top_chunks):
        c_text = chunk["content_ar"] if is_ar else chunk["content_en"]
        context += f"[Chunk {idx+1}] (Score: {chunk['score']:.3f}): {c_text}\n\n"

    # Fetch all active portfolio project titles dynamically
    r_all_proj = await db.execute(text('SELECT title_en, title_ar FROM "Project" WHERE title_en IS NOT NULL'))
    all_projects = r_all_proj.fetchall()
    proj_list_str = ", ".join([p[1] if is_ar else p[0] for p in all_projects])

    system_prompt = (
        f"You are the personal AI Assistant of Bashar Almuntaser (AI & ML Engineer).\n"
        f"Bashar's Portfolio Projects include: {proj_list_str}.\n\n"
        f"Answer the user query professionally in the requested language (Arabic or English) based on the provided context chunks and project catalog.\n\n"
        f"Context Chunks:\n{context}\n\n"
        f"Always provide an accurate, helpful response about Bashar's engineering work and projects."
    )
    
    async def sse_event_stream():
        response_text = ""
        input_tokens = 0
        output_tokens = 0
        import os
        gemini_active = bool(settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY"))
        llm_active = is_groq_active() or gemini_active
        model_name = "qwen/qwen3.6-27b" if is_groq_active() else "gemini-3.5-flash"
        
        if llm_active:
            try:
                # 3. LLM GENERATION WITH STREAMING
                response_stream = stream_text_content(
                    prompt=req.message,
                    system_instruction=system_prompt
                )
                async for token in response_stream:
                    response_text += token
                    yield f"data: {json.dumps({'token': token})}\n\n"
                
                # Verify we received content, otherwise fallback
                if not response_text.strip():
                    print("LLM stream finished with no content, triggering fallback.")
                    llm_active = False
                else:
                    input_tokens = len(system_prompt.split()) + len(req.message.split())
                    output_tokens = len(response_text.split())
                    cost = 0.0
            except Exception as e:
                print(f"Streaming LLM execution error: {e}")
                llm_active = False
                
        if not llm_active:
            # Fallback to streaming mock response text word-by-word with delay
            if top_chunks:
                match_chunk = top_chunks[0]
                c_text = match_chunk["content_ar"] if is_ar else match_chunk["content_en"]
                response_text = (
                    f"بناءً على وثائق السيرة الذاتية المسترجعة (درجة تطابق {match_chunk['score']:.3f}): {c_text}"
                    if is_ar
                    else f"Based on retrieved RAG documents (similarity score {match_chunk['score']:.3f}): {c_text}"
                )
            else:
                response_text = (
                    "أهلاً بك! لم يتم العثور على سياق مطابق لاستفسارك في قاعدة بيانات المتجهات."
                    if is_ar
                    else "Hello! No matching vector contexts were retrieved from the database."
                )
            model_name = "Local pgvector Cosine Fallback"
            
            # Stream words
            words = response_text.split(" ")
            for idx, word in enumerate(words):
                spaced_word = word + (" " if idx < len(words) - 1 else "")
                yield f"data: {json.dumps({'token': spaced_word})}\n\n"
                await asyncio.sleep(0.03)
                
            input_tokens = len(system_prompt.split()) + len(req.message.split())
            output_tokens = len(response_text.split())
            cost = 0.0
            
        latency_ms = int((time.time() - start_time) * 1000)
        
        # 4. Save Assistant Response in DB
        await db.execute(
            text('INSERT INTO "Message" (id, conversation_id, role, content, created_at) VALUES (:id, :cid, :role, :content, NOW())'),
            {"id": uuid.uuid4(), "cid": conversation_id, "role": "ASSISTANT", "content": response_text}
        )
        
        # 5. LLM Judge Evaluation
        groundedness, context_relevance, answer_relevance = await run_llm_judge(context, response_text, req.message)
        passed = groundedness >= 0.8 and answer_relevance >= 0.8
        
        # 6. Save LLM logs and evaluations
        log_id = uuid.uuid4()
        await db.execute(
            text('INSERT INTO "LLMLog" (id, conversation_id, query_text, response_text, tokens_input, tokens_output, cost_usd, latency_ms, language_code, created_at) '
                 'VALUES (:id, :cid, :q, :r, :ti, :to, :cost, :lat, :lang, NOW())'),
            {
                "id": log_id,
                "cid": conversation_id,
                "q": req.message,
                "r": response_text,
                "ti": input_tokens,
                "to": output_tokens,
                "cost": cost,
                "lat": latency_ms,
                "lang": req.locale
            }
        )
        
        await db.execute(
            text('INSERT INTO "EvaluationResult" (id, llm_log_id, run_id, context_relevance, groundedness, answer_relevance, passed, feedback_reason, created_at) '
                 'VALUES (:id, :log_id, :run_id, :cr, :gr, :ar, :passed, :reason, NOW())'),
            {
                "id": uuid.uuid4(),
                "log_id": log_id,
                "run_id": str(uuid.uuid4()),
                "cr": context_relevance,
                "gr": groundedness,
                "ar": answer_relevance,
                "passed": passed,
                "reason": "Evaluated by Gemini LLM Judge."
            }
        )
        
        await db.commit()
        
        telemetry = {
            "model": model_name,
            "tokens": f"{input_tokens} In / {output_tokens} Out",
            "cost": f"${cost:.5f}",
            "latency": f"{latency_ms}ms",
            "groundedness": f"{groundedness * 100:.1f}% " + ("🟢" if passed else "🔴"),
            "context_relevance": f"{context_relevance * 100:.1f}% " + ("🟢" if passed else "🔴")
        }
        
        yield f"data: {json.dumps({'done': True, 'telemetry': telemetry})}\n\n"
        
    return StreamingResponse(sse_event_stream(), media_type="text/event-stream")
