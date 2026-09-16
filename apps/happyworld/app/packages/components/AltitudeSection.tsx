'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { ItineraryDay } from '@/lib/packages';
import type { IconName } from '@/components/ui/AppIcon';

type AltitudeSectionProps = {
  altitudeProfile: number[];
  itinerary: ItineraryDay[];
};

const acclimatizationTips: { icon: IconName; title: string; desc: string }[] = [
  { icon: 'ClockIcon', title: 'Arrive a Day Early', desc: 'Spend at least one extra night acclimatising before the highest point of the trip.' },
  { icon: 'NoSymbolIcon', title: 'Go Easy on Alcohol', desc: 'Alcohol widens blood vessels and worsens altitude symptoms — best avoided on high-altitude days.' },
  { icon: 'BeakerIcon', title: 'Try Ginger or Garlic Tea', desc: 'Local remedies served along the route are a traditional way to ease altitude discomfort.' },
  { icon: 'HeartIcon', title: 'Take It Slow', desc: 'Walk at a steady pace, breathe deeply, and rest often — your guide will set the rhythm.' },
  { icon: 'GlobeAltIcon', title: 'Stay Hydrated', desc: 'Drink 3–4 litres of water a day. Dehydration makes altitude effects noticeably worse.' },
  { icon: 'PlusCircleIcon', title: 'Ask About Diamox', desc: 'Acetazolamide (Diamox) is a commonly used preventative — consult your doctor before travel.' },
];

const CHART_WIDTH = 800;
const CHART_HEIGHT = 260;
const CHART_PAD_X = 24;
const CHART_PAD_TOP = 32;
const CHART_PAD_BOTTOM = 36;

// Live elevation lookups are unreliable right now (upstream API flakiness) —
// keep the code in place but show the static profile until that's sorted out.
const LIVE_ELEVATION_ENABLED = false;

export default function AltitudeSection({ altitudeProfile, itinerary }: AltitudeSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [liveElevations, setLiveElevations] = useState<number[] | null>(null);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const coords = useMemo(
    () =>
      LIVE_ELEVATION_ENABLED && itinerary.every((day) => typeof day.lat === 'number' && typeof day.lng === 'number')
        ? itinerary.map((day) => ({ lat: day.lat as number, lng: day.lng as number }))
        : null,
    [itinerary],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setDrawn(true);
          section.querySelectorAll('.reveal-up').forEach((item) => item.classList.add('visible'));
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!coords || coords.length === 0) return;
    let cancelled = false;
    setLoadingLive(true);
    setLiveError(null);

    fetch('/api/elevation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations: coords.map(({ lat, lng }) => ({ lat, lng })) }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || 'Could not fetch live elevation.');
        return json.elevations as number[];
      })
      .then((elevations) => {
        if (!cancelled) setLiveElevations(elevations);
      })
      .catch((err: Error) => {
        if (!cancelled) setLiveError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingLive(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coords]);

  const profile = liveElevations ?? altitudeProfile;
  const isLive = liveElevations !== null;

  const points = profile.map((elevation, i) => {
    const day = itinerary[i];
    const place = day?.stay?.split('—')[0].trim() || day?.title || `Day ${i + 1}`;
    return {
      name: day?.title ?? `Day ${i + 1}`,
      place,
      detail: day?.detail ?? '',
      elevation,
    };
  });

  const maxAltitude = Math.max(...profile, 1);
  const minAltitude = Math.min(...profile, 0);
  const range = Math.max(maxAltitude - minAltitude, 1);
  const plotWidth = CHART_WIDTH - CHART_PAD_X * 2;
  const plotHeight = CHART_HEIGHT - CHART_PAD_TOP - CHART_PAD_BOTTOM;

  const coordinates = points.map((point, i) => {
    const x = points.length > 1 ? CHART_PAD_X + (i / (points.length - 1)) * plotWidth : CHART_PAD_X + plotWidth / 2;
    const y = CHART_PAD_TOP + plotHeight - ((point.elevation - minAltitude) / range) * plotHeight;
    return { x, y, ...point };
  });

  const linePath = coordinates.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath =
    coordinates.length > 0
      ? `${linePath} L ${coordinates[coordinates.length - 1].x} ${CHART_PAD_TOP + plotHeight} L ${coordinates[0].x} ${CHART_PAD_TOP + plotHeight} Z`
      : '';

  return (
    <div ref={sectionRef}>
      <span className="section-label">Altitude Information</span>
      <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-4">
        Know Before
        <span> You Go</span>
      </h2>
      <p className="text-foreground/60 text-sm font-light mb-10 max-w-xl">
        Altitude affects everyone differently. Here's how elevation changes day by day, so you can prepare and stay
        comfortable throughout the trip.
      </p>

      {/* Altitude Line Chart */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 mb-8 reveal-up">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground">Elevation Profile — Day by Day</h3>
          {coords ? (
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest ${isLive ? 'text-emerald-600' : 'text-muted-foreground'}`} data-testid="text-elevation-source">
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500' : loadingLive ? 'bg-amber-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
              {loadingLive ? 'Fetching live elevation…' : isLive ? 'Live from Open-Meteo' : 'Estimated profile'}
            </span>
          ) : null}
        </div>

        <div className="relative">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="w-full h-auto overflow-visible"
          data-testid="altitude-line-chart"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="altitude-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d={areaPath}
            fill="url(#altitude-fill)"
            style={{ opacity: drawn ? 1 : 0, transition: 'opacity 600ms ease' }}
          />
          <path
            d={linePath}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            style={{
              strokeDasharray: 100,
              strokeDashoffset: drawn ? 0 : 100,
              transition: 'stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1)',
            }}
          />

          {coordinates.map((c, i) => (
            <g
              key={`${c.name}-${i}`}
              className="cursor-pointer"
              style={{ opacity: drawn ? 1 : 0, transition: `opacity 300ms ease ${200 + i * 80}ms` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
            >
              <circle cx={c.x} cy={c.y} r={12} fill="transparent" />
              <circle
                cx={c.x}
                cy={c.y}
                r={hoveredIndex === i ? 6 : 4}
                fill="hsl(var(--primary))"
                stroke="#fff"
                strokeWidth={1.5}
                style={{ transition: 'r 150ms ease' }}
              />
              <text x={c.x} y={c.y - 12} textAnchor="middle" className="fill-foreground" fontSize={11} fontWeight={700}>
                {c.elevation.toLocaleString()}m
              </text>
              <text
                x={c.x}
                y={CHART_HEIGHT - CHART_PAD_BOTTOM + 20}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize={10}
                fontWeight={600}
              >
                {`Day ${i + 1}`}
              </text>
            </g>
          ))}
        </svg>

        {hoveredIndex !== null ? (
          (() => {
            const c = coordinates[hoveredIndex];
            const leftPct = (c.x / CHART_WIDTH) * 100;
            const topPct = (c.y / CHART_HEIGHT) * 100;
            const nearRightEdge = leftPct > 75;
            const nearLeftEdge = leftPct < 25;
            return (
              <div
                className="pointer-events-none absolute z-10 w-56 rounded-2xl bg-[#0a1330] text-white shadow-xl p-4"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: `translate(${nearRightEdge ? '-95%' : nearLeftEdge ? '-5%' : '-50%'}, calc(-100% - 14px))`,
                }}
                data-testid="altitude-tooltip"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a227]">Day {hoveredIndex + 1} · {c.place}</p>
                <p className="mt-1 font-serif font-bold text-base leading-snug">{c.elevation.toLocaleString()} m</p>
                {c.detail ? <p className="mt-1.5 text-xs text-white/70 leading-relaxed">{c.detail}</p> : null}
              </div>
            );
          })()
        ) : null}
        </div>

        {liveError ? (
          <p className="mt-3 text-xs text-amber-700 bg-amber-600/10 border border-amber-600/20 rounded-xl px-3 py-2" data-testid="text-elevation-error">
            Couldn't fetch live elevation ({liveError}) — showing the estimated profile instead.
          </p>
        ) : null}

        <div className="mt-6 pt-6 border-t border-border flex items-start gap-3 bg-amber-600/5 rounded-2xl p-4 border border-amber-600/20">
          <Icon name="ExclamationTriangleIcon" size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/70 leading-relaxed">
            <strong className="text-foreground">Note:</strong> Altitude sickness is unpredictable — it can affect fit,
            young travellers as much as older ones. Fitness level does not protect you. Acclimatisation time is the
            most reliable prevention.
          </p>
        </div>
      </div>

      {/* Acclimatization Tips */}
      <div className="reveal-up stagger-2">
        <h3 className="font-bold text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6">Acclimatisation Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {acclimatizationTips.map((tip, i) => (
            <div key={tip.title} className={`glass-card rounded-2xl p-5 flex gap-4 items-start reveal-up stagger-${i + 1}`}>
              <div className="w-10 h-10 rounded-xl bg-[#2f5f9e]/10 flex items-center justify-center flex-shrink-0">
                <Icon name={tip.icon} size={18} className="text-[#2f5f9e]" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm mb-1">{tip.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
