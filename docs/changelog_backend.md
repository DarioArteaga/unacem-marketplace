# Changelog Backend

- [2026-08-27] [FEAT] Script PowerShell `scripts/sync-azure-repos.ps1` para copiar `backend/` (y `docs/` en `docs/codigo`) al clone `salto-usecase-marketplace-api` sin secretos ni `.venv`; conserva README y ADRs de Azure. No hace git push.
  Archivos modificados: scripts/sync-azure-repos.ps1, docs/architecture_decisions.md, docs/changelog_backend.md

- [2026-08-25] [FEAT] Módulos de aprendizaje: tablas `modulos_aprendizaje` y `modulos_progreso` (JSONB de visited/quizzes/matrix/reflexiones), migración Alembic `004` con seed del Módulo 9. API autenticada `GET/PUT /api/v1/modulos/{slug}/progreso`.
  Archivos modificados: backend/app/models/modulo.py, backend/app/models/user.py, backend/app/models/__init__.py, backend/app/schemas/modulo.py, backend/app/services/modulos.py, backend/app/api/v1/modulos.py, backend/app/api/v1/__init__.py, backend/alembic/versions/004_modulos_aprendizaje.py, backend/alembic/env.py, docs/schema.dbml, docs/architecture_decisions.md, docs/index.md, docs/changelog_backend.md

- [2026-08-12] [FEAT] Script `scripts/bulk_set_coach_ola.py` para asignación masiva de coach/ola por título exacto (reporta títulos no encontrados). Ejecutado una vez contra producción para asignar coach=Darío/ola=Ola 2 a 11 casos sin coach/ola asignados.
  Archivos modificados: backend/scripts/bulk_set_coach_ola.py, docs/changelog_backend.md

- [2026-08-12] [FEAT] PDF catálogo: nueva columna "Resumen" (campo `resumen`, ≤140 caracteres) para dar una idea rápida del caso en la tabla; se descartó `descripcion` por ser opcional y de longitud libre, poco apta para una columna de tabla.
  Archivos modificados: backend/app/services/pdf.py, docs/changelog_backend.md

- [2026-08-06] [FIX] PDF ficha individual: la tabla "El flujo" modelaba Entradas/Pasos/Salidas como filas correlacionadas 1 a 1, generando filas ragged y celdas vacías cuando las listas tenían distinta longitud (no son correspondientes entre sí). Ahora es una sola fila con 3 columnas, cada una con su propia lista numerada, igual al diseño de la ficha web (`FlujoPasos.tsx`). Verificado re-renderizando a imagen con el caso reportado por el usuario.
  Archivos modificados: backend/app/services/pdf.py, docs/changelog_backend.md

- [2026-08-06] [FIX] Generación de PDF: las celdas de tabla (flujo, métricas, catálogo) usaban strings planos y no hacían word-wrap, desbordando y superponiendo texto largo. Ahora todas usan `Paragraph` con escapado de `&`/`<`/`>`; anchos de columna recalculados para caber en la página. Verificado renderizando a imagen con casos de prueba (texto largo, símbolos especiales).
  Archivos modificados: backend/app/services/pdf.py, docs/changelog_backend.md

- [2026-08-06] [FEAT] Endpoint `GET /api/v1/casos/{slug}/export.pdf`: ficha individual del caso en PDF (descripción, flujo, métricas), para la vista pública de detalle.
  Archivos modificados: backend/app/services/pdf.py, backend/app/api/v1/casos_public.py, docs/changelog_backend.md

- [2026-08-06] [FEAT] Casos: campos `coach` (enum jhonatan/dario) y `ola` (enum ola_1/2/3); `avance_pct` pasa de derivado (25/50/75/100 según etapa) a columna editable libre (0-100). Migración Alembic `003` con backfill del valor previo. Endpoint `GET /api/v1/casos/export.pdf`: descarga consolidada del catálogo público en PDF (reportlab, licencia BSD).
  Archivos modificados: backend/app/models/caso.py, backend/app/schemas/caso.py, backend/app/services/casos.py, backend/app/services/pdf.py, backend/app/api/v1/casos_public.py, backend/alembic/versions/003_casos_coach_ola_avance.py, backend/requirements.txt, docs/schema.dbml, docs/architecture_decisions.md, docs/changelog_backend.md

- [2026-08-04] [FIX] Asistente: `max_tokens` 4096, campos de salida acotados, y error 502 visible si el JSON llega truncado/vacío (antes devolvía 200 vacío).
  Archivos modificados: backend/app/services/assist.py, docs/changelog_backend.md

- [2026-08-04] [FEAT] Casos: campos JSONB `prompts` y `skills` (`[{titulo, contenido}]`, orden = índice); migración Alembic `002`.
  Archivos modificados: backend/app/models/caso.py, backend/app/schemas/caso.py, backend/app/services/casos.py, backend/alembic/versions/002_casos_prompts_skills.py, docs/schema.dbml, docs/architecture_decisions.md, docs/changelog_backend.md

- [2026-07-21] [FIX] Default `ANTHROPIC_MODEL` → `claude-sonnet-5` (el ID anterior ya no existe); errores Anthropic se responden como 502 con mensaje claro.
  Archivos modificados: backend/app/core/config.py, backend/app/services/assist.py, backend/.env.example, README.md, docs/changelog_backend.md

- [2026-07-20] [FEAT] Modelo del asistente LLM configurable con `ANTHROPIC_MODEL` (default `claude-sonnet-4-20250514`).
  Archivos modificados: backend/app/core/config.py, backend/app/services/assist.py, backend/.env.example, README.md, docs/changelog_backend.md

- [2026-07-20] [FIX] Normalizar `DATABASE_URL` de Railway (`postgres://` / `postgresql://` → `postgresql+psycopg://`) para evitar fallos de conexión en Alembic/uvicorn.
  Archivos modificados: backend/app/core/config.py, backend/.env.example, docs/changelog_backend.md

- [2026-07-20] [FEAT] API FastAPI v2: auth JWT, CRUD casos con ownership, asistente LLM Anthropic, migración Markdown→BDD.
  Archivos modificados: backend/, docs/schema.dbml, docs/architecture_decisions.md, docs/changelog_backend.md, docs/index.md
