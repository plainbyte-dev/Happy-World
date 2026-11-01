import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SiteChrome from '@/components/site-chrome';
import { getPackagesByDestination, slugify } from '@/lib/packages';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://happy-world-admin-backend-neon.vercel.app';

type ApiDestination = { _id: string; name: string; description?: string };

async function fetchDestinations(): Promise<ApiDestination[]> {
  try {
    const res = await fetch(`${API_BASE}/api/destinations`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data?: ApiDestination[] };
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

async function findDestinationBySlug(slug: string): Promise<ApiDestination | undefined> {
  const destinations = await fetchDestinations();
  return destinations.find((d) => slugify(d.name) === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await findDestinationBySlug(slug);
  if (!destination) return {};
  return {
    title: `${destination.name} — Nepal Travel Packages`,
    description: destination.description || `Trips to ${destination.name}.`,
    alternates: { canonical: `/destinations/${slug}` },
  };
}

async function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const destination = await findDestinationBySlug(slug);
  if (!destination) notFound();

  const packages = await getPackagesByDestination(destination.name);

  return (
    <SiteChrome solidNav>
      <main className="site-noise overflow-hidden bg-white text-[#1a2650]">
        {/* Hero — no photo here: the Destination record only carries real admin-entered
            name/description/coordinates, so this stays text-only rather than inventing one. */}
        <section className="relative min-h-[45vh] flex flex-col justify-end overflow-hidden bg-[#1a2650]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a2650] via-[#20315f] to-[#2c3e68]" />
          <div className="relative z-10 px-5 sm:px-8 lg:px-12 pb-16 pt-36 max-w-[1440px] mx-auto w-full">
            <div className="flex items-center gap-2 text-xs text-white/50 mb-6">
              <Link href="/" className="hover:text-[#c9a227] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/80">{destination.name}</span>
            </div>
            <span className="inline-block bg-[#c9a227] text-[#1a2650] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
              Destination
            </span>
            <h1 className="font-serif text-display-lg font-bold text-white tracking-tighter leading-[0.9]">
              {destination.name}
            </h1>
            {destination.description ? (
              <p className="mt-6 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed">{destination.description}</p>
            ) : null}
          </div>
        </section>

        {/* Packages */}
        <section className="package-grid-section px-5 pt-20 pb-28 sm:px-8 sm:pt-28 lg:px-12" data-testid="section-destination-packages">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-[#c9a227]">Trips</p>
                <h2 className="mt-3 font-display text-5xl leading-[.93] text-white sm:text-6xl">
                  {destination.name} packages.
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
                  <Link key={pkg.slug} href={`/packages/${pkg.slug}`} className="package-card" data-testid={`link-destination-package-${pkg.slug}`}>
                    <div className="package-card-image">
                      <img src={pkg.heroImage} alt={pkg.name} loading="lazy" />
                    </div>
                    <div className="package-card-body">
                      <p className="package-card-destination">{pkg.destinationLabel}</p>
                      <h3 className="package-card-name">{pkg.name}</h3>
                      <p className="package-card-meta">{pkg.quickFacts.duration}</p>
                      <span className="package-card-link">
                        View itinerary <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-10 text-center">
                <p className="text-foreground/80">No packages are tagged with {destination.name} yet.</p>
                <a href="/contact" className="btn-primary inline-flex mt-6">
                  Tell us what you&apos;re looking for <ArrowRight size={16} />
                </a>
              </div>
            )}
          </div>
        </section>
      </main>
    </SiteChrome>
  );
}

export default DestinationPage;
