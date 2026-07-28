from typing import Any, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.core.db import engine

async def get_projects(
    filter_params: Optional[Dict[str, Any]] = None,
    locale: str = "en"
) -> Dict[str, Any]:
    """Fetch list of all projects with optional filtering by technology or status."""
    is_ar = locale == "ar"
    
    query = """
        SELECT 
            p.id, 
            p.slug, 
            p.title_en, 
            p.title_ar, 
            p.description_en, 
            p.description_ar, 
            p.github_url, 
            p.live_url, 
            p.status,
            pm.metric_name,
            pm.metric_value,
            pm.metric_unit,
            pm.metric_context
        FROM "Project" p
        LEFT JOIN "ProjectMetric" pm ON pm.project_id = p.id AND pm.display_order = 1
        ORDER BY p.published_at DESC
    """
    
    async with engine.connect() as conn:
        result = await conn.execute(text(query))
        rows = result.fetchall()
        
    projects = []
    for row in rows:
        title = row[3] if is_ar and row[3] else row[2]
        desc = row[5] if is_ar and row[5] else row[4]
        
        metric = None
        if row[9] is not None:
            metric = {
                "name": row[9],
                "value": str(row[10]),
                "unit": row[11] or "",
                "context": row[12] or ""
            }
            
        projects.append({
            "id": str(row[0]),
            "slug": row[1],
            "title": title,
            "short_description": desc,
            "github_url": row[6],
            "demo_url": row[7],
            "status": row[8] or "completed",
            "highlight_metric": metric
        })
        
    return {
        "projects": projects,
        "total": len(projects)
    }
