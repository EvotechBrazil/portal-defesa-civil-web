"use client";

import type { ReactNode } from "react";
import { RequireRole } from "@/features/auth/components/require-role";

/**
 * Guard unico de /admin/*. Antes, cada page.tsx repetia o mesmo bloco de
 * useAuthUser + useEffect + early return.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <RequireRole min="ADMIN">{children}</RequireRole>;
}
