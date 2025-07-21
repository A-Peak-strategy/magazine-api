// utils/cloudinary.js
// Required in .env:
// CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadBuffer = (buffer, folder, resource_type = 'image') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
}; 

const getPublicIdFromUrl = (url) => {
  const parts = url.split('/upload/')[1]; // e.g. v123456/folder/filename.jpg
  const withoutVersion = parts.split('/').slice(1).join('/'); // remove vXXXXXX
  const withoutExtension = withoutVersion.replace(/\.[^/.]+$/, ''); // remove .jpg
  console.log('✅ Clean Public ID:', withoutExtension);
  return withoutExtension;
};


export const deleteImageFromCloudinary = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    console.log(`🗑️ Deleted from Cloudinary:`, result);
  } catch (err) {
    console.error(`❌ Cloudinary delete failed for ${url}:`, err.message);
  }
};
