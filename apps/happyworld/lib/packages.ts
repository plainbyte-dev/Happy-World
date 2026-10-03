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

export type Testimonial = {
  name: string;
  rating: number;
  quote: string;
  photo?: string;
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
  heroImage: string;
  highlights: string[];
  priceFrom: number;
  priceCurrency: string;
  quickFacts: QuickFacts;
  bestTime: { month: string; rating: MonthRating }[];
  itinerary: ItineraryDay[];
  altitudeProfile: number[];
  costIncludes: string[];
  costExcludes: string[];
  heroVideo?: string;
  gallery: GalleryImage[];
  guide: GuideProfile;
  testimonials: Testimonial[];
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
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function difficultyForCategory(categoryKey: string): string {
  if (categoryKey === 'kailash') return 'Challenging';
  if (categoryKey === 'trekking') return 'Moderate';
  return 'Easy';
}

function maxAltitudeForCategory(categoryKey: string, days: number): { label: string; peak: number; base: number } {
  if (categoryKey === 'kailash') return { label: '5,630 M', peak: 5630, base: 1300 };
  if (categoryKey === 'trekking') {
    const peak = 3200 + days * 180;
    return { label: `${peak.toLocaleString()} M`, peak, base: 850 };
  }
  return { label: '1,400 M', peak: 1400, base: 700 };
}

function bestTimeForCategory(categoryKey: string): { month: string; rating: MonthRating }[] {
  if (categoryKey === 'kailash') {
    const ratings: MonthRating[] = ['poor', 'poor', 'poor', 'fair', 'good', 'excellent', 'excellent', 'excellent', 'good', 'fair', 'poor', 'poor'];
    return MONTHS.map((month, i) => ({ month, rating: ratings[i] }));
  }
  if (categoryKey === 'trekking') {
    const ratings: MonthRating[] = ['fair', 'good', 'excellent', 'excellent', 'good', 'poor', 'poor', 'poor', 'excellent', 'excellent', 'good', 'fair'];
    return MONTHS.map((month, i) => ({ month, rating: ratings[i] }));
  }
  const ratings: MonthRating[] = ['good', 'good', 'good', 'excellent', 'good', 'fair', 'fair', 'fair', 'good', 'excellent', 'excellent', 'good'];
  return MONTHS.map((month, i) => ({ month, rating: ratings[i] }));
}

function costForCategory(categoryKey: string): { includes: string[]; excludes: string[] } {
  if (categoryKey === 'kailash') {
    return {
      includes: ['Permits and pilgrimage fees', 'Overland transport and support vehicle', 'Guesthouse and camp accommodation', 'All meals during the yatra', 'Experienced guide and support crew'],
      excludes: ['International and domestic flights', 'Nepal and China visa fees', 'Travel insurance', 'Personal gear and down jackets', 'Tips for guides and crew'],
    };
  }
  if (categoryKey === 'trekking') {
    return {
      includes: ['Trekking permits and TIMS card', 'Teahouse or lodge accommodation', 'All meals on the trail', 'Licensed trekking guide and porter', 'Ground transport to and from the trailhead'],
      excludes: ['International flights', 'Nepal visa fee', 'Travel and rescue insurance', 'Personal trekking gear', 'Tips for guide and porter'],
    };
  }
  return {
    includes: ['Private ground transport', 'Entrance fees to listed sites', 'English-speaking local guide', 'Accommodation as noted', 'Welcome tea on arrival'],
    excludes: ['International flights', 'Nepal visa fee', 'Travel insurance', 'Meals not listed', 'Personal expenses and tips'],
  };
}

function altitudeProfileForPackage(days: number, base: number, peak: number, categoryKey: string): number[] {
  return Array.from({ length: days }, (_, i) => {
    if (days === 1) return peak;
    const t = i / (days - 1);
    if (categoryKey === 'kailash') {
      const climb = Math.sin(t * Math.PI);
      return Math.round(base + (peak - base) * climb);
    }
    if (categoryKey === 'trekking') {
      const climb = t <= 0.6 ? t / 0.6 : 1 - (t - 0.6) / 0.4;
      return Math.round(base + (peak - base) * Math.max(climb, 0.15));
    }
    return Math.round(base + (peak - base) * 0.3 * Math.sin(t * Math.PI));
  });
}

// Real, verified-on-theme Nepal/Himalaya photography — the only images used for landscape
// placeholders, so the gallery/thumbnails never show unrelated stock content (resorts, traffic, etc).
// Random third-party placeholder services (picsum.photos and similar) return arbitrary stock photos
// with no thematic control, which produced exactly that problem — do not reintroduce them here.
const PHOTO_POOL: { src: string; alt: string; categories: string[] }[] = [
  { src: '/content-images/image1.png', alt: 'Annapurna Base Camp trail sign at sunrise', categories: ['trekking'] },
  { src: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Trekker on a mountain trail', categories: ['trekking'] },
  { src: '/content-images/image2.png', alt: 'Pilgrims on the Kailash parikrama at dawn', categories: ['kailash'] },
  { src: '/content-images/Kailash.png', alt: 'Mount Kailash', categories: ['kailash'] },
  { src: '/content-images/image3.png', alt: 'Kathmandu Valley heritage temple', categories: ['nepal-tours'] },
  { src: '/content-images/NepalTour.png', alt: 'Boudhanath Stupa at sunset', categories: ['nepal-tours'] },
];

function poolImage(seed: number, categoryKey: string): { src: string; alt: string } {
  const ordered = [...PHOTO_POOL].sort((a, b) => Number(b.categories.includes(categoryKey)) - Number(a.categories.includes(categoryKey)));
  const pick = ordered[seed % ordered.length]!;
  return { src: pick.src, alt: pick.alt };
}

// Avatars use DiceBear's deterministic SVG generator instead of stock photos — a guide or reviewer
// "photo" placeholder should never risk rendering unrelated scenery (or a stranger's face).
function avatarImage(seed: string): string {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f3efe6`;
}

function guideForCategory(pkg: FlatPackage): GuideProfile {
  const slug = slugify(pkg.name);
  const bios: Record<string, string> = {
    kailash: `Born in the shadow of the Himalaya, our yatra leads have walked this pilgrimage route more times than they can count. They know the plateau's moods, the right pace for acclimatisation, and when the group needs to simply stop and look up.`,
    trekking: `A certified trekking guide from the hills you'll be walking through, with years of leading small groups along this exact route. They read weather and altitude the way you'd read a map, and know every teahouse family by name.`,
    'nepal-tours': `A Kathmandu Valley native with a deep well of local history and a habit of finding the quiet corner behind the crowd. They'll take you where the guidebooks don't, and explain why it matters.`,
  };
  return {
    name: pkg.categoryKey === 'kailash' ? 'Tenzin Sherpa' : pkg.categoryKey === 'trekking' ? 'Pemba Gurung' : 'Sanjay Shrestha',
    photo: avatarImage(`${slug}-guide`),
    bio: bios[pkg.categoryKey] ?? bios['nepal-tours'],
  };
}

const REVIEWER_NAMES = ['Amara Singh', 'Liam Carter', 'Yuki Tanaka', 'Sofia Rossi', 'Daniel Osei', 'Priya Nair'];

function testimonialsForPackage(pkg: FlatPackage): Testimonial[] {
  const slug = slugify(pkg.name);
  const seed = hashString(pkg.name);
  const quotes: Record<string, string[]> = {
    kailash: [
      'The pass crossing was the hardest thing I have done, and I would do it again tomorrow. Our guide never let the group feel rushed.',
      'Deeply organised for something so remote — permits, acclimatisation, the lot. I only had to worry about walking.',
      'A trip that changes how you think about distance and effort. Support crew was exceptional throughout.',
    ],
    trekking: [
      'Teahouses were warmer and better fed than I expected, and the pace matched our slowest walker without anyone feeling held back.',
      'Waking up to that view was worth every one of the stone steps the day before.',
      'Our guide knew exactly when to push on and when to sit and have tea. Made the whole trek feel unhurried.',
    ],
    'nepal-tours': [
      'Skipped the tourist script entirely — we ate where locals eat and saw the temples without the crowds.',
      'Our guide\'s stories about the valley made the sights land differently. Highly recommend for first-timers.',
      'Well paced, never felt like a checklist. Exactly the kind of day we were hoping for.',
    ],
  };
  const set = quotes[pkg.categoryKey] ?? quotes['nepal-tours'];
  return set.map((quote, i) => ({
    name: REVIEWER_NAMES[(seed + i) % REVIEWER_NAMES.length]!,
    rating: 5 - ((seed + i) % 2 === 0 ? 0 : 1),
    quote,
    photo: avatarImage(`${slug}-review-${i}`),
  }));
}

function faqsForPackage(pkg: FlatPackage): FaqItem[] {
  const common: FaqItem[] = [
    {
      question: 'Do I need a visa for Nepal?',
      answer: 'Most nationalities can get a visa on arrival at Tribhuvan International Airport. Bring a passport photo and pay in cash or card — we\'ll send the exact requirements once you book.',
    },
    {
      question: 'Can the group size or dates flex around us?',
      answer: 'Yes — groups stay small (2–12 travellers) and we can run this as a private departure on dates that suit you. Use the booking form to tell us your window.',
    },
    {
      question: 'What is your cancellation policy?',
      answer: 'Full refund up to 30 days before departure, 50% up to 14 days before, and trip credit (not cash) inside 14 days. Travel insurance with cancellation cover is strongly recommended regardless.',
    },
  ];
  const difficulty: FaqItem =
    pkg.categoryKey === 'kailash'
      ? { question: 'How hard is the Dolma La Pass crossing?', answer: 'It is the physical heart of the yatra — a long day at altitude. We build in acclimatisation days beforehand and the pace is set by the group, not the itinerary.' }
      : pkg.categoryKey === 'trekking'
        ? { question: 'How fit do I need to be for this trek?', answer: 'A moderate baseline fitness is enough — regular walking or hiking beforehand helps. Our guides adjust the daily pace to the group and altitude is gained gradually.' }
        : { question: 'How much walking is involved?', answer: 'Comfortable walking shoes are all you need — most days mix short walks with private vehicle transfers between sights.' };
  return [difficulty, ...common];
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
  meals: ApiMeals;
};

type ApiBestTimeEntry = { month: string; rating: string };

type ApiPackage = {
  _id: string;
  title: string;
  destinations: string[];
  duration: string;
  itinerary: ApiItineraryDay[];
  cost: { from: number; to: number; currency: string; unit: string };
  status: string;
  coverImage: string;
  bestTimeToVisit?: ApiBestTimeEntry[];
  category?: string;
};

const KNOWN_CATEGORY_KEYS = ['nepal-tours', 'trekking', 'kailash'];

function resolveApiCategory(category: string | undefined): string {
  return category && KNOWN_CATEGORY_KEYS.includes(category) ? category : 'nepal-tours';
}

const API_RATING_TO_MONTH_RATING: Record<string, MonthRating> = {
  best: 'excellent',
  normal: 'good',
  average: 'fair',
  worst: 'poor',
  poor: 'poor',
};

const MONTH_ORDER = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function bestTimeFromApi(entries: ApiBestTimeEntry[]): { month: string; rating: MonthRating }[] {
  return [...entries]
    .sort((a, b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month))
    .map((entry) => ({
      month: entry.month.slice(0, 3),
      rating: API_RATING_TO_MONTH_RATING[entry.rating.toLowerCase()] ?? 'fair',
    }));
}

async function fetchApiPackageDetail(id: string): Promise<ApiPackage | null> {
  try {
    const res = await fetch(`${API_BASE}/api/packages/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: ApiPackage };
    if (!json.success || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
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

const MIN_GALLERY_IMAGES = 6;

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

  if (real.length >= MIN_GALLERY_IMAGES) return real;

  const seed = hashString(flat.name);
  const placeholders: GalleryImage[] = [];
  for (let i = 0; real.length + placeholders.length < MIN_GALLERY_IMAGES; i += 1) {
    const image = poolImage(seed + i, flat.categoryKey);
    placeholders.push({ src: image.src, alt: image.alt });
  }
  return [...real, ...placeholders];
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
    description: `A ${pkg.itinerary.length}-day journey through ${destinationLabel}, from arrival to departure.`,
    categoryLabel,
    categoryKey,
    destinationLabel,
    destinationHref: '/#way',
  };
}

function generateDetailFromApi(pkg: ApiPackage, tripsMenu: SiteContent['tripsMenu']): PackageDetail {
  const flat = apiPackageToFlat(pkg, tripsMenu);
  const days = pkg.itinerary.length;
  const { label, peak, base } = maxAltitudeForCategory(flat.categoryKey, days);
  const { includes, excludes } = costForCategory(flat.categoryKey);
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
      image: realImage ? { src: resolveApiImage(realImage), alt: day.title || flat.name } : poolImage(hashString(flat.name) + day.day, flat.categoryKey),
      keyActivities: day.keyActivities.filter(Boolean),
    };
  });

  return {
    slug: slugify(flat.name),
    name: flat.name,
    description: flat.description,
    categoryLabel: flat.categoryLabel,
    categoryKey: flat.categoryKey,
    destinationLabel: flat.destinationLabel,
    destinationHref: flat.destinationHref,
    heroImage,
    highlights: [`Guided time in and around ${flat.destinationLabel}`, 'Small-group pace with a local guide throughout'],
    priceFrom: pkg.cost.from,
    priceCurrency: pkg.cost.currency,
    quickFacts: {
      duration: `${days} Day${days > 1 ? 's' : ''}${days > 1 ? ` / ${days - 1} Night${days - 1 > 1 ? 's' : ''}` : ''}`,
      maxAltitude: label,
      difficulty: difficultyForCategory(flat.categoryKey),
      groupSize: '2–12 travellers',
    },
    bestTime: pkg.bestTimeToVisit && pkg.bestTimeToVisit.length > 0 ? bestTimeFromApi(pkg.bestTimeToVisit) : bestTimeForCategory(flat.categoryKey),
    itinerary,
    altitudeProfile: altitudeProfileForPackage(days, base, peak, flat.categoryKey),
    costIncludes: includes,
    costExcludes: excludes,
    gallery: galleryForApiPackage(pkg, flat, heroImage),
    guide: guideForCategory(flat),
    testimonials: testimonialsForPackage(flat),
    faqs: faqsForPackage(flat),
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
    // The list endpoint omits bestTimeToVisit and category — fetch each package's detail to fill them in.
    const enriched = await Promise.all(
      published.map(async (pkg) => {
        const detail = await fetchApiPackageDetail(pkg._id);
        return detail ? { ...pkg, bestTimeToVisit: detail.bestTimeToVisit, category: detail.category } : pkg;
      }),
    );
    return enriched.map((pkg) => generateDetailFromApi(pkg, siteContent.tripsMenu));
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

export async function getRelatedPackages(detail: PackageDetail, limit = 3): Promise<PackageDetail[]> {
  const details = await allDetails();
  const others = details.filter((candidate) => candidate.slug !== detail.slug);
  const sameDestination = others.filter((candidate) => candidate.destinationLabel === detail.destinationLabel);
  const sameCategory = others.filter((candidate) => candidate.categoryKey === detail.categoryKey && candidate.destinationLabel !== detail.destinationLabel);
  return [...sameDestination, ...sameCategory, ...others].filter((candidate, index, arr) => arr.findIndex((c) => c.slug === candidate.slug) === index).slice(0, limit);
}
