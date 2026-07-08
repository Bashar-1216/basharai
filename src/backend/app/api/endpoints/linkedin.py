from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from openai import AsyncOpenAI

from app.core.db import get_db
from app.core.config import settings

router = APIRouter()

class LinkedInRequest(BaseModel):
    project_slug: str
    locale: str = "en"

class LinkedInResponse(BaseModel):
    draft: str

@router.post("/generate", response_model=LinkedInResponse)
async def generate_linkedin_post(req: LinkedInRequest, db: AsyncSession = Depends(get_db)):
    is_ar = req.locale == "ar"
    
    # Query project details from DB
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
    
    # Construct Prompt
    prompt = (
        f"You are a professional technical content writer and career coach.\n"
        f"Draft an engaging, high-converting LinkedIn announcement post celebrating the completion of this project:\n\n"
        f"Project Title: {title}\n"
        f"Details: {description}\n"
        f"GitHub Repo: {github_url or ''}\n\n"
        f"Format requirements:\n"
        f"- Start with a compelling hook sentence.\n"
        f"- List key engineering challenges solved and technical achievements using bullet points.\n"
        f"- List the primary tech stack tags.\n"
        f"- End with an inviting call to action (encouraging recruiters and peers to read the case study or check the repo).\n"
        f"- Keep the tone professional, humble, yet highly competent.\n"
        f"- Output the post in the requested language: {'Arabic (with professional formatting)' if is_ar else 'English'}.\n"
        f"Output ONLY the final drafted post text. Do not include introductory notes or markdown markers."
    )
    
    client = None
    if settings.OPENAI_API_KEY and not settings.OPENAI_API_KEY.startswith("sk-your-openai"):
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        
    draft = ""
    if client:
        try:
            res = await client.chat.completions.create(
                messages=[{"role": "user", "content": prompt}],
                model="gpt-4o-mini",
                max_tokens=500,
            )
            draft = res.choices[0].message.content or ""
        except Exception as e:
            print(f"LinkedIn generator OpenAI call failed: {e}")
            
    if not draft:
        # Fallback offline draft
        if is_ar:
            draft = (
                f"🚀 سعيد بمشاركة مشروعي الأخير: {title}!\n\n"
                f"خلال هذا العمل، قمت بحل عدة تحديات تقنية هندسية:\n"
                f"• {description}\n\n"
                f"💻 التقنيات المستخدمة: Python, PostgreSQL, Next.js\n\n"
                f"تفاصيل الكود متاحة على GitHub: {github_url or 'owner@bashar.ai'}\n"
                f"أرحب بملاحظاتكم واستفساراتكم المهنية! #برمجة #ذكاء_اصطناعي"
            )
        else:
            draft = (
                f"🚀 Excited to announce my latest project: {title}!\n\n"
                f"In this project, I solved key technical challenges:\n"
                f"• {description}\n\n"
                f"💻 Tech Stack: Python, PostgreSQL, Next.js\n\n"
                f"Check out the full repository here: {github_url or 'owner@bashar.ai'}\n"
                f"Would love to hear your thoughts and feedback! #MachineLearning #AIEngineer"
            )
            
    return LinkedInResponse(draft=draft)
