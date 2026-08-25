"""modulos de aprendizaje y progreso por usuario

Revision ID: 004
Revises: 003
Create Date: 2026-08-25

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "004"
down_revision: Union[str, None] = "003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "modulos_aprendizaje",
        sa.Column("slug", sa.String(64), primary_key=True),
        sa.Column("titulo", sa.String(255), nullable=False),
        sa.Column("duracion_estimada", sa.String(64), nullable=False, server_default=""),
        sa.Column("total_pasos", sa.Integer(), nullable=False, server_default="7"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "modulos_progreso",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False),
        sa.Column(
            "modulo_slug",
            sa.String(64),
            sa.ForeignKey("modulos_aprendizaje.slug"),
            nullable=False,
        ),
        sa.Column("current_step", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("visited", postgresql.JSONB(), nullable=False, server_default=sa.text("'[]'::jsonb")),
        sa.Column("quizzes", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column("matrix", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")),
        sa.Column(
            "reflexiones", postgresql.JSONB(), nullable=False, server_default=sa.text("'{}'::jsonb")
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "modulo_slug", name="uq_modulo_progreso_user_slug"),
    )
    op.create_index("ix_modulos_progreso_user_id", "modulos_progreso", ["user_id"])
    op.create_index("ix_modulos_progreso_modulo_slug", "modulos_progreso", ["modulo_slug"])
    op.execute(
        """
        INSERT INTO modulos_aprendizaje (slug, titulo, duracion_estimada, total_pasos)
        VALUES (
            'pedagogia-entornos-digitales',
            'Pedagogía para entornos digitales',
            '~1h45–2h15',
            7
        )
        """
    )


def downgrade() -> None:
    op.drop_index("ix_modulos_progreso_modulo_slug", table_name="modulos_progreso")
    op.drop_index("ix_modulos_progreso_user_id", table_name="modulos_progreso")
    op.drop_table("modulos_progreso")
    op.drop_table("modulos_aprendizaje")
