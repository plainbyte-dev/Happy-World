import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import SiteChrome from '@/components/site-chrome';
import { content } from '@/data/content';

export const metadata = {
  title: 'Nepal Travel Packages & Tour Types',
  description: 'Trekking, pilgrimage and heritage travel packages in Nepal from Happy World Travel Tours — find the kind of trip you\'re after.',
  alternates: { canonical: '/tour-types' },
};

function TourTypesPage() {
  return (
    <SiteChrome solidNav>
    <main className="site-noise overflow-hidden bg-white text-[#1a2650]">
      <section className="px-5 sm:px-8 lg:px-12 pt-40 pb-16 sm:pt-48 sm:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <span className="section-label">Ways To Travel</span>
          <h1 className="font-serif text-display-lg font-bold tracking-tighter text-foreground">
            Choose your
            <span> tour type.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Three ways into Nepal, each with its own pace and places. Pick a route to see the destinations and packages that come with it.
          </p>
        </div>
      </section>

      <section className="px-5 sm:px-8 lg:px-12 pb-28">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {content.tripsMenu.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className="group relative block rounded-3xl overflow-hidden min-h-[420px] image-zoom-container"
              data-testid={`link-tour-type-${category.key}`}
            >
              <AppImage src={category.image} alt={category.label} fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#c9a227]">
                  {category.destinations.length} destination{category.destinations.length > 1 ? 's' : ''}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-bold text-white">{category.label}</h2>
                <p className="mt-2 text-sm text-white/70 leading-relaxed max-w-[260px]">{category.description}</p>
                <span className="inline-flex items-center gap-2 mt-6 text-xs font-bold text-white">
                  Explore {category.label} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
    </SiteChrome>
  );
}

export default TourTypesPage;
