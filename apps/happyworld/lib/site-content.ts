import { content as staticContent } from '@/data/content';

export interface NavItem {
  label: string;
  href: string;
}

export interface Destination {
  label: string;
  href: string;
  blurb: string;
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
// admin-backend is unreachable.
export const defaultSiteContent: SiteContent = staticContent as unknown as SiteContent;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://happy-world-admin-backend-neon.vercel.app';

type CmsSiteContent = Omit<SiteContent, 'tripsMenu'> & { tripsMenu?: TripsCategory[] };

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

export async function getSiteContent(): Promise<SiteContent> {
  const cms = await fetchCmsContent();
  if (!cms) return defaultSiteContent;

  return {
    ...defaultSiteContent,
    ...cms,
    tripsMenu: cms.tripsMenu ?? defaultSiteContent.tripsMenu,
  };
}
