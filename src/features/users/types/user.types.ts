import type { Role } from "@/types/api.types";

export interface AdminUserView {
  id: string;
  name: string;
  email: string;
  role: Role;
  manada: string | null;
  lgndNumber: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface RoleChangeView {
  id: string;
  event: string;
  actor: { id: string; name: string };
  target: { id: string; name: string };
  fromRole: Role | null;
  toRole: Role | null;
  createdAt: string;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
}

export interface PagedResult<T> {
  items: T[];
  meta: PageMeta;
}

export interface ListUsersQuery {
  page: number;
  pageSize: number;
  role?: Role;
  q?: string;
}
