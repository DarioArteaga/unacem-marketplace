---
titulo: "Gestión de cartas fianza"
champion: "Clever"
area: "Tesorería, GBS"
resumen: "Extracción automática de los 6 datos clave de cada carta fianza en PDF para el flujo de gestión"
herramienta: "Claude"
tags: ["tesorería", "automatización"]
orden: 2
fecha: "2026-07-05"
---

## El problema

Gestionar cartas fianza implicaba un proceso manual de decenas de pasos. El primero —y el más pesado— era leer cada PDF y transcribir a mano los datos importantes. Eso consumía tiempo del equipo de tesorería y abría la puerta a omisiones.

## Cómo se resolvió

Claude lee cada carta fianza en PDF y extrae automáticamente los seis datos clave: empresa, beneficiario, monto, moneda, vencimiento y obligación garantizada. Esos datos quedan listos para continuar el flujo de gestión, sin volver a tipearlos desde cero.

## El flujo

```mermaid
flowchart LR
    A[PDF de carta fianza] --> B[Extracción de 6 campos]
    B --> C[Validación]
    C --> D[Registro para gestión]
```

## El impacto

Se elimina la transcripción manual del PDF como cuello de botella. El equipo puede concentrarse en revisar y gestionar, no en copiar datos. Métricas de tiempo ahorrado: [cifra por confirmar].
