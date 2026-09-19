import { z } from 'zod';
import { CATEGORY_VALUES } from './package.schema';

const navItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Link is required'),
});

const destinationSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  href: z.string().min(1, 'Link is required'),
  blurb: z.string().min(1, 'Blurb is required'),
});

const tripsCategorySchema = z.object({
  key: z.enum(CATEGORY_VALUES),
  label: z.string().min(1, 'Label is required'),
  description: z.string().min(1, 'Description is required'),
  href: z.string().min(1, 'Link is required'),
  image: z.string().min(1, 'Image is required'),
  destinations: z.array(destinationSchema).default([]),
});

const heroSlideSchema = z.object({
  eyebrow: z.string().min(1, 'Eyebrow is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  image: z.string().min(1, 'Image is required'),
  place: z.string().default(''),
});

const experienceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  kind: z.string().min(1, 'Kind is required'),
  detail: z.string().min(1, 'Detail is required'),
  image: z.string().min(1, 'Image is required'),
  meta: z.string().min(1, 'Meta is required'),
  href: z.string().min(1, 'Link is required'),
});

const serviceSchema = z.object({
  number: z.string().min(1, 'Number is required'),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

const journalArticleSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(1, 'Title is required'),
  date: z.string().min(1, 'Date is required'),
});

const aboutValueSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

export const brandSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mark: z.string().min(1, 'Mark is required'),
  location: z.string().min(1, 'Location is required'),
});

export const navSchema = z.array(navItemSchema).min(1, 'Add at least one nav item');

export const tripsMenuSchema = z.array(tripsCategorySchema).min(1);

export const heroSlidesSchema = z.array(heroSlideSchema).min(1, 'Add at least one hero slide');

export const introductionSchema = z.object({
  kicker: z.string().min(1, 'Kicker is required'),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

export const experiencesSchema = z.array(experienceSchema).min(1, 'Add at least one experience');

export const servicesSchema = z.array(serviceSchema).min(1, 'Add at least one service');

export const journalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  image: z.string().min(1, 'Image is required'),
  articles: z.array(journalArticleSchema).default([]),
});

export const footerSchema = z.object({
  statement: z.string().min(1, 'Statement is required'),
  email: z.string().min(1, 'Email is required'),
  phone: z.string().min(1, 'Phone is required'),
  whatsapp: z.string().min(1, 'WhatsApp number is required'),
});

export const aboutSchema = z.object({
  hero: z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
  }),
  story: z.object({
    kicker: z.string().min(1, 'Kicker is required'),
    title: z.string().min(1, 'Title is required'),
    paragraphs: z.array(z.string().min(1, 'Paragraph cannot be empty')).min(1, 'Add at least one paragraph'),
    image: z.string().min(1, 'Image is required'),
  }),
  values: z.array(aboutValueSchema).default([]),
  closing: z.object({
    title: z.string().min(1, 'Title is required'),
    body: z.string().min(1, 'Body is required'),
  }),
});

export const siteSettingsSchema = z.object({
  brand: brandSchema,
  nav: navSchema,
  footer: footerSchema,
});

export type BrandInput = z.infer<typeof brandSchema>;
export type NavInput = z.infer<typeof navSchema>;
export type TripsMenuInput = z.infer<typeof tripsMenuSchema>;
export type HeroSlidesInput = z.infer<typeof heroSlidesSchema>;
export type IntroductionInput = z.infer<typeof introductionSchema>;
export type ExperiencesInput = z.infer<typeof experiencesSchema>;
export type ServicesInput = z.infer<typeof servicesSchema>;
export type JournalInput = z.infer<typeof journalSchema>;
export type FooterInput = z.infer<typeof footerSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export interface SiteContentRecord {
  _id: string;
  brand: BrandInput;
  nav: NavInput;
  tripsMenu: TripsMenuInput;
  heroSlides: HeroSlidesInput;
  introduction: IntroductionInput;
  experiences: ExperiencesInput;
  services: ServicesInput;
  journal: JournalInput;
  footer: FooterInput;
  about: AboutInput;
  createdAt: string;
  updatedAt: string;
}
