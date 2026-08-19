"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      className={cn(
        "inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-line bg-panel text-paper transition duration-200 hover:border-flare/50 hover:text-flare disabled:opacity-60",
        className,
      )}
      aria-label={isDark ? t("theme.light.activate") : t("theme.dark.activate")}
      title={isDark ? t("theme.light") : t("theme.dark")}
    >
      {isDark ? (
        <Sun className="size-5" strokeWidth={1.75} aria-hidden />
      ) : (
        <Moon className="size-5" strokeWidth={1.75} aria-hidden />
      )}
    </button>
  );
}
