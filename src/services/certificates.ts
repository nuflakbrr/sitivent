'use server';

import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';
import { EventStatus, RegistrationStatus, CertNumberMode } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';

const BASE_PATH = '/admin/master/certificates';

export type CertificateResponse = {
  id: string;
  certificateNumber: string;
  createdAt: Date;
  downloadTime: Date | null;
  registration: {
    registrationNumber: string;
  };
  event: {
    title: string;
    slug: string;
  };
  user: {
    name: string | null;
    email: string;
  };
};

export type CertificatePaginationResponse = {
  success: boolean;
  data?: CertificateResponse[];
  meta?: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
};

/**
 * Get paginated list of certificates (Admin view)
 */
export async function getCertificates(
  page: number = 1,
  limit: number = 5,
  search: string = ''
): Promise<CertificatePaginationResponse> {
  try {
    await verifyPermission('certificates.read');

    const skip = (page - 1) * limit;

    const whereClause: any = {
      OR: [
        {
          certificateNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          event: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    };

    const [total, certificates] = await Promise.all([
      prisma.certificate.count({ where: whereClause }),
      prisma.certificate.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          certificateNumber: true,
          createdAt: true,
          downloadTime: true,
          registration: {
            select: {
              registrationNumber: true,
            },
          },
          event: {
            select: {
              title: true,
              slug: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      success: true,
      data: certificates,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error('Get Certificates Error:', error);
    return {
      success: false,
      error: error.message || 'Gagal mengambil data sertifikat.',
    };
  }
}

/**
 * Generate certificates for a completed event
 */
export async function generateCertificatesForEvent(eventId: string) {
  try {
    const event = await prisma.event.findFirst({
      where: { id: eventId, deletedAt: null },
    });

    if (!event) {
      return { success: false, error: 'Event tidak ditemukan.' };
    }

    if (!event.certificateEnabled) {
      return { success: false, error: 'Fitur sertifikat dinonaktifkan untuk event ini.' };
    }

    // Find all checked-in registrations that do not have a certificate yet
    const registrations = await prisma.registration.findMany({
      where: {
        eventId,
        status: RegistrationStatus.CHECKED_IN,
        certificates: {
          none: {},
        },
      },
      include: {
        user: true,
      },
    });

    if (registrations.length === 0) {
      return { success: true, count: 0, message: 'Tidak ada sertifikat baru yang perlu dibuat.' };
    }

    let createdCount = 0;

    // Generate certificate for each registration
    for (const reg of registrations) {
      const certificateNumber = `CERT/${event.slug.toUpperCase()}/${reg.registrationNumber}`;

      // Check if number already exists
      const existing = await prisma.certificate.findFirst({
        where: { certificateNumber },
      });

      if (existing) continue;

      const certId = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2);

      await prisma.certificate.create({
        data: {
          id: certId,
          registrationId: reg.id,
          eventId: event.id,
          userId: reg.userId,
          certificateNumber,
          templateUrl: event.banner || '',
          pdfUrl: `/certificates/${certId}`,
          downloadUrl: `/certificates/${certId}`,
        },
      });

      createdCount++;
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/participant/dashboard');

    return {
      success: true,
      count: createdCount,
      message: `Berhasil membuat ${createdCount} sertifikat baru.`,
    };
  } catch (error: any) {
    console.error('Generate Certificates Error:', error);
    return {
      success: false,
      error: error.message || 'Gagal memproses sertifikat.',
    };
  }
}

/**
 * Fetch detailed certificate information by ID
 */
export async function getCertificateById(id: string) {
  try {
    const cert = await prisma.certificate.findUnique({
      where: { id },
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
            slug: true,
            startDate: true,
            endDate: true,
            location: true,
          },
        },
        registration: {
          select: {
            registrationNumber: true,
            createdAt: true,
          },
        },
      },
    });

    return cert;
  } catch (error) {
    console.error('Get Certificate By ID Error:', error);
    return null;
  }
}

/**
 * Update certificate download time
 */
export async function updateDownloadTime(id: string) {
  try {
    await prisma.certificate.update({
      where: { id },
      data: {
        downloadTime: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error('Update Download Time Error:', error);
    return { success: false };
  }
}

/**
 * Get completed events with certificate statistics
 */
export async function getCompletedEventsWithCertStats() {
  try {
    await verifyPermission('certificates.read');

    const completedEvents = await prisma.event.findMany({
      where: {
        status: EventStatus.COMPLETED,
        certificateEnabled: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        _count: {
          select: {
            certificates: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    // For each completed event, get the count of checked-in registrations
    const eventsWithStats = await Promise.all(
      completedEvents.map(async (event) => {
        const checkedInCount = await prisma.registration.count({
          where: {
            eventId: event.id,
            status: RegistrationStatus.CHECKED_IN,
          },
        });

        return {
          id: event.id,
          title: event.title,
          slug: event.slug,
          startDate: event.startDate,
          issuedCertificates: event._count.certificates,
          checkedInParticipants: checkedInCount,
        };
      })
    );

    return {
      success: true,
      data: eventsWithStats,
    };
  } catch (error: any) {
    console.error('Get Completed Events Cert Stats Error:', error);
    return {
      success: false,
      error: error.message || 'Gagal mengambil statistik event.',
    };
  }
}

// ─── Certificate Template ────────────────────────────────────────────────────

export type CertTemplateUpsertInput = {
  backgroundUrl?: string | null;
  numberTemplate?: string;
  numberMode?: CertNumberMode;
  showIssuedDate?: boolean;
};

export type SignatureInput = {
  name: string;
  title?: string;
  signatureUrl: string;
  order?: number;
};

/**
 * Get certificate template (with signatures) by eventId
 */
export async function getCertificateTemplate(eventId: string) {
  try {
    const template = await prisma.certificateTemplate.findUnique({
      where: { eventId },
      include: {
        signatures: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return { success: true, data: template };
  } catch (error: any) {
    console.error('Get Certificate Template Error:', error);
    return { success: false, error: error.message || 'Gagal mengambil template sertifikat.' };
  }
}

/**
 * Create or update certificate template for an event
 */
export async function upsertCertificateTemplate(eventId: string, input: CertTemplateUpsertInput) {
  try {
    await verifyPermission('certificates.create');

    const template = await prisma.certificateTemplate.upsert({
      where: { eventId },
      update: {
        backgroundUrl: input.backgroundUrl,
        numberTemplate: input.numberTemplate ?? 'CERT/{SLUG}/{REG_NO}',
        numberMode: input.numberMode ?? CertNumberMode.AUTO,
        showIssuedDate: input.showIssuedDate ?? true,
      },
      create: {
        eventId,
        backgroundUrl: input.backgroundUrl,
        numberTemplate: input.numberTemplate ?? 'CERT/{SLUG}/{REG_NO}',
        numberMode: input.numberMode ?? CertNumberMode.AUTO,
        showIssuedDate: input.showIssuedDate ?? true,
      },
      include: {
        signatures: {
          orderBy: { order: 'asc' },
        },
      },
    });

    revalidatePath(BASE_PATH);

    return { success: true, data: template, message: 'Template sertifikat berhasil disimpan.' };
  } catch (error: any) {
    console.error('Upsert Certificate Template Error:', error);
    return { success: false, error: error.message || 'Gagal menyimpan template sertifikat.' };
  }
}

/**
 * Add an e-signature entry to a template
 */
export async function addSignature(templateId: string, input: SignatureInput) {
  try {
    await verifyPermission('certificates.create');

    // Get current max order
    const maxOrderResult = await prisma.certificateSignature.findFirst({
      where: { templateId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const nextOrder = (maxOrderResult?.order ?? -1) + 1;

    const signature = await prisma.certificateSignature.create({
      data: {
        templateId,
        name: input.name,
        title: input.title,
        signatureUrl: input.signatureUrl,
        order: input.order ?? nextOrder,
      },
    });

    revalidatePath(BASE_PATH);

    return { success: true, data: signature, message: 'TTD berhasil ditambahkan.' };
  } catch (error: any) {
    console.error('Add Signature Error:', error);
    return { success: false, error: error.message || 'Gagal menambahkan TTD.' };
  }
}

/**
 * Update an existing signature
 */
export async function updateSignature(signatureId: string, input: Partial<SignatureInput>) {
  try {
    await verifyPermission('certificates.create');

    const signature = await prisma.certificateSignature.update({
      where: { id: signatureId },
      data: {
        name: input.name,
        title: input.title,
        signatureUrl: input.signatureUrl,
        order: input.order,
      },
    });

    revalidatePath(BASE_PATH);

    return { success: true, data: signature, message: 'TTD berhasil diperbarui.' };
  } catch (error: any) {
    console.error('Update Signature Error:', error);
    return { success: false, error: error.message || 'Gagal memperbarui TTD.' };
  }
}

/**
 * Delete a signature by ID
 */
export async function deleteSignature(signatureId: string) {
  try {
    await verifyPermission('certificates.create');

    await prisma.certificateSignature.delete({
      where: { id: signatureId },
    });

    revalidatePath(BASE_PATH);

    return { success: true, message: 'TTD berhasil dihapus.' };
  } catch (error: any) {
    console.error('Delete Signature Error:', error);
    return { success: false, error: error.message || 'Gagal menghapus TTD.' };
  }
}

/**
 * Reorder signatures for a template
 */
export async function reorderSignatures(orderedIds: string[]) {
  try {
    await verifyPermission('certificates.create');

    await Promise.all(
      orderedIds.map((id, index) =>
        prisma.certificateSignature.update({
          where: { id },
          data: { order: index },
        })
      )
    );

    revalidatePath(BASE_PATH);

    return { success: true, message: 'Urutan TTD berhasil diperbarui.' };
  } catch (error: any) {
    console.error('Reorder Signatures Error:', error);
    return { success: false, error: error.message || 'Gagal mengubah urutan TTD.' };
  }
}

/**
 * Get all events that have certificates enabled (for template setup)
 */
export async function getEventsWithCertificateEnabled() {
  try {
    await verifyPermission('certificates.read');

    const events = await prisma.event.findMany({
      where: {
        certificateEnabled: true,
        deletedAt: null,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        startDate: true,
        certificateTemplate: {
          select: {
            id: true,
            backgroundUrl: true,
            numberTemplate: true,
            numberMode: true,
            signatures: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return { success: true, data: events };
  } catch (error: any) {
    console.error('Get Events With Cert Enabled Error:', error);
    return { success: false, error: error.message || 'Gagal mengambil data event.' };
  }
}
