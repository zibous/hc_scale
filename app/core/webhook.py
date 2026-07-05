# -*- coding: utf-8 -*-
"""Generischer Webhook-Publisher (Standard v2) für hc_scale."""

import logging
import threading
import time
from datetime import date, datetime
from typing import Any, Callable, Dict, Optional

import requests
import yaml
from pathlib import Path
from pydantic import BaseModel

from app.core.config import cfg

log = logging.getLogger(__name__)

APP_ID = "hc_scale"


class Webhook:
    def __init__(self, base_url: str, webhook_id: str, timeout: int = 5):
        self.base_url = base_url.rstrip("/")
        self.webhook_id = webhook_id
        self.timeout = timeout

    @property
    def url(self) -> str:
        return f"{self.base_url}/api/webhook/{self.webhook_id}"

    def send(self, data: Optional[Dict[str, Any]] = None) -> bool:
        try:
            response = requests.post(self.url, json=data or {}, timeout=self.timeout)
            response.raise_for_status()
            return True
        except requests.RequestException as e:
            log.debug("Webhook send failed: %s", e)
            return False


class WebhookPublisher:
    """Generischer Publisher. Callback liefert Pydantic-Schema."""

    def __init__(self, build_heartbeat: Callable[[], BaseModel]):
        self._webhook: Optional[Webhook] = None
        self._timer: Optional[threading.Timer] = None
        self._running = False
        self._start_time = time.time()
        self._interval = 60

        self._build_heartbeat = build_heartbeat

    def start(self):
        if not cfg.webhook.url or not cfg.webhook.id:
            log.info("Webhook deaktiviert (URL/ID nicht gesetzt)")
            return

        self._webhook = Webhook(cfg.webhook.url, cfg.webhook.id, cfg.webhook.timeout)
        self._running = True
        log.info("Webhook Publisher gestartet: %s (Intervall: %ds)", self._webhook.url, self._interval)

        self._send_heartbeat()
        self._schedule_next()

    def stop(self):
        self._running = False
        if self._timer:
            self._timer.cancel()
            self._timer = None

    def _schedule_next(self):
        if not self._running:
            return
        self._timer = threading.Timer(self._interval, self._tick)
        self._timer.daemon = True
        self._timer.start()

    def _tick(self):
        if not self._running:
            return
        self._send_heartbeat()
        self._schedule_next()

    def _send_heartbeat(self):
        if not self._webhook:
            return
        try:
            schema = self._build_heartbeat()
            payload = {
                "event": "heartbeat",
                "app_id": APP_ID,
                "version": cfg.app_version,
                "ts": datetime.now().isoformat(timespec="seconds"),
                "uptime_s": int(time.time() - self._start_time),
                "status": "ok",
                "kpi": schema.model_dump(),
            }
            self._webhook.send(payload)
        except Exception as e:
            log.debug("Heartbeat fehlgeschlagen: %s", e)


# ══════════════════════════════════════════════════════════════════════
# notify_ha() – für einzelne Events (measurement, unknown_user)
# ══════════════════════════════════════════════════════════════════════

_webhook: Optional[Webhook] = None


def _get_webhook() -> Optional[Webhook]:
    global _webhook
    if _webhook is not None:
        return _webhook
    if cfg.webhook.url and cfg.webhook.id:
        _webhook = Webhook(cfg.webhook.url, cfg.webhook.id, cfg.webhook.timeout)
        return _webhook
    return None


def notify_ha(event: str, **kwargs) -> bool:
    """Sendet ein einzelnes Event an Home Assistant."""
    wh = _get_webhook()
    if not wh:
        return False
    try:
        payload: Dict[str, Any] = {
            "event": event,
            "app_id": APP_ID,
            "version": cfg.app_version,
            "ts": datetime.now().isoformat(timespec="seconds"),
        }
        payload.update(kwargs)
        ok = wh.send(payload)
        if ok:
            log.debug("Webhook sent: %s", event)
        return ok
    except Exception as e:
        log.debug("Webhook error: %s", e)
        return False
