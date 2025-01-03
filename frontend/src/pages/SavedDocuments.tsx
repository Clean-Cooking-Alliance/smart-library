import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bookmark, ExternalLink } from 'lucide-react';
import CollapsibleSummary from '../components/ui/collapsiblesummary';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocuments } from '../services/api';
import axios from 'axios';

interface Tag {
  id?: number;
  name: string;
  category: 'region' | 'topic' | 'technology' | 'framework' | 'country' | 'unknown';
}

interface BaseSearchResult {
  title: string;
  summary: string;
  source_url: string;
  relevance_score: number;
  source: 'internal' | 'external';
  tags: Tag[];
  resource_type: string;
}

interface InternalSearchResult extends BaseSearchResult {
  document_id: number;
  saved: boolean;
}

export const SavedDocuments: React.FC = () => {
  const { data: documents, isLoading, error } = useQuery(['allDocuments'], () => getDocuments());
  const queryClient = useQueryClient();
  const [savedDocs, setSavedDocs] = useState<InternalSearchResult[]>([]);

  useEffect(() => {
    if (documents) {
      setSavedDocs(documents.filter(doc => doc.saved));
    }
  }, [documents]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading documents</div>;
  }

  const saveDocument = async (document: InternalSearchResult) => {
    try {
      const token = localStorage.getItem('access_token');
      const payload = {
        document_id: document.id,
      };

      const response = await axios.post(
        `http://localhost:8000/api/v1/documents/save`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const newState = response.data.saved;
      document.saved = newState;

      queryClient.invalidateQueries(['allDocuments']);
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 flex-col max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Saved Documents</h1>
      {savedDocs.length === 0 ? (
        <p>No saved documents.</p>
      ) : (
        <div className="space-y-4">
          {savedDocs.map((document) => (
            <Card key={document.document_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{document.title}</span>
                  <Bookmark
                    id="save-button"
                    onClick={() => saveDocument(document)}
                    className={`w-6 h-6 stroke-[#568d43] cursor-pointer hover:fill-[#568d43] ${document.saved ? 'fill-[#568d43]' : ''}`}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CollapsibleSummary summary={document.summary} />
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <Badge key={tag.id} variant={tag.category}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <a 
                    href={document.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};