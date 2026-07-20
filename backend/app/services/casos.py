from __future__ import annotations

import math
from datetime import date
from uuid import UUID

from slugify import slugify
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.caso import Caso, CasoEstado, CasoEtapa
from app.models.user import User, UserRole
from app.schemas.caso import (
    CasoAdmin,
    CasoCreate,
    CasoPublic,
    CasoUpdate,
    ChampionSummary,
    FlujoPasos,
    compute_avance_pct,
    compute_checklist,
    compute_dias_activo,
)
from app.schemas.common import PaginatedResponse, PaginationMeta


def _flujo_from_db(raw: dict | None) -> FlujoPasos:
    if not raw:
        return FlujoPasos()
    return FlujoPasos(
        entradas=list(raw.get("entradas") or []),
        pasos=list(raw.get("pasos") or []),
        salidas=list(raw.get("salidas") or []),
    )


def caso_to_public(caso: Caso) -> CasoPublic:
    return CasoPublic(
        id=caso.id,
        codigo=caso.codigo,
        slug=caso.slug,
        titulo=caso.titulo,
        resumen=caso.resumen,
        champion=caso.champion,
        area=caso.area,
        descripcion=caso.descripcion,
        problema=caso.problema,
        valor_esperado=caso.valor_esperado,
        publico_objetivo=caso.publico_objetivo,
        alcance=caso.alcance,
        diseno=caso.diseno,
        herramientas=list(caso.herramientas or []),
        beneficiarios=list(caso.beneficiarios or []),
        tags=list(caso.tags or []),
        flujo=_flujo_from_db(caso.flujo if isinstance(caso.flujo, dict) else None),
        etapa_actual=caso.etapa_actual,
        estado=caso.estado,
        visible_publico=caso.visible_publico,
        adopcion_nivel=caso.adopcion_nivel,
        adopcion_detalle=caso.adopcion_detalle,
        participacion_nivel=caso.participacion_nivel,
        participacion_detalle=caso.participacion_detalle,
        eficiencia_resumen=caso.eficiencia_resumen,
        eficiencia_detalle=caso.eficiencia_detalle,
        fecha_identificado=caso.fecha_identificado,
        created_at=caso.created_at,
        updated_at=caso.updated_at,
        avance_pct=compute_avance_pct(caso.etapa_actual),
        etapas_checklist=compute_checklist(caso.etapa_actual),
        dias_activo=compute_dias_activo(caso.fecha_identificado),
    )


def caso_to_admin(caso: Caso) -> CasoAdmin:
    base = caso_to_public(caso)
    return CasoAdmin(**base.model_dump(), owner_user_id=caso.owner_user_id)


def ensure_unique_slug(db: Session, base: str, exclude_id: UUID | None = None) -> str:
    slug = slugify(base) or "caso"
    candidate = slug
    suffix = 2
    while True:
        stmt = select(Caso).where(Caso.slug == candidate)
        if exclude_id:
            stmt = stmt.where(Caso.id != exclude_id)
        exists = db.scalar(stmt.limit(1))
        if not exists:
            return candidate
        candidate = f"{slug}-{suffix}"
        suffix += 1


def list_public_casos(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 20,
    tag: str | None = None,
    estado: CasoEstado | None = None,
    champion: str | None = None,
    etapa: CasoEtapa | None = None,
) -> PaginatedResponse[CasoPublic]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    stmt = select(Caso).where(Caso.visible_publico.is_(True))
    if tag:
        stmt = stmt.where(Caso.tags.any(tag))
    if estado:
        stmt = stmt.where(Caso.estado == estado)
    if champion:
        stmt = stmt.where(Caso.champion == champion)
    if etapa:
        stmt = stmt.where(Caso.etapa_actual == etapa)

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(
        stmt.order_by(Caso.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)
    ).all()
    return PaginatedResponse(
        items=[caso_to_public(c) for c in rows],
        meta=PaginationMeta(
            page=page,
            page_size=page_size,
            total=total,
            total_pages=max(1, math.ceil(total / page_size)) if total else 0,
        ),
    )


def get_public_by_slug(db: Session, slug: str) -> Caso | None:
    return db.scalar(
        select(Caso).where(Caso.slug == slug, Caso.visible_publico.is_(True))
    )


def list_champions(db: Session) -> list[ChampionSummary]:
    rows = db.scalars(select(Caso).where(Caso.visible_publico.is_(True))).all()
    grouped: dict[str, ChampionSummary] = {}
    for caso in rows:
        existing = grouped.get(caso.champion)
        if existing:
            existing.case_count += 1
            if caso.area not in existing.areas:
                existing.areas.append(caso.area)
        else:
            grouped[caso.champion] = ChampionSummary(
                champion=caso.champion,
                areas=[caso.area],
                case_count=1,
            )
    return sorted(grouped.values(), key=lambda c: c.champion.lower())


def list_tags(db: Session) -> list[str]:
    rows = db.scalars(select(Caso).where(Caso.visible_publico.is_(True))).all()
    tags: set[str] = set()
    for caso in rows:
        for tag in caso.tags or []:
            tags.add(tag)
    return sorted(tags, key=lambda t: t.lower())


def list_admin_casos(
    db: Session,
    user: User,
    *,
    page: int = 1,
    page_size: int = 20,
) -> PaginatedResponse[CasoAdmin]:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    stmt = select(Caso)
    if user.role != UserRole.super_admin:
        stmt = stmt.where(Caso.owner_user_id == user.id)
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.scalars(
        stmt.order_by(Caso.updated_at.desc()).offset((page - 1) * page_size).limit(page_size)
    ).all()
    return PaginatedResponse(
        items=[caso_to_admin(c) for c in rows],
        meta=PaginationMeta(
            page=page,
            page_size=page_size,
            total=total,
            total_pages=max(1, math.ceil(total / page_size)) if total else 0,
        ),
    )


def get_caso_for_user(db: Session, caso_id: UUID, user: User) -> Caso | None:
    caso = db.get(Caso, caso_id)
    if not caso:
        return None
    if user.role != UserRole.super_admin and caso.owner_user_id != user.id:
        return None
    return caso


def create_caso(db: Session, data: CasoCreate, owner: User) -> Caso:
    slug_source = data.slug or data.titulo
    slug = ensure_unique_slug(db, slug_source)
    caso = Caso(
        codigo=data.codigo,
        slug=slug,
        titulo=data.titulo,
        resumen=data.resumen,
        champion=data.champion,
        area=data.area,
        owner_user_id=owner.id,
        descripcion=data.descripcion,
        problema=data.problema,
        valor_esperado=data.valor_esperado,
        publico_objetivo=data.publico_objetivo,
        alcance=data.alcance,
        diseno=data.diseno,
        herramientas=data.herramientas,
        beneficiarios=data.beneficiarios,
        tags=data.tags,
        flujo=data.flujo.model_dump(),
        etapa_actual=data.etapa_actual,
        estado=data.estado,
        visible_publico=data.visible_publico,
        adopcion_nivel=data.adopcion_nivel,
        adopcion_detalle=data.adopcion_detalle,
        participacion_nivel=data.participacion_nivel,
        participacion_detalle=data.participacion_detalle,
        eficiencia_resumen=data.eficiencia_resumen,
        eficiencia_detalle=data.eficiencia_detalle,
        fecha_identificado=data.fecha_identificado or date.today(),
    )
    db.add(caso)
    db.commit()
    db.refresh(caso)
    return caso


_TEXT_FIELDS = {
    "codigo",
    "slug",
    "titulo",
    "resumen",
    "champion",
    "area",
    "descripcion",
    "problema",
    "valor_esperado",
    "publico_objetivo",
    "alcance",
    "diseno",
    "adopcion_nivel",
    "adopcion_detalle",
    "participacion_nivel",
    "participacion_detalle",
    "eficiencia_resumen",
    "eficiencia_detalle",
}


def update_caso(db: Session, caso: Caso, data: CasoUpdate) -> Caso:
    payload = data.model_dump(exclude_unset=True)
    if "slug" in payload and payload["slug"]:
        payload["slug"] = ensure_unique_slug(db, str(payload["slug"]), exclude_id=caso.id)
    if "flujo" in payload and payload["flujo"] is not None:
        flujo = payload["flujo"]
        payload["flujo"] = flujo if isinstance(flujo, dict) else FlujoPasos(**flujo).model_dump()

    for key, value in payload.items():
        if key in _TEXT_FIELDS and value == "":
            value = None
        setattr(caso, key, value)

    db.add(caso)
    db.commit()
    db.refresh(caso)
    return caso


def delete_caso(db: Session, caso: Caso) -> None:
    db.delete(caso)
    db.commit()


def set_visible(db: Session, caso: Caso, visible: bool) -> Caso:
    caso.visible_publico = visible
    db.add(caso)
    db.commit()
    db.refresh(caso)
    return caso
