from pydantic import BaseModel
from typing import List, Optional
from .tag import Tag
from enum import Enum

class TagCategory(str, Enum):
    REGION = "region"
    TOPIC = "topic"
    TECHNOLOGY = "technology"
    FRAMEWORK = "framework"
    UNKNOWN = "unknown"

class SearchQuery(BaseModel):
    query: str
    region: Optional[str] = None
    topic: Optional[str] = None
    limit: Optional[int] = 10
    
class TagInResponse(BaseModel):
    name: str
    category: Optional[TagCategory] = None
    id: Optional[int] = None

class SearchResult(BaseModel):
    document_id: int
    title: str
    summary: str
    source_url: str
    relevance_score: float
    tags: List[TagInResponse] = []

    class Config:
        from_attributes = True