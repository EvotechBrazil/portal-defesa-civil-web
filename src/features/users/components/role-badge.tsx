"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/api.types";

const TONE: Record<Role, string> = {
  STUDENT: "border-line text-mist",
  ADMIN: "border-sky-500/40 text-sky-300",
  ADMIN_SENIOR: "border-amber-500/40 text-amber-300",
  SUPER_ADMIN: "border-rose-500/40 text-rose-300",
};

export function RoleBadge({ role }: { role: Role }) {
  const { t } = useI18n();
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
        TONE[role],
      )}
    >
      {t(`admin.roles.${role}`)}
    </span>
  );
}
