import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  tone = "ok",
  title,
  children,
  actions,
  className,
}: {
  tone?: "ok" | "hard" | "learn";
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  const surface =
    tone === "hard"
      ? "border-hard bg-hard-surf"
      : tone === "learn"
        ? "border-learn bg-learn-surf"
        : "border-line bg-panel";
  return (
    <div className={cn("rounded-card border px-5 py-8 text-center", surface, className)}>
      <h2 className="text-lg font-semibold text-paper">{title}</h2>
      {children ? (
        <div className="mx-auto mt-2 max-w-[40ch] text-sm leading-relaxed text-mist">{children}</div>
      ) : null}
      {actions ? <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{actions}</div> : null}
    </div>
  );
}
