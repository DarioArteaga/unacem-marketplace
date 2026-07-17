# Proyecto Salto — Marketplace de casos de uso

Sitio estático que muestra los casos de uso de IA desarrollados por champions de Grupo UNACEM. El contenido vive en archivos Markdown; al hacer push, Vercel redespliega el sitio.

Documentación técnica adicional (documentación viva): [docs/index.md](docs/index.md).

## Requisitos

- Node.js 20 o superior
- npm

## Cómo correr en local

1. Abre una terminal en la raíz del proyecto.
2. Instala dependencias:

```powershell
npm install
```

1. Arranca el servidor de desarrollo:

```powershell
npm run dev
```

1. Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Para generar el sitio estático (igual que en Vercel):

```powershell
npm run build
npm start
```



## Cómo agregar un caso nuevo

No hace falta tocar código de React ni de Next.js. Solo creas un archivo Markdown y haces push.

### Paso 1 — Crear el archivo

En la carpeta `content/casos/`, crea un archivo `.md`. El **nombre del archivo** será la URL.


| Archivo                          | URL                    |
| -------------------------------- | ---------------------- |
| `content/casos/mi-nuevo-caso.md` | `/casos/mi-nuevo-caso` |


Usa solo minúsculas, números y guiones (sin espacios ni acentos en el nombre del archivo).

### Paso 2 — Completar el encabezado (front-matter)

Al inicio del archivo, entre `---`, van estos campos:

```yaml
---
titulo: "Título corto del caso"
champion: "Nombre de la persona o equipo"
area: "Área, país o unidad"
resumen: "Una línea que aparece en la tarjeta (máximo 140 caracteres)"
herramienta: "Claude"
estado: "enproceso"
tags: ["finanzas", "automatización"]
orden: 4
fecha: "2026-07-16"
---
```

**Obligatorios:** `titulo`, `champion`, `area`, `resumen`, `tags`.  
**Opcionales:** `herramienta`, `estado`, `orden`, `fecha`.

- Si falta un campo obligatorio, `npm run build` falla e indica el archivo y el campo.
- `orden` controla la posición en el grid (menor número = primero). Si no hay `orden`, se ordena por `fecha` (más reciente primero).

### Estado y tags

| Campo | Valores | Uso |
|---|---|---|
| `estado` | `enproceso` (también acepta `en proceso`), `implementado` o `publicado` | Madurez del caso. Badge en card y detalle: **En proceso** (rojo) o **Implementado** / **Publicado** (neutro). |
| `tags` | solo temas, ej. `impuestos` | Filtro temático. **No** pongas el estado aquí. |

Cuando el case study esté cerrado: `estado: "publicado"` (o quita el campo).

### Paso 3 — Escribir el cuerpo

Estructura del formatter actual (el sitio renderiza cualquier Markdown; esta es la convención):

```markdown
## El problema
...

## Cómo se hace hoy
...

## El caso en datos

| | |
|---|---|
| Qué lo dispara | ... |
| Qué necesita | ... |
| Qué entrega | ... |
| Herramientas de siempre | ... |

## Qué se está construyendo
...
(o ## Cómo se resolvió / ## El impacto cuando el caso ya está cerrado)

## El flujo

(bloque mermaid)

## Qué se espera lograr
...
```

### Paso 4 — Diagramas Mermaid

Dentro del bloque de código con lenguaje `mermaid` escribe un diagrama válido. Ejemplos comunes:

- `flowchart LR` — flujo de izquierda a derecha  
- `flowchart TD` — de arriba hacia abajo

Si la sintaxis es inválida, la página no se rompe: se muestra un mensaje discreto en lugar del diagrama.

### Paso 5 — Publicar

1. Guarda el archivo.
2. En local, opcional: `npm run build` para validar.
3. Haz commit y push a la rama que despliega Vercel.
4. Vercel redespliega solo; el nuevo caso aparece en la home.



## Estructura del proyecto

```
content/casos/          ← aquí van los casos (Markdown)
src/app/                ← páginas (home y detalle)
src/components/         ← UI (cards, filtros, Mermaid)
src/lib/                ← lectura y validación del contenido
docs/                   ← changelog y decisiones técnicas
```


| Ruta            | Qué hace                                                        |
| --------------- | --------------------------------------------------------------- |
| `/`             | Hero + cards de champion → casos del champion + filtro por tags |
| `/casos/[slug]` | Mini case study con diagrama                                    |




## Comandos útiles


| Comando         | Descripción                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Desarrollo local                         |
| `npm run build` | Build estático + validación de contenido |
| `npm run lint`  | Linter                                   |




## Despliegue en Vercel

Conecta este repositorio a Vercel. Framework: Next.js. No se requiere base de datos ni variables de entorno para el MVP.