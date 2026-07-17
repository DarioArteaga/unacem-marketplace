type ChampionCardProps = {
  champion: string;
  areas: string[];
  caseCount: number;
  onSelect: () => void;
};

function caseCountLabel(count: number): string {
  return count === 1 ? "1 caso" : `${count} casos`;
}

export function ChampionCard({
  champion,
  areas,
  caseCount,
  onSelect,
}: ChampionCardProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex h-full w-full flex-col rounded-2xl border border-ink-muted/15 bg-surface p-5 text-left shadow-sm outline-none transition duration-200 ease-out hover:-translate-y-1 hover:border-brand/50 hover:shadow-lg focus-visible:-translate-y-1 focus-visible:border-brand focus-visible:shadow-lg focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-serif text-xl font-semibold text-brand transition-colors group-hover:text-brand-accent group-focus-visible:text-brand-accent">
          {champion}
        </h3>
        <span className="shrink-0 rounded-full bg-brand px-2.5 py-1 text-xs font-medium text-white">
          {caseCountLabel(caseCount)}
        </span>
      </div>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-muted">{areas.join(" · ")}</p>
      <span className="text-sm font-medium text-brand transition group-hover:text-brand-accent">
        Ver casos →
      </span>
    </button>
  );
}
