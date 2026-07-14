'use server';

import { prisma } from '@/lib/prisma';
import { verifySession, verifyPermission } from './security';
import { PaymentStatus, RegistrationStatus } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { queueEmail } from './emails';
import { uploadImage } from './uploads';

export async function getPayments(page: number = 1, limit: number = 10, search: string = '') {
  const hasAccess = await verifyPermission('payments.verify');
  if (!hasAccess) {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Anda tidak memiliki hak akses untuk melihat data ini.',
    } as any;
  }

  try {
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              {
                registration: {
                  registrationNumber: { contains: search, mode: 'insensitive' as const },
                },
              },
              {
                registration: {
                  user: { name: { contains: search, mode: 'insensitive' as const } },
                },
              },
              {
                registration: {
                  user: { email: { contains: search, mode: 'insensitive' as const } },
                },
              },
              {
                registration: {
                  event: { title: { contains: search, mode: 'insensitive' as const } },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          registration: {
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
                },
              },
            },
          },
          verifiedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.payment.count({ where }),
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
    console.error('Get Payments Error:', error);
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, lastPage: 0 },
      error: 'Terjadi kesalahan sistem saat memproses data pembayaran.',
    };
  }
}

export async function verifyPayment(
  paymentId: string,
  status: PaymentStatus,
  rejectReason?: string
) {
  const session = await verifySession();
  if (!session || !session.user) {
    return { success: false, error: 'Anda harus masuk terlebih dahulu.' };
  }

  const hasAccess = await verifyPermission('payments.verify');
  if (!hasAccess) {
    return {
      success: false,
      error: 'Anda tidak memiliki hak akses untuk memverifikasi pembayaran.',
    };
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        registration: {
          include: {
            user: true,
            event: true,
          },
        },
      },
    });

    if (!payment || payment.deletedAt) {
      return { success: false, error: 'Pembayaran tidak ditemukan.' };
    }

    if (payment.status !== PaymentStatus.WAITING) {
      return { success: false, error: 'Pembayaran ini sudah diproses sebelumnya.' };
    }

    const qrToken = crypto.randomBytes(16).toString('hex');

    await prisma.$transaction(async (tx) => {
      // Update Payment status
      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status,
          verifiedAt: new Date(),
          verifiedById: session.user.id,
        },
      });

      // Update Registration status and generate QR Code token if PAID
      if (status === PaymentStatus.PAID) {
        await tx.registration.update({
          where: { id: payment.registrationId },
          data: {
            status: RegistrationStatus.REGISTERED,
            qrToken,
          },
        });
      } else if (status === PaymentStatus.FAILED) {
        await tx.registration.update({
          where: { id: payment.registrationId },
          data: {
            status: RegistrationStatus.WAITING_PAYMENT,
          },
        });
      }

      // Record Audit Log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: `VERIFY_PAYMENT_${status}`,
          table: 'payments',
          recordId: paymentId,
          oldValues: JSON.stringify({ status: payment.status }),
          newValues: JSON.stringify({ status, rejectReason }),
        },
      });
    });

    // Send emails after successful transaction commits
    if (status === PaymentStatus.PAID) {
      const isOnline = payment.registration.event.eventType === 'ONLINE';
      const meetingInfo =
        isOnline && payment.registration.event.meetingLink
          ? `<p>Link Meeting (Zoom): <a href="${payment.registration.event.meetingLink}">${payment.registration.event.meetingLink}</a></p>`
          : '<p>Sampai jumpa di lokasi event!</p>';

      const emailBody = `
        <h2>Pembayaran Berhasil Diverifikasi!</h2>
        <p>Halo ${payment.registration.user.name || payment.registration.user.email},</p>
        <p>Pembayaran Anda untuk event <strong>${payment.registration.event.title}</strong> sebesar <strong>Rp ${payment.amount.toLocaleString('id-ID')}</strong> telah berhasil diverifikasi.</p>
        <p>Nomor Registrasi Anda: <strong>${payment.registration.registrationNumber}</strong></p>
        <p>Tunjukkan QR Code berikut saat check-in:</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrToken}" alt="QR Code" style="display:block;margin:10px 0;" />
        ${meetingInfo}
      `;
      await queueEmail(
        payment.registration.user.email,
        `Pembayaran Berhasil: ${payment.registration.event.title}`,
        emailBody
      );
    } else if (status === PaymentStatus.FAILED) {
      const emailBody = `
        <h2>Pembayaran Gagal Diverifikasi</h2>
        <p>Halo ${payment.registration.user.name || payment.registration.user.email},</p>
        <p>Mohon maaf, bukti pembayaran Anda untuk event <strong>${payment.registration.event.title}</strong> ditolak.</p>
        <p>Alasan: <strong>${rejectReason || 'Bukti transfer tidak valid atau tidak sesuai.'}</strong></p>
        <p>Silakan unggah kembali bukti pembayaran yang valid melalui dashboard peserta.</p>
      `;
      await queueEmail(
        payment.registration.user.email,
        `Verifikasi Pembayaran Gagal: ${payment.registration.event.title}`,
        emailBody
      );
    }

    revalidatePath('/admin/transactions/payments');
    revalidatePath('/admin/transactions/registrations');

    return { success: true, message: `Verifikasi pembayaran berhasil diset sebagai ${status}.` };
  } catch (error) {
    console.error('Verify Payment Error:', error);
    return { success: false, error: 'Gagal memproses verifikasi pembayaran.' };
  }
}

export async function uploadPaymentProof(registrationId: string, formData: FormData) {
  const session = await verifySession();
  if (!session || !session.user) {
    return { success: false, error: 'Anda harus masuk terlebih dahulu.' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'File bukti pembayaran harus diunggah.' };
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { payment: true },
    });

    if (!registration || registration.deletedAt) {
      return { success: false, error: 'Registrasi tidak ditemukan.' };
    }

    if (registration.userId !== session.user.id) {
      return { success: false, error: 'Anda tidak memiliki hak akses untuk pendaftaran ini.' };
    }

    const uploadResult = await uploadImage(file, 'payments');
    if (!uploadResult.success || !uploadResult.url) {
      return { success: false, error: uploadResult.error || 'Gagal mengunggah bukti pembayaran.' };
    }

    await prisma.payment.update({
      where: { registrationId },
      data: {
        proofUrl: uploadResult.url,
        status: PaymentStatus.WAITING,
      },
    });

    revalidatePath('/participant/dashboard');
    revalidatePath('/admin/transactions/payments');

    return { success: true, message: 'Bukti pembayaran berhasil diunggah.' };
  } catch (error) {
    console.error('Upload Payment Proof Error:', error);
    return { success: false, error: 'Gagal mengunggah bukti pembayaran.' };
  }
}
