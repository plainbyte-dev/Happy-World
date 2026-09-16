import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';
import SiteChrome from '@/components/site-chrome';
import { content } from '@/data/content';
import { getLivePackagesByCategory } from '@/lib/packages';

export async function generateStaticParams() {
  return content.tripsMenu.map((category) => ({ category: category.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryKey } = await params;
  const category = content.tripsMenu.find((c) => c.key === categoryKey);
  if (!category) return {};
  return {
    title: `${category.label} — Nepal Travel Packages`,
    description: category.description,
    alternates: { canonical: `/tour-types/${categoryKey}` },
  };
}

async function TourTypePage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryKey } = await params;
  const category = content.tripsMenu.find((c) => c.key === categoryKey);
  if (!category) notFound();

  const packages = await getLivePackagesByCategory(category.key);

  return (
    <SiteChrome>
    <main className="site-noise overflow-hidden bg-white text-[#1a2650]">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden bg-white">
        <AppImage src={category.image} alt={category.label} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />

        <div className="relative z-10 px-5 sm:px-8 lg:px-12 pb-16 pt-36 max-w-[1440px] mx-auto w-full">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-[#c9a227] transition-colors">Home</Link>
            <span>/</span>
            <span>Tour Types</span>
            <span>/</span>
            <span className="text-white/80">{category.label}</span>
          </div>

          <span className="inline-block bg-primary text-primary-foreground px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
            Tour Type
          </span>
          <h1 className="font-serif text-display-lg font-bold text-white tracking-tighter leading-[0.9]">
            {category.label}
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed">{category.description}</p>
        </div>
      </section>

      {/* Packages */}
      <section className="package-grid-section px-5 pt-20 pb-28 sm:px-8 sm:pt-28 lg:px-12" data-testid="section-tour-type-packages">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-[#c9a227]">Tour Types</p>
              <h2 className="mt-3 font-display text-5xl leading-[.93] text-white sm:text-6xl">
                {category.label} packages.
              </h2>
            </div>
            <p className="max-w-[285px] text-sm leading-relaxed text-[#b7bfd8]">
              {packages.length > 0
                ? `${packages.length} itinerar${packages.length === 1 ? 'y' : 'ies'} ready to book.`
                : "We're still building this out — tell us what you're after."}
            </p>
          </div>

          {packages.length > 0 ? (
            <div className="package-grid">
              {packages.map((pkg) => (
                <Link key={pkg.slug} href={`/packages/${pkg.slug}`} className="package-card" data-testid={`link-tour-type-package-${pkg.slug}`}>
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
          ) : (
            <div className="glass-card rounded-3xl p-10 text-center">
              <p className="text-foreground/80">No {category.label.toLowerCase()} packages are published yet.</p>
              <a href="/#enquiry" className="btn-primary inline-flex mt-6">
                Tell us what you're looking for <ArrowRight size={16} />
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
    </SiteChrome>
  );
}

export default TourTypePage;
