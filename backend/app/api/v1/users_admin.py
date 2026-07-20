from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import DbSession, SuperAdmin
from app.models.user import User, UserRole
from app.schemas.user import UserActiveUpdate, UserPublic, UserRoleUpdate

router = APIRouter(prefix="/admin/users")


@router.get("", response_model=list[UserPublic])
def list_users(db: DbSession, _: SuperAdmin) -> list[User]:
    return list(db.scalars(select(User).order_by(User.created_at.desc())).all())


@router.patch("/{user_id}/role", response_model=UserPublic)
def update_role(
    user_id: UUID, body: UserRoleUpdate, db: DbSession, admin: SuperAdmin
) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    if user.id == admin.id and body.role != UserRole.super_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes quitarte el rol de super_admin a ti mismo",
        )
    user.role = body.role
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/activar", response_model=UserPublic)
def update_active(
    user_id: UUID, body: UserActiveUpdate, db: DbSession, admin: SuperAdmin
) -> User:
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    if user.id == admin.id and not body.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No puedes desactivarte a ti mismo",
        )
    user.is_active = body.is_active
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
