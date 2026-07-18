'use server';

import { prisma } from '@/lib/prisma';

export async function resolveLabel(id: string, parentSegment: string): Promise<string | null> {
  try {
    switch (parentSegment) {
      case 'event-categories': {
        const cat = await prisma.eventCategory.findUnique({
          where: { id },
          select: { name: true },
        });
        return cat?.name || null;
      }

      case 'events': {
        const event = await prisma.event.findUnique({
          where: { id },
          select: { title: true },
        });
        return event?.title || null;
      }

      case 'articles': {
        const article = await prisma.article.findUnique({
          where: { id },
          select: { title: true },
        });
        return article?.title || null;
      }

      case 'certificates': {
        const cert = await prisma.certificate.findUnique({
          where: { id },
          select: { certificateNumber: true },
        });
        return cert?.certificateNumber || null;
      }

      case 'registrations': {
        const reg = await prisma.registration.findUnique({
          where: { id },
          select: { registrationNumber: true },
        });
        return reg?.registrationNumber || null;
      }

      case 'payments': {
        const pay = await prisma.payment.findUnique({
          where: { id },
          select: { registration: { select: { registrationNumber: true } } },
        });
        return pay?.registration?.registrationNumber || null;
      }

      case 'users': {
        const user = await prisma.user.findUnique({
          where: { id },
          select: { name: true },
        });
        return user?.name || null;
      }

      case 'roles': {
        const role = await prisma.role.findUnique({
          where: { id },
          select: { name: true },
        });
        return role?.name || null;
      }

      case 'permissions': {
        const perm = await prisma.permission.findUnique({
          where: { id },
          select: { name: true },
        });
        return perm?.name || null;
      }

      case 'tenants': {
        const tenant = await prisma.tenant.findUnique({
          where: { id },
          select: { name: true },
        });
        return tenant?.name || null;
      }

      default:
        return null;
    }
  } catch (error) {
    console.error('Error resolving label:', error);
    return null;
  }
}
