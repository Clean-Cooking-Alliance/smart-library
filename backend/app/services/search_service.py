# backend/app/services/search_service.py
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from openai import OpenAI
from app.core.config import settings
from app.models.document import Document
from app.schemas.search import SearchResult
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)

    async def search(
        self,
        db: Session,
        query: str,
        region: Optional[str] = None,
        topic: Optional[str] = None,
        limit: int = 10
    ) -> List[SearchResult]:
        try:
            logger.info(f"Processing search query: {query}")
            # Get query embedding
            query_embedding = self._get_embedding(query)

            # Get documents with filters
            query = db.query(Document)
            
            if region or topic:
                if region:
                    query = query.filter(Document.tags.any(name=region))
                if topic:
                    query = query.filter(Document.tags.any(name=topic))

            documents = query.all()
            print(f"Found {len(documents)} documents")  # Debug print

            scored_documents: List[Dict] = []
            for doc in documents:
                try:
                    # Generate embedding if missing
                    if doc.embedding is None:
                        print(f"Generating embedding for document: {doc.title}")
                        metadata_text = self._create_metadata_text(doc)
                        doc.embedding = self._get_embedding(metadata_text)
                        db.add(doc)
                        db.commit()
                        print(f"Generated embedding for document: {doc.title}")

                    # Calculate similarity using the document's embedding
                    similarity = self._calculate_similarity(query_embedding, doc.embedding)
                    print(f"Calculated similarity for {doc.title}: {similarity}")  # Debug print

                    # Create tag info with IDs
                    tags_info = [
                        {
                            'id': tag.id,
                            'name': tag.name,
                            'category': tag.category
                        } for tag in doc.tags
                    ]

                    scored_documents.append({
                        'document_id': doc.id,
                        'title': doc.title,
                        'summary': doc.summary or "",
                        'source_url': doc.source_url,
                        'relevance_score': float(similarity),
                        'tags': tags_info
                    })
                except Exception as doc_error:
                    print(f"Error processing document {doc.id}: {str(doc_error)}")
                    continue

            # Sort by relevance and limit results
            scored_documents.sort(key=lambda x: x['relevance_score'], reverse=True)
            return scored_documents[:limit]
            
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            print(f"Search error details: {str(e)}")
            raise

    def _create_metadata_text(self, doc: Document) -> str:
        """Create a text representation of document metadata for embedding."""
        parts = [
            f"Title: {doc.title}",
            f"Summary: {doc.summary}" if doc.summary else "",
            f"Year: {doc.year_published}" if doc.year_published else "",
            f"Tags: {', '.join(tag.name for tag in doc.tags)}" if doc.tags else ""
        ]
        return " ".join(filter(None, parts))

    def _calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between two embeddings."""
        if embedding1 is None or embedding2 is None:
            return 0.0
        a = np.array(embedding1)
        b = np.array(embedding2)
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

    def _get_embedding(self, text: str) -> List[float]:
        """Convert text to embedding vector using OpenAI."""
        response = self.client.embeddings.create(
            input=text,
            model="text-embedding-ada-002"
        )
        return response.data[0].embedding

    async def _generate_summary(self, query: str, content: str) -> str:
        """Generate context-aware summary using OpenAI."""
        prompt = f"""Given the search query: "{query}"
        Please provide a relevant summary of the following content:
        {content}
        Focus on information that is most relevant to the query.
        Summary:"""

        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides concise, relevant summaries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.3,
        )
        return response.choices[0].message.content.strip()

search_service = SearchService()