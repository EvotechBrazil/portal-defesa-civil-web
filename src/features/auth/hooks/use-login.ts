"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginAccount } from "../services/auth.service";
import type { LoginInput } from "../types/auth.types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => loginAccount(input),
    onSuccess: () => {
      router.push("/biblioteca");
    },
  });
}
