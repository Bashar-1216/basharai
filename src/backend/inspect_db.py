import asyncio
from sqlalchemy import text
from app.core.db import engine

async def f():
    async with engine.connect() as c:
        try:
            r = await c.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Chunk'"))
            print("CHUNK COLUMNS:", r.fetchall())
            r2 = await c.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Experience'"))
            print("EXPERIENCE COLUMNS:", r2.fetchall())
        except Exception as e:
            print("ERROR:", e)

asyncio.run(f())
