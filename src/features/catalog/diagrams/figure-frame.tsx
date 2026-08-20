"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";

export function FigureFrame({
  number,
  caption,
  source,
  children,
  className,
}: {
  number: number;
  caption: string;
  source: string;
  children: ReactNode;
  className?: string;
}) {
  const { t } = useI18n();
  return (
    <figure className={cn("my-8 flex flex-col gap-3", className)}>
      <div className="overflow-hidden rounded-card border border-line bg-card p-6">
        {children}
      </div>
      <figcaption className="text-[13.5px] leading-relaxed text-mist">
        <span className="font-semibold text-paper">{t("figure.label", { number })} </span>
        {caption}{" "}
        <span className="font-mono text-xs">{source}</span>
      </figcaption>
    </figure>
  );
}
