'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '../../../../components/admin/Toast';
import { LoadError } from '../../../../components/admin/content/LoadError';
import { SaveBar } from '../../../../components/admin/content/SaveBar';
import { FieldError } from '../../../../components/admin/form/FieldError';
import { SectionCard } from '../../../../components/admin/form/SectionCard';
import { api, ApiRequestError } from '../../../../lib/api';
import { inputClass, labelClass } from '../../../../lib/formStyles';
import { brandSchema, footerSchema, navSchema, type SiteContentRecord } from '../../../../schemas/siteContent.schema';

const siteSettingsFormSchema = z.object({
  brand: brandSchema,
  nav: navSchema,
  footer: footerSchema,
});

type SiteSettingsForm = z.infer<typeof siteSettingsFormSchema>;

const emptyNavItem = { label: '', href: '' };

export default function SiteSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { control, register, handleSubmit, reset, formState } = useForm<SiteSettingsForm>({
    resolver: zodResolver(siteSettingsFormSchema),
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'nav' });

  useEffect(() => {
    let cancelled = false;
    api
      .get<SiteContentRecord>('/api/admin/site-content')
      .then((doc) => {
        if (cancelled) return;
        reset({ brand: doc.brand, nav: doc.nav, footer: doc.footer });
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof ApiRequestError ? err.message : 'Failed to load content';
        setError(message);
        showToast(message, 'error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSave() {
    setSaving(true);
    try {
      await handleSubmit(
        async (values) => {
          await Promise.all([
            api.patch('/api/admin/site-content/brand', values.brand),
            api.patch('/api/admin/site-content/nav', values.nav),
            api.patch('/api/admin/site-content/footer', values.footer),
          ]);
          showToast('Saved', 'success');
        },
        () => showToast('Please fix the highlighted fields', 'error'),
      )();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (error) {
    return <LoadError message={error} />;
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Site settings</h1>
        <p className="mt-1 text-sm text-slate-500">Brand, main navigation and footer — shown on every page.</p>
      </div>

      <SectionCard title="Brand">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Name</label>
            <input className={inputClass} {...register('brand.name')} />
            <FieldError message={formState.errors.brand?.name?.message} />
          </div>
          <div>
            <label className={labelClass}>Mark (short logo text)</label>
            <input className={inputClass} {...register('brand.mark')} />
            <FieldError message={formState.errors.brand?.mark?.message} />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} {...register('brand.location')} />
            <FieldError message={formState.errors.brand?.location?.message} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Navigation" description="The main nav links shown in the header.">
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-3 rounded-md border border-slate-200 p-4">
              <div className="flex-1">
                <label className={labelClass}>Label</label>
                <input className={inputClass} {...register(`nav.${index}.label`)} />
                <FieldError message={formState.errors.nav?.[index]?.label?.message} />
              </div>
              <div className="flex-1">
                <label className={labelClass}>Link</label>
                <input className={inputClass} {...register(`nav.${index}.href`)} />
                <FieldError message={formState.errors.nav?.[index]?.href?.message} />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                className="mt-6 text-xs font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => append(emptyNavItem)}
          className="mt-3 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          + Add nav item
        </button>
      </SectionCard>

      <SectionCard title="Footer">
        <div>
          <label className={labelClass}>Statement</label>
          <textarea rows={2} className={inputClass} {...register('footer.statement')} />
          <FieldError message={formState.errors.footer?.statement?.message} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} {...register('footer.email')} />
            <FieldError message={formState.errors.footer?.email?.message} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input className={inputClass} {...register('footer.phone')} />
            <FieldError message={formState.errors.footer?.phone?.message} />
          </div>
          <div>
            <label className={labelClass}>WhatsApp number</label>
            <input className={inputClass} {...register('footer.whatsapp')} />
            <FieldError message={formState.errors.footer?.whatsapp?.message} />
          </div>
        </div>
      </SectionCard>

      <SaveBar saving={saving} onSave={() => void onSave()} />
    </div>
  );
}
