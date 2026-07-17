---
titulo: "Clasificar materiales del catálogo automáticamente"
champion: "Aarón Díaz"
area: "[por confirmar]"
resumen: "Una herramienta con inteligencia artificial asigna el código de catálogo correcto a cada material en segundos."
herramienta: "Claude"
estado: "implementado"
tags: ["catalogo", "automatizacion", "compras", "abastecimiento"]
fecha: "2026-07-17"
---

## El problema

Cada material que la empresa compra o almacena necesita un código de catálogo estándar que lo identifique correctamente. Asignar ese código a mano, uno por uno, es lento y exige conocer una clasificación con decenas de categorías y cientos de subcategorías. Con miles de materiales por clasificar, el trabajo se vuelve interminable y es fácil equivocarse.

## Cómo se hace hoy

Para clasificar un material, una persona tiene que:

1. Leer la descripción del material y entender qué es en realidad, más allá de la marca o el número de parte.
2. Buscar entre 55 grandes categorías cuál le corresponde.
3. Dentro de esa categoría, ir bajando hasta la subcategoría y el código exacto entre cientos de opciones.
4. Repetir el proceso material por material.

Con decenas de miles de materiales pendientes, hacerlo así toma muchísimo tiempo y depende de la experiencia de quien clasifica.

## El caso en datos

| | |
|---|---|
| Qué lo dispara | Un material nuevo o sin clasificar en el catálogo |
| Qué necesita | La descripción del material |
| Qué entrega | El código de catálogo estándar del material |
| Herramientas de siempre | El catálogo estándar de clasificación y hojas de cálculo |

## Cómo se resolvió

Se construyó una herramienta con inteligencia artificial (Claude) que recibe la descripción de un material y le asigna el código de catálogo correcto de forma automática. La herramienta trabaja igual que lo haría una persona experta, pero en segundos: primero identifica la gran categoría del material, luego la subcategoría y finalmente el código exacto. En vez de leer el nombre literal, entiende la función real del material, así que reconoce que un rodamiento, un cojinete y un bearing son lo mismo aunque estén escritos distinto.

La herramienta ya funciona y se mostró al equipo de innovación, donde destacó como la que más tiempo ahorra frente a otras opciones. Además de clasificar, ayuda a detectar materiales duplicados y a estandarizar sus descripciones.

## El flujo

```mermaid
flowchart LR
    A[Descripción del material] --> B[Identifica la categoría]
    B --> C[Identifica la subcategoría]
    C --> D[Asigna el código exacto]
    D --> E[Código de catálogo listo]
```

## El impacto

La clasificación que antes se hacía material por material a mano ahora se resuelve de forma automática en segundos. Queda pendiente clasificar el resto del catálogo aprovechando la misma herramienta. El ahorro exacto de tiempo está [por confirmar].
