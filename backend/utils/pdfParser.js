import PDFParser from 'pdf2json';

export const parsePDF = async (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const text = decodeURIComponent(pdfData.Pages.map(page => 
          page.Texts.map(text => text.R.map(r => r.T).join(' ')).join(' ')
        ).join('\n'));
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse PDF content'));
      }
    });

    pdfParser.on("pdfParser_dataError", (error) => {
      reject(error);
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      reject(error);
    }
  });
}; 