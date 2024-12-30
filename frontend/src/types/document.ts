export interface Tag {
    id: number;
    name: string;
    category: 'region' | 'topic' | 'technology' | 'framework' | 'unknown';
}

export interface Document {
    document_id: number;
    title: string;
    summary: string;
    source_url: string;
    year_published?: number;
    resource_type: 'Academic Article' | 'News' | 'Video' | 'Podcast';
    tags: Tag[];
}

export interface SearchResult extends Document {
    relevance_score: number;
}