// src/components/search/SearchBar.tsx
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  console.log('SearchBar rendering'); // Debug log
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with query:', query); // Debug log
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 rounded-2xl max-w-2xl mx-auto">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex-1"
      />
      <Button type="submit" className="bg-white" disabled={isLoading}>
      <MagnifyingGlassIcon className="w-6 h-6 text-gray-500" />
      </Button>
    </form>
  );
};