import { Schema, model, type InferSchemaType } from 'mongoose';
import { DIFFICULTY_VALUES } from '../constants/difficulty';
import { DURATION_VALUES } from '../constants/duration';
import {
  CATEGORY_VALUES,
  CURRENCY_VALUES,
  DESTINATION_VALUES,
  MONTH_VALUES,
  RATING_VALUES,
  STATUS_VALUES,
} from '../schemas/package.schema';

const bestTimeToVisitEntrySchema = new Schema(
  {
    month: { type: String, enum: MONTH_VALUES, required: true },
    rating: { type: String, enum: RATING_VALUES, required: true },
  },
  { _id: false },
);

const mealsSchema = new Schema(
  {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
  { _id: false },
);

const itineraryDaySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    keyActivities: { type: [String], default: [] },
    accommodation: { type: String, default: '' },
    transportation: { type: String, default: '' },
    meals: { type: mealsSchema, default: () => ({}) },
  },
  { _id: false },
);

const costSchema = new Schema(
  {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
    currency: { type: String, enum: CURRENCY_VALUES, default: 'NPR' },
    unit: { type: String, enum: ['per_person'], default: 'per_person' },
  },
  { _id: false },
);

const guideSchema = new Schema(
  {
    name: { type: String, required: true },
    photo: { type: String, required: true },
    bio: { type: String, required: true },
  },
  { _id: false },
);

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    quote: { type: String, required: true },
    photo: { type: String, default: '' },
  },
  { _id: false },
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false },
);

const packageSchema = new Schema(
  {
    category: { type: String, enum: CATEGORY_VALUES, default: 'nepal-tours' },
    title: { type: String, required: true, minlength: 3, maxlength: 120 },
    coverImage: { type: String, required: true },
    destinations: { type: [String], enum: DESTINATION_VALUES, default: [] },
    duration: { type: String, enum: DURATION_VALUES, required: true },
    bestTimeToVisit: { type: [bestTimeToVisitEntrySchema], default: [] },
    description: { type: String, required: true, minlength: 50 },
    itinerary: { type: [itineraryDaySchema], default: [] },
    cost: { type: costSchema, required: true },
    status: { type: String, enum: STATUS_VALUES, default: 'draft' },
    highlights: { type: [String], default: [] },
    difficulty: { type: String, enum: DIFFICULTY_VALUES },
    groupSize: { type: String, default: '' },
    maxAltitude: { type: String, default: '' },
    costIncludes: { type: [String], default: [] },
    costExcludes: { type: [String], default: [] },
    heroVideo: { type: String, default: '' },
    guide: { type: guideSchema },
    testimonials: { type: [testimonialSchema], default: [] },
    faqs: { type: [faqSchema], default: [] },
  },
  { timestamps: true },
);

export type PackageDocument = InferSchemaType<typeof packageSchema>;

export const Package = model('Package', packageSchema, 'packages');
