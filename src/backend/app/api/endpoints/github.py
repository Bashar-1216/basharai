from fastapi import APIRouter, Query, HTTPException, status
from app.core.github import fetch_github_repo_stats

router = APIRouter()

@router.get("/stats")
async def get_repo_stats(repo: str = Query(..., description="GitHub repository path, e.g. Bashar-1216/SAPA")):
    if not repo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Repository parameter is required"
        )
    stats = await fetch_github_repo_stats(repo)
    return stats
