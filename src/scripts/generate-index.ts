import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { parsePdf } from './pdf-parser';
import { SearchIndexItem } from '../lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'search-index.json');

// Ensure public directory exists
if (!fs.existsSync(path.join(process.cwd(), 'public'))) {
  fs.mkdirSync(path.join(process.cwd(), 'public'));
}

async function walkDir(dir: string): Promise<string[]> {
  const files = await fs.promises.readdir(dir);
  const paths: string[] = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.promises.stat(filePath);

    if (stat.isDirectory()) {
      paths.push(...(await walkDir(filePath)));
    } else if (file.toLowerCase().endsWith('.pdf')) {
      paths.push(filePath);
    }
  }

  return paths;
}

function generateId(input: string): string {
  return crypto.createHash('md5').update(input).digest('hex');
}

async function generateIndex() {
  console.log('Starting index generation...');

  if (!fs.existsSync(DATA_DIR)) {
    console.warn(`Data directory not found at ${DATA_DIR}. Creating empty index.`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify([]));
    return;
  }

  const pdfFiles = await walkDir(DATA_DIR);
  console.log(`Found ${pdfFiles.length} PDF files.`);

  const indexItems: SearchIndexItem[] = [];

  for (const filePath of pdfFiles) {
    console.log(`Processing ${path.relative(process.cwd(), filePath)}...`);

    try {
      const parsed = await parsePdf(filePath);
      const relativePath = path.relative(DATA_DIR, filePath);
      const pathParts = relativePath.split(path.sep);
      const filename = pathParts.pop() || '';
      const category = pathParts.length > 0 ? pathParts.join('/') : 'Uncategorized';

      const docId = generateId(relativePath);

      // Create one index item per page for accurate page-level search
      for (let pageIdx = 0; pageIdx < parsed.pages.length; pageIdx++) {
        const pageText = parsed.pages[pageIdx].replace(/\s+/g, ' ').trim();
        if (!pageText) continue; // skip blank pages

        const item: SearchIndexItem = {
          id: generateId(`${docId}_page_${pageIdx + 1}`),
          documentId: docId,
          title: filename.replace('.pdf', ''),
          category,
          pageNumber: pageIdx + 1,
          content: pageText,
          path: relativePath,
        };

        indexItems.push(item);
      }

    } catch (error) {
      console.error(`Failed to process ${filePath}`, error);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexItems, null, 2));
  console.log(`Index generated with ${indexItems.length} items at ${OUTPUT_FILE}`);
}

generateIndex().catch(console.error);
