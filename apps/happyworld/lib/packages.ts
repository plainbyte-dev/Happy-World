import { getSiteContent, type SiteContent } from './site-content';

export type ItineraryDay = {
  day: number;
  title: string;
  detail: string;
  meals: string;
  stay: string;
  transport: string;
  image?: { src: string; alt: string };
  keyActivities?: string[];
  lat?: number;
  lng?: number;
  altitude?: number;
};

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  aspect?: 'wide' | 'tall' | 'square';
};

export type GuideProfile = {
  name: string;
  photo: string;
  bio: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type QuickFacts = {
  duration: string;
  maxAltitude: string;
  difficulty: string;
  groupSize: string;
};

export type MonthRating = 'excellent' | 'good' | 'fair' | 'poor';

export type PackageDetail = {
  slug: string;
  name: string;
  description: string;
  categoryLabel: string;
  categoryKey: string;
  destinationLabel: string;
  destinationHref: string;
  // Raw destination names (unformatted, unlike destinationLabel) — used to match
  // this package against a single destination, e.g. on a /destinations/[slug] page.
  destinations: string[];
  heroImage: string;
  highlights: string[];
  quickFacts: QuickFacts;
  bestTime: { month: string; rating: MonthRating; reason?: string }[];
  itinerary: ItineraryDay[];
  altitudeProfile: number[];
  costIncludes: string[];
  costExcludes: string[];
  heroVideo?: string;
  gallery: GalleryImage[];
  guide?: GuideProfile;
  faqs: FaqItem[];
  mapImage: GalleryImage;
};

type FlatPackage = {
  name: string;
  description: string;
  categoryLabel: string;
  categoryKey: string;
  destinationLabel: string;
  destinationHref: string;
  destinations: string[];
};

const HERO_IMAGES: Record<string, string> = {
  'nepal-tours': '/content-images/NepalTour.png',
  trekking: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200',
  kailash: '/content-images/Kailash.png',
};

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Live packages published from the admin dashboard.
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://happy-world-admin-backend-neon.vercel.app';

type ApiMeals = { breakfast: boolean; lunch: boolean; dinner: boolean };

type ApiItineraryDay = {
  day: number;
  title: string;
  description: string;
  images: string[];
  keyActivities: string[];
  accommodation: string;
  transportation: string;
  altitude?: number;
  meals: ApiMeals;
};

type ApiBestTimeEntry = { month: string; rating: string; reason?: string };

type ApiGuide = { name: string; photo: string; bio: string };

type ApiFaq = { question: string; answer: string };

type ApiPackage = {
  _id: string;
  title: string;
  description: string;
  destinations: string[];
  duration: string;
  itinerary: ApiItineraryDay[];
  cost: { from: number; to: number; currency: string; unit: string };
  status: string;
  coverImage: string;
  bestTimeToVisit?: ApiBestTimeEntry[];
  category?: string;
  highlights?: string[];
  difficulty?: string;
  groupSize?: string;
  maxAltitude?: string;
  costIncludes?: string[];
  costExcludes?: string[];
  heroVideo?: string;
  guide?: ApiGuide;
  faqs?: ApiFaq[];
};

const KNOWN_CATEGORY_KEYS = ['nepal-tours', 'trekking', 'kailash'];

function resolveApiCategory(category: string | undefined): string {
  return category && KNOWN_CATEGORY_KEYS.includes(category) ? category : 'nepal-tours';
}

const API_RATING_TO_MONTH_RATING: Record<string, MonthRating> = {
  best: 'excellent',
  normal: 'good',
  average: 'fair',
  avoid: 'poor',
};

const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function bestTimeFromApi(entries: ApiBestTimeEntry[]): { month: string; rating: MonthRating; reason?: string }[] {
  return [...entries]
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month))
    .map((entry) => ({
      month: entry.month.slice(0, 3),
      rating: API_RATING_TO_MONTH_RATING[entry.rating.toLowerCase()] ?? 'fair',
      reason: entry.reason?.trim() || undefined,
    }));
}

function formatList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function resolveApiImage(path: string): string {
  if (!path) return HERO_IMAGES['nepal-tours'];
  return path.startsWith('http') ? path : `${API_BASE}${path}`;
}

// Only ever real, admin-uploaded images — no stock-photo padding. A package's
// coverImage is a required field (always real), so it's a reasonable single-image
// fallback when no other gallery/itinerary images exist; GallerySection itself
// already hides entirely if this still comes back empty.
function galleryForApiPackage(pkg: ApiPackage, flat: FlatPackage, heroImage: string): GalleryImage[] {
  const seen = new Set<string>();
  const real: GalleryImage[] = [];

  const addReal = (rawUrl: string, alt: string) => {
    if (!rawUrl) return;
    const resolved = resolveApiImage(rawUrl);
    if (seen.has(resolved)) return;
    seen.add(resolved);
    real.push({ src: resolved, alt });
  };

  addReal(pkg.coverImage, flat.name);
  pkg.itinerary.forEach((day) => {
    day.images.forEach((image) => addReal(image, day.title || flat.name));
  });

  if (real.length === 0) {
    real.push({ src: heroImage, alt: flat.name });
  }

  return real;
}

function mealsToString(meals: ApiMeals): string {
  const parts = [meals.breakfast && 'Breakfast', meals.lunch && 'Lunch', meals.dinner && 'Dinner'].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : '—';
}

function cleanItineraryDescription(raw: string): string {
  return raw
    .split('\n')
    .filter((line) => !/^Activity:/i.test(line.trim()))
    .join(' ')
    .trim();
}

function apiPackageToFlat(pkg: ApiPackage, tripsMenu: SiteContent['tripsMenu']): FlatPackage {
  const destinationLabel = formatList(pkg.destinations);
  const categoryKey = resolveApiCategory(pkg.category);
  const categoryLabel = tripsMenu.find((category) => category.key === categoryKey)?.label ?? 'Nepal Tours';
  return {
    name: pkg.title.trim(),
    description: pkg.description.trim(),
    categoryLabel,
    categoryKey,
    destinationLabel,
    destinationHref: '/#way',
    destinations: pkg.destinations,
  };
}

function generateDetailFromApi(pkg: ApiPackage, tripsMenu: SiteContent['tripsMenu']): PackageDetail {
  const flat = apiPackageToFlat(pkg, tripsMenu);
  const days = pkg.itinerary.length;
  const maxAltitude = pkg.maxAltitude?.trim() || '';
  const heroImage = resolveApiImage(pkg.coverImage);

  const itinerary: ItineraryDay[] = pkg.itinerary.map((day) => {
    const realImage = day.images.find((image) => !!image);
    return {
      day: day.day,
      title: day.title,
      detail: cleanItineraryDescription(day.description),
      meals: mealsToString(day.meals),
      stay: day.accommodation.trim() || '—',
      transport: day.transportation.trim() || '—',
      // No stock-photo fallback here — ItenarySection already falls back to the
      // package's real heroImage when a day has no image of its own.
      image: realImage ? { src: resolveApiImage(realImage), alt: day.title || flat.name } : undefined,
      keyActivities: day.keyActivities.filter(Boolean),
      altitude: typeof day.altitude === 'number' ? day.altitude : undefined,
    };
  });

  // Only a real, admin-entered altitude profile — every day needs its own value,
  // otherwise the chart would either mislabel days or invent the missing ones.
  const altitudeProfile = itinerary.every((day) => typeof day.altitude === 'number')
    ? itinerary.map((day) => day.altitude as number)
    : [];

  return {
    slug: slugify(flat.name),
    name: flat.name,
    description: flat.description,
    categoryLabel: flat.categoryLabel,
    categoryKey: flat.categoryKey,
    destinationLabel: flat.destinationLabel,
    destinationHref: flat.destinationHref,
    destinations: flat.destinations,
    heroImage,
    // Only ever real, admin-entered highlights — no fabricated filler. An empty
    // list just means the section hides on the detail page.
    highlights: (pkg.highlights ?? []).filter(Boolean),
    quickFacts: {
      duration: `${days} Day${days > 1 ? 's' : ''}${days > 1 ? ` / ${days - 1} Night${days - 1 > 1 ? 's' : ''}` : ''}`,
      maxAltitude,
      difficulty: pkg.difficulty?.trim() || '',
      groupSize: pkg.groupSize?.trim() || '',
    },
    // Only ever real, admin-entered ratings — no fabricated per-category fallback.
    // When a package hasn't set this, `bestTime` is empty and the section hides.
    bestTime: pkg.bestTimeToVisit && pkg.bestTimeToVisit.length > 0 ? bestTimeFromApi(pkg.bestTimeToVisit) : [],
    itinerary,
    altitudeProfile,
    costIncludes: (pkg.costIncludes ?? []).filter(Boolean),
    costExcludes: (pkg.costExcludes ?? []).filter(Boolean),
    heroVideo: pkg.heroVideo?.trim() || undefined,
    gallery: galleryForApiPackage(pkg, flat, heroImage),
    guide: pkg.guide ? { name: pkg.guide.name, photo: resolveApiImage(pkg.guide.photo), bio: pkg.guide.bio } : undefined,
    faqs: pkg.faqs ?? [],
    mapImage: { src: heroImage, alt: `${flat.name} — the ${flat.destinationLabel} region` },
  };
}

async function fetchApiPackages(): Promise<PackageDetail[]> {
  try {
    const [res, siteContent] = await Promise.all([
      fetch(`${API_BASE}/api/packages`, { next: { revalidate: 300 } }),
      getSiteContent(),
    ]);
    if (!res.ok) return [];
    const json = (await res.json()) as { success: boolean; data: ApiPackage[] };
    if (!json.success || !Array.isArray(json.data)) return [];
    const published = json.data.filter((pkg) => pkg.status === 'published');
    return published.map((pkg) => generateDetailFromApi(pkg, siteContent.tripsMenu));
  } catch {
    return [];
  }
}

// Only real, admin-published packages from the backend — no synthetic/placeholder
// trips. Deliberately uncached here beyond fetchApiPackages()'s own fetch-level cache
// (`next: { revalidate: 300 }`), which auto-refreshes; a module-level cache on top of
// that would freeze results for the server process's lifetime, so newly created or
// published packages would never appear without a restart.
async function allDetails(): Promise<PackageDetail[]> {
  return fetchApiPackages();
}

export const getLivePackages = allDetails;

export async function getAllPackageSlugs(): Promise<string[]> {
  const details = await allDetails();
  return details.map((detail) => detail.slug);
}

export async function getPackageBySlug(slug: string): Promise<PackageDetail | undefined> {
  const details = await allDetails();
  return details.find((detail) => detail.slug === slug);
}

export async function getPackagesByCategory(categoryKey: string): Promise<PackageDetail[]> {
  const details = await allDetails();
  return details.filter((detail) => detail.categoryKey === categoryKey);
}

export async function getPackagesByDestination(destinationName: string): Promise<PackageDetail[]> {
  const details = await allDetails();
  const target = destinationName.trim().toLowerCase();
  return details.filter((detail) => detail.destinations.some((name) => name.trim().toLowerCase() === target));
}

export async function getRelatedPackages(detail: PackageDetail, limit = 3): Promise<PackageDetail[]> {
  const details = await allDetails();
  const others = details.filter((candidate) => candidate.slug !== detail.slug);
  const sameDestination = others.filter((candidate) => candidate.destinationLabel === detail.destinationLabel);
  const sameCategory = others.filter((candidate) => candidate.categoryKey === detail.categoryKey && candidate.destinationLabel !== detail.destinationLabel);
  return [...sameDestination, ...sameCategory, ...others].filter((candidate, index, arr) => arr.findIndex((c) => c.slug === candidate.slug) === index).slice(0, limit);
}
