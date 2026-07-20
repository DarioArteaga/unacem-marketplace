from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import DbSession
from app.models.caso import CasoEstado, CasoEtapa
from app.schemas.caso import CasoPublic, ChampionSummary
from app.schemas.common import PaginatedResponse
from app.services import casos as casos_service

router = APIRouter()


@router.get("/casos", response_model=PaginatedResponse[CasoPublic])
def list_casos(
    db: DbSession,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    tag: str | None = None,
    estado: CasoEstado | None = None,
    champion: str | None = None,
    etapa: CasoEtapa | None = None,
) -> PaginatedResponse[CasoPublic]:
    return casos_service.list_public_casos(
        db,
        page=page,
        page_size=page_size,
        tag=tag,
        estado=estado,
        champion=champion,
        etapa=etapa,
    )


@router.get("/casos/{slug}", response_model=CasoPublic)
def get_caso(slug: str, db: DbSession) -> CasoPublic:
    caso = casos_service.get_public_by_slug(db, slug)
    if not caso:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    return casos_service.caso_to_public(caso)


@router.get("/champions", response_model=list[ChampionSummary])
def get_champions(db: DbSession) -> list[ChampionSummary]:
    return casos_service.list_champions(db)


@router.get("/tags", response_model=list[str])
def get_tags(db: DbSession) -> list[str]:
    return casos_service.list_tags(db)
