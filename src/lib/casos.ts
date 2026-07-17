import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ZodError } from "zod";
import { casoFrontmatterSchema, type Caso } from "@/lib/schema";
import { logger } from "@/lib/logger";

const CASOS_DIR = path.join(process.cwd(), "content", "casos");

function formatZodError(relativePath: string, error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) {
    return `Contenido inválido en ${relativePath}: front-matter incompleto o incorrecto`;
  }

  const field = issue.path.length > 0 ? String(issue.path[0]) : undefined;
  const missingField =
    issue.code === "invalid_type" && issue.message.includes("received undefined");

  if (missingField && field) {
    return `Contenido inválido en ${relativePath}: falta el campo "${field}"`;
  }

  if (field && issue.message.includes("falta el campo")) {
    return `Contenido inválido en ${relativePath}: ${issue.message}`;
  }

  if (field) {
    return `Contenido inválido en ${relativePath}: campo "${field}" — ${issue.message}`;
  }

  return `Contenido inválido en ${relativePath}: ${issue.message}`;
}

function parseCasoFile(filename: string): Caso {
  const relativePath = `content/casos/${filename}`;
  const fullPath = path.join(CASOS_DIR, filename);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const parsed = casoFrontmatterSchema.safeParse(data);

  if (!parsed.success) {
    const message = formatZodError(relativePath, parsed.error);
    logger.error(message, { file: relativePath });
    throw new Error(message);
  }

  const slug = filename.replace(/\.md$/i, "");
  return {
    ...parsed.data,
    slug,
    content: content.trim(),
  };
}

function compareCasos(a: Caso, b: Caso): number {
  if (a.orden != null && b.orden != null) {
    return a.orden - b.orden;
  }
  if (a.orden != null) {
    return -1;
  }
  if (b.orden != null) {
    return 1;
  }
  const fechaA = a.fecha ?? "";
  const fechaB = b.fecha ?? "";
  return fechaB.localeCompare(fechaA);
}

export function getAllCasos(): Caso[] {
  if (!fs.existsSync(CASOS_DIR)) {
    const message = `No se encontró el directorio de contenido: content/casos`;
    logger.error(message);
    throw new Error(message);
  }

  const files = fs
    .readdirSync(CASOS_DIR)
    .filter((name) => name.endsWith(".md"));

  return files.map(parseCasoFile).sort(compareCasos);
}

export function getCasoBySlug(slug: string): Caso | undefined {
  return getAllCasos().find((caso) => caso.slug === slug);
}

export function getAllTags(casos: Caso[]): string[] {
  const tags = new Set<string>();
  for (const caso of casos) {
    for (const tag of caso.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b, "es"));
}
