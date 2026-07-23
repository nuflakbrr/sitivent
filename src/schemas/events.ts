import { z } from 'zod';
import { EventStatus, EventType } from '@/generated/prisma/enums';

export const speakerSchema = z.object({
  name: z.string().min(2, 'Nama pemateri minimal 2 karakter.'),
  title: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  companyUrl: z
    .string()
    .url('Website instansi harus valid.')
    .or(z.literal(''))
    .optional()
    .nullable(),
  github: z.string().url('Link GitHub harus valid.').or(z.literal('')).optional().nullable(),
  instagram: z.string().url('Link Instagram harus valid.').or(z.literal('')).optional().nullable(),
  linkedIn: z.string().url('Link LinkedIn harus valid.').or(z.literal('')).optional().nullable(),
  avatar: z.string().optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
});

export const benefitSchema = z.object({
  title: z.string().min(2, 'Benefit minimal 2 karakter.'),
  description: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  order: z.coerce.number().int().min(0).default(0),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Judul minimal 3 karakter.'),
  slug: z.string().min(3, 'Slug minimal 3 karakter.'),
  description: z.string().min(10, 'Deskripsi minimal 10 karakter.'),
  banner: z.string().optional().nullable(),
  startDate: z.date({
    message: 'Tanggal mulai wajib diisi.',
  }),
  endDate: z.date({
    message: 'Tanggal selesai wajib diisi.',
  }),
  startTime: z.string().min(1, 'Waktu mulai wajib diisi.'),
  endTime: z.string().min(1, 'Waktu selesai wajib diisi.'),
  location: z.string().min(3, 'Lokasi minimal 3 karakter.'),
  meetingLink: z.string().optional().nullable(),
  eventType: z.nativeEnum(EventType, {
    message: 'Tipe event wajib dipilih.',
  }),
  registrationDeadline: z.date({
    message: 'Batas akhir pendaftaran wajib diisi.',
  }),
  quota: z.coerce.number().int().min(0, 'Kuota tidak boleh negatif.'),
  price: z.coerce.number().int().min(0, 'Harga tidak boleh negatif.'),
  status: z.nativeEnum(EventStatus).default(EventStatus.DRAFT),
  certificateEnabled: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  createdById: z.string().optional().nullable(),
  onlineAttendance: z.boolean().default(false),
  speakers: z.array(speakerSchema).default([]),
  benefits: z.array(benefitSchema).default([]),
});

export const refinedEventSchema = eventSchema
  .refine(
    (data) => {
      const actualStart = new Date(data.startDate);
      if (data.startTime) {
        const [hours, minutes] = data.startTime.split(':').map(Number);
        actualStart.setHours(hours || 0, minutes || 0, 0, 0);
      }
      return data.registrationDeadline <= actualStart;
    },
    {
      message: 'Batas pendaftaran tidak boleh melewati tanggal mulai event.',
      path: ['registrationDeadline'],
    }
  )
  .refine(
    (data) => {
      const actualStart = new Date(data.startDate);
      if (data.startTime) {
        const [hours, minutes] = data.startTime.split(':').map(Number);
        actualStart.setHours(hours || 0, minutes || 0, 0, 0);
      }
      const actualEnd = new Date(data.endDate);
      if (data.endTime) {
        const [hours, minutes] = data.endTime.split(':').map(Number);
        actualEnd.setHours(hours || 0, minutes || 0, 0, 0);
      }
      return actualEnd >= actualStart;
    },
    {
      message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      if (data.eventType === EventType.ONLINE) {
        return !!data.meetingLink && data.meetingLink.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Link meeting/Zoom wajib diisi jika tipe event online.',
      path: ['meetingLink'],
    }
  )
  .refine(
    (data) => {
      if (data.eventType === EventType.ONLINE && data.meetingLink) {
        try {
          new URL(data.meetingLink);
          return true;
        } catch {
          return false;
        }
      }
      return true;
    },
    {
      message: 'Link meeting/Zoom harus berupa URL yang valid.',
      path: ['meetingLink'],
    }
  );
