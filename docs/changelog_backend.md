# Changelog Backend

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
