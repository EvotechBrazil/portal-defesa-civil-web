import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-ctl bg-inset motion-safe:animate-pulse", className)}
      aria-hidden
      {...props}
    />
  );
}

/** Forma da carta de estudo — substitui o “Abrindo baralho…” solto. */
export function FlashcardSkeleton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("rounded-card border border-line bg-panel p-6", className)}
      role="status"
      aria-busy="true"
    >
      {children ? <span className="sr-only">{children}</span> : null}
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-8 h-5 w-[88%]" />
      <Skeleton className="mt-3 h-5 w-[64%]" />
      <Skeleton className="mt-3 h-5 w-[72%]" />
      <div className="mt-10 grid grid-cols-2 gap-2">
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2 py-3", className)} aria-hidden>
      <Skeleton className="h-5 w-4/5" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}
