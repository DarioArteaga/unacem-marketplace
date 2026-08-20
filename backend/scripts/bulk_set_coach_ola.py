"""Asigna coach/ola en bloque a un listado fijo de casos (por título exacto).

Uso: define TITULOS, COACH y OLA abajo y corre `python scripts/bulk_set_coach_ola.py`
con DATABASE_URL apuntando a la BDD destino. Reporta qué títulos no encontró para
poder corregirlos a mano (no falla en silencio).
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select

from app.core.logging import get_logger, setup_logging
from app.db.session import SessionLocal
from app.models.caso import Caso, CasoCoach, CasoOla

setup_logging()
logger = get_logger("bulk_set_coach_ola")

COACH = CasoCoach.dario
OLA = CasoOla.ola_2

TITULOS = [
    "Automatización del análisis de sobrecarga y asignación de recursos en PMO",
    "Automatización del registro de asientos contables para conciliación bancaria en SAP",
    "Automatización de presentación mensual para comité de cementos",
    "Predicción de indicadores de proyectos",
    "Estimación de esfuerzo para nuevos proyectos",
    "Consolidación y proyección de desembolsos mensuales",
    "Liquidación mensual de IGV",
    "Conciliación automática de registros contables",
    "Conciliación de registros contables",
    "Clasificador de materiales",
    "Certificados de retención a proveedores del exterior",
]


def main() -> None:
    db = SessionLocal()
    try:
        casos = db.scalars(select(Caso).where(Caso.titulo.in_(TITULOS))).all()
        encontrados = {c.titulo for c in casos}
        faltantes = [t for t in TITULOS if t not in encontrados]

        for caso in casos:
            caso.coach = COACH
            caso.ola = OLA
        db.commit()

        logger.info("Actualización masiva coach/ola", actualizados=len(casos), esperados=len(TITULOS))
        for caso in casos:
            print(f"OK  · {caso.titulo}")
        for titulo in faltantes:
            print(f"NO ENCONTRADO · {titulo}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
