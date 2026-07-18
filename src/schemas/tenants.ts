import { z } from 'zod';

export const tenantSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  slug: z.string().min(0, 'Slug minimal 2 karakter').max(100, 'Slug maksimal 100 karakter'),
  description: z.string().optional().nullable(),
});

export type TenantValues = z.infer<typeof tenantSchema>;
