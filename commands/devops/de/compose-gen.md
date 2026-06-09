---
description: Generieren Sie eine produktionsreife docker-compose.yml für das aktuelle Projekt
argument-hint: "[service-name or stack description]"
---
Generieren Sie eine produktionsreife `docker-compose.yml` für: $ARGUMENTS

Überprüfen Sie das aktuelle Arbeitsverzeichnis — lesen Sie vorhandene Dockerfiles, package.json, pyproject.toml, go.mod oder ähnliche Manifeste ein, um den Stack abzuleiten.

Anforderungen:
- Verwenden Sie benannte Volumen, keine Bind Mounts, für persistente Daten
- Setzen Sie `restart: unless-stopped` auf allen langwierigen Services
- Injizieren Sie Secrets über Umgebungsvariablen, die auf eine `.env`-Datei verweisen — kodieren Sie Anmeldedaten niemals direkt
- Fügen Sie einen `healthcheck`-Block für jeden Service ein, der einen Port freilegt
- Definieren Sie ein dediziertes Bridge-Netzwerk; verwenden Sie nicht das Standard-Netzwerk
- Versehen Sie Image-Tags mit Pin-Versionen — verwenden Sie niemals `:latest`
- Fügen Sie einen `depends_on` mit `condition: service_healthy` für Services mit Startup-Abhängigkeiten hinzu
- Trennen Sie `dev`- und `prod`-Profile, wo anwendbar, mithilfe des `profiles`-Schlüssels
- Für Datenbanken: Setzen Sie explizit `POSTGRES_DB` / `MYSQL_DATABASE` / usw. und geben Sie Ports nur auf localhost frei (`127.0.0.1:<port>:<port>`)

Ausgabe:
1. Die vollständige `docker-compose.yml`
2. Eine `docker-compose.override.yml` mit Source-Mount- und Debug-Port-Overrides für die lokale Entwicklung
3. Eine `.env.example` mit jeder erforderlichen Variable ohne echte Werte

Nach den Dateien auflisten:
- Jede Umgebungsvariable, die der Operator bereitstellen muss
- Alle Volumen, die vorab gefüllt oder mit Init-Scripts initialisiert werden müssen
- Befehle zum Hochfahren des Stacks und zur Überprüfung der Gesundheit:
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

Wenn der Stack einen Reverse Proxy (nginx/traefik/caddy) hat, fügen Sie ihn mit strukturell korrekter, aber auskommentierter TLS-Terminierungskonfiguration ein.

Generieren Sie keinen Dockerfile, wenn nicht explizit gefordert — nur Compose.
