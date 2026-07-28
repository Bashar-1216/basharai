"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings, SettingsConfigDict


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

    # ── Gemini ───────────────────────────────────────────────────
    GEMINI_API_KEY: str = ""

    # ── Groq ─────────────────────────────────────────────────────
    GROQ_API_KEY: str = ""

    # ── Security ─────────────────────────────────────────────────
    INTERNAL_API_KEY: str = "dev-internal-key-change-me"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # ── GitHub ────────────────────────────────────────────────────
    GITHUB_TOKEN: str = ""

    # ── Sentry ───────────────────────────────────────────────────
    SENTRY_DSN: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
