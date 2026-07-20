from __future__ import annotations

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.caso import CasoEstado, CasoEtapa, ETAPA_ORDER


class FlujoPasos(BaseModel):
    entradas: list[str] = Field(default_factory=list)
    pasos: list[str] = Field(default_factory=list)
    salidas: list[str] = Field(default_factory=list)


class EtapaChecklistItem(BaseModel):
    key: CasoEtapa
    label: str
    completed: bool


ETAPA_LABELS: dict[CasoEtapa, str] = {
    CasoEtapa.identificacion: "Identificación",
    CasoEtapa.diseno: "Diseño",
    CasoEtapa.implementacion: "Implementación",
    CasoEtapa.marketplace: "Marketplace",
}


def compute_avance_pct(etapa: CasoEtapa) -> int:
    return (ETAPA_ORDER.index(etapa) + 1) * 25


def compute_checklist(etapa: CasoEtapa) -> list[EtapaChecklistItem]:
    current_idx = ETAPA_ORDER.index(etapa)
    return [
        EtapaChecklistItem(
            key=e,
            label=ETAPA_LABELS[e],
            completed=i <= current_idx,
        )
        for i, e in enumerate(ETAPA_ORDER)
    ]


def compute_dias_activo(fecha: date | None) -> int | None:
    if fecha is None:
        return None
    return max((date.today() - fecha).days, 0)


class CasoBase(BaseModel):
    codigo: str | None = Field(default=None, max_length=64)
    titulo: str = Field(min_length=1, max_length=255)
    resumen: str = Field(min_length=1, max_length=140)
    champion: str = Field(min_length=1, max_length=255)
    area: str = Field(min_length=1, max_length=255)
    descripcion: str | None = None
    problema: str | None = None
    valor_esperado: str | None = None
    publico_objetivo: str | None = None
    alcance: str | None = None
    diseno: str | None = None
    herramientas: list[str] = Field(default_factory=list)
    beneficiarios: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    flujo: FlujoPasos = Field(default_factory=FlujoPasos)
    etapa_actual: CasoEtapa = CasoEtapa.identificacion
    estado: CasoEstado = CasoEstado.enproceso
    adopcion_nivel: str | None = None
    adopcion_detalle: str | None = None
    participacion_nivel: str | None = None
    participacion_detalle: str | None = None
    eficiencia_resumen: str | None = None
    eficiencia_detalle: str | None = None
    fecha_identificado: date | None = None

    @field_validator("resumen")
    @classmethod
    def resumen_max(cls, value: str) -> str:
        if len(value) > 140:
            raise ValueError("resumen no puede superar 140 caracteres")
        return value


class CasoCreate(CasoBase):
    slug: str | None = Field(default=None, max_length=255)
    visible_publico: bool = False


class CasoUpdate(BaseModel):
    """Todos opcionales; null o '' vacían campos de texto."""

    codigo: str | None = None
    slug: str | None = None
    titulo: str | None = None
    resumen: str | None = None
    champion: str | None = None
    area: str | None = None
    descripcion: str | None = None
    problema: str | None = None
    valor_esperado: str | None = None
    publico_objetivo: str | None = None
    alcance: str | None = None
    diseno: str | None = None
    herramientas: list[str] | None = None
    beneficiarios: list[str] | None = None
    tags: list[str] | None = None
    flujo: FlujoPasos | None = None
    etapa_actual: CasoEtapa | None = None
    estado: CasoEstado | None = None
    visible_publico: bool | None = None
    adopcion_nivel: str | None = None
    adopcion_detalle: str | None = None
    participacion_nivel: str | None = None
    participacion_detalle: str | None = None
    eficiencia_resumen: str | None = None
    eficiencia_detalle: str | None = None
    fecha_identificado: date | None = None


class CasoPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    codigo: str | None
    slug: str
    titulo: str
    resumen: str
    champion: str
    area: str
    descripcion: str | None
    problema: str | None
    valor_esperado: str | None
    publico_objetivo: str | None
    alcance: str | None
    diseno: str | None
    herramientas: list[str]
    beneficiarios: list[str]
    tags: list[str]
    flujo: FlujoPasos
    etapa_actual: CasoEtapa
    estado: CasoEstado
    visible_publico: bool
    adopcion_nivel: str | None
    adopcion_detalle: str | None
    participacion_nivel: str | None
    participacion_detalle: str | None
    eficiencia_resumen: str | None
    eficiencia_detalle: str | None
    fecha_identificado: date | None
    created_at: datetime
    updated_at: datetime
    avance_pct: int
    etapas_checklist: list[EtapaChecklistItem]
    dias_activo: int | None


class CasoAdmin(CasoPublic):
    owner_user_id: UUID


class ChampionSummary(BaseModel):
    champion: str
    areas: list[str]
    case_count: int


class PublicarBody(BaseModel):
    visible_publico: bool
