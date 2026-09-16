'use client';

import { PackageForm } from '../../../../components/admin/PackageForm';
import { api } from '../../../../lib/api';
import { defaultPackageValues } from '../../../../lib/defaultPackageValues';
import type { PackageInput } from '../../../../schemas/package.schema';

export default function NewPackagePage() {
  async function handleSubmit(data: PackageInput) {
    await api.post('/api/admin/packages', data);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">New package</h1>
      <PackageForm draftKey="package-draft:new" defaultValues={defaultPackageValues()} onSubmit={handleSubmit} />
    </div>
  );
}
