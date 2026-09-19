'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { z, type ZodType } from 'zod';
import { useToast } from '../components/admin/Toast';
import { api, ApiRequestError } from './api';
import type { SiteContentRecord } from '../schemas/siteContent.schema';

type SiteContentSection = Exclude<keyof SiteContentRecord, '_id' | 'createdAt' | 'updatedAt'>;

/**
 * Loads one section of the singleton site-content document into a react-hook-form
 * instance, and saves it back with a single PATCH to that section's endpoint.
 * Shared by every "Site content" admin page — see PackageForm for the equivalent
 * pattern for the (much larger) Packages form.
 *
 * The section's value is wrapped as `{ value: T }` so array-shaped sections (hero
 * slides, experiences, ...) and object-shaped sections (introduction, footer, ...)
 * can both use the same form shape — useFieldArray needs a path inside an object,
 * which a bare array-typed form value doesn't offer.
 */
export function useSiteContentSection<T>(section: SiteContentSection, schema: ZodType<T>) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const form = useForm<{ value: T }>({
    resolver: zodResolver(z.object({ value: schema })) as Resolver<{ value: T }>,
  });

  useEffect(() => {
    let cancelled = false;
    api
      .get<SiteContentRecord>('/api/admin/site-content')
      .then((doc) => {
        if (cancelled) return;
        form.reset({ value: doc[section] as unknown as T });
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
  }, [section]);

  async function submit() {
    setSaving(true);
    try {
      await form.handleSubmit(
        async ({ value }) => {
          await api.patch(`/api/admin/site-content/${section}`, value);
          showToast('Saved', 'success');
        },
        () => {
          showToast('Please fix the highlighted fields', 'error');
        },
      )();
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : 'Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  }

  return { form, loading, error, saving, submit };
}
