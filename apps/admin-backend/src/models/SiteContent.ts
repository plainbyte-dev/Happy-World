import { Schema, model, type InferSchemaType } from 'mongoose';
import { CATEGORY_VALUES } from '../schemas/package.schema';

const brandSchema = new Schema(
  {
    name: { type: String, required: true },
    mark: { type: String, required: true },
    location: { type: String, required: true },
  },
  { _id: false },
);

const navItemSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

const destinationSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    blurb: { type: String, required: true },
  },
  { _id: false },
);

const tripsCategorySchema = new Schema(
  {
    key: { type: String, enum: CATEGORY_VALUES, required: true },
    label: { type: String, required: true },
    description: { type: String, required: true },
    href: { type: String, required: true },
    image: { type: String, required: true },
    destinations: { type: [destinationSchema], default: [] },
  },
  { _id: false },
);

const heroSlideSchema = new Schema(
  {
    eyebrow: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    place: { type: String, default: '' },
  },
  { _id: false },
);

const experienceSchema = new Schema(
  {
    title: { type: String, required: true },
    kind: { type: String, required: true },
    detail: { type: String, required: true },
    image: { type: String, required: true },
    meta: { type: String, required: true },
    href: { type: String, required: true },
  },
  { _id: false },
);

const serviceSchema = new Schema(
  {
    number: { type: String, required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { _id: false },
);

const journalArticleSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
  },
  { _id: false },
);

const journalSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    image: { type: String, required: true },
    articles: { type: [journalArticleSchema], default: [] },
  },
  { _id: false },
);

const footerSchema = new Schema(
  {
    statement: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
  },
  { _id: false },
);

const aboutValueSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
  },
  { _id: false },
);

const aboutSchema = new Schema(
  {
    hero: {
      title: { type: String, required: true },
      body: { type: String, required: true },
    },
    story: {
      kicker: { type: String, required: true },
      title: { type: String, required: true },
      paragraphs: { type: [String], default: [] },
      image: { type: String, required: true },
    },
    values: { type: [aboutValueSchema], default: [] },
    closing: {
      title: { type: String, required: true },
      body: { type: String, required: true },
    },
  },
  { _id: false },
);

const siteContentSchema = new Schema(
  {
    brand: { type: brandSchema, required: true },
    nav: { type: [navItemSchema], default: [] },
    tripsMenu: { type: [tripsCategorySchema], default: [] },
    heroSlides: { type: [heroSlideSchema], default: [] },
    introduction: {
      kicker: { type: String, required: true },
      title: { type: String, required: true },
      body: { type: String, required: true },
    },
    experiences: { type: [experienceSchema], default: [] },
    services: { type: [serviceSchema], default: [] },
    journal: { type: journalSchema, required: true },
    footer: { type: footerSchema, required: true },
    about: { type: aboutSchema, required: true },
  },
  { timestamps: true },
);

export type SiteContentDocument = InferSchemaType<typeof siteContentSchema>;

export const SiteContent = model('SiteContent', siteContentSchema, 'site_content');
