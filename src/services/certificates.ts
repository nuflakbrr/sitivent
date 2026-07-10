'use server';

import { prisma } from '@/lib/prisma';
import { verifyPermission } from './security';
import { EventStatus, RegistrationStatus, CertNumberMode } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import type {
  CertificateTemplateAppearance,
  CertificateTemplateHeader,
  CertificateTemplateNumbering,
} from '@/interfaces/features/certificates';

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
  search: string = '',
  eventId?: string
): Promise<CertificatePaginationResponse> {
  try {
    await verifyPermission('certificates.read');

    const skip = (page - 1) * limit;

    const whereClause: any = {
      event: {
        certificateEnabled: true,
        deletedAt: null,
      },
    };

    // Add search condition if search is provided
    if (search) {
      whereClause.OR = [
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
      ];
    }

    // Add eventId condition if eventId is provided
    if (eventId) {
      whereClause.eventId = eventId;
    }

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
  } catch (error: unknown) {
    console.error('Get Certificates Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Gagal mengambil data sertifikat.';
    return {
      success: false,
      error: errorMessage,
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
      // Delete existing certificates if the feature is disabled
      const deleted = await prisma.certificate.deleteMany({
        where: { eventId },
      });
      revalidatePath(BASE_PATH);
      revalidatePath('/participant/dashboard');
      return {
        success: true,
        count: 0,
        message: `Fitur dinonaktifkan. Semua sertifikat (${deleted.count}) untuk event ini telah dihapus.`,
      };
    }

    // Find all checked-in registrations ordered by creation date
    const registrations = await prisma.registration.findMany({
      where: {
        eventId,
        status: RegistrationStatus.CHECKED_IN,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: true,
        certificates: true,
      },
    });

    if (registrations.length === 0) {
      return {
        success: true,
        count: 0,
        message: 'Tidak ada peserta check-in yang memenuhi syarat.',
      };
    }

    // Load template configuration for numbering format
    const template = await prisma.certificateTemplate.findUnique({
      where: { eventId },
    });

    const formatTemplate = template?.numberTemplate ?? 'CERT/{SLUG}/{REG_NO}';
    let createdCount = 0;
    let updatedCount = 0;

    // Helper function to resolve number templates
    const resolveNumber = (pattern: string, reg: any, seqIdx: number) => {
      const now = new Date();
      const year = now.getFullYear().toString();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const slug = event.slug.toUpperCase();
      const seq = seqIdx.toString().padStart(3, '0');
      const rand = crypto.randomBytes
        ? crypto.randomBytes(2).toString('hex').toUpperCase()
        : Math.random().toString(36).substring(2, 6).toUpperCase();

      return pattern
        .replace(/\{SLUG\}/g, slug)
        .replace(/\{REG_NO\}/g, reg.registrationNumber)
        .replace(/\{YEAR\}/g, year)
        .replace(/\{MONTH\}/g, month)
        .replace(/\{DAY\}/g, day)
        .replace(/\{SEQ\}/g, seq)
        .replace(/\{EVENT_ID\}/g, event.id)
        .replace(/\{REG_ID\}/g, reg.id)
        .replace(/\{RAND\}/g, rand);
    };

    // Generate/Update certificate for each registration
    for (let i = 0; i < registrations.length; i++) {
      const reg = registrations[i];
      const seqIndex = i + 1;
      const certificateNumber = resolveNumber(formatTemplate, reg, seqIndex);
      const existing = reg.certificates[0] || null;

      if (existing) {
        // Update if format has changed or if template background changed
        const currentBgUrl = template?.backgroundUrl || event.banner || '';
        if (
          existing.certificateNumber !== certificateNumber ||
          existing.templateUrl !== currentBgUrl
        ) {
          await prisma.certificate.update({
            where: { id: existing.id },
            data: {
              certificateNumber,
              templateUrl: currentBgUrl,
              downloadTime: null, // Reset download status so participant must re-download
            },
          });
          updatedCount++;
        }
      } else {
        // Double check uniqueness of certificateNumber
        const duplicate = await prisma.certificate.findFirst({
          where: { certificateNumber },
        });
        if (duplicate) continue;

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
            templateUrl: template?.backgroundUrl || event.banner || '',
            pdfUrl: `/certificates/${certId}`,
            downloadUrl: `/certificates/${certId}`,
          },
        });

        createdCount++;
      }
    }

    revalidatePath(BASE_PATH);
    revalidatePath('/participant/dashboard');

    return {
      success: true,
      count: createdCount + updatedCount,
      message: `Berhasil memproses sertifikat: ${createdCount} baru dibuat, ${updatedCount} diperbarui.`,
    };
  } catch (error: unknown) {
    console.error('Generate Certificates Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal memproses sertifikat.';
    return {
      success: false,
      error: errorMessage,
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
          include: {
            certificateTemplate: {
              include: {
                signatures: {
                  orderBy: { order: 'asc' },
                },
              },
            },
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

    if (cert && !cert.event.certificateEnabled) {
      return null;
    }

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
  } catch (error: unknown) {
    console.error('Get Completed Events Cert Stats Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Gagal mengambil statistik event.';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// ─── Certificate Template ────────────────────────────────────────────────────

export type CertTemplateUpsertInput = Partial<
  CertificateTemplateAppearance &
    CertificateTemplateHeader &
    Omit<CertificateTemplateNumbering, 'numberTemplate' | 'numberMode' | 'showIssuedDate'> & {
      numberTemplate?: string;
      numberMode?: CertNumberMode;
      showIssuedDate?: boolean;
    }
>;

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
  } catch (error: unknown) {
    console.error('Get Certificate Template Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Gagal mengambil template sertifikat.';
    return { success: false, error: errorMessage };
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
        titleFont: input.titleFont,
        titleColor: input.titleColor,
        contentFont: input.contentFont,
        contentColor: input.contentColor,
        primaryColor: input.primaryColor,
        showEventDate: input.showEventDate,
        showEventLocation: input.showEventLocation,
        headerText: input.headerText,
        headerSubtitle: input.headerSubtitle,
        headerFont: input.headerFont,
        headerColor: input.headerColor,
        showHeader: input.showHeader,
        footerMarginBottom: input.footerMarginBottom,
      },
      create: {
        eventId,
        backgroundUrl: input.backgroundUrl,
        numberTemplate: input.numberTemplate ?? 'CERT/{SLUG}/{REG_NO}',
        numberMode: input.numberMode ?? CertNumberMode.AUTO,
        showIssuedDate: input.showIssuedDate ?? true,
        titleFont: input.titleFont,
        titleColor: input.titleColor,
        contentFont: input.contentFont,
        contentColor: input.contentColor,
        primaryColor: input.primaryColor,
        showEventDate: input.showEventDate,
        showEventLocation: input.showEventLocation,
        headerText: input.headerText,
        headerSubtitle: input.headerSubtitle,
        headerFont: input.headerFont,
        headerColor: input.headerColor,
        showHeader: input.showHeader,
        footerMarginBottom: input.footerMarginBottom,
      },
      include: {
        signatures: {
          orderBy: { order: 'asc' },
        },
      },
    });

    revalidatePath(BASE_PATH);

    return { success: true, data: template, message: 'Template sertifikat berhasil disimpan.' };
  } catch (error: unknown) {
    console.error('Upsert Certificate Template Error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Gagal menyimpan template sertifikat.';
    return { success: false, error: errorMessage };
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
  } catch (error: unknown) {
    console.error('Add Signature Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan TTD.';
    return { success: false, error: errorMessage };
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
  } catch (error: unknown) {
    console.error('Update Signature Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui TTD.';
    return { success: false, error: errorMessage };
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
  } catch (error: unknown) {
    console.error('Delete Signature Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus TTD.';
    return { success: false, error: errorMessage };
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
  } catch (error: unknown) {
    console.error('Reorder Signatures Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal mengubah urutan TTD.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a certificate
 */
export async function deleteCertificate(id: string) {
  try {
    await verifyPermission('certificates.delete');

    const existing = await prisma.certificate.findUnique({
      where: { id },
    });

    if (!existing) {
      return { success: false, error: 'Sertifikat tidak ditemukan.' };
    }

    await prisma.certificate.delete({
      where: { id },
    });

    revalidatePath(BASE_PATH);

    return { success: true, message: 'Sertifikat berhasil dihapus.' };
  } catch (error: unknown) {
    console.error('Delete Certificate Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus sertifikat.';
    return { success: false, error: errorMessage };
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
        location: true,
        certificateTemplate: {
          select: {
            id: true,
            backgroundUrl: true,
            numberTemplate: true,
            numberMode: true,
            showIssuedDate: true,
            titleFont: true,
            titleColor: true,
            contentFont: true,
            contentColor: true,
            primaryColor: true,
            showEventDate: true,
            showEventLocation: true,
            headerText: true,
            headerSubtitle: true,
            headerFont: true,
            headerColor: true,
            showHeader: true,
            footerMarginBottom: true,
            signatures: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return { success: true, data: events };
  } catch (error: unknown) {
    console.error('Get Events With Cert Enabled Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Gagal mengambil data event.';
    return { success: false, error: errorMessage };
  }
}

/**
 * Synchronize and generate certificates for all events with certificate enabled
 */
export async function generateCertificatesForAllEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { certificateEnabled: true, deletedAt: null },
    });

    let totalCreated = 0;
    for (const event of events) {
      const res = await generateCertificatesForEvent(event.id);
      if (res.success && res.count) {
        totalCreated += res.count;
      }
    }

    return {
      success: true,
      count: totalCreated,
      message: `Berhasil sinkronisasi sertifikat untuk semua event. Total ${totalCreated} sertifikat baru dibuat.`,
    };
  } catch (error: unknown) {
    console.error('Generate All Certificates Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Gagal sinkronisasi seluruh event.',
    };
  }
}

/**
 * Check if current user has certificates.read permission (Admin role)
 */
export async function checkUserIsAdmin() {
  try {
    return await verifyPermission('certificates.read');
  } catch {
    return false;
  }
}
