import type { AuthUser } from "@/types/api.types";

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
}

export interface RegisterResult {
  id: string;
  email: string;
  name: string;
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
