export const ESTADOS = ["enproceso", "implementado", "publicado"] as const;

export type EstadoCaso = (typeof ESTADOS)[number];

export function isEstadoCaso(value: string): value is EstadoCaso {
  return (ESTADOS as readonly string[]).includes(value);
}

export function formatEstadoLabel(estado: EstadoCaso): string {
  if (estado === "enproceso") {
    return "En proceso";
  }
  if (estado === "implementado") {
    return "Implementado";
  }
  return "Publicado";
}

/** ¿El caso sigue en desarrollo? (badge y filtro "En proceso"). */
export function isEnProceso(estado: EstadoCaso): boolean {
  return estado === "enproceso";
}

/** Compat: tag legado `enproceso` si aún no migraron a `estado`. */
export function resolveEstado(
  estado: EstadoCaso | undefined,
  tags: string[],
): EstadoCaso {
  if (estado) {
    return estado;
  }
  // ponytail: quitar cuando todos los .md usen el campo estado
  if (tags.includes("enproceso")) {
    return "enproceso";
  }
  return "implementado";
}
