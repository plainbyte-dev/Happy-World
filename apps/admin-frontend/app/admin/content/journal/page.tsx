'use client';

import { Controller, useFieldArray } from 'react-hook-form';
import { LoadError } from '../../../../components/admin/content/LoadError';
import { SaveBar } from '../../../../components/admin/content/SaveBar';
import { FieldError } from '../../../../components/admin/form/FieldError';
import { ImageUploader } from '../../../../components/admin/form/ImageUploader';
import { SectionCard } from '../../../../components/admin/form/SectionCard';
import { inputClass, labelClass } from '../../../../lib/formStyles';
import { useSiteContentSection } from '../../../../lib/useSiteContentSection';
import { journalSchema, type JournalInput } from '../../../../schemas/siteContent.schema';

const emptyArticle = { category: '', title: '', date: '' };

export default function JournalPage() {
  const { form, loading, error, saving, submit } = useSiteContentSection<JournalInput>('journal', journalSchema);
  const { control, register, formState } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'value.articles' });
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
        <h1 className="text-xl font-semibold text-slate-900">Journal</h1>
        <p className="mt-1 text-sm text-slate-500">The &ldquo;Notes from the trail&rdquo; teaser section on the homepage.</p>
      </div>

      <SectionCard title="Section content">
        <div>
          <label className={labelClass}>Title</label>
          <input className={inputClass} {...register('value.title')} />
          <FieldError message={errors?.title?.message} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Body</label>
          <textarea rows={2} className={inputClass} {...register('value.body')} />
          <FieldError message={errors?.body?.message} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Image</label>
          <Controller
            control={control}
            name="value.image"
            render={({ field: imageField }) => (
              <ImageUploader
                value={imageField.value ? [imageField.value] : []}
                onChange={(urls) => imageField.onChange(urls[0] ?? '')}
                max={1}
              />
            )}
          />
          <FieldError message={errors?.image?.message} />
        </div>
      </SectionCard>

      <SectionCard title="Articles" description="The three article teasers listed in this section.">
        <div className="space-y-3">
          {fields.map((field, index) => {
            const articleErrors = errors?.articles?.[index];
            return (
              <div key={field.id} className="rounded-md border border-slate-200 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500">Article {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs font-medium text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Category</label>
                    <input className={inputClass} {...register(`value.articles.${index}.category`)} />
                    <FieldError message={articleErrors?.category?.message} />
                  </div>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input className={inputClass} {...register(`value.articles.${index}.title`)} />
                    <FieldError message={articleErrors?.title?.message} />
                  </div>
                  <div>
                    <label className={labelClass}>Date</label>
                    <input className={inputClass} {...register(`value.articles.${index}.date`)} />
                    <FieldError message={articleErrors?.date?.message} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => append(emptyArticle)}
          className="mt-3 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          + Add article
        </button>
      </SectionCard>

      <SaveBar saving={saving} onSave={() => void submit()} />
    </div>
  );
}
