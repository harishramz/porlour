import React, { useRef, useState } from 'react';
import { supabaseConfigured } from '../services/supabase';
import { uploadImage } from '../services/media';

export const ImageField = ({ label, value, onChange, folder, required = false }) => {
  const fileInput = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const publicUrl = await uploadImage(file, folder);
      onChange(publicUrl);
    } catch (uploadError) {
      setError(uploadError.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        {value && (
          <img
            src={value}
            alt="Selected image preview"
            className="w-20 h-20 rounded-xl object-cover border border-beige-200 bg-beige-50"
          />
        )}
        <div className="flex-1 space-y-2">
          <input
            type="url"
            required={required}
            value={value || ''}
            onChange={(event) => {
              setError('');
              onChange(event.target.value);
            }}
            placeholder="Paste a direct image URL (https://...)"
            className="w-full text-xs sm:text-sm p-3 rounded-xl border border-beige-300 focus:outline-none focus:ring-2 focus:ring-gold-400"
          />
          <input
            ref={fileInput}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            disabled={!supabaseConfigured || uploading}
            onClick={() => fileInput.current?.click()}
            className="px-3 py-2 rounded-lg border border-beige-300 text-xs font-semibold text-charcoal-700 hover:bg-beige-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading image…' : 'Choose image from device'}
          </button>
          {!supabaseConfigured && (
            <p className="text-[11px] text-charcoal-500">
              Configure Supabase Storage to upload local files. Direct image URLs remain available.
            </p>
          )}
          {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};
