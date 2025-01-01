import logging
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clean Cooking Library"
    DATABASE_URL: str
    OPENAI_API_KEY: Optional[str] = None
    PERPLEXITY_API_KEY: Optional[str] = None
    JWT_SECRET: str
    GOOGLE_SE_API_KEY: str 
    SE_ID: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    CACHE_TIMEOUT: int = 60 * 60 * 24  # 24 hours cache

    class Config:
        env_file = ".env"

settings = Settings()

logger = logging.getLogger(__name__)
logger.info(f"PERPLEXITY_API_KEY configured: {bool(settings.PERPLEXITY_API_KEY)}")
logger.info(f"All settings: {settings.dict()}") 