# Changelog Frontend

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
