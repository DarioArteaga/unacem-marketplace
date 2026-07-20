from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CoachOrAdmin, DbSession
from app.schemas.caso import CasoAdmin, CasoCreate, CasoUpdate, PublicarBody
from app.schemas.common import MessageResponse, PaginatedResponse
from app.services import casos as casos_service
from app.services.revalidate import trigger_revalidate

router = APIRouter(prefix="/admin/casos")


@router.get("", response_model=PaginatedResponse[CasoAdmin])
def list_admin_casos(
    db: DbSession,
    user: CoachOrAdmin,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> PaginatedResponse[CasoAdmin]:
    return casos_service.list_admin_casos(db, user, page=page, page_size=page_size)


@router.post("", response_model=CasoAdmin, status_code=status.HTTP_201_CREATED)
def create_caso(body: CasoCreate, db: DbSession, user: CoachOrAdmin) -> CasoAdmin:
    caso = casos_service.create_caso(db, body, user)
    if caso.visible_publico:
        trigger_revalidate(["/", f"/casos/{caso.slug}"])
    return casos_service.caso_to_admin(caso)


@router.get("/{caso_id}", response_model=CasoAdmin)
def get_admin_caso(caso_id: UUID, db: DbSession, user: CoachOrAdmin) -> CasoAdmin:
    caso = casos_service.get_caso_for_user(db, caso_id, user)
    if not caso:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    return casos_service.caso_to_admin(caso)


@router.patch("/{caso_id}", response_model=CasoAdmin)
def patch_caso(
    caso_id: UUID, body: CasoUpdate, db: DbSession, user: CoachOrAdmin
) -> CasoAdmin:
    caso = casos_service.get_caso_for_user(db, caso_id, user)
    if not caso:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    updated = casos_service.update_caso(db, caso, body)
    if updated.visible_publico:
        trigger_revalidate(["/", f"/casos/{updated.slug}"])
    return casos_service.caso_to_admin(updated)


@router.delete("/{caso_id}", response_model=MessageResponse)
def remove_caso(caso_id: UUID, db: DbSession, user: CoachOrAdmin) -> MessageResponse:
    caso = casos_service.get_caso_for_user(db, caso_id, user)
    if not caso:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    slug = caso.slug
    was_public = caso.visible_publico
    casos_service.delete_caso(db, caso)
    if was_public:
        trigger_revalidate(["/", f"/casos/{slug}"])
    return MessageResponse(detail="Caso eliminado")


@router.post("/{caso_id}/publicar", response_model=CasoAdmin)
def publicar_caso(
    caso_id: UUID, body: PublicarBody, db: DbSession, user: CoachOrAdmin
) -> CasoAdmin:
    caso = casos_service.get_caso_for_user(db, caso_id, user)
    if not caso:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caso no encontrado")
    updated = casos_service.set_visible(db, caso, body.visible_publico)
    trigger_revalidate(["/", f"/casos/{updated.slug}"])
    return casos_service.caso_to_admin(updated)
