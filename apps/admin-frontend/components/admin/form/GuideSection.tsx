'use client';

import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { ImageUploader } from './ImageUploader';
import { SectionCard } from './SectionCard';

interface GuideSectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

export function GuideSection({ control, register, errors }: GuideSectionProps) {
  return (
    <SectionCard title="Guide" description="Optional — leave the name blank to omit a guide profile.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guide.name" className={labelClass}>
            Name
          </label>
          <input id="guide.name" className={inputClass} {...register('guide.name')} />
          <FieldError message={errors.guide?.name?.message} />
        </div>

        <div>
          <label className={labelClass}>Photo</label>
          <Controller
            control={control}
            name="guide.photo"
            render={({ field }) => (
              <ImageUploader
                value={field.value ? [field.value] : []}
                onChange={(urls) => field.onChange(urls[0] ?? '')}
                max={1}
              />
            )}
          />
          <FieldError message={errors.guide?.photo?.message} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="guide.bio" className={labelClass}>
          Bio
        </label>
        <textarea id="guide.bio" rows={3} className={inputClass} {...register('guide.bio')} />
        <FieldError message={errors.guide?.bio?.message} />
      </div>
    </SectionCard>
  );
}
