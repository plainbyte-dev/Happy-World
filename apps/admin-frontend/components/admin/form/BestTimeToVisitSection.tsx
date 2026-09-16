'use client';

import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { MONTH_VALUES, RATING_VALUES, type PackageInput } from '../../../schemas/package.schema';
import { FieldError } from './FieldError';
import { SectionCard } from './SectionCard';

interface BestTimeToVisitSectionProps {
  control: Control<PackageInput>;
  setValue: UseFormSetValue<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

const RATING_STYLES: Record<(typeof RATING_VALUES)[number], { active: string; label: string }> = {
  best: { active: 'bg-emerald-600 text-white border-emerald-600', label: 'Best' },
  normal: { active: 'bg-amber-500 text-white border-amber-500', label: 'Normal' },
  average: { active: 'bg-slate-400 text-white border-slate-400', label: 'Average' },
};

export function BestTimeToVisitSection({ control, setValue, errors }: BestTimeToVisitSectionProps) {
  const bestTimeToVisit = useWatch({ control, name: 'bestTimeToVisit' }) ?? [];

  function toggle(month: (typeof MONTH_VALUES)[number], rating: (typeof RATING_VALUES)[number]) {
    const current = bestTimeToVisit.find((entry) => entry.month === month);
    let next;
    if (current?.rating === rating) {
      next = bestTimeToVisit.filter((entry) => entry.month !== month);
    } else if (current) {
      next = bestTimeToVisit.map((entry) => (entry.month === month ? { ...entry, rating } : entry));
    } else {
      next = [...bestTimeToVisit, { month, rating }];
    }
    setValue('bestTimeToVisit', next, { shouldValidate: true, shouldDirty: true });
  }

  return (
    <SectionCard title="Best time to visit" description="Optional — rate the months this package is best suited for.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {MONTH_VALUES.map((month) => {
          const activeRating = bestTimeToVisit.find((entry) => entry.month === month)?.rating;
          return (
            <div key={month} className="rounded-md border border-slate-200 p-3">
              <p className="mb-2 text-sm font-medium text-slate-800">{month}</p>
              <div className="flex gap-1">
                {RATING_VALUES.map((rating) => {
                  const isActive = activeRating === rating;
                  const style = RATING_STYLES[rating];
                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => toggle(month, rating)}
                      className={`flex-1 rounded border px-1.5 py-1 text-[11px] font-medium transition-colors ${
                        isActive ? style.active : 'border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {style.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <FieldError message={errors.bestTimeToVisit?.message as string | undefined} />
    </SectionCard>
  );
}
