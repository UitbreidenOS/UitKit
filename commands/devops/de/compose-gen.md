---
description: Erstelle eine produktionsreife docker-compose.yml für das aktuelle Projekt
argument-hint: "[Service-Name oder Stack-Beschreibung]"
---
Erstelle eine produktionsreife `docker-compose.yml` für: $ARGUMENTS

Inspiziere das aktuelle Arbeitsverzeichnis — lese alle vorhandenen Dockerfiles, package.json, pyproject.toml, go.mod oder ähnliche Manifeste, um den Stack abzuleiten.

Anforderungen:
- Verwende benannte Volumes, keine Bind Mounts, für persistente Daten
- Setze `restart: unless-stopped` auf allen langlaufenden Services
- Injiziere Secrets über Umgebungsvariablen, die auf eine `.env`-Datei verweisen — hardcodiere nie Anmeldedaten
- Füge einen `healthcheck`-Block für jeden Service ein, der einen Port offenlegt
- Definiere ein dediziertes Bridge-Netzwerk; verwende nicht das Standard-Netzwerk
- Fixiere Image-Tags — verwende nie `:latest`
- Füge ein `depends_on` mit `condition: service_healthy` für Services mit Startup-Abhängigkeiten hinzu
- Trenne `dev`- und `prod`-Profile, wo zutreffend, mit dem `profiles`-Schlüssel
- Für Datenbanken: Setze explizite `POSTGRES_DB` / `MYSQL_DATABASE` / etc. und exponiere Ports nur auf localhost (`127.0.0.1:<port>:<port>`)

Ausgabe:
1. Die vollständige `docker-compose.yml`
2. Eine `docker-compose.override.yml` mit Source-Mount- und Debug-Port-Overrides für lokale Entwicklung
3. Eine `.env.example`, die jede erforderliche Variable ohne echte Werte auflistet

Nach den Dateien listen auf:
- Jede Umgebungsvariable, die der Operator bereitstellen muss
- Alle Volumes, die vorgefüllt oder mit Init-Scripts initialisiert werden müssen
- Befehle, um den Stack hochzufahren und die Gesundheit zu überprüfen:
  ```
  docker compose up -d
  docker compose ps
  docker compose logs --tail=50 <service>
  ```

Wenn der Stack einen Reverse Proxy (nginx/traefik/caddy) hat, füge ihn mit strukturell korrektem, aber auskommentiertem TLS-Terminierungskonfiguration ein.

Generiere keine Dockerfile, es sei denn, dies wird explizit angefordert — nur Compose.
