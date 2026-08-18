"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegister } from "../hooks/use-register";
import { registerSchema, type RegisterFormValues } from "../schemas/register.schema";
import { getApiErrorMessage } from "../services/get-api-error-message";

export function RegisterForm() {
  const registerAccount = useRegister();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function handleSubmit(values: RegisterFormValues) {
    registerAccount.mutate(values);
  }

  return (
    <Card>
      <h1 className="text-2xl font-semibold text-navy">Criar conta</h1>
      <p className="mt-1 text-sm text-slate-600">
        Cadastro aberto. Você vai receber um e-mail de verificação.
      </p>

      <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(handleSubmit)} noValidate>
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Nome
          </label>
          <Input id="name" autoComplete="name" {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            E-mail
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-slate-700">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {registerAccount.isError ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {getApiErrorMessage(
              registerAccount.error,
              "Não foi possível criar a conta. Tente novamente.",
            )}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={registerAccount.isPending}>
          {registerAccount.isPending ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-slate-600">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-navy underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
