"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export function BrandMark({
  href,
  compactOnMobile = false,
  className,
}: {
  href?: string;
  compactOnMobile?: boolean;
  className?: string;
}) {
  const { t } = useI18n();
  const content = (
    <>
      <span
        className={cn(
          "text-[10px] font-medium uppercase tracking-wider text-mist",
          compactOnMobile ? "hidden sm:block" : "block",
        )}
      >
        {t("brand.program")}
      </span>
      <span className="text-sm font-semibold tracking-tight text-flare">
        {t("brand.short")}
      </span>
    </>
  );

  if (!href) {
    return (
      <p className={cn("leading-tight", className)} aria-label={t("brand.name")}>
        {content}
      </p>
    );
  }

  return (
    <Link
      href={href}
      className={cn("shrink-0 cursor-pointer leading-tight", className)}
      aria-label={t("brand.name")}
    >
      {content}
    </Link>
  );
}
