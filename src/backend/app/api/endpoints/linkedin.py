import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.db import get_db
from app.core.config import settings
from app.core.llm import generate_text_content, is_groq_active

router = APIRouter()

class LinkedInRequest(BaseModel):
    project_slug: str
    tone: str # "technical", "recruiter", "founder"
    language_code: str # "en", "ar"

class LinkedInResponse(BaseModel):
    draft: str

@router.post("/generate", response_model=LinkedInResponse)
async def generate_linkedin_post(req: LinkedInRequest, db: AsyncSession = Depends(get_db)):
    is_ar = req.language_code == "ar"
    
    # Fetch project details from DB
    proj_res = await db.execute(
        text('SELECT title_en, title_ar, description_en, description_ar, github_url FROM "Project" WHERE slug = :slug'),
        {"slug": req.project_slug}
    )
    proj = proj_res.fetchone()
    if not proj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
        
    title_en, title_ar, desc_en, desc_ar, github_url = proj
    title = title_ar if is_ar else title_en
    description = desc_ar if is_ar else desc_en
    
    tone_instruction = ""
    if req.tone == "technical":
        tone_instruction = (
            "Write in a deep technical engineering tone. Highlight system design, architecture diagrams, latency milestones, and specific algorithms."
        )
    elif req.tone == "recruiter":
        tone_instruction = (
            "Write in a recruiter-friendly tone. Focus on business value, metrics (efficiency gains, costs saved), leadership, and team collaboration."
        )
    else: # founder
        tone_instruction = (
            "Write in a visionary founder style. Talk about problem spaces, user experience impacts, strategic product directions, and future capabilities."
        )
        
    prompt = (
        f"You are a professional technical content writer and career coach.\n"
        f"Draft an engaging, high-converting LinkedIn announcement post celebrating the completion of this project:\n\n"
        f"Project Title: {title}\n"
        f"Details: {description}\n"
        f"GitHub Repo: {github_url or ''}\n\n"
        f"Tone Directive: {tone_instruction}\n\n"
        f"Format requirements:\n"
        f"- Start with a compelling hook sentence.\n"
        f"- List key engineering challenges solved and technical achievements using bullet points.\n"
        f"- List the primary tech stack tags.\n"
        f"- End with an inviting call to action.\n"
        f"- Output the post in the requested language: {'Arabic' if is_ar else 'English'}.\n"
        f"Output ONLY the final drafted post text. Do not include introductory notes or markdown markers."
    )
    
    import os
    gemini_active = bool(settings.GEMINI_API_KEY or os.environ.get("GEMINI_API_KEY"))
    llm_active = is_groq_active() or gemini_active
    draft = ""
    
    if llm_active:
        try:
            draft = await generate_text_content(prompt, "You are a professional LinkedIn post generator.")
        except Exception as e:
            print(f"LinkedIn generator LLM call failed: {e}")
            
    if not draft:
        # Fallback offline draft
        if is_ar:
            draft = (
                f"🚀 سعيد بمشاركة مشروعي الأخير: {title}!\n\n"
                f"الأسلوب المحدد: {req.tone}\n"
                f"التحديات التقنية التي تم حلها:\n"
                f"• {description}\n\n"
                f"💻 التقنيات المستخدمة: Python, PostgreSQL, Next.js\n"
                f"رابط المستودع: {github_url or 'owner@bashar.ai'}\n"
                f"يسعدني تلقي آرائكم وتوصياتكم المهنية! #ذكاء_اصطناعي #برمجة"
            )
        else:
            draft = (
                f"🚀 Excited to announce my latest project: {title}!\n\n"
                f"Tone Mode: {req.tone}\n"
                f"In this project, I solved key technical challenges:\n"
                f"• {description}\n\n"
                f"💻 Tech Stack: Python, PostgreSQL, Next.js\n"
                f"Check out the full repository: {github_url or 'owner@bashar.ai'}\n"
                f"Feedback is highly appreciated! #AIEngineer #MachineLearning"
            )
            
    # Log the generated post draft into PostgreSQL database
    try:
        await db.execute(
            text('INSERT INTO "GeneratedPost" (id, project_slug, tone, language_code, draft_text, created_at) '
                 'VALUES (:id, :slug, :tone, :lang, :draft, NOW())'),
            {
                "id": uuid.uuid4(),
                "slug": req.project_slug,
                "tone": req.tone,
                "lang": req.language_code,
                "draft": draft
            }
        )
        await db.commit()
    except Exception as e:
        print(f"Failed to save generated post: {e}")
        
    return LinkedInResponse(draft=draft)
