'use client';

import { Controller, useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { ImageUploader } from './ImageUploader';
import { SectionCard } from './SectionCard';

interface TestimonialsSectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

export function TestimonialsSection({ control, register, errors }: TestimonialsSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'testimonials' });

  return (
    <SectionCard title="Testimonials" description="Optional — traveller reviews shown on the package detail page.">
      <div className="space-y-4">
        {fields.map((field, index) => {
          const fieldErrors = errors.testimonials?.[index];
          return (
            <div key={field.id} className="rounded-md border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800">Testimonial {index + 1}</p>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Name</label>
                  <input className={inputClass} {...register(`testimonials.${index}.name`)} />
                  <FieldError message={fieldErrors?.name?.message} />
                </div>
                <div>
                  <label className={labelClass}>Rating</label>
                  <select className={inputClass} {...register(`testimonials.${index}.rating`, { valueAsNumber: true })}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value} star{value > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <FieldError message={fieldErrors?.rating?.message} />
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Quote</label>
                <textarea rows={2} className={inputClass} {...register(`testimonials.${index}.quote`)} />
                <FieldError message={fieldErrors?.quote?.message} />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Photo</label>
                <Controller
                  control={control}
                  name={`testimonials.${index}.photo`}
                  render={({ field: photoField }) => (
                    <ImageUploader
                      value={photoField.value ? [photoField.value] : []}
                      onChange={(urls) => photoField.onChange(urls[0] ?? '')}
                      max={1}
                    />
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ name: '', rating: 5, quote: '', photo: '' })}
        className="mt-4 text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        + Add testimonial
      </button>
    </SectionCard>
  );
}
