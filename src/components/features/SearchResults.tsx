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
            className="bg-surface border border-border p-4 animate-shimmer"
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
      <div className="w-full max-w-2xl mx-auto mt-8 text-center bg-surface border border-border p-8 animate-fade-in">
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
            className="bg-surface border border-border p-4 hover:border-accent hover:bg-surface-hover transition-colors duration-150 cursor-pointer overflow-hidden animate-result-slide-in"
            style={{ animationDelay: `${Math.min(i, 9) * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-3 overflow-hidden">
              <div className="flex items-center gap-2 mb-1 min-w-0">
                <FileText className="h-4 w-4 text-accent shrink-0" />
                <h3 className="font-bold text-foreground group-hover:text-accent transition-colors duration-150 truncate">
                  {result.title}
                </h3>
              </div>
              <span className="text-[10px] font-bold text-accent uppercase tracking-wider bg-accent/10 px-2 py-1 flex items-center gap-1 shrink-0 whitespace-nowrap max-w-[40%] overflow-hidden">
                <Folder className="h-3 w-3 shrink-0" />
                <span className="truncate">{result.category}</span>
              </span>
            </div>

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

