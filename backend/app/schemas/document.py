from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, List
from .tag import Tag

class DocumentBase(BaseModel):
    title: str
    summary: Optional[str] = None
    source_url: str  # URL to the actual research paper
    year_published: Optional[int] = None

class DocumentCreate(DocumentBase):
    tags: Optional[List[str]] = []  # Tag names to be associated with the document

class DocumentUpdate(DocumentBase):
    title: Optional[str] = None
    tags: Optional[List[str]] = None

class Document(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    tags: List[Tag] = []

    class Config:
        from_attributes = True