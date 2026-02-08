'use client';

import { Search, Command } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
        <input
          ref={inputRef}
          type="text"
          aria-label="Search documentation"
          className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white text-gray-900 placeholder-gray-400 text-lg"
          placeholder="Search syntax, instructions, or functions..."
          onChange={(e) => onSearch(e.target.value)}
          disabled={isSearching}
        />
        {isSearching ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
            <Command className="h-3 w-3" />
            <span className="text-xs font-medium">K</span>
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-center text-gray-500">
        Type at least 3 characters to search
      </div>
    </div>
  );
}
