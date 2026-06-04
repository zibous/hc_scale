# Makefile for hc_scale (home-miscale)

SHELL := /bin/bash
.DEFAULT_GOAL := help
.PHONY: build up down restart rebuild logs ps run dev install clean backup help
VERSION := $(shell git describe --tags --always)

# ---------------------------------------------------------
# Python interpreter (venv preferred, fallback python3)
# ---------------------------------------------------------
CONTAINER := $(shell basename $(CURDIR))
PYTHON := $(shell if [ -f /dockerapps/apps_v2/.venv/bin/python ]; then echo /dockerapps/apps_v2/.venv/bin/python; else echo python3; fi)

# ---------------------------------------------------------
# Lokales Ausfuehren 5000
# ---------------------------------------------------------
run: ## Startet lokal mit uvicorn
	@echo "Starte Lokale Anwendung mit Server: http://10.1.1.119:4056"
	@PYTHONPATH=$(CURDIR) $(PYTHON) -m uvicorn app.main:app --host 0.0.0.0 --port 4056

dev: ## Startet lokal mit auto-reload
	@echo "Starte Entwicklung Anwendung mit Server: http://10.1.1.119:4056"
	@PYTHONPATH=$(CURDIR) $(PYTHON) -m uvicorn app.main:app --host 0.0.0.0 --port 4056 --reload

dev1: ## Startet lokal mit auto-reload
	@echo "Starte Server (Port wie Dockeranwendung): http://10.1.1.119:5000"
	@PYTHONPATH=$(CURDIR) $(PYTHON) -m uvicorn app.main:app --host 0.0.0.0 --port 5000 --reload

# ---------------------------------------------------------
# Docker
# ---------------------------------------------------------
build: ## Build Docker image
	@echo "Baue Docker image"
	# docker build -t hc_scale:$(VERSION) -t hc_scale:latest .
	docker compose build

up: ## Start containers ohne neubauen des images
	@echo "Start containers ohne neubauen des images"
	docker compose up -d

down: ## Stop containers
	@echo "Stop containers"
	docker compose down

restart: ## Restart containers
	docker compose restart

rebuild: ## Rebuild and restart (no cache)
	docker compose down
	docker compose build --no-cache
	docker compose up -d --force-recreate

logs: ## Show logs (follow)
	docker compose logs -f

logs-tail: ## Last 100 log lines
	docker compose logs --tail=100

ps: ## Running containers
	docker compose ps

stop: ## Stop containers
	docker compose stop

start: ## Start stopped containers
	docker compose start

shell: ## Shell into container
	docker compose exec $(CONTAINER) /bin/bash

health: ## Check health endpoint
	@curl -sf http://localhost:5045/api/satus | python3 -m json.tool || echo "UNHEALTHY"

# ---------------------------------------------------------
# Maintenance
# ---------------------------------------------------------
install: ## Install dependencies
	@pip install -r requirements.txt

compare: ## make --silent compare 2>/dev/null
	@mkdir -p /tmp/hc_scale_files
	@docker cp hc_scale:/app/. /tmp/hc_scale_files/
	@diff -qr --exclude="__pycache__" --exclude="*.pyc" --exclude="data" ./ /tmp/hc_scale_files/ | grep -v "Nur in \./" || true
	@rm -rf /tmp/hc_scale_files

backup: ## Backup database
	@cp data/miscaledata.db data/miscaledata.db.bak.$$(date +%Y%m%d) 2>/dev/null && \
		echo "✅ Backup: data/miscaledata.db.bak.$$(date +%Y%m%d)" || \
		echo "❌ Keine DB gefunden"

data-add: ## Simuliert eine Messung: make data-add USER=Peter WEIGHT=69.5
	@PYTHONPATH=$(CURDIR) $(PYTHON) scripts/simulate_post.py --user $(or $(USER),Peter) --weight $(or $(WEIGHT),69.5) --impedance $(or $(IMPEDANCE),580)

data-remove: ## Entfernt letzten Eintrag: make data-remove USER=Peter
	@PYTHONPATH=$(CURDIR) $(PYTHON) scripts/simulate_post.py --remove --user $(or $(USER),Peter)

graph:
	pyreverse app -o png

git-update: ## Git Forgejo Update durchführen
	git remote set-url origin http://10.1.1.119:3043/peter/hc_scale.git
	git add -A
	git commit -m "Update am $$(date +'%Y-%m-%d %H:%M')" || true
	git push -u origin main

.PHONY: build clean


# 🔧 Komprimiert JS und CSS parallel über Docker – maximal optimiert
jsbuild:
	@echo "📦 Starte JS & CSS Bundling via Docker & esbuild..."
	@docker run --rm -v "$$(pwd)":/app -w /app node:20-alpine sh -c "\
		npx esbuild frontend/static/js/v3/app.js --bundle --minify --sourcemap --target=es2020 --outfile=frontend/static/js/v3/app.bundle.js && \
		npx esbuild frontend/static/css/style2.css --minify --sourcemap --outfile=frontend/static/css/style2.bundle.css"
	@echo "✅ Fertig! JS und CSS Bundles wurden erfolgreich im static-Ordner erstellt."

jsclean:
	@echo "🧼 Bereinige produktive Build-Dateien..."
	@rm -f frontend/static/js/v3/app.bundle.js
	@rm -f frontend/static/js/v3/app.bundle.js.map
	@rm -f frontend/static/css/style.bundle.css
	@rm -f frontend/static/css/style.bundle.css.map
	@echo "✨ Verzeichnis ist wieder sauber."


# ---------------------------------------------------------
# Help
# ---------------------------------------------------------
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
