import asyncio
from sqlalchemy import text
from app.core.db import engine

async def f():
    async with engine.connect() as c:
        try:
            # Create extension if not exists
            await c.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            # Alter table Chunk to add pgvector columns
            await c.execute(text('ALTER TABLE "Chunk" ADD COLUMN IF NOT EXISTS embedding_en vector(1536);'))
            await c.execute(text('ALTER TABLE "Chunk" ADD COLUMN IF NOT EXISTS embedding_ar vector(1536);'))
            await c.commit()
            print("SUCCESS: pgvector columns added successfully to Chunk table!")
        except Exception as e:
            print("ERROR: altering Chunk table failed:", e)

asyncio.run(f())
