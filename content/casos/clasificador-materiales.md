---
titulo: "Clasificador de materiales"
champion: "Equipo técnico UNACEM"
area: "Compras / Abastecimiento"
resumen: "Sugerencia guiada de clasificación UNSPSC en tres pasos: segmento, familia y código de producto"
herramienta: "Claude"
tags: ["compras", "clasificación"]
orden: 3
fecha: "2026-07-08"
---

## El problema

Clasificar materiales con el estándar internacional UNSPSC (cientos de categorías) era lento. Cada analista aplicaba su propio criterio, así que el mismo material podía terminar en códigos distintos según quién lo cargara.

## Cómo se resolvió

Se construyó una herramienta que usa la API de Claude para sugerir la clasificación en tres pasos claros: primero el segmento, luego la familia y al final el código de producto. La persona sigue al mando: confirma o ajusta la sugerencia antes de guardarla.

## El flujo

```mermaid
flowchart LR
    A[Descripción del material] --> B[Paso 1: segmento]
    B --> C[Paso 2: familia]
    C --> D[Paso 3: código de producto]
```

## El impacto

La clasificación deja de depender solo de la memoria o del criterio individual. El proceso es más consistente entre analistas y más rápido de completar. Tiempo medio por material: [cifra por confirmar].
