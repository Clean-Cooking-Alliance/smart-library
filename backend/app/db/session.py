from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_size=5,                # Smaller pool size per instance
    max_overflow=10,            # Allow temporary additional connections
    pool_timeout=30,            # Connection timeout in seconds
    pool_recycle=1800          # Recycle connections every 30 minutes
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)