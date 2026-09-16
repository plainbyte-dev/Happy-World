'use client';

import { useEffect, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { PackageInput } from '../schemas/package.schema';

export function useLocalDraft(key: string, methods: UseFormReturn<PackageInput>) {
  const [hasDraft, setHasDraft] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(key);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading localStorage is an external-system sync, only possible after mount
    if (stored) setHasDraft(true);
  }, [key]);

  useEffect(() => {
    const subscription = methods.watch((value) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [key, methods]);

  function restore() {
    const stored = window.localStorage.getItem(key);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PackageInput;
        methods.reset(parsed);
      } catch {
        // corrupt draft, ignore
      }
    }
    setHasDraft(false);
  }

  function discard() {
    window.localStorage.removeItem(key);
    setHasDraft(false);
  }

  function clear() {
    window.localStorage.removeItem(key);
  }

  return { hasDraft, restore, discard, clear };
}
