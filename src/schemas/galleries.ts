import { z } from 'zod';

export const gallerySchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter.'),
  description: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Foto wajib diunggah.'),
  featured: z.boolean(),
  eventId: z.string().optional().nullable(),
});

export type GalleryValues = z.infer<typeof gallerySchema>;
