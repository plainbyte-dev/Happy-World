'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { GalleryImage } from '@/lib/packages';

type GalleryProps = {
  images: GalleryImage[];
};

function Gallery({ images }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const close = () => setActiveIndex(null);
  const showPrev = () => setActiveIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  const showNext = () => setActiveIndex((i) => (i === null ? i : (i + 1) % images.length));

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeIndex]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    if (delta > 50) showPrev();
    else if (delta < -50) showNext();
    touchStartX.current = null;
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className="pkg-gallery-mobile" data-testid="gallery-mobile">
        {images.map((image, i) => (
          <button key={image.src + i} type="button" className="pkg-gallery-mobile-item" onClick={() => setActiveIndex(i)} data-testid={`button-gallery-${i}`}>
            <img src={image.src} alt={image.alt} loading="lazy" />
          </button>
        ))}
      </div>

      <div className="pkg-gallery-masonry" data-testid="gallery-masonry">
        {images.map((image, i) => (
          <button key={image.src + i} type="button" className="pkg-gallery-masonry-item" onClick={() => setActiveIndex(i)} data-testid={`button-gallery-desktop-${i}`}>
            <img src={image.src} alt={image.alt} loading="lazy" />
            {image.caption ? <span className="pkg-gallery-caption">{image.caption}</span> : null}
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="pkg-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          data-testid="lightbox"
        >
          <button type="button" className="pkg-lightbox-close" onClick={close} aria-label="Close gallery" data-testid="button-lightbox-close">
            <X size={22} />
          </button>
          <button
            type="button"
            className="pkg-lightbox-nav pkg-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); showPrev(); }}
            aria-label="Previous photo"
            data-testid="button-lightbox-prev"
          >
            <ChevronLeft size={26} />
          </button>
          <figure className="pkg-lightbox-figure" onClick={(e) => e.stopPropagation()}>
            <img src={images[activeIndex]!.src} alt={images[activeIndex]!.alt} />
            {images[activeIndex]!.caption ? <figcaption>{images[activeIndex]!.caption}</figcaption> : null}
          </figure>
          <button
            type="button"
            className="pkg-lightbox-nav pkg-lightbox-next"
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            aria-label="Next photo"
            data-testid="button-lightbox-next"
          >
            <ChevronRight size={26} />
          </button>
          <span className="pkg-lightbox-count">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      ) : null}
    </>
  );
}

export default Gallery;
