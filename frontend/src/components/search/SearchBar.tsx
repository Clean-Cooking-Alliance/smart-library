import React, { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '@/components/ui/button';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  
  // Reset local query state when loading completes
  useEffect(() => {
    if (!isLoading && query.trim()) {
      setQuery('');
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 rounded-2xl max-w-2xl mx-auto">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="flex-1"
        disabled={isLoading} // Disable input while loading
      />
      <Button 
        type="submit" 
        disabled={isLoading || !query.trim()} // Disable if loading or empty query
        className={`bg-[#042449] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <MagnifyingGlassIcon className="w-6 h-6 text-white-500" />
      </Button>
    </form>
  );
};