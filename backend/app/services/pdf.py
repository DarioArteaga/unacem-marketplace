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


def _section(title: str, text: str | None, styles: dict[str, ParagraphStyle]) -> list[object]:
    if not text or not text.strip():
        return []
    return [
        Paragraph(title, styles["h2"]),
        Paragraph(text.replace("\n", "<br/>"), styles["body"]),
        Spacer(1, 0.35 * cm),
    ]


def _list_block(
    title: str, items: list[str], styles: dict[str, ParagraphStyle]
) -> list[object]:
    if not items:
        return []
    bullet_text = "<br/>".join(f"• {item}" for item in items)
    return [
        Paragraph(title, styles["h2"]),
        Paragraph(bullet_text, styles["body"]),
        Spacer(1, 0.35 * cm),
    ]


def build_case_pdf(caso: Caso) -> bytes:
    """Genera la ficha en PDF de un solo caso (vista individual del marketplace)."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )
    base = getSampleStyleSheet()
    styles = _styles()
    styles["h2"] = ParagraphStyle(
        "SaltoH2", parent=base["Heading2"], textColor=BRAND_COLOR, fontSize=13, spaceBefore=6
    )
    styles["body"] = ParagraphStyle(
        "SaltoBody", parent=base["Normal"], fontSize=10, leading=14
    )

    coach_label = COACH_LABELS.get(caso.coach, "—") if caso.coach else "—"
    ola_label = OLA_LABELS.get(caso.ola, "—") if caso.ola else "—"

    story: list[object] = [
        Paragraph(caso.titulo, styles["title"]),
        Paragraph(
            f"{caso.champion} · {caso.area} · Coach: {coach_label} · {ola_label}",
            styles["subtitle"],
        ),
        Paragraph(
            f"Etapa: {ETAPA_LABELS.get(caso.etapa_actual, '—')} · Avance: {caso.avance_pct}% · "
            f"Generado el {date.today().strftime('%d/%m/%Y')}",
            styles["subtitle"],
        ),
        Spacer(1, 0.5 * cm),
        Paragraph(caso.resumen, styles["body"]),
        Spacer(1, 0.4 * cm),
    ]

    story += _section("Descripción", caso.descripcion, styles)
    story += _section("Problema que resuelve", caso.problema, styles)
    story += _section("Público objetivo", caso.publico_objetivo, styles)
    story += _section("Diseño · Sistemas", caso.diseno, styles)
    story += _section("Valor esperado", caso.valor_esperado, styles)
    story += _section("Alcance", caso.alcance, styles)
    story += _list_block("Herramientas", list(caso.herramientas or []), styles)
    story += _list_block("Beneficiarios", list(caso.beneficiarios or []), styles)

    flujo = caso.flujo if isinstance(caso.flujo, dict) else {}
    if any(flujo.get(k) for k in ("entradas", "pasos", "salidas")):
        story.append(Paragraph("El flujo", styles["h2"]))
        flujo_rows = [["Entradas", "Pasos", "Salidas"]]
        max_len = max(
            len(flujo.get("entradas") or []),
            len(flujo.get("pasos") or []),
            len(flujo.get("salidas") or []),
        )
        for i in range(max_len):
            flujo_rows.append(
                [
                    (flujo.get("entradas") or [])[i] if i < len(flujo.get("entradas") or []) else "",
                    (flujo.get("pasos") or [])[i] if i < len(flujo.get("pasos") or []) else "",
                    (flujo.get("salidas") or [])[i] if i < len(flujo.get("salidas") or []) else "",
                ]
            )
        flujo_table = Table(flujo_rows, colWidths=[5.5 * cm, 5.5 * cm, 5.5 * cm])
        flujo_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), BRAND_COLOR),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E0E0E0")),
                    ("FONTSIZE", (0, 0), (-1, -1), 8),
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 6),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ]
            )
        )
        story.append(flujo_table)
        story.append(Spacer(1, 0.4 * cm))

    metric_tiles = [
        ("Adopción", caso.adopcion_nivel, caso.adopcion_detalle),
        ("Participación", caso.participacion_nivel, caso.participacion_detalle),
        ("Percepción de eficiencia", caso.eficiencia_resumen, caso.eficiencia_detalle),
    ]
    if any(nivel or detalle for _, nivel, detalle in metric_tiles):
        story.append(Paragraph("Métricas", styles["h2"]))
        for label, nivel, detalle in metric_tiles:
            if not nivel and not detalle:
                continue
            texto = " — ".join(part for part in [nivel, detalle] if part)
            story.append(Paragraph(f"<b>{label}:</b> {texto}", styles["body"]))
        story.append(Spacer(1, 0.3 * cm))

    doc.build(story)
    return buffer.getvalue()
