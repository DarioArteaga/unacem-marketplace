# Changelog Frontend

- [2026-08-04] [FIX] Asistente admin: aviso si la sugerencia llega vacía; limpia resultado previo ante error del BFF.
  Archivos modificados: frontend/src/components/admin/CasoEditor.tsx, docs/changelog_frontend.md

- [2026-08-04] [FEAT] Prompts y skills en editor admin (lista ordenable ↑↓) y ficha pública (acordeón + copiar); se retira el filtro por chips de tags en home.
  Archivos modificados: frontend/src/lib/api/types.ts, frontend/src/lib/admin/casoFormSchema.ts, frontend/src/components/admin/CasoEditor.tsx, frontend/src/components/admin/RecursoListEditor.tsx, frontend/src/components/RecursosCaso.tsx, frontend/src/app/casos/[slug]/page.tsx, frontend/src/components/CasoGrid.tsx, frontend/src/app/page.tsx, docs/changelog_frontend.md

- [2026-07-21] [FIX] Asistente LLM: feedback al aplicar campo (aviso + botón «Aplicado ✓»).
  Archivos modificados: frontend/src/components/admin/CasoEditor.tsx, docs/changelog_frontend.md

- [2026-07-21] [FIX] UX editor admin: estados Borrador/Publicado, Guardar cambios vs Publicar, tras publicar abre formulario de nuevo caso.
  Archivos modificados: frontend/src/components/admin/CasoEditor.tsx, docs/changelog_frontend.md

- [2026-07-21] [FIX] AvanceCard: fechas/métricas en columna (evita overflow en sidebar 320px); etiqueta «Actualizado» y aclaración de días activo.
  Archivos modificados: frontend/src/components/AvanceCard.tsx, docs/changelog_frontend.md

- [2026-07-20] [REFACTOR] Monorepo explícito: el proyecto Next.js se mueve de la raíz a `frontend/` (hermano de `backend/`) para deploys independientes y mayor control de rutas.
  Archivos modificados: frontend/** (movido desde raíz), frontend/.gitignore, .gitignore, backend/scripts/migrate_markdown.py, README.md, docs/architecture_decisions.md, docs/changelog_frontend.md

- [2026-07-20] [FEAT] Marketplace v2: consume API FastAPI (ISR), AvanceCard/Metricas/FlujoPasos, panel /admin con BFF cookie, asistente LLM y gestión de roles; se retira MDX/Mermaid.
  Archivos modificados: src/app/page.tsx, src/app/casos/[slug]/page.tsx, src/app/layout.tsx, src/app/globals.css, src/app/admin/**, src/app/api/**, src/middleware.ts, src/components/AvanceCard.tsx, src/components/MetricasCaso.tsx, src/components/FlujoPasos.tsx, src/components/CasoCard.tsx, src/components/CasoGrid.tsx, src/components/SiteChrome.tsx, src/components/admin/**, src/lib/api/**, src/lib/admin/**, src/lib/etapa.ts, src/lib/tags.ts, package.json, .env.example, README.md, docs/changelog_frontend.md

- [2026-07-17] [FEAT] Badge visible para `implementado` / `publicado` (estilo neutro) además de `enproceso` (rojo).
  Archivos modificados: src/components/EstadoBadge.tsx, src/components/CasoCard.tsx, README.md, docs/changelog_frontend.md

- [2026-07-17] [FIX] Aceptar `estado: "implementado"` y normalizar `en proceso` → `enproceso` (el build de Vercel fallaba al validar el front-matter).
  Archivos modificados: src/lib/estado.ts, src/lib/schema.ts, src/components/EstadoBadge.tsx, src/components/CasoCard.tsx, content/casos/conciliacion-registros-contables.md, README.md, docs/architecture_decisions.md, docs/changelog_frontend.md

- [2026-07-17] [FEAT] Formatter v2: campo `estado`, tags solo temáticos, tablas GFM y estilos para la nueva estructura de secciones del caso.
  Archivos modificados: src/lib/schema.ts, src/lib/estado.ts, src/lib/tags.ts, src/lib/casos.ts, src/components/MdxContent.tsx, src/components/EstadoBadge.tsx, src/components/TagBadge.tsx, src/components/TagFilter.tsx, src/components/CasoCard.tsx, src/components/CasoGrid.tsx, src/app/page.tsx, src/app/casos/[slug]/page.tsx, content/casos/certificados-retencion-proveedores-exterior.md, content/casos/liquidacion-mensual-igv.md, content/casos/conciliacion-registros-contables.md, package.json, README.md, docs/architecture_decisions.md, docs/changelog_frontend.md

- [2026-07-17] [FEAT] Home con cards de champion como índice; al seleccionar se listan sus casos (filtro por tags se mantiene).
  Archivos modificados: src/components/ChampionCard.tsx, src/components/CasoGrid.tsx, docs/changelog_frontend.md, README.md

- [2026-07-17] [FEAT] Home agrupa casos por champion; el filtro por tags se mantiene dentro de esos grupos.
  Archivos modificados: src/components/CasoGrid.tsx, docs/changelog_frontend.md

- [2026-07-17] [FEAT] Convención de tags de estado (`enproceso` → "En proceso") con estilo distinto; casos Jennifer de Impuestos como contenido en proceso.
  Archivos modificados: src/lib/tags.ts, src/components/TagBadge.tsx, src/components/TagFilter.tsx, src/components/CasoCard.tsx, src/app/casos/[slug]/page.tsx, content/casos/certificados-retencion-proveedores-exterior.md, content/casos/liquidacion-mensual-igv.md, content/casos/conciliacion-registros-contables.md, README.md, docs/architecture_decisions.md, docs/changelog_frontend.md

- [2026-07-16] [FEAT] Spinner de carga con marca UNACEM y texto "Cargando" al abrir un caso.
  Archivos modificados: src/components/UnacemLoader.tsx, src/components/CasoCard.tsx, src/app/casos/[slug]/loading.tsx, docs/changelog_frontend.md

- [2026-07-16] [FIX] Nav en fondo negro (#1A1A1A) para contraste del logo rojo sobre el header.
  Archivos modificados: src/components/SiteHeader.tsx, docs/changelog_frontend.md

- [2026-07-16] [FEAT] Logos Grupo UNACEM en nav/footer y favicon (assets en public/brand, fondo negro removido).
  Archivos modificados: public/brand/grupo-unacem-horizontal.png, public/brand/unacem-vertical.png, public/brand/unacem-mark.png, public/favicon.png, src/app/icon.png, src/components/SiteHeader.tsx, src/components/SiteFooter.tsx, src/app/layout.tsx, docs/changelog_frontend.md

- [2026-07-16] [REFACTOR] Paleta placeholder UNACEM (rojo #C8102E / acento #8C1A2B) y estados hover/focus reforzados en cards y chips.
  Archivos modificados: src/app/globals.css, src/components/CasoCard.tsx, src/components/TagFilter.tsx, src/components/MermaidDiagram.tsx, src/components/SiteHeader.tsx, src/app/page.tsx, src/app/casos/[slug]/page.tsx, src/app/not-found.tsx, docs/architecture_decisions.md, docs/changelog_frontend.md

- [2026-07-16] [FEAT] Marketplace estático Proyecto Salto: home con grid y filtro por tags, detalle de caso con MDX y Mermaid, contenido seed y validación Zod de front-matter.
  Archivos modificados: package.json, src/app/layout.tsx, src/app/page.tsx, src/app/globals.css, src/app/not-found.tsx, src/app/casos/[slug]/page.tsx, src/components/SiteHeader.tsx, src/components/SiteFooter.tsx, src/components/CasoCard.tsx, src/components/CasoGrid.tsx, src/components/TagFilter.tsx, src/components/MdxContent.tsx, src/components/MermaidDiagram.tsx, src/lib/casos.ts, src/lib/schema.ts, src/lib/site.ts, src/lib/logger.ts, content/casos/conciliacion-contable.md, content/casos/cartas-fianza.md, content/casos/clasificador-materiales.md, README.md, docs/index.md, docs/changelog_frontend.md, docs/architecture_decisions.md, docs/changelog_backend.md
