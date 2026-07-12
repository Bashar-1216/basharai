import os
import json
from typing import AsyncGenerator
from groq import AsyncGroq
from app.core.config import settings
from app.core.gemini import get_gemini_client

# Initialize Groq Client
_groq_client = None

def get_groq_client() -> AsyncGroq | None:
    global _groq_client
    if _groq_client is None:
        api_key = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")
        if api_key and api_key != "your-groq-api-key-here" and not api_key.startswith("sk-"):
            _groq_client = AsyncGroq(api_key=api_key)
    return _groq_client

def is_groq_active() -> bool:
    """Check if Groq API is configured and key is present."""
    api_key = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")
    return bool(api_key and api_key != "your-groq-api-key-here" and api_key.startswith("gsk_"))

async def generate_text_content(prompt: str, system_instruction: str = None) -> str:
    """Generate complete text content using Groq Llama 3.3 (primary) or Gemini 3.5 (fallback)."""
    if is_groq_active():
        client = get_groq_client()
        if client:
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                res = await client.chat.completions.create(
                    messages=messages,
                    model="qwen/qwen3.6-27b",
                    temperature=0.2
                )
                if res.choices and res.choices[0].message.content:
                    return res.choices[0].message.content
            except Exception as e:
                print(f"Groq text generation failed: {e}. Falling back to Gemini.")
                
    # Fallback to Gemini
    from app.core.gemini import generate_gemini_content
    return await generate_gemini_content(prompt, system_instruction)

async def stream_text_content(prompt: str, system_instruction: str = None) -> AsyncGenerator[str, None]:
    """Stream text content token-by-token using Groq Llama 3.3 (primary) or Gemini 3.5 (fallback)."""
    if is_groq_active():
        client = get_groq_client()
        if client:
            try:
                messages = []
                if system_instruction:
                    messages.append({"role": "system", "content": system_instruction})
                messages.append({"role": "user", "content": prompt})
                
                stream = await client.chat.completions.create(
                    messages=messages,
                    model="qwen/qwen3.6-27b",
                    temperature=0.2,
                    stream=True
                )
                async for chunk in stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
                return
            except Exception as e:
                print(f"Groq streaming text generation failed: {e}. Falling back to Gemini.")
                
    # Fallback to Gemini
    client = get_gemini_client()
    try:
        response_stream = await client.aio.interactions.create(
            model="gemini-3.5-flash",
            system_instruction=system_instruction,
            input=prompt,
            stream=True
        )
        async for event in response_stream:
            # Handle error events yielded inside the stream
            if hasattr(event, "error") and event.error:
                print(f"Gemini fallback stream error: {event.error.message}")
                break
            if hasattr(event, "delta") and hasattr(event.delta, "text") and event.delta.text:
                yield event.delta.text
    except Exception as e:
        print(f"Gemini fallback stream exception: {e}")
