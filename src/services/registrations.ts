'use server';

import { prisma } from '@/lib/prisma';
import { verifySession, verifyPermission } from './security';
import { RegistrationStatus, PaymentStatus } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { queueEmail } from './emails';
import type { RegistrationPaginationResponse } from '@/interfaces/features/registrations';

export async function getParticipantRegistrations() {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return { success: false, data: [] };
    }

    const data = await prisma.registration.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            startDate: true,
            startTime: true,
            endTime: true,
            location: true,
            status: true,
            certificateEnabled: true,
            eventType: true,
            meetingLink: true,
          },
        },
        certificates: {
          select: {
            id: true,
            downloadUrl: true,
          },
        },
        testimonial: {
          select: {
            id: true,
            rating: true,
            comment: true,
          },
        },
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error('Get Participant Registrations Error:', error);
    return { success: false, data: [] };
  }
}

export async function getRegistrations(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  eventId?: string,
  status?: string
) {
  const hasAccess = await verifyPermission('registrations.read');
  if (!hasAccess) {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Anda tidak memiliki hak akses untuk melihat data ini.',
    } satisfies RegistrationPaginationResponse;
  }

  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(eventId ? { eventId } : {}),
      ...(status ? { status: status as RegistrationStatus } : {}),
      ...(search
        ? {
            OR: [
              { registrationNumber: { contains: search, mode: 'insensitive' as const } },
              { user: { name: { contains: search, mode: 'insensitive' as const } } },
              { user: { email: { contains: search, mode: 'insensitive' as const } } },
              { event: { title: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          event: {
            select: {
              id: true,
              title: true,
              price: true,
              startDate: true,
            },
          },
        },
      }),
      prisma.registration.count({ where }),
    ]);

    return {
      success: true,
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Get Registrations Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Terjadi kesalahan sistem saat memproses data registrasi.',
    };
  }
}

export async function getEventsForFilter() {
  try {
    const events = await prisma.event.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true },
      orderBy: { title: 'asc' },
    });
    return { success: true, data: events };
  } catch (error) {
    console.error('Get Events For Filter Error:', error);
    return { success: false, data: [] };
  }
}

export async function exportRegistrationsData(
  search: string = '',
  eventId?: string,
  status?: string
) {
  const hasAccess = await verifyPermission('registrations.read');
  if (!hasAccess) {
    return {
      success: false,
      data: [],
      error: 'Anda tidak memiliki hak akses untuk mengeksport data ini.',
    };
  }

  try {
    const where = {
      deletedAt: null,
      ...(eventId ? { eventId } : {}),
      ...(status ? { status: status as RegistrationStatus } : {}),
      ...(search
        ? {
            OR: [
              { registrationNumber: { contains: search, mode: 'insensitive' as const } },
              { user: { name: { contains: search, mode: 'insensitive' as const } } },
              { user: { email: { contains: search, mode: 'insensitive' as const } } },
              { event: { title: { contains: search, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };

    const data = await prisma.registration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    });

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Export Registrations Error:', error);
    return {
      success: false,
      data: [],
      error: 'Terjadi kesalahan sistem saat mengeksport data registrasi.',
    };
  }
}

export async function registerToEvent(eventId: string) {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return { success: false, error: 'Anda harus masuk terlebih dahulu.' };
    }

    const userId = session.user.id;
    const user = session.user;

    // Cegah superadmin/panitia mendaftar event
    if (user.role === 'superadmin' || user.role === 'panitia') {
      return { success: false, error: 'Akun admin/panitia tidak dapat mendaftar event.' };
    }

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
    const regNumber = Array.from(crypto.randomBytes(12))
      .map((b) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[b % 36])
      .join('');
    const qrToken = crypto.randomBytes(16).toString('hex');

    // 7. Simpan registrasi
    const isFree = event.price === 0;

    let createdReg;
    if (isFree) {
      createdReg = await prisma.registration.create({
        data: {
          eventId,
          userId,
          registrationNumber: regNumber,
          qrToken,
          status: RegistrationStatus.REGISTERED,
        },
        include: {
          user: true,
          event: true,
        },
      });

      // Send Registration Success Email
      const isOnline = createdReg.event.eventType === 'ONLINE';
      const meetingInfo =
        isOnline && createdReg.event.meetingLink
          ? `<p>Link Meeting (Zoom): <a href="${createdReg.event.meetingLink}">${createdReg.event.meetingLink}</a></p>`
          : '<p>Sampai jumpa di lokasi event!</p>';

      const qrCodeSection = isOnline
        ? ''
        : `
          <p>Tunjukkan QR Code berikut saat check-in:</p>
          <div style="text-align: center; margin: 24px 0;">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrToken}" alt="QR Code" style="display: inline-block; border: 2px solid #E3DACC; border-radius: 8px; padding: 10px; background-color: white;" />
          </div>
        `;

      const emailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E3DACC; border-radius: 12px; background-color: #FAF9F5;">
          <h2 style="color: #D97757; font-family: serif; margin-top: 0;">Registrasi Berhasil!</h2>
          <p>Halo <strong>${createdReg.user.name || createdReg.user.email}</strong>,</p>
          <p>Anda telah berhasil terdaftar pada event <strong>${createdReg.event.title}</strong>.</p>
          <p>Nomor Registrasi Anda: <strong>${createdReg.registrationNumber}</strong></p>
          ${qrCodeSection}
          ${meetingInfo}
        </div>
      `;
      await queueEmail(
        createdReg.user.email,
        `Registrasi Berhasil: ${createdReg.event.title}`,
        emailBody
      );
    } else {
      createdReg = await prisma.registration.create({
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
        include: {
          user: true,
          event: true,
        },
      });

      // Send Waiting Payment Email
      const emailBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #E3DACC; border-radius: 12px; background-color: #FAF9F5;">
          <h2 style="color: #D97757; font-family: serif; margin-top: 0;">Registrasi Berhasil - Menunggu Pembayaran</h2>
          <p>Halo <strong>${createdReg.user.name || createdReg.user.email}</strong>,</p>
          <p>Anda telah terdaftar pada event <strong>${createdReg.event.title}</strong>.</p>
          <p>Nomor Registrasi Anda: <strong>${createdReg.registrationNumber}</strong></p>
          <p>Silakan lakukan pembayaran sebesar <strong>Rp ${createdReg.event.price.toLocaleString('id-ID')}</strong>.</p>
          <p>Setelah melakukan transfer, silakan unggah bukti pembayaran di dashboard peserta untuk verifikasi.</p>
          <p>Terima kasih!</p>
        </div>
      `;
      await queueEmail(
        createdReg.user.email,
        `Menunggu Pembayaran: ${createdReg.event.title}`,
        emailBody
      );
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

export async function cancelRegistration(registrationId: string) {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return { success: false, error: 'Anda harus masuk terlebih dahulu.' };
    }

    const reg = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { event: true, payment: true },
    });

    if (!reg || reg.deletedAt) {
      return { success: false, error: 'Registrasi tidak ditemukan.' };
    }

    const isOwner = reg.userId === session.user.id;
    const hasAccess = isOwner || (await verifyPermission('registrations.update'));

    if (!hasAccess) {
      return {
        success: false,
        error: 'Anda tidak memiliki hak akses untuk membatalkan pendaftaran ini.',
      };
    }

    await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registrationId },
        data: { status: RegistrationStatus.CANCELLED },
      });

      if (reg.payment) {
        await tx.payment.update({
          where: { registrationId },
          data: { status: PaymentStatus.FAILED },
        });
      }
    });

    revalidatePath('/participant/dashboard');
    revalidatePath(`/events/${reg.event.slug}`);
    revalidatePath('/admin/transactions/registrations');

    return { success: true, message: 'Pendaftaran berhasil dibatalkan.' };
  } catch (error) {
    console.error('Cancel Registration Error:', error);
    return { success: false, error: 'Gagal membatalkan pendaftaran.' };
  }
}

export async function deleteRegistration(registrationId: string) {
  try {
    const hasAccess = await verifyPermission('registrations.delete');
    if (!hasAccess) {
      return {
        success: false,
        error: 'Anda tidak memiliki hak akses untuk menghapus registrasi ini.',
      };
    }

    await prisma.registration.update({
      where: { id: registrationId },
      data: { deletedAt: new Date() },
    });

    revalidatePath('/admin/transactions/registrations');

    return { success: true, message: 'Registrasi berhasil dihapus.' };
  } catch (error) {
    console.error('Delete Registration Error:', error);
    return { success: false, error: 'Gagal menghapus registrasi.' };
  }
}
