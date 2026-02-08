import { createRequire } from 'module';
const require = createRequire(import.meta.url);
try {
  const pdf = require('pdf-parse');
  console.log('Required pdf-parse:', pdf);
  console.log('Type:', typeof pdf);
} catch (e) {
  console.error('Error requiring:', e);
}

import * as pdfImport from 'pdf-parse';
console.log('Import * as pdfImport:', pdfImport);

import pdfDefault from 'pdf-parse';
console.log('Import default:', pdfDefault);
