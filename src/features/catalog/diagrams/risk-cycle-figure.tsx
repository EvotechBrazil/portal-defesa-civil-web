"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { FigureFrame } from "./figure-frame";

const PHASES = [
  { key: "prevention", during: false },
  { key: "mitigation", during: false },
  { key: "preparedness", during: false },
  { key: "response", during: true },
  { key: "recovery", during: false },
] as const;

export function RiskCycleFigure() {
  const { t } = useI18n();
  const aria = t("figure.cycle.aria");
  return (
    <FigureFrame number={2} caption={t("figure.cycle.caption")} source={t("figure.cycle.source")}>
      <svg
        className="hidden h-auto w-full md:block"
        viewBox="0 0 560 250"
        role="img"
        aria-label={aria}
      >
        <circle cx="280" cy="125" r="86" fill="none" stroke="currentColor" className="text-line" strokeWidth="1.5" strokeDasharray="4 5" />
        <PhaseBox x={212} y={6} n={1} title={t("figure.cycle.prevention")} hint={t("figure.cycle.preventionHint")} filled={false} />
        <PhaseBox x={404} y={82} n={2} title={t("figure.cycle.mitigation")} hint={t("figure.cycle.mitigationHint")} filled={false} width={150} />
        <PhaseBox x={366} y={192} n={3} title={t("figure.cycle.preparedness")} hint={t("figure.cycle.preparednessHint")} filled={false} width={150} />
        <PhaseBox x={144} y={192} n={4} title={t("figure.cycle.response")} hint={t("figure.cycle.responseHint")} filled width={150} />
        <PhaseBox x={6} y={82} n={5} title={t("figure.cycle.recovery")} hint={t("figure.cycle.recoveryHint")} filled={false} width={150} />
        <path d="M350 40 q46 14 58 44" fill="none" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <path d="M410 88 l-7 -6 l8 -3 z" fill="currentColor" className="text-paper" />
        <path d="M478 132 q-6 40 -40 58" fill="none" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <path d="M436 192 l1 -9 l7 5 z" fill="currentColor" className="text-paper" />
        <path d="M362 215 h-62" fill="none" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <path d="M296 215 l9 -5 v10 z" fill="currentColor" className="text-paper" />
        <path d="M148 192 q-40 -18 -50 -58" fill="none" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <path d="M97 130 l6 7 l-9 2 z" fill="currentColor" className="text-paper" />
        <path d="M82 78 q10 -42 56 -54" fill="none" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <path d="M142 22 l-8 5 l-1 -9 z" fill="currentColor" className="text-paper" />
        <text x="280" y="120" textAnchor="middle" fill="currentColor" className="text-mist" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700">
          {t("figure.cycle.center1")}
        </text>
        <text x="280" y="136" textAnchor="middle" fill="currentColor" className="text-mist" fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="700">
          {t("figure.cycle.center2")}
        </text>
      </svg>
      <svg
        className="h-auto w-full md:hidden"
        viewBox="0 0 280 560"
        role="img"
        aria-label={aria}
      >
        {PHASES.map((phase, index) => (
          <g key={phase.key} transform={`translate(40 ${index * 108})`}>
            <PhaseBox
              x={0}
              y={0}
              n={index + 1}
              title={t(`figure.cycle.${phase.key}`)}
              hint={t(`figure.cycle.${phase.key}Hint`)}
              filled={phase.during}
              width={200}
            />
            {index < PHASES.length - 1 ? (
              <text x="100" y="102" textAnchor="middle" fill="currentColor" className="text-mist" fontSize="16">
                ↓
              </text>
            ) : null}
          </g>
        ))}
      </svg>
    </FigureFrame>
  );
}

function PhaseBox({
  x,
  y,
  n,
  title,
  hint,
  filled,
  width = 136,
}: {
  x: number;
  y: number;
  n: number;
  title: string;
  hint: string;
  filled: boolean;
  width?: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={width}
        height="46"
        rx="9"
        fill={filled ? "var(--primary)" : "var(--panel)"}
        stroke={filled ? "none" : "currentColor"}
        className={filled ? undefined : "text-paper"}
        strokeWidth="1.5"
      />
      <text
        x={width / 2}
        y="20"
        textAnchor="middle"
        fill={filled ? "var(--primary-ink)" : "currentColor"}
        className={filled ? undefined : "text-paper"}
        fontSize="13"
        fontWeight="700"
      >
        {n} · {title}
      </text>
      <text
        x={width / 2}
        y="36"
        textAnchor="middle"
        fill={filled ? "var(--primary-ink)" : "currentColor"}
        className={filled ? undefined : "text-mist"}
        fontSize="10"
      >
        {hint}
      </text>
    </g>
  );
}
