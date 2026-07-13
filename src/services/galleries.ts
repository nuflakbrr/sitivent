'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';
import { gallerySchema, type GalleryValues } from '@/schemas/galleries';
import type {
  Gallery,
  GalleryResponse,
  GalleryPaginationResponse,
} from '@/interfaces/features/galleries';

const BASE_PATH = '/admin/master/galleries';

/**
 * Fetch galleries with pagination, search, and optional featured filter.
 */
export async function getGalleries(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  featuredOnly: boolean = false
): Promise<GalleryPaginationResponse> {
  // If featuredOnly is true, it might be called from public pages which do not require login
  if (!featuredOnly) {
    const hasAccess = await verifyPermission('galleries.read');
    if (!hasAccess) {
      return {
        success: false,
        data: [],
        meta: { total: 0, page: 1, lastPage: 0 },
        error: 'Anda tidak memiliki hak akses untuk melihat data ini.',
      };
    }
  }

  try {
    const skip = (page - 1) * limit;

    const where = {
      ...(featuredOnly ? { featured: true } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
              { event: { title: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.gallery.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.gallery.count({ where }),
    ]);

    const mapped: Gallery[] = data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      featured: item.featured,
      eventId: item.eventId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      event: item.event,
    }));

    return {
      success: true,
      data: mapped,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Galleries Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Gagal mengambil data galeri.',
    };
  }
}

/**
 * Fetch a single gallery item by ID.
 */
export async function getGalleryById(id: string): Promise<GalleryResponse> {
  const hasAccess = await verifyPermission('galleries.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses.' };
  }

  try {
    const record = await prisma.gallery.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!record) {
      return { success: false, error: 'Galeri tidak ditemukan.' };
    }

    const mapped: Gallery = {
      id: record.id,
      title: record.title,
      description: record.description,
      imageUrl: record.imageUrl,
      featured: record.featured,
      eventId: record.eventId,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      event: record.event,
    };

    return {
      success: true,
      data: mapped,
    };
  } catch (error) {
    console.error('Get Gallery By ID Error:', error);
    return { success: false, error: 'Gagal mengambil data galeri.' };
  }
}

/**
 * Create a new gallery item.
 */
export async function createGallery(values: GalleryValues): Promise<GalleryResponse> {
  const hasAccess = await verifyPermission('galleries.create');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk membuat data.' };
  }

  const validatedFields = gallerySchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const data = validatedFields.data;
    const record = await prisma.gallery.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        featured: data.featured,
        eventId: data.eventId || null,
      },
    });

    revalidatePath(BASE_PATH);
    revalidatePath('/');
    revalidatePath('/gallery');

    const mapped: Gallery = {
      id: record.id,
      title: record.title,
      description: record.description,
      imageUrl: record.imageUrl,
      featured: record.featured,
      eventId: record.eventId,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: mapped,
      message: 'Foto galeri berhasil ditambahkan.',
    };
  } catch (error) {
    console.error('Create Gallery Error:', error);
    return { success: false, error: 'Gagal menambahkan foto galeri.' };
  }
}

/**
 * Update a gallery item.
 */
export async function updateGallery(id: string, values: GalleryValues): Promise<GalleryResponse> {
  const hasAccess = await verifyPermission('galleries.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk memperbarui data.' };
  }

  const validatedFields = gallerySchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Input tidak valid.' };
  }

  try {
    const existing = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: 'Galeri tidak ditemukan.' };
    }

    const data = validatedFields.data;
    const record = await prisma.gallery.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        featured: data.featured,
        eventId: data.eventId || null,
      },
    });

    revalidatePath(BASE_PATH);
    revalidatePath('/');
    revalidatePath('/gallery');

    const mapped: Gallery = {
      id: record.id,
      title: record.title,
      description: record.description,
      imageUrl: record.imageUrl,
      featured: record.featured,
      eventId: record.eventId,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: mapped,
      message: 'Foto galeri berhasil diperbarui.',
    };
  } catch (error) {
    console.error('Update Gallery Error:', error);
    return { success: false, error: 'Gagal memperbarui data galeri.' };
  }
}

/**
 * Delete a gallery item.
 */
export async function deleteGallery(id: string): Promise<GalleryResponse> {
  const hasAccess = await verifyPermission('galleries.delete');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki hak akses untuk menghapus data.' };
  }

  try {
    const existing = await prisma.gallery.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: 'Galeri tidak ditemukan atau sudah dihapus.' };
    }

    await prisma.gallery.delete({
      where: { id },
    });

    revalidatePath(BASE_PATH);
    revalidatePath('/');
    revalidatePath('/gallery');

    return {
      success: true,
      message: 'Foto galeri berhasil dihapus.',
    };
  } catch (error) {
    console.error('Delete Gallery Error:', error);
    return { success: false, error: 'Gagal menghapus foto galeri.' };
  }
}
