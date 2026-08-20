"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { useResendVerification } from "../hooks/use-resend-verification";
import { useVerifyEmail } from "../hooks/use-verify-email";
import {
  resendVerificationSchema,
  verifyEmailSchema,
  type ResendVerificationFormValues,
  type VerifyEmailFormValues,
} from "../schemas/verify-email.schema";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function VerifyEmailForm() {
  const { locale, t } = useI18n();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") ?? "";
  const emailFromUrl = searchParams.get("email") ?? "";
  const verify = useVerifyEmail();
  const resend = useResendVerification();
  const started = useRef(false);

  const tokenForm = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: tokenFromUrl },
  });
  const resendForm = useForm<ResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: { email: emailFromUrl },
  });

  useEffect(() => {
    if (!tokenFromUrl || started.current) {
      return;
    }
    started.current = true;
    tokenForm.setValue("token", tokenFromUrl);
    verify.mutate(tokenFromUrl);
  }, [tokenFromUrl, tokenForm, verify]);

  const isVerified = verify.isSuccess && verify.data.verified;

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-paper">{t("auth.verify.title")}</h1>
      <p className="mt-1 text-sm text-mist">
        {emailFromUrl
          ? t("auth.verify.sent", { email: emailFromUrl })
          : t("auth.verify.instructions")}
      </p>

      {isVerified ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-md bg-ok-surf px-3 py-2 text-sm text-ok">
            {t("auth.verify.success")}
          </p>
          <Link
            href="/login"
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-ctl bg-paper px-4 py-2 text-sm font-medium text-ink transition hover:bg-paper/90"
          >
            {t("auth.verify.goLogin")}
          </Link>
        </div>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={tokenForm.handleSubmit((values) => verify.mutate(values.token))}
          noValidate
        >
          <div className="space-y-1">
            <label htmlFor="token" className="text-sm font-medium text-paper">
              {t("auth.verify.token")}
            </label>
            <Input id="token" autoComplete="off" {...tokenForm.register("token")} />
            {tokenForm.formState.errors.token ? (
              <p className="text-sm text-hard">{t(tokenForm.formState.errors.token.message ?? "")}</p>
            ) : null}
          </div>

          {verify.isError ? (
            <p className="rounded-md bg-hard-surf px-3 py-2 text-sm text-hard">
              {locale === "pt-BR"
                ? getApiErrorMessage(verify.error, t("auth.verify.invalid"))
                : t("auth.verify.invalid")}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={verify.isPending}>
            {verify.isPending ? t("auth.verify.pending") : t("auth.verify.action")}
          </Button>
        </form>
      )}

      {!isVerified ? (
        <form
          className="mt-8 space-y-3 border-t border-line pt-6"
          onSubmit={resendForm.handleSubmit((values) => resend.mutate(values.email))}
          noValidate
        >
          <p className="text-sm text-mist">{t("auth.verify.resendPrompt")}</p>
          <div className="space-y-1">
            <label htmlFor="resend-email" className="text-sm font-medium text-paper">
              {t("auth.email")}
            </label>
            <Input
              id="resend-email"
              type="email"
              autoComplete="email"
              {...resendForm.register("email")}
            />
            {resendForm.formState.errors.email ? (
              <p className="text-sm text-hard">{t(resendForm.formState.errors.email.message ?? "")}</p>
            ) : null}
          </div>
          {resend.isSuccess ? (
            <p className="text-sm text-ok">
              {t("auth.verify.resendSuccess")}
            </p>
          ) : null}
          {resend.isError ? (
            <p className="text-sm text-hard">
              {locale === "pt-BR"
                ? getApiErrorMessage(resend.error, t("auth.verify.resendError"))
                : t("auth.verify.resendError")}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={resend.isPending}>
            {resend.isPending ? t("auth.verify.resending") : t("auth.verify.resend")}
          </Button>
        </form>
      ) : null}

      <p className="mt-4 text-center text-sm text-mist">
        <Link href="/login" className="font-medium text-paper underline">
          {t("auth.verify.backLogin")}
        </Link>
      </p>
    </Card>
  );
}
