'use server';

import { prisma } from '@/lib/prisma';
import { verifyPermission, verifySession } from './security';
import { AttendanceStatus, RegistrationStatus } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';

export async function scanQrCode(qrToken: string) {
  try {
    // 1. Verifikasi izin scanner
    const hasScanPermission = await verifyPermission('attendance.scan');
    if (!hasScanPermission) {
      return {
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Anda tidak memiliki hak akses untuk memindai QR Code.',
      };
    }

    const session = await verifySession();
    if (!session || !session.user) {
      return { success: false, error: 'INVALID_SESSION', message: 'Sesi tidak valid.' };
    }

    const scannerId = session.user.id;

    // 2. Cari pendaftaran dengan token QR ini
    const registration = await prisma.registration.findFirst({
      where: { qrToken, deletedAt: null },
      include: {
        event: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Validasi token tidak ditemukan
    if (!registration) {
      return {
        success: false,
        error: 'INVALID_QR',
        message: 'QR Code tidak ditemukan atau tidak valid.',
      };
    }

    const event = registration.event;

    // 3. Validasi event OFFLINE
    if (event.eventType !== 'OFFLINE') {
      return {
        success: false,
        error: 'ONLINE_EVENT',
        message: 'Presensi hanya dilakukan pada event OFFLINE.',
      };
    }

    // 4. Validasi event selesai
    if (event.status === 'COMPLETED' || new Date() > new Date(event.endDate)) {
      return {
        success: false,
        error: 'EVENT_COMPLETED',
        message: 'Attendance tidak boleh dilakukan setelah event selesai.',
      };
    }

    // 5. Validasi status pendaftaran dan duplikasi presensi
    if (registration.status === 'CHECKED_IN') {
      return {
        success: false,
        error: 'QR_ALREADY_USED',
        message: 'QR Code sudah pernah digunakan.',
      };
    }

    if (registration.status !== 'REGISTERED') {
      return {
        success: false,
        error: 'NOT_REGISTERED',
        message: 'Peserta yang tidak memiliki status REGISTERED tidak dapat melakukan check-in.',
      };
    }

    // 6. Jalankan check-in dalam transaksi: update registration status & log attendance
    await prisma.$transaction([
      prisma.registration.update({
        where: { id: registration.id },
        data: { status: RegistrationStatus.CHECKED_IN },
      }),
      prisma.attendance.create({
        data: {
          registrationId: registration.id,
          scannerId,
          status: AttendanceStatus.SUCCESS,
        },
      }),
    ]);

    revalidatePath('/admin/attendance/scan');

    return {
      success: true,
      message: `Berhasil check-in: ${registration.user.name || registration.user.email}`,
      data: {
        participantName: registration.user.name,
        participantEmail: registration.user.email,
        registrationNumber: registration.registrationNumber,
        eventTitle: event.title,
        scanTime: new Date(),
      },
    };
  } catch (error) {
    console.error('Scan QR Code Error:', error);
    return {
      success: false,
      error: 'SYSTEM_ERROR',
      message: 'Terjadi kesalahan sistem saat memproses presensi.',
    };
  }
}

export async function getRecentAttendanceLogs() {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return [];
    }

    const logs = await prisma.attendance.findMany({
      where: {
        scannerId: session.user.id,
      },
      take: 5,
      orderBy: {
        scanTime: 'desc',
      },
      include: {
        registration: {
          include: {
            event: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return logs.map((log) => ({
      id: log.id,
      participantName: log.registration?.user?.name || null,
      participantEmail: log.registration?.user?.email || '',
      registrationNumber: log.registration?.registrationNumber || '',
      eventTitle: log.registration?.event?.title || '',
      scanTime: log.scanTime,
      status: log.status,
    }));
  } catch (error) {
    console.error('Get Recent Attendance Logs Error:', error);
    return [];
  }
}
