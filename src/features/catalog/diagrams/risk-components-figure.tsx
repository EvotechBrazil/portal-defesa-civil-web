"use client";

import { useI18n } from "@/i18n/i18n-provider";
import { FigureFrame } from "./figure-frame";

export function RiskComponentsFigure() {
  const { t } = useI18n();
  const aria = t("figure.risk.aria");
  return (
    <FigureFrame number={1} caption={t("figure.risk.caption")} source={t("figure.risk.source")}>
      <svg
        className="hidden h-auto w-full md:block"
        viewBox="0 0 560 210"
        role="img"
        aria-label={aria}
      >
        <rect x="8" y="30" width="140" height="66" rx="10" fill="var(--panel)" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <text x="78" y="58" textAnchor="middle" fill="currentColor" className="text-paper" fontSize="14" fontWeight="700">
          {t("figure.risk.threat")}
        </text>
        <text x="78" y="78" textAnchor="middle" fill="currentColor" className="text-mist" fontSize="11">
          {t("figure.risk.threatHint")}
        </text>
        <text x="163" y="70" textAnchor="middle" fill="var(--primary)" fontSize="20" fontFamily="ui-monospace, monospace" fontWeight="700">
          ×
        </text>
        <rect x="178" y="30" width="140" height="66" rx="10" fill="var(--panel)" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <text x="248" y="58" textAnchor="middle" fill="currentColor" className="text-paper" fontSize="14" fontWeight="700">
          {t("figure.risk.exposure")}
        </text>
        <text x="248" y="78" textAnchor="middle" fill="currentColor" className="text-mist" fontSize="11">
          {t("figure.risk.exposureHint")}
        </text>
        <text x="333" y="70" textAnchor="middle" fill="var(--primary)" fontSize="20" fontFamily="ui-monospace, monospace" fontWeight="700">
          ×
        </text>
        <rect x="348" y="30" width="150" height="66" rx="10" fill="var(--panel)" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <text x="423" y="58" textAnchor="middle" fill="currentColor" className="text-paper" fontSize="14" fontWeight="700">
          {t("figure.risk.vulnerability")}
        </text>
        <text x="423" y="78" textAnchor="middle" fill="currentColor" className="text-mist" fontSize="11">
          {t("figure.risk.vulnerabilityHint")}
        </text>
        <path d="M253 100 L253 128" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <path d="M253 132 l-5 -8 h10 z" fill="currentColor" className="text-paper" />
        <rect x="163" y="136" width="180" height="52" rx="10" fill="var(--primary)" />
        <text x="253" y="160" textAnchor="middle" fill="var(--primary-ink)" fontSize="16" fontWeight="700">
          {t("figure.risk.result")}
        </text>
        <text x="253" y="177" textAnchor="middle" fill="var(--primary-ink)" fontSize="10.5">
          {t("figure.risk.resultHint")}
        </text>
        <rect
          x="366"
          y="136"
          width="186"
          height="52"
          rx="10"
          fill="var(--steel-surf)"
          stroke="var(--steel)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
        />
        <text x="459" y="158" textAnchor="middle" fill="var(--steel)" fontSize="13" fontWeight="700">
          {t("figure.risk.capacity")}
        </text>
        <text x="459" y="175" textAnchor="middle" fill="var(--steel)" fontSize="10.5">
          {t("figure.risk.capacityHint")}
        </text>
        <path d="M366 162 L349 162" stroke="var(--steel)" strokeWidth="1.5" />
        <path d="M345 162 l8 -5 v10 z" fill="var(--steel)" />
      </svg>
      <svg
        className="h-auto w-full md:hidden"
        viewBox="0 0 300 220"
        role="img"
        aria-label={aria}
      >
        <rect x="42" y="4" width="216" height="38" rx="8" fill="var(--panel)" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <text x="150" y="28" textAnchor="middle" fill="currentColor" className="text-paper" fontSize="13" fontWeight="700">
          {t("figure.risk.threat")}
        </text>
        <text x="150" y="58" textAnchor="middle" fill="var(--primary)" fontSize="16" fontFamily="ui-monospace, monospace" fontWeight="700">
          ×
        </text>
        <rect x="42" y="66" width="216" height="38" rx="8" fill="var(--panel)" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <text x="150" y="90" textAnchor="middle" fill="currentColor" className="text-paper" fontSize="13" fontWeight="700">
          {t("figure.risk.exposure")}
        </text>
        <text x="150" y="120" textAnchor="middle" fill="var(--primary)" fontSize="16" fontFamily="ui-monospace, monospace" fontWeight="700">
          ×
        </text>
        <rect x="42" y="128" width="216" height="38" rx="8" fill="var(--panel)" stroke="currentColor" className="text-paper" strokeWidth="1.5" />
        <text x="150" y="152" textAnchor="middle" fill="currentColor" className="text-paper" fontSize="13" fontWeight="700">
          {t("figure.risk.vulnerability")}
        </text>
        <rect x="42" y="176" width="216" height="36" rx="8" fill="var(--primary)" />
        <text x="150" y="199" textAnchor="middle" fill="var(--primary-ink)" fontSize="13" fontWeight="700">
          = {t("figure.risk.result")}
        </text>
      </svg>
    </FigureFrame>
  );
}
