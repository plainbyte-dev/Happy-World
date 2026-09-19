'use client';

import { Controller, useFieldArray } from 'react-hook-form';
import { LoadError } from '../../../../components/admin/content/LoadError';
import { SaveBar } from '../../../../components/admin/content/SaveBar';
import { FieldError } from '../../../../components/admin/form/FieldError';
import { ImageUploader } from '../../../../components/admin/form/ImageUploader';
import { SectionCard } from '../../../../components/admin/form/SectionCard';
import { inputClass, labelClass } from '../../../../lib/formStyles';
import { useSiteContentSection } from '../../../../lib/useSiteContentSection';
import { experiencesSchema, type ExperiencesInput } from '../../../../schemas/siteContent.schema';

const emptyExperience = { title: '', kind: '', detail: '', image: '', meta: '', href: '' };

export default function ExperiencesPage() {
  const { form, loading, error, saving, submit } = useSiteContentSection<ExperiencesInput>('experiences', experiencesSchema);
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
        <h1 className="text-xl font-semibold text-slate-900">Experiences</h1>
        <p className="mt-1 text-sm text-slate-500">The three experience cards on the homepage.</p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const fieldErrors = formState.errors.value?.[index];
          return (
            <SectionCard key={field.id} title={`Experience ${index + 1}`}>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} {...register(`value.${index}.title`)} />
                  <FieldError message={fieldErrors?.title?.message} />
                </div>
                <div>
                  <label className={labelClass}>Kind</label>
                  <input className={inputClass} {...register(`value.${index}.kind`)} />
                  <FieldError message={fieldErrors?.kind?.message} />
                </div>
                <div>
                  <label className={labelClass}>Meta</label>
                  <input className={inputClass} {...register(`value.${index}.meta`)} />
                  <FieldError message={fieldErrors?.meta?.message} />
                </div>
                <div>
                  <label className={labelClass}>Link</label>
                  <input className={inputClass} {...register(`value.${index}.href`)} />
                  <FieldError message={fieldErrors?.href?.message} />
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Detail</label>
                <textarea rows={2} className={inputClass} {...register(`value.${index}.detail`)} />
                <FieldError message={fieldErrors?.detail?.message} />
              </div>

              <div className="mt-4">
                <label className={labelClass}>Image</label>
                <Controller
                  control={control}
                  name={`value.${index}.image`}
                  render={({ field: imageField }) => (
                    <ImageUploader
                      value={imageField.value ? [imageField.value] : []}
                      onChange={(urls) => imageField.onChange(urls[0] ?? '')}
                      max={1}
                    />
                  )}
                />
                <FieldError message={fieldErrors?.image?.message} />
              </div>
            </SectionCard>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append(emptyExperience)}
        className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        + Add experience
      </button>

      <SaveBar saving={saving} onSave={() => void submit()} />
    </div>
  );
}
