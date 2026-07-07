"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Central configuration for the bashar.ai backend."""

    # ── Application ──────────────────────────────────────────────
    APP_NAME: str = "bashar.ai API"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # ── Database ─────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://local_developer:local_secure_password@localhost:5432/bashar_db"

    # ── Redis ────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"

    # ── OpenAI ───────────────────────────────────────────────────
    OPENAI_API_KEY: str = ""

    # ── Security ─────────────────────────────────────────────────
    INTERNAL_API_KEY: str = "dev-internal-key-change-me"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # ── Sentry ───────────────────────────────────────────────────
    SENTRY_DSN: str = ""

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


settings = Settings()
