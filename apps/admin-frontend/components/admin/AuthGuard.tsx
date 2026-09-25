'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { getToken } from '../../lib/auth';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- gates rendering on a synchronous localStorage check at mount
    setAuthorized(true);
  }, [router]);

  if (!authorized) return null;

  return <>{children}</>;
}
