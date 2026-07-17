# Reglas Maestras del Proyecto

Este archivo define el comportamiento obligatorio para la generación de código, estructura y documentación. Estas reglas son **inviolables** a menos que se solicite explícitamente lo contrario.

## 1. Gestión de Documentación y Trazabilidad (CRÍTICO)

### 1.1 Política de "Solo Documentación Viva"
**PROHIBIDO:** Generar tutoriales, guías genéricas, explicaciones en markdown fuera de los archivos permitidos, o documentación redundante.

**PERMITIDO (Lista Blanca):** Solo se permite la creación y mantenimiento de los siguientes archivos:

1.  **Raíz (`/README.md`):** Punto de entrada. Solo instalación, comandos de ejecución y enlaces a `/docs`.
2.  **Carpeta Docs (`/docs/`):**
    * `docs/changelog_frontend.md`: Historial de cambios del Frontend.
    * `docs/changelog_backend.md`: Historial de cambios del Backend.
    * `docs/architecture_decisions.md`: Decisiones técnicas, patrones y justificaciones.
    * `docs/index.md`: Índice maestro de la carpeta `docs/`.
    * `docs/*.dbml`: Definiciones de esquemas de base de datos.

### 1.2 Formato Estricto de Changelogs
Cada entrada en `changelog_frontend.md` o `changelog_backend.md` debe seguir este formato estricto para garantizar la trazabilidad:

> **Formato:**
> `- [FECHA] [TIPO: FEAT/FIX/REFACTOR] Descripción breve del cambio.`
>   `  Archivos modificados: path/to/file1.py, path/to/file2.ts`

* **Regla:** Si tocas código, **debes** actualizar el changelog correspondiente en el mismo turno, listando explícitamente los archivos afectados.

## 2. Estándares de Código, Tipado y Filosofía

### 2.1 Ecosistema Python
* **Type Hints Obligatorios:** Todo el código Python debe estar estrictamente tipado.
    * Argumentos de funciones, retornos de funciones y definiciones de clases.
    * Uso de `typing` (List, Dict, Optional, Union) o tipos nativos de Python 3.10+.
* **Validación de Datos:** Uso mandatorio de **Pydantic** para la definición de esquemas, payloads y DTOs.

### 2.2 Ecosistema JavaScript / TypeScript
* **TypeScript Estricto:** Prohibido el uso del tipo `any`. Todo debe tener interfaces o tipos explícitos.
    * Las funciones y métodos deben declarar explícitamente el tipo de retorno.
    * Si se usa JavaScript nativo por restricciones del entorno, se debe emular el comportamiento usando JSDoc para el tipado.
* **Validación de Datos:** Uso de **Zod** (o la librería de validación definida en el proyecto) para parsear y asegurar la integridad de las respuestas de APIs o formularios antes de usarlos en el estado de la aplicación.

### 2.3 Filosofía "Ponytail" (The Lazy Senior Dev Rules)
Antes de escribir cualquier código, debes detenerte en el primer peldaño de esta escalera que aplique:
1. ¿Necesita existir? -> **No: sáltalo (YAGNI).**
2. ¿Lo hace la librería estándar (stdlib)? -> **Úsala.**
3. ¿Característica nativa de la plataforma? -> **Úsala.**
4. ¿Dependencia ya instalada? -> **Úsala.**
5. ¿Se puede en una línea? -> **Escríbelo en una línea.**
6. Solo entonces: **Escribe el mínimo absoluto que funcione.**

**Excepción Crítica ("Lazy, not negligent"):** La validación de fronteras de confianza, el manejo de pérdida de datos, la seguridad y la accesibilidad **NUNCA** se omiten. Escribe solo lo que la tarea necesita. El código final debe ser pequeño porque es estrictamente necesario, no porque esté ofuscado o mal estructurado.
* **Regla de Atajos:** Marca cada atajo o simplificación tomada con un comentario en el código usando este formato exacto: `// ponytail: [upgrade path]`.

## 3. Estándares de API y Arquitectura REST

* **Versionado:** Obligatorio en el path de la URL (ej. `/api/v1/...`).
* **Paginación:**
    * Parámetros estándar: `page` (default: 1) y `page_size` (default: 20).
    * La respuesta del servidor debe incluir los metadatos de paginación estructurados.
* **Manejo de Errores:** Formato JSON estándar y consistente:
    * `{ "detail": "mensaje descriptivo", "status_code": 400 }`
* **DTOs (Data Transfer Objects):**
    * **PROHIBIDO:** Exponer entidades de base de datos (ORM) directamente en la respuesta.
    * **MANDATORIO:** Cada endpoint debe retornar un Schema/Model de respuesta explícito (Pydantic en backend, tipado/mapeado correspondiente en el cliente).
* **Identificadores (Slugs):** Los recursos públicos (especialmente empresas o entidades principales) se identifican por `slug` (URL-friendly) en la URL, nunca por ID numérico secuencial.

## 4. Observabilidad y Logging (CRÍTICO)

* **PROHIBIDO:** El uso de `print()` (Python) o `console.log()` (JS/TS) para propósitos de operación, debug o trazabilidad en entornos de ejecución constantes.
* **MANDATORIO:** Implementar librerías de logging avanzadas y configurables.
    * **Backend (Python):** Usar librerías como `loguru`, `structlog` o el módulo `logging` con configuración avanzada (handlers rotativos, formato JSON si aplica).
    * **Frontend/Node:** Usar loggers semánticos y estructurados (ej. `winston`, `pino` o un wrapper personalizado sobre consola que inyecte niveles y timestamps).
* **Niveles:** Todo log debe tener un nivel explícito (DEBUG, INFO, WARN, ERROR) y contexto suficiente para el diagnóstico rápido.

## 5. Base de Datos y Modelado

* **Estándar DBML:** Los esquemas y diagramas Entidad-Relación se definen exclusivamente en `.dbml`.
* **Ubicación:** Todo archivo `.dbml` debe residir en `docs/`.
* **Sincronización:** Cualquier cambio en los modelos del ORM (código) debe reflejarse inmediatamente en su archivo `.dbml` correspondiente.

## 6. Control de Versiones (Git)

* **PROHIBIDO EJECUTAR COMANDOS DE GIT:** La IA tiene estrictamente prohibido realizar acciones de control de versiones en la terminal.
    * **NO:** `git commit`, `git push`, `git pull`, `git merge`, `git checkout`, etc.
    * **NO:** Crear archivos `.gitignore` o modificar la configuración de `.git` sin permiso expreso.
* **Rol de la IA:** La IA se limita a escribir código y actualizar documentación. El usuario es el único responsable de versionar, commitear y pushear los cambios.

## 7. Licencias y Propiedad Intelectual (Protección SaaS)

* **PROHIBICIÓN DE LICENCIAS VIRALES:** Queda estrictamente prohibido sugerir, instalar o importar librerías, dependencias o fragmentos de código bajo licencias **GPL, AGPL, o similares** directamente en el código base (en `requirements.txt`, `package.json`, o archivos fuente).
* **Licencias Permitidas:** Priorizar siempre dependencias bajo licencias **MIT, Apache 2.0, o BSD** para asegurar la total propiedad comercial del software.
* **La "Zona Segura" (Excepción):** El software AGPL/GPL solo puede sugerirse si se implementa como un servicio externo e independiente (ej. corriendo en su propio contenedor Docker) con el cual el código propietario se comunica exclusivamente a través de la red (APIs REST, gRPC, etc.), sin acoplamiento a nivel de código.

## 8. Contexto Externo y Finalización

### 8.1 Reutilización de Código (Github Fetch)
Antes de proponer implementaciones complejas desde cero:
1. **Consultar:** Debes evaluar el repositorio personal del usuario para encontrar patrones, utilidades o arquitecturas reutilizables.
2. **Enlace del Repo:** https://github.com/DarioArteaga
3. **Prioridad:** Adaptar código probado > Generar código nuevo.

### 8.2 Definition of Done
Una tarea no está terminada hasta que:
1. El código funciona, está tipado bajo los estándares de su lenguaje (Python/TS), respeta estrictamente la directriz **Ponytail** y sigue los lineamientos de la API.
2. Los logs estructurados están correctamente implementados (sin prints ni console.logs planos).
3. Los archivos afectados en `/docs` (Changelog correspondiente y diagramas DBML si hubo cambios de datos) están actualizados.
4. No se han introducido dependencias con licencias virales que comprometan el modelo comercial.
