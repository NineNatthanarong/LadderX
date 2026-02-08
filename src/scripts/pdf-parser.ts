import fs from 'fs';
import pdf from 'pdf-parse';

export async function parsePdf(filePath: string) {
  const dataBuffer = fs.readFileSync(filePath);
  const pages: string[] = [];

  const options = {
    pagerender: (pageData: any) => {
      const renderOptions = {
        normalizeWhitespace: false,
        disableCombineTextItems: false,
      };
      return pageData.getTextContent(renderOptions).then((textContent: any) => {
        let text = '';
        let lastY: number | undefined;
        for (const item of textContent.items) {
          if (lastY === item.transform[5] || lastY === undefined) {
            text += item.str;
          } else {
            text += '\n' + item.str;
          }
          lastY = item.transform[5];
        }
        pages.push(text);
        return text;
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
