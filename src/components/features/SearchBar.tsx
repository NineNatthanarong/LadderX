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
  const [isFocused, setIsFocused] = useState(false);
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

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 200);
  }, [onSearch]);

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
        {/* Glow effect behind input */}
        <div
          className="absolute -inset-1 rounded-sm opacity-0 transition-opacity duration-500 blur-md -z-10"
          style={{
            background: 'var(--gradient-brand)',
            opacity: isFocused ? 0.15 : 0,
          }}
        />

        <Search
          className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-300"
          style={{ color: isFocused ? '#e36414' : '#737373' }}
        />
        <input
          ref={inputRef}
          type="text"
          aria-label="Search documentation"
          className="w-full pl-10 sm:pl-12 pr-4 sm:pr-14 py-3 sm:py-4 text-foreground placeholder-muted text-sm sm:text-base font-medium tracking-wide focus:outline-none transition-all duration-300"
          style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${isFocused ? 'rgba(227, 100, 20, 0.4)' : 'rgba(30, 30, 30, 1)'}`,
            boxShadow: isFocused ? '0 0 20px 2px rgba(227, 100, 20, 0.08)' : 'none',
          }}
          placeholder="SEARCH INSTRUCTIONS, FUNCTIONS..."
          value={localQuery}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {/* Bottom gradient accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] transition-opacity duration-300"
          style={{
            background: 'var(--gradient-brand-h)',
            opacity: isFocused ? 1 : 0,
          }}
        />

        {isSearching ? (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div
              className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full"
              style={{ borderColor: '#e36414', borderTopColor: 'transparent' }}
            />
          </div>
        ) : (
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-1 text-muted px-2 py-1"
            style={{
              background: 'rgba(10, 10, 10, 0.8)',
              border: '1px solid rgba(227, 100, 20, 0.15)',
            }}
          >
            <Command className="h-3 w-3" />
            <span className="text-xs font-bold">K</span>
          </div>
        )}
      </div>
      <div className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted tracking-wider uppercase">
        Type at least 3 characters to search
      </div>
    </div>
  );
}
