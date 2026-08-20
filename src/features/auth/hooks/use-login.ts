"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { isOnboardingPending } from "../lib/onboarding";
import { loginAccount } from "../services/auth.service";
import type { LoginInput } from "../types/auth.types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (input: LoginInput) => loginAccount(input),
    onSuccess: () => {
      const next = new URLSearchParams(window.location.search).get("next");
      if (next === "/onboarding" || isOnboardingPending()) {
        router.push("/onboarding");
        return;
      }
      router.push("/estudar");
    },
  });
}
