from __future__ import annotations

import io
from datetime import date

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from app.models.caso import Caso, CasoCoach, CasoOla
from app.schemas.caso import ETAPA_LABELS

BRAND_COLOR = colors.HexColor("#8C1A2B")
MUTED_COLOR = colors.HexColor("#5B5B5B")

COACH_LABELS: dict[CasoCoach, str] = {
    CasoCoach.jhonatan: "Jhonatan",
    CasoCoach.dario: "Darío",
}

OLA_LABELS: dict[CasoOla, str] = {
    CasoOla.ola_1: "Ola 1",
    CasoOla.ola_2: "Ola 2",
    CasoOla.ola_3: "Ola 3",
}


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "SaltoTitle", parent=base["Title"], textColor=BRAND_COLOR, fontSize=18
        ),
        "subtitle": ParagraphStyle(
            "SaltoSubtitle", parent=base["Normal"], textColor=MUTED_COLOR, fontSize=9
        ),
        "cell": ParagraphStyle(
            "SaltoCell", parent=base["Normal"], fontSize=8, leading=10
        ),
        "cell_title": ParagraphStyle(
            "SaltoCellTitle", parent=base["Normal"], fontSize=8, leading=10, textColor=BRAND_COLOR
        ),
    }


def build_catalog_pdf(casos: list[Caso]) -> bytes:
    """Genera un PDF consolidado del catálogo de casos publicados en el marketplace."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        leftMargin=1.5 * cm,
        rightMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )
    styles = _styles()
    story = [
        Paragraph("Catálogo de casos de uso — Proyecto Salto", styles["title"]),
        Paragraph(
            f"Grupo UNACEM · {len(casos)} casos publicados · generado el "
            f"{date.today().strftime('%d/%m/%Y')}",
            styles["subtitle"],
        ),
        Spacer(1, 0.6 * cm),
    ]

    header = ["Título", "Champion", "Área", "Coach", "Ola", "Etapa", "Avance"]
    rows: list[list[object]] = [header]
    for caso in sorted(casos, key=lambda c: c.area.lower()):
        rows.append(
            [
                Paragraph(caso.titulo, styles["cell_title"]),
                Paragraph(caso.champion, styles["cell"]),
                Paragraph(caso.area, styles["cell"]),
                Paragraph(COACH_LABELS.get(caso.coach, "—") if caso.coach else "—", styles["cell"]),
                Paragraph(OLA_LABELS.get(caso.ola, "—") if caso.ola else "—", styles["cell"]),
                Paragraph(ETAPA_LABELS.get(caso.etapa_actual, "—"), styles["cell"]),
                Paragraph(f"{caso.avance_pct}%", styles["cell"]),
            ]
        )

    table = Table(
        rows,
        colWidths=[7 * cm, 4 * cm, 3.5 * cm, 3 * cm, 2.5 * cm, 3 * cm, 2 * cm],
        repeatRows=1,
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND_COLOR),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTSIZE", (0, 0), (-1, 0), 9),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
                ("TOPPADDING", (0, 0), (-1, 0), 6),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E0E0E0")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F7F5F3")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)

    doc.build(story)
    return buffer.getvalue()
