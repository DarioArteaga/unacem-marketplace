export const ESTADOS = ["enproceso", "publicado"] as const;

export type EstadoCaso = (typeof ESTADOS)[number];

const ESTADO_LABELS: Record<EstadoCaso, string> = {
  enproceso: "En proceso",
  publicado: "Publicado",
};

export function isEstadoCaso(value: string): value is EstadoCaso {
  return (ESTADOS as readonly string[]).includes(value);
}

export function formatEstadoLabel(estado: EstadoCaso): string {
  return ESTADO_LABELS[estado];
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
  return "publicado";
}
