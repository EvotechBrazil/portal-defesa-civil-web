"use client";

import { useEffect, useState } from "react";
import { api, getAccessToken, getStoredUser, setStoredUser } from "@/lib/api";
import type { ApiEnvelope, AuthUser } from "@/types/api.types";

export function useAuthUser() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    if (!getAccessToken()) {
      return;
    }
    void api
      .get<ApiEnvelope<AuthUser>>("/me")
      .then((response) => {
        const next = response.data.data;
        setStoredUser(next);
        setUser(next);
      })
      .catch(() => {
        setUser(getStoredUser());
      });
  }, []);

  return user;
}
