> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../docker.md).

# Docker Skill

## Wann aktivieren
- Dockerfiles für die Produktion schreiben oder optimieren
- Multi-Stage-Builds zur Reduzierung der Image-Größe einrichten
- Docker Compose-Dateien für die lokale Entwicklung schreiben
- Container-Startfehler oder Layer-Cache-Probleme debuggen
- Nicht-Root-Benutzer, Health-Checks und Image-Sicherheit konfigurieren
- .dockerignore für effiziente Builds einrichten
- Build-Skripte oder CI/CD Docker-Build-Pipelines schreiben

## Wann NICHT verwenden
- Kubernetes-Manifeste (Kubernetes Skill verwenden)
- Buildpacks (Heroku, Cloud Native Buildpacks) — anderes Build-System
- Virtuelle Maschinen bereitstellen (andere Abstraktionsebene)
- Nix-basierte reproduzierbare Builds

## Anweisungen

### Produktions-Dockerfile-Struktur
Für kompilierte Sprachen und Node.js immer Multi-Stage-Builds verwenden:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Runtime — minimales Image
FROM node:20-alpine AS runtime
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/healthz || exit 1
CMD ["node", "server.js"]
```

### Sicherheitsregeln
- Niemals als Root in der Produktion ausführen — immer einen Nicht-Root-Benutzer erstellen und zu diesem wechseln
- Niemals `latest`-Tag verwenden — auf eine spezifische Version oder einen Digest pinnen
- Alpine oder distroless-Basis-Images gegenüber vollem Debian/Ubuntu bevorzugen
- Niemals `.env`-Dateien in das Image kopieren — Secrets als Laufzeit-Umgebungsvariablen übergeben
- Images mit `docker scout` oder Trivy scannen, bevor sie in die Produktion gepusht werden

### Layer-Cache-Optimierung
Dockerfile-Anweisungen von am wenigsten bis am häufigsten geändert ordnen:
1. Basis-Image (ändert sich selten)
2. System-Abhängigkeiten (`apt-get`, `apk add`)
3. Paketmanager-Dateien (`package.json`, `requirements.txt`)
4. Paket-Installation (`npm ci`, `pip install`)
5. Anwendungscode (`COPY . .`) — ändert sich am häufigsten, muss zuletzt stehen

### .dockerignore — immer einschließen
```
node_modules/
.git/
.env
.env.*
*.md
Dockerfile*
docker-compose*
.dockerignore
coverage/
.nyc_output/
__pycache__/
*.pyc
.pytest_cache/
```

### Docker Compose für die lokale Entwicklung
```yaml
services:
  app:
    build:
      context: .
      target: builder          # Build-Stage verwenden, nicht Runtime-Stage lokal
    volumes:
      - .:/app                 # Hot Reload
      - /app/node_modules      # Container node_modules nicht überschreiben
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: dev_password   # Nur Dev — niemals Produktion
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 5
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Häufige Build-Fehler
- `COPY` schlägt lautlos fehl, wenn die Quelle nicht existiert — prüfen, ob `.dockerignore` benötigte Dateien ausschließt
- Layer-Cache unerwartet invalidiert — prüfen, ob ein `COPY` vor den Install-Schritten geänderte Dateien einbezieht
- Zugriff verweigert zur Laufzeit — Dateibesitz beim Verwenden von `COPY --from` mit einem Nicht-Root-Benutzer prüfen

## Beispiel

**Benutzer:** Ein Produktions-Dockerfile für eine Python FastAPI-App mit Multi-Stage-Build, Nicht-Root-Benutzer und Health-Check schreiben.

**Erwartete Ausgabe:**
- Stage 1 (builder): `python:3.12-slim`, Abhängigkeiten mit `pip install --no-cache-dir` installieren
- Stage 2 (runtime): `python:3.12-slim`, Nicht-Root-Benutzer, nur Wheels/Deps vom Builder + App-Code kopieren
- `HEALTHCHECK` trifft `/healthz`-Endpunkt
- `CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]`
- `.dockerignore` deckt `__pycache__`, `.env`, `.git`, `*.pyc` ab

---
