import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchBar } from '../components/search/SearchBar';
import CollapsibleSummary from '../components/ui/collapsiblesummary';
import TagFilter from '../components/ui/tagfilter';
import { Badge } from '@/components/ui';
import MapChart from '../components/ui/mapchart';
import Diagram from '../components/ui/customerlifecycleflow';
import FlowDiagram from '../components/ui/ecosystemmap';
import LineCurve from '../components/ui/productlifecycleline';
import { Tag } from '../types/tag';
import Cookies from 'js-cookie';

import '@xyflow/react/dist/style.css';

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
}

interface ExternalSearchResult extends BaseSearchResult {
	autosaved: boolean;
}

interface CombinedSearchResponse {
	internal_results: InternalSearchResult[];
	external_results: ExternalSearchResult[];
}

export const SearchPage: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedTags, setSelectedTags] = React.useState<number[]>([]);
	const [selectedResourceTypes, setSelectedResourceTypes] = React.useState<string[]>([]);
	const [isFrameworkQuery, setIsFrameworkQuery] = React.useState(false);
	const [isAuthenticated, setIsAuthenticated] = React.useState(false);

	React.useEffect(() => {
		const token = Cookies.get('sessionToken');
		const savedUsername = Cookies.get('username');
		if (token && savedUsername) {
			setIsAuthenticated(true);
		}
	}, []);

	const API_URL = import.meta.env.VITE_API_URL || '';
	const api = axios.create({
		baseURL: API_URL,
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const searchQuery = new URLSearchParams(location.search).get('query') || '';

	const { data, isLoading, error } = useQuery({
		queryKey: ['search', searchQuery],
		queryFn: async () => {
			if (!searchQuery) return null;
			if (!isFrameworkQuery) {
				const response = await api.post<CombinedSearchResponse>(
					'/api/v1/search/',
					{
						query: searchQuery,
						limit: 10,
						include_external: true,
					}
				);
				return response.data;
			} else {
				const response = await api.get<InternalSearchResult[]>(
					'/api/v1/documents/'
				);
				return { internal_results: response.data, external_results: [] };
			}
		},
		enabled: Boolean(searchQuery.trim()), // Only enable when there's a non-empty search query
		staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
	});

	React.useEffect(() => {
		if (data) {
			let titles: string[] = [];
			data.external_results.forEach(result => {
				console.log(result)
				if (result.autosaved) {
					titles.push(result.title);
				}
			});
			if (titles.length > 0) {
				alert(`Documents with titles:\n${titles.join("\n")}\nhave been autosaved.`);
			}
		}
	}, [data]);

	// Add a state to track if a search has been initiated
	const [hasSearched, setHasSearched] = useState(false);

	// Update the handleSearch function
	const handleSearch = (query: string) => {
		if (query.trim()) {
			navigate(`/?query=${encodeURIComponent(query)}`);
			setSelectedTags([]);
			setSelectedResourceTypes([]);
			setIsFrameworkQuery(false);
			setHasSearched(true); // Set this to true when a search is initiated
		}
	};

	// Pass this modified loading state to SearchBar
	const isSearching = isLoading && hasSearched;

	const handleFrameworkClick = (frameworkName: string) => {
		navigate(`/?query=${frameworkName}`);
		setIsFrameworkQuery(true);
	};

	const handleTagChange = (tagId: number) => {
		setSelectedTags((prevSelectedTags) =>
			prevSelectedTags.includes(tagId)
				? prevSelectedTags.filter((id) => id !== tagId)
				: [...prevSelectedTags, tagId]
		);
	};

	const handleResourceTypeChange = (resourceType: string) => {
		setSelectedResourceTypes((prevSelectedResourceTypes) =>
			prevSelectedResourceTypes.includes(resourceType)
				? prevSelectedResourceTypes.filter((type) => type !== resourceType)
				: [...prevSelectedResourceTypes, resourceType]
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

	const filterResultsByResourceTypes = (results: BaseSearchResult[]) => {
		if (selectedResourceTypes.length === 0) return results;
		return results.filter((result) => selectedResourceTypes.includes(result.resource_type));
	};

	const filterResultsByFramework = (results: BaseSearchResult[], frameworkName: string) => {
		return results.filter((result) =>
			'tags' in result
				? (result as InternalSearchResult).tags.some((tag) => tag.name === frameworkName)
				: false
		);
	};

	const saveExternalDocument = async (document: ExternalSearchResult) => {
		const tags = document.tags.map(tag => ({
			name: tag.name,
			category: tag.category,
		}));

		const payload = {
			title: document.title,
			summary: document.summary,
			source_url: document.source_url,
			tags: tags,
			resource_type: document.resource_type || 'Academic Article',
		}
		console.log(payload);
		try {
			const response = await api.post('/api/v1/documents/', payload);
			console.log('Document saved:', response.data);
			alert(`${document.title} saved successfully!`);
		} catch (error) {
			console.error('Error saving document:', error);
		}
	};

	const renderSearchResults = (results: BaseSearchResult[], title: string) => {
		const filteredResults = filterResultsByResourceTypes(filterResultsByTags(results));
		if (!filteredResults.length) return null;

		return (
			<div className="mb-8">
				<h2 className="text-xl font-bold mb-4">{title}</h2>
				<div className="space-y-4">
					{filteredResults.map((result, index) => (
						<div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
							<div className="flex justify-between">
								<h3 className="text-lg font-semibold mb-2">{result.title}</h3>
								{isAuthenticated && result.source === 'external' && (import.meta.env.AUTOSAVE_DOCS ? import.meta.env.AUTOSAVE_DOCS.trim().lower() === 'false' : 'false') ? (
									<button
										className="bg-[#568d43] text-white text-xs px-2 py-2 rounded shadow"
										onClick={() => saveExternalDocument(result as ExternalSearchResult)}
									>
										Save to Internal Database
									</button>
								) : null}
							</div>
							{result.resource_type &&
								(
									<span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
										{result.resource_type}
									</span>
								)
							}
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
								{!isFrameworkQuery && (
									<span className="text-sm text-gray-500">
										Relevance: {(result.relevance_score * 100).toFixed(0)}%
									</span>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="container mx-auto py-6 px-4 justify-center">
			<div className="flex flex-col items-center text-center">
				<h1 className="text-2xl font-bold mb-6">Ask Me About Clean Cooking</h1>
				<div className="w-full max-w-md mb-6">
					<SearchBar onSearch={handleSearch} isLoading={isSearching} />
				</div>
				{error ? (
					<div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
						Error: {error instanceof Error ? error.message : 'An error occurred'}
					</div>
				) : null}
				{searchQuery && isLoading && <div className="mt-4 text-gray-600">Searching...</div>}
			</div>

			{!data && (
				<div className="mt-4 text-left">
					<h2 className="text-2xl font-bold mb-4">Not sure where to start?</h2>
					<hr className="mb-6" />
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-lg font-bold">Explore by region</h3>
							<p>Click on a region or country to explore relevant literature.</p>
							<MapChart setSearchQuery={handleFrameworkClick} results={[]} />
						</div>
						<div>
							<h3 className="text-lg font-bold">Explore by customer lifecycle</h3>
							<p className="mb-6">Click the customer lifecycle step you'd like to explore.</p>
							<Diagram setSearchQuery={handleFrameworkClick} results={[]} />
						</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
						<div>
							<h3 className="text-lg font-bold">Explore by product lifecycle</h3>
							<p className="mb-6">Click on the step you'd like to explore.</p>
							<LineCurve setSearchQuery={handleFrameworkClick} results={[]} />
						</div>
						<div>
							<h3 className="text-lg font-bold">Explore by ecosystem map</h3>
							<p className="mb-6">Click the ecosystem stage you'd like to explore.</p>
							<FlowDiagram setSearchQuery={handleFrameworkClick} results={[]} />
						</div>
					</div>
				</div>
			)}

			{data && (
				<div className="flex flex-wrap mt-8">
					<div className="w-full md:w-1/4 mb-4 md:mb-0 pr-4">
						{(isFrameworkQuery ? filterResultsByFramework(data.internal_results, searchQuery).length > 0 
						  : (data.internal_results.length > 0 || data.external_results.length > 0)) ? (
							<TagFilter
								tags={Array.from(new Set(data.internal_results.flatMap((result) => result.tags.map((tag) => tag.id))))
									.map((id) =>
										data.internal_results.flatMap((result) => result.tags).find((tag) => tag.id === id)
									).filter((tag): tag is Tag => tag !== undefined && (!isFrameworkQuery || tag.name !== searchQuery))}
								selectedTags={selectedTags}
								onTagChange={handleTagChange}
								resourceTypes={['Academic Article', 'News', 'Video', 'Podcast']}
								selectedResourceTypes={selectedResourceTypes}
								onResourceTypeChange={handleResourceTypeChange}
							/>
						) : (
							<div className="p-4 border rounded-lg bg-white shadow-sm">
								<h2 className="text-xl font-bold mb-4">No tags available</h2>
							</div>
						)}
					</div>
					<div className="w-full md:w-3/4">
						{isFrameworkQuery ? (
							filterResultsByFramework(data.internal_results, searchQuery).length === 0 ? (
								<div className="font-bold text-xl">
									No documents found with the tag "{searchQuery}"
									<hr className="mb-4" />
								</div>
							) : (
								<>
									<h2 className="text-xl font-bold mb-4">Documents with the tag: "{searchQuery}"</h2>
									<hr className="mb-4" />
									{renderSearchResults(
										filterResultsByFramework(data.internal_results, searchQuery),
										'Internal Library Results'
									)}
									{renderSearchResults(
										filterResultsByFramework(data.external_results, searchQuery),
										'External Research Results'
									)}
								</>
							)
						) : (
							<>
								{renderSearchResults(data.internal_results, 'Internal Library Results')}
								{renderSearchResults(data.external_results.filter(result => !result.autosaved), 'External Research Results')}
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};