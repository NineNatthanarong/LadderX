'use client';

import { useState, useEffect } from 'react';
import { SearchBar } from '@/components/features/SearchBar';
import { SearchResults } from '@/components/features/SearchResults';
import { loadSearchIndex } from '@/lib/data-loader';
import { search } from '@/lib/search';
import { SearchIndexItem } from '@/lib/types';

export default function Home() {
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [results, setResults] = useState<SearchIndexItem[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    async function init() {
      const data = await loadSearchIndex();
      setIndex(data);
      setLoading(false);
    }
    init();
  }, []);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);

    if (newQuery.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    // Debounce search slightly to avoid UI flicker on fast typing
    const timeoutId = setTimeout(() => {
      const hits = search(newQuery, index);
      setResults(hits);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timeoutId);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
            Syntax Documentation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Instantly search across {loading ? '...' : index.length} documentation pages.
          </p>
        </div>

        <SearchBar onSearch={handleSearch} isSearching={isSearching || loading} />

        <SearchResults
          results={results}
          query={query}
          isSearching={isSearching}
        />

        {!query && !loading && (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {/* Categories Placeholder - to be implemented in Phase 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Overview</h3>
              <p className="text-sm text-gray-500">General information and system configuration.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">CPU Instructions</h3>
              <p className="text-sm text-gray-500">Standard and dedicated CPU module instructions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-2">Standard Functions</h3>
              <p className="text-sm text-gray-500">Built-in functions for data processing.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
