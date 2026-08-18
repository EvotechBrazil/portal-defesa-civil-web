export interface ApiEnvelope<T> {
  data: T;
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    pageCount?: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  tenantId: string;
}
