# Research Findings: Syntax Documentation Website

**Feature Branch**: `001-syntax-doc-site`
**Date**: 2026-02-08

## 1. PDF Text Extraction (Build Time)

**Problem**: We need to extract text from PDF files in `/data` to create a searchable JSON index.
**Candidates**: `pdf-parse`, `pdfjs-dist`, `pdf-lib`.

*   **Decision**: **`pdf-parse`**
*   **Rationale**: It is a lightweight Node.js wrapper around PDF.js, specifically designed for text extraction. It has zero runtime dependencies for the browser (since we run it at build time). `pdfjs-dist` is more complex to set up for simple text extraction in Node.
*   **Alternatives**:
    *   `pdfjs-dist`: Too complex for simple text extraction.
    *   `tesseract.js`: OCR is overkill unless PDFs are images (assuming standard syntax docs are text-based).

## 2. Client-Side Search Engine

**Problem**: We need "instant" search (<200ms) with typo tolerance (fuzzy matching) for the JSON index.
**Candidates**: `fuse.js`, `flexsearch`, `lunr.js`, Raw `filter()`.

*   **Decision**: **`fuse.js`**
*   **Rationale**: Excellent fuzzy search capabilities (handling typos as requested in User Story 1). Lightweight and easy to integrate with React. Performance is sufficient for moderate datasets (syntax docs).
*   **Alternatives**:
    *   `flexsearch`: Faster but fuzzy matching is less intuitive configuration-wise.
    *   Raw `filter()`: No typo tolerance.

## 3. UI/UX Framework

**Problem**: Requirement is "Best UX/UI".
**Candidates**: Custom CSS, Tailwind CSS, Material UI, Mantine.

*   **Decision**: **Tailwind CSS + shadcn/ui (Radix UI)**
*   **Rationale**: Industry standard for "modern" web design. Provides accessible, high-quality components (Radix) with complete styling control (Tailwind).
*   **Alternatives**:
    *   Material UI: Can look generic/"Google-y".
    *   Mantine: Good, but Tailwind is more flexible for custom "best UX".

## 4. PDF Rendering (Viewing)

**Problem**: User needs to view PDF content.
**Candidates**: Native Browser Viewer (`iframe`/`object`), `react-pdf`.

*   **Decision**: **Native Browser Viewer (`iframe` / `<object>`)**
*   **Rationale**: Simplest implementation, zero bundle size overhead, consistent behavior. `react-pdf` adds significant weight to the bundle and rendering overhead.
*   **Fallback**: If strict custom UI controls are needed later, we can switch to `react-pdf`, but native is best MVP.

## Summary of Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Search**: Fuse.js
- **Build Script**: Node.js + `pdf-parse`
- **Testing**: Vitest + React Testing Library
