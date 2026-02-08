# Tasks: Enhance UX/UI and User Flow

**Feature Branch**: `002-enhance-ux-ui`
**Spec**: [specs/002-enhance-ux-ui/spec.md](specs/002-enhance-ux-ui/spec.md)
**Plan**: [specs/002-enhance-ux-ui/plan.md](specs/002-enhance-ux-ui/plan.md)

## Phase 1: Setup & Infrastructure
**Goal**: Initialize the development environment with necessary dependencies and global state configurations.

- [x] T001 Install dependencies (`cmdk`, `clsx`, `tailwind-merge`) via npm
- [x] T002 Install testing stack (`vitest`, `@testing-library/react`, `jsdom`) via npm
- [x] T003 Create `vitest.config.ts` configured for Next.js/React environment
- [x] T004 Create `src/lib/test-utils.tsx` for testing providers (if needed) or setup file
- [x] T005 Create `src/components/providers/NavigationContext.tsx` to manage sidebar/mobile state
- [x] T006 Update `src/app/layout.tsx` to wrap application with `NavigationProvider`
- [x] T007 Define Tailwind CSS variables for typography and theme colors in `src/app/globals.css`

## Phase 2: Immersive Reading (User Story 1)
**Goal**: Create a distraction-free reading experience with sticky navigation and optimized typography.
**Priority**: P1

- [x] T008 [US1] Create `src/hooks/use-toc.ts` implementing the logic to track active headings
- [x] T009 [P] [US1] Create unit test `src/hooks/use-toc.test.ts` verifying observer logic
- [x] T010 [US1] Create `src/components/features/TableOfContents.tsx` using `use-toc` hook
- [x] T011 [US1] Refactor `src/app/docs/[...slug]/page.tsx` to use a grid layout with sticky TOC
- [x] T012 [P] [US1] Update `src/components/features/DocViewer.tsx` to ensure typography meets readability standards (line-height, max-width)
- [x] T013 [US1] Implement "Next/Previous Article" links in `src/components/features/DocViewer.tsx` or parent page

## Phase 3: Intuitive Search (User Story 2)
**Goal**: Implement "Command Palette" search (`Cmd+K`) for instant discovery.
**Priority**: P1

- [x] T014 [US2] Create `src/hooks/use-search.ts` wrapping Fuse.js logic (adhering to contracts/hooks.ts.md)
- [x] T015 [P] [US2] Create unit test `src/hooks/use-search.test.ts` verifying result transformation
- [x] T016 [US2] Create `src/components/features/CommandMenu.tsx` using `cmdk` library
- [x] T017 [US2] Implement breadcrumb logic in `CommandMenu` results to show context
- [x] T018 [US2] Integrate `CommandMenu` into `src/app/layout.tsx` with `Cmd+K` global listener
- [x] T019 [US2] Remove old search bar from `src/components/layout/Sidebar.tsx` (if replacing completely) or update trigger

## Phase 4: Mobile Navigation (User Story 3)
**Goal**: Responsive layout with hamburger menu for mobile devices.
**Priority**: P2

- [x] T020 [US3] Create `src/components/layout/MobileNav.tsx` consuming `NavigationContext`
- [x] T021 [US3] Update `src/components/layout/Header.tsx` (or create if missing) to include Hamburger button
- [x] T022 [US3] Refactor `src/components/layout/Sidebar.tsx` to support "drawer" mode on mobile (hidden by default)
- [x] T023 [P] [US3] Add responsive utility classes to `src/app/layout.tsx` grid to stack elements on mobile

## Phase 5: Polish & Accessibility
**Goal**: Ensure "Beautiful" and "Easy to use" criteria are fully met.

- [ ] T024 Create `src/components/features/ThemeToggle.tsx` for Dark/Light mode switching
- [ ] T025 Run accessibility audit (manual or automated) to verify contrast ratios
- [ ] T026 Verify "Next/Prev" navigation links cover all edge cases (first/last articles)
- [ ] T027 Final manual test of "Immersive Reading" flow (Story 1)
- [ ] T028 Final manual test of "Search" flow (Story 2)

## Implementation Strategy
1.  **Start with T001-T007** to get the "skeleton" and test runner ready.
2.  **Move to Story 2 (Search)** immediately if it's the highest technical risk (new library `cmdk`), OR stick to **Story 1 (Reading)** if visual layout is the priority. *Recommendation: Do Story 2 first as it is a discrete component.*
3.  **Complete Story 1** to settle the main page layout.
4.  **Finish with Story 3** to make the layout responsive.
