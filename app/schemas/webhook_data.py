# -*- coding: utf-8 -*-
"""Webhook-Schemas für hc_scale – Gewicht als Hauptwert, Rest als Attribute."""

from pydantic import BaseModel
from typing import Optional


class UserKPI(BaseModel):
    """KPI pro User – Gewicht + Körperdaten."""
    name: str = ""
    weight: float = 0.0
    bmi: float = 0.0
    fat: float = 0.0
    muscle: float = 0.0
    water: float = 0.0
    visceral: float = 0.0
    protein: float = 0.0
    last_date: str = ""


class HeartbeatKPI(BaseModel):
    """KPI-Daten im Heartbeat (alle 60s) – letzte Messungen beider User."""
    peter: UserKPI = UserKPI()
    reni: UserKPI = UserKPI()
