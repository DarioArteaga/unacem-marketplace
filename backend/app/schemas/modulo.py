from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class ModuloPublic(BaseModel):
    slug: str
    titulo: str
    duracion_estimada: str
    total_pasos: int


class ModuloProgresoRead(BaseModel):
    modulo_slug: str
    current_step: int
    visited: list[int]
    quizzes: dict[str, str]
    matrix: dict[str, str]
    reflexiones: dict[str, str]
    completed_at: datetime | None
    updated_at: datetime | None = None


class ModuloProgresoWrite(BaseModel):
    current_step: int = Field(ge=0, le=20)
    visited: list[int] = Field(default_factory=list)
    quizzes: dict[str, str] = Field(default_factory=dict)
    matrix: dict[str, str] = Field(default_factory=dict)
    reflexiones: dict[str, str] = Field(default_factory=dict)
