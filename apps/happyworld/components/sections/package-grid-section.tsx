'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { getLivePackages, type PackageDetail } from '@/lib/packages';

const PAGE_SIZE = 3;

function PackageGridSection() {
  const [packages, setPackages] = useState<PackageDetail[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [rawPage, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getLivePackages().then((live) => {
      if (cancelled) return;
      setPackages(live);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(packages.length / PAGE_SIZE));
  const page = Math.min(rawPage, totalPages - 1);

  const visiblePackages = useMemo(
    () => packages.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [packages, page],
  );

  if (loaded && packages.length === 0) return null;

  return (
    <section id="latest-trips" className="package-grid-section px-5 pb-28 sm:px-8 lg:px-12" data-testid="section-package-grid">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-[#c9a227]">FRESH OFF THE PRESS</p>
            <h2 className="mt-3 font-display text-5xl leading-[.93] text-[#ffffff] sm:text-6xl" data-testid="text-package-grid-heading">Our trips.</h2>
          </div>
          <p className="max-w-[285px] text-sm leading-relaxed text-[#b7bfd8]">Newly published itineraries, straight from the team planning them.</p>
        </div>

        <div className="package-grid">
          {!loaded
            ? [0, 1, 2].map((i) => <div key={i} className="package-card-skeleton" data-testid={`skeleton-package-${i}`} />)
            : visiblePackages.map((pkg) => (
                <Link key={pkg.slug} href={`/packages/${pkg.slug}`} className="package-card" data-testid={`link-package-grid-${pkg.slug}`}>
                  <div className="package-card-image">
                    <img src={pkg.heroImage} alt={pkg.name} loading="lazy" />
                  </div>
                  <div className="package-card-body">
                    <p className="package-card-destination">{pkg.destinationLabel}</p>
                    <h3 className="package-card-name">{pkg.name}</h3>
                    <p className="package-card-meta">
                      {pkg.quickFacts.duration} · From {pkg.priceCurrency} {pkg.priceFrom.toLocaleString()}
                    </p>
                    <span className="package-card-link">
                      View itinerary <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              ))}
        </div>

        {loaded && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-6" role="group" aria-label="Trips pagination">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(0, current - 1))}
              disabled={page === 0}
              className="package-grid-nav-button"
              aria-label="Previous trips"
              data-testid="button-package-grid-prev"
            >
              <ArrowLeft size={15} />
            </button>
            <span className="font-mono-display text-[10px] tracking-[.2em] text-[#ffffff]" data-testid="text-package-grid-page">
              0{page + 1} / 0{totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
              disabled={page === totalPages - 1}
              className="package-grid-nav-button"
              aria-label="Next trips"
              data-testid="button-package-grid-next"
            >
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default PackageGridSection;
