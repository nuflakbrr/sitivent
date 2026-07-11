import { PaymentStatus } from '@/generated/prisma/enums';

export interface Payment {
  id: string;
  registrationId: string;
  amount: number;
  status: PaymentStatus;
  proofUrl?: string | null;
  verifiedAt?: Date | null;
  verifiedById?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  registration: {
    id: string;
    registrationNumber: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
    event: {
      id: string;
      title: string;
      price: number;
    };
  };
  verifiedBy?: {
    id: string;
    name: string | null;
    email: string;
  } | null;
}

export interface PaymentResponse {
  success: boolean;
  data?: Payment;
  error?: string;
  message?: string;
}

export interface PaymentPaginationResponse {
  success: boolean;
  data: Payment[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
