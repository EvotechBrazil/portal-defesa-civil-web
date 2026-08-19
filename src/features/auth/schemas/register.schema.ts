import { z } from "zod";

export const checkWhatsappSchema = z.object({
  whatsapp: z.string().min(10, "validation.whatsapp"),
});

export type CheckWhatsappFormValues = z.infer<typeof checkWhatsappSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "validation.name"),
  lgndNumber: z.string().min(1, "validation.lgndNumber"),
  manada: z.string().min(2, "validation.manada"),
  city: z.string().min(2, "validation.city"),
  squad: z.string().min(1, "validation.squad"),
  eventoFire: z.string().min(1, "validation.fireEvent"),
  email: z.email("validation.email"),
  password: z.string().min(8, "validation.password"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const requestAccessSchema = z.object({
  name: z.string().min(2, "validation.name"),
  lgndNumber: z.string().min(1, "validation.lgndNumber"),
  manada: z.string().min(2, "validation.manada"),
  email: z.email("validation.email"),
  justification: z.string().min(10, "validation.justification"),
});

export type RequestAccessFormValues = z.infer<typeof requestAccessSchema>;
