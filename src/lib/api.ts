import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const TOKEN_KEY = "pdc_access_token";
const REFRESH_KEY = "pdc_refresh_token";
const AUTH_COOKIE = "pdc_authenticated";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setSession(accessToken: string, refreshToken: string): void {
  window.localStorage.setItem(TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_KEY, refreshToken);
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
}

export function clearSession(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const response = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
    { refreshToken },
  );
  const { accessToken, refreshToken: nextRefresh } = response.data.data;
  setSession(accessToken, nextRefresh);
  return accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    // As rotas de auth respondem 401 por credencial inválida, não por sessão
    // expirada: refresh + redirect aqui apagaria a mensagem de erro do login.
    const isAuthRoute = original?.url?.includes("/auth/") ?? false;
    if (!original || isAuthRoute || error.response?.status !== 401 || original._retry) {
      if (isAuthRoute) {
        return Promise.reject(error);
      }
      if (error.response?.status === 401 && typeof window !== "undefined") {
        clearSession();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
    original._retry = true;
    try {
      // O reset vai no finally da própria promise: zerar depois do await
      // abriria uma janela para um segundo refresh com o token já rotacionado.
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const token = await refreshPromise;
      original.headers.Authorization = `Bearer ${token}`;
      return api(original);
    } catch (refreshError) {
      clearSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(refreshError);
    }
  },
);
