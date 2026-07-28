#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
CSV-Import für MiScale Messdaten.

Liest CSV-Dateien aus data/import/, berechnet Body Metrics,
macht Upsert in die DB und verschiebt verarbeitete Dateien nach data/import/done/.

Format der Import-CSV (Semikolon-getrennt, mit Header):
    id;name;timestamp;date;weight;impedance

Usage:
    python scripts/import_csv.py
    python scripts/import_csv.py --dry-run
    python scripts/import_csv.py --file data/import/peter.csv
"""

import argparse
import csv
import logging
import os
import shutil
import sys
from datetime import date
from pathlib import Path

# Projekt-Root in sys.path aufnehmen
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from app.core.config import cfg
from app.models.person import UserProfile
from app.models.user_service import UserService
from app.services.calcdata import CalcData
from app.services.db_manager import DBManager

log = logging.getLogger(__name__)


def _user_with_age_at(user: UserProfile, measure_date: date) -> UserProfile:
    """Erstellt eine UserProfile-Kopie deren age() das Messdatum nutzt."""

    class _FixedAgeProfile(UserProfile):
        _measure_date: date = measure_date

        def age(self) -> float:
            birth = date.fromisoformat(self.dob)
            delta = self._measure_date - birth
            return round(delta.days / 365.0, 2)

    return _FixedAgeProfile(
        name=user.name,
        sex=user.sex,
        height=user.height,
        dob=user.dob,
        athletic=user.athletic,
        activity=user.activity,
        weight_threshold=user.weight_threshold,
        scores=user.scores,
        adjustments=user.adjustments,
    )


def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)-5s | %(message)s",
        datefmt="%H:%M:%S",
    )


def parse_import_csv(filepath: str) -> list[dict]:
    """Liest eine Import-CSV und gibt die Zeilen als Dicts zurück."""
    rows = []
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")
        for row in reader:
            if not row.get("weight") or not row.get("impedance"):
                continue
            rows.append(row)
    return rows


def import_file(filepath: str, db: DBManager, user_service: UserService, dry_run: bool = False) -> bool:
    """Importiert eine einzelne CSV-Datei. Gibt True bei Erfolg zurück."""
    filename = os.path.basename(filepath)
    rows = parse_import_csv(filepath)

    if not rows:
        log.warning("Keine gültigen Zeilen in %s", filename)
        return False

    log.info("Importiere %s (%d Zeilen)", filename, len(rows))
    success_count = 0
    skip_count = 0

    for row in rows:
        name = row.get("name", "").strip()
        weight = float(row["weight"])
        impedance = int(row["impedance"])
        timestamp = row.get("timestamp", "")

        user = user_service.find_by_name(name)
        if not user:
            log.warning("User '%s' nicht in persons.yaml, überspringe", name)
            skip_count += 1
            continue

        # Body Metrics berechnen (Alter auf Messdatum beziehen)
        measure_date = date.fromisoformat(row.get("date", timestamp[:10]))
        calc = CalcData(user, weight, impedance, timestamp)
        calc.user = _user_with_age_at(user, measure_date)
        data = calc.calculate()

        if dry_run:
            log.info("  [DRY-RUN] %s | %s | %.2f kg | imp=%d → fat=%.2f bmi=%.2f",
                     name, row.get("date", ""), weight, impedance, data["fat"], data["bmi"])
            success_count += 1
            continue

        # Upsert in DB (schreibt auch CSV-Backup in history/)
        ok = db.upsert(int(row.get("id", 0)), data)
        if ok:
            success_count += 1
        else:
            log.error("Upsert fehlgeschlagen: %s %s", name, row.get("date", ""))

    log.info("Ergebnis %s: %d OK, %d übersprungen", filename, success_count, skip_count)
    return success_count > 0


def move_to_done(filepath: str):
    """Verschiebt verarbeitete Datei nach data/import/done/."""
    done_dir = os.path.join(os.path.dirname(filepath), "done")
    os.makedirs(done_dir, exist_ok=True)
    dest = os.path.join(done_dir, os.path.basename(filepath))

    # Bei Namenskollision überschreiben
    if os.path.exists(dest):
        os.remove(dest)

    shutil.move(filepath, dest)
    log.info("Verschoben → %s", dest)


def main():
    parser = argparse.ArgumentParser(description="MiScale CSV Import")
    parser.add_argument("--file", help="Einzelne CSV-Datei importieren")
    parser.add_argument("--dry-run", action="store_true", help="Nur simulieren, nichts schreiben")
    args = parser.parse_args()

    setup_logging()

    import_dir = os.path.join(cfg.data_dir, "import")

    # Dateien bestimmen
    if args.file:
        files = [args.file] if os.path.isfile(args.file) else []
    else:
        if not os.path.isdir(import_dir):
            log.info("Import-Verzeichnis nicht vorhanden: %s", import_dir)
            return
        files = sorted(
            str(p) for p in Path(import_dir).glob("*.csv")
            if p.name != ".gitkeep"
        )

    if not files:
        log.info("Keine CSV-Dateien zum Import gefunden")
        return

    db = DBManager()
    user_service = UserService()

    for filepath in files:
        ok = import_file(filepath, db, user_service, dry_run=args.dry_run)
        if ok and not args.dry_run:
            move_to_done(filepath)


if __name__ == "__main__":
    main()
