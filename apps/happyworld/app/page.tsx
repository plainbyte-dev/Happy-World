"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/sections/site-header';
import MobileMenu from '@/components/sections/mobile-menu';
import HeroSection from '@/components/sections/hero-section';
import IntroductionSection from '@/components/sections/introduction-section';
import ExploreDestinationsSection from '@/components/sections/explore-destinations-section';
import JourneysSection from '@/components/sections/journeys-section';
import PackageGridSection from '@/components/sections/package-grid-section';
import HowWeTravelSection from '@/components/sections/how-we-travel-section';
import SiteFooter from '@/components/sections/site-footer';
import { useSiteContent } from '@/lib/site-content-context';

function Home() {
  const content = useSiteContent();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % content.heroSlides.length), 2000);
    return () => window.clearInterval(timer);
  }, [paused, content.heroSlides.length]);

  const goToEnquiry = () => {
    setMenuOpen(false);
    router.push('/contact');
  };

  return (
    <main className="site-noise overflow-hidden bg-[#ffffff] text-[#1a2650]">
      <SiteHeader
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        onEnquire={goToEnquiry}
      />
      <MobileMenu
        open={menuOpen}
        onNavigate={() => setMenuOpen(false)}
        onEnquire={goToEnquiry}
      />
      <HeroSection
        slide={slide}
        onSelectSlide={setSlide}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      />
      <IntroductionSection />
      <ExploreDestinationsSection />
      <JourneysSection />
      <PackageGridSection />
      <HowWeTravelSection />
      <SiteFooter />
    </main>
  );
}

export default Home;
