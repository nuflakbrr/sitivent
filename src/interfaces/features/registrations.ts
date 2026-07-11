import { RegistrationStatus } from '@/generated/prisma/enums';

export interface Registration {
  id: string;
  eventId: string;
  userId: string;
  registrationNumber: string;
  qrToken?: string | null;
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  event: {
    id: string;
    title: string;
    price: number;
    startDate: Date;
  };
}

export interface RegistrationResponse {
  success: boolean;
  data?: Registration;
  error?: string;
  message?: string;
}

export interface RegistrationPaginationResponse {
  success: boolean;
  data: Registration[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
