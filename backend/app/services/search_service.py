# backend/app/services/search_service.py

import logging
import json
import asyncio
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from openai import OpenAI
import aiohttp
from cachetools import TTLCache
import numpy as np
import faiss
import traceback

from app.core.config import settings
from app.models.document import Document
from app.schemas.search import (
    SearchResult,
    ExternalSearchResult,
    CombinedSearchResponse,
    Tag,
    TagCategory
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.cache = TTLCache(maxsize=100, ttl=3600)
        self.whitelisted_domains = [
            'cleancookingalliance.org',
            'who.int',
            'worldbank.org',
            'seforall.org',
            'mecs.org.uk',
            'sciencedirect.com',
            'mdpi.com'
        ]
        self.perplexity_url = "https://api.perplexity.ai/chat/completions"
        self.index = None
        self.document_map = {}

    def initialize_faiss_index(self, db: Session):
        """Initialize FAISS index with document embeddings from the database."""
        try:
            logger.info("Initializing FAISS index")
            documents = db.query(Document).filter(Document.embedding.isnot(None)).all()
            embeddings = []
            ids = []
            for doc in documents:
                embeddings.append(doc.embedding)
                ids.append(doc.id)
                self.document_map[doc.id] = doc
            
            if embeddings:
                dimension = len(embeddings[0])
                self.index = faiss.IndexFlatL2(dimension)
                self.index.add(np.array(embeddings, dtype=np.float32))
                logger.info(f"Added {len(embeddings)} documents to FAISS index")
            else:
                logger.warning("No document embeddings found in the database")
        except Exception as e:
            logger.error(f"Error initializing FAISS index: {e}")
            logger.error(traceback.format_exc())

    async def search(
        self,
        db: Session,
        query: str,
        limit: int = 10,
        include_external: bool = True
    ) -> CombinedSearchResponse:
        """Perform hybrid search across internal and external sources."""
        try:
            logger.info(f"Starting search for query: {query}")

            # Internal search
            try:
                internal_results = await self._search_internal(db, query, limit)
                logger.info(f"Internal search found {len(internal_results)} results")
            except Exception as e:
                logger.error(f"Internal search error: {str(e)}")
                logger.error(traceback.format_exc())
                internal_results = []

            # External search
            external_results = []
            if include_external:
                try:
                    external_results = await self._search_external(query, limit)
                    logger.info(f"External search found {len(external_results)} results")
                except Exception as e:
                    logger.error(f"External search error: {str(e)}")
                    logger.error(traceback.format_exc())

            return CombinedSearchResponse(
                internal_results=internal_results,
                external_results=external_results
            )

        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    async def _search_internal(
        self,
        db: Session,
        query: str,
        limit: int
    ) -> List[SearchResult]:
        """Search internal database using FAISS."""
        try:
            logger.info("Starting internal search")
            if self.index is None:
                logger.info("FAISS index not initialized. Initializing now.")
                self.initialize_faiss_index(db)

            query_embedding = self._get_embedding(query)

            if self.index is None or self.index.ntotal == 0:
                logger.warning("FAISS index is empty or uninitialized.")
                return []

            # Search FAISS index
            distances, indices = self.index.search(np.array([query_embedding], dtype=np.float32), limit)
            logger.info(f"FAISS search returned {len(indices[0])} results")

            scored_documents = []
            for i, idx in enumerate(indices[0]):
                if idx == -1:
                    continue
                document_id = list(self.document_map.keys())[idx]
                document = self.document_map[document_id]

                # Create tags
                tags = [
                    Tag(
                        id=tag.id,
                        name=tag.name,
                        category=TagCategory(tag.category.value if tag.category else "unknown")
                    ) for tag in document.tags
                ]

                scored_documents.append(SearchResult(
                    document_id=document.id,
                    title=document.title,
                    summary=document.summary or "",
                    source_url=document.source_url,
                    relevance_score=float(1 - distances[0][i]),  # Convert distance to similarity
                    tags=tags,
                    source="internal"
                ))

            print(scored_documents)
            return scored_documents

        except Exception as e:
            logger.error(f"Internal search error: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    async def _search_external(
        self,
        query: str,
        limit: int
    ) -> List[ExternalSearchResult]:
        """Search external sources using Perplexity API."""
        try:
            logger.info(f"Starting external search for query: {query}")
            if not hasattr(settings, 'PERPLEXITY_API_KEY') or not settings.PERPLEXITY_API_KEY:
                logger.warning("Perplexity API key not configured, skipping external search")
                return []
            
            async with aiohttp.ClientSession() as session:
                headers = {
                    "Authorization": f"Bearer {settings.PERPLEXITY_API_KEY}",
                    "Content-Type": "application/json"
                }

                domain_filter = " ".join(f"site:{domain}" for domain in self.whitelisted_domains)
                enhanced_query = (
                    f"Find research papers and articles about: {query}. "
                    f"Only include results from these domains: {domain_filter}. "
                    "Return the results as a JSON array with each item having fields: "
                    "'title' (string), 'url' (string), and 'summary' (string of max 200 words)."
                    "Do not include any markdown formatting or additional explanations."
                )

                payload = {
                    "model": "llama-3.1-sonar-large-128k-online",
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are a research assistant specializing in clean cooking "
                                "research. Only return results from reputable sources and "
                                "format the response as a valid JSON array. Respond with ONLY the requested JSON array, no additional text or formatting."
                            )
                        },
                        {
                            "role": "user",
                            "content": enhanced_query
                        }
                    ],
                    "temperature": 0.1,
                    "max_tokens": 1024
                }

                try:
                    async with session.post(
                        self.perplexity_url,
                        headers=headers,
                        json=payload,
                        timeout=30
                    ) as response:
                        if response.status != 200:
                            error_text = await response.text()
                            logger.error(f"Perplexity API error: Status {response.status}, {error_text}")
                            return []

                        data = await response.json()
                        content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
                        json_content = self._extract_json_from_markdown(content)

                        results = json.loads(json_content)
                        processed_results = []
                        for result in results[:limit]:
                            if any(domain in result['url'].lower() for domain in self.whitelisted_domains):
                                processed_results.append(ExternalSearchResult(
                                    title=result['title'],
                                    summary=result['summary'],
                                    source_url=result['url'],
                                    relevance_score=0.8,
                                    source="external"
                                ))

                        return processed_results

                except asyncio.TimeoutError:
                    logger.error("Perplexity API request timed out")
                    return []
                except aiohttp.ClientError as e:
                    logger.error(f"Perplexity API request failed: {str(e)}")
                    return []

        except Exception as e:
            logger.error(f"External search error: {str(e)}")
            return []

    def _get_embedding(self, text: str) -> List[float]:
        """Get embedding for text using OpenAI."""
        try:
            response = self.client.embeddings.create(
                input=text,
                model="text-embedding-ada-002"
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error getting embedding: {str(e)}")
            raise

    def _extract_json_from_markdown(self, content: str) -> str:
        """Extract JSON from markdown-formatted string."""
        try:
            import re
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```', content)
            if json_match:
                return json_match.group(1).strip()
            return content.strip()
        except Exception as e:
            logger.error(f"Error extracting JSON from markdown: {e}")
            return content.strip()


search_service = SearchService()
