---
title: "⚖️ Xiaomi Mi Scale im Smart Home – Körperanalyse ohne Cloud"
date: 2026-06-08T22:00:00
description: "Xiaomi Mi Body Composition Scale 2 lokal via ESP32 und FastAPI auswerten – Body Metrics, Score-Berechnung und Langzeit-Tracking ohne Mi Fit App."
type: "post"
draft: false
image: "posts/smarthome-koerperwaage/koerperwaage.png"
author: "Peter Siebler"
snap_gallery: true
gallery: true
categories:
  - "Smarthome"
tags: ["docker", "python", "fastapi", "esphome", "dashboard", "mqtt", "homeassistant"]
---

[![GITHUB: HC_SCALE](https://img.shields.io/badge/Project-GitHub-yellow.svg)](https://github.com/zibous/hc_scale)
[![Support author](https://img.shields.io/badge/buy%20me%20a%20coffee-orange.svg)](https://www.buymeacoff.ee/zibous)
[![License](https://img.shields.io/badge/license-Open%20Source-green.svg)](https://opensource.org)
![Python](https://img.shields.io/badge/Python-3.12-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)

## Die smarte Waage – ohne Cloud, mit voller Kontrolle

Die **Xiaomi Mi Body Composition Scale 2** ist eine der meistverkauften Smart-Waagen. Sie misst Gewicht und Bioimpedanz (BIA) und sendet die Daten per Bluetooth. Normalerweise landen diese in der Mi Fit App – und damit auf Xiaomi-Servern in China. Mit **hc_scale** bleiben die intimsten Körperdaten lokal: Ein ESP32 fängt das BLE-Signal ab und schickt Gewicht + Impedanz per HTTP an eine eigene FastAPI-Anwendung, die daraus über ein Dutzend Körperwerte berechnet.

<!--more-->

## Das Konzept: BLE → ESP32 → HTTP POST → Dashboard

Die Mi Scale 2 sendet bei jeder Messung ein BLE Advertisement mit Gewicht und Impedanz-Rohdaten.
Ein ESP32 mit ESPHome empfängt dieses Signal, erkennt den User und sendet die **Werte per HTTP POST** an die hc_scale-Anwendung:

{{< mermaid >}}
flowchart LR
    Scale["Mi Scale 2<br>(Bathroom)"] -->|"BLE<br>weight + impedance"| ESP["ESP32<br>(ESPHome)"] -->|"HTTP POST<br>/miscale"| API["FastAPI<br>(hc_scale)"]
{{< /mermaid >}}

Der ESP32 steht im selben Raum wie die Waage (Reichweite: ~5m) und ist über WLAN mit dem Netzwerk verbunden.
Neben dem Datentransfer mit HTTP POST ist der ESP32 über API mit Homeassistant verbunden und
zeigt dort die Messdaten in Echtzeit an.

---

## Docker Anwendung vorbereiten

## 1. Das brauchst du (Linux)

Du benötigst **Git**, **Docker** und **Make**.

Installiere: `sudo apt update && sudo apt install git docker.io make -y`

## 2. Projekt holen

Weitere Informationen siehe : [GitHub: zibous/hc_scale](https://github.com/zibous/hc_scale)

Nun kannst Du als nächstes die Datenerfassung mittels ESPHome machen oder einfach die Anwendung mit docker erstellen und diese testen.

## 3. Container bauen
Da im Projekt ein `Makefile` liegt, kannst du dir die langen Docker-Befehle sparen und alle verfügbaren Befehle mit folgenden Befehl anzeigen: &nbsp;&nbsp;`  :❯ make help`

Das Makefile führt im Hintergrund automatisch das passende `  :❯ docker build` für dich aus. Sobald der Prozess durchgelaufen ist, ist dein Image startbereit!


## 🏗️ Architektur & Datenfluss

{{< mermaid >}}
flowchart TD
    Scale["Xiaomi Mi Scale 2 (BLE)"] -->|"BLE Advertisement"| ESP["ESP32 (ESPHome)<br>BLE Scan · User-Erkennung"]
    ESP -->|"POST /miscale"| FastAPI["FastAPI :5056"]
    FastAPI --> Debounce["Debounce (30s)"]
    Debounce --> Calc["CalcData Service<br>(Body Metrics)"]
    Calc --> Score["Body Score<br>(Mi Fit Algorithm)"]
    Calc --> DB["SQLite DB + CSV History"]
    Calc --> MQTT["MQTT Broker<br>bodyscale/"]
    Calc --> HA["HA Webhook"]
{{< /mermaid >}}

---

## 🔌 Hardware-Setup

| Komponente | Details |
|------------|---------|
| **Waage** | Xiaomi Mi Body Composition Scale 2 (XMTZC05HM) |
| **Protokoll** | Bluetooth Low Energy (BLE Advertisement) |
| **Gateway** | ESP32 DevKit (ESPHome, WLAN) |
| **Standort** | Schlafzimmer / Bad |
| **Reichweite** | ~5 Meter (BLE) |

### ESP32 Konfiguration (ESPHome)

Der ESP32 empfängt das BLE-Signal der Waage, filtert nach der bekannten MAC-Adresse und sendet die Daten per HTTP POST:

<details>

  <summary style="cursor: pointer; color: #0969da; text-decoration: underline;"><b>YAML-Code für ESP32-S3 - Xiaomi MI Bodyscale 2</b></summary>

  ```yaml
    ## -------------------------------------------------------------------------------------------
    ## esp32c3 FOR Xiaomi BODYSCALE II VERSION 2024
    ## https://www.espboards.dev/esp32/esp32-s3-super-mini/
    ## -------------------------------------------------------------------------------------------
    substitutions:

      ## device settings
      hostname: "xia-miscale"
      dashbordtitle: "ESP32-S3 - Xiaomi MI Bodyscale 2 (xia-miscale.siebler.home)"
      device_description: "Xiaomi Mi Smart Scale 2 on ESP32 S3"

      friendly_name: "MIScale"
      projectname: "Peter Siebler.MI Smartscale"
      appversion: "3.1.0"
      hardware: "esp32c3"
      location: "Schlafzimmer"

      mac: "5C:CA:D3:4C:EE:74"
      ha_key: "inH49O9jBeK5yTGb1X2g4WV/1aS6YKUpu3Vu277fDgw="

    esp32:
      variant: esp32s3
      board: esp32-s3-devkitc-1
      framework:
        type: esp-idf

    ## APPLICATION ESPHOME
    esphome:
      name: ${hostname}
      friendly_name: ${dashbordtitle}
      build_path: ./build/${hostname}
      comment: ${device_description}
      project:
        name: ${projectname}
        version: ${appversion}
      area: ${location}
      platformio_options: {}
      includes: []
      libraries: []
      name_add_mac_suffix: false
      min_version: 2026.6.2
      on_boot:
        priority: -100.0
        then:
          - wait_until:
              time.has_time:
          - script.execute: updatedata

    logger:
      level: DEBUG

    ## Global variables
    globals:
      # last userid
      - id: lastuserid
        type: int
        restore_value: yes
        initial_value: "0"

      # last value weight sensor testcase
      - id: last_weight
        type: float
        restore_value: yes
        initial_value: "69.70"

      # last value impedance sensor testcase
      - id: last_impedance
        type: int
        restore_value: yes
        initial_value: "546"

      # last value weight sensor peter
      - id: last_weight_peter
        type: float
        restore_value: yes
        initial_value: "69.70"

      # last value impedance sensor peter
      - id: last_impedance_peter
        type: int
        restore_value: yes
        initial_value: "546"

      # last value weight sensor reni
      - id: last_weight_reni
        type: float
        restore_value: yes
        initial_value: "49.60"

      # last value impedance sensor reni
      - id: last_impedance_reni
        type: int
        restore_value: yes
        initial_value: "647"

    wifi:
      networks:
        # BEST Smarthome IOT 2024 2.4 GHz
        - ssid: !secret wifi_ssid
          password: !secret wifi_pswd
          priority: 100

        # LIVINGROOM apple time capsulate 5 Ghz+2.4 Ghz
        - ssid: !secret ssid2_name
          password: !secret ssid2_pswd
          priority: 20

        # DACHBODEN TL-WA1201 2.4 Ghz
        - ssid: !secret ssid9_name
          password: !secret ssid9_pswd
          priority: 10

      domain: !secret domain
      reboot_timeout: 5min
      fast_connect: true
      power_save_mode: NONE
      ap:
        ssid: "${hostname}-Fallback"
        password: !secret wifi_pswd

    captive_portal:

    mdns:
      disabled: false

    ota:
      platform: esphome
      password: !secret ota_pswd

    web_server:
      port: 80
      version: 3
      local: true

    api:
      port: 6053
      reboot_timeout: 0s
      encryption:
        key: ${ha_key}

    http_request:
      timeout: 5s

    ## COMPONENT BLE TRACKER
    esp32_ble_tracker:
      scan_parameters:
        active: true
        interval: 100ms
        window: 80ms

    bluetooth_proxy:
      active: true

    ## SNTP Time server
    time:
      - platform: sntp
        id: time_sntp
        timezone: Europe/Berlin
        servers:
          - !secret local_sntp
          - 0.at.pool.ntp.org
          - 0.pool.ntp.org
        on_time_sync:
          then:
            - if:
                condition:
                  lambda: 'return id(lastboot).state.empty();'
                then:
                  - text_sensor.template.publish:
                      id: lastboot
                      state: !lambda return id(time_sntp).now().strftime("%Y-%m-%dT%H:%M:%S %Z");
                  - text_sensor.template.publish:
                      id: systime
                      state: !lambda return id(time_sntp).now().strftime("%Y-%m-%dT%H:%M:%S %Z");

            - logger.log:
                level: WARN
                tag: "system"
                format: "Synchronized sntp clock"

    ## Script Component
    script:
      - id: updatedata
        then:
          - logger.log:
              level: DEBUG
              tag: "system"
              format: "${hostname} start publish data"
          - text_sensor.template.publish:
              id: lastmeasuredate
              state: !lambda return id(time_sntp).now().strftime("%Y-%m-%dT%H:%M:%S %Z");
          - lambda: |-
              if (id(lastuserid)==1) {
                  id(current_weight).publish_state(id(last_weight_peter));
                  id(current_impedance).publish_state(id(last_impedance_peter));
              } else if (id(lastuserid)==2) {
                  id(current_weight).publish_state(id(last_weight_reni));
                  id(current_impedance).publish_state(id(last_impedance_reni));
              } else {
                  id(current_weight).publish_state(id(last_weight));
                  id(current_impedance).publish_state(id(last_impedance));
              }

    ## COMPONENT button
    button:

      # simple button for restart
      - platform: restart
        name: "Neustart"
        id: restart_device
        disabled_by_default: false
        entity_category: config
        icon: mdi:restart

      # resend data
      - platform: template
        name: "Testdaten senden"
        id: btnpublishdata
        icon: mdi:run
        entity_category: config
        on_press:
          then:
            - script.execute: updatedata

    # BINARY SENSOR
    binary_sensor:
      # connection status mqtt
      - platform: status
        name: "Status"
        id: mibodystatus
        icon: mdi:state-machine
        entity_category: "diagnostic"

      # connection status mi body scale
      - platform: template
        name: "Verbindung"
        id: miscalestat
        icon: mdi:led-outline
        lambda: return (id(blerssi).has_state());
        entity_category: "diagnostic"


    ## SENSOREN
    sensor:
      - platform: xiaomi_miscale
        mac_address: ${mac}
        weight:
          name: "Gewicht"
          id: current_weight
          accuracy_decimals: 2
          unit_of_measurement: "kg"
          state_class: measurement
          device_class: "weight"
          icon: mdi:weight-kilogram
          filters:
            - filter_out: nan

        impedance:
          name: "Impedance"
          id: current_impedance
          accuracy_decimals: 0
          unit_of_measurement: "Ω"
          state_class: measurement
          icon: mdi:omega
          filters:
            - filter_out: nan
          on_value:
            then:
              if:
                condition:
                  lambda: |-
                    return (id(current_weight).has_state() && id(current_weight).state > 40.00) &&
                          (id(current_impedance).has_state() && id(current_impedance).state > 200.0);
                then:
                  - text_sensor.template.publish:
                      id: lastmeasuredate
                      state: !lambda return id(time_sntp).now().strftime("%Y-%m-%dT%H:%M:%S %Z");

                  - lambda: |-
                      std::string user_name = "Gast";
                      float w = id(current_weight).state;
                      float imp = id(current_impedance).state;
                      id(last_weight) = w;
                      id(last_impedance) = imp;
                      if (w >= 65.00 && w <= 80.00) {
                          id(last_weight_peter) = w;
                          id(last_impedance_peter) = imp;
                          id(lastuserid) = 1;
                          user_name = "Peter";
                      } else if (w >= 40.00 && w <= 59.00) {
                          id(last_weight_reni) = w;
                          id(last_impedance_reni) = imp;
                          id(lastuserid) = 2;
                          user_name = "Reni";
                      } else {
                          id(lastuserid) = 0;
                      }
                      id(username).publish_state(user_name);

                  - delay: 500ms

                  - http_request.post:
                      url: !secret fastapi_weight_url
                      request_headers:
                        Content-Type: "application/json"
                      json: |-
                        root["name"] = id(username).state;
                        root["weight"] = id(current_weight).state;
                        root["impedance"] = id(current_impedance).state;
                        root["source"] = "${hostname}";
                        root["version"] = "${appversion}";
                        root["timestamp"] = id(time_sntp).now().strftime("%Y-%m-%dT%H:%M:%S");
                      on_error:
                        - logger.log:
                            level: WARN
                            tag: "http"
                            format: "FastAPI Server offline. HTTP Request übersprungen."

      # bodyscale care rssi (%)
      - platform: ble_rssi
        mac_address: ${mac}
        name: "RSSI Qualität"
        id: blerssi
        icon: mdi:rss
        filters:
          - filter_out: nan
          - lambda: return min(max(2 * (x + 100.0), 0.0), 100.0);
        unit_of_measurement: "%"
        entity_category: "diagnostic"

      # Wifi quality RSSI (%)
      - platform: wifi_signal
        name: "WIFI Signal"
        id: wifisignaldb
        icon: mdi:rss
        filters:
          - filter_out: nan
          - lambda: return min(max(2 * (x + 100.0), 0.0), 100.0);
        device_class: ""
        entity_category: "diagnostic"
        unit_of_measurement: "Signal %"

      # Device uptime in hours
      - platform: uptime
        name: "Online seit"
        id: mibodyuptime
        icon: mdi:clock-start
        filters:
          - filter_out: nan
          - lambda: return x / 3600;
        unit_of_measurement: "h"
        entity_category: "diagnostic"
        state_class: "measurement"
        accuracy_decimals: 2

      - platform: internal_temperature
        name: "Interne Temperatur"
        id: esp32_cpu_temp
        update_interval: 60s
        unit_of_measurement: "°C"
        accuracy_decimals: 1
        entity_category: "diagnostic"
        icon: "mdi:thermometer-lines"
        device_class: "temperature"
        state_class: "measurement"


    # ## COMPONENT text_sensors
    text_sensor:
      - platform: template
        name: "Gestartet am"
        disabled_by_default: true
        id: lastboot
        icon: mdi:clock-start
        entity_category: "diagnostic"

      # mibodyscale current person
      - platform: template
        name: "Name"
        id: username
        icon: mdi:account

      # mibodyscale last measure date
      - platform: template
        name: "Messung am"
        id: lastmeasuredate
        icon: mdi:clock-start

      # esphome application version
      - platform: version
        name: "ESPHome Version"
        icon: mdi:information-box-outline
        id: appver
        hide_timestamp: true
        hide_hash: true
        entity_category: "diagnostic"
        disabled_by_default: true

      # current device timestamp device
      - platform: template
        name: "Uhrzeit"
        id: systime
        icon: mdi:clock
        entity_category: "diagnostic"
        # KORREKTUR: update_interval hinzugefügt, damit der ESP nicht überhizt/abstürzt
        update_interval: 60s
        lambda: return id(time_sntp).now().strftime("%Y-%m-%dT%H:%M:%S %Z");

      - platform: wifi_info
        ssid:
          name: "WIFI SSID"
          id: wlan_ssid
          icon: mdi:wifi-settings
          entity_category: "diagnostic"
        ip_address:
          name: IP Addresse
          icon: mdi:ip
          disabled_by_default: true
          entity_category: "diagnostic"
    ## eof

```

</details>

<br>

Die User-Erkennung erfolgt bereits auf dem ESP32: Jeder User hat einen Gewichts-Schwellwert (`weight_threshold`). Liegt das gemessene Gewicht näher an Peter (70 kg) oder Reni (54 kg)?

---

## 🧮 Body Metrics – Was die Waage wirklich misst

Aus nur zwei Rohdaten (Gewicht + Impedanz) werden über **15 Körperwerte** berechnet:

| Metrik | Beschreibung | Einheit |
|--------|-------------|---------|
| **BMI** | Body Mass Index | kg/m² |
| **Körperfett** | Fettanteil (BIA-basiert) | % |
| **Viszeralfett** | Organfett (Bauchhöhle) | Level 1–30 |
| **Muskelmasse** | Skelettmuskeln | kg |
| **Wasseranteil** | Körperwasser | % |
| **Knochenmasse** | Mineralisierte Knochen | kg |
| **Protein** | Eiweißanteil | % |
| **BMR** | Grundumsatz (Basal Metabolic Rate) | kcal |
| **TDEE** | Tagesumsatz (BMR × Aktivitätsfaktor) | kcal |
| **Metabolisches Alter** | Biologisches Alter basierend auf BMR | Jahre |
| **Idealgewicht** | Basierend auf Größe/Geschlecht | kg |
| **Fat-Free Mass** | Fettfreie Körpermasse | kg |
| **FFMI** | Fat-Free Mass Index | kg/m² |
| **Ponderal Index** | Körperbau-Index | kg/m³ |
| **Body Type** | Klassifikation (dünn/normal/kräftig) | Text |

### Athleten-Modus

Für sportlich aktive Personen (`athletic: true`) werden die Standard-Formeln über **lineare Regressionsfaktoren** korrigiert. Die BIA-Messung unterschätzt bei niedrigem Körperfett systematisch die Muskelmasse und überschätzt den Fettanteil.

#### Warum die BIA-Messung bei Sportlern ohne Korrektur fehlerhaft ist

Die bioelektrische Impedanzanalyse (BIA) basiert standardmäßig auf mathematischen Formeln, die für den durchschnittlichen, eher untrainierten Körper entwickelt wurden. Bei Sportlern führt das zu systematischen Messfehlern:

* **Der Muskel-Irrtum:** Das Muskelgewebe von Athleten hat eine höhere Dichte, einen veränderten Wasseranteil (Hydratation) und eine stärkere Durchblutung als bei Untrainierten.
* **Die Fehlmessung:** Die Standard-Formel interpretiert den veränderten elektrischen Widerstand (Impedanz) des sportlichen Muskels falsch und ordnet ihn fälschlicherweise als Fettgewebe ein.
* **Das Ergebnis:** Ohne Korrektur zeigt die Waage bei Athleten systematisch einen **zu hohen Fettanteil** und eine **zu geringe Muskelmasse** an.

#### Was bewirkt der „Athletic-Modus“ (`athletic: true`)?

Sobald dieser Modus aktiviert ist, schaltet die Software auf spezielle Schätzformeln um, die über **lineare Regressionsfaktoren** an echten Sportlern validiert wurden:

* Die Faktoren passen die Berechnung an das spezifische Verhältnis von Gesamtkörperwasser und Muskelzellmasse trainierter Menschen aus.
* Der Algorithmus korrigiert den Rechenfehler, senkt den angezeigten Fettanteil und hebt die Muskelmasse auf ein realistisches Niveau an.


---

## 🏆 Body Score – Der Fitness-Index

Zusätzlich zu den einzelnen Metriken berechnet hc_scale einen **Body Score** (0–100 Punkte). Der Algorithmus wurde aus der Mi Fit App reverse-engineered und bewertet 8 Bereiche:

1. **BMI** – Abzug bei Unter-/Übergewicht
2. **Körperfett** – Abzug bei zu hoch/niedrig
3. **Muskelmasse** – Abzug bei zu wenig
4. **Wasseranteil** – Abzug bei Dehydration
5. **Viszeralfett** – Abzug bei erhöhtem Organfett
6. **Knochenmasse** – Abzug bei Mangel
7. **Grundumsatz** – Abzug bei zu niedrig
8. **Protein** – Abzug bei Mangel

**Score = 100 − Σ Abzüge**

Jeder Bereich hat geschlechts- und altersabhängige Referenzskalen. Ein Score über 80 gilt als gut, über 90 als ausgezeichnet.

---

## 👥 Multi-User-Erkennung

Die App unterstützt mehrere Personen. Jeder User hat ein Profil in `config/persons.yaml`:

```yaml
users:
  - name: Peter
    sex: male
    height: 175
    dob: "1955-12-16"
    athletic: true
    activity: 2.1
    weight_threshold: 70
    scores:
      WEIGHT: 70
      FAT: 11.5
      MUSCLE: 56
      WATER: 55
```

Die Erkennung funktioniert über:
1. **Name im POST** – ESP32 sendet User-Name direkt mit
2. **Gewichts-Match** – Fallback: nächster `weight_threshold`

Die `scores`-Werte definieren die persönlichen Zielwerte für die Score-Berechnung.

---

## 🖥️ Web Dashboard

Das Dashboard zeigt für jeden User:

- **Aktuelle Messung** – Alle berechneten Werte auf einen Blick
- **Verlaufskurven** – Gewicht, Fett, Muskelmasse über die letzten Wochen/Monate
- **Body Score Trend** – Score-Entwicklung als Linienchart
- **Delta zum Vortag** – Veränderung der Hauptmetriken
- **User-Wechsel** – Dropdown für Multi-User-Haushalte
- **Dark/Light Theme** – automatisch oder manuell

### Avatar & Personalisierung

Jeder User kann ein Avatar-Bild (`frontend/peter.png`, `frontend/reni.jpg`) hinterlegen, das im Dashboard und in Home Assistant angezeigt wird.

---

## 🔗 Home Assistant Integration

### MQTT Auto-Discovery

Bei App-Start registrieren sich pro User folgende Sensoren:

- `sensor.miscale_peter_weight` – Gewicht
- `sensor.miscale_peter_bmi` – BMI
- `sensor.miscale_peter_bodyfat` – Körperfett %
- `sensor.miscale_peter_muscle` – Muskelmasse
- `sensor.miscale_peter_water` – Wasseranteil
- `sensor.miscale_peter_score` – Body Score
- `sensor.miscale_peter_metabolic_age` – Metabolisches Alter
- ... (weitere Metriken)

### Webhooks

| Event | Auslöser | Daten |
|-------|----------|-------|
| **measurement** | Neue Messung | Alle berechneten Werte |
| **heartbeat** | Alle 5 Min | Online-Status |
| **app_start / app_stop** | Container-Lifecycle | – |

### Automation-Ideen

- Push-Benachrichtigung nach jeder Messung mit Gewicht + Score
- Warnung bei Score-Verschlechterung über 5 Punkte
- Wochendiagramm per Telegram-Bot

---

## 🛡️ Debounce-Logik

Die Mi Scale sendet bei einer Messung mehrere BLE Advertisements (stabilisierendes Gewicht). Der ESP32 schickt teilweise 2–3 POSTs für eine einzige Messung. Die App hat daher einen **30-Sekunden-Debounce**: Nach dem ersten gültigen POST wird 30 Sekunden lang jede weitere Messung desselben Users ignoriert.

---

## ⚙️ Installation & Konfiguration

### Docker (empfohlen)

```bash
git clone <repo-url> hc_scale
cd hc_scale
cp .env.example .env
nano .env                    # MQTT + Webhook setzen
nano config/persons.yaml     # User-Profile anlegen
make build && make up
# → Dashboard: http://localhost:5000
```

### ESP32 flashen

```bash
# ESPHome installieren
pip install esphome

# YAML anpassen (MAC-Adresse der eigenen Waage!)
nano docs/esphome/mismartscale-http.yaml

# Flashen
esphome run mismartscale-http.yaml
```

### Wichtige Umgebungsvariablen

| Variable | Default | Beschreibung |
|----------|---------|--------------|
| `PORT` | `5056` | App-Port |
| `MQTT_HOST` | `10.1.1.119` | MQTT Broker |
| `MQTT_TOPIC` | `bodyscale/data` | Basis-Topic |
| `DB_PATH` | `data/miscaledata.db` | SQLite Pfad |
| `HA_WEBHOOK_URL` | – | Home Assistant URL |
| `HA_WEBHOOK_ID` | `miscale` | Webhook-ID |
| `LOG_MODE` | `file` | Logging (console/file) |

---

## 📡 REST API

| Endpoint | Methode | Beschreibung |
|----------|---------|--------------|
| `POST /miscale` | POST | Waage-Daten empfangen (ESP32) |
| `GET /dashboard/api/datav2` | GET | Messdaten + User-Liste |
| `GET /dashboard/api/users` | GET | Verfügbare User mit Stats |
| `GET /dashboard/api/export` | GET | CSV-Download aller Messungen |
| `GET /api/health` | GET | Health Check |
| `GET /api/appstatus` | GET | MQTT/DB/User Status |
| `GET /api/kpi` | GET | KPI für Übersichtsdashboard |
| `GET /` | GET | Dashboard (HTML) |

### POST Format (ESP32 → App)

```json
{
  "name": "Peter",
  "weight": 69.5,
  "impedance": 580,
  "timestamp": "2026-07-08T07:15:22"
}
```

### Response

```json
{
  "status": "ok",
  "user": "Peter",
  "weight": 69.5,
  "bmi": 22.7,
  "bodyfat": 14.2,
  "muscle": 55.8,
  "score": 87.3
}
```

---

## 🛠️ Technologie-Stack

| Komponente | Technologie |
|------------|-------------|
| **Backend** | Python 3.12, FastAPI, Pydantic |
| **Datenbank** | SQLite (Tagesmessungen) + CSV-History |
| **Frontend** | HTML, Chart.js, ES-Module, Dark/Light Theme |
| **Hardware** | Xiaomi Mi Scale 2, ESP32, ESPHome |
| **Integration** | MQTT Discovery, HA Webhooks |
| **Algorithmen** | BIA-Formeln, Mi Fit Body Score (reverse-eng.) |
| **Deployment** | Docker Compose, Make-Workflow |

---

## 💡 Erkenntnisse aus dem Dauerbetrieb

- **Impedanz-Schwankung**: Die BIA-Messung ist tageszeit-abhängig. Morgens (nüchtern, nach dem Aufstehen) sind die Werte am reproduzierbarsten. Abends schwankt die Impedanz um ±30 Ohm.
- **Gewichts-Trend wichtiger als Einzelwert**: Tägliche Schwankungen von ±0,5 kg sind normal (Wassereinlagerung). Der 7-Tage-Durchschnitt zeigt den echten Trend.
- **Body Score motiviert**: Ein konkreter Score-Wert (z.B. 87/100) motiviert mehr als einzelne abstrakte Prozentwerte. Kleine Verbesserungen werden sichtbar.
- **Athleten-Korrektur notwendig**: Ohne den Korrekturfaktor zeigt die Waage bei sportlichen Personen 3–5% zu hohen Fettanteil an.
- **BLE-Reichweite**: Der ESP32 muss im selben Raum stehen. Durch eine Wand hindurch gehen regelmäßig Messungen verloren.

<hr style="margin-bottom: 4rem">

### Dashboard & Körperanalyse
{{< gallery >}}
  {{< image-dir >}}
{{< /gallery >}}

<hr style="margin-bottom: 4rem">

{{< notice tip >}}
  &raquo; **Messzeit standardisieren**: Immer morgens nüchtern messen – das gibt die konsistentesten Werte und den aussagekräftigsten Trend.<br>
  &raquo; **Impedanz prüfen**: Wenn die Impedanz 0 ist, stand der User nicht barfuß auf der Waage. Nur mit Hautkontakt funktioniert die BIA-Messung.<br>
  &raquo; **Zielwerte anpassen**: Die `scores` in `persons.yaml` sollten realistische Zielwerte sein – nicht Idealwerte. Sonst wird der Body Score frustrierend niedrig.<br>
  &raquo; **Backup**: Die SQLite-DB (`data/miscaledata.db`) enthält alle Messungen. Die CSV-History in `data/history/` dient als Zusatz-Backup pro Monat.<br>
{{< /notice >}}
