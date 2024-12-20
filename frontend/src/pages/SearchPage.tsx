import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SearchBar } from '../components/search/SearchBar';
import CollapsibleSummary from '../components/ui/collapsiblesummary';
import TagFilter from '../components/ui/tagfilter';
import { Badge } from '@/components/ui';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { ReactFlow } from '@xyflow/react';

import '@xyflow/react/dist/style.css';

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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<number[]>([]);

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

  const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

  const MapChart = () => {
    return (
      <div style={{ width: "100%", height: "auto" }}> {/* Use CSS to control the size */}
        <ComposableMap>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography style={{
                  default: {
                    fill: "#EEE",
                  },
                  hover: {
                    fill: "#91BAD6",
                  },
                  pressed: {
                    fill: "#1E3f66",
                  },
                }}
                  key={geo.rsmKey} geography={geo} />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    );
  };

  const Diagram = () => {
    const steps = [
      { title: "Awareness", description: "Create awareness through marketing" },
      { title: "Engagement", description: "Nurture leads through targeted contact" },
      { title: "Consideration", description: "Focus on communicating value-add" },
      { title: "Conversion", description: "Convert users to clean stoves" },
      { title: "Retention", description: "Turn new users into dedicated power users" },
      { title: "Loyalty", description: "Incentivize power users to refer new users" },
    ];

    return (
      <div className="flex items-center overflow-auto" style={{ width: "100%", height: "auto" }}>
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-900 text-white rounded-full flex flex-col items-center justify-center shadow-md">
                <h3 className="text-center text-[9px] font-semibold">{step.title}</h3>
                <p className="text-center text-[8px]">{step.description}</p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="text-blue-900 text-md font-bold">
                →
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const FlowDiagram = () => {

    const styles = {
      width: '100%',
      height: 100,
    };
    const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Cultural Taboos and Practices' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: '2', position: { x: 100, y: 100 }, data: { label: 'Purchasing Behavior' }, style: { borderRadius: '50%', width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: '3', position: { x: 250, y: 100 }, data: { label: 'Cooking Habits' }, style: { borderRadius: '50%', width: 75, height: 75, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: '4', position: { x: 200, y: 250 }, data: { label: 'Household Financial Management' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: '5', position: { x: 325, y: 50 }, data: { label: 'Utilities Pricing Trends' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: '6', position: { x: 375, y: 200 }, data: { label: 'Cookstove Usage Behaviour' }, style: { borderRadius: '50%', width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: '7', position: { x: 450, y: 400 }, data: { label: 'Distribution and Availability' }, style: { borderRadius: '50%', width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
    { id: '8', position: { x: 500, y: 100 }, data: { label: 'Cookstove Satisfaction' }, style: { borderRadius: '50%', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' } },
  ];

  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
    { id: 'e2-4', source: '3', target: '4' },
    { id: 'e3-5', source: '3', target: '5' },
    { id: 'e5-6', source: '5', target: '6' },
    { id: 'e6-8', source: '6', target: '8' },
    { id: 'e7-8', source: '7', target: '8' },
  ];
    return (<div style={{ width: '100vw', height: '100vh' }}> <ReactFlow nodes={initialNodes} edges={initialEdges} style={styles}/> </div>);
  };

  const LineCurve = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg
          width="300"
          height="200"
          viewBox="0 0 400 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="100%" height="100%" fill="#002744" />

          {/* Line curve */}
          <path
            d="M 50 150 
            C 100 100, 150 50, 200 50 
            S 300 100, 350 100"
            fill="none"
            stroke="#66cc66"
            strokeWidth="4"
          />

          {/* Dotted vertical lines */}
          <line x1="50" y1="150" x2="50" y2="10" stroke="#66cc66" strokeDasharray="4" />
          <line x1="300" y1="150" x2="300" y2="10" stroke="#66cc66" strokeDasharray="4" />
          <line x1="200" y1="150" x2="200" y2="10" stroke="#66cc66" strokeDasharray="4" />
          <line x1="350" y1="150" x2="350" y2="10" stroke="#66cc66" strokeDasharray="4" />


          {/* Labels */}
          <text x="50" y="170" fill="#fff" fontSize="12" fontWeight="bold">
            Introduction
          </text>
          <text x="150" y="30" fill="#fff" fontSize="12" fontWeight="bold">
            Growth
          </text>
          <text x="250" y="30" fill="#fff" fontSize="12" fontWeight="bold">
            Maturity
          </text>
          <text x="350" y="170" fill="#fff" fontSize="12" fontWeight="bold">
            Decline
          </text>
        </svg>
      </div>
    );
  };

  const renderSearchResults = (results: BaseSearchResult[], title: string) => {
    const filteredResults = filterResultsByTags(results);
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
      <h1 className="text-2xl font-bold mb-6 text-center">Ask Me About Clean Cooking</h1>

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

      {!data && (
        <div className="mt-4 text-center py-6 items-start ml-12 mr-6">
          <h1 className="text-2xl font-bold mb-6 text-left">Not sure where to start?</h1>
          <hr className="max-w-xs mb-4"></hr>
          <div className="flex flex-col md:flex-row justify-center md:justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-left">Explore by region</h2>
              <h3 className="text-left text-sm">Click on a region or country to explore relevant literature</h3>
              <MapChart />
            </div>
            <div className="flex-1 px-4">
              <h2 className="text-lg font-bold text-left">Explore by customer lifecycle</h2>
              <h3 className="text-left text-sm mb-4">Click the customer lifecycle step you'd like to explore</h3>
              <Diagram />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center md:justify-between">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-left">Explore by product lifecycle</h2>
              <h3 className="text-left text-sm">Click on the step you'd like to explore</h3>
              <LineCurve />
            </div>
            <div className="flex-1 px-4">
              <h2 className="text-lg font-bold text-left">Explore by ecosystem map</h2>
              <h3 className="text-left text-sm mb-4">Click the ecosystem stage you'd like to explore</h3>
              <FlowDiagram />
            </div>
          </div>
        </div>
      )}

      {data && (
        <div className="flex mt-8">
          {data.internal_results.length > 0 || data.external_results.length > 0 ? (
            <div className="w-1/4 pr-4">
              <TagFilter
                tags={Array.from(new Set(data.internal_results.flatMap((result) => result.tags.map(tag => tag.id))))
                  .map(id => data.internal_results.flatMap((result) => result.tags).find(tag => tag.id === id)!)}
                selectedTags={selectedTags}
                onTagChange={handleTagChange}
              />
            </div>
          ) : null}
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