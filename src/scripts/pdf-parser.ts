import fs from 'fs';
import pdf from 'pdf-parse';

export interface ParsedPage {
  text: string;
  headers: string[];
}

export interface ParsedPdf {
  text: string;
  numpages: number;
  info: any;
  pages: ParsedPage[];
}

export async function parsePdf(filePath: string): Promise<ParsedPdf> {
  const dataBuffer = fs.readFileSync(filePath);
  const pages: ParsedPage[] = [];

  const options = {
    pagerender: (pageData: any) => {
      const renderOptions = {
        normalizeWhitespace: true,
        disableCombineTextItems: false,
      };
      return pageData.getTextContent(renderOptions).then((textContent: any) => {
        let fullPageText = '';
        const items = textContent.items;

        if (items.length === 0) {
          pages.push({ text: '', headers: [] });
          return '';
        }

        // 1. Calculate mode font size (likely body text)
        const sizeCounts: Record<number, number> = {};
        for (const item of items) {
          // transform[0] is scaling factor (approx font size)
          // Round to nearest integer to group similar sizes
          const size = Math.round(item.transform[0]);
          sizeCounts[size] = (sizeCounts[size] || 0) + item.str.length; // Weight by text length
        }

        let modeSize = 0;
        let maxCount = 0;
        for (const size in sizeCounts) {
          if (sizeCounts[size] > maxCount) {
            maxCount = sizeCounts[size];
            modeSize = Number(size);
          }
        }

        // 2. Extract headers (text significantly larger than mode)
        // Threshold: 1.15x larger than body text
        const HEADER_THRESHOLD_RATIO = 1.15;
        const extractedHeaders: string[] = [];
        let currentHeader = '';

        // 3. Reconstruct text and extract headers
        let lastY: number | undefined;

        for (const item of items) {
          const fontSize = item.transform[0];

          // Reconstruct full text
          if (lastY === item.transform[5] || lastY === undefined) {
            fullPageText += item.str;
          } else {
            fullPageText += '\n' + item.str;
          }
          lastY = item.transform[5];

          // Check for header
          if (fontSize > modeSize * HEADER_THRESHOLD_RATIO && item.str.trim().length > 0) {
             // Heuristic: If it's on the same line (same Y) or very close, append.
             // Ideally we'd check Y coordinate, but simple concatenation works for now.
             currentHeader += item.str + ' ';
          } else {
             if (currentHeader.trim().length > 0) {
               extractedHeaders.push(currentHeader.trim());
               currentHeader = '';
             }
          }
        }

        // Push last header if exists
        if (currentHeader.trim().length > 0) {
          extractedHeaders.push(currentHeader.trim());
        }

        pages.push({ text: fullPageText, headers: extractedHeaders });
        return fullPageText;
      });
    },
  };

  try {
    const data = await pdf(dataBuffer, options);
    return {
      text: data.text,
      numpages: data.numpages,
      info: data.info,
      pages,
    };
  } catch (error) {
    console.error(`Error parsing PDF ${filePath}:`, error);
    throw error;
  }
}
