"use client";

import { cn } from "@/lib/utils";
import { ReviewRating } from "../types/study.types";

interface RatingButtonsProps {
  disabled: boolean;
  onRate: (rating: ReviewRating) => void;
}

const RATINGS: {
  rating: ReviewRating;
  label: string;
  hint: string;
  className: string;
}[] = [
  {
    rating: "EASY",
    label: "Fácil",
    hint: "volta pouco · ←",
    className: "border-ok/70 text-ok hover:bg-ok/15",
  },
  {
    rating: "LEARNING",
    label: "Aprendendo",
    hint: "meio termo · 2",
    className: "border-learn/70 text-learn hover:bg-learn/15",
  },
  {
    rating: "HARD",
    label: "Difícil",
    hint: "repete já · →",
    className: "border-hard/70 text-hard hover:bg-hard/15",
  },
];

export function RatingButtons({ disabled, onRate }: RatingButtonsProps) {
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
          <span className="block text-[15px] font-semibold">{item.label}</span>
          <span className="mt-0.5 block text-[11px] text-mist">{item.hint}</span>
        </button>
      ))}
    </div>
  );
}
