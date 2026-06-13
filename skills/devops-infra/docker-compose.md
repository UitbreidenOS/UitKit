---
name: docker-compose
description: "Docker Compose for local dev: multi-service stacks, volumes, networking, health checks, env vars, production-like local environments"
updated: 2026-06-13
---

# Docker Compose Skill

## When to activate
- Setting up a local dev environment with multiple services (app + DB + Redis + etc.)
- Writing or debugging a `docker-compose.yml` or `compose.yaml`
- Making local services match production (same DB version, same env vars)
- Adding health checks, depends_on ordering, or volume mounts
- Running integration tests against real services locally

## When NOT to use
- Production deployments — use Kubernetes, ECS, or Fly.io
- Single-container apps — use `docker run` directly
- CI/CD pipeline service containers — use native CI service definitions

## Instructions

### Standard dev stack compose file

```yaml
# compose.yaml (Docker Compose v2 — preferred filename)
name: myapp

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
      target: dev                    # use a dev stage with hot reload
    ports:
      - "3000:3000"
    volumes:
      - .:/app                       # mount source for hot reload
      - /app/node_modules            # exclude node_modules from mount
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy   # wait for DB to be ready
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
      - "5432:5432"                  # expose for DB client access
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql  # seed on first run
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
    command: redis-server --appendonly yes  # persist data

  mailpit:                           # local email capture (no real emails sent)
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

### Commands

```bash
# Start all services (detached)
docker compose up -d

# Start with logs
docker compose up

# Rebuild images and start
docker compose up -d --build

# Stop all services (keep volumes)
docker compose stop

# Stop and remove containers + networks
docker compose down

# Stop and remove everything including volumes
docker compose down -v

# View logs
docker compose logs -f              # all services
docker compose logs -f app          # specific service

# Run a command inside a running container
docker compose exec app bash
docker compose exec db psql -U postgres myapp

# Run a one-off command (new container)
docker compose run --rm app npm run migrate

# Scale a service
docker compose up -d --scale worker=3
```

### Environment variable management

```yaml
# compose.yaml — multiple ways to pass env vars
services:
  app:
    # Option 1: inline (bad for secrets)
    environment:
      NODE_ENV: development

    # Option 2: from .env file (default: .env in project root)
    env_file:
      - .env
      - .env.local          # overrides .env

    # Option 3: reference host env vars
    environment:
      API_KEY: ${API_KEY}   # reads from your shell's env
```

```bash
# .env (committed — non-secret defaults)
DATABASE_URL=postgresql://postgres:postgres@db:5432/myapp
REDIS_URL=redis://redis:6379
NODE_ENV=development

# .env.local (gitignored — secrets and personal overrides)
API_KEY=sk-real-key
STRIPE_SECRET_KEY=sk_test_xxx
```

### Service networking

Services on the same Compose project communicate using **service names as hostnames**:

```yaml
services:
  app:
    environment:
      # Use service name 'db', not 'localhost'
      DATABASE_URL: postgresql://postgres:postgres@db:5432/myapp
      #                                                  ^^
  db:
    image: postgres:16-alpine
```

```yaml
# Custom network for isolation
services:
  frontend:
    networks: [public, internal]

  api:
    networks: [internal]

  db:
    networks: [internal]     # not reachable from frontend directly

networks:
  public:
  internal:
    internal: true           # no external access
```

### Multi-stage Dockerfile for dev/prod parity

```dockerfile
# Dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage — includes devDependencies, hot reload
FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production stage — minimal image
FROM node:22-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

```yaml
# compose.yaml — use dev stage for local
services:
  app:
    build:
      context: .
      target: dev

# compose.prod.yaml — use prod stage
services:
  app:
    build:
      context: .
      target: prod
```

### Health checks and startup ordering

```yaml
services:
  app:
    depends_on:
      db:
        condition: service_healthy     # wait for DB health check
      migrate:
        condition: service_completed_successfully  # wait for migrations

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
    restart: "no"           # run once and exit
```

### Useful patterns

**Profile-based optional services:**
```yaml
services:
  app:
    image: myapp

  pgadmin:
    image: dpage/pgadmin4
    profiles: [tools]        # only starts with: docker compose --profile tools up
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
```

**Bind mount for config files:**
```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro  # :ro = read-only
    ports:
      - "80:80"
```

**Running DB migrations on start:**
```yaml
services:
  app:
    command: >
      sh -c "npm run migrate && npm run dev"
    depends_on:
      db:
        condition: service_healthy
```

## Example

**User:** Set up a local dev environment for a FastAPI app with PostgreSQL, Redis, Celery worker, and a React frontend — all matching production configuration.

**Expected output:**
```yaml
services:
  api:        # FastAPI with uvicorn --reload
  worker:     # Celery worker (same image as api, different command)
  frontend:   # React with vite dev server
  db:         # postgres:16, healthcheck, volume
  redis:      # redis:7, appendonly
  flower:     # Celery monitoring UI, profile: tools
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
