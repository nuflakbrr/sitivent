'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from './security';
import type {
  AdminDashboardStats,
  ParticipantDashboardStats,
} from '@/interfaces/features/dashboard';

export async function getAdminDashboardData(): Promise<AdminDashboardStats | null> {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return null;
    }

    // Parallel queries via prisma.$transaction or Promise.all
    const [
      totalEvents,
      draftEvents,
      publishedEvents,
      closedEvents,
      completedEvents,
      totalRegistrations,
      uniqueParticipantsRes,
      revenueRes,
      checkIns,
      certificates,
    ] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { status: 'DRAFT' } }),
      prisma.event.count({ where: { status: 'PUBLISHED' } }),
      prisma.event.count({ where: { status: 'CLOSED' } }),
      prisma.event.count({ where: { status: 'COMPLETED' } }),
      prisma.registration.count(),
      prisma.registration.groupBy({
        by: ['userId'],
      }),
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          status: 'PAID',
        },
      }),
      prisma.attendance.count({
        where: {
          status: 'SUCCESS',
        },
      }),
      prisma.certificate.count(),
    ]);

    const popularEvents = await prisma.event.findMany({
      take: 5,
      orderBy: {
        registrations: {
          _count: 'desc',
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        quota: true,
        price: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    const recentRegistrations = await prisma.registration.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        registrationNumber: true,
        createdAt: true,
        status: true,
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
        payment: {
          select: {
            status: true,
          },
        },
      },
    });

    return {
      counts: {
        events: {
          total: totalEvents,
          draft: draftEvents,
          published: publishedEvents,
          closed: closedEvents,
          completed: completedEvents,
        },
        registrations: {
          total: totalRegistrations,
          uniqueParticipants: uniqueParticipantsRes.length,
        },
        revenue: revenueRes._sum.amount ?? 0,
        checkIns,
        certificates,
      },
      popularEvents,
      recentRegistrations: recentRegistrations as AdminDashboardStats['recentRegistrations'],
    };
  } catch (error) {
    console.error('Get Admin Dashboard Data Error:', error);
    return null;
  }
}

export async function getParticipantDashboardData(): Promise<ParticipantDashboardStats | null> {
  try {
    const session = await verifySession();
    if (!session || !session.user) {
      return null;
    }

    const userId = session.user.id;

    // Upcoming event: get nearest event starting in the future that user registered for
    const upcomingReg = await prisma.registration.findFirst({
      where: {
        userId,
        event: {
          startDate: {
            gte: new Date(),
          },
        },
        status: {
          in: ['REGISTERED', 'CHECKED_IN'],
        },
      },
      orderBy: {
        event: {
          startDate: 'asc',
        },
      },
      include: {
        event: true,
      },
    });

    const upcomingEvent = upcomingReg
      ? {
          id: upcomingReg.event.id,
          title: upcomingReg.event.title,
          slug: upcomingReg.event.slug,
          description: upcomingReg.event.description,
          banner: upcomingReg.event.banner,
          startDate: upcomingReg.event.startDate,
          endDate: upcomingReg.event.endDate,
          startTime: upcomingReg.event.startTime,
          endTime: upcomingReg.event.endTime,
          location: upcomingReg.event.location,
          eventType: upcomingReg.event.eventType,
          meetingLink: upcomingReg.event.meetingLink,
          qrToken: upcomingReg.qrToken,
          status: upcomingReg.status,
          registrationNumber: upcomingReg.registrationNumber,
        }
      : null;

    // Registration history
    const history = await prisma.registration.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        registrationNumber: true,
        createdAt: true,
        status: true,
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
        attendances: {
          select: {
            status: true,
          },
        },
        certificates: {
          where: {
            event: {
              certificateEnabled: true,
              deletedAt: null,
            },
          },
          select: {
            id: true,
            downloadUrl: true,
          },
        },
      },
    });

    // Summary stats for participant
    const [totalRegistered, totalCheckedIn, totalPendingPayment, pendingTestimonials] =
      await Promise.all([
        prisma.registration.count({ where: { userId } }),
        prisma.registration.count({ where: { userId, status: 'CHECKED_IN' } }),
        prisma.registration.count({ where: { userId, status: 'WAITING_PAYMENT' } }),
        prisma.registration.count({
          where: {
            userId,
            status: 'CHECKED_IN',
            event: { status: 'COMPLETED' },
            testimonial: null,
          },
        }),
      ]);

    return {
      upcomingEvent,
      history: history as ParticipantDashboardStats['history'],
      summary: {
        totalRegistered,
        totalCheckedIn,
        totalPendingPayment,
        pendingTestimonials,
      },
    };
  } catch (error) {
    console.error('Get Participant Dashboard Data Error:', error);
    return null;
  }
}
