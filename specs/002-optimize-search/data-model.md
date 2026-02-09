# Data Model: Optimize Search

## Entities

### SearchIndexItem

Represents a searchable unit of content (currently a single page of a PDF).

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier for the item (hash of document ID + page number). |
| `documentId` | `string` | ID of the parent document. |
| `title` | `string` | Title of the document (filename). |
| `category` | `string` | Category derived from directory structure. |
| `pageNumber` | `number` | Page number in the original PDF (1-based). |
| `content` | `string` | Full text content of the page, normalized. |
| `headers` | `string[]` | **NEW**: List of extracted headers (large text) found on this page. Used for boosting relevance. |
| `path` | `string` | Relative path to the source PDF. |

## Relationships

- A `Document` (source PDF) has many `SearchIndexItem`s (one per page).
- `SearchIndexItem`s are flattened into a single JSON array for the client.

## Storage

- **File**: `public/search-index.json`
- **Format**: JSON Array of `SearchIndexItem`
- **Generation**: Created at build time by `src/scripts/generate-index.ts`.
