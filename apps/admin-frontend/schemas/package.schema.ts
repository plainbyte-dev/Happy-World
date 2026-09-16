import { z } from 'zod';
import { DIFFICULTY_VALUES } from '../constants/difficulty';
import { DURATION_DAY_RANGE, DURATION_VALUES } from '../constants/duration';

export const CATEGORY_VALUES = ['nepal-tours', 'trekking', 'kailash'] as const;

export const DESTINATION_VALUES = [
  'Chitwan',
  'Pokhara',
  'Lumbini',
  'Janakpur',
  'Kathmandu',
  'Ilam',
  'Muktinath',
  'Nagarkot',
] as const;

export const MONTH_VALUES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const RATING_VALUES = ['best', 'normal', 'average'] as const;

export const CURRENCY_VALUES = ['NPR', 'USD'] as const;

export const STATUS_VALUES = ['draft', 'published'] as const;

const guideSchema = z.object({
  name: z.string().min(1),
  photo: z.string().min(1),
  bio: z.string().min(1),
});

const optionalGuideSchema = z.preprocess((val) => {
  if (val && typeof val === 'object') {
    const g = val as Record<string, unknown>;
    if (!g.name && !g.photo && !g.bio) return undefined;
  }
  return val;
}, guideSchema.optional());

const optionalDifficultySchema = z.preprocess(
  (val) => (val === '' ? undefined : val),
  z.enum(DIFFICULTY_VALUES).optional(),
);

const testimonialSchema = z.object({
  name: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  quote: z.string().min(1),
  photo: z.string().default(''),
});

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

const bestTimeToVisitEntrySchema = z.object({
  month: z.enum(MONTH_VALUES),
  rating: z.enum(RATING_VALUES),
});

const mealsSchema = z.object({
  breakfast: z.boolean().default(false),
  lunch: z.boolean().default(false),
  dinner: z.boolean().default(false),
});

const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1, 'Activity title is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  images: z.array(z.string()).default([]),
  keyActivities: z.array(z.string().min(1)).min(1, 'Add at least one key activity'),
  accommodation: z.string().default(''),
  transportation: z.string().default(''),
  meals: mealsSchema.default({ breakfast: false, lunch: false, dinner: false }),
});

const costSchema = z
  .object({
    from: z.number().positive('"From" must be greater than 0'),
    to: z.number().positive('"To" must be greater than 0'),
    currency: z.enum(CURRENCY_VALUES).default('NPR'),
    unit: z.literal('per_person').default('per_person'),
  })
  .superRefine((cost, ctx) => {
    if (cost.to < cost.from) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '"To" must be greater than or equal to "From"',
        path: ['to'],
      });
    }
  });

export const packageInputSchema = z
  .object({
    category: z.enum(CATEGORY_VALUES).default('nepal-tours'),
    title: z.string().min(3, 'Title must be at least 3 characters').max(120, 'Title must be at most 120 characters'),
    coverImage: z.string().min(1, 'Cover image is required'),
    destinations: z.array(z.enum(DESTINATION_VALUES)).min(1, 'Select at least one destination'),
    duration: z.enum(DURATION_VALUES),
    bestTimeToVisit: z.array(bestTimeToVisitEntrySchema).default([]),
    description: z.string().min(50, 'Description must be at least 50 characters'),
    itinerary: z.array(itineraryDaySchema).default([]),
    cost: costSchema,
    status: z.enum(STATUS_VALUES).default('draft'),
    highlights: z.array(z.string().min(1)).default([]),
    difficulty: optionalDifficultySchema,
    groupSize: z.string().default(''),
    maxAltitude: z.string().default(''),
    costIncludes: z.array(z.string().min(1)).default([]),
    costExcludes: z.array(z.string().min(1)).default([]),
    heroVideo: z.string().default(''),
    guide: optionalGuideSchema,
    testimonials: z.array(testimonialSchema).default([]),
    faqs: z.array(faqSchema).default([]),
  })
  .superRefine((data, ctx) => {
    const months = data.bestTimeToVisit.map((entry) => entry.month);
    const duplicateMonth = months.find((month, index) => months.indexOf(month) !== index);
    if (duplicateMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `${duplicateMonth} is selected more than once`,
        path: ['bestTimeToVisit'],
      });
    }

    const { min, max } = DURATION_DAY_RANGE[data.duration];
    if (data.itinerary.length < min || data.itinerary.length > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `A ${data.duration} day package needs between ${min} and ${max} itinerary days (got ${data.itinerary.length})`,
        path: ['itinerary'],
      });
    }

    data.itinerary.forEach((entry, index) => {
      if (entry.day !== index + 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Day numbers must be sequential starting at 1 (expected ${index + 1}, got ${entry.day})`,
          path: ['itinerary', index, 'day'],
        });
      }
    });
  });

export type PackageInput = z.infer<typeof packageInputSchema>;
export type ItineraryDayInput = z.infer<typeof itineraryDaySchema>;
export type BestTimeToVisitEntry = z.infer<typeof bestTimeToVisitEntrySchema>;
export type CostInput = z.infer<typeof costSchema>;
export type GuideInput = z.infer<typeof guideSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type FaqInput = z.infer<typeof faqSchema>;
