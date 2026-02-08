import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { loadSearchIndex } from '@/lib/data-loader';
import { SearchIndexItem } from '@/lib/types';

export interface SearchResult extends SearchIndexItem {
  matches?: readonly Fuse.FuseResultMatch[];
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchIndexItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSearchIndex().then((data) => {
      setIndex(data);
      setLoading(false);
    });
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(index, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'category', weight: 0.2 },
        { name: 'content', weight: 0.1 },
      ],
      includeMatches: true,
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [index]);

  const results = useMemo(() => {
    if (!query) return [];
    return fuse.search(query).map((result) => ({
      ...result.item,
      matches: result.matches,
    }));
  }, [fuse, query]);

  return {
    query,
    setQuery,
    results,
    loading,
  };
}
