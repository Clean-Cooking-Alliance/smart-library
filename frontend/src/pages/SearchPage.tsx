import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SearchBar } from '../components/search/SearchBar';
import CollapsibleSummary from '../components/ui/collapsiblesummary';
import TagFilter from '../components/ui/tagfilter';
import { Badge } from '@/components/ui';
import { SearchResults } from '../components/search/SearchResults';

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
}

interface InternalSearchResult extends BaseSearchResult {
  document_id: number;
  tags: Tag[];
}

interface ExternalSearchResult extends BaseSearchResult { }

interface CombinedSearchResponse {
  internal_results: InternalSearchResult[];
  external_results: ExternalSearchResult[];
}

export const SearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [filterByTag, setFilterByTag] = useState(false);
  const [matchingTag, setMatchingTag] = useState<Tag | null>(null);

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

  useEffect(() => {
    if (data) {
      const allTags = data.internal_results.flatMap(result => result.tags);
      const matchingTag = allTags.find(tag => tag.name.toLowerCase() === searchQuery.toLowerCase());
      setMatchingTag(matchingTag || null);
    }
  }, [data, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilterByTag(false);
  };

  const handleTagChange = (tagId: number) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter((id) => id !== tagId)
        : [...prevSelectedTags, tagId]
    );
  };

  const filterResultsByTags = (results: BaseSearchResult[]) => {
    if (selectedTags.length === 0) return results;
    return results.filter((result) =>
      'tags' in result
        ? (result as InternalSearchResult).tags.some((tag) => selectedTags.includes(tag.id!))
        : false
    );
  };

  const filterResultsByMatchingTag = (results: BaseSearchResult[]) => {
    if (!filterByTag || !matchingTag) return results;
    return results.filter((result) =>
      'tags' in result
        ? (result as InternalSearchResult).tags.some((tag) => tag.id === matchingTag.id)
        : false
    );
  };

  const renderSearchResults = (results: BaseSearchResult[], title: string) => {
    const filteredResults = filterResultsByTags(filterResultsByMatchingTag(results));
    if (!filteredResults.length) return null;

    return (
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          {filteredResults.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
              <CollapsibleSummary summary={result.summary} />
              {'tags' in result && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {(result as InternalSearchResult).tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant={tag.category}
                      className="cursor-pointer"
                    >
                      {tag.name}
                    </Badge>
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

    {matchingTag && (
      <div className="mt-4 flex justify-start items-center">
        <label className="flex items-center space-x-2">
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
            <input
              type="checkbox"
              name="toggle"
              id="toggle"
              checked={filterByTag}
              onChange={() => setFilterByTag(!filterByTag)}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label
              htmlFor="toggle"
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
            ></label>
          </div>
          <span>Filter results by tag:</span>
          <Badge variant={matchingTag.category}>{matchingTag.name}</Badge>
        </label>
      </div>
    )}

      {data && (
        <div className="flex mt-8">
          {data.internal_results.length > 0 && (
            <div className="w-1/4 pr-4">
              <TagFilter
                tags={Array.from(new Set(data.internal_results.flatMap((result) => result.tags.map(tag => tag.id))))
                  .map(id => data.internal_results.flatMap((result) => result.tags).find(tag => tag.id === id)!)}
                selectedTags={selectedTags}
                onTagChange={handleTagChange}
              />
            </div>
          )}
          <div className="w-3/4">
            {renderSearchResults(data.internal_results, 'Internal Library Results')}
            {renderSearchResults(data.external_results, 'External Research Results')}

            {!data.internal_results.length && !data.external_results.length && (
              <div className="text-center text-gray-600">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};