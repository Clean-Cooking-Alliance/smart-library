# backend/app/models/tag.py
from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.db.base_class import Base
from enum import Enum as PyEnum  # Rename to avoid conflict

class TagCategory(str, PyEnum):
    REGION = "region"
    TOPIC = "topic"
    TECHNOLOGY = "technology"
    FRAMEWORK = "framework"
    COUNTRY = "country"
    PRODUCT_LIFECYCLE = "product_lifecycle"
    CUSTOMER_JOURNEY = "customer_journey"
    UNKNOWN = "unknown"

class Tag(Base):
    __tablename__ = "tag"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, index=True, unique=True)
    category = Column(Enum(TagCategory), nullable=True)  # Made nullable for now
    embedding = Column(Vector, nullable=True)
    
    # Relationships
    documents = relationship(
        "Document",
        secondary="document_tags",
        back_populates="tags"
    )