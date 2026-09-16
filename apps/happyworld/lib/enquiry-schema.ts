import { z } from 'zod';

export const enquirySchema = z.object({
  name: z.string().min(2, 'Tell us your name so we know who to welcome.'),
  email: z.string().email('Please enter a valid email address.'),
  interest: z.string().min(1, 'Choose the kind of journey you are drawn to.'),
  message: z.string().min(12, 'A few more details will help us shape the right first reply.'),
  updates: z.boolean().optional(),
});

export type EnquiryValues = z.infer<typeof enquirySchema>;
