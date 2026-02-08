# Quickstart: Enhance UX/UI Feature

## Prerequisites

- Node.js 20+
- npm

## Setup

1. **Install new dependencies**:
   ```bash
   npm install cmdk
   npm install -D vitest @testing-library/react @testing-library/dom jsdom
   ```

2. **Run Tests**:
   ```bash
   npm test
   # or
   npx vitest
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

4. **Verify Search Index**:
   Ensure the index is generated before testing search:
   ```bash
   npm run build:index
   ```

## Development Workflow

1. **Modify Logic**: Edit `src/hooks/` or `src/lib/`.
2. **Verify**: Run `npx vitest related src/path/to/changed/file.ts`.
3. **UI Check**: Open `http://localhost:3000` to verify visual changes.

## Key Files
- `src/components/features/CommandMenu.tsx`: The new search UI.
- `src/app/layout.tsx`: Root layout handling theme and global providers.
