import { z } from "zod";

export const flujoSchema = z.object({
  entradas: z.array(z.string()),
  pasos: z.array(z.string()),
  salidas: z.array(z.string()),
});

export const recursoTextoSchema = z.object({
  titulo: z.string().max(255),
  contenido: z.string().max(50000),
});

export const casoFormSchema = z.object({
  codigo: z.string().max(64).optional().nullable(),
  slug: z.string().max(255).optional().nullable(),
  titulo: z.string().min(1).max(255),
  resumen: z.string().min(1).max(140),
  champion: z.string().min(1).max(255),
  area: z.string().min(1).max(255),
  coach: z.enum(["jhonatan", "dario"]).optional().nullable(),
  ola: z.enum(["ola_1", "ola_2", "ola_3"]).optional().nullable(),
  descripcion: z.string().optional().nullable(),
  problema: z.string().optional().nullable(),
  valor_esperado: z.string().optional().nullable(),
  publico_objetivo: z.string().optional().nullable(),
  alcance: z.string().optional().nullable(),
  diseno: z.string().optional().nullable(),
  herramientasText: z.string().default(""),
  beneficiariosText: z.string().default(""),
  tagsText: z.string().default(""),
  flujoEntradas: z.string().default(""),
  flujoPasos: z.string().default(""),
  flujoSalidas: z.string().default(""),
  prompts: z.array(recursoTextoSchema).default([]),
  skills: z.array(recursoTextoSchema).default([]),
  etapa_actual: z.enum(["identificacion", "diseno", "implementacion", "marketplace"]),
  estado: z.enum(["enproceso", "implementado", "publicado"]),
  avance_pct: z.number().min(0).max(100).default(25),
  visible_publico: z.boolean(),
  adopcion_nivel: z.string().optional().nullable(),
  adopcion_detalle: z.string().optional().nullable(),
  participacion_nivel: z.string().optional().nullable(),
  participacion_detalle: z.string().optional().nullable(),
  eficiencia_resumen: z.string().optional().nullable(),
  eficiencia_detalle: z.string().optional().nullable(),
  fecha_identificado: z.string().optional().nullable(),
});

export type CasoFormValues = z.infer<typeof casoFormSchema>;
export type RecursoTextoForm = z.infer<typeof recursoTextoSchema>;

export function linesToList(text: string): string[] {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function listToLines(items: string[] | null | undefined): string {
  return (items ?? []).join("\n");
}

/** Descarta filas vacías; exige título y contenido en las que se envían. */
export function normalizeRecursos(
  items: RecursoTextoForm[],
): { titulo: string; contenido: string }[] {
  return items
    .map((item) => ({
      titulo: item.titulo.trim(),
      contenido: item.contenido.trim(),
    }))
    .filter((item) => item.titulo.length > 0 && item.contenido.length > 0);
}
