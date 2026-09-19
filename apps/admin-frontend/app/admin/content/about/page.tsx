'use client';

import { Controller, useFieldArray } from 'react-hook-form';
import { LoadError } from '../../../../components/admin/content/LoadError';
import { SaveBar } from '../../../../components/admin/content/SaveBar';
import { FieldError } from '../../../../components/admin/form/FieldError';
import { ImageUploader } from '../../../../components/admin/form/ImageUploader';
import { SectionCard } from '../../../../components/admin/form/SectionCard';
import { TagInput } from '../../../../components/admin/form/TagInput';
import { inputClass, labelClass } from '../../../../lib/formStyles';
import { useSiteContentSection } from '../../../../lib/useSiteContentSection';
import { aboutSchema, type AboutInput } from '../../../../schemas/siteContent.schema';

const emptyValue = { title: '', body: '' };

export default function AboutPageContent() {
  const { form, loading, error, saving, submit } = useSiteContentSection<AboutInput>('about', aboutSchema);
  const { control, register, formState } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'value.values' });
  const errors = formState.errors.value;

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (error) {
    return <LoadError message={error} />;
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">About page</h1>
        <p className="mt-1 text-sm text-slate-500">Every section on /about.</p>
      </div>

      <SectionCard title="Hero">
        <div>
          <label className={labelClass}>Title</label>
          <textarea rows={2} className={inputClass} {...register('value.hero.title')} />
          <FieldError message={errors?.hero?.title?.message} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Body</label>
          <textarea rows={3} className={inputClass} {...register('value.hero.body')} />
          <FieldError message={errors?.hero?.body?.message} />
        </div>
      </SectionCard>

      <SectionCard title="Story">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Kicker</label>
            <input className={inputClass} {...register('value.story.kicker')} />
            <FieldError message={errors?.story?.kicker?.message} />
          </div>
          <div>
            <label className={labelClass}>Title</label>
            <input className={inputClass} {...register('value.story.title')} />
            <FieldError message={errors?.story?.title?.message} />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Paragraphs</label>
          <Controller
            control={control}
            name="value.story.paragraphs"
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Type a paragraph and press Enter" />
            )}
          />
          <FieldError message={errors?.story?.paragraphs?.message} />
        </div>

        <div className="mt-4">
          <label className={labelClass}>Image</label>
          <Controller
            control={control}
            name="value.story.image"
            render={({ field: imageField }) => (
              <ImageUploader
                value={imageField.value ? [imageField.value] : []}
                onChange={(urls) => imageField.onChange(urls[0] ?? '')}
                max={1}
              />
            )}
          />
          <FieldError message={errors?.story?.image?.message} />
        </div>
      </SectionCard>

      <SectionCard title="Values" description="The four value cards on the About page.">
        <div className="space-y-3">
          {fields.map((field, index) => {
            const valueErrors = errors?.values?.[index];
            return (
              <div key={field.id} className="rounded-md border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Value {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Title</label>
                  <input className={inputClass} {...register(`value.values.${index}.title`)} />
                  <FieldError message={valueErrors?.title?.message} />
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Body</label>
                  <textarea rows={2} className={inputClass} {...register(`value.values.${index}.body`)} />
                  <FieldError message={valueErrors?.body?.message} />
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => append(emptyValue)}
          className="mt-3 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          + Add value
        </button>
      </SectionCard>

      <SectionCard title="Closing">
        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} {...register('value.closing.title')} />
          <FieldError message={errors?.closing?.title?.message} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Body</label>
          <textarea rows={2} className={inputClass} {...register('value.closing.body')} />
          <FieldError message={errors?.closing?.body?.message} />
        </div>
      </SectionCard>

      <SaveBar saving={saving} onSave={() => void submit()} />
    </div>
  );
}
