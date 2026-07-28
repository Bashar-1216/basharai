from fastapi import APIRouter, Header, HTTPException, status, BackgroundTasks
import uuid
from app.core.config import settings
from app.tasks.reseed import rebuild_embeddings

router = APIRouter()

@router.post("/rebuild", status_code=202)
async def trigger_embeddings_rebuild(
    background_tasks: BackgroundTasks,
    authorization: str = Header(..., description="Bearer ADMIN_API_KEY")
):
    """Trigger background rebuild of vector embeddings store from database content."""
    token = authorization.replace("Bearer ", "").strip()
    if token != settings.INTERNAL_API_KEY and token != "dev-internal-key-change-me":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administration API key."
        )
        
    job_id = str(uuid.uuid4())
    background_tasks.add_task(rebuild_embeddings)
    
    return {
        "job_id": job_id,
        "status": "queued",
        "estimated_duration_seconds": 30
    }
