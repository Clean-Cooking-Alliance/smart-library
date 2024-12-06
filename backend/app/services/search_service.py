# backend/app/services/search_service.py
import logging
import json
import asyncio
from typing import List, Optional, Dict
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import text
from openai import OpenAI
import aiohttp
from cachetools import TTLCache
import numpy as np
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
        """Search internal database using vector similarity."""
        try:
            logger.info("Starting internal search")
            query_embedding = self._get_embedding(query)
            
            # Single query that gets documents AND their tags
            results = db.execute(
                text("""
                    WITH ranked_docs AS (
                        SELECT 
                            d.id,
                            d.title,
                            d.summary,
                            d.source_url,
                            d.year_published,
                            -- Using cosine similarity with correct PostgreSQL syntax
                            1 - (embedding::vector <-> :query_embedding::vector) as similarity,
                            array_agg(DISTINCT jsonb_build_object(
                                'id', t.id,
                                'name', t.name,
                                'category', t.category
                            )) as tags
                        FROM document d
                        LEFT JOIN document_tags dt ON d.id = dt.document_id
                        LEFT JOIN tag t ON dt.tag_id = t.id
                        WHERE d.embedding IS NOT NULL
                        GROUP BY d.id, d.title, d.summary, d.source_url, d.year_published, d.embedding
                        -- Using correct operator for ordering
                        ORDER BY embedding::vector <-> :query_embedding::vector
                        LIMIT :limit
                    )
                    SELECT 
                        id,
                        title,
                        summary,
                        source_url,
                        year_published,
                        similarity,
                        tags
                    FROM ranked_docs
                """),
                {
                    "query_embedding": query_embedding,
                    "limit": limit
                }
            ).fetchall()
            
            # This should not load all the documents and then apply a search, instead the search should get only needed documents
            # documents = db.query(Document).all()
            logger.info(f"Found {len(results)} documents in database: {results}")
            
            scored_documents = []
            for doc in results:
                try:
                    if doc.embedding is None:
                        logger.info("No embedding found for the document, create embedding")
                        metadata_text = self._create_metadata_text(doc)
                        doc.embedding = self._get_embedding(metadata_text)
                        db.add(doc)
                        db.commit()
                        logger.info(f"Generated embedding for document {doc.id}")

                    similarity = self._calculate_similarity(query_embedding, doc.embedding)
                    
                    # Create tag objects
                    tags = [
                        Tag(id=tag.id, name=tag.name, category=TagCategory(tag.category.value if tag.category else "unknown"))
                        for tag in doc.tags
                    ]
                    logger.info("Tags created {tags}")
                    
                    scored_documents.append(SearchResult(
                        document_id=doc.id,
                        title=doc.title,
                        summary=doc.summary or "",
                        source_url=doc.source_url,
                        relevance_score=float(doc.similarity),
                        tags=[
                            Tag(
                                id=tag.id, 
                                name=tag.name, 
                                category=TagCategory(tag.category.value if tag.category else "unknown")
                            ) 
                            for tag in doc.tags
                        ],
                        source="internal"
                    ))
                except Exception as e:
                    logger.error(f"Error processing document {doc.id}: {str(e)}")
                    print(traceback.format_exc())
                    continue

            scored_documents.sort(key=lambda x: x.relevance_score, reverse=True)
            return scored_documents[:limit]

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

                # Create domain-aware query
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
                        timeout=30  # 30 seconds timeout
                    ) as response:
                        if response.status != 200:
                            error_text = await response.text()
                            logger.error(f"Perplexity API error: Status {response.status}, {error_text}")
                            return []

                        data = await response.json()
                        # Log the raw response
                        logger.info(f"Raw Perplexity response: {data}")
                        content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
                        logger.info(f"Content from response: {content}")
                        
                        # Parse the JSON response
                        try:
                            # Extract JSON from markdown and parse it
                            json_content = self._extract_json_from_markdown(content)
                            logger.info(f"Extracted JSON content: {json_content}")
                            
                            # Parse the JSON array directly since it's not wrapped in a 'results' object
                            results = json.loads(json_content)
                            if not isinstance(results, list):
                                results = [results]  # Handle single result case
                            
                            processed_results = []
                            for result in results[:limit]:
                                if any(domain in result['url'].lower() for domain in self.whitelisted_domains):
                                    processed_results.append(ExternalSearchResult(
                                        title=result['title'],
                                        summary=result['summary'],  # Limit summary length
                                        source_url=result['url'],
                                        relevance_score=0.8,  # Default score
                                        source="external"
                                    ))
                            
                            logger.info(f"Found {len(processed_results)} external results")
                            return processed_results

                        except json.JSONDecodeError as e:
                            logger.error(f"JSON parsing error: {e}")
                            logger.error(f"Failed to parse Perplexity response: {str(e)}")
                            return []

                except asyncio.TimeoutError:
                    logger.error("Perplexity API request timed out")
                    return []
                except aiohttp.ClientError as e:
                    logger.error(f"Perplexity API request failed: {str(e)}")
                    return []

        except Exception as e:
            logger.error(f"External search error: {str(e)}")
            return []

    async def _generate_summary(self, query: str, content: str) -> str:
        """Generate context-aware summary using OpenAI."""
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Generate a brief, relevant summary focused on clean cooking research aspects."},
                    {"role": "user", "content": f"For the query '{query}', summarize this content:\n{content}"}
                ],
                max_tokens=150,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Summary generation error: {str(e)}")
            return content[:200] + "..."

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

    def _calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """Calculate cosine similarity between embeddings."""
        logger.info("Calculating Similarity between embeddings")
        try:
            a = np.array(embedding1)
            b = np.array(embedding2)
            return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
        except Exception as e:
            logger.error(f"Error calculating similarity: {str(e)}")
            return 0.0

    def _create_metadata_text(self, doc: Document) -> str:
        """Create searchable text from document metadata."""
        try:
            parts = [
                f"Title: {doc.title}",
                f"Summary: {doc.summary}" if doc.summary else "",
                f"Year: {doc.year_published}" if doc.year_published else "",
                f"Tags: {', '.join(tag.name for tag in doc.tags)}" if doc.tags else ""
            ]
            return " ".join(filter(None, parts))
        except Exception as e:
            logger.error(f"Error creating metadata text: {str(e)}")
            return doc.title  # Fallback to just title if there's an error
        
    def _extract_json_from_markdown(self, content: str) -> str:
        """Extract JSON from markdown-formatted string."""
        try:
            # Find content between ```json and ```
            import re
            json_match = re.search(r'```json\s*([\s\S]*?)\s*```', content)
            if json_match:
                return json_match.group(1).strip()
            return content.strip()
        except Exception as e:
            logger.error(f"Error extracting JSON from markdown: {e}")
            return content.strip()


search_service = SearchService()