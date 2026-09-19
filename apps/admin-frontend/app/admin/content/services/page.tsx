'use client';

import { useFieldArray } from 'react-hook-form';
import { LoadError } from '../../../../components/admin/content/LoadError';
import { SaveBar } from '../../../../components/admin/content/SaveBar';
import { FieldError } from '../../../../components/admin/form/FieldError';
import { SectionCard } from '../../../../components/admin/form/SectionCard';
import { inputClass, labelClass } from '../../../../lib/formStyles';
import { useSiteContentSection } from '../../../../lib/useSiteContentSection';
import { servicesSchema, type ServicesInput } from '../../../../schemas/siteContent.schema';

const emptyService = { number: '', title: '', body: '' };

export default function ServicesPage() {
  const { form, loading, error, saving, submit } = useSiteContentSection<ServicesInput>('services', servicesSchema);
  const { control, register, formState } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'value' });

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (error) {
    return <LoadError message={error} />;
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Services</h1>
        <p className="mt-1 text-sm text-slate-500">The &ldquo;How we travel&rdquo; numbered list on the homepage.</p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const fieldErrors = formState.errors.value?.[index];
          return (
            <SectionCard key={field.id} title={`Service ${index + 1}`}>
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  disabled={fields.length <= 1}
                  className="text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-[100px_1fr]">
                <div>
                  <label className={labelClass}>Number</label>
                  <input className={inputClass} {...register(`value.${index}.number`)} />
                  <FieldError message={fieldErrors?.number?.message} />
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} {...register(`value.${index}.title`)} />
                  <FieldError message={fieldErrors?.title?.message} />
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Body</label>
                <textarea rows={2} className={inputClass} {...register(`value.${index}.body`)} />
                <FieldError message={fieldErrors?.body?.message} />
              </div>
            </SectionCard>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append(emptyService)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        + Add service
      </button>

      <SaveBar saving={saving} onSave={() => void submit()} />
    </div>
  );
}
