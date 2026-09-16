'use client';

import { use, useEffect, useState } from 'react';
import { PackageForm } from '../../../../../components/admin/PackageForm';
import { api, ApiRequestError } from '../../../../../lib/api';
import type { PackageRecord } from '../../../../../lib/types';
import type { PackageInput } from '../../../../../schemas/package.schema';

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [record, setRecord] = useState<PackageRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .get<PackageRecord>(`/api/admin/packages/${id}`)
      .then((data) => {
        if (!cancelled) setRecord(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiRequestError ? err.message : 'Failed to load package');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(data: PackageInput) {
    await api.patch(`/api/admin/packages/${id}`, data);
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!record) {
    return <p className="text-sm text-slate-500">Loading package…</p>;
  }

  const { _id, createdAt, updatedAt, ...defaultValues } = record;
  void _id;
  void createdAt;
  void updatedAt;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Edit package</h1>
      <PackageForm draftKey={`package-draft:edit:${id}`} defaultValues={defaultValues} onSubmit={handleSubmit} />
    </div>
  );
}
