# Tasks: Optimize Search and Indexing Efficiency

**Feature**: `002-optimize-search`
**Status**: Draft
**Spec**: [specs/002-optimize-search/spec.md](./spec.md)

## Phase 1: Setup

*Goal: Initialize project structure and update data models.*

- [x] T001 Define `SearchIndexItem` interface with headers in `src/lib/types.ts`
- [x] T002 Create contract schema for search index in `specs/002-optimize-search/contracts/search-schema.ts` (Already created)

## Phase 2: User Story 1 & 2 - Relevance & Indexing

*Goal: Implement improved indexing with header extraction and search weighting.*
*Priority: P1*

**Independent Test**:
1. Run `npm run build:index` and verify `public/search-index.json` contains `headers` array.
2. Search for a term that appears in a header and verify it ranks higher than body text matches.

### Implementation

- [x] T003 [US1] [US2] Create PDF header extraction utility in `src/scripts/pdf-parser.ts` (or inline in generate-index) using `transform[0]` logic
- [x] T004 [US1] [US2] Update `src/scripts/generate-index.ts` to use header extraction and populate `headers` field
- [x] T005 [US1] [US2] Update `src/lib/search.ts` Fuse.js configuration to include `headers` in keys with high weight (e.g., 0.8)
- [x] T006 [US1] [US2] Tune Fuse.js weights: Title (0.9), Headers (0.8), Content (0.2) in `src/lib/search.ts`

## Phase 3: User Story 1 - Instant Feedback

*Goal: Ensure search is responsive and UI is optimized.*
*Priority: P1*

**Independent Test**:
1. Type fast and verify no UI freezing.
2. Verify results update in <100ms.

### Implementation

- [x] T007 [US1] Verify debouncing logic in `src/components/features/SearchBar.tsx` (add if missing)
- [x] T008 [US1] Optimize `initSearch` in `src/lib/search.ts` to ensure singleton pattern is correctly used to avoid re-indexing on every keystroke

## Phase 4: User Story 3 - Build Optimization

*Goal: Minimize index file size.*
*Priority: P2*

**Independent Test**:
1. Compare `public/search-index.json` size before and after whitespace normalization.

### Implementation

- [x] T009 [US3] Implement aggressive whitespace normalization in `src/scripts/generate-index.ts` (replace multiple spaces/newlines with single space)
- [x] T010 [US3] Strip non-searchable artifacts (e.g., page numbers mixed in text) if possible during PDF parsing in `src/scripts/generate-index.ts` (Handled by normalizeWhitespace in parser)

## Final Phase: Polish

*Goal: UX improvements.*

- [x] T011 Update `src/components/features/SearchResults.tsx` to display matching snippets/headers if available (optional enhancement)

## Dependencies

1. **Setup** (T001, T002) MUST complete first.
2. **Indexing** (T003, T004) MUST complete before **Search Tuning** (T005, T006).
3. **UI Optimization** (T007, T008) can run in parallel with Indexing.

## Parallel Execution Opportunities

- T003 (PDF Parsing Logic) and T007 (UI Debouncing) can be developed simultaneously.
- T006 (Weight Tuning) depends on T004 (Index Generation) but T008 (Singleton Optimization) is independent.

## Implementation Strategy

1.  **MVP**: Implement T001, T003, T004, T005. This delivers the core value (Header extraction + Relevance).
2.  **Performance**: Then implement T007, T008, T009 to ensure speed and size constraints are met.
