"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { FigureFrame } from "./figure-frame";

const STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export function PlanconStepsFigure() {
  const { t } = useI18n();
  const aria = t("figure.plancon.aria");
  return (
    <FigureFrame number={3} caption={t("figure.plancon.caption")} source={t("figure.plancon.source")}>
      <svg
        className="hidden h-auto w-full md:block"
        viewBox="0 0 560 330"
        role="img"
        aria-label={aria}
      >
        {STEPS.map((n, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          return (
            <g key={n} transform={`translate(${4 + col * 188} ${4 + row * 68})`}>
              <StepBox
                n={n}
                title={t(`figure.plancon.step${n}`)}
                hint={t(`figure.plancon.step${n}Hint`)}
                highlight={n === 2}
                width={176}
              />
            </g>
          );
        })}
        <path d="M468 192 v34 H90 v-34" fill="none" stroke="var(--steel)" strokeWidth="1.5" strokeDasharray="5 4" />
        <path d="M90 196 l-5 8 h10 z" fill="var(--steel)" />
        <rect x="150" y="240" width="260" height="40" rx="8" fill="var(--steel-surf)" stroke="var(--steel)" strokeWidth="1.5" />
        <text x="280" y="265" textAnchor="middle" fill="var(--steel)" fontSize="12" fontWeight="700">
          {t("figure.plancon.loop")}
        </text>
        <text x="280" y="306" textAnchor="middle" fill="currentColor" className="text-mist" fontSize="11">
          {t("figure.plancon.reading")}
        </text>
      </svg>
      <svg
        className="h-auto w-full md:hidden"
        viewBox="0 0 280 980"
        role="img"
        aria-label={aria}
      >
        {STEPS.map((n, index) => (
          <g key={n} transform={`translate(20 ${index * 106})`}>
            <StepBox
              n={n}
              title={t(`figure.plancon.step${n}`)}
              hint={t(`figure.plancon.step${n}Hint`)}
              highlight={n === 2}
              width={240}
              height={96}
            />
          </g>
        ))}
      </svg>
    </FigureFrame>
  );
}

function StepBox({
  n,
  title,
  hint,
  highlight,
  width = 176,
  height = 52,
}: {
  n: number;
  title: string;
  hint: string;
  highlight: boolean;
  width?: number;
  height?: number;
}) {
  const label = String(n).padStart(2, "0");
  const titleY = height > 60 ? 28 : 23;
  const hintY = height > 60 ? 52 : 40;
  return (
    <g>
      <rect
        width={width}
        height={height}
        rx="9"
        fill={highlight ? "var(--primary)" : "var(--panel)"}
        stroke={highlight ? "none" : "currentColor"}
        className={highlight ? undefined : "text-paper"}
        strokeWidth="1.5"
      />
      <text
        x="16"
        y={titleY}
        fill={highlight ? "var(--primary-ink)" : "currentColor"}
        className={highlight ? undefined : "text-mist"}
        fontSize="11"
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
      >
        {label}
      </text>
      <text
        x="42"
        y={titleY}
        fill={highlight ? "var(--primary-ink)" : "currentColor"}
        className={highlight ? undefined : "text-paper"}
        fontSize="13"
        fontWeight="700"
      >
        {title}
      </text>
      <text
        x="42"
        y={hintY}
        fill={highlight ? "var(--primary-ink)" : "currentColor"}
        className={highlight ? undefined : "text-mist"}
        fontSize="10"
      >
        {hint}
      </text>
    </g>
  );
}
