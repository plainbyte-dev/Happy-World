import { DURATION_DAY_RANGE, type Duration } from '../constants/duration';
import type { ItineraryDayInput, PackageInput } from '../schemas/package.schema';

export function emptyItineraryDay(day: number): ItineraryDayInput {
  return {
    day,
    title: '',
    description: '',
    images: [],
    keyActivities: [],
    accommodation: '',
    transportation: '',
    meals: { breakfast: false, lunch: false, dinner: false },
  };
}

export function itineraryForDuration(duration: Duration): ItineraryDayInput[] {
  const { min } = DURATION_DAY_RANGE[duration];
  return Array.from({ length: min }, (_, index) => emptyItineraryDay(index + 1));
}

export function defaultPackageValues(): PackageInput {
  const duration: Duration = '3-4';
  return {
    category: 'nepal-tours',
    title: '',
    coverImage: '',
    destinations: [],
    duration,
    bestTimeToVisit: [],
    description: '',
    itinerary: itineraryForDuration(duration),
    cost: { from: 0, to: 0, currency: 'NPR', unit: 'per_person' },
    status: 'draft',
    highlights: [],
    difficulty: undefined,
    groupSize: '',
    maxAltitude: '',
    costIncludes: [],
    costExcludes: [],
    heroVideo: '',
    guide: undefined,
    testimonials: [],
    faqs: [],
  };
}
