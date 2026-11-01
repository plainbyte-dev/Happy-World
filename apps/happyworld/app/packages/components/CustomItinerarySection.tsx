'use client';

import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { AlertTriangle, ChevronLeft, ChevronRight, Mail, NotebookPen, Plus, Trash2 } from 'lucide-react';
import { useSiteContent } from '@/lib/site-content-context';

export type CustomDay = {
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
  /** Pre-fills the builder on mount, e.g. with the standard itinerary copied over by "Customize". */
  initialDays?: Array<Omit<CustomDay, 'id'>>;
};

export type CustomItinerarySectionHandle = {
  /** Opens the builder and scrolls it into view — called imperatively by an ancestor, e.g. a sidebar CTA. */
  open: () => void;
  /** Replaces the builder's days (e.g. with the standard itinerary copied over) and opens it. */
  loadDays: (days: Array<Omit<CustomDay, 'id'>>) => void;
};

let idCounter = 0;
const nextId = () => {
  idCounter += 1;
  return `custom-day-${idCounter}`;
};

const blankDay = (): CustomDay => ({ id: nextId(), title: '', detail: '', meals: '', stay: '', transport: '' });

// First entry of each list is the blank/unselected placeholder (value=""), kept out of the
// sent message by the existing `day.meals.trim() && ...` checks in sendItinerary below.
export const MEALS_OPTIONS = ['No meals included', 'Breakfast only', 'Breakfast & Lunch', 'Breakfast & Dinner', 'Lunch & Dinner', 'All meals (Breakfast, Lunch & Dinner)'];
export const STAY_OPTIONS = ['Teahouse', 'Guesthouse', 'Lodge', 'Hotel', 'Homestay', 'Camp / Tented camp'];
export const TRANSPORT_OPTIONS = ['On foot', 'Private vehicle', 'Support vehicle', 'Shared jeep', 'Public bus', 'Domestic flight'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ignores `id` — only the content a traveler could actually type matters for
// telling "copied from the standard itinerary, unedited" apart from a real change.
function daysEqual(a: CustomDay[], b: Array<Omit<CustomDay, 'id'>>): boolean {
  if (a.length !== b.length) return false;
  return a.every((day, i) => {
    const base = b[i];
    return day.title === base.title && day.detail === base.detail && day.meals === base.meals && day.stay === base.stay && day.transport === base.transport;
  });
}

function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

const CustomItinerarySection = forwardRef<CustomItinerarySectionHandle, CustomItinerarySectionProps>(function CustomItinerarySection(
  { packageName, fullWidth = false, initialDays },
  ref,
) {
  const { footer } = useSiteContent();
  // Full-width means the outer split panel already made the user choose to expand
  // this exact section — starting it collapsed again would force a redundant
  // second "Open builder" click right after the first one.
  const [open, setOpen] = useState(fullWidth);
  const [days, setDays] = useState<CustomDay[]>(() =>
    initialDays && initialDays.length > 0 ? initialDays.map((day) => ({ ...day, id: nextId() })) : [blankDay()],
  );
  // Snapshot of the standard itinerary this builder was copied from (via "Customize this
  // itinerary"), used only to warn when nothing's actually been changed yet. Null when the
  // builder was opened blank, since "unchanged" has no meaning there.
  const [baseline, setBaseline] = useState<Array<Omit<CustomDay, 'id'>> | null>(() =>
    initialDays && initialDays.length > 0 ? initialDays : null,
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [unchangedWarningAcked, setUnchangedWarningAcked] = useState(false);
  // Set once a Gmail compose draft has been opened — holds the same link again as a
  // fallback (and for "Edit and resend") rather than a plain boolean.
  const [gmailUrl, setGmailUrl] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen(true);
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    loadDays: (newDays) => {
      setDays(newDays.length > 0 ? newDays.map((day) => ({ ...day, id: nextId() })) : [blankDay()]);
      setBaseline(newDays.length > 0 ? newDays : null);
      setUnchangedWarningAcked(false);
      setGmailUrl(null);
      setOpen(true);
      rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
  }));

  const updateDay = (id: string, field: keyof Omit<CustomDay, 'id'>, value: string) => {
    setDays((prev) => prev.map((day) => (day.id === id ? { ...day, [field]: value } : day)));
    setUnchangedWarningAcked(false);
  };

  const addDay = () => {
    setDays((prev) => [...prev, blankDay()]);
    setUnchangedWarningAcked(false);
  };
  const removeDay = (id: string) => {
    setDays((prev) => (prev.length > 1 ? prev.filter((day) => day.id !== id) : prev));
    setUnchangedWarningAcked(false);
  };

  const hasContent = days.some((day) => day.title.trim() || day.detail.trim());
  const isUnchangedFromStandard = baseline !== null && daysEqual(days, baseline);
  const showUnchangedWarning = isUnchangedFromStandard && !unchangedWarningAcked;

  const buildDaysText = () => {
    const lines: string[] = [];
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
    return lines.join('\n').trim();
  };

  // Builds a ready-to-review draft and opens it in Gmail's own compose window — the
  // traveler checks it over and hits Send themselves, rather than this app sending on
  // their behalf. Their signed-in Gmail account becomes the actual "From"; name/email
  // are still asked for and included in the body so the team knows who it's from even
  // before the traveler confirms it's the same address they're signed into Gmail with.
  const openInGmail = () => {
    if (showUnchangedWarning) {
      // First click on an unedited, copied-over itinerary just surfaces the warning —
      // the traveler has to consciously confirm before a draft is opened.
      setUnchangedWarningAcked(true);
      return;
    }
    if (!name.trim() || !email.trim()) {
      setFormError('Add your name and email so the team knows who this is from.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setFormError("That email address doesn't look right.");
      return;
    }
    setFormError(null);

    const subject = `Custom itinerary idea for ${packageName}`;
    const body = [
      'Hi Happy World Tours & Travel,',
      '',
      `Here's a custom itinerary idea for ${packageName}:`,
      '',
      buildDaysText(),
      '',
      `— ${name.trim()} (${email.trim()})`,
    ].join('\n');
    const url = buildGmailComposeUrl(footer.email, subject, body);
    setGmailUrl(url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={rootRef} className={fullWidth ? '' : 'flex justify-end'}>
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
              Sketch out the days the way you'd want them — add as many as you like, in the same format as the itinerary above, then open it as a ready-to-send email in Gmail to our team.
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
                      <select
                        value={day.meals}
                        onChange={(e) => updateDay(day.id, 'meals', e.target.value)}
                        className="bg-transparent border-b border-border pb-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                        aria-label="Meals"
                        data-testid={`select-custom-meals-${i + 1}`}
                      >
                        <option value="">Meals</option>
                        {MEALS_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <select
                        value={day.stay}
                        onChange={(e) => updateDay(day.id, 'stay', e.target.value)}
                        className="bg-transparent border-b border-border pb-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                        aria-label="Stay"
                        data-testid={`select-custom-stay-${i + 1}`}
                      >
                        <option value="">Stay</option>
                        {STAY_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <select
                        value={day.transport}
                        onChange={(e) => updateDay(day.id, 'transport', e.target.value)}
                        className="bg-transparent border-b border-border pb-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                        aria-label="Transport"
                        data-testid={`select-custom-transport-${i + 1}`}
                      >
                        <option value="">Transport</option>
                        {TRANSPORT_OPTIONS.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {gmailUrl ? (
              <div className="glass-card rounded-3xl p-6 sm:p-8 mt-6 border-emerald-500/30 bg-emerald-500/5 flex items-start gap-4" data-testid="text-custom-itinerary-opened">
                <span className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </span>
                <div>
                  <p className="font-serif font-bold text-foreground mb-1">Opened in Gmail</p>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    We&apos;ve pre-filled a draft to Happy World Tours &amp; Travel with your itinerary — check it over and hit Send in Gmail whenever you&apos;re ready.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <a href={gmailUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-primary underline" data-testid="link-reopen-gmail">
                      Didn&apos;t open? Click here
                    </a>
                    <button type="button" onClick={() => setGmailUrl(null)} className="text-sm font-bold text-foreground/70 hover:text-foreground" data-testid="button-edit-custom-itinerary">
                      Edit and redo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {showUnchangedWarning ? (
                  <div
                    className="glass-card rounded-3xl p-5 sm:p-6 mt-6 border-amber-500/30 bg-amber-500/5 flex items-start gap-3"
                    data-testid="warning-itinerary-unchanged"
                  >
                    <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground text-sm mb-1">This still matches the standard itinerary</p>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        Tweak a day or two to tell us what you&apos;d like different — or if the standard plan already works for you, send it as is and we&apos;ll take it from here.
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="Your name"
                    className="bg-transparent border-b border-border pb-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
                    data-testid="input-custom-itinerary-name"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setFormError(null);
                    }}
                    placeholder="Your email"
                    className="bg-transparent border-b border-border pb-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-colors"
                    data-testid="input-custom-itinerary-email"
                  />
                </div>
                {formError ? <p className="text-xs text-destructive mt-2">{formError}</p> : null}

                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button type="button" onClick={addDay} className="btn-outline inline-flex items-center gap-2" data-testid="button-add-custom-day">
                    <Plus size={16} /> Add a day
                  </button>
                  <button
                    type="button"
                    onClick={openInGmail}
                    disabled={!hasContent}
                    className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                    data-testid="button-send-custom-itinerary"
                  >
                    <Mail size={16} />
                    {showUnchangedWarning ? 'Open in Gmail anyway' : 'Open in Gmail to send'}
                  </button>
                </div>
              </>
            )}
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
});

export default CustomItinerarySection;
