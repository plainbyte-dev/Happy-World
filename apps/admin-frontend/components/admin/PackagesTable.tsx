'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, ApiRequestError, isOptimizableImageUrl, resolveImageUrl } from '../../lib/api';
import type { PackageListItem } from '../../lib/types';
import { useToast } from './Toast';

export function PackagesTable() {
  const { showToast } = useToast();
  const [packages, setPackages] = useState<PackageListItem[] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.get<PackageListItem[]>('/api/admin/packages');
      setPackages(data);
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : 'Failed to load packages', 'error');
      setPackages([]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/admin/packages/${id}`);
      setPackages((prev) => prev?.filter((pkg) => pkg._id !== id) ?? null);
      showToast('Package deleted', 'success');
    } catch (err) {
      showToast(err instanceof ApiRequestError ? err.message : 'Failed to delete package', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  if (packages === null) {
    return <p className="text-sm text-slate-500">Loading packages…</p>;
  }

  if (packages.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-500">
        No packages yet.{' '}
        <Link href="/admin/packages/new" className="font-medium text-slate-900 underline">
          Create your first package
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Destinations</th>
            <th className="px-4 py-3 font-medium">Duration</th>
            <th className="px-4 py-3 font-medium">Cost</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {packages.map((pkg) => (
            <tr key={pkg._id}>
              <td className="px-4 py-3">
                {pkg.coverImage ? (
                  <div className="relative h-12 w-16 overflow-hidden rounded-md">
                    {isOptimizableImageUrl(pkg.coverImage) ? (
                      <Image src={resolveImageUrl(pkg.coverImage)} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element -- legacy non-Cloudinary URL, not covered by images.remotePatterns
                      <img src={resolveImageUrl(pkg.coverImage)} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                ) : (
                  <div className="h-12 w-16 rounded-md bg-slate-100" />
                )}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">{pkg.title}</td>
              <td className="px-4 py-3 text-slate-600">{pkg.destinations.join(', ')}</td>
              <td className="px-4 py-3 text-slate-600">{pkg.duration} days</td>
              <td className="px-4 py-3 text-slate-600">
                {pkg.cost.currency} {pkg.cost.from.toLocaleString()} – {pkg.cost.to.toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    pkg.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {pkg.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <Link href={`/admin/packages/${pkg._id}/edit`} className="text-sm font-medium text-slate-700 hover:text-slate-900">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => void handleDelete(pkg._id, pkg.title)}
                    disabled={deletingId === pkg._id}
                    className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    {deletingId === pkg._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
