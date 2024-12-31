export interface Tag {
    id: number;
    name: string;
    category: 'region' | 'topic' | 'technology' | 'framework' | 'country' | 'product_lifecycle' | 'customer_journey' | 'unknown';
}

export interface Document {
    document_id: number;
    title: string;
    summary: string;
    source_url: string;
    year_published?: number;
    resource_type: "Academic Article" | "News" | "Video" | "Podcast" | "Journey Map" | "Discussion Brief" | "Stories" | "Webinar" | "Case Study" | "Factsheet" | "Country Action Plan" | "Research Report" | "Tool/ Toolkit" | "Journal Article" | "Field Research" | "Market Assessments" | "Progress Report" | "Persona" | "Strategy Document" | "Policy Brief"
    tags: Tag[];
}

export interface SearchResult extends Document {
    relevance_score: number;
}