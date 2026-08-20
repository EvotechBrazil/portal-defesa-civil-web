import { z } from "zod";

export const checkWhatsappSchema = z.object({
  whatsapp: z.string().min(10, "validation.whatsapp"),
});

export type CheckWhatsappFormValues = z.infer<typeof checkWhatsappSchema>;

const locationFields = {
  country: z.string().length(2, "validation.country"),
  state: z.string().min(2, "validation.state"),
  city: z.string().min(2, "validation.city"),
  manadaId: z.string().min(1, "validation.manada"),
};

export const registerSchema = z.object({
  name: z.string().min(2, "validation.name"),
  lgndNumber: z.string().min(1, "validation.lgndNumber"),
  squad: z.string().min(1, "validation.squad"),
  eventoFire: z.string().min(1, "validation.fireEvent"),
  email: z.email("validation.email"),
  password: z.string().min(8, "validation.password"),
  ...locationFields,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const requestAccessSchema = z.object({
  name: z.string().min(2, "validation.name"),
  lgndNumber: z.string().min(1, "validation.lgndNumber"),
  email: z.email("validation.email"),
  justification: z.string().min(10, "validation.justification"),
  ...locationFields,
});

export type RequestAccessFormValues = z.infer<typeof requestAccessSchema>;
