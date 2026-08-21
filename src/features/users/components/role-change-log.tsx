"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getApiErrorMessage } from "@/features/auth/services/get-api-error-message";
import { useI18n } from "@/i18n/i18n-provider";
import { useRoleChanges } from "../hooks/use-admin-users";
import { RoleBadge } from "./role-badge";

export function RoleChangeLog() {
  const { formatDate, t } = useI18n();
  const [page, setPage] = useState(1);
  const query = useRoleChanges(page);
  const meta = query.data?.meta;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-paper">{t("admin.audit.title")}</h1>
        <p className="mt-1 text-sm text-mist">{t("admin.audit.description")}</p>
      </div>

      <Card className="overflow-x-auto p-0">
        {query.isLoading ? (
          <p className="px-4 py-8 text-sm text-mist">{t("common.loading")}</p>
        ) : query.isError ? (
          <p className="px-4 py-8 text-sm text-hard">
            {getApiErrorMessage(query.error, t("admin.audit.loadFailed"))}
          </p>
        ) : query.data && query.data.items.length === 0 ? (
          <p className="px-4 py-8 text-sm text-mist">{t("admin.audit.empty")}</p>
        ) : (
          <table className="w-full min-w-[38rem] text-left text-sm">
            <thead className="border-b border-line text-xs uppercase text-mist">
              <tr>
                <th className="px-4 py-3">{t("admin.audit.colWhen")}</th>
                <th className="px-4 py-3">{t("admin.audit.colTarget")}</th>
                <th className="px-4 py-3">{t("admin.audit.colChange")}</th>
                <th className="px-4 py-3">{t("admin.audit.colActor")}</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.items.map((row) => (
                <tr key={row.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3 text-mist">
                    {formatDate(row.createdAt, {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-paper">{row.target.name}</td>
                  <td className="px-4 py-3">
                    {row.fromRole && row.toRole ? (
                      <span className="inline-flex items-center gap-2">
                        <RoleBadge role={row.fromRole} />
                        <span aria-hidden className="text-mist">
                          &rarr;
                        </span>
                        <RoleBadge role={row.toRole} />
                      </span>
                    ) : (
                      <span className="text-paper">
                        {t(`admin.audit.event.${row.event}`)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-mist">{row.actor.name}</td>
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
