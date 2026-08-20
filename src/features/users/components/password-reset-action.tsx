"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/features/auth/services/get-api-error-message";
import { useI18n } from "@/i18n/i18n-provider";
import { useAdminPasswordReset } from "../hooks/use-admin-users";

/**
 * Gera o link de senha em dois passos, e o mostra uma vez.
 *
 * Confirmacao inline (mesmo padrao do UserRoleSelect): assumir a conta de
 * outra pessoa nao pode ser um clique so. Depois de copiar, o URL some do
 * estado — a API nao o devolve de novo.
 */
export function PasswordResetAction({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  const { t } = useI18n();
  const issue = useAdminPasswordReset();
  const [confirming, setConfirming] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function confirm() {
    const result = await issue.mutateAsync(userId);
    setConfirming(false);
    setCopied(false);
    setResetUrl(result.resetUrl);
  }

  async function copyLink() {
    if (!resetUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(resetUrl);
      setCopied(true);
      setResetUrl(null);
    } catch {
      setCopied(false);
    }
  }

  if (copied && !resetUrl) {
    return (
      <div className="mt-2 space-y-2">
        <p className="text-xs text-mist">{t("admin.users.resetLinkCopied")}</p>
        <Button
          type="button"
          className="bg-transparent text-mist hover:bg-line/40"
          onClick={() => setCopied(false)}
        >
          {t("admin.users.dismissLink")}
        </Button>
      </div>
    );
  }

  if (resetUrl) {
    return (
      <div className="mt-2 space-y-2">
        <p className="text-xs text-mist">{t("admin.users.resetLinkHint")}</p>
        <Input readOnly value={resetUrl} aria-label={t("admin.users.copyLink")} />
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => void copyLink()}>
            {t("admin.users.copyLink")}
          </Button>
          <Button
            type="button"
            className="bg-transparent text-mist hover:bg-line/40"
            onClick={() => setResetUrl(null)}
          >
            {t("admin.users.dismissLink")}
          </Button>
        </div>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="mt-2 space-y-2">
        <p className="text-xs text-mist">
          {t("admin.users.confirmReset", { name: userName })}
        </p>
        {issue.isError ? (
          <p className="text-xs text-hard">
            {getApiErrorMessage(issue.error, t("admin.users.resetFailed"))}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={issue.isPending} onClick={() => void confirm()}>
            {t("admin.users.confirm")}
          </Button>
          <Button
            type="button"
            className="bg-transparent text-mist hover:bg-line/40"
            onClick={() => setConfirming(false)}
          >
            {t("admin.users.cancel")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      type="button"
      className="mt-2 bg-transparent px-2 py-1 text-xs text-mist hover:bg-line/40"
      onClick={() => {
        issue.reset();
        setConfirming(true);
      }}
    >
      {t("admin.users.resetPassword")}
    </Button>
  );
}
