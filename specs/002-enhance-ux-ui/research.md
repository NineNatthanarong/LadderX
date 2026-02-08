# Research & Decisions

**Feature**: Enhance UX/UI and User Flow
**Date**: 2026-02-08

## Decision 1: Test Framework
**Decision**: Use **Vitest** with **React Testing Library**.
**Rationale**:
- Constitution mandates "Test-First Methodology".
- The current `package.json` has no test runner.
- Vitest is the modern standard for Vite/Next.js ecosystems (faster than Jest, native ESM support).
- Compatible with existing Next.js 16 app router patterns.

**Alternatives Considered**:
- **Jest**: Slower, configuration heavy for TypeScript/ESM.
- **Playwright**: Good for E2E, but too heavy for unit/component testing logic.

## Decision 2: Search UI Implementation
**Decision**: Use **`cmdk`** (by pacocoursey).
**Rationale**:
- Requirements call for a "Spotlight-style" command palette.
- `cmdk` is unstyled, accessible (handles focus trap, aria attributes), and lightweight.
- Fits "Radical Simplicity" by not imposing a design system, just behavior.
- Allows us to pipe our existing Fuse.js results directly into it.

**Alternatives Considered**:
- **Custom React Modal**: High risk of accessibility bugs (focus management, screen readers).
- **Algolia / External**: Violates "Radical Simplicity" (no 3rd party services).

## Decision 3: Styling Strategy
**Decision**: **Tailwind CSS v4** (Existing) + **CSS Variables** for Theme.
**Rationale**:
- Already installed.
- v4 offers better performance and simpler configuration.
- Dark mode support via CSS variables is standard and prevents "flash of unstyled content".
- Fluid typography can be implemented via `clamp()` in Tailwind utilities.

## Decision 4: State Management
**Decision**: **React Context** for UI State (Mobile Menu, Search Open).
**Rationale**:
- Simple boolean states do not require Redux/Zustand.
- Keeps dependencies low.

**Action Items**:
1. Install `vitest`, `@testing-library/react`, `@testing-library/dom`, `jsdom`.
2. Install `cmdk`.
