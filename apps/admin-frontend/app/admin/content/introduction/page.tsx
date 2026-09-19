'use client';

import { LoadError } from '../../../../components/admin/content/LoadError';
import { SaveBar } from '../../../../components/admin/content/SaveBar';
import { FieldError } from '../../../../components/admin/form/FieldError';
import { SectionCard } from '../../../../components/admin/form/SectionCard';
import { inputClass, labelClass } from '../../../../lib/formStyles';
import { useSiteContentSection } from '../../../../lib/useSiteContentSection';
import { introductionSchema, type IntroductionInput } from '../../../../schemas/siteContent.schema';

export default function IntroductionPage() {
  const { form, loading, error, saving, submit } = useSiteContentSection<IntroductionInput>('introduction', introductionSchema);
  const { register, formState } = form;
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
        <h1 className="text-xl font-semibold text-slate-900">Introduction</h1>
        <p className="mt-1 text-sm text-slate-500">The &ldquo;Nepal is not a checklist&rdquo; block on the homepage.</p>
      </div>

      <SectionCard title="Content">
        <div>
          <label className={labelClass}>Kicker</label>
          <input className={inputClass} {...register('value.kicker')} />
          <FieldError message={errors?.kicker?.message} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Title</label>
          <textarea rows={2} className={inputClass} {...register('value.title')} />
          <FieldError message={errors?.title?.message} />
        </div>
        <div className="mt-4">
          <label className={labelClass}>Body</label>
          <textarea rows={4} className={inputClass} {...register('value.body')} />
          <FieldError message={errors?.body?.message} />
        </div>
      </SectionCard>

      <SaveBar saving={saving} onSave={() => void submit()} />
    </div>
  );
}
