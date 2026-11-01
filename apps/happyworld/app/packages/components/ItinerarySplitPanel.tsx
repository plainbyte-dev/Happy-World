'use client';

import { forwardRef, useState, useEffect, useRef, useCallback, useMemo, useImperativeHandle } from 'react';
import { CalendarDays, ChevronRight, NotebookPen } from 'lucide-react';
import ItenarySection from '@/app/packages/components/ItenarySection';
import CustomItinerarySection, {
  type CustomDay,
  type CustomItinerarySectionHandle,
  STAY_OPTIONS,
  TRANSPORT_OPTIONS,
} from '@/app/packages/components/CustomItinerarySection';
import type { ItineraryDay } from '@/lib/packages';

const ANIM_MS = 460;

type Panel = 'itinerary' | 'custom';

// The custom builder's meals/stay/transport are fixed dropdowns, so a straight copy can't
// always land on an exact option — best-effort match them, and keep the full original text
// in `detail` regardless so nothing from the standard itinerary gets silently dropped.
function mapMealsOption(raw: string): string {
  if (!raw || raw === '—') return 'No meals included';
  const b = raw.includes('Breakfast');
  const l = raw.includes('Lunch');
  const d = raw.includes('Dinner');
  if (b && l && d) return 'All meals (Breakfast, Lunch & Dinner)';
  if (b && l) return 'Breakfast & Lunch';
  if (b && d) return 'Breakfast & Dinner';
  if (l && d) return 'Lunch & Dinner';
  if (b) return 'Breakfast only';
  return '';
}

function matchOption(raw: string, options: string[]): string {
  if (!raw || raw === '—') return '';
  const lower = raw.toLowerCase();
  return options.find((option) => lower.includes(option.toLowerCase())) ?? '';
}

function buildCustomDaysFromItinerary(itinerary: ItineraryDay[]): Array<Omit<CustomDay, 'id'>> {
  return itinerary.map((day) => {
    const mealsOption = mapMealsOption(day.meals);
    const stayOption = matchOption(day.stay, STAY_OPTIONS);
    const transportOption = matchOption(day.transport, TRANSPORT_OPTIONS);
    const extras = [
      day.stay && day.stay !== '—' && !stayOption ? `Stay: ${day.stay}` : '',
      day.transport && day.transport !== '—' && !transportOption ? `Transport: ${day.transport}` : '',
    ]
      .filter(Boolean)
      .join('   ·   ');
    return {
      title: day.title,
      detail: [day.detail, extras].filter(Boolean).join('\n\n'),
      meals: mealsOption,
      stay: stayOption,
      transport: transportOption,
    };
  });
}

type Props = {
  itinerary: ItineraryDay[];
  destinationLabel: string;
  heroImage: string;
  packageName: string;
  duration?: string;
};

export type ItinerarySplitPanelHandle = {
  /** Scrolls to and opens the "Build Your Own" panel — called imperatively by an ancestor, e.g. a sidebar CTA. */
  openCustom: () => void;
};

const ItinerarySplitPanel = forwardRef<ItinerarySplitPanelHandle, Props>(function ItinerarySplitPanel(
  { itinerary, destinationLabel, heroImage, packageName, duration },
  ref,
) {
  // active  — which panel is currently at 80% width (drives the CSS transition)
  // content — which panel is currently rendering its full content (null during transition)
  const [active, setActive] = useState<Panel>('itinerary');
  const [content, setContent] = useState<Panel | null>('itinerary');
  const [isMobile, setIsMobile] = useState(false);
  // Set by "Customize this itinerary" so the next desktop mount of the (freshly
  // remounted) custom panel opens pre-filled with the standard itinerary's days.
  const [prefillWithItinerary, setPrefillWithItinerary] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const customSectionRef = useRef<CustomItinerarySectionHandle>(null);

  const mappedCustomDays = useMemo(() => buildCustomDaysFromItinerary(itinerary), [itinerary]);

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

  // Lets an ancestor (e.g. a sidebar "Build a Custom Trip" button) jump straight to the
  // open builder instead of just scrolling near it and leaving a second click to do.
  useImperativeHandle(ref, () => ({
    openCustom: () => {
      if (isMobile) {
        customSectionRef.current?.open();
      } else {
        setPrefillWithItinerary(false);
        expand('custom');
      }
    },
  }), [isMobile, expand]);

  // "Customize this itinerary" — copies the standard day-by-day plan into the
  // builder and opens it, instead of making the user retype everything.
  const customizeItinerary = useCallback(() => {
    if (isMobile) {
      customSectionRef.current?.loadDays(mappedCustomDays);
    } else {
      setPrefillWithItinerary(true);
      expand('custom');
    }
  }, [isMobile, mappedCustomDays, expand]);

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
          onCustomize={customizeItinerary}
        />
        <CustomItinerarySection ref={customSectionRef} packageName={packageName} />
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
              onCustomize={customizeItinerary}
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
            <CustomItinerarySection
              packageName={packageName}
              fullWidth
              initialDays={prefillWithItinerary ? mappedCustomDays : undefined}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              // A plain click (not "Customize this itinerary") should always open blank.
              setPrefillWithItinerary(false);
              expand('custom');
            }}
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
});

export default ItinerarySplitPanel;
