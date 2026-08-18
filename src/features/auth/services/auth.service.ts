import { api, setSession } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  LoginInput,
  LoginResult,
  RegisterInput,
  RegisterResult,
  VerifyEmailResult,
} from "../types/auth.types";

export async function registerAccount(input: RegisterInput): Promise<RegisterResult> {
  const response = await api.post<ApiEnvelope<RegisterResult>>("/auth/register", input);
  return response.data.data;
}

export async function loginAccount(input: LoginInput): Promise<LoginResult> {
  const response = await api.post<ApiEnvelope<LoginResult>>("/auth/login", input);
  const result = response.data.data;
  setSession(result.accessToken, result.refreshToken);
  return result;
}

export async function verifyEmail(token: string): Promise<VerifyEmailResult> {
  const response = await api.post<ApiEnvelope<VerifyEmailResult>>("/auth/verify-email", {
    token,
  });
  return response.data.data;
}

export async function resendVerification(email: string): Promise<void> {
  await api.post("/auth/resend-verification", { email });
}
