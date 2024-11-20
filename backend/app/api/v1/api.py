from fastapi import APIRouter

router = APIRouter()

# Create separate routers for different functionalities
from .endpoints import documents, search, auth

api_router = APIRouter()
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])