import { useState, useRef } from 'react';
import { UploadCloud, Loader2, X, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

const ImageUploadField = ({
  label = 'Image',
  value = '',
  onChange,
  placeholder = 'https://res.cloudinary.com/...',
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('කරුණාකර වලංගු image file එකක් තෝරන්න (JPG, PNG, WEBP)');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(file);
      onChange(uploadedUrl);
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      setError(err.message || 'Image upload කිරීම අසාර්ථකයි');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 text-indigo-600 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30 text-xs font-bold transition cursor-pointer shrink-0 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              <span>Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <UploadCloud size={15} />
              <span>Choose Image</span>
            </>
          )}
        </button>

        {/* Direct URL Input (auto-filled by Cloudinary or manually pasted) */}
        <div className="relative flex-1">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="admin-input w-full px-3.5 py-2.5 pr-8 rounded-xl border text-xs"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              title="Clear Image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-[11px] font-medium text-rose-600 dark:text-rose-400">{error}</p>
      )}

      {/* Preview Box when image URL exists */}
      {value && (
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/70">
          <img
            src={value}
            alt="Uploaded preview"
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-white"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={13} />
              <span>Image Link Ready (Saved as URL in MongoDB)</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {value}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;

