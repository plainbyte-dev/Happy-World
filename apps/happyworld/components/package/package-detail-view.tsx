'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/sections/site-header';
import MobileMenu from '@/components/sections/mobile-menu';
import SiteFooter from '@/components/sections/site-footer';
import PackageHero from '@/app/packages/components/PackageHero';
import GallerySection from '@/app/packages/components/GallerySection';
import ItinerarySplitPanel from '@/app/packages/components/ItinerarySplitPanel';
import AltitudeSection from '@/app/packages/components/AltitudeSection';
import WhenToVisit from '@/app/packages/components/WhenToVisit';
import FaqSection from '@/app/packages/components/FaqSection';
import BookingSidebar from '@/app/packages/components/BookingSidebar';
import type { PackageDetail } from '@/lib/packages';

type PackageDetailViewProps = {
  detail: PackageDetail;
  related: PackageDetail[];
};

function PackageDetailView({ detail, related }: PackageDetailViewProps) {
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
    <main className="site-noise overflow-hidden bg-white text-foreground">
      <SiteHeader scrolled={scrolled} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} onEnquire={goToEnquiry} />
      <MobileMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} onEnquire={goToEnquiry} />

      <PackageHero detail={detail} />

      <div className="pkg-layout">
        <div className="pkg-main flex flex-col gap-16 sm:gap-20">
          <GallerySection images={detail.gallery} />
          <WhenToVisit bestTime={detail.bestTime} />
        </div>

        <aside className="pkg-sidebar">
          <BookingSidebar detail={detail} onEnquire={goToEnquiry} />
        </aside>
      </div>

      <div className="max-w-360 mx-auto px-5 pb-20">
        <ItinerarySplitPanel
          itinerary={detail.itinerary}
          destinationLabel={detail.destinationLabel}
          heroImage={detail.heroImage}
          packageName={detail.name}
          duration={detail.quickFacts.duration}
        />
      </div>

      <div className="max-w-360 mx-auto px-5 pb-20">
        <AltitudeSection altitudeProfile={detail.altitudeProfile} itinerary={detail.itinerary} />
      </div>

      <div className="max-w-360 mx-auto px-5 pb-20">
        <FaqSection faqs={detail.faqs} />
      </div>

      {related.length > 0 ? (
        <section className="pkg-related">
          <div className="pkg-related-inner">
            <p className="eyebrow text-[#c9a227]">KEEP EXPLORING</p>
            <h2 className="pkg-related-title">Related packages</h2>
            <div className="pkg-related-grid">
              {related.map((item) => (
                <Link key={item.slug} href={`/packages/${item.slug}`} className="pkg-related-card" data-testid={`link-related-${item.slug}`}>
                  <p className="pkg-related-name">{item.name}</p>
                  <p className="pkg-related-desc">{item.description}</p>
                  <p className="pkg-related-meta">{item.destinationLabel} · {item.quickFacts.duration}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="pkg-cta" style={{ backgroundImage: `url(${detail.heroImage})` }}>
        <div className="pkg-cta-overlay" />
        <div className="pkg-cta-inner">
          <h2 className="pkg-cta-title">Ready for {detail.name}?</h2>
          <p className="pkg-cta-body">Tell us your dates and we'll take it from there — from permits to the last cup of tea.</p>
          <button type="button" className="button-coral" onClick={goToEnquiry} data-testid="button-cta-enquire">
            Enquire <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export default PackageDetailView;
