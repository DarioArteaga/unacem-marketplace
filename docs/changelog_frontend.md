# Changelog Frontend

- [2026-08-25] [FEAT] Home: tabs "Métricas de uso" (tablero de catálogo público: avance, etapa, coach, ola, casos al 100%) y "Aprendizaje" (acceso al Módulo 9).
  Archivos modificados: frontend/src/components/CasoGrid.tsx, frontend/src/components/MetricasUsoDashboard.tsx, frontend/src/components/AprendizajePanel.tsx, docs/changelog_frontend.md

- [2026-08-25] [FEAT] Módulo 9 asíncrono en `/aprendizaje/modulo-9` (HTML estático con persistencia de progreso vía BFF). Matriz drag-and-drop mueve chips a cuadrantes y permite reintentar. Enlace "Módulo 9" en el admin. Requiere sesión.
  Archivos modificados: frontend/public/aprendizaje/modulo-9.html, frontend/src/app/aprendizaje/layout.tsx, frontend/src/app/aprendizaje/modulo-9/page.tsx, frontend/src/app/admin/layout.tsx, frontend/src/components/SiteChrome.tsx, frontend/src/lib/api/types.ts, docs/changelog_frontend.md

- [2026-08-20] [FEAT] Badge "Completado" en las cards (y en la vista lista) cuando `avance_pct` es 100%; la card también gana un borde de marca más marcado.
  Archivos modificados: frontend/src/components/CompletadoBadge.tsx, frontend/src/components/CasoCard.tsx, frontend/src/components/CasoGrid.tsx, docs/changelog_frontend.md

- [2026-08-12] [FEAT] Filtros por columna en encabezados: admin "Casos" (título, champion, coach, ola, etapa, público) y home "Vista por lista" (título, champion, área, coach, ola, etapa), con contador de resultados y botón "Limpiar filtros". Componentes reutilizables `SelectFilter`/`TextFilter`.
  Archivos modificados: frontend/src/components/TableColumnFilter.tsx, frontend/src/components/admin/AdminCasosTable.tsx, frontend/src/app/admin/page.tsx, frontend/src/components/CasoGrid.tsx, docs/changelog_frontend.md

- [2026-08-12] [FEAT] Home, tab "Vista por lista": nueva columna "Resumen" (campo `resumen`) para dar una idea rápida del caso sin abrir la ficha.
  Archivos modificados: frontend/src/components/CasoGrid.tsx, docs/changelog_frontend.md

- [2026-08-06] [FEAT] Ficha pública de caso: botón "Descargar ficha (PDF)" vía proxy same-origin `/api/casos/[slug]/export-pdf`.
  Archivos modificados: frontend/src/app/casos/[slug]/page.tsx, frontend/src/app/api/casos/[slug]/export-pdf/route.ts, docs/changelog_frontend.md

- [2026-08-06] [FEAT] Home con 4 tabs (Área, Coach, Ola, Lista) reemplazando el agrupado único por champion; tab Lista es tabla plana con enlaces directos. Botón "Descargar catálogo (PDF)" vía proxy same-origin. Editor admin: selects de Coach/Ola y avance % editable libre (slider + input numérico, ya no atado a la etapa). Admin lista de casos: columnas Coach/Ola.
  Archivos modificados: frontend/src/lib/api/types.ts, frontend/src/lib/admin/casoFormSchema.ts, frontend/src/lib/etapa.ts, frontend/src/components/admin/CasoEditor.tsx, frontend/src/components/AvanceCard.tsx, frontend/src/components/CasoGrid.tsx, frontend/src/components/GroupCard.tsx (reemplaza ChampionCard.tsx), frontend/src/app/page.tsx, frontend/src/app/admin/page.tsx, frontend/src/app/api/casos/export-pdf/route.ts, docs/changelog_frontend.md

- [2026-08-04] [FEAT] Admin lista de casos: el título publicado enlaza a la ficha pública (`/casos/[slug]`) en pestaña nueva.
  Archivos modificados: frontend/src/app/admin/page.tsx, docs/changelog_frontend.md

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
