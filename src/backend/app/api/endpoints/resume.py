import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.db import get_db

router = APIRouter()

PDF_FILE_PATH = r"C:\Users\Lenovo\Desktop\basharai\BASHAR_ALMUNTASER_FlowCV_Resume_2026-07-08.pdf"

@router.get("/download")
async def download_resume(req: Request, db: AsyncSession = Depends(get_db)):
    if not os.path.exists(PDF_FILE_PATH):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume PDF file not found on server disk"
        )
        
    # Get client IP to record in metrics
    client_ip = req.client.host if req.client else "unknown"
    
    # 1. Log the download metrics into PostgreSQL
    try:
        await db.execute(
            text('INSERT INTO "DownloadMetric" (id, file_name, visitor_ip, created_at) VALUES (:id, :name, :ip, NOW())'),
            {
                "id": uuid.uuid4(),
                "name": "BASHAR_ALMUNTASER_FlowCV_Resume_2026-07-08.pdf",
                "ip": client_ip
            }
        )
        await db.commit()
    except Exception as e:
        print(f"Failed to record download metrics: {e}")
        
    # 2. Serve the PDF file attachment
    return FileResponse(
        path=PDF_FILE_PATH,
        filename="Bashar_Almuntaser_AI_Engineer.pdf",
        media_type="application/pdf"
    )
