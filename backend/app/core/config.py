
from functools import lru_cache
 
from pydantic import AnyUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
 
 
class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")
 
    # --- App ---
    APP_NAME: str = "AI Lead Generation Platform"
    ENVIRONMENT: str = "development"  # development | staging | production
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"
 
    # --- Security ---
    SECRET_KEY: str = "change-me-in-env"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24h
 
    # --- CORS ---
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
 
    # --- Database ---
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@db:5432/leadgen"
    # Non-pooled connection, used only by Alembic migrations (Supabase requires
    # this distinction -- see the pooled vs. direct connection note from Phase 1)
    DIRECT_DATABASE_URL: str = ""
 
    # --- Redis / Celery ---
    REDIS_URL: str = "redis://redis:6379/0"
    CELERY_BROKER_URL: str = "redis://redis:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/2"
 
    # --- External APIs (filled in during Phase 2-4) ---
    GOOGLE_PLACES_API_KEY: str = ""
    HUNTER_IO_API_KEY: str = ""
    PAGESPEED_API_KEY: str = ""

settings = Settings()


