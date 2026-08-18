import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.email("Informe um e-mail válido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
