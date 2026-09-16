'use client';

import { useState, useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import type { ItineraryDay } from '@/lib/packages';

type ItenarySectionProps = {
  itinerary: ItineraryDay[];
  destinationLabel: string;
  heroImage: string;
  packageName: string;
  duration?: string;
};

type ViewMode = 'detailed' | 'outline';

export default function ItenarySection({ itinerary, destinationLabel, heroImage, packageName, duration }: ItenarySectionProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(() => new Set(itinerary[0] ? [itinerary[0].day] : []));
  const [viewMode, setViewMode] = useState<ViewMode>('detailed');
  const [downloading, setDownloading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const allOpen = itinerary.length > 0 && itinerary.every((day) => expandedDays.has(day.day));

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) {
        next.delete(dayNumber);
      } else {
        next.add(dayNumber);
      }
      return next;
    });
  };

  const toggleAllDays = () => {
    setExpandedDays(allOpen ? new Set() : new Set(itinerary.map((day) => day.day)));
  };

  useEffect(() => {
    const items = sectionRef?.current?.querySelectorAll('.reveal-up');
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.05 }
    );
    items?.forEach((item) => observer?.observe(item));
    return () => observer?.disconnect();
  }, []);

  const downloadItineraryPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 48;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
      };

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(packageName, margin, y);
      y += 22;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(110, 110, 110);
      const subtitle = [destinationLabel, duration].filter(Boolean).join(' · ');
      if (subtitle) {
        doc.text(subtitle, margin, y);
        y += 24;
      } else {
        y += 12;
      }
      doc.setTextColor(20, 20, 20);

      itinerary.forEach((day) => {
        ensureSpace(60);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.text(`Day ${day.day} — ${day.title}`, margin, y);
        y += 18;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(70, 70, 70);
        const detailLines: string[] = doc.splitTextToSize(day.detail, contentWidth);
        detailLines.forEach((line) => {
          ensureSpace(14);
          doc.text(line, margin, y);
          y += 14;
        });

        if (day.keyActivities && day.keyActivities.length > 0) {
          ensureSpace(14);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(20, 20, 20);
          doc.text('Key Activities:', margin, y);
          y += 13;

          doc.setFont('helvetica', 'normal');
          doc.setTextColor(70, 70, 70);
          const activitiesLines: string[] = doc.splitTextToSize(day.keyActivities.join('   ·   '), contentWidth);
          activitiesLines.forEach((line) => {
            ensureSpace(13);
            doc.text(line, margin, y);
            y += 13;
          });
          y += 2;
        }

        ensureSpace(14);
        doc.setFontSize(9.5);
        const meta = [`Meals: ${day.meals}`, `Stay: ${day.stay}`, `Transport: ${day.transport}`].join('   ·   ');
        const metaLines: string[] = doc.splitTextToSize(meta, contentWidth);
        metaLines.forEach((line) => {
          ensureSpace(13);
          doc.text(line, margin, y);
          y += 13;
        });

        doc.setTextColor(20, 20, 20);
        y += 14;
      });

      const fileSlug = packageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      doc.save(`${fileSlug || 'itinerary'}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div ref={sectionRef}>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <span className="section-label">Day-by-Day Plan</span>
          <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground">
            Your
            <span> Itinerary</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-full bg-muted p-1" role="tablist" aria-label="Itinerary view">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'detailed'}
              onClick={() => setViewMode('detailed')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
                viewMode === 'detailed' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid="button-itinerary-view-detailed"
            >
              Detailed
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'outline'}
              onClick={() => setViewMode('outline')}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
                viewMode === 'outline' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
              data-testid="button-itinerary-view-outline"
            >
              Outline
            </button>
          </div>

          <button
            type="button"
            onClick={downloadItineraryPdf}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-bold text-foreground transition-all duration-200 hover:bg-muted disabled:opacity-60"
            data-testid="button-itinerary-download-pdf"
          >
            <Icon name="DownloadIcon" size={15} />
            {downloading ? 'Preparing…' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div className="mb-10">
        <button
          type="button"
          onClick={toggleAllDays}
          disabled={viewMode !== 'detailed'}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-bold text-foreground transition-all duration-200 hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
          data-testid="button-itinerary-toggle-all"
        >
          {allOpen ? 'Collapse all' : 'Open all'}
        </button>
      </div>

      {viewMode === 'outline' ? (
        <div className="glass-card rounded-3xl divide-y divide-border overflow-hidden" data-testid="itinerary-outline">
          {itinerary.map((day, i) => (
            <div key={day.day} className={`reveal-up stagger-${Math.min(i + 1, 6)} flex items-center gap-4 px-5 sm:px-6 py-4`}>
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-muted flex flex-col items-center justify-center font-bold">
                <span className="text-[9px] uppercase tracking-wider leading-none text-muted-foreground">Day</span>
                <span className="text-sm leading-none text-foreground">{day.day}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground text-sm sm:text-base truncate">{day.title}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground flex-shrink-0">
                <Icon name="MapPinIcon" size={13} className="text-primary" />
                {destinationLabel}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4" data-testid="itinerary-detailed">
          {itinerary.map((day, i) => {
            const isOpen = expandedDays.has(day.day);
            const meals = day.meals === '—' ? [] : day.meals.split(', ');
            return (
              <div
                key={day.day}
                className={`reveal-up stagger-${Math.min(i + 1, 6)} glass-card rounded-3xl overflow-hidden transition-all duration-500`}
              >
                {/* Day Header — always visible */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left group"
                  aria-expanded={isOpen}
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold transition-all duration-300 ${
                      isOpen ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider leading-none">Day</span>
                    <span className="text-lg leading-none">{day.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground text-base group-hover:text-primary transition-colors">{day.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{day.keyActivities?.[0] ?? day.transport}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Icon name="MapPinIcon" size={14} className="text-primary" />
                    {destinationLabel}
                  </div>
                  <Icon
                    name="ChevronDownIcon"
                    size={20}
                    className={`text-muted-foreground flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Expanded content */}
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <div className="px-5 sm:px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="image-zoom-container rounded-2xl overflow-hidden h-[200px] sm:h-[240px] relative">
                      <AppImage
                        src={day.image?.src ?? heroImage}
                        alt={day.image?.alt ?? day.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground mb-3">Highlights</p>
                        <p className="text-sm text-foreground/70 leading-relaxed">{day.detail}</p>
                      </div>

                      {day.keyActivities && day.keyActivities.length > 0 ? (
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Key Activities</p>
                          <div className="flex flex-wrap gap-2">
                            {day.keyActivities.map((activity) => (
                              <span key={activity} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      <div className="flex flex-wrap gap-4 pt-2 border-t border-border">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Meals</p>
                          <div className="flex gap-2">
                            {meals.length > 0 ? (
                              meals.map((m) => (
                                <span key={m} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold">
                                  {m}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-foreground/70">—</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Stay</p>
                          <p className="text-xs text-foreground/70">{day.stay}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Transport</p>
                          <p className="text-xs text-foreground/70">{day.transport}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
