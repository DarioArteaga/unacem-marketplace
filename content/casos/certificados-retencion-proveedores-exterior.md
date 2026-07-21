---
titulo: "Certificados de retención a proveedores del exterior"
champion: "Jennifer Aguilar"
area: "Impuestos, GBS Perú"
resumen: "Generar los certificados de retención a proveedores del exterior sin copiar los datos a mano entre archivos."
herramienta: "Claude"
estado: "enproceso"
tags: ["impuestos", "automatización", "documentos"]
fecha: "2026-07-17"
---

## El problema

Cada mes hay pagos a proveedores del exterior que requieren un certificado de retención. Como armarlo es un trabajo completamente manual, en la práctica el certificado solo se genera cuando el proveedor lo pide, en vez de emitirse todos los meses como debería.

## Cómo se hace hoy

El proceso arranca con una hoja de cálculo que contiene los datos de los proveedores: importes, fechas, identificación fiscal y domicilio. A partir de ahí, para cada certificado hay que:

1. Copiar los datos del proveedor desde la hoja de cálculo a un documento de texto.
2. Revisar que todo esté bien escrito, incluyendo la tasa de retención que corresponde según la norma.
3. Convertir el documento a PDF.
4. Enviarlo a firma del responsable del área.

Todo a mano, certificado por certificado, y en más de un idioma: los documentos se emiten en español para algunos países y en inglés para otros.

## El caso en datos

| | |
|---|---|
| Qué lo dispara | La solicitud del proveedor (la meta es que sea la emisión mensual) |
| Qué necesita | La hoja de cálculo con los datos de proveedores y pagos del mes |
| Qué entrega | El certificado de retención en PDF, firmado y listo para enviar |
| Herramientas de siempre | SAP y Excel |

## Qué se está construyendo

Se está probando que Claude tome los datos de cada proveedor directamente desde la hoja de cálculo y arme el certificado completo, con el formato y el idioma que corresponde a cada país, dejando listo el documento para la revisión final y la firma del responsable. La persona deja de transcribir y pasa a revisar.

## El flujo

```mermaid
flowchart LR
    A[Datos del proveedor] --> B[Claude arma el certificado]
    B --> C[Revisión de datos]
    C --> D[Firma del responsable]
    D --> E[Certificado enviado]
```

## Qué se espera lograr

Que el certificado deje de ser un documento que se arma bajo pedido y pase a emitirse todos los meses sin esfuerzo adicional, con menos riesgo de errores de transcripción en un documento que sale de la empresa hacia proveedores internacionales.
