# home-miscale (hc_scale)

Körperwaage Dashboard. ESP32 (ESPHome) sendet Waage-Daten per HTTP POST,
berechnet Body Metrics (BMI, Fett, Muskeln, Wasser, etc.), speichert in SQLite
und publiziert via MQTT an Home Assistant.

## Features

- FastAPI REST API + Dashboard (Chart.js)
- Body Metrics Berechnung (Mi Body Composition Scale 2)
- Body Score (reverse-engineered aus Mi Fit)
- Athleten-Korrekturfaktoren (lineare Regression)
- SQLite Datenbank (Tagesmessungen) + CSV-Backup
- MQTT Integration (HA Discovery, Heartbeat)
- User-Erkennung (Name oder Gewicht-Match)
- Debounce (30s) für mehrere Messungen
- HA Webhook Notifications
- Dark/Light Theme mit Colorpicker

## Quick Start

```bash
source ../.venv/bin/activate
make install
make dev
```

## GIT - Erstelle ein neues Repository von der Kommandozeile aus
```bash
  git init -b main
  git add .
  git commit -m "first commit"
  git remote add origin http://10.1.1.119:3043/peter/hc_scale.git
  git push -u origin main
```

## Bestehendes Repository via Kommandozeile pushen
```bash
  git remote add origin http://10.1.1.119:3043/peter/hc_scale.git
  git push -u origin main
```


Dashboard: http://10.1.1.119:5056/

## API Endpoints

| Endpoint | Beschreibung |
|----------|-------------|
| `GET /` | Dashboard (HTML) |
| `GET /api/health` | Health Check |
| `GET /api/appstatus` | Status für Übersichtsdashboard |
| `POST /miscale` | ESP32 Waage-Daten empfangen |
| `GET /dashboard/api/users` | Verfügbare User |
| `GET /dashboard/api/data?user=Peter&from=&to=` | Messdaten |
| `GET /dashboard/api/export?user=Peter` | CSV Export |
| `GET /dashboard/avatar/{name}` | Avatar-Bild |

## ESP32 POST Format

```json
{
  "name": "Peter",
  "weight": 69.5,
  "impedance": 580,
  "timestamp": "2026-05-06T16:05:07"
}
```

## Projektstruktur

```
hc_scale/
├── app/
│   ├── main.py                    # FastAPI Entry Point
│   ├── core/
│   │   ├── config.py              # Dataclass-Config aus .env
│   │   ├── logging.py             # Logger
│   │   ├── mqtt.py                # MQTT Client mit Retry
│   │   ├── webhook.py             # HA Webhook
│   │   ├── shutdown.py            # Graceful Shutdown
│   │   └── heartbeat.py           # Periodischer MQTT Status
│   ├── api/routes/
│   │   ├── health.py              # /api/health
│   │   ├── appstatus.py           # /api/appstatus
│   │   ├── miscale.py             # POST /miscale
│   │   └── dashboard.py           # Dashboard API
│   ├── models/
│   │   ├── person.py              # UserProfile Dataclass
│   │   └── user_service.py        # User-Lookup aus persons.yaml
│   └── services/
│       ├── body_metrics.py        # Body Metrics Berechnung
│       ├── body_scales.py         # Referenzskalen
│       ├── body_score.py          # Body Score
│       ├── calcdata.py            # Hauptberechnung + Scores
│       ├── db_manager.py          # SQLite + CSV-Backup
│       └── ha_discovery.py        # HA MQTT Discovery
├── config/persons.yaml            # User-Profile (Gewicht, Größe, Ziele)
├── data/                          # DB + Referenz-JSONs + History
├── frontend/index.html            # Dashboard UI
├── scripts/simulate_post.py       # Test-Script
├── .env
├── Dockerfile
├── docker-compose.yml
├── Makefile
└── requirements.txt
```

## Konfiguration (.env)

```env
PORT=5056
MQTT_HOST=10.1.1.119
MQTT_TOPIC=bodyscale/data
DB_PATH=data/miscaledata.db
HA_WEBHOOK_URL=http://10.1.1.217:8123
HA_WEBHOOK_ID=miscale
```

## Makefile

```bash
make dev          # Lokal mit auto-reload (Port 5056)
make run          # Lokal ohne reload
make build        # Docker Image
make up           # Docker starten (extern Port 5000)
make down         # Docker stoppen
make backup       # DB Backup
make data-add     # Messung simulieren
make data-remove  # Letzten Eintrag entfernen
make clean        # Cache aufräumen
```

## Testen

```bash
# Messung simulieren
make data-add USER=Peter WEIGHT=69.5 IMPEDANCE=580

# Letzten Eintrag entfernen
make data-remove USER=Peter
```

## Docker

```bash
make build    # Image bauen
make up       # Container starten (Port 5000 extern → 5056 intern)
make logs     # Logs anzeigen
make rebuild  # Rebuild ohne Cache
```

## Nginx Reverse Proxy

```nginx
location /dashboardmiscale/ {
    proxy_pass http://10.1.1.119:5000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Prefix /dashboardmiscale;
}
```

## Migration von v1

Migriert aus `apps_v1/hc_scale` (Flask → FastAPI). Keine Logik-Änderungen.
Body Metrics Berechnung 1:1 übernommen.
