import { z } from "zod";

export const flujoSchema = z.object({
  entradas: z.array(z.string()),
  pasos: z.array(z.string()),
  salidas: z.array(z.string()),
});

export const casoFormSchema = z.object({
  codigo: z.string().max(64).optional().nullable(),
  slug: z.string().max(255).optional().nullable(),
  titulo: z.string().min(1).max(255),
  resumen: z.string().min(1).max(140),
  champion: z.string().min(1).max(255),
  area: z.string().min(1).max(255),
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
  etapa_actual: z.enum(["identificacion", "diseno", "implementacion", "marketplace"]),
  estado: z.enum(["enproceso", "implementado", "publicado"]),
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

export function linesToList(text: string): string[] {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function listToLines(items: string[] | null | undefined): string {
  return (items ?? []).join("\n");
}
