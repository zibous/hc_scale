# -*- coding: utf-8 -*-
"""Webhook KPI Builder für hc_scale."""

import json
import logging
from pathlib import Path

from app.core.config import cfg
from app.schemas.webhook_data import HeartbeatKPI, UserKPI

logger = logging.getLogger(__name__)


def _load_user_json(name: str) -> dict:
    """Lädt letzte Messung aus der JSON-Datei."""
    path = Path(cfg.data_dir) / f"miscale-{name}.json"
    try:
        if path.is_file():
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
    except Exception:
        pass
    return {}


def _build_user_kpi(name: str) -> UserKPI:
    """Baut UserKPI aus JSON-Daten."""
    data = _load_user_json(name)
    if not data:
        return UserKPI(name=name)
    return UserKPI(
        name=name,
        weight=round(data.get("weight", 0), 1),
        bmi=round(data.get("bmi", 0), 1),
        fat=round(data.get("fat", 0), 1),
        muscle=round(data.get("muscle", 0), 1),
        water=round(data.get("water", 0), 1),
        visceral=round(data.get("visceral", 0), 1),
        protein=round(data.get("protein", 0), 1),
        last_date=data.get("timestamp", "")[:10],
    )


def build_heartbeat() -> HeartbeatKPI:
    """Baut HeartbeatKPI mit Daten beider User."""
    return HeartbeatKPI(
        peter=_build_user_kpi("Peter"),
        reni=_build_user_kpi("Reni"),
    )
