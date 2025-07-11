import express from 'express';
import multer from 'multer';
import { uploadAndConvertPDF } from '../controllers/pdf.controller.js';

const router = express.Router();

// Setup multer for PDF upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload PDF and convert to images
router.post(
  '/upload',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'coverImage', maxCount: 1 },
  ]),
  uploadAndConvertPDF
);

export default router;
