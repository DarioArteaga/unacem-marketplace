type GroupCardProps = {
  title: string;
  subtitle: string;
  caseCount: number;
  onSelect: () => void;
};

function caseCountLabel(count: number): string {
  return count === 1 ? "1 caso" : `${count} casos`;
}

export function GroupCard({
  title,
  subtitle,
  caseCount,
  onSelect,
}: GroupCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex w-full flex-col rounded-xl border border-ink-muted/15 bg-surface p-3.5 text-left shadow-sm outline-none transition duration-200 ease-out hover:border-brand/50 hover:shadow-md focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 font-serif text-base font-semibold leading-snug text-brand transition-colors group-hover:text-brand-accent group-focus-visible:text-brand-accent">
          {title}
        </h3>
        <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">
          {caseCountLabel(caseCount)}
        </span>
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-ink-muted">{subtitle}</p>
      <span className="mt-2 text-xs font-medium text-brand transition group-hover:text-brand-accent">
        Ver casos →
      </span>
    </button>
  );
}
