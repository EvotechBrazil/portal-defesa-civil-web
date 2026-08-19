import { z } from "zod";

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "validation.token"),
});

export const resendVerificationSchema = z.object({
  email: z.email("validation.email"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationFormValues = z.infer<typeof resendVerificationSchema>;
