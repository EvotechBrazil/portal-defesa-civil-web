"use client";

import { Check, TriangleAlert, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/i18n-provider";
import { ReviewRating } from "../types/study.types";

interface RatingButtonsProps {
  disabled: boolean;
  onRate: (rating: ReviewRating) => void;
}

const RATINGS: {
  rating: ReviewRating;
  labelKey: string;
  hintKey: string;
  icon: LucideIcon;
  className: string;
}[] = [
  {
    rating: "HARD",
    labelKey: "study.hard",
    hintKey: "study.rating.hardHint",
    icon: X,
    className: "border-hard/70 text-hard hover:bg-hard/15",
  },
  {
    rating: "LEARNING",
    labelKey: "study.learning",
    hintKey: "study.rating.learningHint",
    icon: TriangleAlert,
    className: "border-learn/70 text-learn hover:bg-learn/15",
  },
  {
    rating: "EASY",
    labelKey: "study.easy",
    hintKey: "study.rating.easyHint",
    icon: Check,
    className: "border-ok/70 text-ok hover:bg-ok/15",
  },
];

export function RatingButtons({ disabled, onRate }: RatingButtonsProps) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
      {RATINGS.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.rating}
            type="button"
            disabled={disabled}
            onClick={() => onRate(item.rating)}
            className={cn(
              "min-h-12 cursor-pointer rounded-ctl border bg-panel px-2 py-2.5 text-center transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
              item.className,
            )}
          >
            <Icon className="mx-auto size-4" strokeWidth={2} aria-hidden />
            <span className="mt-1 block text-[15px] font-semibold">{t(item.labelKey)}</span>
            <span className="mt-0.5 block text-[11px] text-mist">{t(item.hintKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
