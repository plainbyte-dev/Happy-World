'use client';

import { useEffect, useState } from 'react';
import { api } from './api';
import type { SiteContentRecord } from '../schemas/siteContent.schema';
import { CATEGORY_VALUES } from '../schemas/package.schema';

type CategoryLabels = Record<(typeof CATEGORY_VALUES)[number], string>;

// Falls back to the raw category key (e.g. "nepal-tours") rather than a guessed
// label, so a loading/failed state never shows a label the admin never actually set.
const FALLBACK_LABELS = Object.fromEntries(CATEGORY_VALUES.map((value) => [value, value])) as CategoryLabels;

/** The Trips menu's admin-editable category labels — the same ones shown on the public site. */
export function useTripsMenuLabels(): CategoryLabels {
  const [labels, setLabels] = useState<CategoryLabels>(FALLBACK_LABELS);

  useEffect(() => {
    let cancelled = false;
    api
      .get<SiteContentRecord>('/api/admin/site-content')
      .then((doc) => {
        if (cancelled) return;
        const next = { ...FALLBACK_LABELS };
        doc.tripsMenu.forEach((category) => {
          next[category.key as (typeof CATEGORY_VALUES)[number]] = category.label;
        });
        setLabels(next);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return labels;
}
