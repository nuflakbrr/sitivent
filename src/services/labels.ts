'use server';

import { prisma } from '@/lib/prisma';

export async function resolveLabel(id: string, parentSegment: string): Promise<string | null> {
  try {
    if (parentSegment === 'users') {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { name: true },
      });
      return user?.name || null;
    }

    if (parentSegment === 'roles') {
      const role = await prisma.role.findUnique({
        where: { id },
        select: { name: true },
      });
      return role?.name || null;
    }

    if (parentSegment === 'events') {
      const event = await prisma.event.findUnique({
        where: { id },
        select: { title: true },
      });
      return event?.title || null;
    }

    return null;
  } catch (error) {
    console.error('Error resolving label:', error);
    return null;
  }
}
