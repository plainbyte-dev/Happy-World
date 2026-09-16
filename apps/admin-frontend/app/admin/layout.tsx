import type { ReactNode } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { ToastProvider } from '../../components/admin/Toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </ToastProvider>
  );
}
