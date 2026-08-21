import { ReactNode } from "react";
import { Check, CircleAlert, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const TONE = {
  ok: {
    surface: "border-ok bg-ok-surf text-ok",
    icon: Check,
  },
  steel: {
    surface: "border-steel bg-steel-surf text-steel",
    icon: Info,
  },
  learn: {
    surface: "border-learn bg-learn-surf text-learn",
    icon: TriangleAlert,
  },
  hard: {
    surface: "border-hard bg-hard-surf text-hard",
    icon: CircleAlert,
  },
} as const;

export function Banner({
  tone = "ok",
  title,
  children,
  className,
}: {
  tone?: keyof typeof TONE;
  title?: string;
  children?: ReactNode;
  className?: string;
}) {
  const Icon = TONE[tone].icon;
  return (
    <div
      role={tone === "hard" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-ctl border px-4 py-3.5", TONE[tone].surface, className)}
    >
      <Icon className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
      <div className="min-w-0 text-sm leading-snug">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <p className={title ? "mt-0.5" : undefined}>{children}</p> : null}
      </div>
    </div>
  );
}
