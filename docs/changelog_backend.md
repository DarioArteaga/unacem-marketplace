# Changelog Backend

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
