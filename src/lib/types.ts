export interface Document {
  id: string;
  filename: string;
  path: string;
  category: string;
  pageCount: number;
  lastModified: string;
}

export interface SearchIndexItem {
  id: string;
  documentId: string;
  title: string;
  category: string;
  pageNumber: number;
  content: string;
  headers: string[];
  path: string;
}
