/**
 * Search Index Schema
 * Location: public/search-index.json
 */

export interface SearchIndexItem {
  /**
   * Unique identifier for the search item (e.g., "doc1_page1")
   */
  id: string;

  /**
   * ID of the parent document
   */
  documentId: string;

  /**
   * Display title of the document (usually filename without extension)
   */
  title: string;

  /**
   * Category path (e.g., "manuals/hardware")
   */
  category: string;

  /**
   * Page number (1-based)
   */
  pageNumber: number;

  /**
   * Full normalized text content of the page
   */
  content: string;

  /**
   * Extracted headers (large text) from the page for relevance boosting.
   * e.g., ["Chapter 1: Introduction", "Safety Precautions"]
   */
  headers: string[];

  /**
   * Relative path to the source file
   */
  path: string;
}

export type SearchIndex = SearchIndexItem[];
