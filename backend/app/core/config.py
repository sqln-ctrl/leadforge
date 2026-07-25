from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./database.db"
    SECRET_KEY: str = "change-this-secret"
    REDIS_URL: str = "redis://localhost:6379"


    class Config:
        env_file = ".env"


def get_settings():
    return Settings()