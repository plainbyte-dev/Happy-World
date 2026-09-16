'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import type { PackageDetail } from '@/lib/packages';

type BookingSidebarProps = {
  detail: PackageDetail;
  onEnquire: () => void;
};

export default function BookingSidebar({ detail, onEnquire }: BookingSidebarProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travelers, setTravelers] = useState(2);

  return (
    <div className="sticky-booking">
      <div className="glass-card rounded-4xl p-6 border-primary/20">
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">From</span>
          <span className="font-serif text-4xl font-bold gold-text">
            {detail.priceCurrency} {detail.priceFrom.toLocaleString()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-6">per person</p>

        {/* Dates */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">Dates</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              aria-label="Start date"
              className="flex-1 min-w-0 border border-border rounded-xl px-3 py-2 text-xs text-foreground bg-background"
            />
            <span className="text-muted-foreground">–</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => setEndDate(e.target.value)}
              aria-label="End date"
              className="flex-1 min-w-0 border border-border rounded-xl px-3 py-2 text-xs text-foreground bg-background"
            />
          </div>
        </div>

        {/* Travelers */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">Travelers</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
              aria-label="Decrease travelers"
            >
              <Icon name="MinusIcon" size={16} />
            </button>
            <span className="font-bold text-foreground text-lg w-8 text-center">{travelers}</span>
            <button
              onClick={() => setTravelers(Math.min(16, travelers + 1))}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
              aria-label="Increase travelers"
            >
              <Icon name="PlusIcon" size={16} />
            </button>
            <span className="text-xs text-muted-foreground ml-2">Max 16</span>
          </div>
        </div>

        <p className="mb-6 text-xs text-muted-foreground leading-relaxed">
          Final pricing depends on group size, dates and add-ons — we'll send a full quote after you enquire.
        </p>

        {/* CTA */}
        <button type="button" onClick={onEnquire} className="btn-primary w-full text-center mb-3">
          Enquire
        </button>
        <button type="button" onClick={onEnquire} className="btn-outline w-full text-center text-sm">
          Build a Custom Trip
        </button>

        {/* Trust Signals */}
        <div className="mt-5 flex flex-col gap-2.5">
          {[
            { icon: 'ShieldCheckIcon' as const, text: `${detail.quickFacts.difficulty} pace across ${detail.quickFacts.duration}` },
            { icon: 'LockClosedIcon' as const, text: `Small groups, ${detail.quickFacts.groupSize}` },
            { icon: 'PhoneIcon' as const, text: 'Local guide included throughout the trip' },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2.5">
              <Icon name={item.icon} size={15} className="text-primary flex-shrink-0" />
              <span className="text-xs text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guide Card */}
      <div className="glass-card rounded-3xl p-5">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Your Lead Guide</p>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-muted">
            <img src={detail.guide.photo} alt={detail.guide.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">{detail.guide.name}</p>
            <p className="text-xs text-primary">{detail.destinationLabel} guide</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{detail.guide.bio}</p>
      </div>
    </div>
  );
}
