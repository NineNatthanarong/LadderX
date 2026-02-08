# Internal Hook Contracts

Since this is a client-side application without a new backend API, our "contracts" are the TypeScript interfaces for the React Hooks that encapsulate business logic.

## `useSearch`

Encapsulates the Fuse.js logic and result transformation.

```typescript
// Input
interface UseSearchOptions {
  data: Document[]; // Full dataset
}

// Output
interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: SearchResult[];
  isSearching: boolean;
}
```

## `useTableOfContents`

Encapsulates the intersection observer logic for the active section.

```typescript
// Output
interface UseTableOfContentsResult {
  activeId: string; // The ID of the heading currently in view
  headings: Heading[]; // List of headings on the page
}
```

## `useKeyboardShortcut`

Utility for handling global shortcuts (like Cmd+K).

```typescript
// Input
type KeyCombo = string; // e.g., "meta+k", "ctrl+k"

// Usage
// useKeyboardShortcut(["meta+k", "ctrl+k"], () => toggleSearch())
```
