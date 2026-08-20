"use client";

import { KeyboardEvent, useId, useRef } from "react";
import { cn } from "@/lib/utils";

export type TabItem<T extends string = string> = {
  id: T;
  label: string;
};

export function Tabs<T extends string>({
  value,
  onChange,
  items,
  ariaLabel,
  className,
}: {
  value: T;
  onChange: (id: T) => void;
  items: Array<TabItem<T>>;
  ariaLabel: string;
  className?: string;
}) {
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key) || items.length === 0) {
      return;
    }
    event.preventDefault();
    const index = items.findIndex((item) => item.id === value);
    const last = items.length - 1;
    let next = index < 0 ? 0 : index;
    if (event.key === "ArrowRight") {
      next = index >= last ? 0 : index + 1;
    } else if (event.key === "ArrowLeft") {
      next = index <= 0 ? last : index - 1;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = last;
    }
    onChange(items[next].id);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[next]?.focus();
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn("flex gap-1 border-b border-line", className)}
    >
      {items.map((item) => {
        const selected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${id}-${item.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              "min-h-11 min-w-0 flex-1 px-2 py-2 text-center text-sm leading-tight transition duration-200",
              selected
                ? "-mb-px border-b-2 border-paper font-semibold text-paper"
                : "border-b-2 border-transparent font-medium text-mist hover:text-paper",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
