"use client";

import { useQuery } from "@tanstack/react-query";
import { api, getAccessToken, getStoredUser, setStoredUser } from "@/lib/api";
import type { ApiEnvelope, AuthUser } from "@/types/api.types";

export const AUTH_ME_QUERY_KEY = ["auth", "me"] as const;

async function fetchMe(): Promise<AuthUser> {
  const response = await api.get<ApiEnvelope<AuthUser>>("/me");
  setStoredUser(response.data.data);
  return response.data.data;
}

/**
 * Sessao do usuario logado.
 *
 * Em React Query, e nao useState+useEffect, por tres motivos: (1) o hook era
 * chamado por varios componentes e disparava um GET /me por chamada; (2) ele
 * devolvia `null` tanto para "carregando" quanto para "deslogado", e essa
 * ambiguidade impedia qualquer guard de layout de decidir sem piscar;
 * (3) agora um `invalidateQueries(["auth"])` propaga papel novo apos promocao.
 */
export function useAuthUser(): { user: AuthUser | null; isLoading: boolean } {
  const hasToken = typeof window !== "undefined" && Boolean(getAccessToken());
  const stored = typeof window !== "undefined" ? getStoredUser() : null;

  const query = useQuery({
    queryKey: AUTH_ME_QUERY_KEY,
    queryFn: fetchMe,
    enabled: hasToken,
    initialData: stored ?? undefined,
  });

  return {
    user: query.data ?? null,
    // Sem token nao ha o que carregar: e "deslogado", nao "carregando".
    isLoading: hasToken && query.isLoading,
  };
}
