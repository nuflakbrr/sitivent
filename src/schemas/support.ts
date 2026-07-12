import { z } from 'zod';

export const supportMessageSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.email('Format email tidak valid'),
  phone: z
    .string()
    .min(8, 'Nomor telepon/WhatsApp minimal 8 digit')
    .regex(/^[0-9+-\s]+$/, 'Nomor telepon hanya boleh berisi angka, +, -'),
  title: z.string().min(5, 'Judul issue minimal 5 karakter'),
  category: z.string().min(1, 'Pilih kategori issue'),
  chronology: z.string().min(10, 'Kronologi minimal 10 karakter'),
});
