export interface Testimonial {
  id: string;
  registrationId: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: {
    name: string | null;
    image: string | null;
    email?: string;
  };
  event?: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface CreateTestimonialInput {
  registrationId: string;
  rating: number;
  comment: string;
}

export interface UpdateTestimonialInput {
  id: string;
  rating: number;
  comment: string;
}

export interface TestimonialResponse {
  success: boolean;
  message?: string;
  data?: Testimonial | null;
}

export interface TestimoniesPaginationResponse {
  success: boolean;
  data: Testimonial[];
  meta: {
    page: number;
    limit: number;
    total: number;
    lastPage: number;
  };
}
