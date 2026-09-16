'use client';

import { useState } from 'react';

const DEFAULT_FALLBACK = 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200';

type AppImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  width?: number;
  height?: number;
  fallbackSrc?: string;
};

function AppImage({ src, alt, fill, className, width, height, fallbackSrc = DEFAULT_FALLBACK }: AppImageProps) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = src && !errored ? src : fallbackSrc;

  if (fill) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        loading="lazy"
        onError={() => setErrored(true)}
        className={`absolute inset-0 h-full w-full ${className ?? ''}`}
      />
    );
  }
  return <img src={resolvedSrc} alt={alt} width={width} height={height} loading="lazy" onError={() => setErrored(true)} className={className} />;
}

export default AppImage;
