import axios from 'axios';
import { SearchQuery } from '../types/api';
import { SearchResult, Document } from '../types/document';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const searchDocuments = async (searchQuery: SearchQuery): Promise<SearchResult[]> => {
    const response = await api.post('/api/v1/search/', searchQuery);
    return response.data;
};

export const getDocuments = async (params?: {
    region?: string;
    topic?: string;
    skip?: number;
    limit?: number;
}): Promise<Document[]> => {
    const response = await api.get('/api/v1/documents/', { params });
    return response.data;
};

export const getDocument = async (id: number): Promise<Document> => {
    const response = await api.get(`/api/v1/documents/${id}`);
    return response.data;
};