# Implementation Plan: Syntax Documentation Website

**Branch**: `001-syntax-doc-site` | **Date**: 2026-02-08 | **Spec**: [Link](spec.md)
**Input**: Feature specification from `/specs/001-syntax-doc-site/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

Develop a modern, high-performance documentation website using **Next.js**. The system will index PDF files from the `/data` folder at build time using **pdf-parse** to create a client-side JSON search index. The UI will use **Tailwind CSS** for a "best-in-class" design, featuring instant fuzzy search via **Fuse.js** and a hierarchical navigation sidebar.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 18+ (LTS)
**Primary Dependencies**:
- `next` (Framework)
- `react`, `react-dom` (UI)
- `tailwindcss` (Styling)
- `fuse.js` (Search)
- `pdf-parse` (Build-time extraction)
- `lucide-react` (Icons)
**Storage**: Static JSON index (File-based)
**Testing**: `vitest` + `react-testing-library`
**Target Platform**: Web (Static Export or Node Server)
**Performance Goals**: Search results < 200ms
**Constraints**: Responsive Design, Accessibility (WCAG AA)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Library-First**: Core logic (indexing) will be modular scripts.
- [x] **CLI Interface**: Indexing is driven by CLI scripts (`npm run build:index`).
- [x] **Test-First**: Unit tests for search logic and indexer.
- [x] **Simplicity**: No complex backend; static generation approach.

## Project Structure

### Documentation (this feature)

```text
specs/001-syntax-doc-site/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # Data entities
├── quickstart.md        # Dev guide
├── contracts/           # API/Data schemas
│   └── search-index.schema.json
└── tasks.md             # To be generated
```

### Source Code (repository root)

```text
# Next.js App Router Structure
src/
├── app/                 # Pages & Layouts
│   ├── page.tsx         # Homepage (Search + Listing)
│   ├── layout.tsx       # Global layout (Sidebar provider)
│   └── [category]/      # Dynamic routes (optional)
├── components/          # React Components
│   ├── ui/              # Reusable UI (Button, Input, etc.)
│   ├── features/        # Feature-specific (SearchBar, DocViewer)
│   └── layout/          # Sidebar, Header
├── lib/                 # Utilities
│   ├── search.ts        # Search logic (Fuse.js wrapper)
│   └── indexer.ts       # Types & helpers
└── scripts/
    └── generate-index.ts # Build script to parse PDFs

public/
└── search-index.json    # Generated artifact
```

**Structure Decision**: Standard Next.js App Router structure ensures modularity and easy routing. Separation of `scripts/` keeps build logic distinct from app logic.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Next.js | Routing & SSG | Vanilla HTML/JS is too hard to manage state/components for "Best UX". |
| Fuse.js | Fuzzy matching | Native string matching fails on typos (User Story 1). |
