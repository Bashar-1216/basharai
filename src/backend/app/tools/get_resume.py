from typing import Any, Dict, Optional
from sqlalchemy import text
from app.core.db import engine

async def get_resume(section: Optional[str] = "all", locale: str = "en") -> Dict[str, Any]:
    """Fetch structured resume data including education, experience, and skills."""
    is_ar = locale == "ar"
    
    async with engine.connect() as conn:
        # 1. Education
        edu_res = await conn.execute(
            text('SELECT institution_en, institution_ar, degree_en, degree_ar, field_en, field_ar, start_year, end_year, gpa, highlights_en, highlights_ar FROM "Education" ORDER BY sort_order ASC')
        )
        education = [
            {
                "institution": r[1] if is_ar and r[1] else r[0],
                "degree": r[3] if is_ar and r[3] else r[2],
                "field": r[5] if is_ar and r[5] else r[4],
                "start_year": r[6],
                "end_year": r[7],
                "gpa": r[8],
                "highlights": r[10] if is_ar and r[10] else r[9]
            }
            for r in edu_res.fetchall()
        ]
        
        # 2. Experience
        exp_res = await conn.execute(
            text('SELECT company, title_en, title_ar, start_date, end_date, summary_en, summary_ar, is_current FROM "Experience" ORDER BY start_date DESC')
        )
        experience = [
            {
                "company": r[0],
                "title": r[2] if is_ar and r[2] else r[1],
                "start_date": r[3].strftime("%Y-%m") if r[3] else None,
                "end_date": r[4].strftime("%Y-%m") if r[4] else None,
                "is_current": r[7],
                "description": r[6] if is_ar and r[6] else r[5]
            }
            for r in exp_res.fetchall()
        ]
        
        skills = {
            "ai_ml": ["PyTorch", "LLMs & RAG", "LangChain/LangGraph", "CAMeL-BERT", "OpenCV", "MediaPipe", "LightGBM", "pgvector"],
            "backend": ["FastAPI", "Python 3.11", "PostgreSQL", "Redis", "TimescaleDB", "Apache Kafka", "PySpark", "Docker"],
            "frontend": ["Next.js 16", "React 19", "TypeScript", "Vanilla CSS Modules", "i18n (EN/AR)"],
            "languages": ["Arabic (Native)", "English (Professional)"]
        }
        
    return {
        "education": education,
        "experience": experience,
        "skills": skills
    }
