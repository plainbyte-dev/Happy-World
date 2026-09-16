'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import BrandMark from '@/components/brand-mark';
import { content } from '@/data/content';
import { slugify } from '@/lib/packages';

type SiteHeaderProps = {
  scrolled: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEnquire: () => void;
  solid?: boolean;
};

type ApiPackageSummary = {
  title: string;
  destinations: string[];
  status: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://tours-travels-admin.onrender.com';

function SiteHeader({ scrolled, menuOpen, onToggleMenu, onEnquire, solid }: SiteHeaderProps) {
  const pathname = usePathname();
  const isNavItemActive = (href: string) => {
    const trimmedHref = href.trim();
    if (trimmedHref === '/') return pathname === '/';
    if (trimmedHref === '#way') return pathname.startsWith('/packages');
    if (trimmedHref === '/contact') return pathname === '/contact';
    if (trimmedHref === '/about') return pathname === '/about';
    return false;
  };
  const [tripsOpen, setTripsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(content.tripsMenu[0].key);
  const [apiPackages, setApiPackages] = useState<ApiPackageSummary[] | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  useEffect(() => {
    return cancelClose;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/packages`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { success: boolean; data: ApiPackageSummary[] } | null) => {
        if (cancelled || !json?.success || !Array.isArray(json.data)) return;
        setApiPackages(json.data.filter((pkg) => pkg.status === 'published'));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const closeTrips = () => {
    setTripsOpen(false);
    setActiveCategory(content.tripsMenu[0].key);
  };

  const scheduleCloseTrips = () => {
    cancelClose();
    closeTimer.current = setTimeout(closeTrips, 200);
  };

  const packagesForCategory = (category: (typeof content.tripsMenu)[number]) => {
    if (category.key !== 'nepal-tours') {
      return category.destinations.flatMap((destination) => destination.packages);
    }
    if (!apiPackages) return [];
    const destinationLabels = category.destinations.map((destination) => destination.label.toLowerCase());
    return apiPackages
      .filter((pkg) => pkg.destinations.some((d) => destinationLabels.includes(d.toLowerCase())))
      .map((pkg) => ({ name: pkg.title.trim() }));
  };

  const packagesLabelForCategory = (categoryKey: string) => {
    if (categoryKey === 'trekking') return 'Treks';
    if (categoryKey === 'kailash') return 'Pilgrimage routes';
    return 'Packages';
  };

  const lightNav = scrolled || tripsOpen || solid;

  return (
    <header className={`site-nav fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${lightNav ? 'site-nav-scrolled' : ''}`}>
      <div className="mx-auto flex h-[108px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3" data-testid="link-brand">
          <BrandMark />
        </a>
        <nav className="hidden items-center gap-9 lg:flex" aria-label="Main navigation">
          {content.nav.map((item) =>
            item.label.trim() === 'Trips' ? (
              <div
                key={item.href}
                className="trips-menu-wrap"
                onMouseEnter={() => {
                  cancelClose();
                  setTripsOpen(true);
                }}
                onMouseLeave={scheduleCloseTrips}
              >
                <a
                  href={item.href}
                  className={`nav-link trips-trigger ${isNavItemActive(item.href) ? 'nav-link-active' : ''}`}
                  aria-expanded={tripsOpen}
                  aria-current={isNavItemActive(item.href) ? 'page' : undefined}
                  data-testid="link-nav-trips"
                >
                  {item.label}
                </a>
                <div className={`trips-mega ${tripsOpen ? 'trips-mega-open' : ''}`} data-testid="menu-trips">
                  {(() => {
                    const activeCategoryData =
                      content.tripsMenu.find((category) => category.key === activeCategory) ?? content.tripsMenu[0];
                    const packages = packagesForCategory(activeCategoryData);
                    const packagesLoading = activeCategoryData.key === 'nepal-tours' && apiPackages === null;

                    return (
                      <div className="trips-mega-inner">
                        <div className="trips-mega-col trips-mega-col-categories">
                          <p className="trips-col-eyebrow">Tour types</p>
                          <ul className="trips-categories" aria-label="Trip categories">
                            {content.tripsMenu.map((category) => (
                              <li key={category.key}>
                                <a
                                  href={category.href}
                                  className={`trips-category-link ${activeCategory === category.key ? 'trips-category-link-active' : ''}`}
                                  onMouseEnter={() => setActiveCategory(category.key)}
                                  onClick={(e) => {
                                    if (activeCategory !== category.key) {
                                      e.preventDefault();
                                      setActiveCategory(category.key);
                                    }
                                  }}
                                  data-testid={`link-trips-category-${category.key}`}
                                >
                                  <span>{category.label}</span>
                                  <span className="trips-category-desc">{category.description}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="trips-mega-col trips-mega-col-packages" data-testid="menu-trips-packages">
                          <p className="trips-col-eyebrow">
                            {activeCategoryData.label} {packagesLabelForCategory(activeCategoryData.key).toLowerCase()}
                          </p>
                          <div className="trips-destinations-grid trips-packages-list">
                            {packagesLoading ? (
                              <div className="flex flex-col gap-3 px-3 py-1" data-testid="trips-packages-loading">
                                {[0, 1, 2].map((i) => (
                                  <span
                                    key={i}
                                    className="trips-packages-skeleton"
                                    style={{ width: `${78 - i * 14}%`, animationDelay: `${i * 120}ms` }}
                                  />
                                ))}
                              </div>
                            ) : packages.length > 0 ? (
                              packages.map((pkg) => (
                                <div key={pkg.name} className="trips-destination-item">
                                  <a
                                    href={`/packages/${slugify(pkg.name)}`}
                                    className="trips-destination-link trips-package-link"
                                    data-testid={`link-package-${slugify(pkg.name)}`}
                                  >
                                    {pkg.name}
                                  </a>
                                </div>
                              ))
                            ) : (
                              <p className="trips-packages-empty">
                                No {packagesLabelForCategory(activeCategoryData.key).toLowerCase()} listed yet.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className={`nav-link ${isNavItemActive(item.href) ? 'nav-link-active' : ''}`}
                aria-current={isNavItemActive(item.href) ? 'page' : undefined}
                data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>
        <a
          href={`https://wa.me/${content.footer.whatsapp}?text=${encodeURIComponent("Hi! I'd like to know more about your Nepal trips.")}`}
          target="_blank"
          rel="noreferrer"
          className="nav-enquire hidden lg:inline-flex"
          data-testid="button-nav-enquire"
        >
          <FaWhatsapp size={17} />
          Start a conversation <ArrowRight size={15} strokeWidth={1.8} className="nav-enquire-arrow" />
        </a>
        <button type="button" className="mobile-menu-button lg:hidden" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={onToggleMenu} data-testid="button-mobile-menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}

export default SiteHeader;
