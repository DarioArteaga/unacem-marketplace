import { z } from "zod";
import { ESTADOS, type EstadoCaso } from "@/lib/estado";

function normalizeEstado(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }
  const compact = value.trim().toLowerCase().replace(/\s+/g, "");
  if (compact === "enproceso") {
    return "enproceso";
  }
  if (compact === "implementado") {
    return "implementado";
  }
  if (compact === "publicado") {
    return "publicado";
  }
  return compact;
}

export const casoFrontmatterSchema = z.object({
  titulo: z.string().min(1, 'falta el campo "titulo"'),
  champion: z.string().min(1, 'falta el campo "champion"'),
  area: z.string().min(1, 'falta el campo "area"'),
  resumen: z
    .string()
    .min(1, 'falta el campo "resumen"')
    .max(140, 'el campo "resumen" no puede superar 140 caracteres'),
  tags: z.array(z.string().min(1)).min(1, 'falta el campo "tags"'),
  herramienta: z.string().optional(),
  estado: z.preprocess(normalizeEstado, z.enum(ESTADOS).optional()) as z.ZodType<
    EstadoCaso | undefined
  >,
  orden: z.number().int().optional(),
  fecha: z.string().optional(),
});

export type CasoFrontmatter = z.infer<typeof casoFrontmatterSchema>;

export type Caso = CasoFrontmatter & {
  slug: string;
  content: string;
};

export type CasoCardData = Omit<Caso, "content">;
