import Link from 'next/link';
import { PackagesTable } from '../../../components/admin/PackagesTable';

export default function PackagesListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Tour packages</h1>
        <Link
          href="/admin/packages/new"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + New package
        </Link>
      </div>
      <PackagesTable />
    </div>
  );
}
