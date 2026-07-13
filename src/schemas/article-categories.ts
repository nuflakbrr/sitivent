import { z } from 'zod';

export const articleCategorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
});

export type ArticleCategoryValues = z.infer<typeof articleCategorySchema>;
