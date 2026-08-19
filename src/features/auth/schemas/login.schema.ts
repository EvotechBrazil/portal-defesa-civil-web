import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("validation.email"),
  password: z.string().min(8, "validation.password"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
