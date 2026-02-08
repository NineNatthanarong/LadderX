# Tasks: Syntax Documentation Website

**Feature Branch**: `001-syntax-doc-site`
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Phase 1: Setup & Configuration
*Goal: Initialize project structure and dependencies.*

- [x] T001 Initialize Next.js project with TypeScript and Tailwind CSS in `.`
- [x] T002 Install dependencies (`pdf-parse`, `fuse.js`, `lucide-react`, `clsx`, `tailwind-merge`)
- [x] T003 Create project directory structure (`src/lib`, `src/components`, `src/scripts`, `data`) per plan
- [x] T004 Define shared types (`Document`, `SearchIndexItem`) in `src/lib/types.ts` matching `data-model.md`

## Phase 2: Foundational (Indexing Engine)
*Goal: Create the build-time script to transform PDFs into a searchable JSON index. Blocks all user stories.*

- [x] T005 [P] Implement PDF text extraction logic in `src/scripts/pdf-parser.ts` using `pdf-parse`
- [x] T006 Implement index generation script in `src/scripts/generate-index.ts` (scans `/data`, extracts text, writes `public/search-index.json`)
- [x] T007 Add `build:index` script to `package.json` and verify it runs successfully
- [x] T008 [P] Create utility `src/lib/data-loader.ts` to fetch/load `search-index.json` on the client

## Phase 3: User Story 1 - Search for Syntax (Priority P1)
*Goal: Implement instant full-text search.*

- [x] T009 [US1] Implement Fuse.js wrapper service in `src/lib/search.ts` (config, fuzzy matching)
- [x] T010 [P] [US1] Create `SearchBar` component in `src/components/features/SearchBar.tsx` (UI input)
- [x] T011 [P] [US1] Create `SearchResults` component in `src/components/features/SearchResults.tsx` (List view with highlighting)
- [x] T012 [US1] Integrate Search and Results into Homepage `src/app/page.tsx`
- [x] T013 [US1] Implement "No Results" and "Loading" states in `src/components/features/SearchResults.tsx`

## Phase 4: User Story 2 - Browse Documentation (Priority P1)
*Goal: Navigate documentation via folder structure.*

- [x] T014 [US2] Implement tree structure utility in `src/lib/structure.ts` (convert flat index to nested categories)
- [x] T015 [P] [US2] Create `Sidebar` component in `src/components/layout/Sidebar.tsx` (Recursive tree view)
- [x] T016 [US2] Integrate `Sidebar` into global layout `src/app/layout.tsx`
- [x] T017 [US2] Implement active state styling in `Sidebar` (highlight current category/doc)

## Phase 5: User Story 3 - View Documentation (Priority P2)
*Goal: Read PDF content within the app.*

- [x] T018 [US3] Create `DocViewer` component in `src/components/features/DocViewer.tsx` (Native `iframe` or `object` implementation)
- [x] T019 [US3] Create dynamic route `src/app/docs/[...slug]/page.tsx` to handle document viewing
- [x] T020 [US3] Implement "Back to Search" or Breadcrumbs navigation in `src/components/layout/Header.tsx`

## Phase 6: Polish & UI/UX
*Goal: Ensure "Best UX/UI" and responsiveness.*

- [ ] T021 [P] Apply refined Tailwind typography and spacing system in `src/app/globals.css`
- [x] T022 Ensure Sidebar is collapsible/responsive on mobile in `src/components/layout/Sidebar.tsx`
- [x] T023 Implement keyboard shortcuts (e.g., `Cmd+K` to focus search) in `src/components/features/SearchBar.tsx`
- [ ] T024 Verify Accessibility (Aria labels, focus states) across all components

## Dependencies
- **Phase 2 (Indexing)** blocks **Phase 3, 4, 5** (Requires data)
- **Phase 3 (Search)** independent of **Phase 4 (Browse)**
- **Phase 5 (View)** depends on routing established in **Phase 4**

## Implementation Strategy
- **MVP**: Complete Phase 1, 2, and 3 (Searchable index).
- **Full Feature**: Complete Phase 4 and 5 (Browsing and Viewing).
