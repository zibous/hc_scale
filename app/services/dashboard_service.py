# -*- coding: utf-8 -*-
"""Dashboard Service – Datenbeschaffung und Aufbereitung für die Dashboard-API."""

import json
import logging
import os
import sqlite3
from datetime import datetime
from pathlib import Path

from app.core.config import cfg
from app.models.user_service import UserService
from app.services.db_manager import DBManager

log = logging.getLogger(__name__)


def _deduplicate_rows(rows: list[dict]) -> list[dict]:
    """Ein Messwert pro Kalendertag (neuester Timestamp gewinnt)."""
    seen = {}
    for r in rows:
        d = r["date"]
        if d not in seen or r["timestamp"] > seen[d]["timestamp"]:
            seen[d] = r
    return sorted(seen.values(), key=lambda x: x["date"])


class DashboardService:
    """Kapselt alle Datenoperationen für das Dashboard."""

    def __init__(self, db: DBManager):
        self._db = db

    # ------------------------------------------------------------------
    # DB-Queries
    # ------------------------------------------------------------------

    def query_before(self, user: str, before: str, limit: int = 30) -> list[dict]:
        """Historische Abfrage: Messwerte VOR einem Datum."""
        conn = self._connect()
        rows = conn.execute(
            "SELECT * FROM daily_miscale WHERE LOWER(name)=? AND date<? ORDER BY date DESC LIMIT ?",
            (user, before, limit),
        ).fetchall()
        conn.close()
        return _deduplicate_rows([dict(r) for r in reversed(rows)])

    def query_timeline(self, user: str, date_from: str = "", date_to: str = "") -> list[dict]:
        """Aktuelle Messwerte im gewählten Zeitraum."""
        conn = self._connect()
        if date_from and date_to:
            rows = conn.execute(
                "SELECT * FROM daily_miscale WHERE LOWER(name)=? AND date>=? AND date<=? ORDER BY date",
                (user, date_from, date_to),
            ).fetchall()
        elif date_from:
            rows = conn.execute(
                "SELECT * FROM daily_miscale WHERE LOWER(name)=? AND date>=? ORDER BY date",
                (user, date_from),
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM daily_miscale WHERE LOWER(name)=? ORDER BY date DESC LIMIT 365",
                (user,),
            ).fetchall()
            rows = list(reversed(rows))
        conn.close()
        return [dict(r) for r in rows]

    def query_previous(self, user: str, before_date: str, limit: int = 20) -> list[dict]:
        """Vergleichsdaten vor dem gewählten Zeitraum."""
        if not before_date:
            return []
        conn = self._connect()
        rows = conn.execute(
            "SELECT * FROM daily_miscale WHERE LOWER(name)=? AND date<? ORDER BY date DESC LIMIT ?",
            (user, before_date, limit),
        ).fetchall()
        conn.close()
        return [dict(r) for r in rows]

    def query_all_users(self) -> list[dict]:
        """Dropdown-Liste aller User mit Anzahl Messungen."""
        conn = self._connect()
        rows = conn.execute(
            "SELECT name, COUNT(*) as count FROM daily_miscale GROUP BY name"
        ).fetchall()
        conn.close()
        return [{"name": r["name"], "count": r["count"]} for r in rows]

    def load_dashboard_data(self, user: str, date_from: str, date_to: str) -> tuple[list[dict], list[dict], dict]:
        """Kompletter Datenladevorgang: Timeline + Previous + JSON-Patch + Deduplizierung."""
        current_list = self.query_timeline(user, date_from, date_to)
        previous_list = self.query_previous(user, date_from)
        json_data = self.load_user_json(user)

        if current_list:
            current_list = self.patch_measurements(current_list, json_data, mark_latest=True)
        else:
            # Kein DB-Eintrag im gewählten Zeitraum → Virtual-Entry mit dem Zieldatum
            today = datetime.now().strftime("%Y-%m-%d")
            target = date_to if date_to else (date_from if date_from else today)
            virtual = self.create_virtual_entry(user, json_data, target_date=target)
            if virtual:
                current_list = [virtual]

        if previous_list:
            previous_list = self.patch_measurements(previous_list, json_data, mark_latest=False)

        return _deduplicate_rows(current_list), _deduplicate_rows(previous_list), json_data

    # ------------------------------------------------------------------
    # JSON-Patch (Live-Daten aus Datei mit DB-Daten fusionieren)
    # ------------------------------------------------------------------

    def load_user_json(self, user: str) -> dict:
        """Lädt die JSON-Datei mit den letzten berechneten Werten."""
        json_path = Path(cfg.data_dir) / f"miscale-{user}.json"
        if not json_path.exists():
            json_path = Path(cfg.data_dir) / f"miscale-{user.capitalize()}.json"
        if not json_path.exists():
            return {}
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            log.warning("Konnte JSON-Datei %s nicht lesen", json_path)
            return {}

    def patch_measurements(self, items: list[dict], json_data: dict, mark_latest: bool = True) -> list[dict]:
        """Reichert Messwerte mit berechneten Feldern aus der JSON-Datei an."""
        if not items:
            return items
        result = []
        for i, item in enumerate(items):
            is_latest = mark_latest and (i == len(items) - 1)
            result.append(self._patch_item(dict(item), json_data, is_latest))
        return result

    def create_virtual_entry(self, user: str, json_data: dict, target_date: str = "") -> dict | None:
        """Erzeugt einen virtuellen Eintrag wenn keine DB-Daten vorhanden."""
        if not json_data:
            return None
        ts_val = json_data.get("timestamp", datetime.now().isoformat())
        # Wenn ein Zieldatum angegeben ist (z.B. "Heute"), verwende dieses
        date_val = target_date if target_date else ts_val[:10]
        item = {
            "id": 9999, "name": user.capitalize(),
            "timestamp": ts_val, "date": date_val,
            "weight": json_data.get("weight", 0.0),
            "impedance": json_data.get("impedance", 0),
            "fat": json_data.get("fat", 0.0),
            "visceral": json_data.get("visceral", 0.0),
            "water": json_data.get("water", 0.0),
            "muscle": json_data.get("muscle", 0.0),
            "bmi": json_data.get("bmi", 0.0),
            "protein": json_data.get("protein", 0.0),
            "lbm": json_data.get("lbm", 0.0),
            "poi": json_data.get("poi", 0.0),
        }
        return self._patch_item(item, json_data, is_latest=True)

    # ------------------------------------------------------------------
    # Metadaten
    # ------------------------------------------------------------------

    def get_user_meta(self, user: str, json_data: dict) -> dict:
        """Benutzerprofil-Metadaten zusammenbauen."""
        meta = {"name": user, "sex": "male", "target": 70.0, "avatar": f"dashboard/avatar/{user}"}
        try:
            us = UserService()
            u_info = us.find_by_name(user)
            if u_info:
                meta["target"] = u_info.scores.get("WEIGHT", 70.0)
                meta["sex"] = u_info.sex
                meta["scores"] = {
                    **u_info.scores,
                    "BMR": json_data.get("tdee", u_info.scores.get("BMR", 2200)),
                }
        except Exception:
            pass
        return meta

    def get_system_meta(self, history_len: int = 0) -> dict:
        """System-Informationen."""
        images_dir = str(Path(cfg.config_dir).parent / "frontend")
        return {
            "servertime": datetime.now().strftime("%Y-%m-%d um %H:%M Uhr"),
            "apptitle": cfg.app_title,
            "appversion": cfg.app_version,
            "language": cfg.language,
            "scale_type": "XMTZC05HM",
            "scale_name": "MI Body Composition Scale 2",
            "scale_manu": "Xiaomi",
            "scale_image": os.path.join(images_dir, "miscale.png"),
            "hislen": history_len,
        }

    # ------------------------------------------------------------------
    # Private Helpers
    # ------------------------------------------------------------------

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self._db.db_path, timeout=30)
        conn.row_factory = sqlite3.Row
        return conn

    def _patch_item(self, item: dict, json_data: dict, is_latest: bool) -> dict:
        """Einzelnes Mess-Item mit JSON-Fallbacks anreichern."""
        # Fallbacks für Metriken
        item["metabolic_age"] = (
            item.get("metabolic_age")
            if item.get("metabolic_age") is not None
            else json_data.get("metabolic_age")
        )
        item["bodytype"] = item.get("bodytype") or json_data.get("bodytype", "Ausgeglichen")

        # Typ-sichere numerische Felder
        for field, default in [("targetweight", 70.0), ("ffmi", 0.0), ("bone", 0.0), ("bmr", 1148.0), ("tdee", 2411.0)]:
            try:
                val = item.get(field)
                if val is None:
                    val = json_data.get(field)
                if val is None:
                    val = default
                item[field] = float(val)
            except (ValueError, TypeError):
                item[field] = default

        # Live-Werte nur auf das neueste Element
        if is_latest and json_data:
            item["metabolic_age"] = json_data.get("metabolic_age", item["metabolic_age"])
            item["bodytype"] = json_data.get("bodytype", item["bodytype"])
            item["targetweight"] = float(json_data.get("targetweight", item["targetweight"]))
            item["ffmi"] = float(json_data.get("ffmi", item["ffmi"]))
            item["bone"] = float(json_data.get("bone", item["bone"]))
            item["bmr"] = float(json_data.get("bmr", item["bmr"]))
            item["tdee"] = float(json_data.get("tdee", item["tdee"]))

            if "timestamp" in json_data and json_data["timestamp"]:
                ts_str = str(json_data["timestamp"])
                item["timestamp"] = ts_str
                item["date"] = ts_str[:10]

        return item
