export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    pageCount?: number;
    reason?: string;
    disclaimer?: string;
  };
}

export type Role = "STUDENT" | "ADMIN" | "ADMIN_SENIOR" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId: string;
}
