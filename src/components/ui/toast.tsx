"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, CircleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";

export type ToastTone = "ok" | "hard";

export type ToastInput = {
  tone: ToastTone;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

type ToastItem = ToastInput & { id: string };

type ToastContextValue = {
  push: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast precisa do ToastProvider.");
  }
  return value;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, number>>(new Map());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((current) => [...current.slice(-2), { ...toast, id }]);
      if (toast.tone === "ok") {
        const timer = window.setTimeout(() => dismiss(id), 4000);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  const { t } = useI18n();
  if (toasts.length === 0) {
    return null;
  }
  return (
    <div
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col gap-2 md:inset-x-auto md:right-4 md:w-[min(100%-2rem,24rem)]"
    >
      {toasts.map((toast) => {
        const Icon = toast.tone === "ok" ? Check : CircleAlert;
        return (
          <div
            key={toast.id}
            className="ui-toast pointer-events-auto flex items-start gap-3 rounded-panel px-3 py-2 shadow-e2"
            role={toast.tone === "hard" ? "alert" : "status"}
          >
            <Icon
              className={cn("mt-2 size-4 shrink-0", toast.tone === "ok" ? "text-ok" : "text-hard")}
              strokeWidth={2}
              aria-hidden
            />
            <p className="min-w-0 flex-1 py-2 text-sm leading-snug">{toast.message}</p>
            {toast.onAction ? (
              <button
                type="button"
                className="min-h-11 shrink-0 rounded-ctl px-3 text-sm font-semibold text-toast-fg underline-offset-2 hover:underline"
                onClick={() => {
                  toast.onAction?.();
                  onDismiss(toast.id);
                }}
              >
                {toast.actionLabel ?? t("ui.retry")}
              </button>
            ) : null}
            <button
              type="button"
              className="flex size-11 shrink-0 items-center justify-center rounded-ctl text-toast-fg/80 hover:text-toast-fg"
              onClick={() => onDismiss(toast.id)}
              aria-label={t("ui.close")}
            >
              <X className="size-4" strokeWidth={2} aria-hidden />
            </button>
          </div>
        );
      })}
    </div>
  );
}
