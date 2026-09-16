'use client';

import { useEffect, useState } from 'react';
import type { Control, FieldArrayWithId, FieldErrors, UseFormRegister } from 'react-hook-form';
import { DURATION_DAY_RANGE, type Duration } from '../../../constants/duration';
import type { PackageInput } from '../../../schemas/package.schema';
import { FieldError } from './FieldError';
import { ItineraryDayCard } from './ItineraryDayCard';
import { SectionCard } from './SectionCard';

interface ItinerarySectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
  fields: FieldArrayWithId<PackageInput, 'itinerary', 'id'>[];
  duration: Duration;
  onAddDay: () => void;
  onRemoveDay: (index: number) => void;
  errorDayIndices: number[];
}

export function ItinerarySection({
  control,
  register,
  errors,
  fields,
  duration,
  onAddDay,
  onRemoveDay,
  errorDayIndices,
}: ItinerarySectionProps) {
  const { min, max } = DURATION_DAY_RANGE[duration];
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set(fields.map((_, i) => i)));

  useEffect(() => {
    if (errorDayIndices.length === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- force-open day cards when a submit reports errors on them
    setOpenIndices((prev) => new Set([...prev, ...errorDayIndices]));
  }, [errorDayIndices]);

  function toggle(index: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleAdd() {
    onAddDay();
    setOpenIndices((prev) => new Set([...prev, fields.length]));
  }

  const atMax = fields.length >= max;

  return (
    <SectionCard title="Itinerary" description={`This package needs between ${min} and ${max} days.`}>
      <div className="space-y-3">
        {fields.map((field, index) => (
          <ItineraryDayCard
            key={field.id}
            index={index}
            control={control}
            register={register}
            errors={errors}
            isOpen={openIndices.has(index)}
            onToggle={() => toggle(index)}
            onRemove={() => onRemoveDay(index)}
            canRemove={fields.length > min}
          />
        ))}
      </div>

      <FieldError
        message={
          (errors.itinerary as { message?: string; root?: { message?: string } } | undefined)?.root?.message ??
          (errors.itinerary as { message?: string } | undefined)?.message
        }
      />

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={handleAdd}
          disabled={atMax}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add Day
        </button>
        <span className="text-xs text-slate-500">
          {fields.length} of {max} days
          {atMax ? ` — Maximum ${max} days for a ${duration.replace('-', '–')} day package` : ''}
        </span>
      </div>
    </SectionCard>
  );
}
