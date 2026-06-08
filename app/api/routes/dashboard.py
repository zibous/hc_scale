# -*- coding: utf-8 -*-
"""Dashboard API Routes – Gewichtsverlauf und Körperdaten."""

import csv
import logging
import os
import sqlite3
import json
from pathlib import Path
from io import StringIO
from datetime import datetime, timedelta

from fastapi import APIRouter, Query, Request
from fastapi.responses import FileResponse, JSONResponse, Response

from app.core.config import cfg
from app.models.user_service import UserService
from app.services.db_manager import DBManager

log = logging.getLogger(__name__)

router = APIRouter()

_db: DBManager | None = None
_IMAGES_DIR = str(Path(cfg.config_dir).parent / "frontend")


def init_dashboard(db: DBManager):
    global _db
    _db = db


def _deduplicate_rows(rows):
    """Hilfsfunktion zur Deduplizierung von Messwerten pro Kalendertag."""
    seen = {}
    for r in [dict(r) for r in rows]:
        d = r["date"]
        if d not in seen or r["timestamp"] > seen[d]["timestamp"]:
            seen[d] = r
    return sorted(seen.values(), key=lambda x: x["date"])


@router.get("/dashboard/api/data")
@router.get("/dashboard/api/datav2")
async def dashboard_data(
    request: Request,
    user: str = "peter",
    date_from: str = Query("", alias="from"),
    date_to: str = Query("", alias="to"),
    before: str = "",
    limit: str = "",
):
    if not _db:
        return JSONResponse({"error": "DB not available"}, status_code=500)

    user = user.lower()
    is_v2_request = "datav2" in request.url.path

    try:
        conn = sqlite3.connect(_db.db_path)
        conn.row_factory = sqlite3.Row

        # --- 1. ECHTER V1-MODUS (Historische Abfrage über before) ---
        if before:
            n = int(limit) if limit else 30
            rows = conn.execute(
                "SELECT * FROM daily_miscale WHERE LOWER(name)=? AND date<? ORDER BY date DESC LIMIT ?",
                (user, before, n),
            ).fetchall()
            conn.close()
            deduped = _deduplicate_rows(reversed(rows))
            return {"user": user, "count": len(deduped), "data": deduped}

        # --- 2. SQLITE TIMELINE ABFRAGEN ---
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

        current_list = [dict(r) for r in rows]

        # Historische Vergleichsdaten generieren
        prev_rows = []
        if date_from:
            prev_rows = conn.execute(
                "SELECT * FROM daily_miscale WHERE LOWER(name)=? AND date<? ORDER BY date DESC LIMIT 60",
                (user, date_from),
            ).fetchall()
        previous_list = [dict(r) for r in prev_rows]

        # Dropdown-Userliste abfragen
        all_user_names = []
        if is_v2_request:
            user_rows = conn.execute("SELECT name, COUNT(*) as count FROM daily_miscale GROUP BY name").fetchall()
            all_user_names = [{"name": r["name"], "count": r["count"]} for r in user_rows]

        conn.close()

        # --- 3. 🔧 FUSIONIERUNG: TYP-SICHERE PATCH-LOGIK ---
        json_path = Path(cfg.data_dir) / f"miscale-{user}.json"
        if not json_path.exists():
            json_path = Path(cfg.data_dir) / f"miscale-{user.capitalize()}.json"

        json_data = {}
        if json_path.exists():
            try:
                with open(json_path, "r", encoding="utf-8") as f:
                    json_data = json.load(f)
            except Exception:
                log.warning(f"Konnte JSON-Datei {json_path} nicht lesen")

        def patch_with_json(item, is_latest=False):
            if not item: return item
            item = dict(item) # Erzwinge veränderbares Wörterbuch

            # Fallbacks für Metriken aus JSON oder Standard-Werten
            item["metabolic_age"] = item.get("metabolic_age") if item.get("metabolic_age") is not None else json_data.get("metabolic_age")
            item["bodytype"] = item.get("bodytype") or json_data.get("bodytype", "Ausgeglichen")

            # Typ-Sichere Castings für numerische Berechnungen im Frontend
            for field, default in [("targetweight", 70.0), ("ffmi", 0.0), ("bone", 0.0), ("bmr", 1148.0), ("tdee", 2411.0)]:
                try:
                    item[field] = float(item.get(field) or json_data.get(field, default))
                except (ValueError, TypeError):
                    item[field] = default

            # Nur das allerneueste Element überschreiben mit echten Live-JSON-Werten
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

        # Veredelung auf die Listen anwenden
        if current_list:
            current_list[-1] = patch_with_json(current_list[-1], is_latest=True)
            for i in range(len(current_list) - 1):
                current_list[i] = patch_with_json(current_list[i], is_latest=False)
        else:
            if json_data:
                ts_val = json_data.get("timestamp", datetime.now().isoformat())
                virtual_today = patch_with_json({
                    "id": 9999, "name": user.capitalize(), "timestamp": ts_val, "date": ts_val[:10],
                    "weight": json_data.get("weight", 0.0), "impedance": json_data.get("impedance", 0),
                    "fat": json_data.get("fat", 0.0), "visceral": json_data.get("visceral", 0.0),
                    "water": json_data.get("water", 0.0), "muscle": json_data.get("muscle", 0.0),
                    "bmi": json_data.get("bmi", 0.0), "protein": json_data.get("protein", 0.0),
                    "lbm": json_data.get("lbm", 0.0), "poi": json_data.get("poi", 0.0)
                }, is_latest=True)
                current_list.append(virtual_today)

        if previous_list:
            for i in range(len(previous_list)):
                previous_list[i] = patch_with_json(previous_list[i], is_latest=False)

        current_deduped = _deduplicate_rows(current_list)
        previous_deduped = _deduplicate_rows(previous_list)

        # --- 4. BENUTZER-METADATEN ---
        user_meta = {"name": user, "sex": "male", "target": 70.0, "avatar": f"dashboard/avatar/{user}"}
        try:
            us = UserService()
            u_info = us.find_by_name(user)
            if u_info:
                user_meta["target"] = u_info.scores.get("WEIGHT", 70.0)
                user_meta["sex"] = u_info.sex
                user_meta["scores"] = {
                    **u_info.scores,
                    "BMR": json_data.get("tdee", u_info.scores.get("BMR", 2200))
                }
        except Exception:
            pass

        # --- 5. SYSTEM INFO ---
        system_meta = {
            "servertime": datetime.now().strftime("%Y-%m-%d um %H:%M Uhr"),
            "apptitle": cfg.app_title, "appversion": cfg.app_version, "language": cfg.language,
            "scale_type": "XMTZC05HM", "scale_name": "MI Body Composition Scale 2",
            "scale_manu": "Xiaomi", "scale_image": os.path.join(_IMAGES_DIR, "miscale.png")
        }

        # --- 6. DYNAMISCHER RETURN ---
        return_data = {
            "system": system_meta, "user": user_meta, "current": current_deduped,
            "previous": previous_deduped, "count": len(current_deduped)
        }
        if is_v2_request:
            return_data["all_users"] = all_user_names
        else:
            return_data["data"] = current_deduped
        return return_data

    except Exception:
        log.exception("Fehler beim Laden der kombinierten Dashboard-Daten")
        return JSONResponse({"error": "DB error"}, status_code=500)


@router.get("/dashboard/api/users")
async def dashboard_users():
    if not _db:
        return JSONResponse({"error": "DB not available"}, status_code=500)
    try:
        conn = sqlite3.connect(_db.db_path)
        conn.row_factory = sqlite3.Row
        rows = conn.execute("""
            SELECT id, name, COUNT(*) as count, MIN(date) as first, MAX(date) as last
            FROM daily_miscale GROUP BY name ORDER BY id
        """).fetchall()
        conn.close()
        result = [dict(r) for r in rows]

        try:
            us = UserService()
            for r in result:
                user = us.find_by_name(r["name"])
                if user:
                    r["target_weight"] = user.scores.get("WEIGHT", 0)
                    r["weight_threshold"] = user.weight_threshold
                    r["sex"] = user.sex
                r["avatar"] = f"dashboard/avatar/{r['name'].lower()}"
        except Exception:
            pass

        return result
    except Exception:
        log.exception("Fehler beim Laden der User-Liste")
        return []


@router.get("/dashboard/api/export")
async def dashboard_export(
    user: str = "peter",
    date_from: str = Query("", alias="from"),
    date_to: str = Query("", alias="to"),
):
    if not _db:
        return JSONResponse({"error": "DB not available"}, status_code=500)

    user = user.lower()
    try:
        conn = sqlite3.connect(_db.db_path)
        conn.row_factory = sqlite3.Row

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
                "SELECT * FROM daily_miscale WHERE LOWER(name)=? ORDER BY date",
                (user,),
            ).fetchall()
        conn.close()

        fields = [
            "id",
            "name",
            "timestamp",
            "date",
            "weight",
            "impedance",
            "fat",
            "visceral",
            "water",
            "muscle",
            "bmi",
            "protein",
            "lbm",
            "poi",
        ]

        buf = StringIO()
        writer = csv.DictWriter(buf, fieldnames=fields, delimiter=";", extrasaction="ignore")
        writer.writeheader()
        for r in rows:
            writer.writerow(dict(r))

        filename = f"miscale-{user}.csv"
        if date_from:
            filename = f"miscale-{user}-{date_from}.csv"

        return Response(
            content=buf.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception:
        log.exception("CSV-Export fehlgeschlagen")
        return JSONResponse({"error": "export error"}, status_code=500)


@router.get("/dashboard/avatar/{name}")
async def dashboard_avatar(name: str):
    for ext in ("png", "jpg", "jpeg", "webp"):
        path = os.path.join(_IMAGES_DIR, f"{name.lower()}.{ext}")
        if os.path.isfile(path):
            return FileResponse(path)
    import struct
    import zlib
    sig = b"\x89PNG\r\n\x1a\n"
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 6, 0, 0, 0)
    idat = zlib.compress(b"\x00\x00\x00\x00\x00")
    png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
    return Response(content=png, media_type="image/png")
