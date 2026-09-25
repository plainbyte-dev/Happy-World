import { content as staticContent } from '@/data/content';

export interface NavItem {
  label: string;
  href: string;
}

export interface DestinationPackage {
  name: string;
  description: string;
}

export interface Destination {
  label: string;
  href: string;
  blurb: string;
  packages: DestinationPackage[];
}

export interface TripsCategory {
  key: string;
  label: string;
  description: string;
  href: string;
  image: string;
  destinations: Destination[];
}

export interface HeroSlide {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  place: string;
}

export interface Experience {
  title: string;
  kind: string;
  detail: string;
  image: string;
  meta: string;
  href: string;
}

export interface Service {
  number: string;
  title: string;
  body: string;
}

export interface JournalArticle {
  category: string;
  title: string;
  date: string;
}

export interface AboutValue {
  title: string;
  body: string;
}

export interface SiteContent {
  brand: { name: string; mark: string; location: string };
  nav: NavItem[];
  tripsMenu: TripsCategory[];
  heroSlides: HeroSlide[];
  introduction: { kicker: string; title: string; body: string };
  experiences: Experience[];
  services: Service[];
  journal: { title: string; body: string; image: string; articles: JournalArticle[] };
  footer: { statement: string; email: string; phone: string; whatsapp: string };
  about: {
    hero: { title: string; body: string };
    story: { kicker: string; title: string; paragraphs: string[]; image: string };
    values: AboutValue[];
    closing: { title: string; body: string };
  };
}

// The static file is the guaranteed-available default: it's what renders when
// admin-backend is unreachable, and it's the sole source of each destination's
// `packages` array (see mergeTripsMenu below).
export const defaultSiteContent: SiteContent = staticContent as unknown as SiteContent;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://happy-world-admin-backend-neon.vercel.app';

type CmsTripsCategory = Omit<TripsCategory, 'destinations'> & {
  destinations: Omit<Destination, 'packages'>[];
};

type CmsSiteContent = Omit<SiteContent, 'tripsMenu'> & { tripsMenu?: CmsTripsCategory[] };

async function fetchCmsContent(): Promise<Partial<CmsSiteContent> | null> {
  try {
    const res = await fetch(`${API_BASE}/api/site-content`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data?: Partial<CmsSiteContent> };
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

// tripsMenu[].destinations[].packages is placeholder seed data for lib/packages.ts's
// synthetic package generator, not admin-managed content (see the site-content CMS
// plan) — it's never sent by the CMS, so it always comes from the static default,
// matched to the CMS-edited destination by position.
function mergeTripsMenu(staticMenu: TripsCategory[], cmsMenu: CmsTripsCategory[] | undefined): TripsCategory[] {
  if (!cmsMenu) return staticMenu;
  return cmsMenu.map((cmsCategory) => {
    const staticCategory = staticMenu.find((category) => category.key === cmsCategory.key);
    const staticDestinations = staticCategory?.destinations ?? [];
    return {
      ...cmsCategory,
      destinations: cmsCategory.destinations.map((destination, index) => ({
        ...destination,
        packages: staticDestinations[index]?.packages ?? [],
      })),
    };
  });
}

export async function getSiteContent(): Promise<SiteContent> {
  const cms = await fetchCmsContent();
  if (!cms) return defaultSiteContent;

  return {
    ...defaultSiteContent,
    ...cms,
    tripsMenu: mergeTripsMenu(defaultSiteContent.tripsMenu, cms.tripsMenu),
  };
}
