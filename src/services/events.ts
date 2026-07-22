'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { eventSchema } from '@/schemas/events';
import type {
  Event,
  EventSpeaker,
  EventBenefit,
  EventResponse,
  EventPaginationResponse,
} from '@/interfaces/features/events';

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
 * Mengambil data events dengan pagination dan pencarian, opsional filter tenant
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
    } satisfies EventPaginationResponse;
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
          speakers: true,
          benefits: true,
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
 * Mengambil data event berdasarkan ID (opsional filter tenant)
 */
export async function getEventById(id: string): Promise<EventResponse> {
  const hasAccess = await verifyPermission('events.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const where: any = { id, deletedAt: null };

    const event = await prisma.event.findFirst({
      where,
      include: {
        speakers: true,
        benefits: true,
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
    const { sendNewEventNewsletter } = await import('@/app/actions/newsletter');
    await sendNewEventNewsletter(event);
  } catch (error) {
    console.error('Send Event Newsletter Error:', error);
  }
}

/**
 * Membuat Event baru dengan speakers & benefits
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
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const userId = session?.user?.id;

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
        categoryId: data.categoryId || null,
        createdById: userId,
        speakers:
          data.speakers && data.speakers.length > 0
            ? {
                createMany: {
                  data: data.speakers.map((s: EventSpeaker, idx: number) => ({
                    name: s.name,
                    title: s.title,
                    company: s.company,
                    companyUrl: s.companyUrl,
                    github: s.github,
                    instagram: s.instagram,
                    linkedIn: s.linkedIn,
                    avatar: s.avatar,
                    order: s.order ?? idx,
                  })),
                },
              }
            : undefined,
        benefits:
          data.benefits && data.benefits.length > 0
            ? {
                createMany: {
                  data: data.benefits.map((b: EventBenefit, idx: number) => ({
                    title: b.title,
                    description: b.description,
                    icon: b.icon,
                    order: b.order ?? idx,
                  })),
                },
              }
            : undefined,
      },
      include: {
        speakers: true,
        benefits: true,
      },
    });

    if (event.status === EventStatus.PUBLISHED) {
      void sendEventNewsletter(event as unknown as Event);
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
 * Memperbarui Event dengan speakers & benefits
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

    // Hapus speakers & benefits lama
    await prisma.$transaction([
      prisma.eventSpeaker.deleteMany({ where: { eventId: id } }),
      prisma.eventBenefit.deleteMany({ where: { eventId: id } }),
    ]);

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
        categoryId: data.categoryId || null,
        speakers:
          data.speakers && data.speakers.length > 0
            ? {
                createMany: {
                  data: data.speakers.map((s: EventSpeaker, idx: number) => ({
                    name: s.name,
                    title: s.title,
                    company: s.company,
                    companyUrl: s.companyUrl,
                    github: s.github,
                    instagram: s.instagram,
                    linkedIn: s.linkedIn,
                    avatar: s.avatar,
                    order: s.order ?? idx,
                  })),
                },
              }
            : undefined,
        benefits:
          data.benefits && data.benefits.length > 0
            ? {
                createMany: {
                  data: data.benefits.map((b: EventBenefit, idx: number) => ({
                    title: b.title,
                    description: b.description,
                    icon: b.icon,
                    order: b.order ?? idx,
                  })),
                },
              }
            : undefined,
      },
      include: {
        speakers: true,
        benefits: true,
      },
    });

    if (isPublishing) {
      void sendEventNewsletter(event as unknown as Event);
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
