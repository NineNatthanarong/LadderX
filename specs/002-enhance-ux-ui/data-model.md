# Data Model & Interfaces

## Core Entities

### Document
Represents a single parsed documentation page (from PDF or Markdown).

```typescript
interface Document {
  id: string;          // Unique slug/path
  title: string;       // Page title
  content: string;     // Raw text content
  headings: Heading[]; // Extracted headings for TOC
  section: string;     // Parent section (e.g., "Constitution")
  chapter?: string;    // Sub-category
}

interface Heading {
  id: string;    // Anchor slug
  text: string;  // Display text
  level: number; // h1, h2, h3
}
```

### Search Result
Standardized format for search hits.

```typescript
interface SearchResult {
  docId: string;
  title: string;
  excerpt: string;     // Contextual snippet with highlight
  breadcrumbs: string[]; // ["Constitution", "Article I"]
  score: number;       // Relevance
  url: string;         // Full path + anchor
}
```

## UI State

### Navigation State
Managed via `NavigationContext`.

```typescript
interface NavigationState {
  isSidebarOpen: boolean; // Mobile only
  toggleSidebar: () => void;
  closeSidebar: () => void;
}
```

### Search State
Managed via `CommandMenu` internal state or global context if needed.

```typescript
interface SearchState {
  isOpen: boolean;
  query: string;
  setOpen: (open: boolean) => void;
}
```
