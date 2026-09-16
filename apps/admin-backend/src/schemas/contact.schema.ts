import { z } from 'zod';

export const contactInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  interest: z.string().min(1),
  message: z.string().min(12),
  updates: z.boolean().optional().default(false),
  source: z.string().optional().default('website'),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
