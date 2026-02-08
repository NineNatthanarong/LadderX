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
      <div className="w-full max-w-2xl mx-auto mt-8 text-center text-gray-500">
        Searching...
      </div>
    );
  }

  if (results.length === 0 && query.length >= 3) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8 text-center bg-gray-50 rounded-lg p-8">
        <p className="text-gray-600 font-medium">No results found for "{query}"</p>
        <p className="text-sm text-gray-400 mt-2">Try checking for typos or using broader keywords.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-6 space-y-4">
      {results.map((result) => (
        <Link
          href={`/docs/${result.documentId}`} // Placeholder route until DocViewer is ready
          key={result.id}
          className="block group"
        >
          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {result.title}
                </h3>
              </div>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
                <Folder className="h-3 w-3" />
                {result.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {result.content.substring(0, 200)}...
            </p>

            <div className="mt-3 text-xs text-gray-400 flex items-center gap-2">
              <span>Page {result.pageNumber}</span>
              <span>•</span>
              <span>Match found in content</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
