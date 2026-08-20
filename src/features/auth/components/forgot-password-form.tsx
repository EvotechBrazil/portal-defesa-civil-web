"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { useForgotPassword } from "../hooks/use-forgot-password";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "../schemas/forgot-password.schema";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function ForgotPasswordForm() {
  const { locale, t } = useI18n();
  const forgot = useForgotPassword();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function handleSubmit(values: ForgotPasswordFormValues) {
    forgot.mutate(values.email);
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-paper">{t("auth.forgot.title")}</h1>
      <p className="mt-1 text-sm text-mist">{t("auth.forgot.description")}</p>

      {forgot.isSuccess ? (
        <p className="mt-6 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {t("auth.forgot.ack")}
        </p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-paper">
              {t("auth.email")}
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-600">{t(form.formState.errors.email.message ?? "")}</p>
            ) : null}
          </div>

          {forgot.isError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {locale === "pt-BR"
                ? getApiErrorMessage(forgot.error, t("auth.forgot.error"))
                : t("auth.forgot.error")}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={forgot.isPending}>
            {forgot.isPending ? t("auth.forgot.pending") : t("auth.forgot.submit")}
          </Button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-mist">
        <Link href="/login" className="font-medium text-flare underline">
          {t("auth.forgot.backLogin")}
        </Link>
      </p>
    </Card>
  );
}
