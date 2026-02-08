# Implementation Plan: Optimize Search and Indexing Efficiency

**Branch**: `002-optimize-search` | **Date**: 2026-02-08 | **Spec**: [specs/002-optimize-search/spec.md](./spec.md)
**Input**: Feature specification from `specs/002-optimize-search/spec.md`

## Summary

The goal is to optimize the search experience by improving speed (<100ms), relevance (prioritizing titles/headers), and index size. The approach involves moving index generation to build-time, extracting structural data (headers) from PDFs to improve relevance, and optimizing the client-side Fuse.js implementation.

## Technical Context

**Language/Version**: TypeScript 5 / Node.js 20
**Primary Dependencies**: Next.js 16, Fuse.js 7, pdf-parse (currently), Tailwind CSS
**Storage**: Static JSON file (`public/search-index.json`)
**Testing**: Manual verification, potential unit tests for index generation
**Target Platform**: Web (Next.js Static/SSR)
**Performance Goals**: Search latency < 100ms, Index size minimized
**Constraints**: Client-side search (no external search service like Algolia/Elasticsearch)

## Constitution Check

**Principle: Simple & Robust**
- Is this solution simple? Yes, leverages existing Fuse.js but moves work to build time.
- Is it robust? Yes, static generation is reliable and deterministic.

**Principle: User-Centric**
- Does it improve speed? Yes, by pre-computing indices and optimizing payloads.
- Does it improve relevance? Yes, by extracting headers to provide better context matches.

## Gates

- [x] **Research Complete**: Best PDF parsing method for headers identified. (Decision: Use `pdf-parse` with custom logic)
- [x] **Research Complete**: Fuse index serialization strategy verified. (Decision: Keep client-side indexing)
- [x] **Design Approved**: Data model updates for `SearchIndexItem`.

## Phase 0: Research

1.  **Research PDF Parsing**:
    -   **Context**: Current `pdf-parse` library dumps raw text, losing structure.
    -   **Unknown**: Can we reliably extract headers (font size/weight) using `pdf-parse`, `pdfjs-dist`, or `pdf2json` in a Node.js environment?
    -   **Outcome**: Confirmed `pdf-parse` exposes `transform` matrix. We will use `transform[0]` (font scale) to identify headers relative to body text.

2.  **Research Fuse Serialization**:
    -   **Context**: We currently load raw data and instantiate Fuse on the client.
    -   **Unknown**: Does `Fuse.createIndex` + exporting the index result in a smaller payload and faster load time compared to raw JSON?
    -   **Outcome**: No. Pre-computed index is ~2.5MB, Raw data is ~2.8MB. Using pre-computed requires downloading BOTH (~5.3MB). CPU time saved is negligible (~12ms). Decision: **Stick to Data-only**.

## Phase 1: Implementation Strategy

1.  **Data Model**:
    -   Update `SearchIndexItem` to include `headers: string[]`.
    -   See `data-model.md` and `contracts/search-schema.ts`.
2.  **Build Script (`src/scripts/generate-index.ts`)**:
    -   Update `pdf-parse` logic to inspect `pagerender` callback.
    -   Calculate mode font size for each page (body text).
    -   Extract text with font size > 1.2x mode as headers.
    -   Add `headers` to the JSON output.
3.  **Client (`src/lib/search.ts`)**:
    -   Update Fuse keys to include `headers` with high weight (e.g., 0.8).
    -   Keep `title` high (0.9), `content` lower (0.2).
    -   Implement snippet generation (if not already present).

## Phase 2: Verification

1.  **Benchmarks**:
    -   Verify index generation time.
    -   Verify client-side search latency.
    -   Verify relevance (Headers > Content).

## Project Structure

### Documentation (this feature)

```text
specs/002-optimize-search/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code

```text
src/
├── scripts/
│   └── generate-index.ts  # Build script for indexing
├── lib/
│   ├── search.ts          # Client-side search logic
│   └── types.ts           # Search interfaces
└── components/
    └── Search.tsx         # (Assumed) Search UI component
```
