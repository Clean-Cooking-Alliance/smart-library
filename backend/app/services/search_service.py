# backend/app/services/search_service.py

import logging
import json
import asyncio
import csv
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from openai import OpenAI
import aiohttp
from cachetools import TTLCache
import numpy as np
import traceback
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from ast import literal_eval

from app.core.config import settings
from app.models.document import Document, WhitelistedDomain
from app.schemas.search import (
    SearchResult,
    ExternalSearchResult,
    CombinedSearchResponse,
    Tag,
    TagCategory
)
from ..crud import crud_document


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SearchService:
    def __init__(self, csv_file_path: Optional[str] = None):
        self.cache = TTLCache(maxsize=100, ttl=3600)
        # self.whitelisted_domains = [
        #     'cleancookingalliance.org',
        #     'who.int',
        #     'worldbank.org',
        #     'seforall.org',
        #     'mecs.org.uk',
        #     'sciencedirect.com',
        #     'mdpi.com'
        # ]
        self.whitelisted_domains = None
        self.perplexity_url = "https://api.perplexity.ai/chat/completions"
        self.index = None
        self.document_map = {}
        self.csv_file_path = csv_file_path
        self.regions = set()
        self.technologies = set()
        self.topics = set()
        self.countries = set()
        self.product_lifecycles = set()
        self.customer_journies = set()
        self.resource_types = set()
        self.regions_embeddings = {}
        self.technologies_embeddings = {}
        self.topics_embeddings = {}
        self.countries_embeddings = {}
        self.product_lifecycles_embeddings = {}
        self.customer_journies_embeddings = {}
        self.resource_types_embeddings = {}
        self._load_data_from_csv()
    
    def _load_data_from_csv(self):
        with open(self.csv_file_path, mode='r', encoding='utf-8-sig') as csvfile:
            reader = csv.DictReader(csvfile)
            # print(reader.fieldnames)
            for row in reader:
                # print(row)
                if row['Region']:
                    self.regions.add(row['Region'])
                    self.regions_embeddings[row['Region']] = literal_eval(row['Region_embedding'])
                if row['Country']:
                    self.countries.add(row['Country'])
                    self.countries_embeddings[row['Country']] = literal_eval(row['Country_embedding'])
                if row['Topic']:
                    self.topics.add(row['Topic'])
                    self.topics_embeddings[row['Topic']] = literal_eval(row['Topic_embedding'])
                if row['Technology']:
                    self.technologies.add(row['Technology'])
                    self.technologies_embeddings[row['Technology']] = literal_eval(row['Technology_embedding'])
                if row['Product Lifecycle']:
                    self.product_lifecycles.add(row['Product Lifecycle'])
                    self.product_lifecycles_embeddings[row['Product Lifecycle']] = literal_eval(row['Product Lifecycle_embedding'])
                if row['Customer Journey']:
                    self.customer_journies.add(row['Customer Journey'])
                    self.customer_journies_embeddings[row['Customer Journey']] = literal_eval(row['Customer Journey_embedding'])
                if row['Type of Resource']:
                    self.resource_types.add(row['Type of Resource'])
                    self.resource_types_embeddings[row['Type of Resource']] = literal_eval(row['Type of Resource_embedding'])
            logger.info("Loaded data from CSV") 
            # print(self.regions)
            # print(self.countries)
            # print(self.topics)
            # print(self.technologies)
            # print(self.product_lifecycles)
            # print(self.customer_journies)
            # print(self.resource_types)
            
    def initialize_faiss_index(self, db: Session):
        """Initialize FAISS index with document embeddings from the database."""
        try:
            logger.info("Initializing FAISS index")
            documents = db.query(Document).filter(Document.embedding.isnot(None)).all()
            embeddings = []
            ids = []
            for doc in documents:
                # Regenerate embedding if needed
                if not doc.embedding:
                    doc.embedding = self._get_embedding(self._create_metadata_text(doc))
                    db.add(doc)
                    db.commit()
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
            self.whitelisted_domains = [domain.domain for domain in db.query(WhitelistedDomain).all()]
            # print(self.whitelisted_domains)
            
            logger.info(f"Starting search for query: {query}")

            # Internal search
            try:
                internal_results = await self._search_internal(db, query, limit)
                logger.info(f"Internal search found {len(internal_results)} results")
            except Exception as e:
                logger.error(f"Internal search error: {str(e)}")
                internal_results = []
                
            urls = [result.source_url for result in internal_results]

            # External search
            external_results = []
            if include_external:
                try:
                    external_results = await self._search_external(query, limit)
                    logger.info(f"External search found {len(external_results)} results")
                except Exception as e:
                    logger.error(f"External search error: {str(e)}")
            
            # Remove duplicate results
            for result in external_results:
                if result.source_url in urls:
                    external_results.remove(result)

            return CombinedSearchResponse(
                internal_results=internal_results,
                external_results=external_results
            )

        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            raise

    async def _search_internal(
        self,
        db: Session,
        query: str,
        limit: int
    ) -> List[SearchResult]:
        """Search internal database using FAISS with tags included."""
        try:
            logger.info("Starting internal search")

            query_embedding = self._get_embedding(query)
            query_results =  crud_document.document.get_by_text_embedding(db, query_embedding=query_embedding, limit=limit)
            scored_documents = []
            for (document, relevance_score) in query_results:
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
                    relevance_score=float(f"{1-relevance_score:.2f}"),  # Convert distance to similarity
                    tags=tags,
                    source="internal"
                ))

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
        
        regions = {"Uganda", "Kenya", "Africa", "Asia", "Europe"}
        # Add your technologies here
        technologies = {"LPG", "Electric", "Biomass", "Solar"}
        topics = {"Adoption", "Barriers", "Implementation", "Research"}
        """Search external sources using Perplexity API."""
        try:
            logger.info(f"Starting external search for query: {query}")
            if settings.SEARCH_ENGINE.lower() == "perplexity":
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
                #logger.info(f"Request Payload size:", {len(json.dumps(payload).encode('utf-8'))}, "bytes")

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
                        #logger.info(f"Response Payload size:", {len(json.dumps(data).encode('utf-8'))}, "bytes")
                        content = data.get('choices', [{}])[0].get('message', {}).get('content', '')
                        json_content = self._extract_json_from_markdown(content)

                        results = json.loads(json_content)
                        print(results)
                        processed_results = []

                            for result in results[:limit]:
    
                            # if any(domain in result['url'].lower() for domain in self.whitelisted_domains):
                                    summary_vec = self._get_embedding(result['summary'])
                                tags = []
                                    for tag in self.regions:
                                        if self._calculate_distance(summary_vec, self.regions_embeddings[tag]) >= 0.8:
                                            tags.append(Tag(name=tag, category='region'))
                                    for tag in self.technologies:
                                        if self._calculate_distance(summary_vec, self.technologies_embeddings[tag]) >= 0.8:
                                            tags.append(Tag(name=tag, category='technology'))
                                    for tag in self.topics:
                                        if self._calculate_distance(summary_vec, self.topics_embeddings[tag]) >= 0.8:
                                            tags.append(Tag(name=tag, category='topic'))
                                    for tag in self.countries:
                                        if self._calculate_distance(summary_vec, self.countries_embeddings[tag]) >= 0.8:
                                            tags.append(Tag(name=tag, category='country'))
                                    for tag in self.product_lifecycles:
                                        if self._calculate_distance(summary_vec, self.product_lifecycles_embeddings[tag]) >= 0.8:
                                            tags.append(Tag(name=tag, category='product_lifecycle'))
                                    for tag in self.customer_journies:
                                        if self._calculate_distance(summary_vec, self.customer_journies_embeddings[tag]) >= 0.8:
                                            tags.append(Tag(name=tag, category='customer_journey'))
                                    # for tag in self.resource_types:
                                    #     if self._calculate_distance(result['summary'], tag) >= 0.7:
                                    #         tags.append(Tag(name=tag, category='topic'))
                                    
                                    if hasattr(settings, 'AUTOSAVE_DOCS') and settings.AUTOSAVE_DOCS and hasattr(settings, 'MIN_RELEVANCE') and self._calculate_relevance_score(result['url']) >= settings.MIN_RELEVANCE:
                                        document = Document(
                                            title=result['title'],
                                            summary=result['summary'],
                                            source_url=result['url'],
                                            created_at=datetime.now(),
                                            updated_at=datetime.now(),
                                            tags=tags
                                        )
                                        db = Session()
                                        db.add(document)
                                        db.commit()
                                        db.refresh(document)
                                        logger.info(f"Added document {document.title} to internal database.")
                                        
                                    processed_results.append(ExternalSearchResult(
                                        title=result['title'],
                                        summary=result['summary'],
                                        source_url=result['url'],
                                        relevance_score=self._calculate_relevance_score(result['url']),
                                        source="external",
                                        tags=tags
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
        
    def _calculate_relevance_score(self, url: str) -> float:
        """Calculate relevance score based on domain presence in whitelist and content quality."""
        domain = url.lower()
        
        # High credibility domains
        trusted_domains = ['who.int', 'nasa.gov', 'acm.org', 'edu']
        if any(trusted_domain in domain for trusted_domain in trusted_domains):
            return 0.9  # High trust score for highly credible sources
        
        # Moderate credibility domains
        moderate_domains = ['sciencedirect.com', 'researchgate.net', 'jstor.org'] + self.whitelisted_domains
        if any(moderate_domain in domain for moderate_domain in moderate_domains):
            return 0.7  # Moderate trust score for reputable research and academic sources
        
        # Lower credibility domains
        general_domains = ['medium.com', 'wordpress.com', 'blogspot.com']
        if any(general_domain in domain for general_domain in general_domains):
            return 0.5  # Default score for general blogging and less formal platforms
        
        # If none of the above, assign the default score
        return 0.5  # Base score for other domains not specifically categorized

    def _get_embedding(self, text: str) -> List[float]:
        try:
            model = SentenceTransformer('thenlper/gte-small')
            embedding =  model.encode(text)
            embedding_list = [float(value) for value in embedding] 
            return embedding_list
        except Exception as e:
            logger.error(f"Error getting embedding: {str(e)}")
            raise

    def _calculate_distance(self, summary, tag):
        return cosine_similarity([summary], [tag])[0][0]

    def _create_metadata_text(self, document: Document) -> str:
        """Create a text representation of document metadata for embedding."""
        parts = [
            f"Title: {document.title}",
            f"Summary: {document.summary}" if document.summary else "",
            f"Tags: {', '.join(tag.name for tag in document.tags)}" if document.tags else ""
        ]
        return " ".join(filter(None, parts))
      
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


search_service = SearchService('app/explore.csv')