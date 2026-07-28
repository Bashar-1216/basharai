import asyncio
from sqlalchemy import text
from app.core.db import engine
from app.core.gemini import get_gemini_embedding

async def rebuild_embeddings():
    """Background task to rebuild vector embeddings from all active documents in DB."""
    print("Starting background vector embeddings store rebuild...")
    
    async with engine.connect() as conn:
        # Fetch all projects and experiences
        proj_res = await conn.execute(
            text('SELECT id, slug, title_en, title_ar, description_en, description_ar FROM "Project"')
        )
        projects = proj_res.fetchall()
        
        for p in projects:
            p_id, slug, title_en, title_ar, desc_en, desc_ar = p
            
            # Upsert Document
            doc_check = await conn.execute(
                text('SELECT id FROM "Document" WHERE source_url = :url'),
                {"url": f"/projects/{slug}"}
            )
            doc_row = doc_check.fetchone()
            if not doc_row:
                import uuid
                doc_id = uuid.uuid4()
                await conn.execute(
                    text('INSERT INTO "Document" (id, source_url, title_en, title_ar, doc_type, file_hash, updated_at) '
                         'VALUES (:id, :url, :ten, :tar, :type, :hash, NOW())'),
                    {
                        "id": doc_id,
                        "url": f"/projects/{slug}",
                        "ten": title_en or "",
                        "tar": title_ar or "",
                        "type": "PROJECT",
                        "hash": "auto-rebuild"
                    }
                )
            else:
                doc_id = doc_row[0]
                
            # Upsert Chunk
            chunk_check = await conn.execute(
                text('SELECT id FROM "Chunk" WHERE document_id = :did'),
                {"did": doc_id}
            )
            chunk_row = chunk_check.fetchone()
            if not chunk_row:
                import uuid
                chunk_id = uuid.uuid4()
                
                emb_en = await get_gemini_embedding(desc_en or title_en)
                emb_ar = await get_gemini_embedding(desc_ar or title_ar)
                
                await conn.execute(
                    text('INSERT INTO "Chunk" (id, document_id, content_en, content_ar, chunk_hash, embedding_en, embedding_ar) '
                         'VALUES (:id, :did, :cen, :car, :hash, :een, :ear)'),
                    {
                        "id": chunk_id,
                        "did": doc_id,
                        "cen": desc_en or title_en,
                        "car": desc_ar or title_ar,
                        "hash": "auto-rebuild",
                        "een": str(emb_en),
                        "ear": str(emb_ar)
                    }
                )
                
        await conn.commit()
    print("Vector embeddings store rebuild completed successfully!")

if __name__ == "__main__":
    asyncio.run(rebuild_embeddings())
