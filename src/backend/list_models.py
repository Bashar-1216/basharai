from google import genai
from app.core.config import settings

api_key = settings.GEMINI_API_KEY or None
client = genai.Client(api_key=api_key)

try:
    for m in client.models.list():
        if "embedContent" in m.supported_actions or "embed_content" in m.supported_actions or "embed" in m.name:
            print(m.name, m.supported_actions)
except Exception as e:
    print("Error listing models:", e)
