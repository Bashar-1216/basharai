import os
import re
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

def strip_think_blocks(text: str) -> str:
    """Remove <think>...</think> blocks (including partial/multiline) from completed text."""
    cleaned = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    # Also strip any trailing unclosed <think> block
    cleaned = re.sub(r'<think>.*$', '', cleaned, flags=re.DOTALL)
    return cleaned.strip()

async def _filter_think_stream(raw_stream: AsyncGenerator[str, None]) -> AsyncGenerator[str, None]:
    """Filter out <think>...</think> content from a token stream in real-time.
    
    Buffers tokens while inside a think block and only yields
    content that is outside those blocks.
    """
    inside_think = False
    buffer = ""

    async for token in raw_stream:
        buffer += token

        while buffer:
            if inside_think:
                # Look for closing </think> tag
                close_idx = buffer.find("</think>")
                if close_idx != -1:
                    # Discard everything up to and including </think>
                    buffer = buffer[close_idx + len("</think>"):]
                    inside_think = False
                    continue
                else:
                    # Still inside think block; check if </think> might be partially at the end
                    # Keep last 8 chars as potential partial tag
                    if len(buffer) > 8:
                        buffer = buffer[-8:]
                    break
            else:
                # Look for opening <think> tag
                open_idx = buffer.find("<think>")
                if open_idx != -1:
                    # Yield everything before the tag
                    before = buffer[:open_idx]
                    if before:
                        yield before
                    buffer = buffer[open_idx + len("<think>"):]
                    inside_think = True
                    continue
                else:
                    # No <think> found; check if one might be partially at the end
                    # "<think>" is 7 chars, so keep last 6 as potential partial
                    safe_end = len(buffer) - 6
                    if safe_end > 0:
                        yield buffer[:safe_end]
                        buffer = buffer[safe_end:]
                    break

    # Flush any remaining buffer (only if not inside a think block)
    if not inside_think and buffer:
        yield buffer

async def generate_text_content(prompt: str, system_instruction: str = None) -> str:
    """Generate complete text content using Groq Qwen (primary) or Gemini 3.5 (fallback)."""
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
                    return strip_think_blocks(res.choices[0].message.content)
            except Exception as e:
                print(f"Groq text generation failed: {e}. Falling back to Gemini.")
                
    # Fallback to Gemini
    from app.core.gemini import generate_gemini_content
    return await generate_gemini_content(prompt, system_instruction)

async def stream_text_content(prompt: str, system_instruction: str = None) -> AsyncGenerator[str, None]:
    """Stream text content token-by-token using Groq Qwen (primary) or Gemini 3.5 (fallback).
    
    Automatically filters out <think>...</think> reasoning blocks from
    the Qwen model so the user only sees the clean final answer.
    """
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

                async def _raw_groq_stream():
                    async for chunk in stream:
                        if chunk.choices and chunk.choices[0].delta.content:
                            yield chunk.choices[0].delta.content

                # Wrap raw stream with think-tag filter
                async for clean_token in _filter_think_stream(_raw_groq_stream()):
                    yield clean_token
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
