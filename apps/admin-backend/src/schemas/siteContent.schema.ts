import { z } from 'zod';
import { CATEGORY_VALUES } from './package.schema';

const navItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const destinationSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  blurb: z.string().min(1),
});

const tripsCategorySchema = z.object({
  key: z.enum(CATEGORY_VALUES),
  label: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1),
  image: z.string().min(1),
  destinations: z.array(destinationSchema).default([]),
});

const heroSlideSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  place: z.string().default(''),
});

const experienceSchema = z.object({
  title: z.string().min(1),
  kind: z.string().min(1),
  detail: z.string().min(1),
  image: z.string().min(1),
  meta: z.string().min(1),
  href: z.string().min(1),
});

const serviceSchema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});

const journalArticleSchema = z.object({
  category: z.string().min(1),
  title: z.string().min(1),
  date: z.string().min(1),
});

const aboutValueSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const brandInputSchema = z.object({
  name: z.string().min(1),
  mark: z.string().min(1),
  location: z.string().min(1),
});

export const navInputSchema = z.array(navItemSchema).min(1);

export const tripsMenuInputSchema = z.array(tripsCategorySchema).min(1);

export const heroSlidesInputSchema = z.array(heroSlideSchema).min(1);

export const introductionInputSchema = z.object({
  kicker: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});

export const experiencesInputSchema = z.array(experienceSchema).min(1);

export const servicesInputSchema = z.array(serviceSchema).min(1);

export const journalInputSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  image: z.string().min(1),
  articles: z.array(journalArticleSchema).default([]),
});

export const footerInputSchema = z.object({
  statement: z.string().min(1),
  email: z.string().min(1),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
});

export const aboutInputSchema = z.object({
  hero: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
  }),
  story: z.object({
    kicker: z.string().min(1),
    title: z.string().min(1),
    paragraphs: z.array(z.string().min(1)).min(1),
    image: z.string().min(1),
  }),
  values: z.array(aboutValueSchema).default([]),
  closing: z.object({
    title: z.string().min(1),
    body: z.string().min(1),
  }),
});

export const SITE_CONTENT_SECTIONS = {
  brand: brandInputSchema,
  nav: navInputSchema,
  tripsMenu: tripsMenuInputSchema,
  heroSlides: heroSlidesInputSchema,
  introduction: introductionInputSchema,
  experiences: experiencesInputSchema,
  services: servicesInputSchema,
  journal: journalInputSchema,
  footer: footerInputSchema,
  about: aboutInputSchema,
} as const;

export type SiteContentSection = keyof typeof SITE_CONTENT_SECTIONS;

export const SITE_CONTENT_SECTION_KEYS = Object.keys(SITE_CONTENT_SECTIONS) as SiteContentSection[];

export type BrandInput = z.infer<typeof brandInputSchema>;
export type NavInput = z.infer<typeof navInputSchema>;
export type TripsMenuInput = z.infer<typeof tripsMenuInputSchema>;
export type HeroSlidesInput = z.infer<typeof heroSlidesInputSchema>;
export type IntroductionInput = z.infer<typeof introductionInputSchema>;
export type ExperiencesInput = z.infer<typeof experiencesInputSchema>;
export type ServicesInput = z.infer<typeof servicesInputSchema>;
export type JournalInput = z.infer<typeof journalInputSchema>;
export type FooterInput = z.infer<typeof footerInputSchema>;
export type AboutInput = z.infer<typeof aboutInputSchema>;
