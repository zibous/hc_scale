# app/services/kpi_service.py
"""KPI-Service für hc_scale – liefert Körperwaage-Übersicht für das zentrale Dashboard."""

import json
import logging
from datetime import datetime
from pathlib import Path

from app.core.config import cfg
from app.schemas.kpi import KpiHero, KpiIndicator, KpiMetric, KpiResponse
from app.services.db_manager import DBManager

logger = logging.getLogger(__name__)

KPI_APP_ID = "hc_scale"
KPI_APP_NAME = "Körperwaage"
KPI_ICON = "fitness_center"
KPI_URL = "http://nuc:5000"

# User-Name → DB-ID Mapping (aus persons.yaml Reihenfolge)
USER_IDS = {"peter": 1, "reni": 2}


def _load_user_data(name: str) -> dict | None:
    """Lädt die letzte Messung eines Users aus der JSON-Datei."""
    path = Path(cfg.data_dir) / f"miscale-{name}.json"
    try:
        if path.is_file():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception as e:
        logger.warning(f"KPI: Fehler beim Laden von {path}: {e}")
    return None


def _get_weight_history(user_name: str, days: int = 30) -> list[float]:
    """Holt die letzten N Tage Gewichtsmessungen aus der DB für den Barchart."""
    user_id = USER_IDS.get(user_name.lower(), 0)
    if not user_id:
        return []
    try:
        db = DBManager()
        history = db.get_history(user_id, limit=days)
        # History ist DESC sortiert, umkehren für chronologische Reihenfolge
        history.reverse()
        return [round(h["weight"], 1) for h in history if h.get("weight")]
    except Exception as e:
        logger.warning(f"KPI: History-Fehler für {user_name}: {e}")
        return []


def _get_body_changes(user_name: str, days: int = 7) -> dict | None:
    """Berechnet Veränderung von Gewicht, Fett, Muskel, Wasser über N Tage."""
    user_id = USER_IDS.get(user_name.lower(), 0)
    if not user_id:
        return None
    try:
        db = DBManager()
        history = db.get_history(user_id, limit=days + 1)
        if len(history) < 2:
            return None
        # History ist DESC: [0] = neueste, [-1] = älteste
        newest = history[0]
        oldest = history[-1]

        def delta(key):
            v1 = newest.get(key)
            v2 = oldest.get(key)
            if v1 is not None and v2 is not None:
                return round(v1 - v2, 2)
            return 0.0

        return {
            "weight": delta("weight"),
            "fat": delta("fat"),
            "muscle": delta("muscle"),
            "water": delta("water"),
        }
    except Exception as e:
        logger.warning(f"KPI: Body-Changes-Fehler für {user_name}: {e}")
        return None


class KpiService:
    """Aggregiert Waage-KPI-Daten – pro User oder kombiniert."""

    def get_kpis(self, user: str | None = None) -> KpiResponse:
        """Liefert KPI-Daten. Mit user= wird eine personenbezogene Karte geliefert."""
        now = datetime.now()

        if user:
            return self._get_user_kpi(user.strip().lower(), now)
        return self._get_combined_kpi(now)

    def _get_user_kpi(self, user_name: str, now: datetime) -> KpiResponse:
        """KPI-Karte für einen einzelnen User mit 30-Tage Gewichts-Barchart."""
        data = _load_user_data(user_name.capitalize())

        if not data:
            return KpiResponse(
                app_id=KPI_APP_ID,
                app_name=f"Waage {user_name.capitalize()}",
                icon=KPI_ICON,
                url=KPI_URL,
                status="error",
                ts=now.isoformat(timespec="seconds"),
                hero=KpiHero(value="–", unit="", label="Keine Daten"),
            )

        weight = data.get("weight", 0)
        bmi = data.get("bmi", 0)
        fat = data.get("fat", 0)
        muscle = data.get("muscle", 0)
        ts_str = data.get("timestamp", "")

        # 30-Tage Gewichtsverlauf als Barchart
        history = _get_weight_history(user_name, days=30)

        # 7-Tage Veränderung (Fett, Muskel, Wasser, Gewicht)
        changes = _get_body_changes(user_name, days=7)

        # Trend berechnen: Vergleich letzte 7 Tage vs. vorherige 7 Tage
        trend_pct = None
        if len(history) >= 14:
            recent = sum(history[-7:]) / 7
            previous = sum(history[-14:-7]) / 7
            if previous > 0:
                trend_pct = round((recent - previous) / previous * 100, 1)

        # Indikator: deltabars wenn Veränderungsdaten vorhanden, sonst Gewichts-Barchart
        if changes:
            indicator = KpiIndicator(
                type="deltabars",
                label="Veränderung (7 Tage)",
                trend_pct=trend_pct,
                bars=[
                    {"label": "Gewicht", "value": changes["weight"], "color": "#f43f5e"},
                    {"label": "Körperfett", "value": changes["fat"], "color": "#f97316"},
                    {"label": "Muskelmasse", "value": changes["muscle"], "color": "#22c55e"},
                    {"label": "Körperwasser", "value": changes["water"], "color": "#3b82f6"},
                ],
            )
        elif history:
            indicator = KpiIndicator(
                type="barchart",
                values=history,
                trend_pct=trend_pct,
                unit="kg",
                label="Gewicht",
            )
        else:
            indicator = KpiIndicator(
                type="gauge",
                min=15,
                max=35,
                value=bmi,
                zones=[
                    {"from": 15, "to": 18.5, "color": "#3b82f6", "label": "Untergewicht"},
                    {"from": 18.5, "to": 25, "color": "#22c55e", "label": "Normal"},
                    {"from": 25, "to": 30, "color": "#f59e0b", "label": "Übergewicht"},
                    {"from": 30, "to": 35, "color": "#ef4444", "label": "Adipositas"},
                ],
            )

        # Detail: letzte Messung
        detail = f"Letzte Messung: {ts_str[:10]}" if ts_str else ""

        return KpiResponse(
            app_id=KPI_APP_ID,
            app_name=f"Waage {user_name.capitalize()}",
            icon=KPI_ICON,
            url=KPI_URL,
            status="ok",
            ts=now.isoformat(timespec="seconds"),
            hero=KpiHero(
                value=round(weight, 1),
                unit="kg",
                label=f"BMI {round(bmi, 1)}",
            ),
            detail=detail,
            indicator=indicator,
            metrics=[
                KpiMetric(label="BMI", value=round(bmi, 1)),
                KpiMetric(label="Fett", value=round(fat, 1), unit="%"),
                KpiMetric(label="Muskel", value=round(muscle, 1), unit="%"),
            ],
        )

    def _get_combined_kpi(self, now: datetime) -> KpiResponse:
        """Fallback: Kombinierte KPI-Karte (Rückwärtskompatibel)."""
        peter = _load_user_data("Peter")
        reni = _load_user_data("Reni")

        users = []
        if peter:
            users.append(peter)
        if reni:
            users.append(reni)

        if not users:
            return KpiResponse(
                app_id=KPI_APP_ID,
                app_name=KPI_APP_NAME,
                icon=KPI_ICON,
                url=KPI_URL,
                status="error",
                ts=now.isoformat(timespec="seconds"),
                hero=KpiHero(value="–", unit="", label="Keine Daten"),
            )

        # Neueste Messung als Hero
        users.sort(key=lambda u: u.get("timestamp", ""), reverse=True)
        latest = users[0]
        other = users[1] if len(users) > 1 else None

        weight = latest.get("weight", 0)
        user_name = latest.get("user", "")
        bmi = latest.get("bmi", 0)
        fat = latest.get("fat", 0)

        label_parts = []
        if other:
            label_parts.append(f"{other['user']} {other.get('weight', 0)} kg")
        label_parts.append(f"BMI {bmi}")
        label_parts.append(f"Fett {fat} %")
        label = " · ".join(label_parts)

        ts_str = latest.get("timestamp", "")
        detail = f"{user_name} · {ts_str[:10]}" if ts_str else user_name

        indicator = KpiIndicator(
            type="gauge",
            min=15,
            max=35,
            value=bmi,
            zones=[
                {"from": 15, "to": 18.5, "color": "#3b82f6", "label": "Untergewicht"},
                {"from": 18.5, "to": 25, "color": "#22c55e", "label": "Normal"},
                {"from": 25, "to": 30, "color": "#f59e0b", "label": "Übergewicht"},
                {"from": 30, "to": 35, "color": "#ef4444", "label": "Adipositas"},
            ],
        )

        metrics_list = [
            KpiMetric(label="BMI", value=round(bmi, 1)),
            KpiMetric(label="Fett", value=round(fat, 1), unit="%"),
        ]
        if other:
            metrics_list.append(KpiMetric(label=other["user"], value=round(other["weight"], 1), unit="kg"))

        return KpiResponse(
            app_id=KPI_APP_ID,
            app_name=KPI_APP_NAME,
            icon=KPI_ICON,
            url=KPI_URL,
            status="ok",
            ts=now.isoformat(timespec="seconds"),
            hero=KpiHero(
                value=round(weight, 1),
                unit="kg",
                label=label,
            ),
            detail=detail,
            indicator=indicator,
            metrics=metrics_list,
        )
