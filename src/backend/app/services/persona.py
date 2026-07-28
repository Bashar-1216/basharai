import json
from app.core.llm import generate_text_content

PERSONA_DETECTION_PROMPT = """
Based on this user message, classify the user persona into exactly one of:
- recruiter: asks about skills, availability, contact, resume, experience level
- engineer: asks about architecture, code, trade-offs, algorithms, latency, technical decisions
- cto: asks about product ownership, business impact, problem-solving approach, scalability
- unknown: general or unclear query

User message: {message}

Return JSON strictly in format:
{{"persona": "recruiter" | "engineer" | "cto" | "unknown"}}
"""

async def detect_persona(message: str) -> str:
    """Classify user persona based on initial message content."""
    try:
        raw = await generate_text_content(
            PERSONA_DETECTION_PROMPT.format(message=message),
            "You are an intent classifier. Return valid JSON only."
        )
        if "{" in raw:
            json_str = raw[raw.find("{"):raw.rfind("}")+1]
            parsed = json.loads(json_str)
            return parsed.get("persona", "unknown")
    except Exception as e:
        print(f"Persona detection error: {e}")
    return "unknown"
