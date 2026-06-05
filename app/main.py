# -*- coding: utf-8 -*-
"""
home-miscale – FastAPI Application
====================================
ESP32 (ESPHome) → HTTP POST → FastAPI → Berechnung → SQLite + MQTT → Home Assistant
"""

import atexit
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app.api.middleware import setup_middleware
from app.api.routes.appstatus import init_appstatus
from app.api.routes.appstatus import router as appstatus_router
from app.api.routes.dashboard import init_dashboard
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.miscale import init_services
from app.api.routes.miscale import router as miscale_router
from app.api.routes.health import router as health_router
from app.api.routes.kpi import router as kpi_router
from app.api.routes.pages import router as pages_router

from app.core.config import cfg
from app.core.heartbeat import Heartbeat
from app.core.logging import setup_logger
from app.core.mqtt import MqttClient
from app.core.mqtt_startup import run_mqtt_startup
from app.core.shutdown import ShutdownManager

from app.models.user_service import UserService
from app.services.db_manager import DBManager

log = setup_logger("main")


# -----------------------------------------------------------------
# Services (Singletons für die gesamte App-Lebensdauer)
# -----------------------------------------------------------------
user_service = UserService()
db = DBManager()
mqtt_client = MqttClient()
shutdown_mgr = ShutdownManager(log)


# -----------------------------------------------------------------
# Uvicorn Log-Filter: Health-Checks nicht loggen
# -----------------------------------------------------------------
class _HealthFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        msg = record.getMessage()
        return "/api/health" not in msg and "Invalid HTTP request" not in msg


logging.getLogger("uvicorn.access").addFilter(_HealthFilter())
logging.getLogger("uvicorn.error").addFilter(_HealthFilter())


# -----------------------------------------------------------------
# Cleanup bei unerwartetem Beenden (atexit)
# -----------------------------------------------------------------
def _cleanup():
    if shutdown_mgr.is_set():
        return
    log.info("Cleanup gestartet")
    shutdown_mgr._event.set()
    for cb in shutdown_mgr._callbacks:
        try:
            cb()
        except Exception:
            pass


atexit.register(_cleanup)


# -----------------------------------------------------------------
# Lifespan: Startup & Shutdown
# -----------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup und Shutdown."""
    log.info("%s v%s starting on port %d", cfg.app_name, cfg.app_version, cfg.port)

    # Services in Routes injizieren
    init_services(user_service, db, mqtt_client)
    init_appstatus(mqtt_client)
    init_dashboard(db)

    # MQTT: Heartbeat + HA Discovery
    if mqtt_client.ready:
        heartbeat = Heartbeat(mqtt_client, cfg.mqtt.heartbeat, log, shutdown_mgr, cfg.mqtt.keepalive)
        heartbeat.start()
        shutdown_mgr.register(heartbeat.stop)
        log.info("Heartbeat gestartet → %s", cfg.mqtt.heartbeat)

        run_mqtt_startup(mqtt_client, user_service)
    else:
        log.warning("MQTT nicht verfügbar – Heartbeat und HA Discovery deaktiviert")

    log.info("App initialisiert")
    yield
    log.info("%s shutting down", cfg.app_name)
    shutdown_mgr.initiate()


# -----------------------------------------------------------------
# FastAPI App
# -----------------------------------------------------------------
app = FastAPI(
    title=cfg.app_name,
    version=cfg.app_version,
    lifespan=lifespan,
)

# CORS-Infrastruktur für API-Zugriffe erlauben
# Performance-Optimierung: No-Cache über nativen FastAPI-Middleware-Hook
setup_middleware(app)

# Statische Dateien
# Alle bei html ohne führenden slash / 
FRONTEND_DIR = Path(cfg.config_dir).parent / "frontend"
app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR / "static")), name="static")

# API-Router
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(appstatus_router, prefix="/api", tags=["status"])
app.include_router(miscale_router, prefix="", tags=["miscale"])
app.include_router(dashboard_router, prefix="", tags=["dashboard"])
app.include_router(kpi_router, prefix="/api", tags=["kpi"])

# HTML-Seiten (Catch-all, darum zuletzt)
app.include_router(pages_router, tags=["pages"])


# -----------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    ## IP UND PORT aus .env, wird aber über uvicorn command überschrieben
    uvicorn.run("app.main:app", host=cfg.host, port=cfg.port, reload=True)
