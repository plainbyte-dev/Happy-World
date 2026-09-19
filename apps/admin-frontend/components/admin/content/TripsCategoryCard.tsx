'use client';

import { Controller, useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import { FieldError } from '../form/FieldError';
import { ImageUploader } from '../form/ImageUploader';
import { SectionCard } from '../form/SectionCard';
import { inputClass, labelClass } from '../../../lib/formStyles';
import type { TripsMenuInput } from '../../../schemas/siteContent.schema';

type FormShape = { value: TripsMenuInput };

interface TripsCategoryCardProps {
  control: Control<FormShape>;
  register: UseFormRegister<FormShape>;
  errors: FieldErrors<FormShape>;
  categoryIndex: number;
  categoryKey: string;
}

const emptyDestination = { label: '', href: '', blurb: '' };

export function TripsCategoryCard({ control, register, errors, categoryIndex, categoryKey }: TripsCategoryCardProps) {
  const { fields, append, remove } = useFieldArray({ control, name: `value.${categoryIndex}.destinations` });
  const categoryErrors = errors.value?.[categoryIndex];

  return (
    <SectionCard title={categoryKey} description="The category key is fixed — it's also used to tag packages.">
      {/* key is not user-editable, but must still round-trip on save */}
      <input type="hidden" {...register(`value.${categoryIndex}.key`)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Label</label>
          <input className={inputClass} {...register(`value.${categoryIndex}.label`)} />
          <FieldError message={categoryErrors?.label?.message} />
        </div>
        <div>
          <label className={labelClass}>Link</label>
          <input className={inputClass} {...register(`value.${categoryIndex}.href`)} />
          <FieldError message={categoryErrors?.href?.message} />
        </div>
      </div>

      <div className="mt-4">
        <label className={labelClass}>Description</label>
        <input className={inputClass} {...register(`value.${categoryIndex}.description`)} />
        <FieldError message={categoryErrors?.description?.message} />
      </div>

      <div className="mt-4">
        <label className={labelClass}>Image</label>
        <Controller
          control={control}
          name={`value.${categoryIndex}.image`}
          render={({ field: imageField }) => (
            <ImageUploader
              value={imageField.value ? [imageField.value] : []}
              onChange={(urls) => imageField.onChange(urls[0] ?? '')}
              max={1}
            />
          )}
        />
        <FieldError message={categoryErrors?.image?.message} />
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <p className="mb-3 text-sm font-medium text-slate-800">Destinations</p>
        <div className="space-y-3">
          {fields.map((field, destIndex) => {
            const destErrors = categoryErrors?.destinations?.[destIndex];
            return (
              <div key={field.id} className="rounded-md border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Destination {destIndex + 1}</p>
                  <button
                    type="button"
                    onClick={() => remove(destIndex)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Label</label>
                    <input className={inputClass} {...register(`value.${categoryIndex}.destinations.${destIndex}.label`)} />
                    <FieldError message={destErrors?.label?.message} />
                  </div>
                  <div>
                    <label className={labelClass}>Link</label>
                    <input className={inputClass} {...register(`value.${categoryIndex}.destinations.${destIndex}.href`)} />
                    <FieldError message={destErrors?.href?.message} />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Blurb</label>
                  <textarea rows={2} className={inputClass} {...register(`value.${categoryIndex}.destinations.${destIndex}.blurb`)} />
                  <FieldError message={destErrors?.blurb?.message} />
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => append(emptyDestination)}
          className="mt-3 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          + Add destination
        </button>
      </div>
    </SectionCard>
  );
}
