from __future__ import annotations

import json
import re

import anthropic
from fastapi import HTTPException, status
from pydantic import ValidationError

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.assist import AssistSuggestion

logger = get_logger("assist")

# Salida corta: textos largos + max_tokens bajo cortaban el JSON y el front veía "nada".
MAX_OUTPUT_TOKENS = 4096

SYSTEM_PROMPT = """Eres un editor del Proyecto Salto (UNACEM).
A partir de texto libre (notas, Markdown o ideas), sugiere campos estructurados para un caso de uso de IA.

Reglas:
- Audiencia no técnica: sin jerga (prompt, RAG, token, agente, API, JSON, LLM).
- No inventes datos. Si falta información, omite el campo o usa null.
- Filtra correos, % de avance internos, bloqueantes de TI, nombres de terceros no champions.
- Español latinoamericano neutro, frases cortas.
- resumen máximo 140 caracteres.
- Campos de texto largos (descripcion, problema, valor_esperado, publico_objetivo, alcance, diseno):
  máximo 400 caracteres cada uno. Resume; no copies párrafos enteros.
- flujo: objetos con arrays entradas, pasos, salidas (máx 6 ítems cada uno, textos cortos).
- Prioriza completar titulo, resumen, champion, area, tags y flujo aunque el texto sea muy largo.

Responde SOLO con un JSON válido (sin markdown) con estas claves opcionales:
titulo, resumen, champion, area, descripcion, problema, valor_esperado,
publico_objetivo, alcance, diseno, herramientas (array), beneficiarios (array),
tags (array), flujo ({entradas, pasos, salidas}), codigo.
"""


def suggest_from_text(texto: str) -> AssistSuggestion:
    settings = get_settings()
    if not settings.anthropic_api_key:
        logger.warn("ANTHROPIC_API_KEY ausente; devolviendo sugerencia vacía")
        return AssistSuggestion()

    cleaned = texto.strip()
    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    try:
        message = client.messages.create(
            model=settings.anthropic_model,
            max_tokens=MAX_OUTPUT_TOKENS,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Texto de entrada:\n\n{cleaned}",
                }
            ],
        )
    except anthropic.NotFoundError as exc:
        logger.error(
            "Modelo Anthropic no encontrado",
            model=settings.anthropic_model,
            error=str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                f"Modelo no disponible: '{settings.anthropic_model}'. "
                "Revisa ANTHROPIC_MODEL en Railway (ej. claude-sonnet-5)."
            ),
        ) from exc
    except anthropic.AuthenticationError as exc:
        logger.error("ANTHROPIC_API_KEY inválida", error=str(exc))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Clave Anthropic inválida. Revisa ANTHROPIC_API_KEY.",
        ) from exc
    except anthropic.APIError as exc:
        logger.error("Error Anthropic API", error=str(exc), status=getattr(exc, "status_code", None))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Error al llamar al asistente LLM. Intenta de nuevo.",
        ) from exc

    stop_reason = getattr(message, "stop_reason", None)
    raw = "".join(block.text for block in message.content if hasattr(block, "text"))
    logger.info(
        "Asistente LLM respondió",
        model=settings.anthropic_model,
        input_chars=len(cleaned),
        output_chars=len(raw),
        stop_reason=stop_reason,
    )

    if stop_reason == "max_tokens":
        logger.warn(
            "Respuesta LLM truncada por max_tokens; el JSON puede quedar incompleto",
            max_tokens=MAX_OUTPUT_TOKENS,
        )

    data = _extract_json(raw)
    if not data:
        logger.error(
            "No se pudo parsear JSON del asistente",
            stop_reason=stop_reason,
            raw_preview=raw[:500],
        )
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "El asistente respondió, pero el JSON quedó incompleto o inválido. "
                "Prueba con un texto más corto o vuelve a intentar."
            ),
        )

    try:
        suggestion = AssistSuggestion.model_validate(data)
    except ValidationError as exc:
        logger.error("Sugerencia LLM inválida", error=str(exc), raw_preview=raw[:500])
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="La sugerencia del asistente no tiene el formato esperado. Intenta de nuevo.",
        ) from exc

    if not _has_content(suggestion):
        logger.warn("Sugerencia LLM vacía tras parseo", keys=list(data.keys()))
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "El asistente no extrajo campos útiles. "
                "Prueba con un resumen más corto del caso."
            ),
        )

    return suggestion


def _has_content(suggestion: AssistSuggestion) -> bool:
    payload = suggestion.model_dump()
    for value in payload.values():
        if value is None or value == "":
            continue
        if isinstance(value, list) and len(value) == 0:
            continue
        if isinstance(value, dict) and not any(value.values()):
            continue
        return True
    return False


def _extract_json(raw: str) -> dict:
    text = raw.strip()
    fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if fence:
        text = fence.group(1).strip()
    try:
        parsed = json.loads(text)
        return parsed if isinstance(parsed, dict) else {}
    except json.JSONDecodeError:
        start = text.find("{")
        end = text.rfind("}")
        if start >= 0 and end > start:
            try:
                parsed = json.loads(text[start : end + 1])
                return parsed if isinstance(parsed, dict) else {}
            except json.JSONDecodeError:
                return {}
        return {}
