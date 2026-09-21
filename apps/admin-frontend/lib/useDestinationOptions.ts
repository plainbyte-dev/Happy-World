'use client';

import { useEffect, useState } from 'react';
import { api } from './api';
import type { DestinationRecord } from './types';

/** The list of destination names packages can be tagged with — sourced from the database. */
export function useDestinationOptions(): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    api
      .get<DestinationRecord[]>('/api/admin/destinations')
      .then((destinations) => {
        if (cancelled) return;
        setOptions(destinations.map((d) => d.name));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return options;
}
