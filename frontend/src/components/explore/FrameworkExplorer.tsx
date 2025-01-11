// src/components/explore/FrameworkExplorer.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CollapsibleSummary from '../ui/collapsiblesummary';

interface Document {
  document_id: number;
  title: string;
  summary: string;
  source_url: string;
  tags: Array<{
    id: number;
    name: string;
    category: string;
  }>;
}

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const FrameworkExplorer: React.FC = () => {
  const { framework } = useParams<{ framework: string }>();
  const navigate = useNavigate();
  const { data: documents, isLoading } = useQuery({
    queryKey: ['framework', framework],
    queryFn: async () => {
      const response = await api.get(`/api/v1/documents/framework/${framework}`);
      return response.data as Document[];
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <button onClick={() => navigate('/explore')} className="mb-4 text-blue-600 hover:underline">
        ← Back
      </button>
      <h1 className="text-2xl font-bold mb-6">
        Exploring by {framework?.replace('-', ' ')}
      </h1>

      <div className="grid grid-cols-1 gap-6">
        {documents?.map((doc) => (
          <Card key={doc.document_id}>
            <CardHeader>
              <CardTitle>{doc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CollapsibleSummary summary={doc.summary} />
              <div className="flex flex-wrap gap-2">
                {doc.tags.map((tag) => (
                  <span 
                    key={tag.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <a 
                href={doc.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 text-blue-600 hover:underline inline-block"
              >
                View Source →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};