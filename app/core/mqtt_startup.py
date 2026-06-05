# -*- coding: utf-8 -*-
"""MQTT Startup: HA Discovery + letzte Messwerte publizieren."""

import json
import logging
import os
import threading

from app.core.config import cfg
from app.core.mqtt import MqttClient
from app.models.user_service import UserService
from app.services.calcdata import CalcData
from app.services.ha_discovery import publish_discovery_all

log = logging.getLogger(__name__)


def run_mqtt_startup(mqtt_client: MqttClient, user_service: UserService) -> None:
    """Startet HA Discovery und publiziert letzte Messwerte (non-blocking Thread)."""

    def _worker():
        try:
            users = user_service.all_users()
            publish_discovery_all(mqtt_client, [u.name for u in users])

            for user in users:
                path = os.path.join(cfg.data_dir, f"miscale-{user.name}.json")
                if not os.path.isfile(path):
                    continue
                with open(path, "r") as f:
                    data = json.load(f)

                topic_data = f"{cfg.mqtt.topic}/{user.name}/data"
                mqtt_client.publish(topic_data, data, retain=True)

                try:
                    calc = CalcData(user, data["weight"], data.get("impedance", 500), data.get("timestamp", ""))
                    calc.calculate()
                    scores = calc.calculate_scores()
                    mqtt_client.publish(f"{cfg.mqtt.topic}/{user.name}/scores", scores, retain=True)
                except Exception:
                    log.exception("Scores-Berechnung fehlgeschlagen für %s", user.name)

            log.info("MQTT Startup abgeschlossen")
        except Exception:
            log.exception("MQTT Startup fehlgeschlagen")

    threading.Thread(target=_worker, daemon=True, name="mqtt-startup").start()
