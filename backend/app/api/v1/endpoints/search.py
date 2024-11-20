from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ....schemas import SearchQuery, SearchResult
from ....services.search_service import search_service
from ....deps import get_db
import logging

router = APIRouter()

@router.post("/", response_model=List[SearchResult])
async def search_documents(
    *,
    db: Session = Depends(get_db),
    search_query: SearchQuery
):
    """
    Search documents using natural language query with optional filters.
    """
    try:
        logging.info(f"Received search query: {search_query}")
        results = await search_service.search(
            db=db,
            query=search_query.query,
            region=search_query.region,
            topic=search_query.topic,
            limit=search_query.limit or 10
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Search error: {str(e)}"
        )