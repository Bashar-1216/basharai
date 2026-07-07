"""Health check endpoint — verifies service readiness."""

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check() -> dict:
    """Return service health status and timestamp.

    Used by Uptime Robot and Railway health probes to verify
    the backend is alive and responsive.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "version": "0.1.0",
    }
