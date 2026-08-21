"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerAccount } from "../services/auth.service";
import type { RegisterInput } from "../types/auth.types";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => registerAccount(input),
    onSuccess: (data, variables) => {
      // Quando a conta ja nasce verificada, nenhum e-mail de verificacao foi
      // enviado — mandar para a tela de token seria pedir um codigo que nunca
      // foi gerado. So vai para /verificar-email quem tem o que provar.
      if (data.emailVerified) {
        router.push("/login?cadastro=ok");
        return;
      }
      const params = new URLSearchParams({ email: variables.email });
      router.push(`/verificar-email?${params.toString()}`);
    },
  });
}
