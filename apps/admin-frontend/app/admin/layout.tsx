import type { ReactNode } from 'react';
import { AuthGuard } from '../../components/admin/AuthGuard';
import { Sidebar } from '../../components/admin/Sidebar';
import { ToastProvider } from '../../components/admin/Toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <ToastProvider>
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 lg:flex-row">
          <Sidebar />
          <main className="min-w-0 flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
          </main>
        </div>
      </ToastProvider>
    </AuthGuard>
  );
}
