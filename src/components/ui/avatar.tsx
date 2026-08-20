"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const SIZES = {
  28: "size-7 text-[10px]",
  36: "size-9 text-xs",
  44: "size-11 text-sm",
} as const;

export type AvatarSize = keyof typeof SIZES;

function initialsFromName(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function Avatar({
  name,
  src,
  alt,
  size = 44,
  decorative = false,
  className,
}: {
  name: string;
  src?: string | null;
  alt?: string;
  size?: AvatarSize;
  decorative?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = initialsFromName(name);
  const showPhoto = Boolean(src) && !failed;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-inset font-semibold text-paper",
        SIZES[size],
        className,
      )}
      aria-hidden={decorative || undefined}
      role={!decorative && !showPhoto ? "img" : undefined}
      aria-label={!decorative && !showPhoto ? name : undefined}
    >
      {showPhoto ? (
        // Foto de cadastro pode ser data-URL; next/image não cabe aqui.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src ?? ""}
          alt={decorative ? "" : (alt ?? name)}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </span>
  );
}

export function AvatarLockup({
  name,
  src,
  roleLabel,
  size = 44,
  className,
}: {
  name: string;
  src?: string | null;
  roleLabel?: string;
  size?: AvatarSize;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      <Avatar name={name} src={src} size={size} decorative />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-paper">{name}</p>
        {roleLabel ? (
          <p className="font-mono text-micro font-medium uppercase tracking-[0.14em] text-mist">
            {roleLabel}
          </p>
        ) : null}
      </div>
    </div>
  );
}
