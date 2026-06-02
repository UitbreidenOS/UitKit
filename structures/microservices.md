# Microservices Architecture — Project Structure

> For backend engineers and DevOps teams running a Docker Compose-based microservices platform locally and in staging, optimizing the daily cycle of adding services, wiring inter-service communication, running migrations, and shipping per-service CI pipelines to Kubernetes.

## Stack

- **Services (Python):** FastAPI 0.111 + Pydantic v2 + SQLAlchemy 2.0 + Alembic — auth-service, user-service, notification-service
- **Services (Node.js):** Express 4 + TypeScript 5.4 + Prisma 5 — gateway (API gateway + routing layer)
- **Databases:** PostgreSQL 16 — one database per service (strict DB isolation)
- **Cache + pub/sub:** Redis 7 (cache with keyspace per service, pub/sub for lightweight events)
- **Async messaging:** RabbitMQ 3.13 with AMQP 0-9-1 (durable queues, dead-letter exchanges)
- **Reverse proxy:** Traefik v3 (dynamic routing, TLS termination, per-service middleware)
- **Observability:** Prometheus 2.51 + Grafana 10.4 (metrics); Jaeger 1.57 (trace backend)
- **Tracing:** OpenTelemetry SDK (Python: opentelemetry-sdk 1.24; Node.js: @opentelemetry/sdk-node 0.51)
- **CI:** GitHub Actions — per-service pipelines with matrix build, Docker push, Helm lint
- **Deployment:** Helm 3.14 charts per service, deployed to Kubernetes (EKS or GKE)
- **Service-to-service auth:** Internal JWT signed with shared secret (RS256 keypair, rotated via Kubernetes secret)
- **Local orchestration:** Docker Compose v2 with profiles (core, observability, messaging)

## Directory tree

```
microservices/
├── services/
│   ├── auth-service/                        # FastAPI — issues + validates JWTs, manages sessions
│   │   ├── app/
│   │   │   ├── main.py                      # FastAPI app factory, lifespan, router registration
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── router.py            # Mounts /auth, /token, /refresh, /revoke
│   │   │   │   │   ├── auth.py              # POST /auth/login, /auth/logout handlers
│   │   │   │   │   └── token.py             # POST /token/refresh, /token/introspect handlers
│   │   │   │   └── deps.py                  # FastAPI dependencies: get_db, get_redis, require_internal
│   │   │   ├── core/
│   │   │   │   ├── config.py                # Settings via pydantic-settings (reads .env)
│   │   │   │   ├── jwt.py                   # RS256 sign/verify, claims schema, expiry logic
│   │   │   │   ├── security.py              # Argon2 password hashing, timing-safe compare
│   │   │   │   └── telemetry.py             # OpenTelemetry SDK init, OTLP exporter config
│   │   │   ├── models/
│   │   │   │   ├── user.py                  # SQLAlchemy User, Session, RefreshToken ORM models
│   │   │   │   └── base.py                  # DeclarativeBase, UUID pk mixin, timestamps mixin
│   │   │   ├── schemas/
│   │   │   │   ├── auth.py                  # Pydantic: LoginRequest, TokenResponse, IntrospectResponse
│   │   │   │   └── token.py                 # Pydantic: RefreshRequest, InternalClaims
│   │   │   ├── services/
│   │   │   │   ├── auth_service.py          # Login/logout business logic
│   │   │   │   └── token_service.py         # Token issuance, refresh, revocation
│   │   │   └── db/
│   │   │       └── session.py               # Async SQLAlchemy engine + session factory
│   │   ├── alembic/
│   │   │   ├── env.py                       # Alembic env using app models metadata
│   │   │   ├── alembic.ini                  # DB URL read from AUTH_DATABASE_URL env var
│   │   │   └── versions/                    # Migration scripts (auto-generated + hand-edited)
│   │   │       └── 0001_initial_schema.py   # Users, sessions, refresh_tokens tables
│   │   ├── tests/
│   │   │   ├── conftest.py                  # pytest fixtures: test DB, async client, mock Redis
│   │   │   ├── test_auth.py                 # Integration: login, logout, wrong password
│   │   │   └── test_token.py                # Unit: JWT sign/verify, expiry, revocation
│   │   ├── Dockerfile                       # Multi-stage: builder (deps) + runtime (slim)
│   │   ├── pyproject.toml                   # Poetry deps: fastapi, sqlalchemy, alembic, pydantic-settings
│   │   └── .env.example                     # AUTH_DATABASE_URL, REDIS_URL, JWT_PRIVATE_KEY_PATH
│   │
│   ├── user-service/                        # FastAPI — user profiles, preferences, account management
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/v1/
│   │   │   │   ├── router.py                # Mounts /users, /profiles
│   │   │   │   ├── users.py                 # CRUD handlers — GET/PATCH /users/{id}
│   │   │   │   └── deps.py                  # require_internal: validates inbound service JWT
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── messaging.py             # RabbitMQ publisher: user.created, user.updated events
│   │   │   │   └── telemetry.py
│   │   │   ├── models/user.py               # SQLAlchemy User, Profile ORM models
│   │   │   ├── schemas/user.py              # Pydantic: UserResponse, UpdateRequest
│   │   │   └── db/session.py
│   │   ├── alembic/
│   │   │   ├── alembic.ini
│   │   │   ├── env.py
│   │   │   └── versions/
│   │   │       └── 0001_initial_schema.py
│   │   ├── tests/
│   │   │   ├── conftest.py
│   │   │   └── test_users.py
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── .env.example                     # USER_DATABASE_URL, RABBITMQ_URL, REDIS_URL
│   │
│   ├── notification-service/                # FastAPI — email/SMS/push via RabbitMQ consumer
│   │   ├── app/
│   │   │   ├── main.py                      # Starts AMQP consumer loop + FastAPI health endpoint
│   │   │   ├── consumers/
│   │   │   │   ├── user_events.py           # Listens on user.created, user.updated queues
│   │   │   │   └── notification_events.py   # Listens on notification.send queue
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── amqp.py                  # aio_pika connection pool, consumer setup, DLX config
│   │   │   │   ├── email.py                 # SendGrid API client wrapper
│   │   │   │   └── telemetry.py
│   │   │   ├── schemas/events.py            # Pydantic: UserCreatedEvent, NotificationSendEvent
│   │   │   └── services/
│   │   │       └── notification_service.py  # Route events → channel (email/SMS/push)
│   │   ├── tests/
│   │   │   ├── conftest.py
│   │   │   └── test_consumers.py
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── .env.example                     # RABBITMQ_URL, SENDGRID_API_KEY
│   │
│   └── gateway/                             # Node.js + TypeScript — API gateway, auth middleware, routing
│       ├── src/
│       │   ├── index.ts                     # Express app factory, graceful shutdown
│       │   ├── routes/
│       │   │   ├── auth.ts                  # Proxy: /api/v1/auth → auth-service:8001
│       │   │   ├── users.ts                 # Proxy: /api/v1/users → user-service:8002
│       │   │   └── health.ts               # GET /health, GET /ready — aggregated service health
│       │   ├── middleware/
│       │   │   ├── authenticate.ts          # Verifies inbound user JWT, attaches claims to req
│       │   │   ├── inject-service-token.ts  # Signs and injects internal service JWT on proxied requests
│       │   │   ├── rate-limit.ts            # Redis-backed rate limiting via rate-limiter-flexible
│       │   │   └── request-id.ts            # Generates/propagates X-Request-ID header
│       │   ├── lib/
│       │   │   ├── proxy.ts                 # http-proxy-middleware factory with retry + circuit breaker
│       │   │   ├── jwt.ts                   # RS256 verify (public key), internal JWT sign (private key)
│       │   │   └── telemetry.ts             # OpenTelemetry SDK init for Node.js
│       │   └── config.ts                    # Typed config from env via zod
│       ├── tests/
│       │   ├── middleware.test.ts            # Jest: authenticate, inject-service-token unit tests
│       │   └── routes.test.ts               # Supertest: proxy routing integration tests
│       ├── Dockerfile
│       ├── tsconfig.json                    # strict: true, target: ES2022, moduleResolution: bundler
│       ├── package.json
│       └── .env.example                     # AUTH_SERVICE_URL, USER_SERVICE_URL, JWT_PUBLIC_KEY_PATH
│
├── infrastructure/
│   ├── docker-compose.yml                   # Core services: gateway, auth, user, notification + DBs
│   ├── docker-compose.observability.yml     # Profile: prometheus, grafana, jaeger, otel-collector
│   ├── docker-compose.messaging.yml         # Profile: rabbitmq + management UI
│   ├── docker-compose.prod.yml              # Production overrides: no volume mounts, resource limits
│   ├── traefik/
│   │   ├── traefik.yml                      # Static config: entrypoints (80, 443, 8080 dashboard)
│   │   └── dynamic/
│   │       ├── services.yml                 # Router rules: Host + PathPrefix per service
│   │       └── middlewares.yml              # stripPrefix, headers, rateLimit middleware definitions
│   ├── prometheus/
│   │   ├── prometheus.yml                   # Scrape configs: all services on /metrics, 15s interval
│   │   └── rules/
│   │       ├── service-alerts.yml           # Alerts: high error rate, p99 latency, queue depth
│   │       └── infra-alerts.yml             # Alerts: DB connection pool saturation, Redis memory
│   ├── grafana/
│   │   ├── provisioning/
│   │   │   ├── datasources/prometheus.yml   # Auto-provisioned Prometheus datasource
│   │   │   └── dashboards/dashboards.yml    # Dashboard provider config (file-based)
│   │   └── dashboards/
│   │       ├── services-overview.json       # Per-service RPS, error rate, p50/p99 latency
│   │       ├── rabbitmq.json                # Queue depth, message rate, consumer count
│   │       └── postgres.json                # Connection pool, query duration, replication lag
│   └── otel-collector/
│       └── otel-collector.yml               # Receives OTLP (gRPC 4317), exports to Jaeger + Prometheus
│
├── helm/
│   ├── auth-service/                        # Helm chart — mirrors service structure for all services
│   │   ├── Chart.yaml                       # chart name, version, appVersion
│   │   ├── values.yaml                      # Default: replicas, image, resources, env, ingress
│   │   ├── values.staging.yaml              # Staging overrides: replicas=1, image tag from CI
│   │   ├── values.prod.yaml                 # Prod overrides: replicas=3, PodDisruptionBudget
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       ├── hpa.yaml                     # HorizontalPodAutoscaler (CPU + custom metrics)
│   │       ├── configmap.yaml
│   │       └── secret.yaml                  # External Secrets Operator annotation for sealed secrets
│   ├── user-service/
│   ├── notification-service/
│   └── gateway/
│
├── scripts/
│   ├── dev-up.sh                            # docker compose --profile core up -d; runs DB seed
│   ├── dev-down.sh                          # docker compose down -v (clears volumes)
│   ├── migrate.sh                           # Runs alembic upgrade head inside running container
│   ├── seed.sh                              # Inserts fixture data into all service DBs for local dev
│   ├── generate-keys.sh                     # Generates RS256 keypair, writes to .keys/ (gitignored)
│   ├── deploy.sh                            # Wraps helm upgrade --install with correct values file
│   └── health-check.sh                      # Polls all /health endpoints until ready or timeout
│
├── .github/
│   └── workflows/
│       ├── auth-service.yml                 # Trigger: paths: services/auth-service/** — lint, test, build, push
│       ├── user-service.yml                 # Trigger: paths: services/user-service/**
│       ├── notification-service.yml         # Trigger: paths: services/notification-service/**
│       ├── gateway.yml                      # Trigger: paths: services/gateway/**
│       ├── helm-lint.yml                    # Trigger: paths: helm/** — helm lint + kubeval
│       └── integration-tests.yml            # Trigger: manual + schedule — full stack smoke tests
│
├── .keys/                                   # Gitignored — RS256 keypair for local dev only
│   ├── private.pem
│   └── public.pem
│
├── .env                                     # Gitignored — actual local dev secrets
├── .env.example                             # All required vars across all services, documented
└── CLAUDE.md                                # Instructions for Claude Code working in this repo
```

## Key files explained

| Path | Purpose |
|---|---|
| `infrastructure/docker-compose.yml` | Defines all core services with health checks, named networks (`services-net`), and per-service DB containers. Use `--profile` flags to add observability or messaging stacks without running them by default. |
| `services/gateway/src/middleware/inject-service-token.ts` | Signs an internal RS256 JWT (short TTL: 30s) and attaches it as `X-Internal-Token` before proxying. Downstream services validate this token in `deps.py` `require_internal` dependency to reject requests that did not come through the gateway. |
| `services/auth-service/app/core/jwt.py` | Single source of truth for JWT signing (RS256 private key) and verification (RS256 public key). Both the auth-service and gateway import equivalent logic — this file is the Python reference. Keep claim schema (`sub`, `iat`, `exp`, `jti`, `service`) in sync with gateway's `lib/jwt.ts`. |
| `infrastructure/traefik/dynamic/services.yml` | Maps public hostnames and path prefixes to Docker service names. When adding a new service, register its router and service here before expecting traffic to reach it through Traefik. |
| `infrastructure/otel-collector/otel-collector.yml` | Central OTLP receiver. All services export traces here via gRPC on port 4317. The collector fans out to Jaeger (traces) and Prometheus (metrics via spanmetrics connector). Do not change exporter config without coordinating with all service teams. |
| `scripts/migrate.sh` | Runs `alembic upgrade head` inside the already-running service container. Always run this after pulling new migrations; never apply directly against the production DB URL without a maintenance window. |
| `.github/workflows/auth-service.yml` | Per-service pipeline: runs pytest with `--cov`, builds Docker image tagged with `sha-${{ github.sha }}`, pushes to ECR, runs `helm lint`, and optionally deploys to staging on merge to main. |
| `helm/auth-service/values.prod.yaml` | Production-specific overrides: 3 replicas, resource limits (`cpu: 500m, memory: 512Mi`), PodDisruptionBudget minAvailable=2, and External Secrets Operator annotation for DB credentials from AWS Secrets Manager. |

## Quick scaffold

```bash
# Create the full microservices directory structure from scratch
BASE="$HOME/projects/microservices"
mkdir -p "$BASE"

# Service directories (Python FastAPI services)
for svc in auth-service user-service notification-service; do
  mkdir -p "$BASE/services/$svc/app/api/v1"
  mkdir -p "$BASE/services/$svc/app/core"
  mkdir -p "$BASE/services/$svc/app/models"
  mkdir -p "$BASE/services/$svc/app/schemas"
  mkdir -p "$BASE/services/$svc/app/services"
  mkdir -p "$BASE/services/$svc/app/db"
  mkdir -p "$BASE/services/$svc/alembic/versions"
  mkdir -p "$BASE/services/$svc/tests"
  touch "$BASE/services/$svc/app/main.py"
  touch "$BASE/services/$svc/app/api/v1/router.py"
  touch "$BASE/services/$svc/app/api/v1/deps.py"
  touch "$BASE/services/$svc/app/core/config.py"
  touch "$BASE/services/$svc/app/core/telemetry.py"
  touch "$BASE/services/$svc/app/db/session.py"
  touch "$BASE/services/$svc/alembic/env.py"
  touch "$BASE/services/$svc/alembic/alembic.ini"
  touch "$BASE/services/$svc/tests/conftest.py"
  touch "$BASE/services/$svc/Dockerfile"
  touch "$BASE/services/$svc/pyproject.toml"
  touch "$BASE/services/$svc/.env.example"
done

# Gateway (Node.js + TypeScript)
mkdir -p "$BASE/services/gateway/src/routes"
mkdir -p "$BASE/services/gateway/src/middleware"
mkdir -p "$BASE/services/gateway/src/lib"
mkdir -p "$BASE/services/gateway/tests"
touch "$BASE/services/gateway/src/index.ts"
touch "$BASE/services/gateway/src/config.ts"
touch "$BASE/services/gateway/src/routes/auth.ts"
touch "$BASE/services/gateway/src/routes/users.ts"
touch "$BASE/services/gateway/src/routes/health.ts"
touch "$BASE/services/gateway/src/middleware/authenticate.ts"
touch "$BASE/services/gateway/src/middleware/inject-service-token.ts"
touch "$BASE/services/gateway/src/middleware/rate-limit.ts"
touch "$BASE/services/gateway/src/middleware/request-id.ts"
touch "$BASE/services/gateway/src/lib/proxy.ts"
touch "$BASE/services/gateway/src/lib/jwt.ts"
touch "$BASE/services/gateway/src/lib/telemetry.ts"
touch "$BASE/services/gateway/tsconfig.json"
touch "$BASE/services/gateway/package.json"
touch "$BASE/services/gateway/Dockerfile"
touch "$BASE/services/gateway/.env.example"

# Infrastructure
mkdir -p "$BASE/infrastructure/traefik/dynamic"
mkdir -p "$BASE/infrastructure/prometheus/rules"
mkdir -p "$BASE/infrastructure/grafana/provisioning/datasources"
mkdir -p "$BASE/infrastructure/grafana/provisioning/dashboards"
mkdir -p "$BASE/infrastructure/grafana/dashboards"
mkdir -p "$BASE/infrastructure/otel-collector"
touch "$BASE/infrastructure/docker-compose.yml"
touch "$BASE/infrastructure/docker-compose.observability.yml"
touch "$BASE/infrastructure/docker-compose.messaging.yml"
touch "$BASE/infrastructure/docker-compose.prod.yml"
touch "$BASE/infrastructure/traefik/traefik.yml"
touch "$BASE/infrastructure/traefik/dynamic/services.yml"
touch "$BASE/infrastructure/traefik/dynamic/middlewares.yml"
touch "$BASE/infrastructure/prometheus/prometheus.yml"
touch "$BASE/infrastructure/prometheus/rules/service-alerts.yml"
touch "$BASE/infrastructure/prometheus/rules/infra-alerts.yml"
touch "$BASE/infrastructure/grafana/provisioning/datasources/prometheus.yml"
touch "$BASE/infrastructure/grafana/provisioning/dashboards/dashboards.yml"
touch "$BASE/infrastructure/grafana/dashboards/services-overview.json"
touch "$BASE/infrastructure/otel-collector/otel-collector.yml"

# Helm charts
for svc in auth-service user-service notification-service gateway; do
  mkdir -p "$BASE/helm/$svc/templates"
  touch "$BASE/helm/$svc/Chart.yaml"
  touch "$BASE/helm/$svc/values.yaml"
  touch "$BASE/helm/$svc/values.staging.yaml"
  touch "$BASE/helm/$svc/values.prod.yaml"
  for tmpl in deployment service ingress hpa configmap secret; do
    touch "$BASE/helm/$svc/templates/$tmpl.yaml"
  done
done

# Scripts
mkdir -p "$BASE/scripts"
for script in dev-up dev-down migrate seed generate-keys deploy health-check; do
  touch "$BASE/scripts/$script.sh"
  chmod +x "$BASE/scripts/$script.sh"
done

# GitHub Actions
mkdir -p "$BASE/.github/workflows"
for wf in auth-service user-service notification-service gateway helm-lint integration-tests; do
  touch "$BASE/.github/workflows/$wf.yml"
done

# Root files
mkdir -p "$BASE/.keys"
echo ".keys/\n.env" > "$BASE/.gitignore"
touch "$BASE/.env.example"
touch "$BASE/CLAUDE.md"

# Generate local RS256 keypair for service-to-service auth
bash "$BASE/scripts/generate-keys.sh" 2>/dev/null || \
  openssl genrsa -out "$BASE/.keys/private.pem" 2048 && \
  openssl rsa -in "$BASE/.keys/private.pem" -pubout -out "$BASE/.keys/public.pem"

echo "Microservices scaffold created at $BASE"

# Install relevant skills
npx claudient add skill devops-infra/docker-compose-local-dev
npx claudient add skill devops-infra/k8s-deployment
npx claudient add skill devops-infra/helm-chart
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill backend/fastapi-crud
npx claudient add skill backend/alembic-migration
npx claudient add skill backend/rabbitmq-consumer
npx claudient add skill devops-infra/capacity-planner
```

## CLAUDE.md template

```markdown
# Microservices Platform — CLAUDE.md

This repo contains four services (auth-service, user-service, notification-service, gateway),
shared infrastructure (Docker Compose, Traefik, Prometheus, Grafana, RabbitMQ), and Helm
charts for Kubernetes deployment. Changes to any service are isolated — each has its own
database, CI pipeline, and Dockerfile.

## Stack

- auth-service: FastAPI 0.111, PostgreSQL 16 (auth_db), Redis 7, Alembic migrations
- user-service: FastAPI 0.111, PostgreSQL 16 (user_db), RabbitMQ publisher, Alembic migrations
- notification-service: FastAPI 0.111, aio_pika RabbitMQ consumer, SendGrid
- gateway: Express 4, TypeScript 5.4, http-proxy-middleware, RS256 JWT validation
- Reverse proxy: Traefik v3 — all public traffic routes through it; no service exposes ports directly
- Observability: Prometheus + Grafana + Jaeger via OpenTelemetry (OTLP gRPC port 4317)
- Async messaging: RabbitMQ durable queues with dead-letter exchanges on all consumer queues
- Deployment: Helm 3.14 charts per service; values.staging.yaml and values.prod.yaml per env

## Running the full stack locally

```bash
# Start core services (all four services + per-service DBs + Redis + Traefik)
./scripts/dev-up.sh

# Start with observability stack (adds Prometheus, Grafana, Jaeger, OTEL collector)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.observability.yml up -d

# Start with messaging (adds RabbitMQ + management UI at http://localhost:15672)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.messaging.yml up -d

# Check all services are healthy
./scripts/health-check.sh

# Tear down (removes volumes — resets all DBs)
./scripts/dev-down.sh
```

Services are accessible via Traefik at http://localhost:80:
- POST http://localhost/api/v1/auth/login
- GET  http://localhost/api/v1/users/{id}
- GET  http://localhost/health

## Adding a new service

1. Copy services/auth-service/ as a template: cp -r services/auth-service services/my-service
2. Update services/my-service/app/core/config.py with the new service's env vars
3. Add a new DB container to infrastructure/docker-compose.yml (my_service_db: postgres:16)
4. Register the service in infrastructure/docker-compose.yml under services:
   - Build from services/my-service/Dockerfile
   - Connect to services-net, depends_on the DB
5. Add routing rules to infrastructure/traefik/dynamic/services.yml
6. Create a Helm chart: cp -r helm/auth-service helm/my-service; update Chart.yaml + values.yaml
7. Create a GitHub Actions workflow: cp .github/workflows/auth-service.yml .github/workflows/my-service.yml
   - Update `paths:` filter to services/my-service/**
8. Add .env.example entries for the new service's required env vars
9. Run ./scripts/generate-keys.sh if the service needs to issue internal JWTs
10. Write the alembic initial migration and run: ./scripts/migrate.sh my-service

## Inter-service communication

### Synchronous (REST via gateway)

All sync calls from clients go through the gateway. The gateway:
1. Verifies the user's JWT (RS256 public key from .keys/public.pem)
2. Signs an internal service JWT (RS256 private key, TTL 30s, claims: {sub: "gateway", service: "gateway"})
3. Attaches it as X-Internal-Token header before proxying

Downstream services validate X-Internal-Token in their `require_internal` FastAPI dependency.
Direct service-to-service REST calls (not via gateway) must also use a signed internal JWT.

### Asynchronous (RabbitMQ)

Exchanges follow the pattern: {service}.events (e.g., user.events, auth.events).
Routing keys follow: {service}.{entity}.{action} (e.g., user.account.created).

Publishing (user-service example):
```python
# core/messaging.py
await channel.default_exchange.publish(
    aio_pika.Message(
        body=UserCreatedEvent(user_id=str(user.id)).model_dump_json().encode(),
        delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
        content_type="application/json",
    ),
    routing_key="user.account.created",
)
```

Consuming (notification-service example):
- Declare queue with x-dead-letter-exchange pointing to {service}.events.dlx
- Always ack after successful processing; nack (requeue=False) on unrecoverable errors
- Idempotent consumers only — messages may be redelivered after a crash

## Running migrations

```bash
# Run pending migrations for a specific service
./scripts/migrate.sh auth-service     # runs alembic upgrade head inside the container
./scripts/migrate.sh user-service

# Generate a new migration (after changing SQLAlchemy models)
docker exec auth-service alembic revision --autogenerate -m "add_refresh_token_table"

# Inspect current migration state
docker exec auth-service alembic current
docker exec auth-service alembic history --verbose
```

Migration rules:
- Every migration must be backward-compatible — the old service version must still run against it
- Never DROP COLUMN in the same PR that removes the column from the ORM model
- For large tables (>1M rows): use CREATE INDEX CONCURRENTLY, never plain CREATE INDEX
- Always add a rollback SQL comment at the top of each migration version file

## Service-to-service auth

The RS256 keypair in .keys/ is used for all internal JWT signing:
- private.pem: gateway and any service that issues internal tokens signs with this
- public.pem: all downstream services verify with this

For local dev, .keys/ is volume-mounted into all containers.
For staging/prod, the keypair is stored in AWS Secrets Manager and injected via Kubernetes secrets.

To rotate the keypair:
1. Generate a new pair: ./scripts/generate-keys.sh
2. Deploy the new public key to all services first (they accept both old and new during rotation window)
3. Deploy the new private key to the gateway/issuers
4. Remove the old public key from verifiers after all in-flight tokens have expired (max TTL: 30s)

## Observability

- Metrics: all services expose GET /metrics (Prometheus scrape); see infrastructure/prometheus/prometheus.yml
- Traces: all services export OTLP gRPC to otel-collector:4317; view traces in Jaeger at http://localhost:16686
- Dashboards: Grafana at http://localhost:3000 (admin/admin locally); dashboards auto-provisioned from infrastructure/grafana/dashboards/
- Alerts: defined in infrastructure/prometheus/rules/; fire to PagerDuty in prod

## CI pipelines

Each service has its own workflow file in .github/workflows/:
- Triggered by path filter: changes to services/{name}/** or helm/{name}/**
- Steps: checkout → set up language (Python 3.12 / Node 20) → lint → test → build Docker → push to ECR → helm lint
- On merge to main: adds a deploy-to-staging step (helm upgrade --install with values.staging.yaml)
- Image tags: sha-${{ github.sha }} — never use `latest` as a deployment tag

## Conventions

- DB naming: {service_name}_db (e.g., auth_db, user_db) — never share a DB between services
- Queue naming: {service}.{entity}.{action} — always include all three segments
- Internal JWT claims: always include {sub, iat, exp, jti, service} — never remove jti (for replay prevention)
- Env vars: ALL_CAPS_SNAKE_CASE; always add to .env.example with a description comment
- Ports (local dev): gateway=8000, auth-service=8001, user-service=8002, notification-service=8003
- Traefik dashboard: http://localhost:8080 (local only, never expose in prod)
```

## MCP servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "${HOME}/projects/microservices"
      ]
    },
    "docker": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"],
      "env": {
        "DOCKER_HOST": "unix:///var/run/docker.sock"
      }
    },
    "postgres-auth": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://dev:dev@localhost:5433/auth_db"
      }
    },
    "postgres-user": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://dev:dev@localhost:5434/user_db"
      }
    },
    "prometheus": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-prometheus"],
      "env": {
        "PROMETHEUS_URL": "http://localhost:9090"
      }
    }
  }
}
```

## Recommended hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; EXT=\"${FILE##*.}\"; if [[ \"$EXT\" == \"py\" ]]; then ruff format \"$FILE\" 2>/dev/null && ruff check --fix --select I \"$FILE\" 2>/dev/null || true; elif [[ \"$EXT\" == \"ts\" || \"$EXT\" == \"tsx\" ]]; then npx prettier --write \"$FILE\" 2>/dev/null || true; elif [[ \"$EXT\" == \"yml\" || \"$EXT\" == \"yaml\" ]]; then which yamllint &>/dev/null && yamllint -d relaxed \"$FILE\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"alembic upgrade|migrate\\.sh\"; then echo \"[HOOK] Migration detected — confirm the target service DB is running and a backup exists before proceeding.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'REPO=\"$PWD\"; if docker compose -f \"$REPO/infrastructure/docker-compose.yml\" ps --quiet 2>/dev/null | grep -q .; then echo \"[REMINDER] Docker Compose stack is still running. Run ./scripts/dev-down.sh when finished to free resources.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills to install

```bash
npx claudient add skill devops-infra/docker-compose-local-dev
npx claudient add skill devops-infra/k8s-deployment
npx claudient add skill devops-infra/helm-chart
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill devops-infra/capacity-planner
npx claudient add skill backend/fastapi-crud
npx claudient add skill backend/alembic-migration
npx claudient add skill backend/rabbitmq-consumer
npx claudient add skill data-ml/stakeholder-report
npx claudient add skill productivity/engineering-strategy
```

## Related

- [DevOps & Infrastructure Guide](../guides/for-devops-sre.md)
- [Docker Compose Local Dev Workflow](../workflows/docker-compose-local-dev.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
