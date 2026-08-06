"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import type { AssistSuggestion, CasoAdmin, CasoWritePayload } from "@/lib/api/types";
import { RecursoListEditor } from "@/components/admin/RecursoListEditor";
import {
  casoFormSchema,
  linesToList,
  listToLines,
  normalizeRecursos,
  type CasoFormValues,
} from "@/lib/admin/casoFormSchema";

type CasoEditorProps = {
  initial?: CasoAdmin | null;
};

function PublicadoBanner(): React.ReactElement | null {
  const search = useSearchParams();
  const router = useRouter();
  if (search.get("ok") !== "publicado") return null;
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand/10 px-4 py-3 text-sm text-ink">
      <p>
        Caso publicado en el marketplace. Puedes crear otro abajo, o{" "}
        <button
          type="button"
          className="font-medium text-brand underline"
          onClick={() => router.push("/admin")}
        >
          ver la lista
        </button>
        .
      </p>
      <button
        type="button"
        className="text-xs text-ink-muted underline"
        onClick={() => router.replace("/admin/casos/nuevo")}
      >
        Cerrar aviso
      </button>
    </div>
  );
}

function emptyForm(): CasoFormValues {
  return {
    codigo: "",
    slug: "",
    titulo: "",
    resumen: "",
    champion: "",
    area: "",
    coach: null,
    ola: null,
    descripcion: "",
    problema: "",
    valor_esperado: "",
    publico_objetivo: "",
    alcance: "",
    diseno: "",
    herramientasText: "",
    beneficiariosText: "",
    tagsText: "",
    flujoEntradas: "",
    flujoPasos: "",
    flujoSalidas: "",
    prompts: [],
    skills: [],
    etapa_actual: "identificacion",
    estado: "enproceso",
    avance_pct: 25,
    visible_publico: false,
    adopcion_nivel: "",
    adopcion_detalle: "",
    participacion_nivel: "",
    participacion_detalle: "",
    eficiencia_resumen: "",
    eficiencia_detalle: "",
    fecha_identificado: new Date().toISOString().slice(0, 10),
  };
}

function fromCaso(caso: CasoAdmin): CasoFormValues {
  return {
    codigo: caso.codigo ?? "",
    slug: caso.slug,
    titulo: caso.titulo,
    resumen: caso.resumen,
    champion: caso.champion,
    area: caso.area,
    coach: caso.coach,
    ola: caso.ola,
    descripcion: caso.descripcion ?? "",
    problema: caso.problema ?? "",
    valor_esperado: caso.valor_esperado ?? "",
    publico_objetivo: caso.publico_objetivo ?? "",
    alcance: caso.alcance ?? "",
    diseno: caso.diseno ?? "",
    herramientasText: listToLines(caso.herramientas),
    beneficiariosText: listToLines(caso.beneficiarios),
    tagsText: listToLines(caso.tags),
    flujoEntradas: listToLines(caso.flujo.entradas),
    flujoPasos: listToLines(caso.flujo.pasos),
    flujoSalidas: listToLines(caso.flujo.salidas),
    prompts: (caso.prompts ?? []).map((item) => ({
      titulo: item.titulo,
      contenido: item.contenido,
    })),
    skills: (caso.skills ?? []).map((item) => ({
      titulo: item.titulo,
      contenido: item.contenido,
    })),
    etapa_actual: caso.etapa_actual,
    estado: caso.estado,
    avance_pct: caso.avance_pct,
    visible_publico: caso.visible_publico,
    adopcion_nivel: caso.adopcion_nivel ?? "",
    adopcion_detalle: caso.adopcion_detalle ?? "",
    participacion_nivel: caso.participacion_nivel ?? "",
    participacion_detalle: caso.participacion_detalle ?? "",
    eficiencia_resumen: caso.eficiencia_resumen ?? "",
    eficiencia_detalle: caso.eficiencia_detalle ?? "",
    fecha_identificado: caso.fecha_identificado ?? "",
  };
}

function toPayload(values: CasoFormValues): CasoWritePayload {
  return {
    codigo: values.codigo || null,
    slug: values.slug || null,
    titulo: values.titulo,
    resumen: values.resumen,
    champion: values.champion,
    area: values.area,
    coach: values.coach || null,
    ola: values.ola || null,
    descripcion: values.descripcion || null,
    problema: values.problema || null,
    valor_esperado: values.valor_esperado || null,
    publico_objetivo: values.publico_objetivo || null,
    alcance: values.alcance || null,
    diseno: values.diseno || null,
    herramientas: linesToList(values.herramientasText),
    beneficiarios: linesToList(values.beneficiariosText),
    tags: linesToList(values.tagsText),
    flujo: {
      entradas: linesToList(values.flujoEntradas),
      pasos: linesToList(values.flujoPasos),
      salidas: linesToList(values.flujoSalidas),
    },
    prompts: normalizeRecursos(values.prompts),
    skills: normalizeRecursos(values.skills),
    etapa_actual: values.etapa_actual,
    estado: values.estado,
    avance_pct: values.avance_pct,
    visible_publico: values.visible_publico,
    adopcion_nivel: values.adopcion_nivel || null,
    adopcion_detalle: values.adopcion_detalle || null,
    participacion_nivel: values.participacion_nivel || null,
    participacion_detalle: values.participacion_detalle || null,
    eficiencia_resumen: values.eficiencia_resumen || null,
    eficiencia_detalle: values.eficiencia_detalle || null,
    fecha_identificado: values.fecha_identificado || null,
  };
}

async function proxy<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch("/api/admin/proxy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, body }),
  });
  const data = (await response.json().catch(() => null)) as
    | (T & { detail?: string })
    | { detail?: string }
    | null;
  if (!response.ok) {
    throw new Error(
      data && typeof data === "object" && "detail" in data && data.detail
        ? String(data.detail)
        : `Error ${response.status}`,
    );
  }
  return data as T;
}

export function CasoEditor({ initial }: CasoEditorProps): React.ReactElement {
  return (
    <Suspense fallback={<p className="text-ink-muted">Cargando editor…</p>}>
      <CasoEditorInner initial={initial} />
    </Suspense>
  );
}

function CasoEditorInner({ initial }: CasoEditorProps): React.ReactElement {
  const router = useRouter();
  const [form, setForm] = useState<CasoFormValues>(() =>
    initial ? fromCaso(initial) : emptyForm(),
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [assistText, setAssistText] = useState("");
  const [suggestion, setSuggestion] = useState<AssistSuggestion | null>(null);
  const [assistLoading, setAssistLoading] = useState(false);
  const [appliedKeys, setAppliedKeys] = useState<Set<string>>(new Set());
  const [applyNotice, setApplyNotice] = useState<string | null>(null);
  const [casoId, setCasoId] = useState<string | null>(initial?.id ?? null);

  const isEdit = Boolean(casoId);

  useEffect(() => {
    if (initial) {
      setForm(fromCaso(initial));
      setCasoId(initial.id);
    }
  }, [initial]);

  const suggestionEntries = useMemo(() => {
    if (!suggestion) return [];
    return Object.entries(suggestion).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    );
  }, [suggestion]);

  function setField<K extends keyof CasoFormValues>(key: K, value: CasoFormValues[K]): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const parsed = casoFormSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Revisa el formulario");
      return;
    }
    setSaving(true);
    try {
      const payload = toPayload(parsed.data);
      if (casoId) {
        await proxy(`/api/v1/admin/casos/${casoId}`, "PATCH", payload);
        setSuccess("Cambios guardados. El caso sigue editable.");
        router.refresh();
      } else {
        const created = await proxy<CasoAdmin>("/api/v1/admin/casos", "POST", {
          ...payload,
          visible_publico: false,
        });
        setCasoId(created.id);
        setForm(fromCaso(created));
        setSuccess("Borrador guardado. Ya puedes publicarlo en el marketplace.");
        router.replace(`/admin/casos/${created.id}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function onAssist(): Promise<void> {
    setAssistLoading(true);
    setError(null);
    setApplyNotice(null);
    try {
      const result = await proxy<AssistSuggestion>("/api/v1/admin/assist", "POST", {
        texto: assistText,
      });
      setSuggestion(result);
      setAppliedKeys(new Set());
      const hasFields = Object.values(result).some((value) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === "object") {
          return Object.values(value as Record<string, unknown>).some(
            (v) => Array.isArray(v) ? v.length > 0 : Boolean(v),
          );
        }
        return true;
      });
      if (!hasFields) {
        setApplyNotice(
          "El asistente respondió sin campos útiles. Prueba con un texto más corto.",
        );
      }
    } catch (err) {
      setSuggestion(null);
      setError(err instanceof Error ? err.message : "Error del asistente");
    } finally {
      setAssistLoading(false);
    }
  }

  function applySuggestion(key: string, value: unknown): void {
    const map: Record<string, keyof CasoFormValues | null> = {
      titulo: "titulo",
      resumen: "resumen",
      champion: "champion",
      area: "area",
      descripcion: "descripcion",
      problema: "problema",
      valor_esperado: "valor_esperado",
      publico_objetivo: "publico_objetivo",
      alcance: "alcance",
      diseno: "diseno",
      codigo: "codigo",
      herramientas: "herramientasText",
      beneficiarios: "beneficiariosText",
      tags: "tagsText",
      flujo: null,
    };
    if (key === "flujo" && value && typeof value === "object") {
      const flujo = value as { entradas?: string[]; pasos?: string[]; salidas?: string[] };
      setForm((prev) => ({
        ...prev,
        flujoEntradas: listToLines(flujo.entradas),
        flujoPasos: listToLines(flujo.pasos),
        flujoSalidas: listToLines(flujo.salidas),
      }));
    } else {
      const field = map[key];
      if (!field) return;
      if (Array.isArray(value)) {
        setField(field, listToLines(value as string[]) as never);
      } else {
        setField(field, String(value ?? "") as never);
      }
    }
    setAppliedKeys((prev) => new Set(prev).add(key));
    setApplyNotice(`Campo «${key}» aplicado al formulario`);
    window.setTimeout(() => {
      setApplyNotice((current) =>
        current === `Campo «${key}» aplicado al formulario` ? null : current,
      );
    }, 2500);
  }

  async function togglePublicar(): Promise<void> {
    if (!casoId) {
      setError("Guarda el borrador antes de publicar.");
      return;
    }
    const publicar = !form.visible_publico;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const parsed = casoFormSchema.safeParse(form);
      if (parsed.success) {
        await proxy(`/api/v1/admin/casos/${casoId}`, "PATCH", toPayload(parsed.data));
      }
      await proxy(`/api/v1/admin/casos/${casoId}/publicar`, "POST", {
        visible_publico: publicar,
      });
      if (publicar) {
        router.push("/admin/casos/nuevo?ok=publicado");
        router.refresh();
        return;
      }
      setField("visible_publico", false);
      setSuccess("Caso oculto del marketplace. Puedes seguir editándolo.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al publicar");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(): Promise<void> {
    if (!casoId) return;
    if (!window.confirm("¿Eliminar este caso? Esta acción no se puede deshacer.")) return;
    setSaving(true);
    try {
      await proxy(`/api/v1/admin/casos/${casoId}`, "DELETE");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-5">
        {!initial ? <PublicadoBanner /> : null}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-semibold text-brand">
              {isEdit ? "Editar caso" : "Nuevo caso"}
            </h1>
            {isEdit ? (
              <p
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  form.visible_publico
                    ? "bg-brand/10 text-brand"
                    : "bg-surface text-ink-muted ring-1 ring-ink-muted/20"
                }`}
              >
                {form.visible_publico ? "Publicado en el marketplace" : "Borrador (solo admin)"}
              </p>
            ) : (
              <p className="text-sm text-ink-muted">
                Primero guarda el borrador; después podrás publicarlo.
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {isEdit ? (
              <button
                type="button"
                onClick={() => void onDelete()}
                disabled={saving}
                className="rounded-lg border border-brand/30 px-3 py-2 text-sm text-brand disabled:opacity-60"
              >
                Eliminar
              </button>
            ) : null}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg border border-ink-muted/20 bg-surface px-4 py-2 text-sm font-medium text-ink disabled:opacity-60"
            >
              {saving
                ? "Guardando…"
                : isEdit
                  ? "Guardar cambios"
                  : "Guardar borrador"}
            </button>

            {isEdit ? (
              <button
                type="button"
                onClick={() => void togglePublicar()}
                disabled={saving}
                className={
                  form.visible_publico
                    ? "rounded-lg border border-ink-muted/20 bg-surface px-4 py-2 text-sm font-medium text-ink disabled:opacity-60"
                    : "rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                }
              >
                {saving
                  ? "…"
                  : form.visible_publico
                    ? "Ocultar del marketplace"
                    : "Publicar en marketplace"}
              </button>
            ) : null}
          </div>
        </div>

        {error ? <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p> : null}
        {success ? (
          <p className="rounded-lg bg-ink/5 px-3 py-2 text-sm text-ink">{success}</p>
        ) : null}

        <Field label="Título">
          <input
            required
            value={form.titulo}
            onChange={(e) => setField("titulo", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label={`Resumen (${form.resumen.length}/140)`}>
          <textarea
            required
            maxLength={140}
            rows={2}
            value={form.resumen}
            onChange={(e) => setField("resumen", e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Champion">
            <input
              required
              value={form.champion}
              onChange={(e) => setField("champion", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Área">
            <input
              required
              value={form.area}
              onChange={(e) => setField("area", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Coach">
            <select
              value={form.coach ?? ""}
              onChange={(e) =>
                setField(
                  "coach",
                  (e.target.value || null) as CasoFormValues["coach"],
                )
              }
              className={inputClass}
            >
              <option value="">Sin asignar</option>
              <option value="jhonatan">Jhonatan</option>
              <option value="dario">Darío</option>
            </select>
          </Field>
          <Field label="Ola">
            <select
              value={form.ola ?? ""}
              onChange={(e) =>
                setField("ola", (e.target.value || null) as CasoFormValues["ola"])
              }
              className={inputClass}
            >
              <option value="">Sin asignar</option>
              <option value="ola_1">Ola 1</option>
              <option value="ola_2">Ola 2</option>
              <option value="ola_3">Ola 3</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Código">
            <input
              value={form.codigo ?? ""}
              onChange={(e) => setField("codigo", e.target.value)}
              className={inputClass}
              placeholder="CU-APMO-001"
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              value={form.slug ?? ""}
              onChange={(e) => setField("slug", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Fecha identificado">
            <input
              type="date"
              value={form.fecha_identificado ?? ""}
              onChange={(e) => setField("fecha_identificado", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Etapa actual">
            <select
              value={form.etapa_actual}
              onChange={(e) =>
                setField("etapa_actual", e.target.value as CasoFormValues["etapa_actual"])
              }
              className={inputClass}
            >
              <option value="identificacion">Identificación</option>
              <option value="diseno">Diseño</option>
              <option value="implementacion">Implementación</option>
              <option value="marketplace">Marketplace</option>
            </select>
          </Field>
          <Field label="Estado vitrina">
            <select
              value={form.estado}
              onChange={(e) => setField("estado", e.target.value as CasoFormValues["estado"])}
              className={inputClass}
            >
              <option value="enproceso">En proceso</option>
              <option value="implementado">Implementado</option>
              <option value="publicado">Publicado</option>
            </select>
          </Field>
        </div>

        <Field label={`Avance (%) — libre, no depende de la etapa`}>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.avance_pct}
              onChange={(e) => setField("avance_pct", Number(e.target.value))}
              className="w-full accent-brand"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={form.avance_pct}
              onChange={(e) =>
                setField(
                  "avance_pct",
                  Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                )
              }
              className="w-20 shrink-0 rounded-lg border border-ink-muted/20 bg-surface-muted px-2 py-1 text-sm text-ink"
            />
            <span className="shrink-0 text-sm font-medium text-ink-muted">%</span>
          </div>
        </Field>

        {(
          [
            ["descripcion", "Descripción"],
            ["problema", "Problema que resuelve"],
            ["publico_objetivo", "Público objetivo"],
            ["diseno", "Diseño / Sistemas"],
            ["valor_esperado", "Valor esperado"],
            ["alcance", "Alcance"],
          ] as const
        ).map(([key, label]) => (
          <Field key={key} label={label}>
            <textarea
              rows={3}
              value={form[key] ?? ""}
              onChange={(e) => setField(key, e.target.value)}
              className={inputClass}
              placeholder="Deja vacío para limpiar el campo"
            />
          </Field>
        ))}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Herramientas (una por línea)">
            <textarea
              rows={3}
              value={form.herramientasText}
              onChange={(e) => setField("herramientasText", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Beneficiarios (una por línea)">
            <textarea
              rows={3}
              value={form.beneficiariosText}
              onChange={(e) => setField("beneficiariosText", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Tags (una por línea)">
            <textarea
              rows={3}
              value={form.tagsText}
              onChange={(e) => setField("tagsText", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <fieldset className="rounded-xl border border-ink-muted/10 p-4">
          <legend className="px-1 text-sm font-semibold text-brand">Flujo</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Entradas">
              <textarea
                rows={4}
                value={form.flujoEntradas}
                onChange={(e) => setField("flujoEntradas", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Pasos">
              <textarea
                rows={4}
                value={form.flujoPasos}
                onChange={(e) => setField("flujoPasos", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Salidas">
              <textarea
                rows={4}
                value={form.flujoSalidas}
                onChange={(e) => setField("flujoSalidas", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </fieldset>

        <RecursoListEditor
          label="Prompts personalizados"
          description="Prompts que el champion diseñó o afinó. Usa ↑↓ para ordenar; el orden se muestra en el marketplace."
          items={form.prompts}
          onChange={(items) => setField("prompts", items)}
          addLabel="+ Añadir prompt"
          emptyHint="Aún no hay prompts. Añade los que quieras compartir con otros equipos."
        />

        <RecursoListEditor
          label="Skills"
          description="Skills o instrucciones reutilizables del caso. Misma lógica de orden y copia en la ficha pública."
          items={form.skills}
          onChange={(items) => setField("skills", items)}
          addLabel="+ Añadir skill"
          emptyHint="Aún no hay skills documentadas."
        />

        <fieldset className="rounded-xl border border-ink-muted/10 p-4">
          <legend className="px-1 text-sm font-semibold text-brand">Métricas</legend>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Adopción (nivel)">
              <input
                value={form.adopcion_nivel ?? ""}
                onChange={(e) => setField("adopcion_nivel", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Participación (nivel)">
              <input
                value={form.participacion_nivel ?? ""}
                onChange={(e) => setField("participacion_nivel", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Eficiencia (resumen)">
              <input
                value={form.eficiencia_resumen ?? ""}
                onChange={(e) => setField("eficiencia_resumen", e.target.value)}
                className={inputClass}
                placeholder="~6 h → 30 min"
              />
            </Field>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Adopción (detalle)">
              <textarea
                rows={2}
                value={form.adopcion_detalle ?? ""}
                onChange={(e) => setField("adopcion_detalle", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Participación (detalle)">
              <textarea
                rows={2}
                value={form.participacion_detalle ?? ""}
                onChange={(e) => setField("participacion_detalle", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Eficiencia (detalle)">
              <textarea
                rows={2}
                value={form.eficiencia_detalle ?? ""}
                onChange={(e) => setField("eficiencia_detalle", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </fieldset>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl bg-surface p-4 ring-1 ring-ink-muted/10">
          <h2 className="font-serif text-lg font-semibold text-brand">Asistente</h2>
          <p className="mt-1 text-xs text-ink-muted">
            Pega notas o un borrador. Sugiere campos; tú decides qué aplicar.
          </p>
          <textarea
            rows={8}
            value={assistText}
            onChange={(e) => setAssistText(e.target.value)}
            className={`mt-3 ${inputClass}`}
            placeholder="Pega aquí el texto libre…"
          />
          <button
            type="button"
            disabled={assistLoading || assistText.trim().length < 10}
            onClick={() => void onAssist()}
            className="mt-3 w-full rounded-lg bg-ink px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {assistLoading ? "Pensando…" : "Sugerir campos"}
          </button>
          {applyNotice ? (
            <p
              role="status"
              className="mt-2 rounded-lg bg-brand/10 px-3 py-2 text-xs font-medium text-brand"
            >
              {applyNotice}
            </p>
          ) : null}
          {suggestionEntries.length > 0 ? (
            <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {suggestionEntries.map(([key, value]) => (
                <li
                  key={key}
                  className="rounded-lg bg-surface-muted px-3 py-2 text-xs text-ink"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="font-semibold text-brand">{key}</span>
                    <button
                      type="button"
                      className={
                        appliedKeys.has(key)
                          ? "rounded bg-ink/10 px-2 py-0.5 text-[10px] font-medium text-ink"
                          : "rounded bg-brand px-2 py-0.5 text-[10px] font-medium text-white"
                      }
                      onClick={() => applySuggestion(key, value)}
                    >
                      {appliedKeys.has(key) ? "Aplicado ✓" : "Aplicar"}
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap break-words font-sans text-[11px] text-ink-muted">
                    {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded-lg border border-ink-muted/20 bg-surface-muted px-3 py-2 text-sm text-ink";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <label className="block text-sm">
      <span className="font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}
