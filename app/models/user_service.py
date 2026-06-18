# -*- coding: utf-8 -*-
"""Lädt User-Profile aus persons.yaml."""

import logging
from pathlib import Path

import yaml

from app.core.config import cfg
from app.models.person import UserProfile

log = logging.getLogger(__name__)


class UserService:
    def __init__(self, config_path: str | None = None):
        path = config_path or str(Path(cfg.config_dir) / "persons.yaml")
        with open(path, "r") as f:
            data = yaml.safe_load(f)

        self.users: list[UserProfile] = []
        for u in data.get("users", []):
            if not isinstance(u, dict):
                continue
            self.users.append(UserProfile(**u))

        log.info("Loaded %d user profiles", len(self.users))

    def all_users(self) -> list[UserProfile]:
        return self.users

    def find_by_name(self, name: str) -> UserProfile | None:
        name = name.strip().lower()
        return next((u for u in self.users if u.name.lower() == name), None)

    def find_best_by_weight(self, weight: float) -> UserProfile | None:
        best = None
        best_score = float("inf")
        for u in self.users:
            if u.is_plausible(weight):
                score = u.match_score(weight)
                if score < best_score:
                    best = u
                    best_score = score
        return best

    def enrich_database_users(self, db_users: list[dict]) -> list[dict]:
        """Reichert rohe DB-User-Daten mit Profilen aus der YAML an."""
        # Schnelles Dictionary für O(1) Suche erstellen
        user_map = {u.name.lower().strip(): u for u in self.users}

        for r in db_users:
            # Avatar-Pfad erstellen
            r["avatar"] = f"dashboard/avatar/{r['name'].lower()}"

            # Profildaten aus der YAML zuordnen
            user = user_map.get(r["name"].lower().strip())
            if user:
                scores = getattr(user, "scores", {}) or {}
                r["target_weight"] = scores.get("WEIGHT", 0)
                r["weight_threshold"] = getattr(user, "weight_threshold", None)
                r["sex"] = getattr(user, "sex", None)
            else:
                r["target_weight"] = 0
                r["weight_threshold"] = None
                r["sex"] = None

        return db_users


