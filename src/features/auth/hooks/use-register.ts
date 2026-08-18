"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { registerAccount } from "../services/auth.service";
import type { RegisterInput } from "../types/auth.types";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: RegisterInput) => registerAccount(input),
    onSuccess: (_data, variables) => {
      const params = new URLSearchParams({ email: variables.email });
      router.push(`/verificar-email?${params.toString()}`);
    },
  });
}
