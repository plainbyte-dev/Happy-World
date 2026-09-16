'use client';

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import { CURRENCY_VALUES, type PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { SectionCard } from './SectionCard';
import { TagInput } from './TagInput';

interface CostSectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

export function CostSection({ control, register, errors }: CostSectionProps) {
  const cost = useWatch({ control, name: 'cost' });

  return (
    <SectionCard title="Cost" description="Per person (per pax).">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>From</label>
          <input
            type="number"
            step="1"
            className={inputClass}
            {...register('cost.from', { valueAsNumber: true })}
          />
          <FieldError message={errors.cost?.from?.message} />
        </div>
        <div>
          <label className={labelClass}>To</label>
          <input type="number" step="1" className={inputClass} {...register('cost.to', { valueAsNumber: true })} />
          <FieldError message={errors.cost?.to?.message} />
        </div>
        <div>
          <label className={labelClass}>Currency</label>
          <select className={inputClass} {...register('cost.currency')}>
            {CURRENCY_VALUES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      {cost && (
        <p className="mt-3 text-sm text-slate-600">
          {cost.currency} {Number.isFinite(cost.from) ? cost.from.toLocaleString() : 0} – {cost.currency}{' '}
          {Number.isFinite(cost.to) ? cost.to.toLocaleString() : 0} per person
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>What&apos;s included</label>
          <Controller
            control={control}
            name="costIncludes"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter" />
            )}
          />
          <FieldError message={errors.costIncludes?.message} />
        </div>
        <div>
          <label className={labelClass}>What&apos;s excluded</label>
          <Controller
            control={control}
            name="costExcludes"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter" />
            )}
          />
          <FieldError message={errors.costExcludes?.message} />
        </div>
      </div>
    </SectionCard>
  );
}
