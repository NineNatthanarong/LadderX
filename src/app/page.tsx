'use client';

import { useState, useEffect, useMemo } from 'react';
import { SearchBar } from '@/components/features/SearchBar';
import { SearchResults } from '@/components/features/SearchResults';
import { loadSearchIndex } from '@/lib/data-loader';
import { search } from '@/lib/search';
import { SearchIndexItem } from '@/lib/types';
import { Database, Layers, FileText } from 'lucide-react';

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
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const hits = search(newQuery, index);
    setResults(hits);
    setIsSearching(false);
  };

  // Compute live stats from the search index
  const stats = useMemo(() => {
    if (index.length === 0) return null;
    const uniqueDocs = new Set(index.map((item) => item.documentId));
    const uniqueCategories = new Set(index.map((item) => item.category));
    return {
      documents: uniqueDocs.size,
      categories: uniqueCategories.size,
      pages: index.length,
    };
  }, [index]);

  return (
    <main className="min-h-screen bg-background py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-block mb-6 animate-fade-in-up">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent border border-accent px-3 py-1">
              MELSEC REFERENCE
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight uppercase leading-none mb-4 sm:mb-6 animate-fade-in-up delay-100">
            Syntax<br />
            <span className="text-accent">Documentation</span>
          </h1>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto tracking-wide animate-fade-in-up delay-200">
            {loading ? (
              <span className="inline-block w-48 h-5 rounded animate-shimmer" />
            ) : (
              <>
                <span className="text-accent font-bold">{index.length}</span> documentation pages indexed and searchable.
              </>
            )}
          </p>
        </div>

        {/* Search */}
        <div className="animate-slide-up delay-300">
          <SearchBar onSearch={handleSearch} isSearching={isSearching || loading} />
        </div>

        {/* Results */}
        <SearchResults
          results={results}
          query={query}
          isSearching={isSearching}
        />

        {/* Live Stats — replaces the old category cards */}
        {!query && !loading && stats && (
          <div className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border">
            {[
              { icon: FileText, label: 'Documents', value: stats.documents },
              { icon: Layers, label: 'Categories', value: stats.categories },
              { icon: Database, label: 'Pages Indexed', value: stats.pages },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`bg-surface flex flex-col items-center justify-center py-5 sm:py-8 px-4 group hover:bg-surface-hover transition-colors duration-200 animate-fade-in delay-${(i + 5) * 100}`}
                >
                  <Icon className="h-5 w-5 text-accent mb-3 group-hover:scale-110 transition-transform duration-200" />
                  <span className={`text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tabular-nums animate-count-up delay-${(i + 6) * 100}`}>
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted mt-2">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 sm:mt-16 text-center animate-fade-in delay-700">
          <div className="border border-border bg-surface rounded px-4 sm:px-6 py-4 sm:py-5 w-full sm:max-w-xl sm:inline-block">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-2">
              PLC Competition 2026
            </p>
            <p className="text-[11px] sm:text-xs text-muted leading-relaxed">
              This website is made for <span className="text-foreground font-semibold">PLC Competition 2026</span> purpose only.
              Built by <span className="text-foreground font-semibold">BananaCat Team</span>.
              All information is sourced from official documentation by <span className="text-foreground font-semibold">Mitsubishi Electric</span>.
            </p>
          </div>
        </div>

        {/* Footer accent line */}
        <div className="mt-10 flex items-center gap-4 animate-fade-in delay-800">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted">LadderX</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>
      </div>
    </main>
  );
}
