'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { isOptimizableImageUrl, resolveImageUrl, uploadImages } from '../../../lib/api';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUploader({ value, onChange, max }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList);
      setError(null);
      setProgress(0);
      try {
        const urls = await uploadImages(files, setProgress);
        const combined = [...value, ...urls];
        onChange(max ? combined.slice(-max) : combined);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setProgress(null);
      }
    },
    [max, onChange, value],
  );

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        className={`cursor-pointer rounded-md border-2 border-dashed px-4 py-5 text-center text-xs transition-colors ${
          isDragging ? 'border-slate-500 bg-slate-100' : 'border-slate-300 text-slate-500 hover:border-slate-400'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={max !== 1}
          hidden
          onChange={(event) => void handleFiles(event.target.files)}
        />
        Drag and drop images here, or click to browse
      </div>

      {progress !== null && (
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-slate-700 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((url, index) => (
            <div key={url} className="group relative h-16 w-16 overflow-hidden rounded-md border border-slate-200">
              {isOptimizableImageUrl(url) ? (
                <Image src={resolveImageUrl(url)} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- legacy non-Cloudinary URL, not covered by images.remotePatterns
                <img src={resolveImageUrl(url)} alt="" className="h-full w-full object-cover" />
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
                className="absolute right-0 top-0 hidden h-5 w-5 items-center justify-center bg-black/60 text-xs text-white group-hover:flex"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
