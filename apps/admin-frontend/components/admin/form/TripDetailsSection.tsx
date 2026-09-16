'use client';

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { DIFFICULTY_VALUES } from '../../../constants/difficulty';
import type { PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { SectionCard } from './SectionCard';
import { TagInput } from './TagInput';

interface TripDetailsSectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

export function TripDetailsSection({ control, register, errors }: TripDetailsSectionProps) {
  return (
    <SectionCard title="Trip details" description="Optional — shown on the package hero and detail page.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="difficulty" className={labelClass}>
            Difficulty
          </label>
          <select id="difficulty" className={inputClass} {...register('difficulty')}>
            <option value="">Not set</option>
            {DIFFICULTY_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <FieldError message={errors.difficulty?.message} />
        </div>

        <div>
          <label htmlFor="groupSize" className={labelClass}>
            Group size
          </label>
          <input id="groupSize" className={inputClass} placeholder="e.g. 2–12 travellers" {...register('groupSize')} />
          <FieldError message={errors.groupSize?.message} />
        </div>

        <div>
          <label htmlFor="maxAltitude" className={labelClass}>
            Max altitude
          </label>
          <input id="maxAltitude" className={inputClass} placeholder="e.g. 1,600 m" {...register('maxAltitude')} />
          <FieldError message={errors.maxAltitude?.message} />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>Highlights</label>
        <Controller
          control={control}
          name="highlights"
          render={({ field }) => (
            <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter" />
          )}
        />
        <FieldError message={errors.highlights?.message} />
      </div>

      <div className="mt-4">
        <label htmlFor="heroVideo" className={labelClass}>
          Hero video URL
        </label>
        <input id="heroVideo" className={inputClass} placeholder="https://..." {...register('heroVideo')} />
        <FieldError message={errors.heroVideo?.message} />
      </div>
    </SectionCard>
  );
}
