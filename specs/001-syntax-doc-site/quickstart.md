# Quickstart: Syntax Documentation Site

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Prepare Data**:
    Ensure PDF files are located in the `/data` directory at the project root (or symlinked).

    ```bash
    # Example structure
    /data
      /PART 1
        doc1.pdf
    ```

3.  **Generate Index**:
    Run the indexer script to parse PDFs and create `public/search-index.json`.

    ```bash
    npm run build:index
    ```

4.  **Run Development Server**:

    ```bash
    npm run dev
    ```
    Open http://localhost:3000

## Build

```bash
npm run build
```
This will:
1.  Run `build:index` to refresh data.
2.  Build the Next.js application.

## Testing

```bash
npm test
```
Runs unit tests with Vitest.
