import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import SiteChrome from '@/components/site-chrome';
import { content } from '@/data/content';

export const metadata = {
  title: 'About Us',
  description: "Happy World Travel Tours is a Kathmandu-based, locally owned team planning trekking, pilgrimage and heritage trips across Nepal.",
  alternates: { canonical: '/about' },
};

function AboutPage() {
  const { about } = content;

  return (
    <SiteChrome solidNav>
      <main className="site-noise overflow-hidden bg-white text-[#1a2650]">
        {/* Hero */}
        <section className="px-5 sm:px-8 lg:px-12 pt-40 pb-16 sm:pt-48 sm:pb-20">
          <div className="max-w-[1440px] mx-auto">
            <span className="section-label">About Us</span>
            <h1 className="font-serif text-display-lg font-bold tracking-tighter text-foreground max-w-3xl whitespace-pre-line">
              {about.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {about.hero.body}
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="px-5 sm:px-8 lg:px-12 pb-20 sm:pb-28">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] order-2 lg:order-1">
              <AppImage src={about.story.image} alt="Guide leading a trek in Nepal" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div className="order-1 lg:order-2">
              <span className="section-label">{about.story.kicker}</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground max-w-lg">
                {about.story.title}
              </h2>
              <div className="mt-6 space-y-4">
                {about.story.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="max-w-xl text-base text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="px-5 sm:px-8 lg:px-12 pb-20 sm:pb-28">
          <div className="max-w-[1440px] mx-auto">
            <span className="section-label">What We Stand For</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground max-w-lg">
              The things we don't compromise on.
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {about.values.map((value) => (
                <div
                  key={value.title}
                  className="bg-card border border-border rounded-3xl p-6"
                  data-testid={`card-value-${value.title.toLowerCase().replaceAll(' ', '-')}`}
                >
                  <h3 className="font-serif font-bold text-lg text-foreground leading-snug">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{value.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="px-5 sm:px-8 lg:px-12 pb-24 sm:pb-32">
          <div className="max-w-[1440px] mx-auto rounded-3xl bg-[#1a2650] px-6 py-14 sm:px-16 sm:py-20 text-center">
            <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl mx-auto">
              {about.closing.title}
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-base sm:text-lg text-white/70 leading-relaxed">
              {about.closing.body}
            </p>
            <Link href="/contact" className="btn-primary inline-flex mt-9" data-testid="link-about-contact">
              Get in touch <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

export default AboutPage;
