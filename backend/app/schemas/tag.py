from pydantic import BaseModel
from typing import Optional
from enum import Enum

class TagCategory(str, Enum):
    REGION = "region"
    TOPIC = "topic"
    TECHNOLOGY = "technology"
    FRAMEWORK = "framework"
    UNKNOWN = "unknown"  # Default category

class TagBase(BaseModel):
    name: str
    category: Optional[TagCategory] = TagCategory.UNKNOWN

class TagCreate(TagBase):
    pass

class TagUpdate(TagBase):
    name: Optional[str] = None
    category: Optional[TagCategory] = None

class Tag(TagBase):
    id: int

    class Config:
        from_attributes = True