export interface AdminDashboardStats {
  counts: {
    events: {
      total: number;
      draft: number;
      published: number;
      closed: number;
      completed: number;
    };
    registrations: {
      total: number;
      uniqueParticipants: number;
    };
    revenue: number;
    checkIns: number;
    certificates: number;
  };
  popularEvents: Array<{
    id: string;
    title: string;
    slug: string;
    quota: number;
    price: number;
    _count: {
      registrations: number;
    };
  }>;
  recentRegistrations: Array<{
    id: string;
    registrationNumber: string;
    createdAt: Date;
    status: string;
    user: {
      name: string | null;
      email: string;
    };
    event: {
      title: string;
      price: number;
    };
    payment: {
      status: string;
    } | null;
  }>;
}

export interface ParticipantDashboardStats {
  upcomingEvent: {
    id: string;
    title: string;
    slug: string;
    description: string;
    banner: string | null;
    startDate: Date;
    endDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    eventType?: string;
    meetingLink?: string | null;
    qrToken: string | null;
    status: string;
    registrationNumber?: string;
  } | null;
  history: Array<{
    id: string;
    registrationNumber: string;
    createdAt: Date;
    status: string;
    event: {
      id: string;
      title: string;
      slug: string;
      startDate: Date;
      startTime: string;
      endTime: string;
      location: string;
      status: string;
      certificateEnabled: boolean;
      eventType: string;
      meetingLink: string | null;
    };
    attendances: Array<{
      status: string;
    }>;
    certificates: Array<{
      id: string;
      downloadUrl: string;
    }>;
  }>;
  summary: {
    totalRegistered: number;
    totalCheckedIn: number;
    totalPendingPayment: number;
    pendingTestimonials: number;
  };
}
