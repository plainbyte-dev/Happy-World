'use client';

import { useFieldArray, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import type { PackageInput } from '../../../schemas/package.schema';
import { inputClass, labelClass } from '../../../lib/formStyles';
import { FieldError } from './FieldError';
import { SectionCard } from './SectionCard';

interface FaqsSectionProps {
  control: Control<PackageInput>;
  register: UseFormRegister<PackageInput>;
  errors: FieldErrors<PackageInput>;
}

export function FaqsSection({ control, register, errors }: FaqsSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'faqs' });

  return (
    <SectionCard title="FAQs" description="Optional — package-specific questions and answers.">
      <div className="space-y-4">
        {fields.map((field, index) => {
          const fieldErrors = errors.faqs?.[index];
          return (
            <div key={field.id} className="rounded-md border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-800">FAQ {index + 1}</p>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className={labelClass}>Question</label>
                <input className={inputClass} {...register(`faqs.${index}.question`)} />
                <FieldError message={fieldErrors?.question?.message} />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Answer</label>
                <textarea rows={2} className={inputClass} {...register(`faqs.${index}.answer`)} />
                <FieldError message={fieldErrors?.answer?.message} />
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ question: '', answer: '' })}
        className="mt-4 text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        + Add FAQ
      </button>
    </SectionCard>
  );
}
