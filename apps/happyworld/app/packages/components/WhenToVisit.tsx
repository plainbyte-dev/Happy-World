'use client';

import { useState } from 'react';
import type { MonthRating } from '@/lib/packages';

type WhenToVisitProps = {
  bestTime: { month: string; rating: MonthRating }[];
};

const ratingConfig: Record<MonthRating, { label: string; color: string; bg: string; dot: string; note: string }> = {
  excellent: {
    label: 'Excellent',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10 border-emerald-400/30',
    dot: 'bg-emerald-400',
    note: 'One of the best months to travel — clear conditions and comfortable pace throughout.',
  },
  good: {
    label: 'Good',
    color: 'text-primary',
    bg: 'bg-primary/10 border-primary/30',
    dot: 'bg-primary',
    note: 'A solid month to go — generally favourable conditions with occasional variability.',
  },
  fair: {
    label: 'Fair',
    color: 'text-amber-600',
    bg: 'bg-amber-600/10 border-amber-600/30',
    dot: 'bg-amber-600',
    note: 'Workable, but expect more changeable weather — pack layers and stay flexible.',
  },
  poor: {
    label: 'Poor',
    color: 'text-red-400',
    bg: 'bg-red-400/10 border-red-400/30',
    dot: 'bg-red-400',
    note: 'Conditions are at their most unpredictable this month — worth avoiding if your dates are flexible.',
  },
};

export default function WhenToVisit({ bestTime }: WhenToVisitProps) {
  const defaultIdx = Math.max(bestTime.findIndex((m) => m.rating === 'excellent'), 0);
  const [activeMonth, setActiveMonth] = useState<number>(defaultIdx);

  const selected = bestTime[activeMonth];
  const cfg = ratingConfig[selected.rating];

  return (
    <div>
      <span className="section-label">Best Time to Go</span>
      <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground mb-4">
        When to
        <span> Visit</span>
      </h2>
      <p className="text-foreground/60 text-sm font-light mb-10 max-w-xl">
        This route is open year-round, but conditions vary by month. Tap any month to see how it compares.
      </p>

      {/* 12-Month Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 mb-8">
        {bestTime.map((m, i) => {
          const c = ratingConfig[m.rating];
          const isActive = activeMonth === i;
          return (
            <button
              key={m.month}
              onClick={() => setActiveMonth(i)}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border text-center transition-all duration-300 ${
                isActive ? `${c.bg} ${c.color} border-current scale-105 shadow-lg` : 'border-border text-muted-foreground hover:border-border/80 hover:text-foreground'
              }`}
              aria-label={`${m.month}: ${c.label}`}
            >
              <span className={`w-2 h-2 rounded-full ${c.dot} opacity-80`} />
              <span className="text-[11px] font-bold">{m.month}</span>
            </button>
          );
        })}
      </div>

      {/* Selected Month Detail */}
      <div className={`glass-card rounded-3xl p-6 sm:p-8 border ${cfg.bg} transition-all duration-500`}>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <h3 className="font-serif text-2xl font-bold text-foreground">{selected.month}</h3>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
        </div>
        <p className="text-foreground/70 text-sm leading-relaxed">{cfg.note}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6">
        {(Object.entries(ratingConfig) as [MonthRating, (typeof ratingConfig)[MonthRating]][]).map(([key, val]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${val.dot}`} />
            <span className="text-xs text-muted-foreground">{val.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
