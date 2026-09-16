'use client';

import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import type { PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { SectionCard } from './SectionCard';

const MIN_LENGTH = 50;

interface DescriptionSectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

export function DescriptionSection({ control, register, errors }: DescriptionSectionProps) {
  const description = useWatch({ control, name: 'description' }) ?? '';

  return (
    <SectionCard title="Description">
      <textarea id="description" rows={5} className={inputClass} {...register('description')} />
      <div className="mt-1 flex items-center justify-between">
        <FieldError message={errors.description?.message} />
        <span className={`text-xs ${description.length < MIN_LENGTH ? 'text-slate-400' : 'text-slate-500'}`}>
          {description.length} characters {description.length < MIN_LENGTH ? `(min ${MIN_LENGTH})` : ''}
        </span>
      </div>
      <label htmlFor="description" className={`${labelClass} sr-only`}>
        Description
      </label>
    </SectionCard>
  );
}
