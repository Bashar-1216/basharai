from typing import Any, Dict
from sqlalchemy import text
from app.core.db import engine

async def get_project_detail(slug: str, locale: str = "en") -> Dict[str, Any]:
    """Fetch full case study, metrics, screenshots, and architecture for a single project by slug."""
    is_ar = locale == "ar"
    
    async with engine.connect() as conn:
        # 1. Project base info
        proj_res = await conn.execute(
            text('SELECT id, slug, title_en, title_ar, description_en, description_ar, github_url, live_url FROM "Project" WHERE slug = :slug'),
            {"slug": slug}
        )
        proj_row = proj_res.fetchone()
        if not proj_row:
            return {"error": "project_not_found", "slug": slug}
            
        proj_id = proj_row[0]
        title = proj_row[3] if is_ar and proj_row[3] else proj_row[2]
        
        # 2. Metrics
        metrics_res = await conn.execute(
            text('SELECT metric_name, metric_value, metric_unit, metric_context FROM "ProjectMetric" WHERE project_id = :pid ORDER BY display_order ASC'),
            {"pid": proj_id}
        )
        metrics = [
            {
                "name": r[0],
                "value": float(r[1]),
                "unit": r[2] or "",
                "context": r[3] or ""
            }
            for r in metrics_res.fetchall()
        ]
        
        # 3. Case study narrative
        cs_res = await conn.execute(
            text('SELECT problem_en, problem_ar, motivation_en, motivation_ar, architecture_desc_en, architecture_desc_ar, architecture_diagram_url, decisions_en, decisions_ar, challenges_en, challenges_ar, lessons_learned_en, lessons_learned_ar FROM "CaseStudy" WHERE project_id = :pid'),
            {"pid": proj_id}
        )
        cs_row = cs_res.fetchone()
        case_study = {}
        if cs_row:
            case_study = {
                "problem": cs_row[1] if is_ar and cs_row[1] else cs_row[0],
                "motivation": cs_row[3] if is_ar and cs_row[3] else cs_row[2],
                "architecture_description": cs_row[5] if is_ar and cs_row[5] else cs_row[4],
                "architecture_diagram_url": cs_row[6],
                "technical_decisions": cs_row[8] if is_ar and cs_row[8] else cs_row[7],
                "challenges": cs_row[10] if is_ar and cs_row[10] else cs_row[9],
                "lessons_learned": cs_row[12] if is_ar and cs_row[12] else cs_row[11]
            }
            
        return {
            "project": {
                "id": str(proj_id),
                "slug": proj_row[1],
                "title": title,
                "github_url": proj_row[6],
                "demo_url": proj_row[7],
                "case_study": case_study,
                "metrics": metrics,
            }
        }
