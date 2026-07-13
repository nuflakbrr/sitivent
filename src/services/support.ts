'use server';

import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { verifyPermission } from '@/services/security';
import { supportMessageSchema } from '@/schemas/support';
import type {
  SupportMessage,
  CreateSupportMessageInput,
  SupportMessagesResponse,
  SupportMessageMutationResponse,
} from '@/interfaces/features/support';

/**
 * Public action to create a new support message.
 * Auto-links to the logged-in user if a session exists.
 */
export async function createSupportMessageAction(
  values: CreateSupportMessageInput
): Promise<SupportMessageMutationResponse> {
  const validated = supportMessageSchema.safeParse(values);
  if (!validated.success) {
    return { success: false, error: 'Data input tidak valid.' };
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const created = await prisma.supportMessage.create({
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        title: validated.data.title,
        category: validated.data.category,
        chronology: validated.data.chronology,
        status: 'PENDING',
        userId: session?.user?.id || null,
      },
    });

    const mapped: SupportMessage = {
      id: created.id,
      email: created.email,
      phone: created.phone,
      name: created.name,
      title: created.title,
      category: created.category,
      chronology: created.chronology,
      status: created.status,
      userId: created.userId,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: mapped,
    };
  } catch (error) {
    console.error('Create Support Message Error:', error);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat mengirim pengaduan.',
    };
  }
}

/**
 * Admin action to fetch all support messages.
 * Requires "messages.read" permission.
 */
export async function getSupportMessagesAction(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  status: string = 'ALL'
): Promise<SupportMessagesResponse> {
  const hasAccess = await verifyPermission('support.read');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki akses ke data ini.' };
  }

  try {
    const skip = (page - 1) * limit;

    const where = {
      ...(status && status !== 'ALL' ? { status } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              { email: { contains: search, mode: 'insensitive' as const } },
              { title: { contains: search, mode: 'insensitive' as const } },
              { category: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [messages, total] = await Promise.all([
      prisma.supportMessage.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.supportMessage.count({ where }),
    ]);

    const mapped: SupportMessage[] = messages.map((m) => ({
      id: m.id,
      email: m.email,
      phone: m.phone,
      name: m.name,
      title: m.title,
      category: m.category,
      chronology: m.chronology,
      status: m.status,
      userId: m.userId,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
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
    console.error('Get Support Messages Error:', error);
    return {
      success: false,
      error: 'Gagal mengambil data pengaduan.',
    };
  }
}

/**
 * Admin action to update the status of a support message.
 * Requires "messages.read" permission.
 */
export async function updateSupportMessageStatusAction(
  id: string,
  status: 'PENDING' | 'PROCESS' | 'RESOLVED'
): Promise<SupportMessageMutationResponse> {
  const hasAccess = await verifyPermission('support.update');
  if (!hasAccess) {
    return { success: false, error: 'Anda tidak memiliki akses untuk melakukan tindakan ini.' };
  }

  try {
    const updated = await prisma.supportMessage.update({
      where: { id },
      data: { status },
    });

    const mapped: SupportMessage = {
      id: updated.id,
      email: updated.email,
      phone: updated.phone,
      name: updated.name,
      title: updated.title,
      category: updated.category,
      chronology: updated.chronology,
      status: updated.status,
      userId: updated.userId,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    return {
      success: true,
      data: mapped,
    };
  } catch (error) {
    console.error('Update Support Message Status Error:', error);
    return {
      success: false,
      error: 'Gagal memperbarui status pengaduan.',
    };
  }
}
