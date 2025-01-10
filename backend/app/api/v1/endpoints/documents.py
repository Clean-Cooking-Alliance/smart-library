from app.models.document import ResourceType
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy.orm import Session
from typing import List, Optional
from ....schemas import Document, DocumentCreate, DocumentUpdate
from ....crud import crud_document
from ....deps import get_db

from fastapi import Response

router = APIRouter()

@router.get("/", response_model=List[Document])
def get_documents(
    response: Response,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    order: Optional[str] = Query("ASC", regex="^(ASC|DESC)$"),
    sort: Optional[str] = "id",
    region: Optional[str] = None,
    topic: Optional[str] = None,
    year: Optional[int] = None,
    search: Optional[str] = None,
    resource_type: Optional[ResourceType] = None
):
    """
    Retrieve documents with optional filtering.
    
    Examples:
        /api/v1/documents/?region=Uganda
        /api/v1/documents/?topic=Adoption&year=2023
        /api/v1/documents/?search=clean%20cooking
        /api/v1/documents/?region=Uganda&limit=5&skip=10
    """
    try:
        documents = crud_document.get_multi(
            db,
            skip=skip,
            limit=limit,
            order=order,
            sort=sort,
            region=region,
            topic=topic,
            year=year,
            search_term=search,
            resource_type=resource_type
        )
        total_count = crud_document.count(db, region=region, topic=topic, year=year, search_term=search, resource_type=resource_type)
        response.headers["X-Total-Count"] = str(total_count)
        return documents
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving documents: {str(e)}"
        )
        
@router.get("/years", response_model=dict)
def get_year_range(
    db: Session = Depends(get_db)
):
    """Get the range of years available in the documents."""
    min_year, max_year = crud_document.get_years_range(db)
    return {
        "min_year": min_year,
        "max_year": max_year
    }

@router.get("/{document_id}", response_model=Document)
def get_document(
    document_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a specific document by ID.
    """
    document = crud_document.get(db, id=document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    return document

@router.post("/", response_model=Document)
def create_document(
    *,
    db: Session = Depends(get_db),
    document_in: DocumentCreate
):
    """
    Create new document.
    """
    return crud_document.create(db, obj_in=document_in)

@router.put("/{document_id}", response_model=Document)
def update_document(
    *,
    db: Session = Depends(get_db),
    document_id: int,
    document_in: DocumentUpdate
):
    """
    Update a document.
    """
    document = crud_document.get(db, id=document_id)
    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found"
        )
    return crud_document.update(db, db_obj=document, obj_in=document_in)

@router.get("/framework/{framework}", response_model=List[Document])
def get_documents_by_framework(
    framework: str,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Get documents filtered by framework category.
    """
    try:
        # Convert framework path parameter to category
        framework_category = framework.replace('-', '_').upper()
        
        documents = crud_document.get_by_framework(
            db, 
            framework=framework_category,
            skip=skip,
            limit=limit
        )
        return documents
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error retrieving documents: {str(e)}"
        )