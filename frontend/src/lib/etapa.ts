import type { CasoCoach, CasoEtapa, CasoOla } from "@/lib/api/types";

export const ETAPA_LABELS: Record<CasoEtapa, string> = {
  identificacion: "Identificación",
  diseno: "Diseño",
  implementacion: "Implementación",
  marketplace: "Marketplace",
};

export function formatEtapaLabel(etapa: CasoEtapa): string {
  return ETAPA_LABELS[etapa];
}

export const COACH_LABELS: Record<CasoCoach, string> = {
  jhonatan: "Jhonatan",
  dario: "Darío",
};

export function formatCoachLabel(coach: CasoCoach | null): string {
  return coach ? COACH_LABELS[coach] : "Sin coach asignado";
}

export const OLA_LABELS: Record<CasoOla, string> = {
  ola_1: "Ola 1",
  ola_2: "Ola 2",
  ola_3: "Ola 3",
};

export function formatOlaLabel(ola: CasoOla | null): string {
  return ola ? OLA_LABELS[ola] : "Sin ola asignada";
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
