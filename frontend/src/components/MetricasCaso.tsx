import type { CasoPublic } from "@/lib/api/types";

type MetricasCasoProps = {
  caso: CasoPublic;
};

type MetricTile = {
  label: string;
  value: string;
  detail: string | null;
};

export function MetricasCaso({ caso }: MetricasCasoProps): React.ReactElement | null {
  const tiles: MetricTile[] = [
    {
      label: "Adopción",
      value: caso.adopcion_nivel?.trim() || "—",
      detail: caso.adopcion_detalle,
    },
    {
      label: "Participación",
      value: caso.participacion_nivel?.trim() || "—",
      detail: caso.participacion_detalle,
    },
    {
      label: "Percepción de eficiencia",
      value: caso.eficiencia_resumen?.trim() || "—",
      detail: caso.eficiencia_detalle,
    },
  ];

  const hasAny = tiles.some((t) => t.value !== "—" || (t.detail && t.detail.trim()));
  if (!hasAny) {
    return null;
  }

  return (
    <section aria-label="Métricas del caso" className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-2xl border border-ink-muted/10 bg-surface p-4 shadow-sm"
        >
          <p className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">
            {tile.label}
          </p>
          <p className="mt-1 font-serif text-xl font-semibold text-brand">{tile.value}</p>
          {tile.detail ? (
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{tile.detail}</p>
          ) : null}
        </div>
      ))}
    </section>
  );
}
