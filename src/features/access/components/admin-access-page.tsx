"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatWhatsapp } from "@/features/auth/lib/whatsapp";
import { getApiErrorMessage } from "@/features/auth/services/get-api-error-message";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import {
  useAccessRequests,
  useAddAllowedWhatsapp,
  useAllowedWhatsapps,
  useApproveAccessRequest,
  useRejectAccessRequest,
  useRemoveAllowedWhatsapp,
} from "../hooks/use-admin-access";
import type { AccessRequestStatus, AccessRequestView } from "../types/access.types";

type Tab = "PENDING" | "INTERESTED" | "ALLOWED";

export function AdminAccessPage() {
  const { locale, t } = useI18n();
  const [tab, setTab] = useState<Tab>("PENDING");
  const pending = useAccessRequests("PENDING");
  const interested = useAccessRequests("INTERESTED");
  const allowed = useAllowedWhatsapps();
  const approve = useApproveAccessRequest();
  const reject = useRejectAccessRequest();
  const addAllowed = useAddAllowedWhatsapp();
  const removeAllowed = useRemoveAllowedWhatsapp();
  const [newNumber, setNewNumber] = useState("");
  const [newLabel, setNewLabel] = useState("");

  function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!newNumber.trim()) {
      return;
    }
    addAllowed.mutate(
      { whatsapp: newNumber.trim(), label: newLabel.trim() || undefined },
      {
        onSuccess: () => {
          setNewNumber("");
          setNewLabel("");
        },
      },
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-paper">{t("admin.access.title")}</h1>
        <p className="mt-1 text-sm text-mist">{t("admin.access.description")}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <TabButton active={tab === "PENDING"} onClick={() => setTab("PENDING")}>
          {t("admin.access.requests", { count: pending.data?.length ?? 0 })}
        </TabButton>
        <TabButton active={tab === "INTERESTED"} onClick={() => setTab("INTERESTED")}>
          {t("admin.access.interested", { count: interested.data?.length ?? 0 })}
        </TabButton>
        <TabButton active={tab === "ALLOWED"} onClick={() => setTab("ALLOWED")}>
          {t("admin.access.allowed", { count: allowed.data?.length ?? 0 })}
        </TabButton>
      </div>

      {tab === "PENDING" ? (
        <RequestList
          rows={pending.data}
          isLoading={pending.isLoading}
          empty={t("admin.access.emptyPending")}
          actions={(row) => (
            <div className="flex gap-2">
              <Button
                type="button"
                disabled={approve.isPending}
                onClick={() => approve.mutate(row.id)}
              >
                {t("admin.access.approve")}
              </Button>
              <Button
                type="button"
                className="bg-hard hover:bg-hard/90"
                disabled={reject.isPending}
                onClick={() => reject.mutate(row.id)}
              >
                {t("admin.access.reject")}
              </Button>
            </div>
          )}
        />
      ) : null}

      {tab === "INTERESTED" ? (
        <RequestList
          rows={interested.data}
          isLoading={interested.isLoading}
          empty={t("admin.access.emptyInterested")}
        />
      ) : null}

      {tab === "ALLOWED" ? (
        <Card>
          <form className="mb-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={handleAdd}>
            <Input
              placeholder={t("admin.access.placeholderWhatsapp")}
              value={newNumber}
              onChange={(event) => setNewNumber(event.target.value)}
            />
            <Input
              placeholder={t("admin.access.placeholderName")}
              value={newLabel}
              onChange={(event) => setNewLabel(event.target.value)}
            />
            <Button type="submit" disabled={addAllowed.isPending}>
              {addAllowed.isPending ? t("admin.access.adding") : t("admin.access.add")}
            </Button>
          </form>
          {addAllowed.isError ? (
            <p className="mb-4 text-sm text-red-600">
              {locale === "pt-BR"
                ? getApiErrorMessage(addAllowed.error, t("admin.access.addError"))
                : t("admin.access.addError")}
            </p>
          ) : null}
          {allowed.isLoading ? (
            <p className="text-sm text-mist">{t("common.loading")}</p>
          ) : (allowed.data ?? []).length === 0 ? (
            <p className="text-sm text-mist">{t("admin.access.emptyAllowed")}</p>
          ) : (
            <ul className="divide-y divide-line">
              {(allowed.data ?? []).map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-medium text-paper">{formatWhatsapp(row.whatsapp)}</p>
                    {row.label ? <p className="text-sm text-mist">{row.label}</p> : null}
                  </div>
                  <button
                    type="button"
                    className="text-sm text-hard underline"
                    disabled={removeAllowed.isPending}
                    onClick={() => removeAllowed.mutate(row.id)}
                  >
                    {t("admin.access.remove")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium",
        active ? "bg-flare text-white" : "bg-panel text-mist hover:text-paper",
      )}
    >
      {children}
    </button>
  );
}

function RequestList({
  rows,
  isLoading,
  empty,
  actions,
}: {
  rows: AccessRequestView[] | undefined;
  isLoading: boolean;
  empty: string;
  actions?: (row: AccessRequestView) => React.ReactNode;
}) {
  const { t } = useI18n();
  if (isLoading) {
    return <p className="text-sm text-mist">{t("common.loading")}</p>;
  }
  if (!rows || rows.length === 0) {
    return <p className="text-sm text-mist">{empty}</p>;
  }
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <Card key={row.id}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 text-sm">
              <p className="text-base font-medium text-paper">
                {row.name ?? t("admin.access.noName")} · {formatWhatsapp(row.whatsapp)}
              </p>
              <p className="text-mist">
                {t("register.requestLgnd")} {row.lgndNumber ?? "—"} · {t("register.pack")}{" "}
                {row.manada ?? "—"}
              </p>
              {row.email ? <p className="text-mist">{row.email}</p> : null}
              {row.justification ? (
                <p className="mt-2 text-paper">{row.justification}</p>
              ) : (
                <p className="mt-2 text-mist">{t("admin.access.noJustification")}</p>
              )}
              <StatusBadge status={row.status} />
            </div>
            {actions ? actions(row) : null}
          </div>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: AccessRequestStatus }) {
  const { t } = useI18n();
  return (
    <span className="inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs text-mist dark:bg-white/10">
      {t(`admin.access.status.${status}`)}
    </span>
  );
}
