from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.crud.base import CRUDBase
from app.models.document import Document
from app.models.tag import Tag, TagCategory
from app.schemas.document import DocumentCreate, DocumentUpdate
from app.services.search_service import search_service 

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def _guess_tag_category(self, tag_name: str) -> TagCategory:
        """Guess the category of a tag based on predefined rules."""
        # Add your regions here
        regions = {"uganda", "kenya", "africa", "asia", "europe"}
        # Add your technologies here
        technologies = {"lpg", "electric", "biomass", "solar"}
        
        tag_lower = tag_name.lower()
        
        if tag_lower in regions:
            return TagCategory.REGION
        elif tag_lower in technologies:
            return TagCategory.TECHNOLOGY
        elif tag_lower in {"adoption", "barriers", "implementation", "research"}:
            return TagCategory.TOPIC
        else:
            return None

    def create(self, db: Session, *, obj_in: DocumentCreate) -> Document:
        """Create a new document with tags and generate embedding."""
        # Create document object from input data
        db_obj = Document(
            title=obj_in.title,
            summary=obj_in.summary,
            source_url=obj_in.source_url,
            year_published=obj_in.year_published
        )

        # Handle tags
        if obj_in.tags:
            tags = []
            for tag_in in obj_in.tags:
                # Get existing tag or create new one
                if not tag_in.name and not tag_in.category:
                    tag = db.query(Tag).filter(Tag.name == tag_in.name).first()
                    if not tag:
                        # Guess category for new tag
                        category = self._guess_tag_category(tag_in.name)
                        tag = Tag(name=tag_in.name, category=category)
                        db.add(tag)
                tags.append(tag)
            db_obj.tags = tags

        # Generate and store embedding
        metadata_text = self._create_metadata_text(db_obj)
        try:
            embedding = search_service._get_embedding(metadata_text)
            db_obj.embedding = embedding
        except Exception as e:
            print(f"Warning: Failed to generate embedding: {str(e)}")
            # Continue without embedding - it can be generated during search

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: Document,
        obj_in: DocumentUpdate
    ) -> Document:
        """Update document and regenerate embedding if needed."""
        # Update basic fields
        update_data = obj_in.model_dump(exclude_unset=True)
        tags_data = update_data.pop('tags', None)
        
        # Update document fields
        for field, value in update_data.items():
            setattr(db_obj, field, value)

        # Update tags if provided
        if tags_data is not None:
            tags = []
            for tag_name in tags_data:
                tag = db.query(Tag).filter(Tag.name == tag_name).first()
                if not tag:
                    category = self._guess_tag_category(tag_name)
                    tag = Tag(name=tag_name, category=category)
                    db.add(tag)
                tags.append(tag)
            db_obj.tags = tags

        # Regenerate embedding since content changed
        metadata_text = self._create_metadata_text(db_obj)
        try:
            embedding = search_service._get_embedding(metadata_text)
            db_obj.embedding = embedding
        except Exception as e:
            print(f"Warning: Failed to regenerate embedding: {str(e)}")

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        region: Optional[str] = None,
        topic: Optional[str] = None,
        year: Optional[int] = None,
        search_term: Optional[str] = None
    ) -> List[Document]:
        """
        Get multiple documents with filters.
        
        Args:
            db: Database session
            skip: Number of records to skip (pagination)
            limit: Maximum number of records to return
            region: Filter by region tag
            topic: Filter by topic tag
            year: Filter by publication year
            search_term: Search in title and summary
        """
        query = db.query(self.model)

        # Apply filters if provided
        if region:
            query = query.join(Document.tags).filter(
                Tag.name == region,
                Tag.category == TagCategory.REGION
            )
        
        if topic:
            query = query.join(Document.tags).filter(
                Tag.name == topic,
                Tag.category == TagCategory.TOPIC
            )

        if year:
            query = query.filter(Document.year_published == year)

        if search_term:
            search_filter = or_(
                Document.title.ilike(f"%{search_term}%"),
                Document.summary.ilike(f"%{search_term}%")
            )
            query = query.filter(search_filter)

        # Apply pagination
        query = query.offset(skip).limit(limit)

        # Make sure we don't get duplicate documents if we joined with tags
        query = query.distinct()

        return query.all()

    def get_years_range(self, db: Session) -> tuple[int, int]:
        """Get the range of years in the documents."""
        result = db.query(
            func.min(Document.year_published),
            func.max(Document.year_published)
        ).first()
        return result[0] or 0, result[1] or 0
    
    def _create_metadata_text(self, doc: Document) -> str:
        """Create a text representation of document metadata for embedding."""
        parts = [
            f"Title: {doc.title}",
            f"Summary: {doc.summary}" if doc.summary else "",
            f"Year: {doc.year_published}" if doc.year_published else "",
            f"Tags: {', '.join(tag.name for tag in doc.tags)}" if doc.tags else ""
        ]
        return " ".join(filter(None, parts))
    
    def get_by_framework(
        self, 
        db: Session, 
        *, 
        framework: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Document]:
        """Get documents by framework category."""
        query = db.query(self.model)
        
        # Filter by framework
        query = query.join(Document.tags).filter(
            Tag.category == framework
        ).distinct()
        
        return query.offset(skip).limit(limit).all()

document = CRUDDocument(Document)