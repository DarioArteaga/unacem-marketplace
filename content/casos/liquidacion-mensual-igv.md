---
titulo: "Liquidación mensual de IGV"
champion: "Jennifer Aguilar"
area: "Impuestos, GBS Perú"
resumen: "Usar inteligencia artificial para extraer datos de reportes y agilizar la liquidación mensual del IGV."
herramienta: "Claude"
estado: "implementado"
tags: ["impuestos", "automatización", "finanzas"]
fecha: "2026-07-17"
---

## El problema

Cada cierre de mes hay que armar la liquidación del Impuesto General a las Ventas. Eso implica revisar un reporte, validarlo en otro sistema y después copiar los valores a mano en una plantilla, separándolos entre ventas, compras y ajustes. Es un trabajo repetitivo, con el riesgo de que se traspapele algún dato en el camino.

## Cómo se hace hoy

- Se descarga el reporte de ventas y compras.
- Se valida la información en un sistema externo de la autoridad tributaria.
- Se copian los valores a mano en la plantilla de liquidación, separando ventas, compras y ajustes.
- Los ajustes se revisan de forma manual, ya que requieren criterio experto.

## El caso en datos

| | |
|---|---|
| Qué lo dispara | El cierre contable de cada mes |
| Qué necesita | El reporte de ventas y compras |
| Qué entrega | La plantilla de liquidación de IGV completa |
| Herramientas de siempre | Un sistema contable y una hoja de cálculo |

## Cómo se resolvió

Se probó que una herramienta de inteligencia artificial (Claude) lea directamente una imagen del reporte de ventas y la convierta en una tabla ordenada, lista para usar. La primera prueba extrajo los datos correctamente, y el siguiente paso es que la misma herramienta complete la plantilla de liquidación directamente a partir del reporte.

## El flujo

```mermaid
flowchart LR
    A[Imagen del reporte] --> B[Claude extrae los datos]
    B --> C[Tabla ordenada]
    C --> D[Plantilla completada]
```

## El impacto

La primera prueba mostró que se puede extraer correctamente la información del reporte sin copiarla a mano. El tiempo que esto ahorra en el proceso completo está [por confirmar], ya que todavía se está validando el llenado directo de la plantilla.
