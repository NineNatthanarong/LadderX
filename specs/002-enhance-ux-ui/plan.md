# Implementation Plan: Enhance UX/UI and User Flow

**Branch**: `002-enhance-ux-ui` | **Date**: 2026-02-08 | **Spec**: [specs/002-enhance-ux-ui/spec.md](specs/002-enhance-ux-ui/spec.md)
**Input**: Feature specification from `/specs/002-enhance-ux-ui/spec.md`

## Summary

Revamp the frontend to provide an immersive reading experience and instant content discovery. This includes implementing a "Command Palette" search (`Cmd+K`), a mobile-responsive sidebar with hamburger menu, fluid typography for readability, and contextual navigation (breadcrumbs, next/prev links). The implementation will use Next.js Client Components for interactivity while maintaining the static-first architecture.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**: Next.js 16.1.6, React 19, Tailwind CSS 4, Fuse.js (existing), `cmdk` (new - for accessible command palette), `clsx/tailwind-merge`.
**Storage**: File-system based (PDFs -> JSON Index). No database.
**Testing**: Vitest + React Testing Library (New requirement to meet Constitution "Test-First").
**Target Platform**: Web (Responsive: Mobile 320px to Desktop).
**Performance Goals**: Search < 100ms, LCP < 2.5s, CLS < 0.1.
**Constraints**: WCAG AA Compliance, strict no-database architecture.
**Scale/Scope**: ~20-50 pages of documentation, single-page application feel.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Library-First Architecture**: Search logic remains in `src/lib/search.ts`. UI components will consume these pure functions.
- [x] **CLI-Driven Operations**: Index generation `npm run build:index` is preserved.
- [x] **Test-First Methodology**: **ACTION REQUIRED**: We must install `vitest` and write tests for the search hook and new navigation logic *before* implementation.
- [x] **Radical Simplicity**: Using `cmdk` (lightweight primitive) instead of heavy UI libraries. No new backend services.
- [x] **User Experience Priority**: This feature directly addresses this principle.

## Project Structure

### Documentation (this feature)

```text
specs/002-enhance-ux-ui/
├── plan.md              # This file
├── research.md          # Technology choices and rationale
├── data-model.md        # UI State and Entity definitions
├── quickstart.md        # Dev environment setup
├── contracts/           # Internal Hook Interfaces
│   └── hooks.ts.md
└── tasks.md             # Implementation tasks
```

### Source Code

```text
src/
├── app/
│   ├── layout.tsx            # Updated global layout (Mobile nav provider)
│   ├── page.tsx              # Updated Homepage
│   └── docs/[...slug]/
│       └── page.tsx          # Updated Doc View (TOC, Breadcrumbs)
├── components/
│   ├── features/
│   │   ├── CommandMenu.tsx   # NEW: Cmd+K Search Modal
│   │   ├── TableOfContents.tsx # NEW: Sticky TOC
│   │   └── ThemeToggle.tsx   # NEW: Dark mode toggle
│   ├── layout/
│   │   ├── MobileNav.tsx     # NEW: Hamburger menu
│   │   └── Sidebar.tsx       # Refactored for nesting/active states
│   └── ui/                   # Reusable atoms (Button, Dialog - if needed)
├── hooks/
│   ├── use-search.ts         # NEW: Search logic hook
│   └── use-toc.ts            # NEW: Table of contents observer
└── lib/
    └── search.ts             # Existing (Enhance if needed)
```

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| `cmdk` dependency | Accessible, composable command palette primitive | Building accessible modals/comboboxes from scratch is error-prone and high-effort. `cmdk` is standard (2kb). |
| Vitest installation | Constitution requires Test-First | Manual testing is insufficient for "Best-in-class" UX guarantees. |
