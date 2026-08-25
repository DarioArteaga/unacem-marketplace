# Proyecto Salto — Marketplace de casos de uso

Marketplace público de casos de IA del Proyecto Salto (Grupo UNACEM), con panel de coaches.

Monorepo con dos proyectos independientes:

```
marketplace-unacem/
├── frontend/   # Next.js (Vercel) — lectura pública + /admin
├── backend/    # FastAPI (Railway) + PostgreSQL
└── docs/       # Documentación viva
```

- **Front:** Next.js (Vercel) — lectura pública + `/admin`
- **API:** FastAPI (Railway) + PostgreSQL
- **Auth:** email/password, JWT en cookie httpOnly vía BFF

Documentación viva: [docs/index.md](docs/index.md).

## Requisitos

- Node.js 20+
- Python 3.11+
- PostgreSQL 16+

## Variables de entorno

### Front (`frontend/` / Vercel)

Copia [`frontend/.env.example`](frontend/.env.example) a `frontend/.env.local`:

| Variable | Uso |
|---|---|
| `BACKEND_API_URL` | URL del API (ej. `http://localhost:8000`) |
| `REVALIDATE_SECRET` | Token compartido con el backend para ISR on-demand |

### Backend (`backend/` / Railway)

Copia [`backend/.env.example`](backend/.env.example) a `backend/.env`:

| Variable | Uso |
|---|---|
| `DATABASE_URL` | URL de Postgres. En Railway: **Variable Reference** desde el servicio Postgres (no uses `localhost`). La app también acepta `postgres://` / `postgresql://`. |
| `JWT_SECRET` | Secreto JWT |
| `ANTHROPIC_API_KEY` | Asistente LLM (opcional en local) |
| `ANTHROPIC_MODEL` | Modelo Anthropic (default: `claude-sonnet-5`). Ej.: `claude-sonnet-5`, `claude-opus-4-8`, `claude-haiku-4-5` |
| `ALLOWED_ORIGINS` | Orígenes CORS (URL del front) |
| `SUPER_ADMIN_EMAIL` / `PASSWORD` / `NOMBRE` | Bootstrap del super_admin |
| `REVALIDATE_URL` | `https://tu-front/api/revalidate` |
| `REVALIDATE_SECRET` | Mismo valor que en el front |

## Cómo correr en local

### 1. PostgreSQL + API (`backend/`)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
# Edita DATABASE_URL y SUPER_ADMIN_*
alembic upgrade head
python scripts\seed_admin.py
# Opcional — migrar Markdown histórico una vez:
python scripts\migrate_markdown.py
uvicorn app.main:app --reload --port 8000
```

Health: [http://localhost:8000/health](http://localhost:8000/health) · Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Front (`frontend/`)

```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Panel: [http://localhost:3000/admin](http://localhost:3000/admin). Módulo 9: [http://localhost:3000/aprendizaje/modulo-9](http://localhost:3000/aprendizaje/modulo-9).

## Roles

| Rol | Permisos |
|---|---|
| `viewer` | Registro por defecto; sin escritura |
| `coach` | Crea/edita/publica **sus** casos |
| `super_admin` | Todos los casos + gestión de roles |

## Modelo de caso (v2)

Caso 100% estructurado (sin Markdown vivo ni Mermaid):

- Narrativa: descripción, problema, público, diseño, valor, alcance
- Flujo: entradas → pasos → salidas
- Pipeline: `etapa_actual` (Identificación → Diseño → Implementación → Marketplace; 25% c/u)
- Vitrina: `estado` (`enproceso` \| `implementado` \| `publicado`)
- Métricas: adopción, participación, percepción de eficiencia
- Derivados en lectura: `avance_pct`, checklist, `dias_activo`

Los `.md` en `frontend/content/casos/` son histórico; la fuente de verdad es PostgreSQL.

## Despliegue

### Railway (backend)

1. Nuevo proyecto + plugin PostgreSQL.
2. Servicio con **Root Directory** = `backend/`.
3. Variables de entorno (tabla de arriba).
4. Deploy corre `alembic upgrade head` y arranca uvicorn (`railway.toml`).
5. Tras el primer deploy: ejecutar `seed_admin` (one-off) y, si aplica, `migrate_markdown`.

### Vercel (front)

1. **Root Directory** = `frontend/` (ajustar en configuración del proyecto Vercel).
2. Env: `BACKEND_API_URL`, `REVALIDATE_SECRET`.
3. Al publicar/editar, el API llama a `/api/revalidate`.

## API (resumen)

Público: `GET /api/v1/casos`, `GET /api/v1/casos/{slug}`, `GET /api/v1/champions`, `GET /api/v1/tags`.

Auth: `POST /api/v1/auth/register|login`, `GET /api/v1/auth/me`.

Admin: CRUD `/api/v1/admin/casos`, publicar, `POST /api/v1/admin/assist`, usuarios (super_admin). Módulos: `GET /api/v1/modulos`, `GET/PUT /api/v1/modulos/{slug}/progreso`.
