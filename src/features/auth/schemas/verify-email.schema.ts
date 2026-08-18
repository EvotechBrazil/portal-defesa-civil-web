import { z } from "zod";

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Informe o token de verificação"),
});

export const resendVerificationSchema = z.object({
  email: z.email("Informe um e-mail válido"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;
