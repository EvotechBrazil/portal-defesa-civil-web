"use client";

import { ReactNode, useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const { t } = useI18n();
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) {
      return;
    }
    if (open) {
      lastFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      if (!node.open) {
        node.showModal();
      }
      titleRef.current?.focus();
      return;
    }
    if (node.open) {
      node.close();
    }
    lastFocus.current?.focus();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={cn("ui-modal", className)}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <h2
        ref={titleRef}
        id={titleId}
        tabIndex={-1}
        className="text-lg font-semibold tracking-tight text-paper outline-none"
      >
        {title}
      </h2>
      <div className="mt-2 text-sm leading-relaxed text-mist">{children}</div>
      {footer ? <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div> : null}
      <button type="button" className="sr-only" onClick={onClose}>
        {t("ui.close")}
      </button>
    </dialog>
  );
}
