import { api, clearSession, getRefreshToken, setSession } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api.types";
import type {
  AccessRequestInput,
  AccessRequestResult,
  LoginInput,
  LoginResult,
  RegisterInput,
  RegisterResult,
  VerifyEmailResult,
  WhatsappCheckResult,
} from "../types/auth.types";

export async function checkWhatsapp(whatsapp: string): Promise<WhatsappCheckResult> {
  const response = await api.post<ApiEnvelope<WhatsappCheckResult>>(
    "/auth/check-whatsapp",
    { whatsapp },
  );
  return response.data.data;
}

export async function requestAccess(input: AccessRequestInput): Promise<AccessRequestResult> {
  const response = await api.post<ApiEnvelope<AccessRequestResult>>(
    "/auth/access-requests",
    input,
  );
  return response.data.data;
}

export async function registerAccount(input: RegisterInput): Promise<RegisterResult> {
  const response = await api.post<ApiEnvelope<RegisterResult>>("/auth/register", input);
  return response.data.data;
}

export async function loginAccount(input: LoginInput): Promise<LoginResult> {
  const response = await api.post<ApiEnvelope<LoginResult>>("/auth/login", input);
  const result = response.data.data;
  setSession(result.accessToken, result.refreshToken, result.user);
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

export async function logoutAccount(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await api.post("/auth/logout", { refreshToken });
    }
  } catch {
    // O cookie local cai mesmo se o revoke remoto falhar.
  } finally {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await api.post<ApiEnvelope<{ message: string }>>(
    "/auth/forgot-password",
    { email },
  );
  return response.data.data;
}

export async function resetPassword(input: {
  token: string;
  password: string;
}): Promise<{ reset: true }> {
  const response = await api.post<ApiEnvelope<{ reset: true }>>("/auth/reset-password", input);
  return response.data.data;
}
