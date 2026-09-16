'use client';

import { useState, useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import type { GalleryImage } from '@/lib/packages';

type GallerySectionProps = {
  images: GalleryImage[];
};

export default function GallerySection({ images }: GallerySectionProps) {
  const galleryImages = images.slice(0, 6);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.reveal-up');
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveIdx((p) => (p + 1) % galleryImages.length);
      if (e.key === 'ArrowLeft') setActiveIdx((p) => (p - 1 + galleryImages.length) % galleryImages.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, galleryImages.length]);

  if (galleryImages.length === 0) return null;

  const caption = (image: GalleryImage) => image.caption ?? image.alt;
  const openLightbox = (idx: number) => {
    setActiveIdx(idx);
    setLightboxOpen(true);
  };

  const smallIndices = [1, 2].filter((idx) => idx < galleryImages.length);
  const bottomIndices = [3, 4, 5].filter((idx) => idx < galleryImages.length);

  return (
    <div ref={sectionRef}>
      <span className="section-label">Photo Gallery</span>
      <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-8">
        See the
        <span> Destination</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Large hero image */}
        <div className="sm:col-span-2 sm:row-span-2 reveal-up">
          <button
            onClick={() => openLightbox(0)}
            className="w-full h-[280px] sm:h-full min-h-[340px] block image-zoom-container rounded-3xl overflow-hidden relative group bento-item"
            aria-label={`View ${caption(galleryImages[0])}`}
          >
            <AppImage
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 66vw"
              priority
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            <div className="absolute bottom-5 left-5 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
              {caption(galleryImages[0])}
            </div>
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-9 h-9 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Icon name="MagnifyingGlassPlusIcon" size={16} className="text-white" />
              </div>
            </div>
          </button>
        </div>

        {/* Small images in col 3 */}
        {smallIndices.map((idx) => (
          <div key={idx} className={`reveal-up stagger-${idx}`}>
            <button
              onClick={() => openLightbox(idx)}
              className="w-full h-[160px] sm:h-full block image-zoom-container rounded-3xl overflow-hidden relative group bento-item"
              aria-label={`View ${caption(galleryImages[idx])}`}
            >
              <AppImage src={galleryImages[idx].src} alt={galleryImages[idx].alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {caption(galleryImages[idx])}
              </div>
            </button>
          </div>
        ))}

        {/* Bottom row */}
        {bottomIndices.map((idx, ri) => (
          <div key={idx} className={`reveal-up stagger-${ri + 3}`}>
            <button
              onClick={() => openLightbox(idx)}
              className="w-full h-[180px] block image-zoom-container rounded-3xl overflow-hidden relative group bento-item"
              aria-label={`View ${caption(galleryImages[idx])}`}
            >
              <AppImage src={galleryImages[idx].src} alt={galleryImages[idx].alt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {caption(galleryImages[idx])}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <AppImage src={galleryImages[activeIdx].src} alt={galleryImages[activeIdx].alt} fill className="object-contain" sizes="100vw" priority />
            </div>
            <p className="text-center text-sm text-white/80 mt-4">{caption(galleryImages[activeIdx])}</p>
            <p className="text-center text-xs text-white/50 mt-1">
              {activeIdx + 1} / {galleryImages.length}
            </p>

            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Close lightbox"
            >
              <Icon name="XMarkIcon" size={20} className="text-white" />
            </button>
            <button
              onClick={() => setActiveIdx((p) => (p - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              aria-label="Previous image"
            >
              <Icon name="ChevronLeftIcon" size={20} className="text-white" />
            </button>
            <button
              onClick={() => setActiveIdx((p) => (p + 1) % galleryImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
              aria-label="Next image"
            >
              <Icon name="ChevronRightIcon" size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
