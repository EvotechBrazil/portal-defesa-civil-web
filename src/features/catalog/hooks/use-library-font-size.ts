"use client";

import { useEffect, useState } from "react";

const KEY = "lgnd-library-font-px";
export const LIBRARY_FONT_MIN = 16;
export const LIBRARY_FONT_MAX = 20;
export const LIBRARY_FONT_DEFAULT = 18;
const STEP = 2;

export function useLibraryFontSize() {
  const [px, setPx] = useState(LIBRARY_FONT_DEFAULT);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(KEY));
    if (
      Number.isFinite(stored) &&
      stored >= LIBRARY_FONT_MIN &&
      stored <= LIBRARY_FONT_MAX
    ) {
      setPx(stored);
    }
  }, []);

  function cycle() {
    setPx((current) => {
      const next = current >= LIBRARY_FONT_MAX ? LIBRARY_FONT_MIN : current + STEP;
      window.localStorage.setItem(KEY, String(next));
      return next;
    });
  }

  return { px, cycle };
}
