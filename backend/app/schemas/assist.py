from pydantic import BaseModel, Field

from app.schemas.caso import FlujoPasos


class AssistRequest(BaseModel):
    texto: str = Field(min_length=10, max_length=50000)


class AssistSuggestion(BaseModel):
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
    codigo: str | None = None
