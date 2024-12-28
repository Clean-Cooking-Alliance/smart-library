import React from 'react';
import { useSavedDocuments } from '../context/SavedDocumentsContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ExternalLink } from 'lucide-react';

export const SavedDocuments: React.FC = () => {
  const { savedDocuments } = useSavedDocuments();

  return (
    <div className="container mx-auto py-6 px-4 flex-col max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Saved Documents</h1>
      {savedDocuments.length === 0 ? (
        <p>No saved documents.</p>
      ) : (
        <div className="space-y-4">
          {savedDocuments.map((document) => (
            <Card key={document.document_id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{document.title}</span>
                  <a 
                    href={document.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{document.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {document.tags.map((tag) => (
                    <Badge key={tag.id} variant={tag.category}>
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};