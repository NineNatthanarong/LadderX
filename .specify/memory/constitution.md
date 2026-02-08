<!--
SYNC IMPACT REPORT
Version Change: 0.0.0 -> 1.0.0 (Initial Ratification)
Modified Principles:
- Established "Library-First Architecture"
- Established "CLI-Driven Operations"
- Established "Test-First Methodology"
- Established "Radical Simplicity"
- Established "User Experience Priority"
Templates Verified:
- .specify/templates/plan-template.md (Aligned)
- .specify/templates/spec-template.md (Aligned)
- .specify/templates/tasks-template.md (Aligned)
-->

# LadderX Constitution

## Core Principles

### I. Library-First Architecture
Core business logic (such as data indexing, search algorithms, and data transformation) MUST be implemented as standalone, testable libraries or modules (e.g., `src/lib/`, `src/scripts/`). These modules must be decoupled from the UI framework (Next.js components) to ensure reusability, testability, and clear separation of concerns.

### II. CLI-Driven Operations
Critical data operations, especially build-time tasks like index generation, MUST be executable via Command Line Interface (CLI) scripts (e.g., `npm run build:index`). This ensures that data pipelines are automatable, reproducible, and distinct from the runtime web application.

### III. Test-First Methodology
Tests for core logic (libraries and utilities) MUST be planned or written before implementation. A "Red-Green-Refactor" mindset is encouraged. Critical paths (search accuracy, index generation integrity) require high test coverage.

### IV. Radical Simplicity
Complexity is a liability. Avoid complex backends, databases, or third-party services unless absolutely necessary. For documentation and content sites, prefer Static Site Generation (SSG) and client-side logic (e.g., pre-built JSON indices) to maximize performance and minimize maintenance.

### V. User Experience Priority
"Best-in-class" UX/UI is a functional requirement, not a "nice-to-have". Performance (e.g., search latency < 200ms), accessibility (WCAG AA compliance), and responsive design are non-negotiable quality gates for shipping.

## Technical Standards

### Technology Stack
- **Framework**: Next.js (App Router) with TypeScript.
- **Styling**: Tailwind CSS for utility-first styling.
- **Search**: Client-side fuzzy search (e.g., Fuse.js) for static content.
- **Data**: File-based sources (Markdown/PDF) transformed to static JSON.

### Code Quality
- All code must be strongly typed (TypeScript).
- No `any` types unless strictly necessary and commented.
- Components must be modular and follow the "Single Responsibility Principle".

## Governance

### Supremacy
This Constitution supersedes all other project documentation and practices. In conflicts between speed and these principles, these principles prevail.

### Amendments
Amendments to this Constitution require:
1.  A documented Pull Request or Request for Comment (RFC).
2.  Explicit justification for why the change enables better outcomes.
3.  Migration plans for any code non-compliant with the new rules.

### Compliance
- All Architecture Plans (`plan.md`) must explicitly check against these principles.
- Code Reviews must verify compliance before merging.

**Version**: 1.0.0 | **Ratified**: 2026-02-08 | **Last Amended**: 2026-02-08
