export interface SupportMessage {
  id: string;
  email: string;
  phone: string;
  name: string;
  title: string;
  category: string;
  chronology: string;
  status: string; // "PENDING" | "RESOLVED"
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportMessageInput {
  email: string;
  phone: string;
  name: string;
  title: string;
  category: string;
  chronology: string;
}

export interface SupportMessagesResponse {
  success: boolean;
  data?: SupportMessage[];
  meta?: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}

export interface SupportMessageMutationResponse {
  success: boolean;
  data?: SupportMessage;
  error?: string;
}
