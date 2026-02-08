# Quickstart: Search Optimization

## Feature Overview

This feature optimizes the search functionality by:
1.  **Extracting Headers**: Parsing PDFs to find "large text" (headers) and adding them to the index.
2.  **Boosting Relevance**: Configuring Fuse.js to weight matches in `title` and `headers` higher than `content`.
3.  **Client-Side Optimization**: Keeping index generation on the client (data-only payload) to minimize download size.

## Build and Run

To generate the optimized index:

```bash
# Install dependencies (if needed)
npm install

# Run the index generator
npm run build:index
# Output: public/search-index.json
```

To run the app with the new search:

```bash
npm run dev
```

## Verification

1.  **Check Index**: Open `public/search-index.json`. verify that items now have a `headers` array populated with non-empty strings for pages that have headers.
2.  **Test Search**:
    -   Search for a term that appears in a header (e.g., "Safety").
    -   Verify that the page containing "Safety" as a header appears BEFORE pages that just mention "safety" in the body text.
