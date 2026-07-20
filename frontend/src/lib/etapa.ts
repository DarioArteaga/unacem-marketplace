import type { CasoEtapa } from "@/lib/api/types";

export const ETAPA_LABELS: Record<CasoEtapa, string> = {
  identificacion: "Identificación",
  diseno: "Diseño",
  implementacion: "Implementación",
  marketplace: "Marketplace",
};

export function formatEtapaLabel(etapa: CasoEtapa): string {
  return ETAPA_LABELS[etapa];
}

export function formatDateEs(isoDate: string | null): string {
  if (!isoDate) {
    return "—";
  }
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return isoDate;
  }
  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
