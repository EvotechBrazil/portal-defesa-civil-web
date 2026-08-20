export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-paper">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-mist">{hint}</p> : null}
      {error ? <p className="text-sm text-hard">{error}</p> : null}
    </div>
  );
}
