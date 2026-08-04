from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from typing import Any

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class CasoEtapa(str, enum.Enum):
    identificacion = "identificacion"
    diseno = "diseno"
    implementacion = "implementacion"
    marketplace = "marketplace"


class CasoEstado(str, enum.Enum):
    enproceso = "enproceso"
    implementado = "implementado"
    publicado = "publicado"


ETAPA_ORDER: list[CasoEtapa] = [
    CasoEtapa.identificacion,
    CasoEtapa.diseno,
    CasoEtapa.implementacion,
    CasoEtapa.marketplace,
]


def default_flujo() -> dict[str, list[str]]:
    return {"entradas": [], "pasos": [], "salidas": []}


def default_recursos() -> list[dict[str, str]]:
    return []


class Caso(Base):
    __tablename__ = "casos"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    codigo: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    resumen: Mapped[str] = mapped_column(String(140), nullable=False)
    champion: Mapped[str] = mapped_column(String(255), nullable=False)
    area: Mapped[str] = mapped_column(String(255), nullable=False)
    owner_user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )

    descripcion: Mapped[str | None] = mapped_column(Text, nullable=True)
    problema: Mapped[str | None] = mapped_column(Text, nullable=True)
    valor_esperado: Mapped[str | None] = mapped_column(Text, nullable=True)
    publico_objetivo: Mapped[str | None] = mapped_column(Text, nullable=True)
    alcance: Mapped[str | None] = mapped_column(Text, nullable=True)
    diseno: Mapped[str | None] = mapped_column(Text, nullable=True)

    herramientas: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    beneficiarios: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)

    flujo: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False, default=default_flujo)
    # [{ "titulo": str, "contenido": str }, ...] — orden = posición en la lista
    prompts: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, nullable=False, default=default_recursos
    )
    skills: Mapped[list[dict[str, Any]]] = mapped_column(
        JSONB, nullable=False, default=default_recursos
    )

    etapa_actual: Mapped[CasoEtapa] = mapped_column(
        Enum(CasoEtapa, name="caso_etapa", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=CasoEtapa.identificacion,
    )
    estado: Mapped[CasoEstado] = mapped_column(
        Enum(CasoEstado, name="caso_estado", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=CasoEstado.enproceso,
    )
    visible_publico: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    adopcion_nivel: Mapped[str | None] = mapped_column(String(64), nullable=True)
    adopcion_detalle: Mapped[str | None] = mapped_column(Text, nullable=True)
    participacion_nivel: Mapped[str | None] = mapped_column(String(64), nullable=True)
    participacion_detalle: Mapped[str | None] = mapped_column(Text, nullable=True)
    eficiencia_resumen: Mapped[str | None] = mapped_column(String(255), nullable=True)
    eficiencia_detalle: Mapped[str | None] = mapped_column(Text, nullable=True)

    fecha_identificado: Mapped[date | None] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    owner = relationship("User", back_populates="casos")
