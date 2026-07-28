from typing import Any, Dict, Optional
from sqlalchemy import text
from app.core.db import engine

async def get_github_stats(repo_slug: Optional[str] = None) -> Dict[str, Any]:
    """Fetch cached GitHub repository statistics for portfolio projects."""
    async with engine.connect() as conn:
        if repo_slug:
            res = await conn.execute(
                text('SELECT repo_name, stars, forks, language, last_commit, open_issues, updated_at FROM "GithubRepository" WHERE LOWER(repo_name) LIKE :slug'),
                {"slug": f"%{repo_slug.lower()}%"}
            )
        else:
            res = await conn.execute(
                text('SELECT repo_name, stars, forks, language, last_commit, open_issues, updated_at FROM "GithubRepository" ORDER BY stars DESC')
            )
            
        rows = res.fetchall()
        repos = [
            {
                "repo_full_name": r[0],
                "stars": r[1],
                "forks": r[2],
                "primary_language": r[3],
                "latest_commit_date": r[4],
                "open_issues": r[5],
                "last_synced": r[6].isoformat() if r[6] else None
            }
            for r in rows
        ]
        
    return {"repos": repos}
