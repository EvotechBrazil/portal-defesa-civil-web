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
    hint: "menor frequência · ←",
    className: "border-b-[#2fbf71] hover:bg-[rgba(47,191,113,.14)] hover:border-[#2fbf71]",
  },
  {
    rating: "LEARNING",
    label: "Aprendendo",
    hint: "volta no meio · 2",
    className: "border-b-[#eba43a] hover:bg-[rgba(235,164,58,.14)] hover:border-[#eba43a]",
  },
  {
    rating: "HARD",
    label: "Difícil",
    hint: "repete mais · →",
    className: "border-b-[#e0524b] hover:bg-[rgba(224,82,75,.14)] hover:border-[#e0524b]",
  },
];

export function RatingButtons({ disabled, onRate }: RatingButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {RATINGS.map((item) => (
        <button
          key={item.rating}
          type="button"
          disabled={disabled}
          onClick={() => onRate(item.rating)}
          className={cn(
            "cursor-pointer rounded-[13px] border border-[#272d38] border-b-[3px] bg-[#161a21] px-2 py-2.5 text-center text-[#e8ecf3] transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50",
            item.className,
          )}
        >
          <b className="block text-[15px]">{item.label}</b>
          <small className="mt-0.5 block text-[11px] text-[#9aa5b6]">{item.hint}</small>
        </button>
      ))}
    </div>
  );
}
