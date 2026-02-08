'use client';

import { Search, Command } from 'lucide-react';
import { useEffect, useRef, useState, useCallback } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching?: boolean;
}

export function SearchBar({ onSearch, isSearching }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localQuery, setLocalQuery] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce the search callback to avoid excessive re-renders
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 200);
  }, [onSearch]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted h-5 w-5 group-focus-within:text-accent transition-none" />
        <input
          ref={inputRef}
          type="text"
          aria-label="Search documentation"
          className="w-full pl-12 pr-14 py-4 bg-surface border border-border focus:outline-none focus:border-accent text-foreground placeholder-muted text-base font-medium tracking-wide"
          placeholder="SEARCH INSTRUCTIONS, FUNCTIONS..."
          value={localQuery}
          onChange={handleChange}
        />
        {isSearching ? (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent"></div>
          </div>
        ) : (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 text-muted bg-background px-2 py-1 border border-border">
            <Command className="h-3 w-3" />
            <span className="text-xs font-bold">K</span>
          </div>
        )}
      </div>
      <div className="mt-2 text-xs text-muted tracking-wider uppercase">
        Type at least 3 characters to search
      </div>
    </div>
  );
}
