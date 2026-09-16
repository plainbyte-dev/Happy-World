'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, NotebookPen, Plus, Send, Trash2 } from 'lucide-react';

type CustomDay = {
  id: string;
  title: string;
  detail: string;
  meals: string;
  stay: string;
  transport: string;
};

type CustomItinerarySectionProps = {
  packageName: string;
  /** When true, the component fills its container width; outer split-panel handles expand/collapse. */
  fullWidth?: boolean;
};

let idCounter = 0;
const nextId = () => {
  idCounter += 1;
  return `custom-day-${idCounter}`;
};

const blankDay = (): CustomDay => ({ id: nextId(), title: '', detail: '', meals: '', stay: '', transport: '' });

export default function CustomItinerarySection({ packageName, fullWidth = false }: CustomItinerarySectionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState<CustomDay[]>([blankDay()]);

  const updateDay = (id: string, field: keyof Omit<CustomDay, 'id'>, value: string) => {
    setDays((prev) => prev.map((day) => (day.id === id ? { ...day, [field]: value } : day)));
  };

  const addDay = () => setDays((prev) => [...prev, blankDay()]);
  const removeDay = (id: string) => setDays((prev) => (prev.length > 1 ? prev.filter((day) => day.id !== id) : prev));

  const hasContent = days.some((day) => day.title.trim() || day.detail.trim());

  const sendItinerary = () => {
    const lines = [`Custom itinerary idea for ${packageName}:`, ''];
    days.forEach((day, i) => {
      if (!day.title.trim() && !day.detail.trim()) return;
      lines.push(`Day ${i + 1} — ${day.title.trim() || 'Untitled'}`);
      if (day.detail.trim()) lines.push(day.detail.trim());
      const meta = [
        day.meals.trim() && `Meals: ${day.meals.trim()}`,
        day.stay.trim() && `Stay: ${day.stay.trim()}`,
        day.transport.trim() && `Transport: ${day.transport.trim()}`,
      ]
        .filter(Boolean)
        .join('   ·   ');
      if (meta) lines.push(meta);
      lines.push('');
    });
    const message = lines.join('\n').trim();
    router.push(`/contact?message=${encodeURIComponent(message)}`);
  };

  return (
    <div className={fullWidth ? '' : 'flex justify-end'}>
      <div
        className={fullWidth ? 'w-full' : `w-full transition-[width] duration-500 ease-in-out ${open ? 'sm:w-4/5' : 'sm:w-1/5'}`}
        data-testid="custom-itinerary-panel"
      >
        {open ? (
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="section-label">Plan It Your Way</span>
                <h2 className="font-serif text-display-sm font-bold tracking-tighter text-foreground">
                  Build Your
                  <span> Own Itinerary</span>
                </h2>
              </div>
              {!fullWidth && (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-bold text-foreground transition-all hover:bg-muted"
                  data-testid="button-collapse-custom-itinerary"
                >
                  <ChevronRight size={15} /> Collapse
                </button>
              )}
            </div>
            <p className="text-foreground/60 text-sm font-light mb-10 max-w-xl">
              Sketch out the days the way you'd want them — add as many as you like, in the same format as the itinerary above, then send it straight to our team to shape into a real trip.
            </p>

            <div className="flex flex-col gap-4">
              {days.map((day, i) => (
                <div key={day.id} className="glass-card rounded-3xl p-5 sm:p-6" data-testid={`custom-day-${i + 1}`}>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold text-foreground flex-shrink-0">
                      {i + 1}
                    </span>
                    {days.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeDay(day.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove day ${i + 1}`}
                        data-testid={`button-remove-custom-day-${i + 1}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-4">
                    <input
                      value={day.title}
                      onChange={(e) => updateDay(day.id, 'title', e.target.value)}
                      placeholder="What happens this day?"
                      className="bg-transparent border-b border-border pb-2 text-sm font-bold text-foreground placeholder:text-muted-foreground/60 placeholder:font-normal outline-none focus:border-primary transition-colors"
                      data-testid={`input-custom-title-${i + 1}`}
                    />
                    <textarea
                      value={day.detail}
                      onChange={(e) => updateDay(day.id, 'detail', e.target.value)}
                      placeholder="Highlights, pace, anything you're picturing..."
                      rows={2}
                      className="bg-transparent border-b border-border pb-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors resize-none"
                      data-testid={`input-custom-detail-${i + 1}`}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        value={day.meals}
                        onChange={(e) => updateDay(day.id, 'meals', e.target.value)}
                        placeholder="Meals"
                        className="bg-transparent border-b border-border pb-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
                        data-testid={`input-custom-meals-${i + 1}`}
                      />
                      <input
                        value={day.stay}
                        onChange={(e) => updateDay(day.id, 'stay', e.target.value)}
                        placeholder="Stay"
                        className="bg-transparent border-b border-border pb-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
                        data-testid={`input-custom-stay-${i + 1}`}
                      />
                      <input
                        value={day.transport}
                        onChange={(e) => updateDay(day.id, 'transport', e.target.value)}
                        placeholder="Transport"
                        className="bg-transparent border-b border-border pb-2 text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
                        data-testid={`input-custom-transport-${i + 1}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button type="button" onClick={addDay} className="btn-outline inline-flex items-center gap-2" data-testid="button-add-custom-day">
                <Plus size={16} /> Add a day
              </button>
              <button
                type="button"
                onClick={sendItinerary}
                disabled={!hasContent}
                className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                data-testid="button-send-custom-itinerary"
              >
                <Send size={16} /> Send this itinerary
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group w-full glass-card rounded-3xl p-6 flex sm:flex-col items-center sm:items-start gap-4 text-left transition-all hover:border-primary/40 hover:shadow-lg"
            data-testid="button-expand-custom-itinerary"
          >
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <NotebookPen size={19} />
            </div>
            <div className="flex-1">
              <p className="font-serif font-bold text-lg text-foreground leading-snug">Build Your Own Itinerary</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">Sketch your own day-by-day plan and send it to our team.</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-primary">
              Open builder <ChevronLeft size={15} />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
