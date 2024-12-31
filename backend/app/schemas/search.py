from pydantic import BaseModel, Field
from typing import List, Optional
#from .tag import Tag
from enum import Enum

class TagCategory(str, Enum):
    REGION = "region"
    TOPIC = "topic"
    TECHNOLOGY = "technology"
    FRAMEWORK = "framework"
    COUNTRY = "country"
    PRODUCT_LIFECYCLE = "product_lifecycle"
    CUSTOMER_JOURNEY = "customer_journey"
    UNKNOWN = "unknown"

class Tag(BaseModel):
    id: Optional[int] = None
    name: str
    category: TagCategory 

class SearchQuery(BaseModel):
    query: str = Field(..., min_length=1)
    limit: Optional[int] = Field(default=10, ge=1, le=50)
    include_external: Optional[bool] = Field(default=True)
    region: Optional[str] = None
    topic: Optional[str] = None

class TagInResponse(BaseModel):
    name: str
    category: Optional[TagCategory] = None
    id: Optional[int] = None

class BaseSearchResult(BaseModel):
    title: str
    summary: str
    source_url: str
    relevance_score: float = Field(ge=0.0, le=1.0)
    source: str

class SearchResult(BaseSearchResult):
    document_id: int
    tags: List[Tag] = []

class ExternalSearchResult(BaseSearchResult):
    tags: List[Tag] = []
    pass

class CombinedSearchResponse(BaseModel):
    internal_results: List[SearchResult] = Field(default_factory=list)
    external_results: List[ExternalSearchResult] = Field(default_factory=list)

# class SearchResult(BaseModel):
#     document_id: int
#     title: str
#     summary: str
#     source_url: str
#     relevance_score: float
#     tags: List[TagInResponse] = []

#     class Config:
#         from_attributes = True