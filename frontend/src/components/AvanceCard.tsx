import type { CasoPublic } from "@/lib/api/types";
import { formatDateEs } from "@/lib/etapa";

type AvanceCardProps = {
  caso: CasoPublic;
};

export function AvanceCard({ caso }: AvanceCardProps): React.ReactElement {
  const pct = caso.avance_pct;
  const donutStyle: React.CSSProperties = {
    background: `conic-gradient(var(--color-brand) ${pct * 3.6}deg, #e8e8e8 0deg)`,
  };

  return (
    <aside className="rounded-2xl border border-ink-muted/10 bg-surface-muted p-5">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div
            className="relative flex h-28 w-28 items-center justify-center rounded-full"
            style={donutStyle}
            role="img"
            aria-label={`${pct} por ciento de avance`}
          >
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full bg-surface-muted">
              <span className="font-serif text-2xl font-semibold text-brand">{pct}%</span>
              <span className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">
                Avance
              </span>
            </div>
          </div>
        </div>

        <ul className="flex-1 space-y-2" aria-label="Etapas del caso">
          {caso.etapas_checklist.map((item) => (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                  item.completed
                    ? "bg-brand text-white"
                    : "bg-surface text-ink-muted ring-1 ring-ink-muted/25"
                }`}
                aria-hidden="true"
              >
                {item.completed ? "✓" : ""}
              </span>
              <span className={item.completed ? "font-medium text-ink" : "text-ink-muted"}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Una columna: el aside es ~320px; 3 cols rompían labels largos (overflow). */}
      <dl className="mt-5 grid grid-cols-1 gap-2">
        <div className="min-w-0 rounded-xl bg-surface px-3 py-2.5 ring-1 ring-ink-muted/10">
          <dt className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">
            Identificado
          </dt>
          <dd className="mt-0.5 truncate text-sm font-medium text-ink">
            {formatDateEs(caso.fecha_identificado)}
          </dd>
        </div>
        <div className="min-w-0 rounded-xl bg-surface px-3 py-2.5 ring-1 ring-ink-muted/10">
          <dt className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">
            Actualizado
          </dt>
          <dd className="mt-0.5 truncate text-sm font-medium text-ink">
            {formatDateEs(caso.updated_at.slice(0, 10))}
          </dd>
        </div>
        <div className="min-w-0 rounded-xl bg-surface px-3 py-2.5 ring-1 ring-ink-muted/10">
          <dt className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">
            Días activo
          </dt>
          <dd className="mt-0.5 text-sm font-medium text-ink">
            {caso.dias_activo ?? "—"}
            {caso.dias_activo !== null ? (
              <span className="ml-1 font-normal text-ink-muted">
                desde identificación
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-ink-muted">
        El % de avance lo define el coach; la etapa es un estado aparte.
      </p>
    </aside>
  );
}
