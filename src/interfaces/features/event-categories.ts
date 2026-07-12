export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    events: number;
  };
}

export interface EventCategoryResponse {
  success: boolean;
  data?: EventCategory;
  error?: string;
  message?: string;
}

export interface EventCategoryPaginationResponse {
  success: boolean;
  data: EventCategory[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
