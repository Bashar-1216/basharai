from typing import Any, Dict

INTERVIEW_TOPICS = {
    "general": {
        "en": "Tell me about your architectural decisions when designing the GEO Platform 8-stage pipeline.",
        "ar": "حدثني عن قراراتك المعمارية عند تصميم منصة GEO المكونة من 8 مراحل."
    },
    "arabic_nlp": {
        "en": "Why did you choose CAMeL-BERT over multilingual BERT for Arabic sentiment classification?",
        "ar": "لماذا اخترت نموذج CAMeL-BERT بدلاً من BERT المتعدد اللغات لتصنيف المشاعر العربية؟"
    },
    "llm_systems": {
        "en": "How did you implement hallucination detection and structured output validation in your RAG pipelines?",
        "ar": "كيف قمت بتطوير طبقة كشف الهلوسة والتحقق من المخرجات الهيكلية في خطوط الـ RAG؟"
    },
    "system_design": {
        "en": "How did TimescaleDB hypertables help scale high-frequency Amazon product price tracking in SAPA?",
        "ar": "كيف ساهمت جداول TimescaleDB في تحسين كفاءة تتبع أسعار منتجات أمازون عالية التردد في مشروك SAPA؟"
    }
}

async def run_interview(topic: str = "general", difficulty: str = "recruiter", locale: str = "en") -> Dict[str, Any]:
    """Activate interactive technical interview mode."""
    is_ar = locale == "ar"
    topic_data = INTERVIEW_TOPICS.get(topic, INTERVIEW_TOPICS["general"])
    first_question = topic_data["ar"] if is_ar else topic_data["en"]
    
    return {
        "mode": "interview_active",
        "topic": topic,
        "difficulty": difficulty,
        "first_question": first_question,
        "instructions": "Answer the question technically. The agent will compare your response against ground truth system benchmarks." if not is_ar else "أجب على السؤال تقنياً. سيقوم المساعد بمقارنة إجابتك بالمعايير التقنية الحقيقية للمشروع."
    }
