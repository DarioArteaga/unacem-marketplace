from __future__ import annotations

from fastapi import APIRouter

from app.api.deps import CurrentUser, DbSession
from app.schemas.modulo import ModuloProgresoRead, ModuloProgresoWrite, ModuloPublic
from app.services import modulos as service

router = APIRouter(prefix="/modulos")


@router.get("", response_model=list[ModuloPublic])
def list_modulos(db: DbSession, _user: CurrentUser) -> list[ModuloPublic]:
    return service.list_modulos(db)


@router.get("/{slug}", response_model=ModuloPublic)
def get_modulo(slug: str, db: DbSession, _user: CurrentUser) -> ModuloPublic:
    row = service.get_modulo_or_404(db, slug)
    return ModuloPublic(
        slug=row.slug,
        titulo=row.titulo,
        duracion_estimada=row.duracion_estimada,
        total_pasos=row.total_pasos,
    )


@router.get("/{slug}/progreso", response_model=ModuloProgresoRead)
def get_progreso(slug: str, db: DbSession, user: CurrentUser) -> ModuloProgresoRead:
    return service.get_progreso(db, user.id, slug)


@router.put("/{slug}/progreso", response_model=ModuloProgresoRead)
def put_progreso(
    slug: str, payload: ModuloProgresoWrite, db: DbSession, user: CurrentUser
) -> ModuloProgresoRead:
    return service.upsert_progreso(db, user.id, slug, payload)
