import { z } from 'zod';

export const destinationInputSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters'),
});

export type DestinationInput = z.infer<typeof destinationInputSchema>;
