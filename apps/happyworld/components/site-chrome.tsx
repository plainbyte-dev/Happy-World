'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/sections/site-header';
import MobileMenu from '@/components/sections/mobile-menu';
import SiteFooter from '@/components/sections/site-footer';

type SiteChromeProps = {
  children: ReactNode;
  solidNav?: boolean;
};

function SiteChrome({ children, solidNav }: SiteChromeProps) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const goToEnquiry = () => {
    setMenuOpen(false);
    router.push('/#enquiry');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <SiteHeader scrolled={scrolled} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} onEnquire={goToEnquiry} solid={solidNav} />
      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} onEnquire={goToEnquiry} />
      {children}
      <SiteFooter />
    </>
  );
}

export default SiteChrome;
