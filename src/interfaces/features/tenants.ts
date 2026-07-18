export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantResponse {
  success: boolean;
  data?: Tenant;
  error?: string;
  message?: string;
}

export interface TenantPaginationResponse {
  success: boolean;
  data: Tenant[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
