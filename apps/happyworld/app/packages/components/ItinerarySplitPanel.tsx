'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { CalendarDays, ChevronRight, NotebookPen } from 'lucide-react';
import ItenarySection from '@/app/packages/components/ItenarySection';
import CustomItinerarySection from '@/app/packages/components/CustomItinerarySection';
import type { ItineraryDay } from '@/lib/packages';

const ANIM_MS = 460;

type Panel = 'itinerary' | 'custom';

type Props = {
  itinerary: ItineraryDay[];
  destinationLabel: string;
  heroImage: string;
  packageName: string;
  duration?: string;
};

export default function ItinerarySplitPanel({ itinerary, destinationLabel, heroImage, packageName, duration }: Props) {
  // active  — which panel is currently at 80% width (drives the CSS transition)
  // content — which panel is currently rendering its full content (null during transition)
  const [active, setActive] = useState<Panel>('itinerary');
  const [content, setContent] = useState<Panel | null>('itinerary');
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const expand = useCallback((panel: Panel) => {
    if (active === panel) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    // Immediately clear full content so both panels show their collapsed strips
    // while the width transition plays out.
    setContent(null);
    setActive(panel);
    // Scroll to the top of the split panel so the newly expanded panel is in view.
    containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // After the CSS transition finishes, fade the full content in.
    timerRef.current = setTimeout(() => setContent(panel), ANIM_MS);
  }, [active]);

  // ── Mobile: just stack both panels vertically, no collapse behaviour ──────
  if (isMobile) {
    return (
      <div className="flex flex-col gap-16">
        <ItenarySection
          itinerary={itinerary}
          destinationLabel={destinationLabel}
          heroImage={heroImage}
          packageName={packageName}
          duration={duration}
        />
        <CustomItinerarySection packageName={packageName} />
      </div>
    );
  }

  // ── Desktop: side-by-side split with animated flex-basis ─────────────────
  return (
    <div ref={containerRef} style={{ display: 'flex', gap: '1.5rem', alignItems: 'stretch' }}>
      {/* ── Itinerary panel ── */}
      <div
        style={{
          flex: `0 0 ${active === 'itinerary' ? '80%' : '20%'}`,
          transition: `flex-basis ${ANIM_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          overflow: 'hidden',
          minHeight: '400px',
        }}
      >
        {content === 'itinerary' ? (
          <div className="split-panel-fade">
            <ItenarySection
              itinerary={itinerary}
              destinationLabel={destinationLabel}
              heroImage={heroImage}
              packageName={packageName}
              duration={duration}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => expand('itinerary')}
            className="group w-full h-full glass-card rounded-3xl flex flex-col items-center justify-center gap-4 p-6 text-center hover:border-primary/40 transition-colors"
            aria-label="Show itinerary"
            data-testid="collapsed-itinerary-panel"
          >
            <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <CalendarDays size={19} />
            </span>
            <div>
              <p className="font-serif font-bold text-lg text-foreground leading-snug">Standard Itinerary</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Day-by-day plan for this trip — stays, meals and transport.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
              View days <ChevronRight size={15} />
            </span>
          </button>
        )}
      </div>

      {/* ── Custom itinerary panel ── */}
      <div
        style={{
          flex: `0 0 ${active === 'custom' ? '80%' : '20%'}`,
          transition: `flex-basis ${ANIM_MS}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          overflow: 'hidden',
          minHeight: '400px',
        }}
      >
        {content === 'custom' ? (
          <div className="split-panel-fade">
            <CustomItinerarySection packageName={packageName} fullWidth />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => expand('custom')}
            className="group w-full h-full glass-card rounded-3xl flex flex-col items-center justify-center gap-4 p-6 text-center hover:border-primary/40 transition-colors"
            aria-label="Build your own itinerary"
            data-testid="collapsed-custom-panel"
          >
            <span className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <NotebookPen size={19} />
            </span>
            <div>
              <p className="font-serif font-bold text-lg text-foreground leading-snug">Build Your Own</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Sketch your own day-by-day plan and send it to our team.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
              Open builder <ChevronRight size={15} />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
