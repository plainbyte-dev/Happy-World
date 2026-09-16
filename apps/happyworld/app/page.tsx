"use client";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import SiteHeader from '@/components/sections/site-header';
import MobileMenu from '@/components/sections/mobile-menu';
import HeroSection from '@/components/sections/hero-section';
import IntroductionSection from '@/components/sections/introduction-section';
import JourneysSection from '@/components/sections/journeys-section';
import PackageGridSection from '@/components/sections/package-grid-section';
import HowWeTravelSection from '@/components/sections/how-we-travel-section';
import EnquirySection from '@/components/sections/enquiry-section';
import SiteFooter from '@/components/sections/site-footer';
import { content } from '@/data/content';
import { enquirySchema, type EnquiryValues } from '@/lib/enquiry-schema';
import { buildEnquiryWhatsappUrl } from '@/lib/whatsapp';
import { submitContactEnquiry } from '@/lib/contact';

function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: { name: '', email: '', interest: '', message: '', updates: false },
  });

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
  }, [paused]);

  const scrollToEnquiry = (interest?: string) => {
    if (interest) form.setValue('interest', interest);
    setMenuOpen(false);
    document.getElementById('enquiry')?.scrollIntoView({ behavior: 'smooth' });
  };

  const submitEnquiry = async (values: EnquiryValues) => {
    await submitContactEnquiry(values);
    window.open(buildEnquiryWhatsappUrl(content.footer.whatsapp, values), '_blank', 'noopener,noreferrer');
    setSubmitted(true);
    form.reset();
  };

  return (
    <main className="site-noise overflow-hidden bg-[#ffffff] text-[#1a2650]">
      <SiteHeader
        scrolled={scrolled}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        onEnquire={() => scrollToEnquiry()}
      />
      <MobileMenu
        open={menuOpen}
        onNavigate={() => setMenuOpen(false)}
        onEnquire={() => scrollToEnquiry()}
      />
      <HeroSection
        slide={slide}
        onSelectSlide={setSlide}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      />
      <IntroductionSection />
      <JourneysSection />
      <PackageGridSection />
      <HowWeTravelSection />
      <EnquirySection
        form={form}
        submitted={submitted}
        onSubmit={submitEnquiry}
        onSendAnother={() => setSubmitted(false)}
      />
      <SiteFooter />
    </main>
  );
}

export default Home;
