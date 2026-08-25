# Decisiones de arquitectura — Marketplace Proyecto Salto

## v2 — Backend + BDD + panel de coaches (2026-07-20)

### Separación front / back (monorepo)

- **Front:** Next.js (App Router) en `frontend/`, deploy en Vercel (Root Directory = `frontend/`). Marketplace público + panel `/admin`.
- **Backend:** FastAPI en `backend/`, deploy en Railway (Root Directory = `backend/`) + PostgreSQL. API versionada `/api/v1/...`.
- **BFF:** Route Handlers de Next guardan JWT en cookie httpOnly y hacen proxy a la API (evita cookies cross-site).
- Cada carpeta tiene su propio ciclo de vida (deps, build, deploy) sin herramientas de monorepo (Turborepo/Nx): son dos stacks distintos (Node vs Python) y el tráfico es bajo, no se justifica la complejidad extra.

### Contenido estructurado (sin Markdown vivo)

Los casos viven en PostgreSQL como campos tipados (descripción, problema, valor, público, alcance, diseño, flujo JSON, etapas, métricas). El Markdown de `content/casos/` se migró una vez y deja de ser fuente de verdad.

### Flujo como pasos estructurados

`flujo` es JSON `{ entradas[], pasos[], salidas[] }`. El front lo dibuja; no hay Mermaid.

`prompts` y `skills` son JSON `[{ titulo, contenido }, ...]`. El orden público es el índice del array (reordenable en admin con ↑↓). La home no filtra por chips de tags: demasiada saturación; los tags siguen en la ficha del caso.

### Avance libre + tabs de exploración (2026-08-06)

`avance_pct` deja de derivarse de `etapa_actual` (ya no es fijo 25/50/75/100): es una columna propia, editable en el admin con cualquier valor 0-100. `etapa_actual` se mantiene aparte y sigue alimentando el checklist de 4 etapas; ambos conviven sin acoplarse.

Se agregan `coach` (jhonatan | dario) y `ola` (ola_1 | ola_2 | ola_3) como enums cerrados (no texto libre), porque son catálogos fijos y pequeños — mismo patrón que `etapa_actual`/`estado`.

La home reemplaza el agrupado único por champion por 4 tabs: Área, Coach, Ola y Lista (tabla plana). El PDF consolidado (`GET /api/v1/casos/export.pdf`) se genera en el backend con `reportlab` (BSD) para mantener trazabilidad y evitar dependencias de sistema (se descartó `weasyprint` por requerir Pango/Cairo nativos en Railway).

### Avance y estado (conviven)

- `etapa_actual`: identificacion | diseno | implementacion | marketplace (25% cada una; badge público).
- `estado`: enproceso | implementado | publicado (vitrina / filtro).
- Derivados en lectura: `avance_pct`, checklist de etapas, `dias_activo`.

### Vitrina pública (opción B)

Detalle público: narrativa estructurada + tarjeta de avance + 3 métricas (adopción, participación, percepción de eficiencia). Sin login.

### Módulos de aprendizaje y progreso (2026-08-25)

El Módulo 9 (Pedagogía para entornos digitales) se sirve como HTML estático en el front (`/aprendizaje/modulo-9`). El contenido no va a PostgreSQL: cambia poco y es un artefacto pedagógico, no un caso de uso.

Sí se persiste el **progreso por usuario autenticado**:

- `modulos_aprendizaje`: catálogo (slug, título, pasos). Seed inicial `pedagogia-entornos-digitales`.
- `modulos_progreso`: un registro por `(user_id, modulo_slug)` con JSONB `visited`, `quizzes`, `matrix`, `reflexiones`. JSONB a propósito — el set de checkpoints/chips es propio de cada módulo y no justifica una tabla por pregunta.

API: `GET/PUT /api/v1/modulos/{slug}/progreso` (JWT). El HTML llama al BFF `/api/admin/proxy`. `completed_at` se sella la primera vez que el usuario visita el último paso.

### Auth y roles

- Registro: email + password (hash argon2) → rol `viewer`.
- Roles: `super_admin` (todo), `coach` (solo casos con `owner_user_id` = él), `viewer` (sin escritura hasta promoción).
- JWT emitido por FastAPI; cookie de sesión vía BFF.

### Asistente LLM

Endpoint admin que envía texto libre a Anthropic (key solo en backend). Devuelve JSON sugerido por campos; el coach aplica y guarda explícitamente.

### Lectura pública e ISR

Next hace fetch a la API con revalidate; al publicar/editar el backend llama al webhook `/api/revalidate` del front.

### Paleta de color (placeholder)

Tokens en `globals.css`: primario `#C8102E`, acento `#8C1A2B`, tinta `#1A1A1A` / `#5A5A5A`, fondos `#FFFFFF` / `#F5F5F5`.

## Histórico v1 (superseded)

Markdown + Git, SSG puro, MDX/Mermaid, sin auth. Sustituido por v2.
