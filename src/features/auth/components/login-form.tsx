"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/i18n-provider";
import { useLogin } from "../hooks/use-login";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

export function LoginForm({ registered = false }: { registered?: boolean }) {
  const { t } = useI18n();
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
      {registered ? (
        <Banner tone="ok" className="mt-4">
          {t("auth.signIn.registered")}
        </Banner>
      ) : null}

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
            <p className="text-sm text-hard">{t(form.formState.errors.email.message ?? "")}</p>
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
            <p className="text-sm text-hard">{t(form.formState.errors.password.message ?? "")}</p>
          ) : null}
          <p className="text-right">
            <Link href="/esqueci-senha" className="text-sm font-medium text-flare-ink underline">
              {t("auth.forgotPassword")}
            </Link>
          </p>
        </div>

        {login.isError ? (
          <p className="rounded-ctl bg-hard-surf px-3 py-2 text-sm text-hard">
            {t("auth.signIn.genericError")}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? t("auth.signIn.pending") : t("auth.signIn.title")}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm">
        <Link href="/verificar-email" className="font-medium text-flare-ink underline">
          {t("auth.resendVerification")}
        </Link>
      </p>

      <p className="mt-4 text-center text-sm text-mist">
        {t("auth.noAccount")}{" "}
        <Link href="/registro" className="font-medium text-flare-ink underline">
          {t("auth.requestAccessCta")}
        </Link>
      </p>
    </Card>
  );
}
