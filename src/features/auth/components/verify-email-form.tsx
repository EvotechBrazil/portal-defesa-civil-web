"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      <h1 className="text-2xl font-semibold text-navy">Verificar e-mail</h1>
      <p className="mt-1 text-sm text-slate-600">
        {emailFromUrl
          ? `Enviamos um link para ${emailFromUrl}. Abra o Mailpit ou cole o token abaixo.`
          : "Cole o token recebido por e-mail ou abra o link da mensagem."}
      </p>

      {isVerified ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            E-mail verificado. Você já pode entrar no portal.
          </p>
          <Link
            href="/login"
            className="inline-flex w-full cursor-pointer items-center justify-center rounded-md bg-navy px-4 py-2 text-sm font-medium text-white transition hover:bg-navy/90"
          >
            Ir para o login
          </Link>
        </div>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={tokenForm.handleSubmit((values) => verify.mutate(values.token))}
          noValidate
        >
          <div className="space-y-1">
            <label htmlFor="token" className="text-sm font-medium text-slate-700">
              Token
            </label>
            <Input id="token" autoComplete="off" {...tokenForm.register("token")} />
            {tokenForm.formState.errors.token ? (
              <p className="text-sm text-red-600">{tokenForm.formState.errors.token.message}</p>
            ) : null}
          </div>

          {verify.isError ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {getApiErrorMessage(verify.error, "Token inválido ou expirado.")}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={verify.isPending}>
            {verify.isPending ? "Verificando..." : "Verificar e-mail"}
          </Button>
        </form>
      )}

      {!isVerified ? (
        <form
          className="mt-8 space-y-3 border-t border-slate-200 pt-6"
          onSubmit={resendForm.handleSubmit((values) => resend.mutate(values.email))}
          noValidate
        >
          <p className="text-sm text-slate-600">Não recebeu o e-mail? Reenvie a verificação.</p>
          <div className="space-y-1">
            <label htmlFor="resend-email" className="text-sm font-medium text-slate-700">
              E-mail
            </label>
            <Input
              id="resend-email"
              type="email"
              autoComplete="email"
              {...resendForm.register("email")}
            />
            {resendForm.formState.errors.email ? (
              <p className="text-sm text-red-600">{resendForm.formState.errors.email.message}</p>
            ) : null}
          </div>
          {resend.isSuccess ? (
            <p className="text-sm text-emerald-700">
              Se o e-mail existir e ainda não estiver verificado, enviamos um novo link.
            </p>
          ) : null}
          {resend.isError ? (
            <p className="text-sm text-red-600">
              {getApiErrorMessage(resend.error, "Não foi possível reenviar agora.")}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={resend.isPending}>
            {resend.isPending ? "Reenviando..." : "Reenviar verificação"}
          </Button>
        </form>
      ) : null}

      <p className="mt-4 text-center text-sm text-slate-600">
        <Link href="/login" className="font-medium text-navy underline">
          Voltar ao login
        </Link>
      </p>
    </Card>
  );
}
