# backend/app/models/tag.py
from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import enum

class TagCategory(str, enum.Enum):
    REGION = "region"
    TOPIC = "topic"
    TECHNOLOGY = "technology"
    FRAMEWORK = "framework"
    UNKNOWN = "unknown"

class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    category = Column(Enum(TagCategory), nullable=True)  # Made nullable for now
    
    # Relationships
    documents = relationship(
        "Document",
        secondary="document_tags",
        back_populates="tags"
    )