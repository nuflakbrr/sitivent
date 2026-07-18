'use server';

import { prisma } from '@/lib/prisma';

export async function getUserDefaultTenantSlug(userId: string) {
  const tenant = await prisma.userTenant.findFirst({
    where: { userId },
    include: { tenant: true },
    orderBy: { tenant: { createdAt: 'asc' } },
  });

  return tenant?.tenant?.slug ?? null;
}
