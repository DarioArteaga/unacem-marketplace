"""initial users and casos

Revision ID: 001
Revises:
Create Date: 2026-07-20

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

user_role = postgresql.ENUM("super_admin", "coach", "viewer", name="user_role", create_type=False)
caso_etapa = postgresql.ENUM(
    "identificacion",
    "diseno",
    "implementacion",
    "marketplace",
    name="caso_etapa",
    create_type=False,
)
caso_estado = postgresql.ENUM(
    "enproceso",
    "implementado",
    "publicado",
    name="caso_estado",
    create_type=False,
)


def upgrade() -> None:
    user_role.create(op.get_bind(), checkfirst=True)
    caso_etapa.create(op.get_bind(), checkfirst=True)
    caso_estado.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("nombre", sa.String(255), nullable=False),
        sa.Column("role", user_role, nullable=False, server_default="viewer"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "casos",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("codigo", sa.String(64), nullable=True),
        sa.Column("slug", sa.String(255), nullable=False),
        sa.Column("titulo", sa.String(255), nullable=False),
        sa.Column("resumen", sa.String(140), nullable=False),
        sa.Column("champion", sa.String(255), nullable=False),
        sa.Column("area", sa.String(255), nullable=False),
        sa.Column("owner_user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=True),
        sa.Column("problema", sa.Text(), nullable=True),
        sa.Column("valor_esperado", sa.Text(), nullable=True),
        sa.Column("publico_objetivo", sa.Text(), nullable=True),
        sa.Column("alcance", sa.Text(), nullable=True),
        sa.Column("diseno", sa.Text(), nullable=True),
        sa.Column("herramientas", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("beneficiarios", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column("tags", postgresql.ARRAY(sa.String()), nullable=False, server_default="{}"),
        sa.Column(
            "flujo",
            postgresql.JSONB(),
            nullable=False,
            server_default=sa.text("'{\"entradas\":[],\"pasos\":[],\"salidas\":[]}'::jsonb"),
        ),
        sa.Column("etapa_actual", caso_etapa, nullable=False, server_default="identificacion"),
        sa.Column("estado", caso_estado, nullable=False, server_default="enproceso"),
        sa.Column("visible_publico", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("adopcion_nivel", sa.String(64), nullable=True),
        sa.Column("adopcion_detalle", sa.Text(), nullable=True),
        sa.Column("participacion_nivel", sa.String(64), nullable=True),
        sa.Column("participacion_detalle", sa.Text(), nullable=True),
        sa.Column("eficiencia_resumen", sa.String(255), nullable=True),
        sa.Column("eficiencia_detalle", sa.Text(), nullable=True),
        sa.Column("fecha_identificado", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()")),
    )
    op.create_index("ix_casos_slug", "casos", ["slug"], unique=True)
    op.create_index("ix_casos_codigo", "casos", ["codigo"], unique=True)
    op.create_index("ix_casos_owner_user_id", "casos", ["owner_user_id"])
    op.create_index("ix_casos_visible_publico", "casos", ["visible_publico"])


def downgrade() -> None:
    op.drop_index("ix_casos_visible_publico", table_name="casos")
    op.drop_index("ix_casos_owner_user_id", table_name="casos")
    op.drop_index("ix_casos_codigo", table_name="casos")
    op.drop_index("ix_casos_slug", table_name="casos")
    op.drop_table("casos")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    caso_estado.drop(op.get_bind(), checkfirst=True)
    caso_etapa.drop(op.get_bind(), checkfirst=True)
    user_role.drop(op.get_bind(), checkfirst=True)
