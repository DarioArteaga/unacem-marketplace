from fastapi import APIRouter, HTTPException, Query, Response, status

from app.api.deps import DbSession
from app.models.caso import CasoEstado, CasoEtapa
from app.schemas.caso import CasoPublic, ChampionSummary
from app.schemas.common import PaginatedResponse
from app.services import casos as casos_service
from app.services.pdf import build_case_pdf, build_catalog_pdf

router = APIRouter()


@router.get("/casos/export.pdf")
def export_casos_pdf(db: DbSession) -> Response:
    """Descarga consolidada en PDF del catálogo público de casos. Debe ir antes de /casos/{slug}."""
    casos = casos_service.list_public_casos_raw(db)
    pdf_bytes = build_catalog_pdf(casos)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="catalogo-casos-proyecto-salto.pdf"'
        },
    )


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


@router.get("/casos/{slug}/export.pdf")
def export_caso_pdf(slug: str, db: DbSession) -> Response:
    """Descarga en PDF de la ficha individual de un caso publicado."""
    caso = casos_service.get_public_by_slug(db, slug)
    if not caso:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    pdf_bytes = build_case_pdf(caso)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{caso.slug}.pdf"'},
    )


@router.get("/champions", response_model=list[ChampionSummary])
def get_champions(db: DbSession) -> list[ChampionSummary]:
    return casos_service.list_champions(db)


@router.get("/tags", response_model=list[str])
def get_tags(db: DbSession) -> list[str]:
    return casos_service.list_tags(db)
