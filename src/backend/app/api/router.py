"""API v1 router — aggregates all endpoint groups."""

from fastapi import APIRouter

from app.api.endpoints import health, chat, github, linkedin, resume, career, projects, embeddings

api_router = APIRouter()

# ── Health Check ─────────────────────────────────────────────────
api_router.include_router(health.router, tags=["Health"])

# ── Chat Assistant ────────────────────────────────────────────────
api_router.include_router(chat.router, tags=["Chat"])

# ── Projects API ──────────────────────────────────────────────────
api_router.include_router(projects.router, prefix="/projects", tags=["Projects"])

# ── Embeddings Maintenance ────────────────────────────────────────
api_router.include_router(embeddings.router, prefix="/embeddings", tags=["Embeddings"])

# ── GitHub Integrations ───────────────────────────────────────────
api_router.include_router(github.router, prefix="/github", tags=["GitHub"])

# ── LinkedIn Integrations ─────────────────────────────────────────
api_router.include_router(linkedin.router, prefix="/linkedin", tags=["LinkedIn"])

# ── Resume Download ───────────────────────────────────────────────
api_router.include_router(resume.router, prefix="/resume", tags=["Resume"])

# ── Career Outreach ───────────────────────────────────────────────
api_router.include_router(career.router, prefix="/career", tags=["Career"])
