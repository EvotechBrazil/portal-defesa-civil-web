"use client";

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
  className: string;
}[] = [
  {
    rating: "EASY",
    labelKey: "study.easy",
    hintKey: "study.rating.easyHint",
    className: "border-ok/70 text-ok hover:bg-ok/15",
  },
  {
    rating: "LEARNING",
    labelKey: "study.learning",
    hintKey: "study.rating.learningHint",
    className: "border-learn/70 text-learn hover:bg-learn/15",
  },
  {
    rating: "HARD",
    labelKey: "study.hard",
    hintKey: "study.rating.hardHint",
    className: "border-hard/70 text-hard hover:bg-hard/15",
  },
];

export function RatingButtons({ disabled, onRate }: RatingButtonsProps) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-3 gap-2">
      {RATINGS.map((item) => (
        <button
          key={item.rating}
          type="button"
          disabled={disabled}
          onClick={() => onRate(item.rating)}
          className={cn(
            "min-h-12 cursor-pointer rounded-2xl border bg-panel px-2 py-2.5 text-center transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
            item.className,
          )}
        >
          <span className="block text-[15px] font-semibold">{t(item.labelKey)}</span>
          <span className="mt-0.5 block text-[11px] text-mist">{t(item.hintKey)}</span>
        </button>
      ))}
    </div>
  );
}
