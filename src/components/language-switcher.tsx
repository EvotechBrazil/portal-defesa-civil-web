"use client";

import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/i18n-provider";
import { LANGUAGE_OPTIONS } from "@/i18n/translations";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LANGUAGE_OPTIONS.find((option) => option.locale === locale) ?? LANGUAGE_OPTIONS[0];

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("language.current", { language: current.label })}
        title={t("language.selector")}
        className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-line bg-panel px-2.5 text-paper transition duration-200 hover:border-flare/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flare"
      >
        <Image src={current.flag} alt="" width={24} height={16} unoptimized className="h-4 w-6 rounded-[3px] object-cover shadow-sm" />
        <span className="hidden text-xs font-semibold sm:inline">{current.shortLabel}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label={t("language.selector")}
          className="absolute right-0 z-[70] mt-2 min-w-52 overflow-hidden rounded-xl border border-line bg-panel p-1.5 text-paper shadow-2xl"
        >
          {LANGUAGE_OPTIONS.map((option) => {
            const selected = option.locale === locale;
            return (
              <button
                key={option.locale}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  setLocale(option.locale);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition duration-150 hover:bg-black/5 dark:hover:bg-white/10",
                  selected && "bg-flare/10 text-flare",
                )}
              >
                <Image src={option.flag} alt="" width={28} height={19} unoptimized className="h-[19px] w-7 rounded-[3px] object-cover shadow-sm" />
                <span className="flex-1 font-medium">{option.label}</span>
                {selected ? <Check className="size-4" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
