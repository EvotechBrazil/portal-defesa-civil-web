"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/i18n-provider";
import { ASSIGNABLE_ROLES, canAssignRole, canManageRole } from "@/lib/authz";
import type { Role } from "@/types/api.types";

/**
 * Troca de papel de uma linha, em dois passos.
 *
 * Confirmacao inline (e nao window.confirm nem dialog): e o padrao ja usado no
 * admin de acessos, e o kit de UI nao tem primitivo de dialog. Conceder poder e
 * acao sensivel demais para um clique so.
 */
export function UserRoleSelect({
  actorRole,
  targetRole,
  disabled,
  onConfirm,
}: {
  actorRole: Role;
  targetRole: Role;
  disabled: boolean;
  onConfirm: (role: Role) => void;
}) {
  const { t } = useI18n();
  const [pendingRole, setPendingRole] = useState<Role | null>(null);

  // Espelha a regra do servidor para nao oferecer o que a API vai recusar.
  if (!canManageRole(actorRole, targetRole)) {
    return <span className="text-xs text-mist">{t("admin.users.notManageable")}</span>;
  }

  const options = ASSIGNABLE_ROLES.filter(
    (role) => role === targetRole || canAssignRole(actorRole, role),
  );

  if (pendingRole) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-mist">
          {t("admin.users.confirmChange", { role: t(`admin.roles.${pendingRole}`) })}
        </span>
        <Button
          type="button"
          disabled={disabled}
          onClick={() => {
            onConfirm(pendingRole);
            setPendingRole(null);
          }}
        >
          {t("admin.users.confirm")}
        </Button>
        <Button
          type="button"
          className="bg-transparent text-mist hover:bg-line/40"
          onClick={() => setPendingRole(null)}
        >
          {t("admin.users.cancel")}
        </Button>
      </div>
    );
  }

  return (
    <select
      className="rounded-md border border-line bg-transparent px-2 py-1 text-sm text-paper"
      value={targetRole}
      disabled={disabled}
      aria-label={t("admin.users.changeRole")}
      onChange={(event) => {
        const next = event.target.value as Role;
        if (next !== targetRole) {
          setPendingRole(next);
        }
      }}
    >
      {options.map((role) => (
        <option key={role} value={role}>
          {t(`admin.roles.${role}`)}
        </option>
      ))}
    </select>
  );
}
