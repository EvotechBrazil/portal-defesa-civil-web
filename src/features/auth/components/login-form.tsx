"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function LoginForm() {
  const { locale, t } = useI18n();
  const login = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function handleSubmit(values: LoginFormValues) {
    login.mutate(values);
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-paper">{t("auth.signIn.title")}</h1>
      <p className="mt-1 text-sm text-mist">{t("auth.signIn.description")}</p>

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

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-paper">
            {t("auth.password")}
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-red-600">{t(form.formState.errors.password.message ?? "")}</p>
          ) : null}
          <p className="text-right">
            <Link href="/esqueci-senha" className="text-sm font-medium text-flare underline">
              {t("auth.forgotPassword")}
            </Link>
          </p>
        </div>

        {login.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {locale === "pt-BR"
              ? getApiErrorMessage(login.error, t("auth.signIn.error"))
              : t("auth.signIn.error")}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? t("auth.signIn.pending") : t("auth.signIn.title")}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-mist">
        {t("auth.noAccount")}{" "}
        <Link href="/registro" className="font-medium text-flare underline">
          {t("auth.requestRegistration")}
        </Link>
      </p>
    </Card>
  );
}
