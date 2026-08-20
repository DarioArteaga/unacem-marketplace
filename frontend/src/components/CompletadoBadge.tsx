type CompletadoBadgeProps = {
  compact?: boolean;
};

export function CompletadoBadge({ compact = false }: CompletadoBadgeProps): React.ReactElement {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full bg-brand/10 font-semibold text-brand ring-1 ring-brand/25 ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      <span aria-hidden="true">✓</span>
      Completado
    </span>
  );
}
