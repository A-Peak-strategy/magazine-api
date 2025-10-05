import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import convertPDFToImages from "../services/pdf.service.js";
import { getFirestore } from "firebase-admin/firestore";
import { uploadBuffer } from "../utils/cloudinary.js";

// Set up __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const db = getFirestore();

export const uploadAndConvertPDF = async (req, res) => {
  try {
    const pdfPath = req.files?.pdf?.[0]?.path;
    if (!pdfPath) {
      return res.status(400).json({ error: "PDF file is required." });
    }
    const pdfId = path.parse(pdfPath).name;
    const outputDir = path.join(__dirname, "..", "output", pdfId);
    fs.mkdirSync(outputDir, { recursive: true });

    let coverImage = "";
    const coverImagePath = req.files?.coverImage?.[0]?.path;
    if (coverImagePath) {
      const buffer = fs.readFileSync(coverImagePath);
      const result = await uploadBuffer(buffer, "issues");
      coverImage = result.secure_url;
    }

    const imagePaths = await convertPDFToImages(pdfPath, outputDir, pdfId);
    console.log("Converted PDF pages:", imagePaths);

    const uploadedImageUrls = [];

    for (const imagePath of imagePaths) {
      const buffer = fs.readFileSync(imagePath);
      const result = await uploadBuffer(buffer, `pdf-pages/${pdfId}`, "image");
      console.log("Uploaded to Cloudinary:", result.secure_url);
      uploadedImageUrls.push(result.secure_url);
    }

    if (uploadedImageUrls.length === 0) {
      throw new Error("No images were uploaded to Cloudinary");
    }

    //? delete temporary files
    try {
      fs.unlinkSync(pdfPath);
      fs.unlinkSync(coverImagePath);
      fs.rmSync(outputDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.warn('⚠️ Cleanup failed:', cleanupErr.message);
    }

    const docRef = await db.collection("issues").add({
      pdfId,
      coverImage: coverImage,
      description: req.body.description,
      date: req.body.date,
      title: req.body.title,
      timestamp: new Date(),
      pages: uploadedImageUrls,
    });

    console.log("Saved to Firestore with ID:", docRef.id);

    res.json({
      success: true,
      id: docRef.id,
      issue: {
        pdfId,
        coverImage,
        description: req.body.description,
        date: req.body.date,
        title: req.body.title,
        timestamp: new Date(),
        pages: uploadedImageUrls,
      },
    });
  } catch (err) {
    console.error("Upload and convert failed:", err);
    res.status(500).json({ error: err.message || "Failed to process PDF" });
  }
};
