// src/pages/SearchPage.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar } from '../components/search/SearchBar';
import axios from 'axios';

interface SearchResult {
  document_id: number;
  title: string;
  summary: string;
  source_url: string;
  relevance_score: number;
  tags: Array<{
    id: number;
    name: string;
    category: string;
  }>;
}

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const { data: results, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      try {
        const response = await axios.post('http://localhost:8000/api/v1/search/', 
          {
            query: searchQuery,
            limit: 10
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        console.log('Search response:', response.data);  // Debug log
        return response.data as SearchResult[];
      } catch (error) {
        console.error('Search error:', error);  // Debug log
        throw error;
      }
    },
    enabled: !!searchQuery,
    retry: 1,
    staleTime: 30000, // Consider results fresh for 30 seconds
  });

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    setSearchQuery(query);
  };

  React.useEffect(() => {
    if (error) {
      console.error('Search error:', error);
    }
  }, [error]);

  return (
    <div className="max-w-4xl mx-auto">
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      
      {/* Error state */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded">
          Error: {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="mt-4 text-center">
          Searching...
        </div>
      )}

      {/* Results */}
      {results && results.length > 0 && (
        <div className="mt-4 space-y-4">
          {results.map((result) => (
            <div key={result.document_id} className="p-4 border rounded bg-white">
              <h3 className="text-lg font-semibold">{result.title}</h3>
              <p className="mt-2 text-gray-600">{result.summary}</p>
              <div className="mt-2 flex gap-2">
                {result.tags.map((tag) => (
                  <span 
                    key={tag.id} 
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
              <a 
                href={result.source_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                View Source
              </a>
            </div>
          ))}
        </div>
      )}

      {/* No results state */}
      {results && results.length === 0 && searchQuery && !isLoading && (
        <div className="mt-4 text-center text-gray-600">
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  );
};