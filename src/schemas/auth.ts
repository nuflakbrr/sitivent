import { z } from 'zod';

const BLOCKED_DOMAINS = [
  'yopmail.com',
  'ethermail.io',
  'ethermail.com',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'dispostable.com',
  'getairmail.com',
  'maildrop.cc',
];

export const loginSchema = z.object({
  email: z.email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z
    .string()
    .email('Format email tidak valid')
    .refine(
      (email) => {
        const domain = email.split('@')[1]?.toLowerCase();
        return !BLOCKED_DOMAINS.includes(domain);
      },
      {
        message: 'Domain email ini tidak diperbolehkan untuk registrasi',
      }
    ),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});
