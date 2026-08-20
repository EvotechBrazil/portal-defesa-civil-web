"use client";

import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function BrandMark({
  href,
  compactOnMobile = false,
  markOnly = false,
  priority = false,
  className,
}: {
  href?: string;
  compactOnMobile?: boolean;
  markOnly?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const content = (
    <>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center",
          markOnly
            ? "size-10 rounded-[10px] border border-white/15"
            : "size-[30px] rounded-[8px] md:size-[34px] md:rounded-[9px]",
        )}
        style={{ backgroundColor: BRAND.chip }}
      >
        <Image
          src={BRAND.logo}
          alt=""
          width={34}
          height={34}
          sizes="34px"
          priority={priority}
          className={markOnly ? "size-7" : "size-[22px] md:size-6"}
        />
      </span>
      {markOnly ? (
        <span className="sr-only">{BRAND.short}</span>
      ) : (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="text-sm font-semibold tracking-[0.03em] text-paper md:text-[15px]">
            {BRAND.short}
          </span>
          <span
            className={cn(
              "font-mono text-[8.5px] font-medium tracking-[0.1em] text-mist uppercase md:text-[9.5px] max-[360px]:hidden",
              compactOnMobile && "max-sm:hidden",
            )}
          >
            {BRAND.descriptor}
          </span>
        </span>
      )}
    </>
  );

  const classes = cn("inline-flex items-center gap-2.5", className);

  if (!href) {
    return (
      <p className={classes} aria-label={BRAND.long}>
        {content}
      </p>
    );
  }

  return (
    <Link href={href} className={cn(classes, "cursor-pointer")} aria-label={BRAND.long}>
      {content}
    </Link>
  );
}
