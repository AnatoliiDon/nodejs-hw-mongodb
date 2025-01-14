import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';

import { getEnvVar } from './getEnvVars.js';

const cloud_name = getEnvVar('CLOUDINARY_CLOUD_NAME');
const api_key = getEnvVar('CLOUDINARY_API_KEY');
const api_secret = getEnvVar('CLOUDINARY_API_SECRET');

cloudinary.config({
  secure: true,
  cloud_name,
  api_key,
  api_secret,
});

export const saveFileToCloudinary = async (file) => {
  const response = await cloudinary.uploader.upload(file.path);
  await fs.unlink(file.path);
  return response.secure_url;
};
