import poppler from 'pdf-poppler';
import fs from 'fs';
import path from 'path';

const convertPDFToImages = async (pdfPath, outputDir, pdfId) => {
  const options = {
    format: 'jpeg',
    out_dir: outputDir,
    out_prefix: 'page',
    page: null,
  };

  // Use the default export directly — it's a set of utility functions
  await poppler.convert(pdfPath, options);

  const files = fs.readdirSync(outputDir).filter((f) => f.endsWith('.jpg'));
  return files.map((file) => `/images/${pdfId}/${file}`);
};

export default convertPDFToImages;
