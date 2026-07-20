"""Crea o actualiza el super_admin desde variables de entorno."""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select

from app.core.config import get_settings
from app.core.logging import get_logger, setup_logging
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.user import User, UserRole

setup_logging()
logger = get_logger("seed_admin")


def main() -> None:
    settings = get_settings()
    db = SessionLocal()
    try:
        email = settings.super_admin_email.lower().strip()
        user = db.scalar(select(User).where(User.email == email))
        if user:
            user.password_hash = hash_password(settings.super_admin_password)
            user.nombre = settings.super_admin_nombre
            user.role = UserRole.super_admin
            user.is_active = True
            logger.info("Super admin actualizado", email=email)
        else:
            user = User(
                email=email,
                password_hash=hash_password(settings.super_admin_password),
                nombre=settings.super_admin_nombre,
                role=UserRole.super_admin,
            )
            db.add(user)
            logger.info("Super admin creado", email=email)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()
