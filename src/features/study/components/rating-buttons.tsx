"use client";

import { Button } from "@/components/ui/button";
import { ReviewRating } from "../types/study.types";

interface RatingButtonsProps {
  disabled: boolean;
  onRate: (rating: ReviewRating) => void;
}

const RATINGS: { rating: ReviewRating; label: string; hint: string; className: string }[] = [
  {
    rating: "HARD",
    label: "Difícil",
    hint: "travei — volta já · 1",
    className: "bg-red-600 hover:bg-red-600/90",
  },
  {
    rating: "LEARNING",
    label: "Aprendendo",
    hint: "ainda inseguro · 2",
    className: "bg-amber hover:bg-amber/90",
  },
  {
    rating: "EASY",
    label: "Fácil",
    hint: "saí de cabeça · 3",
    className: "bg-emerald-600 hover:bg-emerald-600/90",
  },
];

export function RatingButtons({ disabled, onRate }: RatingButtonsProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {RATINGS.map((item) => (
        <Button
          key={item.rating}
          type="button"
          disabled={disabled}
          onClick={() => onRate(item.rating)}
          className={item.className}
        >
          <span className="flex flex-col items-center leading-tight">
            <span>{item.label}</span>
            <span className="text-[11px] font-normal opacity-90">{item.hint}</span>
          </span>
        </Button>
      ))}
    </div>
  );
}
