from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.tools.get_projects import get_projects
from app.tools.get_project_detail import get_project_detail

router = APIRouter()

@router.get("")
async def list_projects(
    locale: str = Query("en", description="Language locale: en or ar"),
    category: Optional[str] = Query(None, description="Category filter"),
    status: Optional[str] = Query(None, description="Status filter: completed, active, in_production")
):
    """List all portfolio projects with optional category or status filter."""
    filter_params = {}
    if category:
        filter_params["category"] = category
    if status:
        filter_params["status"] = status
        
    return await get_projects(filter_params=filter_params, locale=locale)

@router.get("/{slug}")
async def get_project_by_slug(
    slug: str,
    locale: str = Query("en", description="Language locale: en or ar")
):
    """Get detailed case study, metrics, screenshots for a project by slug."""
    result = await get_project_detail(slug=slug, locale=locale)
    if "error" in result:
        raise HTTPException(status_code=404, detail=f"Project '{slug}' not found.")
    return result

@router.get("/{slug}/metrics")
async def get_project_metrics(
    slug: str,
    locale: str = Query("en", description="Language locale: en or ar")
):
    """Get all performance metrics for a specific project."""
    result = await get_project_detail(slug=slug, locale=locale)
    if "error" in result:
        raise HTTPException(status_code=404, detail=f"Project '{slug}' not found.")
    return {
        "project_slug": slug,
        "metrics": result["project"]["metrics"]
    }
