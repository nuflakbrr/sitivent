import { EventStatus, EventType } from '@/generated/prisma/enums';
import type { EventCategory } from './event-categories';

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
  eventType: EventType;
  registrationDeadline: Date;
  quota: number;
  price: number;
  status: EventStatus;
  certificateEnabled: boolean;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  categoryId?: string | null;
  category?: EventCategory | null;
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
