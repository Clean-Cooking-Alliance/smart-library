import React from 'react';
import { SearchResult } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { ExternalLink } from 'lucide-react';
import { useSavedDocuments } from '../../context/SavedDocumentsContext';

interface SearchResultsProps {
    results: SearchResult[];
    isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
    const { saveDocument } = useSavedDocuments();

    if (isLoading) {
        return <div className="text-center py-8">Searching...</div>;
    }

    if (!results.length) {
        return <div className="text-center py-8">No results found</div>;
    }

    return (
        <div className="space-y-4">
            {results.map((result) => (
                <Card key={result.document_id}>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{result.title}</span>
                            <a 
                                href={result.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">{result.summary}</p>
                        <div className="flex flex-wrap gap-2">
                            {result.tags.map((tag) => (
                                <Badge key={tag.id} variant={tag.category}>
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                        <button
                            onClick={() => saveDocument(result)}
                            className="mt-4 text-blue-600 hover:underline"
                        >
                            Save Document
                        </button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};