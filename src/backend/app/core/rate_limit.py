import time
import redis.asyncio as redis
from fastapi import HTTPException, status
from app.core.config import settings

# Initialize Redis client lazily
redis_client = None

def get_redis_client():
    global redis_client
    if redis_client is None:
        redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    return redis_client

async def check_rate_limit(key: str, max_tokens: int = 10, refill_rate: float = 0.16) -> None:
    """
    Redis-based Token Bucket Rate Limiter.
    max_tokens: capacity of the bucket (e.g., 10 tokens)
    refill_rate: tokens added per second (0.16 tokens/sec ~= 10 tokens per minute)
    """
    r = get_redis_client()
    try:
        bucket_key = f"rate_limit:{key}:tokens"
        last_update_key = f"rate_limit:{key}:last_updated"
        
        now = time.time()
        
        # Get current bucket state
        tokens_str, last_updated_str = await r.mget(bucket_key, last_update_key)
        
        if tokens_str is None or last_updated_str is None:
            # Initial state
            tokens = float(max_tokens)
            last_updated = now
        else:
            tokens = float(tokens_str)
            last_updated = float(last_updated_str)
            
        # Refill tokens since last request
        elapsed = now - last_updated
        tokens = min(float(max_tokens), tokens + (elapsed * refill_rate))
        
        if tokens < 1.0:
            # Raise Rate Limit Error
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please wait before asking again."
            )
            
        # Consume 1 token
        tokens -= 1.0
        
        # Save back to Redis
        async with r.pipeline(transaction=True) as pipe:
            pipe.set(bucket_key, tokens)
            pipe.set(last_update_key, now)
            # Expire keys after 1 hour of inactivity
            pipe.expire(bucket_key, 3600)
            pipe.expire(last_update_key, 3600)
            await pipe.execute()
            
    except HTTPException:
        raise
    except Exception as e:
        # Fallback to allow request if Redis fails / goes offline
        print(f"Rate Limiter error (allowing request): {e}")
