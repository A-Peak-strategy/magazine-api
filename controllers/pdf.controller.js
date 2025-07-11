import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import convertPDFToImages from '../services/pdf.service.js';

// Set up __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadAndConvertPDF = async (req, res) => {
  try {
    const pdfPath = req.file.path;
    const pdfId = path.parse(req.file.filename).name;
    const outputDir = path.join(__dirname, '..', 'output', pdfId);

    fs.mkdirSync(outputDir, { recursive: true });

    const imageUrls = await convertPDFToImages(pdfPath, outputDir, pdfId);

    res.json({ images: imageUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to convert PDF to images' });
  }
};
