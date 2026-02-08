import Fuse from 'fuse.js';
import { SearchIndexItem } from './types';

const FUSE_OPTIONS = {
  keys: [
    { name: 'title', weight: 0.7 },
    { name: 'content', weight: 0.3 },
    { name: 'category', weight: 0.2 },
  ],
  includeScore: true,
  threshold: 0.3, // Fuzzy matching threshold (0.0 = exact, 1.0 = match anything)
  ignoreLocation: true, // Search anywhere in the string
  minMatchCharLength: 3,
};

let fuseInstance: Fuse<SearchIndexItem> | null = null;

export function initSearch(data: SearchIndexItem[]) {
  if (!fuseInstance) {
    fuseInstance = new Fuse(data, FUSE_OPTIONS);
  }
  return fuseInstance;
}

export function search(query: string, data: SearchIndexItem[], limit = 20): SearchIndexItem[] {
  if (!query) return [];

  const fuse = initSearch(data);
  const results = fuse.search(query);

  return results.slice(0, limit).map(result => result.item);
}
