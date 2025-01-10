import logging
from typing import List, Optional, Dict
from app.crud import crud_tag, crud_document
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.crud.base import CRUDBase
from app.models.document import Document, ResourceType
from app.models.tag import Tag, TagCategory
from app.schemas.document import DocumentCreate, DocumentUpdate
from app.services.search_service import search_service
from sqlalchemy.sql import func
from sqlalchemy.sql import text

from sqlalchemy.exc import IntegrityError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CRUDDocument(CRUDBase[Document, DocumentCreate, DocumentUpdate]):
    def _guess_tag_category(self, tag_name: str) -> TagCategory:
        """Guess the category of a tag based on predefined rules."""
        regions = {'Sub-Saharan Africa', 'North America', 'Latin America and Caribbean', 'South Asia', 'Europe', 'Global', 'East Asia and Pacific'}
        technologies = {'Ethanol', 'Pellets & Gasifier Stoves', 'Briquette Type Fuels', 'Improved Biomass Stoves', 'LPG', 'Biodigesters', 'Electric cooking'}
        topics = {'Adoption', 'Livelihoods', 'Monitoring and Evaluation', 'Testing (actual testing of technologies/stoves/fuels)', 'Consumer Finance', 'Consumer Segmentation', 'Fuels', 'Standards', 'Carbon Finance'}
        product_lifecycles = {'Maturity', 'Introduction', 'Decline', 'Growth'}
        customer_journies = {'End of life', 'First Use', 'Consideration', 'Advocacy/Referral', 'Intention', 'Awareness', 'Acquisition', 'User Experience', 'Post-Purchase Support'}
        tag_title = tag_name.title()
        
        if tag_title in regions:
            return TagCategory.REGION
        elif tag_title in technologies:
            return TagCategory.TECHNOLOGY
        elif tag_title in topics:
            return TagCategory.TOPIC
        elif tag_title in product_lifecycles:
            return TagCategory.PRODUCT_LIFECYCLE
        elif tag_title in customer_journies:
            return TagCategory.CUSTOMER_JOURNEY
        else:
            return None

    # def create(self, db: Session, *, obj_in: DocumentCreate) -> Document:
    #     """Create a new document with tags and generate embedding."""
    #     # Create document object from input data
    #     logger.info(f"The obj_in for document create: {obj_in}")
    #     db_obj = Document(
    #         title=obj_in.title,
    #         summary=obj_in.summary,
    #         source_url=obj_in.source_url,
    #         year_published=obj_in.year_published,
    #         resource_type=obj_in.resource_type,  # Add resource_type
    #     )

    #     # Handle tags
    #     if obj_in.tags:
    #         tags = []
    #         for tag_in in obj_in.tags:
    #             # Get existing tag or create new one
    #             if tag_in.name and tag_in.category:
    #                 tag = db.query(Tag).filter(Tag.name == tag_in.name, Tag.category == tag_in.category).first()
    #                 if not tag:
    #                     # Guess category for new tag
    #                     # category = self._guess_tag_category(tag_in.name)
    #                     tag = Tag(name=tag_in.name, category=tag_in.category)
    #                     logger.info(f"Creating new Tag: {tag}")            
    #                     db.add(tag)
    #                 tags.append(tag)
    #         logger.info(f"The tags that are created: {tags}")
    #         db_obj.tags = tags

    #     # Generate and store embedding
    #     metadata_text = self._create_metadata_text(db_obj)
    #     try:
    #         embedding = search_service._get_embedding(metadata_text)
    #         db_obj.embedding = embedding
    #     except Exception as e:
    #         print(f"Warning: Failed to generate embedding: {str(e)}")
    #         # Continue without embedding - it can be generated during search

    #     db.add(db_obj)
    #     db.commit()
    #     db.refresh(db_obj)
    #     return db_obj

    def create(self, db: Session, *, obj_in: DocumentCreate) -> Document:
        """Create a new document with tags and generate embedding."""
        logger.info(f"The obj_in for document create: {obj_in}")
        existing_doc = self.get_by_title(db, title=obj_in.title)
        if not existing_doc:
            db_obj = Document(
                title=obj_in.title,
                summary=obj_in.summary,
                source_url=obj_in.source_url,
                year_published=obj_in.year_published,
                resource_type=obj_in.resource_type,  # Add resource_type
            )

            # Handle tags
            if obj_in.tags:
                tags = []
                new_tags = []
                for tag_in in obj_in.tags:
                    existing_tag = crud_tag.tag.get_by_name(db, name=tag_in.name)
                    if existing_tag:
                        tags.append(existing_tag)
                    else:
                        if tag_in.name:
                            new_tags.append(tag_in)

                # Batch process new tags
                if new_tags:
                    tag_names = [tag.name for tag in new_tags]
                    embeddings = [search_service._get_embedding(tag_name) for tag_name in tag_names]
                    for tag_in, embedding in zip(new_tags, embeddings):
                        # logger.info(f"Generated embedding for tag '{tag_in.name}': {embedding}")
                        try:
                            if tag_in.name:
                                new_tag = Tag(name=tag_in.name, category=tag_in.category, embedding=embedding)
                                db.add(new_tag)
                                db.commit()
                                tags.append(new_tag)
                        except IntegrityError:
                            db.rollback()
                            existing_tag = crud_tag.tag.get_by_name(db, name=tag_in.name)
                            if existing_tag:
                                tags.append(existing_tag)

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
        search_term: Optional[str] = None,
        resource_type: Optional[ResourceType] = None
    ) -> List[Document]:
        query = db.query(self.model)

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

        if resource_type:
            query = query.filter(Document.resource_type == resource_type)

        query = query.offset(skip).limit(limit).distinct()

        return query.all()

    def get_years_range(self, db: Session) -> tuple[int, int]:
        """Get the range of years in the documents."""
        result = db.query(
            func.min(Document.year_published),
            func.max(Document.year_published)
        ).first()
        return result[0] or 0, result[1] or 0
    
    def get_by_title(self, db: Session, *, title: str) -> Optional[Document]:
        """Retrieve a document by its title."""
        return db.query(Document).filter(Document.title == title).first()
    
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
    
    def get_by_text_embedding(
        self,
        db: Session,
        *,
        query_embedding,
        skip: int = 0,
        limit: int = 10,

    ):
        query = (
            db.query(
                self.model,
                func.cosine_distance(self.model.embedding, text(f"'{query_embedding}'::vector")).label('relevance_score')
            )
            .join(Document.tags)
            .order_by(
                func.cosine_distance(self.model.embedding, text(f"'{query_embedding}'::vector"))
            )
            .offset(skip)
            .limit(limit)
        )

        results = query.all()
        return results

document = CRUDDocument(Document)