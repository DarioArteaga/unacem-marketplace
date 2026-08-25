from fastapi import APIRouter

from app.api.v1 import assist, auth, casos_admin, casos_public, modulos, users_admin

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(casos_public.router, tags=["casos-public"])
api_router.include_router(casos_admin.router, tags=["casos-admin"])
api_router.include_router(users_admin.router, tags=["users-admin"])
api_router.include_router(assist.router, tags=["assist"])
api_router.include_router(modulos.router, tags=["modulos"])
