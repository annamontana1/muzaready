'use client';

import { useState, useRef } from 'react';

interface MultiImageUploadProps {
  mainImage: string;
  additionalImages: string[];
  onMainImageChange: (url: string) => void;
  onAdditionalImagesChange: (urls: string[]) => void;
  folder?: string;
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  if (file.size < 1 * 1024 * 1024) return file;

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Nepodařilo se přečíst soubor'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = document.createElement('img');
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Nepodařilo se dekódovat obrázek'));
    el.src = dataUrl;
  });

  let { width, height } = img;
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas není podporován');
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Komprese selhala'))),
      'image/jpeg',
      quality
    );
  });

  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}

async function uploadFile(file: File, folder: string): Promise<string> {
  const compressed = await compressImage(file);

  // If still too large, compress harder
  const toUpload = compressed.size > 4 * 1024 * 1024
    ? await compressImage(file, 800, 0.6)
    : compressed;

  if (toUpload.size > 4 * 1024 * 1024) {
    throw new Error('Obrázek je příliš velký i po kompresi.');
  }

  const formData = new FormData();
  formData.append('file', toUpload);
  formData.append('folder', folder);

  const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    if (response.status === 413) throw new Error('Soubor příliš velký pro server.');
    if (response.status === 401) throw new Error('Nejste přihlášeni.');
    throw new Error(`Server vrátil chybu (${response.status})`);
  }

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Upload selhal');
  return result.url;
}

export default function MultiImageUpload({
  mainImage,
  additionalImages,
  onMainImageChange,
  onAdditionalImagesChange,
  folder = 'skus',
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const mainInputRef = useRef<HTMLInputElement>(null);
  const additionalInputRef = useRef<HTMLInputElement>(null);

  const allImages = [mainImage, ...additionalImages].filter(Boolean);

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadFile(file, folder);
      onMainImageChange(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (mainInputRef.current) mainInputRef.current.value = '';
    }
  };

  const handleAdditionalUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError('');
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], folder);
        urls.push(url);
      }
      onAdditionalImagesChange([...additionalImages, ...urls]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (additionalInputRef.current) additionalInputRef.current.value = '';
    }
  };

  const removeImage = (url: string) => {
    if (url === mainImage) {
      // If removing main image, promote first additional to main
      if (additionalImages.length > 0) {
        onMainImageChange(additionalImages[0]);
        onAdditionalImagesChange(additionalImages.slice(1));
      } else {
        onMainImageChange('');
      }
    } else {
      onAdditionalImagesChange(additionalImages.filter((u) => u !== url));
    }
  };

  const setAsMain = (url: string) => {
    if (url === mainImage) return;
    // Swap: current main goes to additional, clicked becomes main
    const newAdditional = additionalImages.filter((u) => u !== url);
    if (mainImage) newAdditional.unshift(mainImage);
    onMainImageChange(url);
    onAdditionalImagesChange(newAdditional);
  };

  return (
    <div className="space-y-4">
      {/* Image grid */}
      {allImages.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((url, idx) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Foto ${idx + 1}`}
                className={`w-full aspect-square object-cover rounded-lg border-2 ${
                  url === mainImage ? 'border-burgundy' : 'border-gray-200'
                }`}
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/placeholder.png'; }}
              />
              {url === mainImage && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-burgundy text-white text-[10px] font-bold rounded">
                  HLAVNÍ
                </span>
              )}
              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-lg flex items-center justify-center gap-2">
                {url !== mainImage && (
                  <button
                    type="button"
                    onClick={() => setAsMain(url)}
                    className="px-2 py-1 bg-white text-gray-900 rounded text-xs font-medium hover:bg-gray-100"
                  >
                    Hlavní
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                >
                  Smazat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload buttons */}
      <div className="flex gap-3">
        {!mainImage && (
          <label className="flex-1 flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-burgundy hover:bg-burgundy/5 transition">
            <input
              ref={mainInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleMainUpload}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <span className="text-sm text-gray-500">Nahrávám...</span>
            ) : (
              <>
                <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-500">Hlavní foto</span>
              </>
            )}
          </label>
        )}

        <label className={`${mainImage ? 'flex-1' : 'flex-1'} flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-burgundy hover:bg-burgundy/5 transition`}>
          <input
            ref={additionalInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            onChange={handleAdditionalUpload}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <span className="text-sm text-gray-500">Nahrávám...</span>
          ) : (
            <>
              <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-gray-500">
                {mainImage ? 'Přidat další foto' : 'Více fotek najednou'}
              </span>
            </>
          )}
        </label>
      </div>

      <p className="text-xs text-gray-400">
        {allImages.length} / 10 fotek • JPG, PNG, WebP • automatická komprese
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
