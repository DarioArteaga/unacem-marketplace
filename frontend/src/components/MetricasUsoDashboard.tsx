import Link from "next/link";
import { useMemo } from "react";
import { CompletadoBadge } from "@/components/CompletadoBadge";
import type { CasoCoach, CasoEtapa, CasoOla, CasoPublic } from "@/lib/api/types";
import { formatCoachLabel, formatEtapaLabel, formatOlaLabel } from "@/lib/etapa";

type MetricasUsoDashboardProps = {
  casos: CasoPublic[];
};

type Bucket = {
  key: string;
  label: string;
  count: number;
};

function bucketsFrom(
  casos: CasoPublic[],
  keyOf: (caso: CasoPublic) => string,
  labelOf: (key: string) => string,
): Bucket[] {
  const map = new Map<string, number>();
  for (const caso of casos) {
    const key = keyOf(caso);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, label: labelOf(key), count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"));
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }): React.ReactElement {
  return (
    <div className="rounded-2xl border border-ink-muted/10 bg-surface p-4 shadow-sm">
      <p className="text-[10px] font-medium tracking-wide text-ink-muted uppercase">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold text-brand">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </div>
  );
}

function BarList({ title, items, total }: { title: string; items: Bucket[]; total: number }): React.ReactElement {
  return (
    <div className="rounded-2xl border border-ink-muted/10 bg-surface p-4 shadow-sm">
      <h3 className="font-serif text-lg font-semibold text-brand">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-ink-muted">Sin datos.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item) => {
            const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);
            return (
              <li key={item.key}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="text-ink">{item.label}</span>
                  <span className="shrink-0 text-ink-muted">
                    {item.count} · {pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function MetricasUsoDashboard({ casos }: MetricasUsoDashboardProps): React.ReactElement {
  const stats = useMemo(() => {
    const total = casos.length;
    const completados = casos.filter((c) => c.avance_pct >= 100);
    const sumaAvance = casos.reduce((acc, c) => acc + c.avance_pct, 0);
    const promedio = total === 0 ? 0 : Math.round(sumaAvance / total);
    return {
      total,
      completados: completados.length,
      promedio,
      completadosList: [...completados].sort((a, b) => a.titulo.localeCompare(b.titulo, "es")),
      etapas: bucketsFrom(casos, (c) => c.etapa_actual, (k) => formatEtapaLabel(k as CasoEtapa)),
      coaches: bucketsFrom(casos, (c) => c.coach ?? "sin_coach", (k) =>
        k === "sin_coach" ? "Sin coach asignado" : formatCoachLabel(k as CasoCoach),
      ),
      olas: bucketsFrom(casos, (c) => c.ola ?? "sin_ola", (k) =>
        k === "sin_ola" ? "Sin ola asignada" : formatOlaLabel(k as CasoOla),
      ),
      areas: bucketsFrom(casos, (c) => c.area, (k) => k),
    };
  }, [casos]);

  if (casos.length === 0) {
    return (
      <p className="rounded-xl bg-white px-4 py-8 text-center text-ink-muted ring-1 ring-ink-muted/10">
        No hay casos publicados para armar métricas.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 id="casos-heading" className="font-serif text-2xl font-semibold text-brand">
          Métricas de uso
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Resumen del catálogo público: avance, etapa, coach y ola. No incluye visitas web.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Casos publicados" value={String(stats.total)} />
        <StatCard
          label="Completados (100%)"
          value={String(stats.completados)}
          hint={`${stats.total === 0 ? 0 : Math.round((stats.completados / stats.total) * 100)}% del catálogo`}
        />
        <StatCard label="Avance promedio" value={`${stats.promedio}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarList title="Por etapa" items={stats.etapas} total={stats.total} />
        <BarList title="Por coach" items={stats.coaches} total={stats.total} />
        <BarList title="Por ola" items={stats.olas} total={stats.total} />
        <BarList title="Por área" items={stats.areas} total={stats.total} />
      </div>

      <div className="rounded-2xl border border-ink-muted/10 bg-surface p-4 shadow-sm">
        <h3 className="font-serif text-lg font-semibold text-brand">Casos al 100%</h3>
        {stats.completadosList.length === 0 ? (
          <p className="mt-2 text-sm text-ink-muted">Ningún caso publicado llega aún al 100% de avance.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink-muted/10">
            {stats.completadosList.map((caso) => (
              <li key={caso.slug} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                <Link
                  href={`/casos/${caso.slug}`}
                  className="font-medium text-brand underline-offset-2 hover:underline"
                >
                  {caso.titulo}
                </Link>
                <span className="flex items-center gap-2 text-ink-muted">
                  <CompletadoBadge compact />
                  <span>
                    {caso.champion} · {formatEtapaLabel(caso.etapa_actual)}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
