'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

/**
 * Compress image on client side before upload.
 * Vercel Hobby has 4.5MB body limit, so we resize to max 1200px and compress to JPEG.
 */
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    // If file is already small enough (<1MB), skip compression
    if (file.size < 1 * 1024 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Scale down if wider than maxWidth
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Komprese selhala'));
            return;
          }
          const compressedFile = new File([blob], file.name.replace(/\.\w+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Nepodařilo se načíst obrázek'));
    img.src = URL.createObjectURL(file);
  });
}

export default function ImageUpload({ value, onChange, folder = 'skus' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Neplatný typ souboru. Povolené: JPG, PNG, WebP, GIF');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('Soubor je příliš velký. Max 20MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Compress image to fit Vercel 4.5MB body limit
      const compressed = await compressImage(file);

      if (compressed.size > 4 * 1024 * 1024) {
        // Still too large — try harder compression
        const moreCompressed = await compressImage(file, 800, 0.6);
        if (moreCompressed.size > 4 * 1024 * 1024) {
          throw new Error('Obrázek je příliš velký i po kompresi. Zkuste menší soubor.');
        }
        // Use more compressed version
        const formData = new FormData();
        formData.append('file', moreCompressed);
        formData.append('folder', folder);
        const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        await handleResponse(response);
        return;
      }

      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      await handleResponse(response);
    } catch (err: any) {
      setError(err.message || 'Upload selhal');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Upload non-JSON response:', response.status, text.substring(0, 200));
      if (response.status === 413) {
        throw new Error('Soubor je příliš velký pro server. Zkuste menší obrázek.');
      }
      if (response.status === 401 || response.redirected) {
        throw new Error('Nejste přihlášeni. Přihlašte se znovu do admin panelu.');
      }
      throw new Error(`Server vrátil neočekávanou odpověď (${response.status})`);
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Upload selhal');
    }

    onChange(result.url);
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-3 py-1.5 text-sm rounded-lg transition ${
            mode === 'upload'
              ? 'bg-burgundy text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Nahrát soubor
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-3 py-1.5 text-sm rounded-lg transition ${
            mode === 'url'
              ? 'bg-burgundy text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Zadat URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="space-y-3">
          {!value && (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-burgundy hover:bg-burgundy/5 transition">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
              {uploading ? (
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Komprimuji a nahrávám...
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-500">Klikni pro nahrání obrázku</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF (automatická komprese)</span>
                </>
              )}
            </label>
          )}
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Náhled"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/placeholder.png';
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
