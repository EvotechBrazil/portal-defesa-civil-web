"use client";

import type { JSX } from "react";
import { PlanconStepsFigure } from "./plancon-steps-figure";
import { RiskComponentsFigure } from "./risk-components-figure";
import { RiskCycleFigure } from "./risk-cycle-figure";

const FIGURES: Record<string, () => JSX.Element> = {
  "/study/defesa-civil/modelo-risco.svg": RiskComponentsFigure,
  "/study/defesa-civil/ciclo-protecao.svg": RiskCycleFigure,
  "/study/defesa-civil/plancon-ciclo.svg": PlanconStepsFigure,
};

function normalizeSrc(src: string): string {
  const path = src.split("?")[0];
  try {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return new URL(path).pathname;
    }
  } catch {
    return path;
  }
  return path;
}

export function CourseFigureBySrc({ src }: { src: string }) {
  const Figure = FIGURES[normalizeSrc(src)];
  if (!Figure) {
    return null;
  }
  return <Figure />;
}

export function isCourseFigureSrc(src: string): boolean {
  return normalizeSrc(src) in FIGURES;
}
