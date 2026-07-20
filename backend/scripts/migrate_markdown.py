"""Migración única: content/casos/*.md -> PostgreSQL."""

from __future__ import annotations

import re
import sys
from datetime import date
from pathlib import Path

import yaml
from sqlalchemy import select

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import get_settings
from app.core.logging import get_logger, setup_logging
from app.db.session import SessionLocal
from app.models.caso import Caso, CasoEstado, CasoEtapa, default_flujo
from app.models.user import User, UserRole
from app.services.casos import ensure_unique_slug

setup_logging()
logger = get_logger("migrate_md")

REPO_ROOT = Path(__file__).resolve().parents[2]
CASOS_DIR = REPO_ROOT / "frontend" / "content" / "casos"


def parse_md(path: Path) -> tuple[dict, str]:
    raw = path.read_text(encoding="utf-8")
    if not raw.startswith("---"):
        return {}, raw
    parts = raw.split("---", 2)
    if len(parts) < 3:
        return {}, raw
    data = yaml.safe_load(parts[1]) or {}
    return data if isinstance(data, dict) else {}, parts[2].strip()


def extract_section(body: str, titles: list[str]) -> str | None:
    for title in titles:
        pattern = rf"(?im)^##\s+{re.escape(title)}\s*\n([\s\S]*?)(?=^##\s+|\Z)"
        match = re.search(pattern, body)
        if match:
            text = match.group(1).strip()
            text = re.sub(r"```[\s\S]*?```", "", text).strip()
            if text:
                return text
    return None


def normalize_estado(value: object) -> CasoEstado:
    if not isinstance(value, str):
        return CasoEstado.enproceso
    compact = value.strip().lower().replace(" ", "")
    if compact in ("implementado", "publicado"):
        return CasoEstado.implementado if compact == "implementado" else CasoEstado.publicado
    return CasoEstado.enproceso


def etapa_from_estado(estado: CasoEstado) -> CasoEtapa:
    if estado == CasoEstado.implementado:
        return CasoEtapa.implementacion
    if estado == CasoEstado.publicado:
        return CasoEtapa.marketplace
    return CasoEtapa.diseno


def main() -> None:
    settings = get_settings()
    if not CASOS_DIR.exists():
        logger.error("No existe content/casos", path=str(CASOS_DIR))
        sys.exit(1)

    db = SessionLocal()
    try:
        admin = db.scalar(
            select(User).where(User.email == settings.super_admin_email.lower())
        )
        if not admin:
            admin = db.scalar(select(User).where(User.role == UserRole.super_admin).limit(1))
        if not admin:
            logger.error("No hay super_admin; corre scripts/seed_admin.py primero")
            sys.exit(1)

        files = sorted(CASOS_DIR.glob("*.md"))
        created = 0
        skipped = 0
        for path in files:
            data, body = parse_md(path)
            slug_base = path.stem
            existing = db.scalar(select(Caso).where(Caso.slug == slug_base))
            if existing:
                logger.info("Skip (ya existe)", slug=slug_base)
                skipped += 1
                continue

            titulo = str(data.get("titulo") or slug_base)
            resumen = str(data.get("resumen") or "[por confirmar]")[:140]
            champion = str(data.get("champion") or "[por confirmar]")
            area = str(data.get("area") or "[por confirmar]")
            tags = data.get("tags") if isinstance(data.get("tags"), list) else []
            tags = [str(t) for t in tags if t != "enproceso"]
            herramienta = data.get("herramienta")
            herramientas = [str(herramienta)] if herramienta else []
            estado = normalize_estado(data.get("estado"))
            fecha_raw = data.get("fecha")
            try:
                fecha_identificado = date.fromisoformat(str(fecha_raw)) if fecha_raw else date.today()
            except ValueError:
                fecha_identificado = date.today()

            problema = extract_section(body, ["El problema", "Problema"]) or "[por confirmar]"
            descripcion = extract_section(
                body, ["Cómo se resolvió", "Qué se está construyendo", "Cómo se hace hoy"]
            )
            valor = extract_section(body, ["El impacto", "Qué se espera lograr", "Valor esperado"])

            slug = ensure_unique_slug(db, slug_base)
            caso = Caso(
                slug=slug,
                titulo=titulo,
                resumen=resumen,
                champion=champion,
                area=area,
                owner_user_id=admin.id,
                descripcion=descripcion,
                problema=problema,
                valor_esperado=valor,
                herramientas=herramientas,
                tags=tags,
                flujo=default_flujo(),
                etapa_actual=etapa_from_estado(estado),
                estado=estado,
                visible_publico=True,
                fecha_identificado=fecha_identificado,
            )
            db.add(caso)
            created += 1
            logger.info("Migrado", slug=slug, titulo=titulo)

        db.commit()
        logger.info("Migración terminada", created=created, skipped=skipped, total=len(files))
    finally:
        db.close()


if __name__ == "__main__":
    main()
