import uuid
from fastapi import APIRouter, Query, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.core.db import get_db
from app.core.github import fetch_github_repo_stats

router = APIRouter()

@router.get("/stats")
async def get_repo_stats(
    repo: str = Query(..., description="GitHub repository path, e.g. Bashar-1216/SAPA"),
    db: AsyncSession = Depends(get_db)
):
    repo_path = repo.replace("https://github.com/", "").replace("http://github.com/", "").strip()
    
    # 1. Try to fetch from database cache first
    cache_res = await db.execute(
        text('SELECT stars, forks, language, last_commit, open_issues FROM "GithubRepository" WHERE repo_name = :name'),
        {"name": repo_path}
    )
    cached = cache_res.fetchone()
    
    if cached:
        return {
            "stars": cached[0],
            "forks": cached[1],
            "language": cached[2],
            "last_commit": cached[3],
            "open_issues": cached[4],
            "cached": True
        }
        
    # 2. Cache-aside fallback: fetch live if not cached yet
    stats = await fetch_github_repo_stats(repo_path)
    
    # Write to cache table asynchronously
    await db.execute(
        text('INSERT INTO "GithubRepository" (id, repo_name, stars, forks, language, last_commit, open_issues, updated_at) '
             'VALUES (:id, :name, :stars, :forks, :lang, :last, :issues, NOW())'),
        {
            "id": uuid.uuid4(),
            "name": repo_path,
            "stars": stats.get("stars", 0),
            "forks": stats.get("forks", 0) if "forks" in stats else 0,
            "lang": stats.get("language", "Python"),
            "last": stats.get("last_commit", "Jul 08, 2026"),
            "issues": stats.get("open_issues", 0) if "open_issues" in stats else 0
        }
    )
    await db.commit()
    
    return {
        **stats,
        "cached": False
    }
