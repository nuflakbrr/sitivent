export interface Gallery {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  featured: boolean;
  eventId: string | null;
  createdAt: string;
  updatedAt: string;
  event?: {
    id: string;
    title: string;
  } | null;
}

export interface CreateGalleryInput {
  title: string;
  description?: string | null;
  imageUrl: string;
  featured?: boolean;
  eventId?: string | null;
}

export interface GalleryResponse {
  success: boolean;
  data?: Gallery;
  error?: string;
  message?: string;
}

export interface GalleryPaginationResponse {
  success: boolean;
  data: Gallery[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}
