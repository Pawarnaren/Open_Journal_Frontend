import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, CheckCircle2, AlertCircle, Image } from 'lucide-react';
import { clsx } from 'clsx';
import logger from '../utils/logger';

const MODULE = 'ImageUploader';
const MAX_FILES = 5;

const ImageUploader = ({ uploads, uploading, onDrop, onRemove, disabled = false }) => {
  const handleDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length) {
        logger.warn(MODULE, 'Some files were rejected', rejectedFiles.map((r) => r.file.name));
      }
      if (acceptedFiles.length) {
        logger.info(MODULE, `${acceptedFiles.length} file(s) selected`, acceptedFiles.map((f) => f.name));
        onDrop(acceptedFiles);
      }
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 5 * 1024 * 1024,
    maxFiles: MAX_FILES - uploads.length,
    disabled: disabled || uploads.length >= MAX_FILES,
  });

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {uploads.length < MAX_FILES && (
        <div
          {...getRootProps()}
          className={clsx(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
            isDragActive
              ? 'border-primary-500 bg-primary-950/30 scale-[1.01]'
              : 'border-slate-700 hover:border-primary-600 hover:bg-slate-800/30',
            (disabled || uploads.length >= MAX_FILES) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud
            size={36}
            className={clsx(
              'mx-auto mb-3 transition-colors',
              isDragActive ? 'text-primary-400' : 'text-slate-500'
            )}
          />
          <p className="text-slate-300 text-sm font-medium">
            {isDragActive ? 'Drop images here…' : 'Drag & drop images, or click to browse'}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            JPG, PNG, WebP • Max 5MB per file • Up to {MAX_FILES} images
          </p>
        </div>
      )}

      {/* Preview grid */}
      {uploads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {uploads.map((upload, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden bg-slate-800 aspect-square">
              {/* Preview image */}
              {upload.preview && (
                <img
                  src={upload.preview}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Progress overlay */}
              {upload.progress > 0 && upload.progress < 100 && (
                <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-1">
                  <div className="w-3/4 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-300">{upload.progress}%</span>
                </div>
              )}

              {/* Success indicator */}
              {upload.result && (
                <div className="absolute bottom-1.5 right-1.5">
                  <CheckCircle2 size={16} className="text-success-400 drop-shadow" />
                </div>
              )}

              {/* Error indicator */}
              {upload.error && (
                <div className="absolute inset-0 bg-danger-950/80 flex items-center justify-center">
                  <AlertCircle size={20} className="text-danger-400" />
                </div>
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/80 rounded-full p-0.5 text-slate-300 hover:text-danger-400"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          {/* Placeholder slots */}
          {Array.from({ length: Math.max(0, MAX_FILES - uploads.length - 1) }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="rounded-xl border border-dashed border-slate-800 aspect-square flex items-center justify-center"
            >
              <Image size={18} className="text-slate-700" />
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <p className="text-primary-400 text-xs flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          Uploading images…
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
