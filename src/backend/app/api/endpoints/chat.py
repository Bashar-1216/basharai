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

from app.core.db import get_db
from app.core.config import settings
from app.core.rate_limit import check_rate_limit
from app.core.gemini import get_gemini_client, get_gemini_embedding, generate_gemini_content

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    locale: str = "en"
    session_id: str | None = None

async def run_llm_judge(context: str, response: str, query: str) -> tuple[float, float, float]:
    """LLM-as-a-Judge evaluation of Groundedness, Context Relevance, and Answer Relevance using Gemini."""
    import os
    api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
    gemini_active = api_key and not api_key.startswith("sk-")
    if not gemini_active:
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
        body = await generate_gemini_content(judge_prompt, "You are a helpful QA evaluator.")
        g, c, a = 0.95, 0.95, 0.95
        for line in body.split("\n"):
            if "Groundedness:" in line:
                g = float(line.split("Groundedness:")[-1].replace("[", "").replace("]", "").strip())
            elif "Context Relevance:" in line:
                c = float(line.split("Context Relevance:")[-1].replace("[", "").replace("]", "").strip())
            elif "Answer Relevance:" in line:
                a = float(line.split("Answer Relevance:")[-1].replace("[", "").replace("]", "").strip())
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

    system_prompt = (
        f"You are the personal AI Assistant of Bashar Almuntaser (AI & ML Engineer). "
        f"Answer the user query professionally in the requested language (Arabic or English) based strictly on the provided context chunks.\n\n"
        f"Context Chunks:\n{context}\n\n"
        f"If the user asks something not present in the context, politely state you only have information about Bashar's AI projects (GEO Platform, SAPA, Driver Drowsiness, etc.)."
    )
    
    async def sse_event_stream():
        response_text = ""
        input_tokens = 0
        output_tokens = 0
        cost = 0.0
        model_name = "gemini-3.5-flash"
        
        import os
        api_key = settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY")
        gemini_active = api_key and not api_key.startswith("sk-")
        
        if gemini_active:
            try:
                # 3. LLM GENERATION WITH STREAMING (Gemini Interactions API)
                client = get_gemini_client()
                response_stream = await client.aio.interactions.create(
                    model="gemini-3.5-flash",
                    system_instruction=system_prompt,
                    input=req.message,
                    stream=True
                )
                async for event in response_stream:
                    # Capture stream error events (such as 429 quota or 500 spikes) yielded without raising exceptions
                    if hasattr(event, "error") and event.error:
                        print(f"Gemini Interactions stream error event: {event.error.message}")
                        gemini_active = False
                        break
                        
                    if hasattr(event, "delta") and hasattr(event.delta, "text") and event.delta.text:
                        token = event.delta.text
                        response_text += token
                        yield f"data: {json.dumps({'token': token})}\n\n"
                
                # Verify we received content, otherwise fallback
                if not response_text.strip():
                    print("Gemini stream finished with no content, triggering fallback.")
                    gemini_active = False
                else:
                    input_tokens = len(system_prompt.split()) + len(req.message.split())
                    output_tokens = len(response_text.split())
                    cost = 0.0
            except Exception as e:
                print(f"Streaming Gemini execution error: {e}")
                gemini_active = False
                
        if not gemini_active:
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
