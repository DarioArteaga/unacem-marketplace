from __future__ import annotations

import json
import re

import anthropic
from pydantic import ValidationError

from app.core.config import get_settings
from app.core.logging import get_logger
from app.schemas.assist import AssistSuggestion

logger = get_logger("assist")

SYSTEM_PROMPT = """Eres un editor del Proyecto Salto (UNACEM).
A partir de texto libre (notas, Markdown o ideas), sugiere campos estructurados para un caso de uso de IA.

Reglas:
- Audiencia no técnica: sin jerga (prompt, RAG, token, agente, API, JSON, LLM).
- No inventes datos. Si falta información, omite el campo o usa null.
- Filtra correos, % de avance internos, bloqueantes de TI, nombres de terceros no champions.
- Español latinoamericano neutro, frases cortas.
- resumen máximo 140 caracteres.
- flujo: objetos con arrays entradas, pasos, salidas (máx 6 ítems cada uno, textos cortos).

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

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": f"Texto de entrada:\n\n{texto.strip()}",
            }
        ],
    )
    raw = "".join(block.text for block in message.content if hasattr(block, "text"))
    data = _extract_json(raw)
    try:
        return AssistSuggestion.model_validate(data)
    except ValidationError as exc:
        logger.error("Sugerencia LLM inválida", error=str(exc))
        return AssistSuggestion()


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
