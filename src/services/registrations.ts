'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from './security';
import { RegistrationStatus, PaymentStatus } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function registerToEvent(eventId: string) {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return { success: false, error: 'Anda harus masuk terlebih dahulu.' };
    }

    const userId = session.user.id;

    // 1. Ambil data event
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          where: {
            status: {
              not: 'CANCELLED',
            },
          },
        },
      },
    });

    if (!event || event.deletedAt) {
      return { success: false, error: 'Event tidak ditemukan.' };
    }

    // 2. Validasi status event
    if (event.status !== 'PUBLISHED') {
      return { success: false, error: 'Pendaftaran event belum dibuka atau sudah ditutup.' };
    }

    // 3. Validasi deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return { success: false, error: 'Batas waktu pendaftaran event sudah terlewati.' };
    }

    // 4. Validasi kuota
    const totalRegistered = event.registrations.length;
    if (totalRegistered >= event.quota) {
      return { success: false, error: 'Kuota pendaftaran event sudah penuh.' };
    }

    // 5. Validasi pendaftaran ganda
    const existingReg = await prisma.registration.findFirst({
      where: {
        eventId,
        userId,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (existingReg) {
      return { success: false, error: 'Anda sudah terdaftar pada event ini.' };
    }

    // 6. Generate registration number & QR token
    const regNumber = `REG-${event.id.slice(-5).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const qrToken = crypto.randomBytes(16).toString('hex');

    // 7. Simpan registrasi
    const isFree = event.price === 0;

    if (isFree) {
      await prisma.registration.create({
        data: {
          eventId,
          userId,
          registrationNumber: regNumber,
          qrToken,
          status: RegistrationStatus.REGISTERED,
        },
      });
    } else {
      await prisma.registration.create({
        data: {
          eventId,
          userId,
          registrationNumber: regNumber,
          status: RegistrationStatus.WAITING_PAYMENT,
          payment: {
            create: {
              amount: event.price,
              status: PaymentStatus.WAITING,
            },
          },
        },
      });
    }

    revalidatePath('/participant/dashboard');
    revalidatePath(`/events/${event.slug}`);

    return {
      success: true,
      message: isFree
        ? 'Pendaftaran berhasil.'
        : 'Pendaftaran berhasil. Silakan lakukan pembayaran.',
    };
  } catch (error) {
    console.error('Register To Event Error:', error);
    return { success: false, error: 'Terjadi kesalahan saat mendaftar event.' };
  }
}

export async function getEventRegistrationStatus(eventId: string) {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return null;
    }

    const reg = await prisma.registration.findFirst({
      where: {
        eventId,
        userId: session.user.id,
        status: {
          not: 'CANCELLED',
        },
      },
    });

    return reg;
  } catch {
    return null;
  }
}
