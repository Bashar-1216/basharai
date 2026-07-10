import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.db import get_db
from app.core.config import settings
from app.core.gemini import generate_gemini_content

router = APIRouter()

class OutreachRequest(BaseModel):
    company_name: str # "Saudi Aramco AI", "Humain", "Mozn", "SAP"
    content_type: str # "linkedin_message", "email_intro", "cover_letter"
    locale: str = "en"

class OutreachResponse(BaseModel):
    message: str

@router.post("/outreach", response_model=OutreachResponse)
async def generate_career_outreach(req: OutreachRequest, db: AsyncSession = Depends(get_db)):
    is_ar = req.locale == "ar"
    
    prompt = (
        f"You are a professional hiring coach preparing recruiter outreach letters for Bashar Almuntaser (AI & ML Engineer).\n"
        f"Target Company: {req.company_name}\n"
        f"Document Type: {req.content_type.replace('_', ' ').title()}\n\n"
        f"Guidelines:\n"
        f"- Cover letters should state alignment with {req.company_name}'s AI/ML vision.\n"
        f"- LinkedIn connection messages must be under 300 characters (including space for greeting).\n"
        f"- Email introductions should have a strong, clear subject line and brief paragraphs detailing accomplishments at Amazon and Grammarly.\n"
        f"- Output the content in {'Arabic' if is_ar else 'English'}.\n"
        f"Output ONLY the final document. Do not include introductory notes or markdown decorators."
    )
    
    gemini_active = settings.GEMINI_API_KEY and not settings.GEMINI_API_KEY.startswith("sk-")
    generated = ""
    
    if gemini_active:
        try:
            generated = await generate_gemini_content(prompt, "You are a professional career content writer.")
        except Exception as e:
            print(f"Career outreach Gemini call failed: {e}")
            
    if not generated:
        # Fallback offline drafts
        if req.content_type == "linkedin_message":
            if is_ar:
                generated = f"مرحباً، يسعدني التواصل معك. أنا بشار المنتصر، مهندس ذكاء اصطناعي ذو خبرة سابقة في RAG ونظم الوكلاء. أتطلب لمناقشة فرص التعاون والنمو في {req.company_name}."
            else:
                generated = f"Hi, I'm Bashar Almuntaser, an AI Engineer specializing in LLM Agents and RAG systems. I'm keen to connect and learn more about the engineering work happening at {req.company_name}."
        elif req.content_type == "email_intro":
            generated = (
                f"Subject: AI/ML Engineering Opportunities - Bashar Almuntaser\n\n"
                f"Dear Recruiting Team,\n\n"
                f"I am writing to express my interest in joining the AI systems division at {req.company_name}. "
                f"Having optimized complex conversational systems previously, I am keen to support your technical roadmaps.\n\n"
                f"Best regards,\n"
                f"Bashar Almuntaser"
            )
        else:
            generated = (
                f"Cover Letter — Bashar Almuntaser\n\n"
                f"Dear Hiring Manager,\n\n"
                f"I am thrilled to submit my application for the AI/ML Engineer position at {req.company_name}. "
                f"My expertise in engineering retrieval-augmented solutions aligns perfectly with your technical team goals."
            )
            
    # Log the generated content draft into database
    try:
        await db.execute(
            text('INSERT INTO "CareerContent" (id, company_name, content_type, generated_text, created_at) '
                 'VALUES (:id, :company, :ctype, :text, NOW())'),
            {
                "id": uuid.uuid4(),
                "company": req.company_name,
                "ctype": req.content_type.upper(),
                "text": generated
            }
        )
        await db.commit()
    except Exception as e:
        print(f"Failed to log career outreach content: {e}")
        
    return OutreachResponse(message=generated)
