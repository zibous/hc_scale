# -*- coding: utf-8 -*-
"""HTML-Seiten Rendering – liefert Frontend-Templates aus."""

from pathlib import Path

from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.core.config import cfg

router = APIRouter()

FRONTEND_DIR = Path(cfg.config_dir).parent / "frontend"
templates = Jinja2Templates(directory=str(FRONTEND_DIR))

# Gültige Templates einmalig beim Import ermitteln
ALLOWED_PAGES = {f.stem for f in FRONTEND_DIR.glob("*.html")}


@router.get("/", response_class=HTMLResponse)
@router.get("/{name}", response_class=HTMLResponse)
async def render_page(request: Request, name: str = None):
    """Rendert eine HTML-Seite aus dem Frontend-Verzeichnis."""
    target_name = name or "index"
    clean_name = target_name.replace(".html", "")

    if clean_name not in ALLOWED_PAGES:
        raise HTTPException(status_code=404, detail="Page not found")

    return templates.TemplateResponse(
        f"{clean_name}.html",
        {
            "request": request,
            "app_title": cfg.app_title,
            "base_url": "",
        },
    )
