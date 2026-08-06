"""casos coach, ola y avance_pct editable

Revision ID: 003
Revises: 002
Create Date: 2026-08-06

"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

caso_coach = sa.Enum("jhonatan", "dario", name="caso_coach")
caso_ola = sa.Enum("ola_1", "ola_2", "ola_3", name="caso_ola")


def upgrade() -> None:
    caso_coach.create(op.get_bind(), checkfirst=True)
    caso_ola.create(op.get_bind(), checkfirst=True)

    op.add_column("casos", sa.Column("coach", caso_coach, nullable=True))
    op.add_column("casos", sa.Column("ola", caso_ola, nullable=True))
    op.add_column(
        "casos",
        sa.Column("avance_pct", sa.Integer(), nullable=False, server_default="25"),
    )

    # Antes avance_pct se derivaba de etapa_actual (25/50/75/100); se persiste ese
    # valor como punto de partida para no "resetear" el progreso ya visible.
    op.execute(
        """
        UPDATE casos SET avance_pct = CASE etapa_actual
            WHEN 'identificacion' THEN 25
            WHEN 'diseno' THEN 50
            WHEN 'implementacion' THEN 75
            WHEN 'marketplace' THEN 100
            ELSE 25
        END
        """
    )


def downgrade() -> None:
    op.drop_column("casos", "avance_pct")
    op.drop_column("casos", "ola")
    op.drop_column("casos", "coach")
    caso_ola.drop(op.get_bind(), checkfirst=True)
    caso_coach.drop(op.get_bind(), checkfirst=True)
