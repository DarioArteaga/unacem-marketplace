# Changelog Backend

- [2026-07-20] [FIX] Normalizar `DATABASE_URL` de Railway (`postgres://` / `postgresql://` → `postgresql+psycopg://`) para evitar fallos de conexión en Alembic/uvicorn.
  Archivos modificados: backend/app/core/config.py, backend/.env.example, docs/changelog_backend.md

- [2026-07-20] [FEAT] API FastAPI v2: auth JWT, CRUD casos con ownership, asistente LLM Anthropic, migración Markdown→BDD.
  Archivos modificados: backend/, docs/schema.dbml, docs/architecture_decisions.md, docs/changelog_backend.md, docs/index.md
