import React, { useState, useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploader = ({ onImageSelect, initialImage = null }) => {
  const [preview, setPreview] = useState(initialImage);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (PNG, JPG, JPEG, WebP)');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null);
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
        Photo Evidence (Optional but recommended)
      </label>

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
          preview ? 'border-civic-400 bg-civic-50/20' : 'border-slate-300 hover:border-civic-500 bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {preview ? (
          <div className="relative inline-block max-w-full">
            <img
              src={preview}
              alt="Evidence preview"
              className="max-h-56 rounded-lg object-contain mx-auto shadow-sm border border-slate-200"
            />
            <button
              type="button"
              onClick={handleClear}
              className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 transition"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-xs text-slate-500 mt-2 truncate max-w-xs mx-auto">{fileName || 'Attached evidence'}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="p-3 bg-white rounded-full shadow-sm border border-slate-200 mb-3 text-civic-600">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">Click or drag image evidence to upload</p>
            <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, JPEG, WebP up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};
