'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';

export async function getTenantMembers(tenantId: string) {
  const hasAccess = await verifyPermission('tenants.read');
  if (!hasAccess) return { success: false, data: [], meta: { total: 0 } };

  const members = await prisma.userTenant.findMany({
    where: { tenantId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { user: { name: 'asc' } },
  });

  return {
    success: true,
    data: members,
    meta: { total: members.length },
  };
}

export async function searchAvailableUsers(tenantId: string, search = '') {
  const hasAccess = await verifyPermission('tenants.update');
  if (!hasAccess) return { success: false, data: [] };

  const existingIds = await prisma.userTenant.findMany({
    where: { tenantId },
    select: { userId: true },
  });

  const ids = existingIds.map((i) => i.userId);

  const users = await prisma.user.findMany({
    where: {
      id: { notIn: ids },
      OR: search
        ? [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ]
        : undefined,
    },
    select: { id: true, name: true, email: true, image: true },
    take: 20,
    orderBy: { name: 'asc' },
  });

  return { success: true, data: users };
}

export async function addTenantMember(tenantId: string, userId: string, role = 'member') {
  const hasAccess = await verifyPermission('tenants.update');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  await prisma.userTenant.create({ data: { tenantId, userId, role } });
  revalidatePath(`/admin/${tenantId}/managements/tenants/${tenantId}/members`);
  return { success: true, message: 'Member ditambahkan.' };
}

export async function removeTenantMember(tenantId: string, userId: string) {
  const hasAccess = await verifyPermission('tenants.update');
  if (!hasAccess) return { success: false, error: 'Akses ditolak.' };

  await prisma.userTenant.delete({ where: { userId_tenantId: { userId, tenantId } } });
  revalidatePath(`/admin/${tenantId}/managements/tenants/${tenantId}/members`);
  return { success: true, message: 'Member dihapus.' };
}
