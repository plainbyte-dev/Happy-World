'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import type { PackageDetail } from '@/lib/packages';

type PackageHeroProps = {
  detail: PackageDetail;
};

export default function PackageHero({ detail }: PackageHeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [badgeRef.current, titleRef.current, metaRef.current];
    const timers: ReturnType<typeof setTimeout>[] = [];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      const t = setTimeout(() => {
        if (!el) return;
        el.style.transition = 'opacity 1s cubic-bezier(0.23,1,0.32,1), transform 1s cubic-bezier(0.23,1,0.32,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 300 + i * 200);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const reviewCount = detail.testimonials.length;
  const avgRating = reviewCount > 0 ? detail.testimonials.reduce((sum, t) => sum + t.rating, 0) / reviewCount : 5;

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-end overflow-hidden bg-white">
      <AppImage src={detail.heroImage} alt={detail.name} fill priority className="object-cover" sizes="100vw" />

      {/* Scrim: gradient from bottom for white text */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

      {/* Atmospheric blob */}
      <div className="blob-gold absolute top-1/4 right-1/4 w-80 h-80 rounded-full" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-8 pb-16 pt-36 max-w-4xl">
        <div ref={badgeRef} className="flex flex-wrap items-center gap-3 mb-6">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            {detail.categoryLabel}
          </span>
          <span className="glass-card px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground">
            {detail.quickFacts.duration}
          </span>
          <span className="glass-card px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-foreground">
            {detail.destinationLabel}
          </span>
        </div>

        <h1 ref={titleRef} className="font-serif text-display-lg font-bold text-white mb-6 tracking-tighter leading-[0.9]">
          {detail.name}
        </h1>

        <div ref={metaRef} className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Icon key={s} name="StarIcon" size={16} variant="solid" className="text-primary" />
            ))}
            <span className="text-sm font-bold text-white ml-1">{avgRating.toFixed(1)}</span>
            <span className="text-sm text-white/60">({reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Icon name="MapPinIcon" size={16} className="text-primary" />
            {detail.destinationLabel}
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Icon name="UserGroupIcon" size={16} className="text-primary" />
            {detail.quickFacts.groupSize}
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Icon name="ChartBarIcon" size={16} className="text-primary" />
            {detail.quickFacts.difficulty} difficulty
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="absolute top-24 left-4 sm:left-8 z-10 flex items-center gap-2 text-xs text-white/50">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href={detail.destinationHref} className="hover:text-primary transition-colors">{detail.destinationLabel}</Link>
        <span>/</span>
        <span className="text-white/80">{detail.name}</span>
      </div>
    </section>
  );
}
