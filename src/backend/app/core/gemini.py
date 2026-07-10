from google import genai
from google.genai import types
from app.core.config import settings

# Initialize Gemini Client
_client = None

def get_gemini_client():
    global _client
    if _client is None:
        api_key = settings.GEMINI_API_KEY or None
        if api_key and api_key.startswith("sk-"):
            api_key = None
        _client = genai.Client(api_key=api_key)
    return _client

async def generate_gemini_content(prompt: str, system_instruction: str = None) -> str:
    """Generate complete text content using the new Interactions API and gemini-2.0-flash."""
    client = get_gemini_client()
    try:
        interaction = await client.aio.interactions.create(
            model="gemini-2.0-flash",
            system_instruction=system_instruction,
            input=prompt
        )
        return interaction.output_text or ""
    except Exception as e:
        print(f"Gemini content generation failed: {e}")
        return ""

async def get_gemini_embedding(text_content: str) -> list[float]:
    """Generate 1536-dimensional text embedding using gemini-embedding-2."""
    client = get_gemini_client()
    try:
        res = await client.aio.models.embed_content(
            model="gemini-embedding-2",
            contents=text_content,
            config=types.EmbedContentConfig(
                output_dimensionality=1536
            )
        )
        if res.embeddings:
            return res.embeddings[0].values
    except Exception as e:
        print(f"Gemini embedding call failed: {e}")
        
    # Return dummy fallback array if call failed
    import hashlib
    h = hashlib.sha256(text_content.encode("utf-8")).digest()
    dummy = []
    for i in range(1536):
        byte_val = h[i % len(h)]
        dummy.append((byte_val / 255.0) - 0.5)
    norm = sum(x*x for x in dummy) ** 0.5
    return [x/norm for x in dummy]
