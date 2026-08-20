"use client";

import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../services/auth.service";

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: { token: string; password: string }) => resetPassword(input),
  });
}
