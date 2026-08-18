"use client";

import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "../services/auth.service";

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
  });
}
