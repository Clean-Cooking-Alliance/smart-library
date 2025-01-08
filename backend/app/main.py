# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1.api import api_router
import logging
from sqlalchemy.orm import Session
from .db.session import SessionLocal
from .initialize_db import initialize_tags, initialize_user

logger = logging.getLogger(__name__)

app = FastAPI(title="Clean Cooking Library API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def read_root():
    logger.info("Health check status check")
    return {"status": "healthy"}

@app.on_event("startup")
def on_startup():
    db: Session = SessionLocal()
    try:
        initialize_tags(db)
        logger.info("Tags initialized")
        initialize_user(db)
        logger.info("Admin user initialized")
    finally:
        db.close()


logger.info("Clean cooking library Api deployed")