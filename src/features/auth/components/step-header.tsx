export function StepHeader({
  current,
  total,
  eyebrow,
  title,
  onBack,
  backLabel,
}: {
  current: number;
  total: number;
  eyebrow: string;
  title: string;
  onBack?: () => void;
  backLabel: string;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-3">
      {onBack ? (
        <button type="button" onClick={onBack} className="min-h-11 text-sm font-medium text-mist hover:text-paper">
          ‹ {backLabel}
        </button>
      ) : null}
      <p className="font-mono text-micro uppercase tracking-[0.14em] text-mist">
        {current}/{total} · {eyebrow}
      </p>
      <div className="h-1 overflow-hidden rounded-full bg-inset" aria-hidden>
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-paper">{title}</h1>
    </div>
  );
}
