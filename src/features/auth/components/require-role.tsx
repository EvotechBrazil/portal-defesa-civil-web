"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useI18n } from "@/i18n/i18n-provider";
import { hasAtLeast } from "@/lib/authz";
import type { Role } from "@/types/api.types";

/**
 * Regua de papel para uma area da UI.
 *
 * Isto e UX, nao fronteira de seguranca: a autoridade real e o RolesGuard da
 * API, que responde 403. Serve para nao mostrar menu e tela que o usuario nao
 * pode usar — nenhum dado chega aqui sem a API liberar.
 */
export function RequireRole({
  min,
  children,
}: {
  min: Role;
  children: ReactNode;
}) {
  const { user, isLoading } = useAuthUser();
  const router = useRouter();
  const { t } = useI18n();
  const allowed = user != null && hasAtLeast(user.role, min);

  useEffect(() => {
    if (!isLoading && !allowed) {
      router.replace("/estudar");
    }
  }, [isLoading, allowed, router]);

  if (isLoading) {
    return <p className="px-4 py-8 text-sm text-mist">{t("common.loading")}</p>;
  }
  if (!allowed) {
    return null;
  }
  return <>{children}</>;
}
