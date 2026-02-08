import { SearchIndexItem } from './types';

export async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  try {
    const response = await fetch('/search-index.json');
    if (!response.ok) {
      throw new Error(`Failed to load index: ${response.statusText}`);
    }
    const data = await response.json();
    return data as SearchIndexItem[];
  } catch (error) {
    console.error('Error loading search index:', error);
    return [];
  }
}
