import json
from typing import List, Dict, Any
from datetime import datetime
import redis.asyncio as redis
from app.core.config import settings

_redis_client: redis.Redis | None = None

def get_redis_client() -> redis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return _redis_client

class RedisConversationMemory:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.key = f"session:{session_id}:messages"
        self.persona_key = f"session:{session_id}:persona"
        
    async def add_message(self, role: str, content: str):
        client = get_redis_client()
        msg = {
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow().isoformat()
        }
        await client.rpush(self.key, json.dumps(msg))
        await client.ltrim(self.key, -20, -1)  # Keep last 20 messages
        await client.expire(self.key, 7200)    # 2 hours TTL
        
    async def get_history(self) -> List[Dict[str, Any]]:
        client = get_redis_client()
        raw = await client.lrange(self.key, 0, -1)
        return [json.loads(m) for m in raw]
        
    async def set_persona(self, persona: str):
        client = get_redis_client()
        await client.set(self.persona_key, persona, ex=7200)
        
    async def get_persona(self) -> str:
        client = get_redis_client()
        p = await client.get(self.persona_key)
        return p or "unknown"
