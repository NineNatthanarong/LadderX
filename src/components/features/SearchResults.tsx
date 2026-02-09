'use client';

import { SearchIndexItem } from '@/lib/types';
import { FileText, Folder } from 'lucide-react';
import Link from 'next/link';

interface SearchResultsProps {
  results: SearchIndexItem[];
  query: string;
  isSearching: boolean;
}

export function SearchResults({ results, query, isSearching }: SearchResultsProps) {
  if (!query) {
    return null;
  }

  if (isSearching) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass p-4 animate-shimmer"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="h-4 w-3/5 bg-border/40 rounded mb-3" />
            <div className="h-3 w-full bg-border/30 rounded mb-2" />
            <div className="h-3 w-2/3 bg-border/20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (results.length === 0 && query.length >= 3) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 text-center glass p-8 animate-fade-in">
        <p className="text-foreground font-bold uppercase tracking-wide">No results for &ldquo;{query}&rdquo;</p>
        <p className="text-sm text-muted mt-2">Check for typos or use broader keywords.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-2">
      {results.map((result, i) => (
        <Link
          href={`/docs/${result.documentId}`}
          key={result.id}
          className="block group"
        >
          <div
            className="relative overflow-hidden p-3 sm:p-4 transition-all duration-200 animate-result-slide-in"
            style={{
              animationDelay: `${Math.min(i, 9) * 0.05}s`,
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(30, 30, 30, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(227, 100, 20, 0.3)';
              e.currentTarget.style.boxShadow = '0 0 20px 2px rgba(227, 100, 20, 0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(30, 30, 30, 1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Left gradient accent */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'var(--gradient-brand)' }}
            />

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 overflow-hidden">
              <div className="flex items-center gap-2 mb-1 min-w-0">
                <FileText className="h-4 w-4 text-accent shrink-0" />
                <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-accent transition-colors duration-200 truncate">
                  {result.title}
                </h3>
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 flex items-center gap-1 shrink-0 w-fit max-w-full sm:max-w-[40%] overflow-hidden"
                style={{
                  color: '#e36414',
                  background: 'rgba(227, 100, 20, 0.08)',
                  border: '1px solid rgba(227, 100, 20, 0.15)',
                }}
              >
                <Folder className="h-3 w-3 shrink-0" />
                <span className="truncate">{result.category}</span>
              </span>
            </div>

            {/* Display Headers if available */}
            {result.headers && result.headers.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1 mb-2">
                {result.headers.slice(0, 3).map((header, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: 'rgba(154, 3, 30, 0.1)',
                      border: '1px solid rgba(154, 3, 30, 0.2)',
                      color: '#737373',
                    }}
                  >
                    {header}
                  </span>
                ))}
                {result.headers.length > 3 && (
                  <span className="text-[10px] text-muted px-1.5 py-0.5">+{result.headers.length - 3}</span>
                )}
              </div>
            )}

            <p className="text-sm text-muted mt-2 line-clamp-2 break-words">
              {result.content.substring(0, 200)}...
            </p>

            <div className="mt-3 text-xs text-muted/60 flex items-center gap-2 uppercase tracking-wider">
              <span>Page {result.pageNumber}</span>
              <span className="text-accent">■</span>
              <span>Match found</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
