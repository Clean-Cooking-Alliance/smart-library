from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional, List
from .tag import Tag
from app.models.document import ResourceType

class DocumentBase(BaseModel):
    title: str
    summary: Optional[str] = None
    source_url: str  # URL to the actual research paper
    year_published: Optional[int] = None
    resource_type: Optional[ResourceType]

class DocumentCreate(DocumentBase):
    tags: Optional[List[Tag]] = []  # Tag names to be associated with the document

class DocumentUpdate(DocumentBase):
    title: Optional[str] = None
    tags: Optional[List[Tag]] = None

class Document(DocumentBase):
    id: int
    created_at: datetime
    updated_at: datetime
    tags: List[Tag] = []

    class Config:
        from_attributes = True