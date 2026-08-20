import { api } from "@/lib/api";
import type { ApiEnvelope, Role } from "@/types/api.types";
import type {
  AdminUserView,
  ListUsersQuery,
  PageMeta,
  PagedResult,
  RoleChangeView,
} from "../types/user.types";

const EMPTY_META: PageMeta = { page: 1, pageSize: 20, total: 0, pageCount: 0 };

// Diferente do access.service, estes devolvem `{ items, meta }`: a tela pagina
// de verdade, em vez de pedir pageSize: 100 e fingir que cabe tudo.
export async function listAdminUsers(
  query: ListUsersQuery,
): Promise<PagedResult<AdminUserView>> {
  const response = await api.get<ApiEnvelope<AdminUserView[]>>("/admin/users", {
    params: {
      page: query.page,
      pageSize: query.pageSize,
      role: query.role,
      q: query.q || undefined,
    },
  });
  return {
    items: response.data.data,
    meta: (response.data.meta as PageMeta | undefined) ?? EMPTY_META,
  };
}

export async function issueAdminPasswordReset(userId: string): Promise<{ resetUrl: string }> {
  const response = await api.post<ApiEnvelope<{ resetUrl: string }>>(
    `/admin/users/${userId}/password-reset`,
  );
  return response.data.data;
}

export async function changeUserRole(input: { id: string; role: Role }) {
  const response = await api.patch<ApiEnvelope<AdminUserView>>(
    `/admin/users/${input.id}/role`,
    { role: input.role },
  );
  return response.data.data;
}

export async function listRoleChanges(query: {
  page: number;
  pageSize: number;
}): Promise<PagedResult<RoleChangeView>> {
  const response = await api.get<ApiEnvelope<RoleChangeView[]>>(
    "/admin/role-changes",
    { params: query },
  );
  return {
    items: response.data.data,
    meta: (response.data.meta as PageMeta | undefined) ?? EMPTY_META,
  };
}
