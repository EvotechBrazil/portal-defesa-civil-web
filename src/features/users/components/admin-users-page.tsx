"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { getApiErrorMessage } from "@/features/auth/services/get-api-error-message";
import { useI18n } from "@/i18n/i18n-provider";
import { canManageRole, hasAtLeast } from "@/lib/authz";
import type { Role } from "@/types/api.types";
import { useAdminUsers, useChangeUserRole } from "../hooks/use-admin-users";
import { PasswordResetAction } from "./password-reset-action";
import { RoleBadge } from "./role-badge";
import { UserRoleSelect } from "./user-role-select";

const PAGE_SIZE = 20;
const ROLE_FILTERS: Array<Role | "ALL"> = [
  "ALL",
  "STUDENT",
  "ADMIN",
  "ADMIN_SENIOR",
  "SUPER_ADMIN",
];

export function AdminUsersPage() {
  const { t } = useI18n();
  const { user } = useAuthUser();
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Qualquer mudanca de filtro reinicia a paginacao: manter a pagina 7 ao
  // trocar o filtro renderiza uma lista vazia sem explicacao.
  useEffect(() => {
    setPage(1);
  }, [debounced, roleFilter]);

  const query = useAdminUsers({
    page,
    pageSize: PAGE_SIZE,
    role: roleFilter === "ALL" ? undefined : roleFilter,
    q: debounced || undefined,
  });
  const changeRole = useChangeUserRole();
  const canChangeRoles = user != null && hasAtLeast(user.role, "ADMIN_SENIOR");
  const meta = query.data?.meta;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-paper">{t("admin.users.title")}</h1>
        <p className="mt-1 text-sm text-mist">
          {canChangeRoles
            ? t("admin.users.description")
            : t("admin.users.readOnlyDescription")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t("admin.users.searchPlaceholder")}
          aria-label={t("admin.users.searchPlaceholder")}
          className="max-w-xs"
        />
        <select
          className="rounded-md border border-line bg-transparent px-2 py-2 text-sm text-paper"
          value={roleFilter}
          aria-label={t("admin.users.filterByRole")}
          onChange={(event) => setRoleFilter(event.target.value as Role | "ALL")}
        >
          {ROLE_FILTERS.map((role) => (
            <option key={role} value={role}>
              {role === "ALL" ? t("admin.users.allRoles") : t(`admin.roles.${role}`)}
            </option>
          ))}
        </select>
      </div>

      {changeRole.isError ? (
        <p className="text-sm text-hard">{getApiErrorMessage(changeRole.error, t("admin.users.changeFailed"))}</p>
      ) : null}

      <Card className="overflow-x-auto p-0">
        {query.isLoading ? (
          <p className="px-4 py-8 text-sm text-mist">{t("common.loading")}</p>
        ) : query.isError ? (
          <p className="px-4 py-8 text-sm text-hard">{getApiErrorMessage(query.error, t("admin.users.loadFailed"))}</p>
        ) : query.data && query.data.items.length === 0 ? (
          <p className="px-4 py-8 text-sm text-mist">{t("admin.users.empty")}</p>
        ) : (
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase text-mist">
              <tr>
                <th className="px-4 py-3">{t("admin.users.colName")}</th>
                <th className="px-4 py-3">{t("admin.users.colRole")}</th>
                <th className="px-4 py-3">{t("admin.users.colManada")}</th>
                <th className="px-4 py-3">{t("admin.users.colActions")}</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.items.map((row) => (
                <tr key={row.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3">
                    <div className="text-paper">{row.name}</div>
                    <div className="text-xs text-mist">{row.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={row.role} />
                  </td>
                  <td className="px-4 py-3 text-mist">{row.manada ?? "—"}</td>
                  <td className="px-4 py-3">
                    {canChangeRoles && user ? (
                      row.id === user.id ? (
                        <span className="text-xs text-mist">{t("admin.users.itsYou")}</span>
                      ) : canManageRole(user.role, row.role) ? (
                        <div className="flex flex-col gap-2">
                          <UserRoleSelect
                            actorRole={user.role}
                            targetRole={row.role}
                            disabled={changeRole.isPending}
                            onConfirm={(role) => changeRole.mutate({ id: row.id, role })}
                          />
                          <PasswordResetAction userId={row.id} userName={row.name} />
                        </div>
                      ) : (
                        <span className="text-xs text-mist">{t("admin.users.notManageable")}</span>
                      )
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {meta && meta.pageCount > 1 ? (
        <div className="flex items-center justify-between text-sm text-mist">
          <Button
            type="button"
            className="bg-transparent text-mist hover:bg-line/40"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            {t("admin.users.previous")}
          </Button>
          <span>{t("admin.users.pageOf", { page: meta.page, total: meta.pageCount })}</span>
          <Button
            type="button"
            className="bg-transparent text-mist hover:bg-line/40"
            disabled={page >= meta.pageCount}
            onClick={() => setPage((current) => current + 1)}
          >
            {t("admin.users.next")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
