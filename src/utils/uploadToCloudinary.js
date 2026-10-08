import axios from 'axios';
import API from '../api/axiosInstance';

/**
 * Uploads an image file to Cloudinary and returns the secure HTTPS URL.
 * Supports:
 * 1. Direct Unsigned Upload via VITE_CLOUDINARY_CLOUD_NAME & VITE_CLOUDINARY_UPLOAD_PRESET in frontend .env
 * 2. Signed Upload via Backend (/api/upload/signature) if backend .env has Cloudinary credentials
 */
export const uploadToCloudinary = async (file) => {
  if (!file) throw new Error('No file selected');

  const envCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const envUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const hasFrontendPreset =
    envCloudName &&
    envUploadPreset &&
    envCloudName !== 'your_cloud_name' &&
    envUploadPreset !== 'your_unsigned_upload_preset';

  const formData = new FormData();
  formData.append('file', file);

  // Mode 1: Direct Unsigned Upload from Frontend
  if (hasFrontendPreset) {
    formData.append('upload_preset', envUploadPreset);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${envCloudName}/image/upload`,
      formData
    );

    return response.data.secure_url;
  }

  // Mode 2: Signed Upload using Backend /api/upload/signature
  try {
    const sigRes = await API.get('/upload/signature');
    const { signature, timestamp, cloudName, apiKey, folder } = sigRes.data;

    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    if (folder) {
      formData.append('folder', folder);
    }

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return response.data.secure_url;
  } catch (err) {
    throw new Error(
      err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Cloudinary configuration missing! Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in frontend .env'
    );
  }
};

