import { EventStatus, EventType } from '@/generated/prisma/enums';
import type { EventCategory } from './event-categories';

export interface EventSpeaker {
  id?: string;
  name?: string | null;
  title?: string | null;
  company?: string | null;
  companyUrl?: string | null;
  github?: string | null;
  instagram?: string | null;
  linkedIn?: string | null;
  avatar?: string | null;
  order?: number;
}

export interface EventBenefit {
  id?: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  order?: number;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner?: string | null;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  meetingLink?: string | null;
  eventType: EventType;
  onlineAttendance?: boolean;
  registrationDeadline: Date;
  quota: number;
  price: number;
  status: EventStatus;
  certificateEnabled: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  createdById?: string | null;
  categoryId?: string | null;
  category?: EventCategory | null;
  speakers?: EventSpeaker[];
  benefits?: EventBenefit[];
  _count?: {
    registrations: number;
  };
}

export interface EventResponse {
  success: boolean;
  data?: Event;
  error?: string;
  message?: string;
}

export interface EventPaginationResponse {
  success: boolean;
  data: Event[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}

export interface EventSearchResult {
  id: string;
  title: string;
  slug: string;
  banner: string | null;
  startDate: string;
  eventType: EventType;
}

export interface EventSearchResponse {
  data: EventSearchResult[];
}
