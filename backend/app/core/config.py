import logging
import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clean Cooking Library"
    
    # database setup variables
    DB_HOST: str
    DB_PORT: Optional[str] = "5432"
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: Optional[str] = "cleandb"

    # search engine setup variables
    INCLUDE_EXTERNAL: bool = False
    SEARCH_ENGINE: str = "perplexity"
    # OPENAI_API_KEY: Optional[str] = None
    PERPLEXITY_API_KEY: Optional[str] = None
    GOOGLE_SE_API_KEY: Optional[str] = None
    SE_ID: Optional[str] = None    
    
    # autosaving docs setup variables
    VITE_AUTOSAVE_DOCS: bool = False
    MIN_RELEVANCE: Optional[float] = 0.5
    
    JWT_SECRET: Optional[str] = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    CACHE_TIMEOUT: int = 60 * 60 * 24  # 24 hours cache

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    class Config:
        env_file = ".env"

logger = logging.getLogger(__name__)
logger.info(f"env var: {os.environ.get('DATABASE_URL')}")

logger.info(f"env var: {os.environ.get('DATABASE_URL')}")
settings = Settings()


logger.info(f"PERPLEXITY_API_KEY configured: {bool(settings.PERPLEXITY_API_KEY)}")
logger.info(f"All settings: {settings.dict()}") 
