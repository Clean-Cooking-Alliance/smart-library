import React from 'react';
import { Badge } from './badge';
import { Tag } from '../../types/tag';

// interface Tag {
//   id: number;
//   name: string;
//   category: 'region' | 'topic' | 'technology' | 'framework' | 'country' | 'unknown';
// }

interface TagFilterProps {
  tags: Tag[];
  selectedTags: number[];
  resourceTypes: string[];
  selectedResourceTypes: string[];
  onTagChange: (tagId: number) => void;
  onResourceTypeChange: (resourceType: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, selectedResourceTypes, onTagChange, onResourceTypeChange }) => {
  const handleTagChange = (tagId: number) => {
    onTagChange(tagId);
  };

  const handleResourceTypeChange = (resourceType: string) => {
    onResourceTypeChange(resourceType);
  };

  const uniqueTags = Array.from(new Set(tags.map(tag => tag.id)))
    .map(id => tags.find(tag => tag.id === id)!);

  const groupedTags = uniqueTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const resourceTypes = ['Academic Article', 'News', 'Video', 'Podcast', 'Journey Map', 'Discussion Brief', 'Stories', 'Webinar', 'Case Study', 'Factsheet', 'Country Action Plan', 'Research Report', 'Tool/ Toolkit', 'Journal Article', 'Field Research', 'Market Assessments', 'Progress Report', 'Persona', 'Strategy Document', 'Policy Brief'];

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold py-6">Resource Type</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {resourceTypes.map((type) => (
          <Badge
            key={type}
            variant="resource"
            onClick={() => handleResourceTypeChange(type)}
            className={`cursor-pointer ${selectedResourceTypes.includes(type) ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}
          >
            {type}
          </Badge>
        ))}
      </div>
      <hr></hr>
      <h2 className="text-xl font-bold py-6">Filter by Tags</h2>
      {Object.entries(groupedTags).map(([category, tags]) => (
        <div key={category} className="mb-4">
          <h3 className="text-lg font-semibold mb-2 capitalize">{category.replace("_", " ")}</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag.id}
                variant={tag.category}
                onClick={() => handleTagChange(tag.id)}
                className={`cursor-pointer ${selectedTags.includes(tag.id) ? 'font-bold ' + tag.category : tag.category}`}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagFilter;