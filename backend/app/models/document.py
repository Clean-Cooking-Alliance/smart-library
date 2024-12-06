from sqlalchemy import Column, Integer, String, Text, DateTime, ARRAY, Float, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY, FLOAT
from sqlalchemy import Index
from sqlalchemy import text
from datetime import datetime
from app.db.base_class import Base

# Association table for document-tag relationship
document_tags = Table(
    'document_tags',
    Base.metadata,
    Column('document_id', Integer, ForeignKey('document.id')),
    Column('tag_id', Integer, ForeignKey('tag.id'))
)

class Document(Base):
    __tablename__ = "document"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    source_url = Column(String)
    year_published = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    embedding = Column(ARRAY(FLOAT(precision=6)), nullable=True)
    
    __table_args__ = (
        Index(
            'ix_document_embedding',
            'embedding',
            postgresql_using='ivfflat',
            postgresql_with={'lists': 100},
            postgresql_ops={'embedding': 'vector_cosine_ops'}
        ),
    )
        
    # Relationships
    tags = relationship("Tag", secondary=document_tags, back_populates="documents")