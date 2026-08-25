from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


def default_list() -> list[Any]:
    return []


def default_dict() -> dict[str, Any]:
    return {}


class ModuloAprendizaje(Base):
    __tablename__ = "modulos_aprendizaje"

    slug: Mapped[str] = mapped_column(String(64), primary_key=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    duracion_estimada: Mapped[str] = mapped_column(String(64), nullable=False, default="")
    total_pasos: Mapped[int] = mapped_column(Integer, nullable=False, default=7)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    progresos = relationship("ModuloProgreso", back_populates="modulo")


class ModuloProgreso(Base):
    __tablename__ = "modulos_progreso"
    __table_args__ = (UniqueConstraint("user_id", "modulo_slug", name="uq_modulo_progreso_user_slug"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    modulo_slug: Mapped[str] = mapped_column(
        String(64), ForeignKey("modulos_aprendizaje.slug"), nullable=False, index=True
    )
    current_step: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    visited: Mapped[list[Any]] = mapped_column(JSONB, nullable=False, default=default_list)
    quizzes: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=default_dict)
    matrix: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=default_dict)
    reflexiones: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=default_dict)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    modulo = relationship("ModuloAprendizaje", back_populates="progresos")
    user = relationship("User", back_populates="modulos_progreso")
