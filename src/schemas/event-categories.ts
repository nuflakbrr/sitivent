import { z } from 'zod';

export const eventCategorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  description: z.string().optional(),
});

export type EventCategoryValues = z.infer<typeof eventCategorySchema>;
