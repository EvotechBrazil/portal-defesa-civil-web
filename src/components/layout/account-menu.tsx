"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { logoutAccount } from "@/features/auth/services/auth.service";
import { useAuthUser } from "@/features/auth/hooks/use-auth-user";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { user } = useAuthUser();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const name = user?.name ?? t("nav.profile");

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={name}
        className={cn(
          "flex min-h-11 min-w-11 items-center justify-center rounded-ctl transition hover:bg-inset",
          compact ? "w-full" : "gap-2 px-1",
        )}
      >
        <Avatar name={name} size={compact ? 36 : 44} />
        {compact ? null : (
          <span className="hidden max-w-[9rem] truncate text-left text-sm font-medium text-paper sm:block">
            {name}
          </span>
        )}
      </button>
      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute z-50 min-w-44 overflow-hidden rounded-ctl border border-line bg-panel py-1 shadow-e2",
            compact ? "bottom-full left-1/2 mb-2 -translate-x-1/2" : "right-0 top-full mt-2",
          )}
        >
          <Link
            role="menuitem"
            href="/perfil"
            onClick={() => setOpen(false)}
            className="flex min-h-11 items-center gap-2 px-3 text-sm text-paper hover:bg-inset"
          >
            <UserRound className="size-4" strokeWidth={1.75} aria-hidden />
            {t("nav.profile")}
          </Link>
          <button
            type="button"
            role="menuitem"
            className="flex min-h-11 w-full items-center gap-2 px-3 text-left text-sm text-hard hover:bg-inset"
            onClick={() => void logoutAccount()}
          >
            <LogOut className="size-4" strokeWidth={1.75} aria-hidden />
            {t("nav.logout")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
