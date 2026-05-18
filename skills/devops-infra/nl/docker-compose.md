---
name: docker-compose
description: "Docker Compose for local dev: multi-service stacks, volumes, networking, health checks, env vars, production-like local environments"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../docker-compose.md).

# Docker Compose Skill

## Wanneer activeren
- Een lokale ontwikkelomgeving opzetten met meerdere services (app + DB + Redis + etc.)
- Een `docker-compose.yml` of `compose.yaml` schrijven of debuggen
- Lokale services laten overeenkomen met productie (zelfde DB-versie, zelfde omgevingsvariabelen)
- Health checks, `depends_on`-volgorde of volume-mounts toevoegen
- Integratietests uitvoeren tegen echte services lokaal

## Wanneer NIET gebruiken
- Productie-deployments — gebruik Kubernetes, ECS of Fly.io
- Apps met één container — gebruik `docker run` rechtstreeks
- Servicecontainers in CI/CD-pipelines — gebruik native CI-servicedefinities

## Instructies

### Standaard dev-stack compose-bestand

```yaml
# compose.yaml (Docker Compose v2 — aanbevolen bestandsnaam)
name: myapp

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: dev                    # gebruik een dev-stage met hot reload
    ports:
      - "3000:3000"
    volumes:
      - .:/app                       # source koppelen voor hot reload
      - /app/node_modules            # node_modules uitsluiten van mount
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy   # wachten tot DB gereed is
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
      - "5432:5432"                  # blootstellen voor DB-clienttoegang
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql  # initialiseren bij eerste start
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
    command: redis-server --appendonly yes  # gegevens persisteren

  mailpit:                           # lokale e-mailopvang (geen echte e-mails verstuurd)
    image: axllent/mailpit
    ports:
      - "8025:8025"                  # web UI
      - "1025:1025"                  # SMTP
    environment:
      SMTP_AUTH_ACCEPT_ANY: true

volumes:
  postgres_data:
  redis_data:
```

### Commando's

```bash
# Alle services starten (op de achtergrond)
docker compose up -d

# Starten met logs
docker compose up

# Images herbouwen en starten
docker compose up -d --build

# Alle services stoppen (volumes bewaren)
docker compose stop

# Stoppen en containers + netwerken verwijderen
docker compose down

# Stoppen en alles verwijderen inclusief volumes
docker compose down -v

# Logs bekijken
docker compose logs -f              # alle services
docker compose logs -f app          # specifieke service

# Een commando uitvoeren in een actieve container
docker compose exec app bash
docker compose exec db psql -U postgres myapp

# Een eenmalig commando uitvoeren (nieuwe container)
docker compose run --rm app npm run migrate

# Een service schalen
docker compose up -d --scale worker=3
```

### Beheer van omgevingsvariabelen

```yaml
# compose.yaml — meerdere manieren om omgevingsvariabelen door te geven
services:
  app:
    # Optie 1: inline (slecht voor secrets)
    environment:
      NODE_ENV: development

    # Optie 2: vanuit .env-bestand (standaard: .env in projectroot)
    env_file:
      - .env
      - .env.local          # overschrijft .env

    # Optie 3: omgevingsvariabelen van host refereren
    environment:
      API_KEY: ${API_KEY}   # leest uit de shell-omgeving
```

```bash
# .env (in versiecontrole — niet-geheime standaardwaarden)
DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
REDIS_URL=redis://redis:6379
NODE_ENV=development

# .env.local (gitignored — secrets en persoonlijke overschrijvingen)
API_KEY=sk-real-key
STRIPE_SECRET_KEY=sk_test_xxx
```

### Servicenetwerken

Services in hetzelfde Compose-project communiceren via **servicenamen als hostnamen**:

```yaml
services:
  app:
    environment:
      # Gebruik servicenaam 'db', niet 'localhost'
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      #                                                  ^^
  db:
    image: postgres:16-alpine
```

```yaml
# Aangepast netwerk voor isolatie
services:
  frontend:
    networks: [public, internal]

  api:
    networks: [internal]

  db:
    networks: [internal]     # niet direct bereikbaar vanuit frontend

networks:
  public:
  internal:
    internal: true           # geen externe toegang
```

### Multi-stage Dockerfile voor dev/prod-pariteit

```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development-stage — inclusief devDependencies, hot reload
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Build-stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production-stage — minimale image
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# compose.yaml — dev-stage lokaal gebruiken
services:
  app:
    build:
      context: .
      target: dev

# compose.prod.yaml — prod-stage gebruiken
services:
  app:
    build:
      context: .
      target: prod
```

### Health checks en opstartvolgorde

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy     # wachten op DB health check
      migrate:
        condition: service_completed_successfully  # wachten op migraties

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
    restart: "no"           # eenmalig uitvoeren en afsluiten
```

### Nuttige patronen

**Profielgebaseerde optionele services:**
```yaml
services:
  app:
    image: myapp

  pgadmin:
    image: dpage/pgadmin4
    profiles: [tools]        # start alleen met: docker compose --profile tools up
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
```

**Bind mount voor configuratiebestanden:**
```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro  # :ro = alleen-lezen
    ports:
      - "80:80"
```

**DB-migraties uitvoeren bij opstarten:**
```yaml
services:
  app:
    command: >
      sh -c "npm run migrate && npm run dev"
    depends_on:
      db:
        condition: service_healthy
```

## Voorbeeld

**Gebruiker:** Stel een lokale ontwikkelomgeving in voor een FastAPI-app met PostgreSQL, Redis, Celery worker en een React-frontend — alles overeenkomend met de productieconfiguratie.

**Verwachte uitvoer:**
```yaml
services:
  api:        # FastAPI met uvicorn --reload
  worker:     # Celery worker (zelfde image als api, ander commando)
  frontend:   # React met vite dev-server
  db:         # postgres:16, healthcheck, volume
  redis:      # redis:7, appendonly
  flower:     # Celery monitoring UI, profiel: tools
```

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — wij bouwen AI-producten en B2B-oplossingen met ontwikkelaarsgemeenschappen.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
