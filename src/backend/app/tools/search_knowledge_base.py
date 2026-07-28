from typing import Any, Dict, Optional
from sqlalchemy import text
from app.core.db import engine
from app.core.gemini import get_gemini_embedding

async def search_knowledge_base(
    query: str, 
    locale: str = "en", 
    top_k: int = 5
) -> Dict[str, Any]:
    """Perform hybrid retrieval (keyword trigram + vector search) over portfolio knowledge base."""
    is_ar = locale == "ar"
    
    # 1. Generate query vector
    query_vector = await get_gemini_embedding(query)
    emb_col = "embedding_ar" if is_ar else "embedding_en"
    
    async with engine.connect() as conn:
        # Vector Search
        vector_sql = f"""
            SELECT c.content_en, c.content_ar, (1 - (c.{emb_col} <=> :qv)) AS score, d.doc_type, d.title_en, d.title_ar
            FROM "Chunk" c
            JOIN "Document" d ON d.id = c.document_id
            ORDER BY c.{emb_col} <=> :qv
            LIMIT 10
        """
        r_vec = await conn.execute(text(vector_sql), {"qv": str(query_vector)})
        vector_hits = r_vec.fetchall()
        
        # Trigram Keyword Search
        keyword_sql = """
            SELECT c.content_en, c.content_ar, 0.5 AS score, d.doc_type, d.title_en, d.title_ar
            FROM "Chunk" c
            JOIN "Document" d ON d.id = c.document_id
            WHERE c.content_en ILIKE :q OR c.content_ar ILIKE :q
            LIMIT 10
        """
        tokens = query.split()
        token_search = f"%{tokens[0]}%" if tokens else "%bashar%"
        r_key = await conn.execute(text(keyword_sql), {"q": token_search})
        keyword_hits = r_key.fetchall()
        
        # Merge & Rank
        merged = {}
        for hit in vector_hits:
            key = hit[0]
            merged[key] = {
                "content": hit[1] if is_ar and hit[1] else hit[0],
                "score": float(hit[2]),
                "doc_type": hit[3],
                "source_title": hit[5] if is_ar and hit[5] else hit[4]
            }
            
        for hit in keyword_hits:
            key = hit[0]
            if key in merged:
                merged[key]["score"] += 0.2
            else:
                merged[key] = {
                    "content": hit[1] if is_ar and hit[1] else hit[0],
                    "score": float(hit[2]),
                    "doc_type": hit[3],
                    "source_title": hit[5] if is_ar and hit[5] else hit[4]
                }
                
        sorted_hits = sorted(merged.values(), key=lambda x: x["score"], reverse=True)[:top_k]
        
    return {
        "results": [
            {
                "source_type": h["doc_type"],
                "source_title": h["source_title"],
                "excerpt": h["content"],
                "relevance_score": round(h["score"], 4)
            }
            for h in sorted_hits
        ]
    }
