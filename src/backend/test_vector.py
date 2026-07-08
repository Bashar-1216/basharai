import asyncio
from sqlalchemy import text
from app.core.db import engine

async def f():
    async with engine.connect() as c:
        try:
            await c.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            print("SUCCESS: pgvector extension created successfully!")
        except Exception as e:
            print("ERROR: pgvector extension creation failed:", e)

asyncio.run(f())
