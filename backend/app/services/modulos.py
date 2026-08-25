from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.models.modulo import ModuloAprendizaje, ModuloProgreso
from app.schemas.modulo import ModuloProgresoRead, ModuloProgresoWrite, ModuloPublic

logger = get_logger("modulos")

MAX_VISITED = 32
MAX_QUIZ_KEYS = 40
MAX_MATRIX_KEYS = 20
MAX_REFLEXION_CHARS = 4000


def get_modulo_or_404(db: Session, slug: str) -> ModuloAprendizaje:
    modulo = db.get(ModuloAprendizaje, slug)
    if modulo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Módulo no encontrado")
    return modulo


def list_modulos(db: Session) -> list[ModuloPublic]:
    rows = db.scalars(select(ModuloAprendizaje).order_by(ModuloAprendizaje.slug)).all()
    return [
        ModuloPublic(
            slug=row.slug,
            titulo=row.titulo,
            duracion_estimada=row.duracion_estimada,
            total_pasos=row.total_pasos,
        )
        for row in rows
    ]


def _ints(values: list[Any], cap: int) -> list[int]:
    out: list[int] = []
    for item in values[:cap]:
        if isinstance(item, int) and item >= 0:
            out.append(item)
        elif isinstance(item, str) and item.isdigit():
            out.append(int(item))
    return sorted(set(out))


def _str_map(raw: dict[str, Any] | None, cap_keys: int, cap_val: int) -> dict[str, str]:
    if not isinstance(raw, dict):
        return {}
    out: dict[str, str] = {}
    for key, value in list(raw.items())[:cap_keys]:
        if not isinstance(key, str) or len(key) > 64:
            continue
        text = value if isinstance(value, str) else str(value)
        out[key] = text[:cap_val]
    return out


def empty_progreso(slug: str) -> ModuloProgresoRead:
    return ModuloProgresoRead(
        modulo_slug=slug,
        current_step=0,
        visited=[0],
        quizzes={},
        matrix={},
        reflexiones={},
        completed_at=None,
        updated_at=None,
    )


def progreso_to_read(row: ModuloProgreso) -> ModuloProgresoRead:
    return ModuloProgresoRead(
        modulo_slug=row.modulo_slug,
        current_step=row.current_step,
        visited=_ints(list(row.visited or []), MAX_VISITED),
        quizzes=_str_map(row.quizzes, MAX_QUIZ_KEYS, 8),
        matrix=_str_map(row.matrix, MAX_MATRIX_KEYS, 16),
        reflexiones=_str_map(row.reflexiones, 8, MAX_REFLEXION_CHARS),
        completed_at=row.completed_at,
        updated_at=row.updated_at,
    )


def get_progreso(db: Session, user_id: UUID, slug: str) -> ModuloProgresoRead:
    get_modulo_or_404(db, slug)
    row = db.scalar(
        select(ModuloProgreso).where(
            ModuloProgreso.user_id == user_id,
            ModuloProgreso.modulo_slug == slug,
        )
    )
    if row is None:
        return empty_progreso(slug)
    return progreso_to_read(row)


def upsert_progreso(
    db: Session, user_id: UUID, slug: str, data: ModuloProgresoWrite
) -> ModuloProgresoRead:
    modulo = get_modulo_or_404(db, slug)
    visited = _ints(data.visited, MAX_VISITED)
    if 0 not in visited:
        visited = [0, *visited]
    current = min(data.current_step, modulo.total_pasos - 1)
    quizzes = _str_map(data.quizzes, MAX_QUIZ_KEYS, 8)
    matrix = _str_map(data.matrix, MAX_MATRIX_KEYS, 16)
    reflexiones = _str_map(data.reflexiones, 8, MAX_REFLEXION_CHARS)

    row = db.scalar(
        select(ModuloProgreso).where(
            ModuloProgreso.user_id == user_id,
            ModuloProgreso.modulo_slug == slug,
        )
    )
    now = datetime.now(timezone.utc)
    completed = current >= modulo.total_pasos - 1 or (modulo.total_pasos - 1) in visited
    if row is None:
        row = ModuloProgreso(
            user_id=user_id,
            modulo_slug=slug,
            current_step=current,
            visited=visited,
            quizzes=quizzes,
            matrix=matrix,
            reflexiones=reflexiones,
            completed_at=now if completed else None,
        )
        db.add(row)
        logger.info("Progreso de módulo creado", slug=slug, user_id=str(user_id), step=current)
    else:
        row.current_step = current
        row.visited = visited
        row.quizzes = quizzes
        row.matrix = matrix
        row.reflexiones = reflexiones
        if completed and row.completed_at is None:
            row.completed_at = now
        logger.info("Progreso de módulo actualizado", slug=slug, user_id=str(user_id), step=current)

    db.commit()
    db.refresh(row)
    return progreso_to_read(row)
