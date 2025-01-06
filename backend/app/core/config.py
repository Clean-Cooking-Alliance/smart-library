import logging
import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clean Cooking Library"
    DATABASE_URL: str
    SEARCH_ENGINE: str = "google"
    # OPENAI_API_KEY: Optional[str] = None
    PERPLEXITY_API_KEY: Optional[str] = None
    GOOGLE_SE_API_KEY: Optional[str] = None
    AUTOSAVE_DOCS: bool = False
    MIN_RELEVANCE: Optional[float] = 0.5
    SE_ID: Optional[str] = None
    JWT_SECRET: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    CACHE_TIMEOUT: int = 60 * 60 * 24  # 24 hours cache

    class Config:
        env_file = ".env"

logger = logging.getLogger(__name__)
logger.info(f"env var: {os.environ.get('DATABASE_URL')}")

logger.info(f"env var: {os.environ.get('DATABASE_URL')}")
settings = Settings()


logger.info(f"PERPLEXITY_API_KEY configured: {bool(settings.PERPLEXITY_API_KEY)}")
logger.info(f"All settings: {settings.dict()}") 