# -*- coding: utf-8 -*-
"""Dashboard API Routes – schlank, delegiert an DashboardService."""

import logging
import os
import struct
import zlib
from pathlib import Path

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import FileResponse, JSONResponse, Response

from app.core.config import cfg
from app.services.db_manager import DBManager
from app.services.dashboard_service import DashboardService

log = logging.getLogger(__name__)

router = APIRouter()

_svc: DashboardService | None = None
_IMAGES_DIR = str(Path(cfg.config_dir).parent / "frontend")


def init_dashboard(db: DBManager):
    global _svc
    _svc = DashboardService(db)


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
    if not _svc:
        raise HTTPException(status_code=500, detail="DB not available")

    user = user.lower()
    is_v2 = "datav2" in request.url.path

    try:
        if before:
            data = _svc.query_before(user, before, int(limit) if limit else 30)
            return {"user": user, "count": len(data), "data": data}

        current, previous, json_data = _svc.load_dashboard_data(user, date_from, date_to)

        result = {
            "system": _svc.get_system_meta(history_len=len(previous)),
            "user": _svc.get_user_meta(user, json_data),
            "current": current,
            "previous": previous,
            "count": len(current),
        }
        if is_v2:
            result["all_users"] = _svc.query_all_users()
        else:
            result["data"] = current

        return JSONResponse(content=result)

    except Exception:
        log.exception("Fehler beim Laden der Dashboard-Daten")
        raise HTTPException(status_code=500, detail="DB error")


@router.get("/dashboard/api/users")
async def dashboard_users():
    if not _svc:
        raise HTTPException(status_code=500, detail="DB not available")
    from app.models.user_service import UserService
    db_users = _svc.query_all_users()
    return UserService().enrich_database_users(db_users)


@router.get("/dashboard/api/export")
async def dashboard_export(
    user: str = "peter",
    date_from: str = Query("", alias="from"),
    date_to: str = Query("", alias="to"),
):
    if not _svc:
        raise HTTPException(status_code=500, detail="DB not available")
    try:
        content, filename = _svc._db.generate_csv_export(user, date_from, date_to)
        return Response(
            content=content,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception:
        log.exception("CSV-Export fehlgeschlagen")
        raise HTTPException(status_code=500, detail="export error")


@router.get("/dashboard/avatar/{name}")
async def dashboard_avatar(name: str):
    for ext in ("png", "jpg", "jpeg", "webp"):
        path = os.path.join(_IMAGES_DIR, f"{name.lower()}.{ext}")
        if os.path.isfile(path):
            return FileResponse(path)
    # 1x1 transparentes PNG als Fallback
    sig = b"\x89PNG\r\n\x1a\n"
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xFFFFFFFF)
    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 6, 0, 0, 0)
    idat = zlib.compress(b"\x00\x00\x00\x00\x00")
    png = sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")
    return Response(content=png, media_type="image/png")
