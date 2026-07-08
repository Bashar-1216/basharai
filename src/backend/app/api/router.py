"""API v1 router — aggregates all endpoint groups."""

from fastapi import APIRouter

from app.api.endpoints import health, chat, github, linkedin

api_router = APIRouter()

# ── Health Check ─────────────────────────────────────────────────
api_router.include_router(health.router, tags=["Health"])

# ── Chat Assistant ────────────────────────────────────────────────
api_router.include_router(chat.router, tags=["Chat"])

# ── GitHub Integrations ───────────────────────────────────────────
api_router.include_router(github.router, prefix="/github", tags=["GitHub"])

# ── LinkedIn Integrations ─────────────────────────────────────────
api_router.include_router(linkedin.router, prefix="/linkedin", tags=["LinkedIn"])
