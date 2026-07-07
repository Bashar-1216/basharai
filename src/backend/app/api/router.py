"""API v1 router — aggregates all endpoint groups."""

from fastapi import APIRouter

from app.api.endpoints import health

api_router = APIRouter()

# ── Health Check ─────────────────────────────────────────────────
api_router.include_router(health.router, tags=["Health"])
