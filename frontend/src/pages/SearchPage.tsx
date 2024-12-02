import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SearchBar } from '../components/search/SearchBar';

interface Tag {
  id?: number;
  name: string;
  category: string;
}

interface BaseSearchResult {
  title: string;
  summary: string;
  source_url: string;
  relevance_score: number;
  source: 'internal' | 'external';
}

interface InternalSearchResult extends BaseSearchResult {
  document_id: number;
  tags: Tag[];
}

interface ExternalSearchResult extends BaseSearchResult {}

interface CombinedSearchResponse {
  internal_results: InternalSearchResult[];
  external_results: ExternalSearchResult[];
}

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return null;
      const response = await axios.post<CombinedSearchResponse>(
        'http://localhost:8000/api/v1/search/',
        {
          query: searchQuery,
          limit: 10,
          include_external: true
        }
      );
      return response.data;
    },
    enabled: !!searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderSearchResults = (results: BaseSearchResult[], title: string) => {
    if (!results.length) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
              <p className="text-gray-600 mb-3">{result.summary}</p>
              {/* Add tags if result is internal */}
              {'tags' in result && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {(result as InternalSearchResult).tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-between items-center">
                <a
                  href={result.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  View Source →
                </a>
                <span className="text-sm text-gray-500">
                  Relevance: {(result.relevance_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Clean Cooking Research Search</h1>
      
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
          Error: {error instanceof Error ? error.message : 'An error occurred'}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 text-center text-gray-600">
          Searching...
        </div>
      )}

      {data && (
        <div className="mt-8">
          {renderSearchResults(data.internal_results, 'Internal Library Results')}
          {renderSearchResults(data.external_results, 'External Research Results')}
          
          {!data.internal_results.length && !data.external_results.length && (
            <div className="text-center text-gray-600">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};