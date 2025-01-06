from sqlalchemy import Column, Integer, String, Text, DateTime, ARRAY, Float, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from datetime import datetime
from app.db.base_class import Base
import enum

class ResourceType(enum.Enum):
    ACADEMIC_ARTICLE = "Academic Article"
    NEWS = "News"
    VIDEO = "Video"
    PODCAST = "Podcast"
    JOURNEY_MAP = "Journey Map"
    DISCUSSION_BRIEF = "Discussion Brief"
    STORIES = "Stories"
    WEBINAR = "Webinar"
    CASE_STUDY = "Case Study"
    FACTSHEET = "Factsheet"
    COUNTRY_ACTION_PLAN = "Country Action Plan"
    RESEARCH_REPORT = "Research Report"
    TOOLKIT = "Tool/ Toolkit"
    JOURNAL_ARTICLE = "Journal Article"
    FIELD_RESEARCH = "Field Research"
    MARKET_ASSESSMENTS = "Market Assessments"
    PROGRESS_REPORT = "Progress Report"
    PERSONA = "Persona"
    STRATEGY_DOCUMENT = "Strategy Document"
    POLICY_BRIEF = "Policy Brief"
    BLOG = "Blog"
    
# Association table for document-tag relationship
document_tags = Table(
    'document_tags',
    Base.metadata,
    Column('document_id', Integer, ForeignKey('document.id')),
    Column('tag_id', Integer, ForeignKey('tag.id'))
)

class Document(Base):
    __tablename__ = "document"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, index=True)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    source_url = Column(String)
    year_published = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    embedding = Column(Vector, nullable=True)  # Added this line
    resource_type = Column(Enum(ResourceType), nullable=True)
    
    # Relationships
    tags = relationship("Tag", secondary=document_tags, back_populates="documents")


class WhitelistedDomain(Base):
    __tablename__ = "whitelisted_domain"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    domain = Column(String, unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)