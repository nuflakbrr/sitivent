'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';
import { slugify } from '@/lib/slugify';
import type {
  EventCategory,
  EventCategoryResponse,
  EventCategoryPaginationResponse,
} from '@/interfaces/features/event-categories';

const BASE_PATH = '/admin/master/event-categories';

import { eventCategorySchema, type EventCategoryValues } from '@/schemas/event-categories';

/**
 * Mengambil data kategori event dengan pagination dan pencarian
 */
export async function getEventCategories(
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<EventCategoryPaginationResponse> {
  const hasAccess = await verifyPermission('event.categories.read');
  if (!hasAccess) {
    return { success: false, data: [], meta: { total: 0, page: 1, lastPage: 0 } };
  }

  const skip = (page - 1) * limit;
  const where = search
    ? { OR: [{ name: { contains: search, mode: 'insensitive' as const } }] }
    : {};

  const [categories, total] = await Promise.all([
    prisma.eventCategory.findMany({
      where,
      include: { _count: { select: { events: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.eventCategory.count({ where }),
  ]);

  return {
    success: true,
    data: categories as EventCategory[],
    meta: { total, page, lastPage: Math.ceil(total / limit) || 1 },
  };
}

/**
 * Mengambil semua kategori (untuk select dropdown)
 */
export async function getAllEventCategories(): Promise<EventCategory[]> {
  const categories = await prisma.eventCategory.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { events: true } } },
  });
  return categories as EventCategory[];
}

/**
 * Mengambil kategori berdasarkan ID
 */
export async function getEventCategoryById(id: string): Promise<EventCategoryResponse> {
  const hasAccess = await verifyPermission('event.categories.read');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const category = await prisma.eventCategory.findUnique({
    where: { id },
    include: { _count: { select: { events: true } } },
  });

  if (!category) return { success: false, error: 'Kategori tidak ditemukan.' };
  return { success: true, data: category as EventCategory };
}

/**
 * Membuat kategori baru
 */
export async function createEventCategory(
  values: EventCategoryValues
): Promise<EventCategoryResponse> {
  const hasAccess = await verifyPermission('event.categories.create');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const slug = slugify(values.name);
  const exists = await prisma.eventCategory.findUnique({ where: { slug } });
  if (exists) return { success: false, error: 'Kategori dengan nama ini sudah ada.' };

  const category = await prisma.eventCategory.create({
    data: { name: values.name, slug, description: values.description || null },
  });

  revalidatePath(BASE_PATH);
  return { success: true, data: category as EventCategory, message: 'Kategori berhasil dibuat.' };
}

/**
 * Memperbarui kategori
 */
export async function updateEventCategory(
  id: string,
  values: EventCategoryValues
): Promise<EventCategoryResponse> {
  const hasAccess = await verifyPermission('event.categories.update');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const slug = slugify(values.name);
  const conflict = await prisma.eventCategory.findFirst({
    where: { slug, NOT: { id } },
  });
  if (conflict) return { success: false, error: 'Kategori dengan nama ini sudah ada.' };

  const category = await prisma.eventCategory.update({
    where: { id },
    data: { name: values.name, slug, description: values.description || null },
  });

  revalidatePath(BASE_PATH);
  return {
    success: true,
    data: category as EventCategory,
    message: 'Kategori berhasil diperbarui.',
  };
}

/**
 * Menghapus kategori
 */
export async function deleteEventCategory(id: string): Promise<EventCategoryResponse> {
  const hasAccess = await verifyPermission('event.categories.delete');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  const category = await prisma.eventCategory.findUnique({
    where: { id },
    include: { _count: { select: { events: true } } },
  });

  if (!category) return { success: false, error: 'Kategori tidak ditemukan.' };
  if ((category._count?.events ?? 0) > 0) {
    return { success: false, error: 'Kategori masih memiliki event. Hapus event terlebih dahulu.' };
  }

  await prisma.eventCategory.delete({ where: { id } });
  revalidatePath(BASE_PATH);
  return { success: true, message: 'Kategori berhasil dihapus.' };
}
