import type { AuthUser } from "@/types/api.types";

export type WhatsappCheckStatus =
  | "ALLOWED"
  | "NOT_ALLOWED"
  | "PENDING"
  | "REJECTED"
  | "REGISTERED";

export interface WhatsappCheckResult {
  status: WhatsappCheckStatus;
  whatsapp: string;
}

export interface RegisterInput {
  whatsapp: string;
  name: string;
  lgndNumber: string;
  manada: string;
  city: string;
  squad: string;
  eventoFire: string;
  email: string;
  password: string;
  photoBase64?: string;
}

export interface RegisterResult {
  id: string;
  email: string;
  name: string;
}

export interface AccessRequestInput {
  whatsapp: string;
  name: string;
  lgndNumber: string;
  manada: string;
  email: string;
  justification: string;
}

export interface AccessRequestResult {
  id: string;
  status: "INTERESTED" | "PENDING" | "APPROVED" | "REJECTED";
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface VerifyEmailResult {
  verified: boolean;
}
