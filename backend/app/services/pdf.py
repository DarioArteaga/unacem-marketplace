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
ROW_ALT_COLOR = colors.HexColor("#F7F5F3")
GRID_COLOR = colors.HexColor("#E0E0E0")

COACH_LABELS: dict[CasoCoach, str] = {
    CasoCoach.jhonatan: "Jhonatan",
    CasoCoach.dario: "Darío",
}

OLA_LABELS: dict[CasoOla, str] = {
    CasoOla.ola_1: "Ola 1",
    CasoOla.ola_2: "Ola 2",
    CasoOla.ola_3: "Ola 3",
}

# Compartido por todas las tablas: sin GRID + TOP + wrap el texto largo se
# desbordaba de la celda en vez de ajustarse (bug detectado en producción).
TABLE_BASE_STYLE = [
    ("BACKGROUND", (0, 0), (-1, 0), BRAND_COLOR),
    ("GRID", (0, 0), (-1, -1), 0.5, GRID_COLOR),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]


def _styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "SaltoTitle", parent=base["Title"], textColor=BRAND_COLOR, fontSize=18
        ),
        "subtitle": ParagraphStyle(
            "SaltoSubtitle", parent=base["Normal"], textColor=MUTED_COLOR, fontSize=9, leading=13
        ),
        "h2": ParagraphStyle(
            "SaltoH2",
            parent=base["Heading2"],
            textColor=BRAND_COLOR,
            fontSize=13,
            spaceBefore=8,
            spaceAfter=4,
        ),
        "body": ParagraphStyle("SaltoBody", parent=base["Normal"], fontSize=10, leading=14),
        "cell": ParagraphStyle("SaltoCell", parent=base["Normal"], fontSize=8, leading=11),
        "cell_title": ParagraphStyle(
            "SaltoCellTitle",
            parent=base["Normal"],
            fontSize=8,
            leading=11,
            textColor=BRAND_COLOR,
            fontName="Helvetica-Bold",
        ),
        "cell_header": ParagraphStyle(
            "SaltoCellHeader",
            parent=base["Normal"],
            fontSize=9,
            leading=11,
            textColor=colors.white,
            fontName="Helvetica-Bold",
        ),
    }


def _esc(text: str | None) -> str:
    """Escapa texto libre antes de pasarlo a Paragraph (usa un mini-parser XML)."""
    if not text:
        return ""
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def _cell(text: str | None, style: ParagraphStyle, empty: str = "—") -> Paragraph:
    """Envuelve texto de celda en Paragraph para que haga word-wrap dentro de la columna."""
    clean = _esc(text).strip()
    return Paragraph(clean if clean else empty, style)


def _header_row(labels: list[str], styles: dict[str, ParagraphStyle]) -> list[Paragraph]:
    return [_cell(label, styles["cell_header"], empty=label) for label in labels]


def _numbered_list(items: list[str], styles: dict[str, ParagraphStyle]) -> Paragraph:
    if not items:
        return Paragraph("[por confirmar]", styles["cell"])
    text = "<br/>".join(f"{i + 1}. {_esc(item)}" for i, item in enumerate(items))
    return Paragraph(text, styles["cell"])


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
    total = len(casos)
    casos_label = "1 caso publicado" if total == 1 else f"{total} casos publicados"
    story: list[object] = [
        Paragraph("Catálogo de casos de uso — Proyecto Salto", styles["title"]),
        Paragraph(
            f"Grupo UNACEM · {casos_label} · generado el {date.today().strftime('%d/%m/%Y')}",
            styles["subtitle"],
        ),
        Spacer(1, 0.6 * cm),
    ]

    header = ["Título", "Resumen", "Champion", "Área", "Coach", "Ola", "Etapa", "Avance"]
    rows: list[list[object]] = [_header_row(header, styles)]
    for caso in sorted(casos, key=lambda c: c.area.lower()):
        coach_label = COACH_LABELS.get(caso.coach, "—") if caso.coach else "—"
        ola_label = OLA_LABELS.get(caso.ola, "—") if caso.ola else "—"
        rows.append(
            [
                _cell(caso.titulo, styles["cell_title"]),
                _cell(caso.resumen, styles["cell"]),
                _cell(caso.champion, styles["cell"]),
                _cell(caso.area, styles["cell"]),
                _cell(coach_label, styles["cell"]),
                _cell(ola_label, styles["cell"]),
                _cell(ETAPA_LABELS.get(caso.etapa_actual, "—"), styles["cell"]),
                _cell(f"{caso.avance_pct}%", styles["cell"]),
            ]
        )

    # Suma = 26.5cm; con landscape A4 (29.7cm) y márgenes 1.5cm x2, el ancho útil es 26.7cm.
    table = Table(
        rows,
        colWidths=[4.5 * cm, 6 * cm, 3.5 * cm, 3 * cm, 2.5 * cm, 1.8 * cm, 2.7 * cm, 2.5 * cm],
        repeatRows=1,
    )
    table.setStyle(
        TableStyle(
            [
                *TABLE_BASE_STYLE,
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ROW_ALT_COLOR]),
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
        Paragraph(_esc(text).replace("\n", "<br/>"), styles["body"]),
        Spacer(1, 0.25 * cm),
    ]


def _list_block(
    title: str, items: list[str], styles: dict[str, ParagraphStyle]
) -> list[object]:
    if not items:
        return []
    bullet_text = "<br/>".join(f"• {_esc(item)}" for item in items)
    return [
        Paragraph(title, styles["h2"]),
        Paragraph(bullet_text, styles["body"]),
        Spacer(1, 0.25 * cm),
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
    styles = _styles()

    coach_label = COACH_LABELS.get(caso.coach, "—") if caso.coach else "—"
    ola_label = OLA_LABELS.get(caso.ola, "—") if caso.ola else "—"

    story: list[object] = [
        Paragraph(_esc(caso.titulo), styles["title"]),
        Paragraph(
            f"{_esc(caso.champion)} · {_esc(caso.area)} · Coach: {coach_label} · {ola_label}",
            styles["subtitle"],
        ),
        Paragraph(
            f"Etapa: {ETAPA_LABELS.get(caso.etapa_actual, '—')} · Avance: {caso.avance_pct}% · "
            f"Generado el {date.today().strftime('%d/%m/%Y')}",
            styles["subtitle"],
        ),
        Spacer(1, 0.5 * cm),
        Paragraph(_esc(caso.resumen), styles["body"]),
        Spacer(1, 0.3 * cm),
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
    entradas = list(flujo.get("entradas") or [])
    pasos = list(flujo.get("pasos") or [])
    salidas = list(flujo.get("salidas") or [])
    if entradas or pasos or salidas:
        story.append(Paragraph("El flujo", styles["h2"]))
        # Entradas/Pasos/Salidas son 3 listas independientes (no filas correlacionadas
        # 1 a 1): modelarlas como una tabla de filas por ítem generaba filas ragged
        # y celdas vacías. Una fila con 3 columnas, cada una con su propia lista
        # numerada, calca el diseño de la ficha web (FlujoPasos.tsx) y evita el problema.
        flujo_rows: list[list[object]] = [
            _header_row(["Entradas", "Pasos", "Salidas"], styles),
            [
                _numbered_list(entradas, styles),
                _numbered_list(pasos, styles),
                _numbered_list(salidas, styles),
            ],
        ]
        # Suma = 15.5cm; A4 retrato (21cm) con márgenes 2cm x2 da 17cm útiles.
        flujo_table = Table(flujo_rows, colWidths=[5.2 * cm, 5.2 * cm, 5.1 * cm])
        flujo_table.setStyle(TableStyle(TABLE_BASE_STYLE))
        story.append(flujo_table)
        story.append(Spacer(1, 0.3 * cm))

    metric_tiles = [
        ("Adopción", caso.adopcion_nivel, caso.adopcion_detalle),
        ("Participación", caso.participacion_nivel, caso.participacion_detalle),
        ("Percepción de eficiencia", caso.eficiencia_resumen, caso.eficiencia_detalle),
    ]
    active_metrics = [t for t in metric_tiles if t[1] or t[2]]
    if active_metrics:
        story.append(Paragraph("Métricas", styles["h2"]))
        metric_rows: list[list[object]] = [_header_row(["Métrica", "Nivel", "Detalle"], styles)]
        for label, nivel, detalle in active_metrics:
            metric_rows.append(
                [
                    _cell(label, styles["cell_title"]),
                    _cell(nivel, styles["cell"]),
                    _cell(detalle, styles["cell"]),
                ]
            )
        # Suma = 15.5cm; igual ancho útil que la tabla de flujo.
        metric_table = Table(metric_rows, colWidths=[4 * cm, 3 * cm, 8.5 * cm])
        metric_table.setStyle(
            TableStyle(
                [
                    *TABLE_BASE_STYLE,
                    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, ROW_ALT_COLOR]),
                ]
            )
        )
        story.append(metric_table)

    doc.build(story)
    return buffer.getvalue()
