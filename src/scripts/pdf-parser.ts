import fs from 'fs';
import pdf from 'pdf-parse';

export async function parsePdf(filePath: string) {
  const dataBuffer = fs.readFileSync(filePath);

  try {
    const data = await pdf(dataBuffer);
    return {
      text: data.text,
      numpages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error(`Error parsing PDF ${filePath}:`, error);
    throw error;
  }
}
