import { content } from '@/data/content';

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

function flattenPackages(): FlatPackage[] {
  const flat: FlatPackage[] = [];
  content.tripsMenu.forEach((category) => {
    category.destinations.forEach((destination) => {
      destination.packages.forEach((pkg) => {
        flat.push({
          name: pkg.name,
          description: pkg.description,
          categoryLabel: category.label,
          categoryKey: category.key,
          destinationLabel: destination.label,
          destinationHref: destination.href,
        });
      });
    });
  });
  return flat;
}

function daysForPackage(pkg: FlatPackage): number {
  const seed = hashString(pkg.name) % 100;
  if (pkg.categoryKey === 'kailash') return 15 + (seed % 4);
  if (pkg.categoryKey === 'trekking') return 3 + (seed % 8);
  return 1 + (seed % 3);
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

function itineraryForPackage(pkg: FlatPackage, days: number): ItineraryDay[] {
  const isCity = pkg.categoryKey === 'nepal-tours';
  const isKailash = pkg.categoryKey === 'kailash';
  return Array.from({ length: days }, (_, i) => {
    const day = i + 1;
    const image = poolImage(hashString(pkg.name) + day, pkg.categoryKey);
    if (day === 1) {
      return {
        day,
        title: `Arrival in ${pkg.destinationLabel}`,
        detail: pkg.description,
        meals: 'Dinner',
        stay: `${pkg.destinationLabel} — guesthouse`,
        transport: 'Private vehicle',
        image,
      };
    }
    if (day === days && days > 1) {
      return {
        day,
        title: isKailash ? 'Return to Kathmandu' : `Departure from ${pkg.destinationLabel}`,
        detail: 'A final morning to gather yourself before the journey back, with time built in for the road.',
        meals: 'Breakfast',
        stay: '—',
        transport: 'Private vehicle',
        image,
      };
    }
    if (isCity) {
      return {
        day,
        title: `${pkg.destinationLabel} in depth`,
        detail: `A full day given over to the sights and rhythms that make ${pkg.destinationLabel} what it is, at a pace that leaves room to linger.`,
        meals: 'Breakfast, Lunch',
        stay: `${pkg.destinationLabel} — guesthouse`,
        transport: 'Private vehicle',
        image,
      };
    }
    if (isKailash) {
      return {
        day,
        title: day === Math.ceil(days / 2) ? 'Parikrama — Dolma La Pass' : 'Overland toward the pilgrimage route',
        detail: day === Math.ceil(days / 2)
          ? 'The high point of the yatra: a long day crossing the pass, with the mountain never far from view.'
          : 'A steady drive with acclimatisation stops, monasteries, and the plateau opening up around you.',
        meals: 'Breakfast, Lunch, Dinner',
        stay: 'Guesthouse or camp',
        transport: 'Support vehicle',
        image,
      };
    }
    return {
      day,
      title: `Trail day ${day}`,
      detail: 'A day of steady walking through changing terrain, with a teahouse and a hot meal waiting at the end of it.',
      meals: 'Breakfast, Lunch, Dinner',
      stay: 'Teahouse',
      transport: 'On foot',
      image,
    };
  });
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

function galleryForPackage(pkg: FlatPackage): GalleryImage[] {
  const seed = hashString(pkg.name);
  const count = 6 + (seed % 4); // 6–9 images, matched to the size of the verified photo pool
  return Array.from({ length: count }, (_, i) => {
    const image = poolImage(seed + i, pkg.categoryKey);
    return { src: image.src, alt: image.alt };
  });
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

function generateDetail(pkg: FlatPackage): PackageDetail {
  const days = daysForPackage(pkg);
  const { label, peak, base } = maxAltitudeForCategory(pkg.categoryKey, days);
  const { includes, excludes } = costForCategory(pkg.categoryKey);
  const seed = hashString(pkg.name) % 100;
  return {
    slug: slugify(pkg.name),
    name: pkg.name,
    description: pkg.description,
    categoryLabel: pkg.categoryLabel,
    categoryKey: pkg.categoryKey,
    destinationLabel: pkg.destinationLabel,
    destinationHref: pkg.destinationHref,
    heroImage: HERO_IMAGES[pkg.categoryKey] ?? HERO_IMAGES['nepal-tours'],
    highlights: [
      `Guided time in and around ${pkg.destinationLabel}`,
      pkg.categoryKey === 'kailash' ? 'A full pilgrimage circuit with acclimatisation built in' : 'Small-group pace with a local guide throughout',
    ],
    priceFrom: (pkg.categoryKey === 'kailash' ? 185000 : pkg.categoryKey === 'trekking' ? 45000 : 12000) + days * (pkg.categoryKey === 'kailash' ? 6000 : 3500) + seed * 40,
    priceCurrency: 'NPR',
    quickFacts: {
      duration: `${days} Day${days > 1 ? 's' : ''}${days > 1 ? ` / ${days - 1} Night${days - 1 > 1 ? 's' : ''}` : ''}`,
      maxAltitude: label,
      difficulty: difficultyForCategory(pkg.categoryKey),
      groupSize: '2–12 travellers',
    },
    bestTime: bestTimeForCategory(pkg.categoryKey),
    itinerary: itineraryForPackage(pkg, days),
    altitudeProfile: altitudeProfileForPackage(days, base, peak, pkg.categoryKey),
    costIncludes: includes,
    costExcludes: excludes,
    gallery: galleryForPackage(pkg),
    guide: guideForCategory(pkg),
    testimonials: testimonialsForPackage(pkg),
    faqs: faqsForPackage(pkg),
    mapImage: (() => {
      const image = poolImage(hashString(pkg.name) + 99, pkg.categoryKey);
      return { src: image.src, alt: `${image.alt} — the ${pkg.destinationLabel} region` };
    })(),
  };
}

// Live packages published from the admin dashboard.
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://tours-travels-admin.onrender.com';

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

function apiPackageToFlat(pkg: ApiPackage): FlatPackage {
  const destinationLabel = formatList(pkg.destinations);
  const categoryKey = resolveApiCategory(pkg.category);
  const categoryLabel = content.tripsMenu.find((category) => category.key === categoryKey)?.label ?? 'Nepal Tours';
  return {
    name: pkg.title.trim(),
    description: `A ${pkg.itinerary.length}-day journey through ${destinationLabel}, from arrival to departure.`,
    categoryLabel,
    categoryKey,
    destinationLabel,
    destinationHref: '/#way',
  };
}

function generateDetailFromApi(pkg: ApiPackage): PackageDetail {
  const flat = apiPackageToFlat(pkg);
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
    const res = await fetch(`${API_BASE}/api/packages`, { next: { revalidate: 300 } });
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
    return enriched.map(generateDetailFromApi);
  } catch {
    return [];
  }
}

const overrides: Record<string, Partial<PackageDetail>> = {
  'annapurna-base-camp': {
    heroImage: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200',
    priceFrom: 118000,
    highlights: [
      'Walk through rhododendron and bamboo forest into the high Annapurna Sanctuary',
      'Wake inside a ring of 7,000m peaks at Annapurna Base Camp',
      'Soak in the natural hot springs at Jhinu Danda on the way down',
      'Stay in family-run teahouses the whole way',
    ],
    quickFacts: { duration: '7 Days / 6 Nights', maxAltitude: '4,130 M', difficulty: 'Moderate', groupSize: '2–12 travellers' },
    bestTime: bestTimeForCategory('trekking'),
    itinerary: [
      { day: 1, title: 'Pokhara to Nayapul, trek to Tikhedhunga', detail: 'A scenic drive from Pokhara to the trailhead at Nayapul, then a gentle first walk along the Modi Khola to Tikhedhunga.', meals: 'Breakfast, Lunch, Dinner', stay: 'Tikhedhunga — teahouse', transport: 'Private vehicle, on foot', lat: 28.3833, lng: 83.6667 },
      { day: 2, title: 'Tikhedhunga to Ghorepani', detail: 'A demanding climb of stone steps through forest to Ghorepani, with Annapurna South and Dhaulagiri appearing above the ridgeline.', meals: 'Breakfast, Lunch, Dinner', stay: 'Ghorepani — teahouse', transport: 'On foot', lat: 28.4, lng: 83.6833 },
      { day: 3, title: 'Poon Hill sunrise, on to Tadapani', detail: 'A pre-dawn climb to Poon Hill for sunrise over the Annapurna and Dhaulagiri ranges, then a long ridge walk to Tadapani.', meals: 'Breakfast, Lunch, Dinner', stay: 'Tadapani — teahouse', transport: 'On foot', lat: 28.3667, lng: 83.7167 },
      { day: 4, title: 'Tadapani to Himalaya via Chhomrong', detail: 'Descend into the Modi Khola gorge and climb steadily into the Sanctuary, forest giving way to bamboo and open valley walls.', meals: 'Breakfast, Lunch, Dinner', stay: 'Himalaya — teahouse', transport: 'On foot', lat: 28.4931, lng: 83.7994 },
      { day: 5, title: 'Himalaya to Annapurna Base Camp', detail: 'The final climb past Machapuchare Base Camp into the amphitheatre of peaks, arriving at ABC with the afternoon light on the summits.', meals: 'Breakfast, Lunch, Dinner', stay: 'Annapurna Base Camp — teahouse', transport: 'On foot', lat: 28.5308, lng: 83.8203 },
      { day: 6, title: 'Descend to Jhinu Danda', detail: 'A long descent back through the Sanctuary, ending with an evening soak in the hot springs above the Modi Khola.', meals: 'Breakfast, Lunch, Dinner', stay: 'Jhinu Danda — teahouse', transport: 'On foot', lat: 28.3833, lng: 83.7667 },
      { day: 7, title: 'Jhinu Danda to Pokhara', detail: 'A final walk down to the roadhead at Siwai and a drive back to Pokhara, with the afternoon free by the lake.', meals: 'Breakfast', stay: '—', transport: 'On foot, private vehicle', lat: 28.2096, lng: 83.9856 },
    ],
    altitudeProfile: [1070, 2860, 3210, 2920, 4130, 2170, 850],
    guide: {
      name: 'Pemba Gurung',
      photo: avatarImage('annapurna-guide'),
      bio: 'Pemba grew up in a village along this exact route and has led the Annapurna Sanctuary trek for over twelve years. He reads weather and altitude instinctively, and can name every teahouse family between Nayapul and Base Camp.',
    },
    testimonials: [
      { name: 'Liam Carter', rating: 5, quote: 'Waking up inside that ring of peaks was worth every one of the stone steps the day before. Pemba never let us feel rushed.', photo: avatarImage('annapurna-review-0') },
      { name: 'Sofia Rossi', rating: 5, quote: 'Teahouses were warmer and better fed than I expected. The hot springs on the way down were the perfect ending.', photo: avatarImage('annapurna-review-1') },
      { name: 'Daniel Osei', rating: 4, quote: 'Well-paced for a mixed-fitness group. Poon Hill sunrise alone was worth the trip.', photo: avatarImage('annapurna-review-2') },
    ],
    faqs: [
      { question: 'How fit do I need to be for the Annapurna Sanctuary trek?', answer: 'A moderate baseline fitness is enough — regular walking or hiking beforehand helps, especially for the stone-step climb to Ghorepani. We set the daily pace around the group.' },
      { question: 'Do I need a visa for Nepal?', answer: 'Most nationalities get a visa on arrival at Tribhuvan International Airport with a passport photo and a card or cash payment. We\'ll confirm exact requirements once you book.' },
      { question: 'Can the group size or dates flex around us?', answer: 'Yes — we can run this as a private departure on your dates. Use the booking form to tell us your window and traveller count.' },
      { question: 'What is your cancellation policy?', answer: 'Full refund up to 30 days before departure, 50% up to 14 days before, and trip credit inside 14 days. Travel insurance with cancellation cover is strongly recommended.' },
    ],
  },
  'kailash-mansarovar-yatra': {
    heroImage: '/content-images/Kailash.png',
    priceFrom: 315000,
    highlights: [
      'Complete the Kailash Parikrama, crossing the 5,630m Dolma La Pass',
      'Circle the sacred waters of Lake Mansarovar',
      'Overland route through the Tibetan plateau with built-in acclimatisation days',
      'Small group travelling with an experienced yatra guide throughout',
    ],
    quickFacts: { duration: '16 Days / 15 Nights', maxAltitude: '5,630 M', difficulty: 'Challenging', groupSize: '2–12 travellers' },
    bestTime: bestTimeForCategory('kailash'),
    itinerary: [
      { day: 1, title: 'Arrival in Kathmandu', detail: 'Arrive in Kathmandu, briefing and final permit checks with the group.', meals: 'Dinner', stay: 'Kathmandu — hotel', transport: 'Private vehicle', lat: 27.7172, lng: 85.324 },
      { day: 2, title: 'Kathmandu to Kerung', detail: 'Cross the Nepal–China border at Rasuwagadhi and drive up to Kerung, gaining altitude for the first time.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kerung — guesthouse', transport: 'Support vehicle', lat: 28.95, lng: 85.3167 },
      { day: 3, title: 'Acclimatisation in Kerung', detail: 'A rest day in Kerung to adjust before the plateau, with short walks to ease the transition.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kerung — guesthouse', transport: 'On foot', lat: 28.95, lng: 85.3167 },
      { day: 4, title: 'Kerung to Saga', detail: 'Onto the Tibetan plateau proper, a long overland day with the landscape opening into wide brown hills.', meals: 'Breakfast, Lunch, Dinner', stay: 'Saga — guesthouse', transport: 'Support vehicle', lat: 29.3333, lng: 85.2333 },
      { day: 5, title: 'Saga to Lake Mansarovar', detail: 'Drive to the shores of Lake Mansarovar, the sacred lake at the foot of Kailash, with time for a ritual circuit.', meals: 'Breakfast, Lunch, Dinner', stay: 'Lake Mansarovar — guesthouse', transport: 'Support vehicle', lat: 30.65, lng: 81.45 },
      { day: 6, title: 'Rest day at Lake Mansarovar', detail: 'A full day by the lake for rest, ritual bathing, and acclimatisation ahead of the parikrama.', meals: 'Breakfast, Lunch, Dinner', stay: 'Lake Mansarovar — guesthouse', transport: 'On foot', lat: 30.65, lng: 81.45 },
      { day: 7, title: 'To Darchen, start of the Kailash Parikrama', detail: 'Drive to Darchen, the traditional starting point of the pilgrimage circuit around Mount Kailash.', meals: 'Breakfast, Lunch, Dinner', stay: 'Darchen — guesthouse', transport: 'Support vehicle', lat: 31.0667, lng: 81.3 },
      { day: 8, title: 'Parikrama Day 1 — Darchen to Dirapuk', detail: 'The first day of the circuit, walking beneath the north face of Kailash to the camp at Dirapuk.', meals: 'Breakfast, Lunch, Dinner', stay: 'Dirapuk — guesthouse', transport: 'On foot', lat: 31.1167, lng: 81.2667 },
      { day: 9, title: 'Parikrama Day 2 — Dolma La Pass to Zutulpuk', detail: 'The high point of the yatra: a pre-dawn start over the 5,630m Dolma La Pass, then down to Zutulpuk.', meals: 'Breakfast, Lunch, Dinner', stay: 'Zutulpuk — guesthouse', transport: 'On foot', lat: 31.0333, lng: 81.3167 },
      { day: 10, title: 'Parikrama Day 3 — Zutulpuk to Darchen', detail: 'A gentler final descent back to Darchen, completing the circuit.', meals: 'Breakfast, Lunch, Dinner', stay: 'Darchen — guesthouse', transport: 'On foot', lat: 31.0667, lng: 81.3 },
      { day: 11, title: 'Darchen to Saga', detail: 'Begin the overland return, retracing the route back toward the border.', meals: 'Breakfast, Lunch, Dinner', stay: 'Saga — guesthouse', transport: 'Support vehicle', lat: 29.3333, lng: 85.2333 },
      { day: 12, title: 'Saga to Kerung', detail: 'Continue the return journey across the plateau to Kerung.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kerung — guesthouse', transport: 'Support vehicle', lat: 28.95, lng: 85.3167 },
      { day: 13, title: 'Kerung to Kathmandu', detail: 'Cross back into Nepal at Rasuwagadhi and descend to Kathmandu, the altitude falling away behind you.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kathmandu — hotel', transport: 'Support vehicle', lat: 27.7172, lng: 85.324 },
      { day: 14, title: 'Contingency day', detail: 'A buffer day held in reserve for weather or border delays on the plateau.', meals: 'Breakfast, Lunch, Dinner', stay: 'Kathmandu — hotel', transport: '—', lat: 27.7172, lng: 85.324 },
      { day: 15, title: 'Free day in Kathmandu', detail: 'A last day in the valley to rest, shop, or visit Boudhanath before departure.', meals: 'Breakfast', stay: 'Kathmandu — hotel', transport: 'Private vehicle', lat: 27.7172, lng: 85.324 },
      { day: 16, title: 'Departure', detail: 'Transfer to the airport for your onward flight.', meals: 'Breakfast', stay: '—', transport: 'Private vehicle', lat: 27.7172, lng: 85.324 },
    ],
    altitudeProfile: [1400, 2700, 2700, 4640, 4590, 4590, 4670, 4890, 5630, 4760, 4640, 2700, 1400, 1400, 1400, 1400],
    guide: {
      name: 'Tenzin Sherpa',
      photo: avatarImage('kailash-guide'),
      bio: 'Tenzin has led the Kailash Mansarovar Yatra for over fifteen years and has crossed Dolma La more times than he can count. He knows exactly how to pace a group through the plateau\'s altitude and unpredictable weather.',
    },
    testimonials: [
      { name: 'Amara Singh', rating: 5, quote: 'The pass crossing was the hardest thing I have done, and I would do it again tomorrow. Tenzin never let the group feel rushed.', photo: avatarImage('kailash-review-0') },
      { name: 'Yuki Tanaka', rating: 5, quote: 'Deeply organised for something so remote — permits, acclimatisation, the lot. I only had to worry about walking.', photo: avatarImage('kailash-review-1') },
      { name: 'Priya Nair', rating: 4, quote: 'A trip that changes how you think about distance and effort. Support crew was exceptional throughout.', photo: avatarImage('kailash-review-2') },
    ],
    faqs: [
      { question: 'How hard is the Dolma La Pass crossing?', answer: 'It is the physical heart of the yatra — a long day at 5,630m. We build in acclimatisation days at Kerung and Lake Mansarovar beforehand, and the pace is set by the group.' },
      { question: 'Do I need separate visas for Nepal and China?', answer: 'Yes — a Nepal visa on arrival plus a group China (Tibet) visa arranged in advance. We handle the paperwork; you just need passport photos and lead time.' },
      { question: 'Can the group size or dates flex around us?', answer: 'Yes — groups stay small (2–12 travellers) and departures can be arranged privately. Tell us your preferred window in the booking form.' },
      { question: 'What is your cancellation policy?', answer: 'Full refund up to 30 days before departure, 50% up to 14 days before, and trip credit inside 14 days. Travel insurance with cancellation and high-altitude evacuation cover is required.' },
    ],
  },
};

function localDetails(): PackageDetail[] {
  return flattenPackages().map((pkg) => {
    const base = generateDetail(pkg);
    const override = overrides[base.slug];
    if (!override) return base;
    const merged = { ...base, ...override };
    // an override's hand-authored itinerary may skip per-day images — backfill from the generated placeholder set
    merged.itinerary = merged.itinerary.map((day) => (day.image ? day : { ...day, image: base.itinerary[day.day - 1]?.image }));
    return merged;
  });
}

let cache: Promise<PackageDetail[]> | null = null;

async function allDetails(): Promise<PackageDetail[]> {
  if (!cache) {
    cache = fetchApiPackages().then((apiDetails) => {
      const local = localDetails();
      const seenSlugs = new Set(local.map((detail) => detail.slug));
      const uniqueApiDetails = apiDetails.filter((detail) => {
        if (seenSlugs.has(detail.slug)) return false;
        seenSlugs.add(detail.slug);
        return true;
      });
      return [...local, ...uniqueApiDetails];
    });
  }
  return cache;
}

export async function getLivePackages(): Promise<PackageDetail[]> {
  return fetchApiPackages();
}

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

// Live database packages only — no locally-generated placeholder data — filtered by category.
export async function getLivePackagesByCategory(categoryKey: string): Promise<PackageDetail[]> {
  const details = await fetchApiPackages();
  return details.filter((detail) => detail.categoryKey === categoryKey);
}

export async function getRelatedPackages(detail: PackageDetail, limit = 3): Promise<PackageDetail[]> {
  const details = await allDetails();
  const others = details.filter((candidate) => candidate.slug !== detail.slug);
  const sameDestination = others.filter((candidate) => candidate.destinationLabel === detail.destinationLabel);
  const sameCategory = others.filter((candidate) => candidate.categoryKey === detail.categoryKey && candidate.destinationLabel !== detail.destinationLabel);
  return [...sameDestination, ...sameCategory, ...others].filter((candidate, index, arr) => arr.findIndex((c) => c.slug === candidate.slug) === index).slice(0, limit);
}
