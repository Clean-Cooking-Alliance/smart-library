# backend/app/api/v1/endpoints/search.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....schemas import SearchQuery, CombinedSearchResponse
from ....services.search_service import search_service
from ....deps import get_db
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=CombinedSearchResponse)
async def search_documents(
    db: Session = Depends(get_db),
    search_query: SearchQuery = None,
):
    """
    Search documents using natural language query.
    """
    try:
        logger.info(f"Received search request: {search_query}")
        
        if not search_query or not search_query.query:
            raise HTTPException(
                status_code=400,
                detail="Search query is required"
            )

        results = await search_service.search(
            db=db,
            query=search_query.query,
            limit=search_query.limit or 10,
            include_external=search_query.include_external
        )
        
        return results
        
    except Exception as e:
        logger.exception("Search error occurred")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )