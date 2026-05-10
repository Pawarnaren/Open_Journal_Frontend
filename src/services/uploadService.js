import axiosInstance from '../utils/axiosInstance';
import logger from '../utils/logger';

const MODULE = 'uploadService';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Log to verify env vars are loaded
console.log('Vite Environment:', import.meta.env);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];

/**
 * Validate image before upload
 */
const validateFile = (file) => {
  if (!file) {
    throw new Error('No file selected');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      'Invalid file type. Only JPG, PNG and WEBP are allowed.'
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }
};

/**
 * Upload directly to Cloudinary
 */
export const uploadToCloudinary = async (file, onProgress) => {
  validateFile(file);

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    logger.error(MODULE, 'Cloudinary environment variables missing');

    throw new Error(
      'Cloudinary configuration missing. Check your .env file.'
    );
  }

  logger.info(MODULE, 'Starting Cloudinary upload', {
    fileName: file.name,
    size: file.size,
    type: file.type,
  });

  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  // Optional folder organization
  formData.append('folder', 'open_journal');

  try {
    const response = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round(
            (event.loaded / event.total) * 100
          );

          logger.debug(MODULE, `Upload progress: ${percent}%`);

          if (onProgress) {
            onProgress(percent);
          }
        }
      });

      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;

        try {
          const result = JSON.parse(xhr.responseText);

          if (xhr.status >= 200 && xhr.status < 300) {
            logger.info(MODULE, 'Upload successful', {
              publicId: result.public_id,
              url: result.secure_url,
            });

            resolve(result);
          } else {
            const errorMessage =
              result?.error?.message ||
              `Upload failed with status ${xhr.status}`;

            logger.error(MODULE, errorMessage);

            reject(new Error(errorMessage));
          }
        } catch (err) {
          reject(new Error('Failed to parse upload response'));
        }
      };

      xhr.onerror = () => {
        logger.error(MODULE, 'Network error during upload');

        reject(new Error('Network error during upload'));
      };

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
      );

      xhr.send(formData);
    });

    return {
      secure_url: response.secure_url,
      public_id: response.public_id,
    };
  } catch (error) {
    logger.error(MODULE, 'Cloudinary upload failed', error);

    throw error;
  }
};

/**
 * Optional backend proxy upload fallback
 */
export const uploadViaProxy = async (file, onProgress) => {
  validateFile(file);

  const formData = new FormData();

  formData.append('file', file);

  try {
    const { data } = await axiosInstance.post(
      '/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },

        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                progressEvent.total
            );

            if (onProgress) {
              onProgress(percent);
            }
          }
        },
      }
    );

    logger.info(MODULE, 'Proxy upload successful', data);

    return data;
  } catch (error) {
    logger.error(MODULE, 'Proxy upload failed', error);

    throw error;
  }
};

/**
 * Generate transformed Cloudinary image URL
 */
export const cloudinaryUrl = (
  publicId,
  transforms = 'q_auto,f_auto,w_400'
) => {
  if (!publicId || !CLOUD_NAME) {
    return '';
  }

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`;
};
