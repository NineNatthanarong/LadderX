# Search Optimization Research

## 1. PDF Header Extraction

### Context
We currently use `pdf-parse` to extract raw text from PDFs for our search index. To improve search relevance, we want to weight "headers" (titles, section headers) higher than body text. This requires extracting layout/font information during parsing.

### Comparison
*   **`pdf-parse`** (Current):
    *   **Pros**: Already installed. It is a lightweight wrapper around `pdf.js`. It allows a custom `pagerender` function where we can access `getTextContent`.
    *   **Findings**: Our tests confirm that the `pagerender` callback receives items with a `transform` matrix.
        *   `item.transform` is an array: `[scaleX, skewY, skewX, scaleY, translateX, translateY]`.
        *   The first element (`transform[0]`) represents the font scaling factor (approximate font size).
        *   Example from `00_Intro.pdf`: Body text has size ~15.96, while "PART 1" header has size ~27.96.
    *   **Cons**: Requires writing custom logic to reconstruct the document structure based on these raw values.

*   **`pdf2json`**:
    *   **Pros**: Outputs structured JSON with text and positioning.
    *   **Cons**: Another dependency. Often verbose output.

*   **`pdfjs-dist`**:
    *   **Pros**: The core library.
    *   **Cons**: `pdf-parse` already bundles this and exposes the necessary hooks. Using it directly adds boilerplate for Node.js file reading/mocking.

### Recommendation
**Decision**: Stick with `pdf-parse` but enhance the implementation.

**Rationale**:
`pdf-parse` already exposes the data we need via the `pagerender` option. We don't need a new library; we just need to update `src/scripts/pdf-parser.ts` to inspect the `transform` matrix of each text item.

**Implementation Strategy**:
1.  Modify `src/scripts/pdf-parser.ts`.
2.  In the `pagerender` function, track the "common" font size (mode) to identify body text.
3.  Identify text with `transform[0]` significantly larger (e.g., > 1.2x) than body text as "headers".
4.  Store these headers in a separate field (e.g., `h1`, `h2`) or simply append them to a `headers` array in the index item to give them higher weight in Fuse.js.

---

## 2. Fuse.js Index Serialization

### Context
Fuse.js allows pre-generating the search index on the server (`Fuse.createIndex`) to save client-side CPU time. We investigated if this is worth the complexity for our current dataset.

### Benchmark Results
Tests were run on the existing dataset (1445 items, ~2.8MB raw JSON).

| Metric | Value |
| :--- | :--- |
| **Raw Data Size (`list.json`)** | **2.85 MB** |
| **Serialized Index Size** | **2.47 MB** |
| **Client-side Indexing Time** | **~12 ms** |
| **Pre-computed Loading Time** | **~0.03 ms** |

### Analysis
1.  **Time Savings**: The time saved by pre-computing is ~12ms. This is imperceptible to the user.
2.  **Payload Size**:
    *   To display search results, we still need the raw data (title, content snippet, etc.).
    *   If we use pre-computed indexes, we would need to download **both** the Raw Data (2.85 MB) AND the Index (2.47 MB), totaling **~5.3 MB**.
    *   If we do client-side indexing, we only download the Raw Data (2.85 MB).
3.  **Complexity**: Pre-computing requires a more complex build pipeline and client-side initialization logic.

### Recommendation
**Decision**: **Do NOT** use pre-computed indexes. Stick to Client-side Indexing (Data-only).

**Rationale**:
The CPU cost of indexing on the client (~12ms) is negligible compared to the network cost of downloading the additional index file (2.5 MB). Doubling the payload size to save 12ms of main-thread time is a bad trade-off.

**Future Considerations**:
If the dataset grows significantly (e.g., > 10MB or > 50k items) where indexing takes > 100ms, we should revisit this. At that point, we might consider a server-side search solution (like MeiliSearch or Algolia) rather than shipping a larger static index to the client.
