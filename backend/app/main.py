# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1.api import api_router
import logging

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

@app.get("/healthcheck")
def read_root():
    logger.info("Health check status check")
    return {"status": "healthy"}

logger.info("Clean cooking library Api deployed")