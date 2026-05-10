import { useCallback, useState } from 'react';
import { uploadToCloudinary } from '../services/uploadService';
import logger from '../utils/logger';

const MODULE = 'useCloudinaryUpload';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Custom hook for managing Cloudinary uploads.
 * Returns: { uploads, uploading, addFiles, removeFile, reset }
 * Each upload item: { file, preview, progress, result, error }
 */
const useCloudinaryUpload = () => {
  const [uploads, setUploads] = useState([]); // array of upload items

  const updateItem = (index, patch) =>
    setUploads((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );

  const addFiles = useCallback(async (files) => {
    const validFiles = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        logger.warn(MODULE, `Invalid file type: ${file.type}`, { name: file.name });
        continue;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        logger.warn(MODULE, `File too large (>${MAX_SIZE_MB}MB)`, {
          name: file.name,
          size: file.size,
        });
        continue;
      }
      const preview = URL.createObjectURL(file);
      validFiles.push({ file, preview, progress: 0, result: null, error: null });
    }

    if (!validFiles.length) return;

    setUploads((prev) => [...prev, ...validFiles]);
    const startIndex = uploads.length; // capture before state update batches

    for (let i = 0; i < validFiles.length; i++) {
      const idx = startIndex + i;
      try {
        logger.info(MODULE, `Starting upload for "${validFiles[i].file.name}"`);
        const result = await uploadToCloudinary(validFiles[i].file, (pct) =>
          updateItem(idx, { progress: pct })
        );
        updateItem(idx, { result, progress: 100 });
        logger.info(MODULE, `Upload complete for "${validFiles[i].file.name}"`, result);
      } catch (err) {
        logger.error(MODULE, `Upload failed for "${validFiles[i].file.name}"`, err);
        updateItem(idx, { error: err.message });
      }
    }
  }, [uploads.length]);

  const removeFile = useCallback((index) => {
    setUploads((prev) => {
      const item = prev[index];
      if (item?.preview) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const reset = useCallback(() => {
    setUploads((prev) => {
      prev.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
      return [];
    });
  }, []);

  const uploading = uploads.some((u) => u.progress > 0 && u.progress < 100 && !u.result);

  return { uploads, uploading, addFiles, removeFile, reset };
};

export default useCloudinaryUpload;
