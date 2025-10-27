import { v2 as cloudinary } from 'cloudinary';
import env from '../config/env.js';
import fs from 'fs';

cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.CLOUD_API_KEY,
  api_secret: env.CLOUD_SECRET,
});

export default async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath);
  fs.unlinkSync(filePath);
  return result.secure_url;
};
