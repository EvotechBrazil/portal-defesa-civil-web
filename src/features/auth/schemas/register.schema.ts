import { isPlausibleWhatsapp } from "../lib/whatsapp-rules";
import { z } from "zod";

export const checkWhatsappSchema = z.object({
  whatsapp: z
    .string()
    .refine(isPlausibleWhatsapp, "validation.whatsappImplausivel"),
});

export type CheckWhatsappFormValues = z.infer<typeof checkWhatsappSchema>;

const locationFields = {
  country: z.string().length(2, "validation.country"),
  state: z.string().min(2, "validation.state"),
  city: z.string().min(2, "validation.city"),
  manadaId: z.string().min(1, "validation.manada"),
};

function sameEmail(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export const registerSchema = z
  .object({
    name: z.string().min(2, "validation.name"),
    lgndNumber: z.string().min(1, "validation.lgndNumber"),
    squad: z.string().min(1, "validation.squad"),
    eventoFire: z.string().min(1, "validation.fireEvent"),
    email: z.email("validation.email"),
    confirmEmail: z.email("validation.email"),
    password: z.string().min(8, "validation.password"),
    confirmPassword: z.string().min(8, "validation.password"),
    ...locationFields,
  })
  .refine((values) => sameEmail(values.email, values.confirmEmail), {
    message: "validation.emailConfirm",
    path: ["confirmEmail"],
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "validation.passwordConfirm",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const requestAccessSchema = z
  .object({
    name: z.string().min(2, "validation.name"),
    lgndNumber: z.string().min(1, "validation.lgndNumber"),
    email: z.email("validation.email"),
    confirmEmail: z.email("validation.email"),
    justification: z.string().min(10, "validation.justification"),
    ...locationFields,
  })
  .refine((values) => sameEmail(values.email, values.confirmEmail), {
    message: "validation.emailConfirm",
    path: ["confirmEmail"],
  });

export type RequestAccessFormValues = z.infer<typeof requestAccessSchema>;
