'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { eventSchema } from '@/schemas/events';
import type { Event, EventResponse, EventPaginationResponse } from '@/interfaces/features/events';
import { verifyPermission } from './security';
import { slugify } from '@/lib/slugify';
import { EventStatus, EventType } from '@/generated/prisma/enums';

const BASE_PATH = '/admin/master/events';

export type EventValues = z.infer<typeof eventSchema>;

/**
 * Helper to check if current user is superadmin
 */
async function isSuperAdmin(): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user) return false;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { roles: true },
    });

    if (!user) return false;

    const isSuper = user.roles.some((r) => r.name.toLowerCase() === 'superadmin');
    if (isSuper) return true;

    if (user.roleId) {
      const singleRole = await prisma.role.findUnique({
        where: { id: user.roleId },
      });
      if (singleRole?.name.toLowerCase() === 'superadmin') return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Mengambil data events dengan pagination dan pencarian
 */
export async function getEvents(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<EventPaginationResponse> {
  const hasAccess = await verifyPermission('events.read');
  if (!hasAccess) {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Anda tidak memiliki hak akses untuk melihat data ini.',
    } as any;
  }

  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { location: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      success: true,
      data: data as unknown as Event[],
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Events Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
    };
  }
}

/**
 * Mengambil data event berdasarkan ID
 */
export async function getEventById(id: string): Promise<EventResponse> {
  const hasAccess = await verifyPermission('events.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const event = await prisma.event.findFirst({
      where: { id, deletedAt: null },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return { success: false, error: 'Event tidak ditemukan.' };
    }

    return {
      success: true,
      data: event as unknown as Event,
    };
  } catch (error) {
    console.error('Get Event By ID Error:', error);
    return { success: false, error: 'Gagal mengambil data event.' };
  }
}

/**
 * Helper to notify all users about a new published event
 */
async function sendEventNewsletter(event: Event) {
  try {
    const { queueEmail } = await import('./emails');
    const users = await prisma.user.findMany({
      where: { banned: false },
      select: { email: true, name: true },
    });

    const dateStr = new Date(event.startDate).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    for (const u of users) {
      const body = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E3DACC; border-radius: 12px; background-color: #FAF9F5;">
          <h2 style="color: #D97757; font-family: serif;">Event Baru Tersedia!</h2>
          <p>Halo ${u.name || u.email},</p>
          <p>Ada event menarik baru di SITIVENT! Segera daftarkan diri Anda.</p>
          <div style="background-color: white; border: 1px solid #E3DACC; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #141413; font-family: serif;">${event.title}</h3>
            <p style="margin: 6px 0; font-size: 14px; color: #3D3D3A;"><strong>Tanggal:</strong> ${dateStr}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #3D3D3A;"><strong>Lokasi:</strong> ${event.location}</p>
            <p style="margin: 6px 0; font-size: 14px; color: #3D3D3A;"><strong>Tipe:</strong> ${event.eventType}</p>
          </div>
          <p style="margin: 24px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/events/${event.slug}" style="background-color: #D97757; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Lihat Detail & Daftar</a>
          </p>
        </div>
      `;
      await queueEmail(u.email, `Event Baru: ${event.title}`, body);
    }
  } catch (error) {
    console.error('Send Event Newsletter Error:', error);
  }
}

/**
 * Membuat Event baru
 */
export async function createEvent(values: EventValues): Promise<EventResponse> {
  const hasAccess = await verifyPermission('events.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = eventSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const data = validatedFields.data;
    const finalSlug = slugify(data.slug || data.title);

    // Cek slug unik
    const existing = await prisma.event.findFirst({
      where: { slug: finalSlug, deletedAt: null },
    });

    if (existing) {
      return { success: false, error: 'Slug/Judul event sudah digunakan.' };
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: finalSlug,
        description: data.description,
        banner: data.banner,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        eventType: data.eventType,
        meetingLink: data.eventType === EventType.ONLINE ? data.meetingLink : null,
        registrationDeadline: data.registrationDeadline,
        quota: data.quota,
        price: data.price,
        status: data.status,
        certificateEnabled: data.certificateEnabled,
        publishedAt: data.status === EventStatus.PUBLISHED ? new Date() : null,
        categoryId: data.categoryId,
      },
    });

    if (event.status === EventStatus.PUBLISHED) {
      void sendEventNewsletter(event);
    }

    revalidatePath(BASE_PATH);

    return {
      success: true,
      data: event as unknown as Event,
      message: 'Event berhasil dibuat.',
    };
  } catch (error) {
    console.error('Create Event Error:', error);
    return { success: false, error: 'Gagal membuat event.' };
  }
}

/**
 * Memperbarui Event
 */
export async function updateEvent(id: string, values: EventValues): Promise<EventResponse> {
  const hasAccess = await verifyPermission('events.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk memperbarui data.' };
  }

  const validatedFields = eventSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const existing = await prisma.event.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return { success: false, error: 'Event tidak ditemukan.' };
    }

    // Aturan bisnis: Event Completed tidak boleh diedit kecuali admin tertentu (superadmin)
    if (existing.status === EventStatus.COMPLETED) {
      const isSuper = await isSuperAdmin();
      if (!isSuper) {
        return {
          success: false,
          error: 'Event yang sudah selesai tidak dapat diubah kecuali oleh Superadmin.',
        };
      }
    }

    const data = validatedFields.data;
    const finalSlug = slugify(data.slug || data.title);

    // Cek slug unik kecuali milik event itu sendiri
    const duplicate = await prisma.event.findFirst({
      where: {
        slug: finalSlug,
        id: { not: id },
        deletedAt: null,
      },
    });

    if (duplicate) {
      return { success: false, error: 'Slug/Judul event sudah digunakan oleh event lain.' };
    }

    const isPublishing =
      data.status === EventStatus.PUBLISHED && existing.status !== EventStatus.PUBLISHED;

    const event = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        slug: finalSlug,
        description: data.description,
        banner: data.banner,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
        eventType: data.eventType,
        meetingLink: data.eventType === EventType.ONLINE ? data.meetingLink : null,
        registrationDeadline: data.registrationDeadline,
        quota: data.quota,
        price: data.price,
        status: data.status,
        certificateEnabled: data.certificateEnabled,
        publishedAt: isPublishing ? new Date() : existing.publishedAt,
        categoryId: data.categoryId,
      },
    });

    if (isPublishing) {
      void sendEventNewsletter(event);
    }

    revalidatePath(BASE_PATH);
    revalidatePath(`${BASE_PATH}/${id}`);

    if (event.status === EventStatus.COMPLETED && event.certificateEnabled) {
      const { generateCertificatesForEvent } = await import('./certificates');
      await generateCertificatesForEvent(event.id);
    }

    return {
      success: true,
      data: event as unknown as Event,
      message: 'Event berhasil diperbarui.',
    };
  } catch (error) {
    console.error('Update Event Error:', error);
    return { success: false, error: 'Gagal memperbarui event.' };
  }
}

/**
 * Hapus Event (Soft Delete)
 */
export async function deleteEvent(id: string): Promise<EventResponse> {
  const hasAccess = await verifyPermission('events.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const existing = await prisma.event.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return { success: false, error: 'Event tidak ditemukan atau sudah dihapus.' };
    }

    await prisma.event.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    revalidatePath(BASE_PATH);

    return {
      success: true,
      message: 'Event berhasil dihapus.',
    };
  } catch (error) {
    console.error('Delete Event Error:', error);
    return { success: false, error: 'Gagal menghapus event.' };
  }
}

/**
 * Publikasikan Event
 */
export async function publishEvent(id: string): Promise<EventResponse> {
  const hasAccess = await verifyPermission('events.publish');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk mempublikasikan event.' };
  }

  try {
    const existing = await prisma.event.findFirst({
      where: { id, deletedAt: null },
    });

    if (!existing) {
      return { success: false, error: 'Event tidak ditemukan.' };
    }

    if (existing.status !== EventStatus.DRAFT) {
      return { success: false, error: 'Hanya event berstatus DRAFT yang dapat dipublikasikan.' };
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        status: EventStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    revalidatePath(BASE_PATH);

    return {
      success: true,
      data: event as unknown as Event,
      message: 'Event berhasil dipublikasikan.',
    };
  } catch (error) {
    console.error('Publish Event Error:', error);
    return { success: false, error: 'Gagal mempublikasikan event.' };
  }
}

/**
 * Mengambil seluruh event untuk dropdown pilihan
 */
export async function getAllEvents(): Promise<{ id: string; title: string }[]> {
  try {
    const list = await prisma.event.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
      },
      orderBy: { title: 'asc' },
    });
    return list;
  } catch (error) {
    console.error('Get All Events Error:', error);
    return [];
  }
}
