---
name: docker-compose
description: "Docker Compose for local dev: multi-service stacks, volumes, networking, health checks, env vars, production-like local environments"
---

> 🇩🇪 Deutsche Version. [Englische Version](../docker-compose.md).

# Docker Compose Skill

## Wann aktivieren
- Einrichten einer lokalen Entwicklungsumgebung mit mehreren Services (App + DB + Redis + etc.)
- Schreiben oder Debuggen einer `docker-compose.yml` oder `compose.yaml`
- Lokale Services an die Produktion angleichen (gleiche DB-Version, gleiche Umgebungsvariablen)
- Health Checks, `depends_on`-Reihenfolge oder Volume-Mounts hinzufügen
- Integrationstests gegen echte Services lokal ausführen

## Wann NICHT verwenden
- Produktions-Deployments — Kubernetes, ECS oder Fly.io verwenden
- Apps mit einem einzigen Container — `docker run` direkt verwenden
- Service-Container in CI/CD-Pipelines — native CI-Service-Definitionen verwenden

## Anweisungen

### Standard-Dev-Stack Compose-Datei

```yaml
# compose.yaml (Docker Compose v2 — bevorzugter Dateiname)
name: myapp

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: dev                    # Dev-Stage mit Hot Reload verwenden
    ports:
      - "3000:3000"
    volumes:
      - .:/app                       # Source für Hot Reload einbinden
      - /app/node_modules            # node_modules vom Mount ausschließen
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy   # auf DB-Bereitschaft warten
      redis:
        condition: service_started
    develop:
      watch:                         # Docker Compose Watch (v2.22+)
        - action: sync
          path: ./src
          target: /app/src

  db:
    image: postgres:16-alpine
    ports:
      - "5432:5432"                  # für DB-Client-Zugriff freigeben
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql  # beim ersten Start initialisieren
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d myapp"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes  # Daten persistieren

  mailpit:                           # lokale E-Mail-Erfassung (keine echten E-Mails)
    image: axllent/mailpit
    ports:
      - "8025:8025"                  # Web-UI
      - "1025:1025"                  # SMTP
    environment:
      SMTP_AUTH_ACCEPT_ANY: true

volumes:
  postgres_data:
  redis_data:
```

### Befehle

```bash
# Alle Services starten (im Hintergrund)
docker compose up -d

# Mit Logs starten
docker compose up

# Images neu bauen und starten
docker compose up -d --build

# Alle Services stoppen (Volumes behalten)
docker compose stop

# Stoppen und Container + Netzwerke entfernen
docker compose down

# Stoppen und alles inklusive Volumes entfernen
docker compose down -v

# Logs anzeigen
docker compose logs -f              # alle Services
docker compose logs -f app          # bestimmter Service

# Befehl in einem laufenden Container ausführen
docker compose exec app bash
docker compose exec db psql -U postgres myapp

# Einmaligen Befehl ausführen (neuer Container)
docker compose run --rm app npm run migrate

# Service skalieren
docker compose up -d --scale worker=3
```

### Verwaltung von Umgebungsvariablen

```yaml
# compose.yaml — mehrere Möglichkeiten, Umgebungsvariablen zu übergeben
services:
  app:
    # Option 1: inline (schlecht für Secrets)
    environment:
      NODE_ENV: development

    # Option 2: aus .env-Datei (Standard: .env im Projektstammverzeichnis)
    env_file:
      - .env
      - .env.local          # überschreibt .env

    # Option 3: Host-Umgebungsvariablen referenzieren
    environment:
      API_KEY: ${API_KEY}   # liest aus der Shell-Umgebung
```

```bash
# .env (versioniert — nicht geheime Standardwerte)
DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
REDIS_URL=redis://redis:6379
NODE_ENV=development

# .env.local (gitignoriert — Secrets und persönliche Überschreibungen)
API_KEY=sk-real-key
STRIPE_SECRET_KEY=sk_test_xxx
```

### Service-Netzwerk

Services im gleichen Compose-Projekt kommunizieren über **Service-Namen als Hostnamen**:

```yaml
services:
  app:
    environment:
      # Service-Namen 'db' verwenden, nicht 'localhost'
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      #                                                  ^^
  db:
    image: postgres:16-alpine
```

```yaml
# Benutzerdefiniertes Netzwerk zur Isolation
services:
  frontend:
    networks: [public, internal]

  api:
    networks: [internal]

  db:
    networks: [internal]     # nicht direkt vom Frontend erreichbar

networks:
  public:
  internal:
    internal: true           # kein externer Zugriff
```

### Multi-Stage Dockerfile für Dev/Prod-Parität

```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development-Stage — enthält devDependencies, Hot Reload
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Build-Stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production-Stage — minimales Image
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# compose.yaml — Dev-Stage lokal verwenden
services:
  app:
    build:
      context: .
      target: dev

# compose.prod.yaml — Prod-Stage verwenden
services:
  app:
    build:
      context: .
      target: prod
```

### Health Checks und Startreihenfolge

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy     # auf DB-Health-Check warten
      migrate:
        condition: service_completed_successfully  # auf Migrationen warten

  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 3s
      retries: 10
      start_period: 10s

  migrate:
    build: .
    command: npm run migrate
    depends_on:
      db:
        condition: service_healthy
    restart: "no"           # einmal ausführen und beenden
```

### Nützliche Muster

**Profilbasierte optionale Services:**
```yaml
services:
  app:
    image: myapp

  pgadmin:
    image: dpage/pgadmin4
    profiles: [tools]        # startet nur mit: docker compose --profile tools up
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
```

**Bind Mount für Konfigurationsdateien:**
```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro  # :ro = schreibgeschützt
    ports:
      - "80:80"
```

**DB-Migrationen beim Start ausführen:**
```yaml
services:
  app:
    command: >
      sh -c "npm run migrate && npm run dev"
    depends_on:
      db:
        condition: service_healthy
```

## Beispiel

**Benutzer:** Lokale Entwicklungsumgebung für eine FastAPI-App mit PostgreSQL, Redis, Celery Worker und einem React-Frontend einrichten — alles entsprechend der Produktionskonfiguration.

**Erwartete Ausgabe:**
```yaml
services:
  api:        # FastAPI mit uvicorn --reload
  worker:     # Celery Worker (gleiches Image wie api, anderer Befehl)
  frontend:   # React mit vite Dev-Server
  db:         # postgres:16, healthcheck, volume
  redis:      # redis:7, appendonly
  flower:     # Celery-Monitoring-UI, Profil: tools
```

---
