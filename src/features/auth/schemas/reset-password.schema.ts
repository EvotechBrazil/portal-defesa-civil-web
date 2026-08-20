import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "validation.password"),
    confirmPassword: z.string().min(8, "validation.password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "validation.passwordConfirm",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
