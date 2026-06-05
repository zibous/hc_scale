# -*- coding: utf-8 -*-
"""Logging Setup."""

import logging
import os
from logging.handlers import RotatingFileHandler
from pathlib import Path

from app.core.config import cfg


_initialized = False


def setup_logger(name: str) -> logging.Logger:
    global _initialized

    # Beim ersten Aufruf: Root-Logger konfigurieren.
    # Alle Logger im Projekt erben davon (propagate=True default).
    if not _initialized:
        _initialized = True
        _configure_root()

    logger = logging.getLogger(name)
    logger.setLevel(_get_level())
    return logger


def _get_level() -> int:
    key = cfg.log.level.strip().upper()
    level_map = {"PRODUCTION": logging.WARNING, "VERBOSE": logging.DEBUG}
    return level_map.get(key, getattr(logging, key, logging.INFO))


def _configure_root():
    """Root-Logger einmalig einrichten: Console + optional File."""
    root = logging.getLogger()
    root.setLevel(_get_level())
    root.handlers.clear()

    formatter = logging.Formatter(
        "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Immer Console
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    root.addHandler(console_handler)

    # Bei mode=file zusätzlich in Datei schreiben
    if cfg.log.mode == "file":
        log_path = Path(cfg.log.file)
        log_path.parent.mkdir(parents=True, exist_ok=True)
        file_handler = RotatingFileHandler(
            str(log_path),
            maxBytes=cfg.log.max_bytes,
            backupCount=cfg.log.backup_count,
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        root.addHandler(file_handler)
