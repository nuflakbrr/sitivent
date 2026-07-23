'use server';

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { verifySession, verifyPermission } from './security';
import { RegistrationStatus, EventStatus } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import type {
  CreateTestimonialInput,
  TestimonialResponse,
  TestimoniesPaginationResponse,
  Testimonial,
} from '@/interfaces/features/testimonials';

export async function submitTestimonial(
  input: CreateTestimonialInput
): Promise<TestimonialResponse> {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return { success: false, message: 'Anda harus login terlebih dahulu.' };
    }

    if (!input.rating || input.rating < 1 || input.rating > 5) {
      return { success: false, message: 'Rating harus antara 1 sampai 5.' };
    }

    if (!input.comment || input.comment.trim() === '') {
      return { success: false, message: 'Ulasan tidak boleh kosong.' };
    }

    const registration = await prisma.registration.findUnique({
      where: { id: input.registrationId },
      include: {
        event: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!registration) {
      return { success: false, message: 'Pendaftaran tidak ditemukan.' };
    }

    if (registration.userId !== session.user.id) {
      return { success: false, message: 'Anda tidak memiliki akses.' };
    }

    if (registration.status !== RegistrationStatus.CHECKED_IN) {
      return {
        success: false,
        message: 'Testimoni hanya dapat diberikan setelah Anda hadir (CHECKED_IN).',
      };
    }

    if (registration.event.status !== EventStatus.COMPLETED) {
      return {
        success: false,
        message: 'Testimoni hanya dapat diberikan setelah event dinyatakan selesai (COMPLETED).',
      };
    }

    const testimonial = await prisma.testimonial.upsert({
      where: { registrationId: input.registrationId },
      update: {
        rating: input.rating,
        comment: input.comment.trim(),
      },
      create: {
        registrationId: input.registrationId,
        eventId: registration.eventId,
        userId: session.user.id,
        rating: input.rating,
        comment: input.comment.trim(),
      },
    });

    revalidatePath('/participant/event-history');
    revalidatePath('/');

    return {
      success: true,
      message: 'Testimoni berhasil disimpan. Terima kasih atas masukan Anda!',
      data: testimonial,
    };
  } catch (error) {
    console.error('Submit Testimonial Error:', error);
    return { success: false, message: 'Gagal menyimpan testimoni.' };
  }
}

export async function getTestimonialByRegistrationId(
  registrationId: string
): Promise<TestimonialResponse> {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return { success: false, message: 'Anda harus login terlebih dahulu.' };
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { registrationId },
    });

    return { success: true, data: testimonial };
  } catch (error) {
    console.error('Get Testimonial Error:', error);
    return { success: false, message: 'Gagal mengambil data testimoni.' };
  }
}

export async function getTestimonies(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  eventId?: string
): Promise<TestimoniesPaginationResponse> {
  try {
    const hasPerm = await verifyPermission('testimonies.read');
    if (!hasPerm) {
      return {
        success: false,
        data: [],
        meta: { page: 1, limit: 10, total: 0, lastPage: 0 },
      };
    }

    const skip = (page - 1) * limit;

    const where: Prisma.TestimonialWhereInput = {};
    if (eventId) {
      where.eventId = eventId;
    }
    if (search) {
      where.OR = [
        { comment: { contains: search, mode: 'insensitive' as const } },
        { user: { name: { contains: search, mode: 'insensitive' as const } } },
        { event: { title: { contains: search, mode: 'insensitive' as const } } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      }),
      prisma.testimonial.count({ where }),
    ]);

    const lastPage = Math.ceil(total / limit);

    return {
      success: true,
      data: data as unknown as Testimonial[],
      meta: {
        page,
        limit,
        total,
        lastPage,
      },
    };
  } catch (error) {
    console.error('Get Testimonies Error:', error);
    return {
      success: false,
      data: [],
      meta: { page: 1, limit: 10, total: 0, lastPage: 0 },
    };
  }
}

export async function deleteTestimonial(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const hasPerm = await verifyPermission('testimonies.delete');
    if (!hasPerm) {
      return { success: false, message: 'Anda tidak memiliki izin untuk menghapus testimoni.' };
    }

    await prisma.testimonial.delete({
      where: { id },
    });

    revalidatePath('/admin/publications/testimonies');
    revalidatePath('/');

    return { success: true, message: 'Testimoni berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Testimonial Error:', error);
    return { success: false, message: 'Gagal menghapus testimoni.' };
  }
}

export async function getFeaturedTestimonials(limit: number = 10): Promise<Testimonial[]> {
  try {
    const data = await prisma.testimonial.findMany({
      take: limit,
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    });

    return data as unknown as Testimonial[];
  } catch (error) {
    console.error('Get Featured Testimonials Error:', error);
    return [];
  }
}

export async function getEventTestimonials(eventId: string): Promise<{
  testimonials: Testimonial[];
  averageRating: number;
  totalCount: number;
}> {
  try {
    const data = await prisma.testimonial.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    const totalCount = data.length;
    const averageRating =
      totalCount > 0
        ? Number((data.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1))
        : 0;

    return {
      testimonials: data as unknown as Testimonial[],
      averageRating,
      totalCount,
    };
  } catch (error) {
    console.error('Get Event Testimonials Error:', error);
    return { testimonials: [], averageRating: 0, totalCount: 0 };
  }
}
