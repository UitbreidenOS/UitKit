# Microservices Architectuur — Projectstructuur

> Voor backend-engineers en DevOps-teams die een Docker Compose-gebaseerd microservices-platform lokaal en in staging uitvoeren, waarbij dagelijkse cycli worden geoptimaliseerd: services toevoegen, communicatie tussen services configureren, migraties uitvoeren en per-service CI-pipelines naar Kubernetes deployen.

## Stack

- **Services (Python):** FastAPI 0.111 + Pydantic v2 + SQLAlchemy 2.0 + Alembic — auth-service, user-service, notification-service
- **Services (Node.js):** Express 4 + TypeScript 5.4 + Prisma 5 — gateway (API gateway + routing laag)
- **Databases:** PostgreSQL 16 — één database per service (strikte DB isolatie)
- **Cache + pub/sub:** Redis 7 (cache met keyspace per service, pub/sub voor lightweight events)
- **Async messaging:** RabbitMQ 3.13 met AMQP 0-9-1 (durable queues, dead-letter exchanges)
- **Reverse proxy:** Traefik v3 (dynamische routing, TLS-afsluitende, per-service middleware)
- **Observability:** Prometheus 2.51 + Grafana 10.4 (metrische gegevens); Jaeger 1.57 (trace backend)
- **Tracing:** OpenTelemetry SDK (Python: opentelemetry-sdk 1.24; Node.js: @opentelemetry/sdk-node 0.51)
- **CI:** GitHub Actions — per-service pipelines met matrix build, Docker push, Helm lint
- **Deployment:** Helm 3.14 charts per service, deployed naar Kubernetes (EKS of GKE)
- **Service-naar-service authenticatie:** Interne JWT ondertekend met gedeeld geheim (RS256 keypair, geroteerd via Kubernetes secret)
- **Lokale orchestratie:** Docker Compose v2 met profiles (core, observability, messaging)

## Mappenstructuur

```
microservices/
├── services/
│   ├── auth-service/                        # FastAPI — geeft JWTs uit en valideert deze, beheert sessies
│   │   ├── app/
│   │   │   ├── main.py                      # FastAPI app factory, lifespan, router registratie
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── router.py            # Mounts /auth, /token, /refresh, /revoke
│   │   │   │   │   ├── auth.py              # POST /auth/login, /auth/logout handlers
│   │   │   │   │   └── token.py             # POST /token/refresh, /token/introspect handlers
│   │   │   │   └── deps.py                  # FastAPI afhankelijkheden: get_db, get_redis, require_internal
│   │   │   ├── core/
│   │   │   │   ├── config.py                # Instellingen via pydantic-settings (leest .env)
│   │   │   │   ├── jwt.py                   # RS256 sign/verify, claims schema, expiry logica
│   │   │   │   ├── security.py              # Argon2 wachtwoord hashing, timing-safe compare
│   │   │   │   └── telemetry.py             # OpenTelemetry SDK init, OTLP exporter config
│   │   │   ├── models/
│   │   │   │   ├── user.py                  # SQLAlchemy User, Session, RefreshToken ORM models
│   │   │   │   └── base.py                  # DeclarativeBase, UUID pk mixin, timestamps mixin
│   │   │   ├── schemas/
│   │   │   │   ├── auth.py                  # Pydantic: LoginRequest, TokenResponse, IntrospectResponse
│   │   │   │   └── token.py                 # Pydantic: RefreshRequest, InternalClaims
│   │   │   ├── services/
│   │   │   │   ├── auth_service.py          # Login/logout bedrijfslogica
│   │   │   │   └── token_service.py         # Token uitgifte, refresh, herroeping
│   │   │   └── db/
│   │   │       └── session.py               # Async SQLAlchemy engine + session factory
│   │   ├── alembic/
│   │   │   ├── env.py                       # Alembic env met app models metadata
│   │   │   ├── alembic.ini                  # DB URL gelezen van AUTH_DATABASE_URL env var
│   │   │   └── versions/                    # Migratiescripts (auto-gegenereerd + handmatig bewerkt)
│   │   │       └── 0001_initial_schema.py   # Users, sessions, refresh_tokens tabellen
│   │   ├── tests/
│   │   │   ├── conftest.py                  # pytest fixtures: test DB, async client, mock Redis
│   │   │   ├── test_auth.py                 # Integratie: login, logout, fout wachtwoord
│   │   │   └── test_token.py                # Unit: JWT sign/verify, expiry, herroeping
│   │   ├── Dockerfile                       # Multi-stage: builder (deps) + runtime (slim)
│   │   ├── pyproject.toml                   # Poetry deps: fastapi, sqlalchemy, alembic, pydantic-settings
│   │   └── .env.example                     # AUTH_DATABASE_URL, REDIS_URL, JWT_PRIVATE_KEY_PATH
│   │
│   ├── user-service/                        # FastAPI — gebruikersprofielen, voorkeuren, accountbeheer
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/v1/
│   │   │   │   ├── router.py                # Mounts /users, /profiles
│   │   │   │   ├── users.py                 # CRUD handlers — GET/PATCH /users/{id}
│   │   │   │   └── deps.py                  # require_internal: valideert ingebouwde service JWT
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
│   ├── notification-service/                # FastAPI — e-mail/SMS/push via RabbitMQ consumer
│   │   ├── app/
│   │   │   ├── main.py                      # Start AMQP consumer loop + FastAPI health endpoint
│   │   │   ├── consumers/
│   │   │   │   ├── user_events.py           # Luistert naar user.created, user.updated queues
│   │   │   │   └── notification_events.py   # Luistert naar notification.send queue
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── amqp.py                  # aio_pika connection pool, consumer setup, DLX config
│   │   │   │   ├── email.py                 # SendGrid API client wrapper
│   │   │   │   └── telemetry.py
│   │   │   ├── schemas/events.py            # Pydantic: UserCreatedEvent, NotificationSendEvent
│   │   │   └── services/
│   │   │       └── notification_service.py  # Route events → channel (e-mail/SMS/push)
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
│       │   │   └── health.ts               # GET /health, GET /ready — geaggregeerde service health
│       │   ├── middleware/
│       │   │   ├── authenticate.ts          # Verifiëert ingebouwde user JWT, voegt claims toe aan req
│       │   │   ├── inject-service-token.ts  # Ondertekent en injecteert interne service JWT op proxied requests
│       │   │   ├── rate-limit.ts            # Redis-gebackede rate limiting via rate-limiter-flexible
│       │   │   └── request-id.ts            # Genereert/propageert X-Request-ID header
│       │   ├── lib/
│       │   │   ├── proxy.ts                 # http-proxy-middleware factory met retry + circuit breaker
│       │   │   ├── jwt.ts                   # RS256 verify (public key), interne JWT sign (private key)
│       │   │   └── telemetry.ts             # OpenTelemetry SDK init voor Node.js
│       │   └── config.ts                    # Getypeerde config van env via zod
│       ├── tests/
│       │   ├── middleware.test.ts            # Jest: authenticate, inject-service-token unit tests
│       │   └── routes.test.ts               # Supertest: proxy routing integratie tests
│       ├── Dockerfile
│       ├── tsconfig.json                    # strict: true, target: ES2022, moduleResolution: bundler
│       ├── package.json
│       └── .env.example                     # AUTH_SERVICE_URL, USER_SERVICE_URL, JWT_PUBLIC_KEY_PATH
│
├── infrastructure/
│   ├── docker-compose.yml                   # Core services: gateway, auth, user, notification + DBs
│   ├── docker-compose.observability.yml     # Profile: prometheus, grafana, jaeger, otel-collector
│   ├── docker-compose.messaging.yml         # Profile: rabbitmq + management UI
│   ├── docker-compose.prod.yml              # Production overrides: geen volume mounts, resource limits
│   ├── traefik/
│   │   ├── traefik.yml                      # Statische config: entrypoints (80, 443, 8080 dashboard)
│   │   └── dynamic/
│   │       ├── services.yml                 # Router rules: Host + PathPrefix per service
│   │       └── middlewares.yml              # stripPrefix, headers, rateLimit middleware definitions
│   ├── prometheus/
│   │   ├── prometheus.yml                   # Scrape configs: alle services op /metrics, 15s interval
│   │   └── rules/
│   │       ├── service-alerts.yml           # Alerts: hoog foutpercentage, p99 latency, queue depth
│   │       └── infra-alerts.yml             # Alerts: DB connection pool saturatie, Redis memory
│   ├── grafana/
│   │   ├── provisioning/
│   │   │   ├── datasources/prometheus.yml   # Auto-provisioned Prometheus datasource
│   │   │   └── dashboards/dashboards.yml    # Dashboard provider config (file-based)
│   │   └── dashboards/
│   │       ├── services-overview.json       # Per-service RPS, foutpercentage, p50/p99 latency
│   │       ├── rabbitmq.json                # Queue depth, bericht rate, consumer count
│   │       └── postgres.json                # Connection pool, query duration, replication lag
│   └── otel-collector/
│       └── otel-collector.yml               # Ontvangt OTLP (gRPC 4317), exporteert naar Jaeger + Prometheus
│
├── helm/
│   ├── auth-service/                        # Helm chart — reflectiveert service structuur voor alle services
│   │   ├── Chart.yaml                       # chart naam, version, appVersion
│   │   ├── values.yaml                      # Default: replicas, image, resources, env, ingress
│   │   ├── values.staging.yaml              # Staging overrides: replicas=1, image tag van CI
│   │   ├── values.prod.yaml                 # Prod overrides: replicas=3, PodDisruptionBudget
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       ├── hpa.yaml                     # HorizontalPodAutoscaler (CPU + custom metrics)
│   │       ├── configmap.yaml
│   │       └── secret.yaml                  # External Secrets Operator annotation voor sealed secrets
│   ├── user-service/
│   ├── notification-service/
│   └── gateway/
│
├── scripts/
│   ├── dev-up.sh                            # docker compose --profile core up -d; voert DB seed uit
│   ├── dev-down.sh                          # docker compose down -v (wist volumes)
│   ├── migrate.sh                           # Voert alembic upgrade head uit in running container
│   ├── seed.sh                              # Voegt fixture data in alle service DBs voor lokale dev
│   ├── generate-keys.sh                     # Genereert RS256 keypair, schrijft naar .keys/ (gitignored)
│   ├── deploy.sh                            # Wraps helm upgrade --install met correct values file
│   └── health-check.sh                      # Polls alle /health endpoints tot ready of timeout
│
├── .github/
│   └── workflows/
│       ├── auth-service.yml                 # Trigger: paths: services/auth-service/** — lint, test, build, push
│       ├── user-service.yml                 # Trigger: paths: services/user-service/**
│       ├── notification-service.yml         # Trigger: paths: services/notification-service/**
│       ├── gateway.yml                      # Trigger: paths: services/gateway/**
│       ├── helm-lint.yml                    # Trigger: paths: helm/** — helm lint + kubeval
│       └── integration-tests.yml            # Trigger: manual + schedule — volledige stack smoke tests
│
├── .keys/                                   # Gitignored — RS256 keypair voor lokale dev only
│   ├── private.pem
│   └── public.pem
│
├── .env                                     # Gitignored — werkelijke lokale dev secrets
├── .env.example                             # Alle vereiste vars over alle services, gedocumenteerd
└── CLAUDE.md                                # Instructies voor Claude Code working in this repo
```

## Sleutelbestanden uitgelegd

| Pad | Doel |
|---|---|
| `infrastructure/docker-compose.yml` | Definieert alle core services met health checks, benoemde networks (`services-net`), en per-service DB containers. Gebruik `--profile` vlaggen om observability of messaging stacks toe te voegen zonder ze standaard uit te voeren. |
| `services/gateway/src/middleware/inject-service-token.ts` | Ondertekent een interne RS256 JWT (korte TTL: 30s) en voegt het toe als `X-Internal-Token` voordat proxied wordt. Downstream services valideren dit token in `deps.py` `require_internal` dependency om requests te weigeren die niet door de gateway zijn gegaan. |
| `services/auth-service/app/core/jwt.py` | Eenmalige bron waarheid voor JWT signing (RS256 private key) en verificatie (RS256 public key). Zowel de auth-service als gateway importeren equivalente logica — dit bestand is de Python referentie. Zorg ervoor dat claim schema (`sub`, `iat`, `exp`, `jti`, `service`) gesynchroniseerd blijft met gateway's `lib/jwt.ts`. |
| `infrastructure/traefik/dynamic/services.yml` | Wijst openbare hostnamen en path prefixes toe aan Docker service namen. Bij het toevoegen van een nieuwe service, registreer je router en service hier voordat je verwacht dat verkeer er door Traefik naartoe wordt gerouteerd. |
| `infrastructure/otel-collector/otel-collector.yml` | Centrale OTLP ontvanger. Alle services exporteren traces hier via gRPC op poort 4317. De collector verspreidt naar Jaeger (traces) en Prometheus (metrische gegevens via spanmetrics connector). Wijzig exporter config niet zonder coördinatie met alle service teams. |
| `scripts/migrate.sh` | Voert `alembic upgrade head` uit in de al-runnen service container. Voer dit altijd uit na het pullen van nieuwe migraties; pas nooit rechtstreeks toe op de production DB URL zonder een onderhoudstijd. |
| `.github/workflows/auth-service.yml` | Per-service pipeline: voert pytest uit met `--cov`, bouwt Docker image getagd met `sha-${{ github.sha }}`, pusht naar ECR, voert `helm lint` uit, en deployt optioneel naar staging op merge naar main. |
| `helm/auth-service/values.prod.yaml` | Production-specifieke overrides: 3 replicas, resource limits (`cpu: 500m, memory: 512Mi`), PodDisruptionBudget minAvailable=2, en External Secrets Operator annotation voor DB credentials van AWS Secrets Manager. |

## Snelle scaffold

```bash
# Maak de volledige microservices mappenstructuur van nul
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

# Genereer lokale RS256 keypair voor service-naar-service auth
bash "$BASE/scripts/generate-keys.sh" 2>/dev/null || \
  openssl genrsa -out "$BASE/.keys/private.pem" 2048 && \
  openssl rsa -in "$BASE/.keys/private.pem" -pubout -out "$BASE/.keys/public.pem"

echo "Microservices scaffold aangemaakt op $BASE"

# Installeer relevante skills
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

Dit repo bevat vier services (auth-service, user-service, notification-service, gateway),
gedeelde infrastructuur (Docker Compose, Traefik, Prometheus, Grafana, RabbitMQ), en Helm
charts voor Kubernetes deployment. Wijzigingen aan elke service zijn geïsoleerd — elk heeft zijn eigen
database, CI pipeline, en Dockerfile.

## Stack

- auth-service: FastAPI 0.111, PostgreSQL 16 (auth_db), Redis 7, Alembic migrations
- user-service: FastAPI 0.111, PostgreSQL 16 (user_db), RabbitMQ publisher, Alembic migrations
- notification-service: FastAPI 0.111, aio_pika RabbitMQ consumer, SendGrid
- gateway: Express 4, TypeScript 5.4, http-proxy-middleware, RS256 JWT validation
- Reverse proxy: Traefik v3 — al het openbare verkeer routeert erdoorheen; geen service exposeert poorten direct
- Observability: Prometheus + Grafana + Jaeger via OpenTelemetry (OTLP gRPC poort 4317)
- Async messaging: RabbitMQ durable queues met dead-letter exchanges op alle consumer queues
- Deployment: Helm 3.14 charts per service; values.staging.yaml en values.prod.yaml per env

## De volledige stack lokaal uitvoeren

```bash
# Start core services (alle vier services + per-service DBs + Redis + Traefik)
./scripts/dev-up.sh

# Start met observability stack (voegt Prometheus, Grafana, Jaeger, OTEL collector toe)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.observability.yml up -d

# Start met messaging (voegt RabbitMQ + management UI toe op http://localhost:15672)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.messaging.yml up -d

# Controleer dat alle services gezond zijn
./scripts/health-check.sh

# Tear down (verwijdert volumes — reset alle DBs)
./scripts/dev-down.sh
```

Services zijn toegankelijk via Traefik op http://localhost:80:
- POST http://localhost/api/v1/auth/login
- GET  http://localhost/api/v1/users/{id}
- GET  http://localhost/health

## Een nieuwe service toevoegen

1. Kopieer services/auth-service/ als template: cp -r services/auth-service services/my-service
2. Update services/my-service/app/core/config.py met de nieuwe service's env vars
3. Voeg een nieuwe DB container toe aan infrastructure/docker-compose.yml (my_service_db: postgres:16)
4. Registreer de service in infrastructure/docker-compose.yml onder services:
   - Bouw van services/my-service/Dockerfile
   - Verbind met services-net, depends_on de DB
5. Voeg routing rules toe aan infrastructure/traefik/dynamic/services.yml
6. Maak een Helm chart: cp -r helm/auth-service helm/my-service; update Chart.yaml + values.yaml
7. Maak een GitHub Actions workflow: cp .github/workflows/auth-service.yml .github/workflows/my-service.yml
   - Update `paths:` filter naar services/my-service/**
8. Voeg .env.example entries toe voor de nieuwe service's vereiste env vars
9. Voer ./scripts/generate-keys.sh uit als de service interne JWTs moet verstrekken
10. Schrijf de alembic initial migration en voer uit: ./scripts/migrate.sh my-service

## Inter-service communicatie

### Synchroon (REST via gateway)

Alle sync calls van clients gaan door de gateway. De gateway:
1. Verifiëert de JWT van de gebruiker (RS256 public key van .keys/public.pem)
2. Ondertekent een interne service JWT (RS256 private key, TTL 30s, claims: {sub: "gateway", service: "gateway"})
3. Voegt het toe als X-Internal-Token header voordat proxied wordt

Downstream services valideren X-Internal-Token in hun `require_internal` FastAPI dependency.
Directe service-naar-service REST calls (niet via gateway) moeten ook een ondertekende interne JWT gebruiken.

### Asynchroon (RabbitMQ)

Exchanges volgen het patroon: {service}.events (b.v., user.events, auth.events).
Routing keys volgen: {service}.{entity}.{action} (b.v., user.account.created).

Publiceren (user-service voorbeeld):
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

Consumeren (notification-service voorbeeld):
- Declareer queue met x-dead-letter-exchange verwijzend naar {service}.events.dlx
- Ack altijd na succesvolle verwerking; nack (requeue=False) op onherstelbare fouten
- Idempotent consumers only — berichten kunnen na een crash opnieuw worden bezorgd

## Migraties uitvoeren

```bash
# Voer ausstanding migraties uit voor een specifieke service
./scripts/migrate.sh auth-service     # voert alembic upgrade head uit in de container
./scripts/migrate.sh user-service

# Genereer een nieuwe migratie (na het wijzigen van SQLAlchemy models)
docker exec auth-service alembic revision --autogenerate -m "add_refresh_token_table"

# Inspecteer huidige migratie state
docker exec auth-service alembic current
docker exec auth-service alembic history --verbose
```

Migratieregels:
- Elke migratie moet achterwaarts compatibel zijn — de oude service versie moet er nog tegen draaien
- Verwijder nooit DROP COLUMN in dezelfde PR die de kolom uit het ORM model verwijdert
- Voor grote tabellen (>1M rijen): gebruik CREATE INDEX CONCURRENTLY, nooit plain CREATE INDEX
- Voeg altijd een rollback SQL comment toe aan de top van elk migration version bestand

## Service-naar-service authenticatie

De RS256 keypair in .keys/ wordt gebruikt voor alle interne JWT signing:
- private.pem: gateway en elke service die interne tokens geeft ondertekent hier mee
- public.pem: alle downstream services verifiëren hiermee

Voor lokale dev wordt .keys/ volume-gemount in alle containers.
Voor staging/prod wordt de keypair opgeslagen in AWS Secrets Manager en geïnjecteerd via Kubernetes secrets.

Om de keypair te roteren:
1. Genereer een nieuw paar: ./scripts/generate-keys.sh
2. Deploy eerst de nieuwe public key naar alle services (zij accepteren beide oud en nieuw tijdens rotatie window)
3. Deploy de nieuwe private key naar de gateway/issuers
4. Verwijder de oude public key van verifiers nadat alle in-flight tokens zijn verlopen (max TTL: 30s)

## Observability

- Metrische gegevens: alle services exponen GET /metrics (Prometheus scrape); zie infrastructure/prometheus/prometheus.yml
- Traces: alle services exporteren OTLP gRPC naar otel-collector:4317; bekijk traces in Jaeger op http://localhost:16686
- Dashboards: Grafana op http://localhost:3000 (admin/admin lokaal); dashboards auto-provisioned van infrastructure/grafana/dashboards/
- Alerts: gedefinieerd in infrastructure/prometheus/rules/; vuurt naar PagerDuty in prod

## CI pipelines

Elke service heeft zijn eigen workflow bestand in .github/workflows/:
- Geactiveerd door path filter: wijzigingen naar services/{name}/** of helm/{name}/**
- Stappen: checkout → zet language op (Python 3.12 / Node 20) → lint → test → build Docker → push naar ECR → helm lint
- On merge naar main: voegt een deploy-to-staging stap toe (helm upgrade --install met values.staging.yaml)
- Image tags: sha-${{ github.sha }} — gebruik nooit `latest` als deployment tag

## Conventies

- DB naming: {service_name}_db (b.v., auth_db, user_db) — deel nooit een DB tussen services
- Queue naming: {service}.{entity}.{action} — voeg altijd alle drie segmenten toe
- Interne JWT claims: voeg altijd {sub, iat, exp, jti, service} toe — verwijder nooit jti (voor replay prevention)
- Env vars: ALL_CAPS_SNAKE_CASE; voeg altijd toe aan .env.example met een description comment
- Poorten (lokale dev): gateway=8000, auth-service=8001, user-service=8002, notification-service=8003
- Traefik dashboard: http://localhost:8080 (lokaal only, expose nooit in prod)
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

## Aanbevolen hooks

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

## Gerelateerd

- [DevOps & Infrastructure Guide](../guides/for-devops-sre.md)
- [Docker Compose Local Dev Workflow](../workflows/docker-compose-local-dev.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
