import { SearchIndexItem } from './types';

export interface TreeNode {
  name: string;
  path?: string; // If it's a file/document
  children: TreeNode[];
  type: 'category' | 'document';
  id?: string;
}

export function buildTree(items: SearchIndexItem[]): TreeNode[] {
  const root: TreeNode[] = [];
  const map: Record<string, TreeNode> = {};

  // We need to deduplicate documents because the index has one item per page (or just one per doc currently)
  // Current generate-index.ts creates one item per document with id `${docId}_full`
  // But let's assume we might have multiple items per doc later.
  // For navigation, we just want unique documents.

  const uniqueDocs = new Map<string, SearchIndexItem>();
  items.forEach(item => {
    if (!uniqueDocs.has(item.documentId)) {
      uniqueDocs.set(item.documentId, item);
    }
  });

  uniqueDocs.forEach(item => {
    const parts = item.category.split('/');
    let currentLevel = root;
    let currentPath = '';

    // Build category structure
    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      // Check if this category exists at current level
      let node = currentLevel.find(n => n.name === part && n.type === 'category');

      if (!node) {
        node = {
          name: part,
          children: [],
          type: 'category'
        };
        currentLevel.push(node);
        // Sort categories alphabetically
        currentLevel.sort((a, b) => {
          if (a.type !== b.type) return a.type === 'category' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      }
      currentLevel = node.children;
    });

    // Add document to the last category
    currentLevel.push({
      name: item.title,
      path: item.documentId, // We use documentId for routing
      children: [],
      type: 'document',
      id: item.documentId
    });

    // Sort documents within category
    currentLevel.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'category' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  });

  return root;
}
