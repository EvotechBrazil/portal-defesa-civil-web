import { isAxiosError } from "axios";

function readMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value;
  }
  if (Array.isArray(value)) {
    const parts = value.filter((item): item is string => typeof item === "string");
    return parts.length > 0 ? parts.join(", ") : null;
  }
  return null;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (!isAxiosError(error)) {
    return fallback;
  }
  const payload = error.response?.data;
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = readMessage(payload.message);
    if (message) {
      return message;
    }
  }
  return fallback;
}
