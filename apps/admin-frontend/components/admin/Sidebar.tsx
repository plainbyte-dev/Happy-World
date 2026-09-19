'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
}

const packageIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const plusIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
  </svg>
);

const contentIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16M4 12h16M4 19h10" />
  </svg>
);

const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: 'Packages',
    items: [
      { href: '/admin/packages', label: 'Packages', exact: true, icon: packageIcon },
      { href: '/admin/packages/new', label: 'New package', icon: plusIcon },
    ],
  },
  {
    label: 'Site content',
    items: [
      { href: '/admin/content/hero', label: 'Hero slides', icon: contentIcon },
      { href: '/admin/content/introduction', label: 'Introduction', icon: contentIcon },
      { href: '/admin/content/trips', label: 'Trips & destinations', icon: contentIcon },
      { href: '/admin/content/experiences', label: 'Experiences', icon: contentIcon },
      { href: '/admin/content/services', label: 'Services', icon: contentIcon },
      { href: '/admin/content/journal', label: 'Journal', icon: contentIcon },
      { href: '/admin/content/about', label: 'About page', icon: contentIcon },
      { href: '/admin/content/settings', label: 'Site settings', icon: contentIcon },
    ],
  },
];

function isActive(pathname: string, item: NavItem): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-5">
        <Link href="/admin/packages" className="text-sm font-semibold tracking-wide text-slate-900">
          Tour Package Admin
        </Link>
      </div>
      <nav className="flex-1 space-y-6 px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.label}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                      active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
