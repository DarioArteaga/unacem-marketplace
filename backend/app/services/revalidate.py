from __future__ import annotations

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger("revalidate")


def trigger_revalidate(paths: list[str] | None = None) -> None:
    settings = get_settings()
    if not settings.revalidate_url or not settings.revalidate_secret:
        return
    payload = {"secret": settings.revalidate_secret, "paths": paths or ["/"]}
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.post(settings.revalidate_url, json=payload)
            if response.status_code >= 400:
                logger.warn(
                    "Revalidate falló",
                    status=response.status_code,
                    body=response.text[:300],
                )
    except Exception as exc:  # noqa: BLE001 — no bloquear escritura
        logger.warn("Revalidate error de red", error=str(exc))
