import asyncio
import uuid
import hashlib
from sqlalchemy import text

from app.core.db import engine
from app.core.config import settings
from app.core.gemini import get_gemini_embedding

# We use 1536 dimensions (matching text-embedding-004 config)
DIMENSIONS = 1536

async def get_embedding(text_content: str) -> list[float]:
    """Fetch real embedding from Google Gemini, fallback to dummy vector on failure/offline."""
    gemini_active = settings.GEMINI_API_KEY and not settings.GEMINI_API_KEY.startswith("sk-")
    if gemini_active:
        return await get_gemini_embedding(text_content)
            
    # Dummy deterministic vector matching hash of the text (so we can test similarity deterministically)
    h = hashlib.sha256(text_content.encode("utf-8")).digest()
    dummy = []
    for i in range(DIMENSIONS):
        byte_val = h[i % len(h)]
        dummy.append((byte_val / 255.0) - 0.5)
    # L2 normalize dummy
    norm = sum(x*x for x in dummy) ** 0.5
    return [x/norm for x in dummy]

def split_text_into_chunks(text_data: str, chunk_size: int = 400, overlap: int = 100) -> list[str]:
    """Intelligent sliding window chunker."""
    words = text_data.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk_words = words[i:i + chunk_size]
        chunks.append(" ".join(chunk_words))
        i += chunk_size - overlap
        if i + chunk_size - overlap >= len(words):
            break
    # Add remainder if needed
    if i < len(words):
        chunks.append(" ".join(words[i:]))
    return chunks or [text_data]

async def index_portfolio():
    print("Initializing portfolio indexing pipeline...")
        
    async with engine.connect() as conn:
        # Wipe old chunks and documents
        await conn.execute(text('DELETE FROM "Chunk"'))
        await conn.execute(text('DELETE FROM "Document"'))
        await conn.commit()
        print("Stale documents and chunks cleared.")
        
        # 1. Fetch Experiences
        r_exp = await conn.execute(text('SELECT id, company, title_en, title_ar, summary_en, summary_ar FROM "Experience"'))
        experiences = r_exp.fetchall()
        
        for exp in experiences:
            exp_id, company, title_en, title_ar, sum_en, sum_ar = exp
            doc_id = uuid.uuid4()
            file_hash = hashlib.sha256(company.encode("utf-8")).hexdigest()
            
            # Insert Document
            await conn.execute(
                text('INSERT INTO "Document" (id, source_url, title_en, title_ar, doc_type, file_hash, updated_at) '
                     'VALUES (:id, :src, :t_en, :t_ar, :doc_type, :h, NOW())'),
                {"id": doc_id, "src": f"/experience/{company.lower()}", "t_en": title_en, "t_ar": title_ar, "doc_type": "EXPERIENCE", "h": file_hash}
            )
            
            # Chunking and Embedding
            chunks_en = split_text_into_chunks(sum_en)
            chunks_ar = split_text_into_chunks(sum_ar)
            
            # Match them up (zip or padded)
            max_chunks = max(len(chunks_en), len(chunks_ar))
            for idx in range(max_chunks):
                ch_en = chunks_en[idx] if idx < len(chunks_en) else chunks_en[-1]
                ch_ar = chunks_ar[idx] if idx < len(chunks_ar) else chunks_ar[-1]
                
                v_en = await get_embedding(ch_en)
                v_ar = await get_embedding(ch_ar)
                
                chunk_id = uuid.uuid4()
                chunk_hash = hashlib.sha256(f"{ch_en}{ch_ar}".encode("utf-8")).hexdigest()
                
                await conn.execute(
                    text('INSERT INTO "Chunk" (id, document_id, content_en, content_ar, chunk_hash, embedding_en, embedding_ar) '
                         'VALUES (:id, :doc_id, :c_en, :c_ar, :h, :v_en, :v_ar)'),
                    {
                        "id": chunk_id,
                        "doc_id": doc_id,
                        "c_en": ch_en,
                        "c_ar": ch_ar,
                        "h": chunk_hash,
                        "v_en": str(v_en),
                        "v_ar": str(v_ar)
                    }
                )
            print(f"Indexed Experience: {company} ({max_chunks} chunks)")

        # 2. Fetch Projects
        r_proj = await conn.execute(text('SELECT id, slug, title_en, title_ar, description_en, description_ar FROM "Project"'))
        projects = r_proj.fetchall()
        
        for proj in projects:
            proj_id, slug, title_en, title_ar, desc_en, desc_ar = proj
            doc_id = uuid.uuid4()
            file_hash = hashlib.sha256(slug.encode("utf-8")).hexdigest()
            
            # Insert Document
            await conn.execute(
                text('INSERT INTO "Document" (id, source_url, title_en, title_ar, doc_type, file_hash, updated_at) '
                     'VALUES (:id, :src, :t_en, :t_ar, :doc_type, :h, NOW())'),
                {"id": doc_id, "src": f"/projects/{slug}", "t_en": title_en, "t_ar": title_ar, "doc_type": "PROJECT", "h": file_hash}
            )
            
            # Chunking and Embedding
            chunks_en = split_text_into_chunks(desc_en)
            chunks_ar = split_text_into_chunks(desc_ar)
            
            max_chunks = max(len(chunks_en), len(chunks_ar))
            for idx in range(max_chunks):
                ch_en = chunks_en[idx] if idx < len(chunks_en) else chunks_en[-1]
                ch_ar = chunks_ar[idx] if idx < len(chunks_ar) else chunks_ar[-1]
                
                v_en = await get_embedding(ch_en)
                v_ar = await get_embedding(ch_ar)
                
                chunk_id = uuid.uuid4()
                chunk_hash = hashlib.sha256(f"{ch_en}{ch_ar}".encode("utf-8")).hexdigest()
                
                await conn.execute(
                    text('INSERT INTO "Chunk" (id, document_id, content_en, content_ar, chunk_hash, embedding_en, embedding_ar) '
                         'VALUES (:id, :doc_id, :c_en, :c_ar, :h, :v_en, :v_ar)'),
                    {
                        "id": chunk_id,
                        "doc_id": doc_id,
                        "c_en": ch_en,
                        "c_ar": ch_ar,
                        "h": chunk_hash,
                        "v_en": str(v_en),
                        "v_ar": str(v_ar)
                    }
                )
            print(f"Indexed Project: {slug} ({max_chunks} chunks)")
            
        await conn.commit()
    print("Portfolio indexing completed successfully!")

if __name__ == "__main__":
    asyncio.run(index_portfolio())
