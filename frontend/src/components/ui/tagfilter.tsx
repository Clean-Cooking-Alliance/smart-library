import React from 'react';
import { Badge } from './badge';

interface Tag {
  id: number;
  name: string;
}

interface TagFilterProps {
  tags: Tag[];
  selectedTags: number[];
  onTagChange: (tagId: number) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagChange }) => {
  const handleTagChange = (tagId: number) => {
    onTagChange(tagId);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Filter by Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? 'primary' : 'secondary'}
            onClick={() => handleTagChange(tag.id)}
            className={`cursor-pointer ${selectedTags.includes(tag.id) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
          >
            {tag.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;