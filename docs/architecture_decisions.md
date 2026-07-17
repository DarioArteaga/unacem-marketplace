# Decisiones de arquitectura — Marketplace Proyecto Salto

## Contenido en Markdown + Git

Los casos viven en `content/casos/*.md` con front-matter YAML. Una sola persona (coach del programa) edita archivos y hace push; Vercel redespliega. No hay CMS ni base de datos.

## Generación estática (SSG)

Todas las rutas se prerenderizan en build con `generateStaticParams`. No hay fetch en runtime. Hosting en Vercel con el runtime de Next (sin `output: 'export'`).

## Validación de front-matter con Zod

Campos obligatorios: `titulo`, `champion`, `area`, `resumen`, `tags`. Un error de validación aborta el build con mensaje que indica archivo y campo faltante.

## MDX remoto + Mermaid en cliente

El cuerpo se renderiza con `next-mdx-remote/rsc`. Los bloques `mermaid` se delegan a un client component que importa `mermaid` de forma dinámica (lazy) y aplica la paleta de marca. Errores de sintaxis muestran un mensaje discreto sin romper la página.

## Tags temáticos y de estado

Los casos llevan tags en el front-matter. Además de temas (`impuestos`, `automatización`, etc.), se admite el tag de estado `enproceso` para casos aún en desarrollo (intake sin solución documentada). En UI se muestra como "En proceso" y se estiliza distinto. Al cerrar el case study, se elimina `enproceso` del array. Definición en `src/lib/tags.ts`.

## Paleta de color (placeholder)

Tokens en `globals.css`: primario `#C8102E`, acento `#8C1A2B`, tinta `#1A1A1A` / `#5A5A5A`, fondos `#FFFFFF` / `#F5F5F5`. Pendiente de confirmar contra el manual de marca UNACEM.

## Alcance deliberadamente reducido

Sin autenticación, sin estados de proyecto, sin analytics de terceros, sin página `/acerca`, sin CTA `mailto` en el detalle del caso.
