"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { useResetPassword } from "../hooks/use-reset-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password.schema";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function ResetPasswordForm() {
  const { locale, t } = useI18n();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const reset = useResetPassword();
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const missingToken = token.length === 0;

  function handleSubmit(values: ResetPasswordFormValues) {
    reset.mutate({ token, password: values.password });
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-paper">{t("auth.reset.title")}</h1>
      <p className="mt-1 text-sm text-mist">{t("auth.reset.description")}</p>

      {reset.isSuccess ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-ctl bg-ok-surf px-3 py-2 text-sm text-ok">
            {t("auth.reset.success")}
          </p>
          <Link
            href="/login"
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-ctl bg-primary px-4 py-2 text-sm font-medium text-primary-ink"
          >
            {t("auth.reset.goLogin")}
          </Link>
        </div>
      ) : missingToken ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-ctl bg-hard-surf px-3 py-2 text-sm text-hard">
            {t("auth.reset.invalid")}
          </p>
          <p className="text-center text-sm text-mist">
            <Link href="/esqueci-senha" className="font-medium text-flare-ink underline">
              {t("auth.reset.requestNew")}
            </Link>
          </p>
        </div>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-paper">
              {t("auth.reset.password")}
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-hard">
                {t(form.formState.errors.password.message ?? "")}
              </p>
            ) : null}
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-paper">
              {t("auth.reset.confirmPassword")}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword ? (
              <p className="text-sm text-hard">
                {t(form.formState.errors.confirmPassword.message ?? "")}
              </p>
            ) : null}
          </div>

          {reset.isError ? (
            <div className="space-y-2">
              <p className="rounded-ctl bg-hard-surf px-3 py-2 text-sm text-hard">
                {locale === "pt-BR"
                  ? getApiErrorMessage(reset.error, t("auth.reset.invalid"))
                  : t("auth.reset.invalid")}
              </p>
              <p className="text-center text-sm text-mist">
                <Link href="/esqueci-senha" className="font-medium text-flare-ink underline">
                  {t("auth.reset.requestNew")}
                </Link>
              </p>
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={reset.isPending}>
            {reset.isPending ? t("auth.reset.pending") : t("auth.reset.submit")}
          </Button>
        </form>
      )}

      {!reset.isSuccess ? (
        <p className="mt-4 text-center text-sm text-mist">
          <Link href="/login" className="font-medium text-flare-ink underline">
            {t("auth.reset.backLogin")}
          </Link>
        </p>
      ) : null}
    </Card>
  );
}
