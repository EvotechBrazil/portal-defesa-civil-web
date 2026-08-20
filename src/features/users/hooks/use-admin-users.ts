import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AUTH_ME_QUERY_KEY } from "@/features/auth/hooks/use-auth-user";
import {
  changeUserRole,
  issueAdminPasswordReset,
  listAdminUsers,
  listRoleChanges,
} from "../services/users.service";
import type { ListUsersQuery } from "../types/user.types";

export function useAdminUsers(query: ListUsersQuery) {
  return useQuery({
    queryKey: ["admin", "users", query],
    queryFn: () => listAdminUsers(query),
  });
}

export function useRoleChanges(page: number) {
  return useQuery({
    queryKey: ["admin", "role-changes", page],
    queryFn: () => listRoleChanges({ page, pageSize: 20 }),
  });
}

export function useAdminPasswordReset() {
  return useMutation({
    mutationFn: (userId: string) => issueAdminPasswordReset(userId),
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeUserRole,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "role-changes"] });
      // O ator pode ter mudado o proprio contexto de navegacao indiretamente;
      // e o alvo, se for ele mesmo numa outra aba, precisa do menu atualizado.
      void queryClient.invalidateQueries({ queryKey: AUTH_ME_QUERY_KEY });
    },
  });
}
