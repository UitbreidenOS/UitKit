# Microservices-Architektur — Projektstruktur

> Für Backend-Ingenieure und DevOps-Teams, die eine Docker-Compose-basierte Microservices-Plattform lokal und in der Staging-Umgebung betreiben und den täglichen Zyklus aus dem Hinzufügen von Services, der Konfiguration der Inter-Service-Kommunikation, dem Ausführen von Migrationen und dem Ausrollen von Service-spezifischen CI-Pipelines zu Kubernetes optimieren.

## Stack

- **Services (Python):** FastAPI 0.111 + Pydantic v2 + SQLAlchemy 2.0 + Alembic — auth-service, user-service, notification-service
- **Services (Node.js):** Express 4 + TypeScript 5.4 + Prisma 5 — gateway (API Gateway + Routing-Schicht)
- **Datenbanken:** PostgreSQL 16 — eine Datenbank pro Service (strikte DB-Isolation)
- **Cache + pub/sub:** Redis 7 (Cache mit Keyspace pro Service, pub/sub für leichte Events)
- **Asynchrones Messaging:** RabbitMQ 3.13 mit AMQP 0-9-1 (dauerhafte Warteschlangen, Dead-Letter-Exchanges)
- **Reverse Proxy:** Traefik v3 (dynamisches Routing, TLS-Terminierung, Service-spezifische Middleware)
- **Observability:** Prometheus 2.51 + Grafana 10.4 (Metriken); Jaeger 1.57 (Trace-Backend)
- **Tracing:** OpenTelemetry SDK (Python: opentelemetry-sdk 1.24; Node.js: @opentelemetry/sdk-node 0.51)
- **CI:** GitHub Actions — Service-spezifische Pipelines mit Matrix-Build, Docker-Push, Helm-Lint
- **Deployment:** Helm 3.14 Charts pro Service, bereitgestellt auf Kubernetes (EKS oder GKE)
- **Service-zu-Service-Authentifizierung:** Interner JWT signiert mit gemeinsamen Schlüssel (RS256 Keypair, rotiert über Kubernetes Secrets)
- **Lokale Orchestrierung:** Docker Compose v2 mit Profilen (core, observability, messaging)

## Verzeichnisbaum

```
microservices/
├── services/
│   ├── auth-service/                        # FastAPI — gibt JWTs aus und validiert sie, verwaltet Sessions
│   │   ├── app/
│   │   │   ├── main.py                      # FastAPI App Factory, Lifespan, Router-Registrierung
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── router.py            # Mounted /auth, /token, /refresh, /revoke
│   │   │   │   │   ├── auth.py              # POST /auth/login, /auth/logout Handler
│   │   │   │   │   └── token.py             # POST /token/refresh, /token/introspect Handler
│   │   │   │   └── deps.py                  # FastAPI Abhängigkeiten: get_db, get_redis, require_internal
│   │   │   ├── core/
│   │   │   │   ├── config.py                # Einstellungen über pydantic-settings (liest .env)
│   │   │   │   ├── jwt.py                   # RS256 Sign/Verify, Claims-Schema, Ablauf-Logik
│   │   │   │   ├── security.py              # Argon2 Password Hashing, Timing-safe Compare
│   │   │   │   └── telemetry.py             # OpenTelemetry SDK Init, OTLP Exporter Config
│   │   │   ├── models/
│   │   │   │   ├── user.py                  # SQLAlchemy User, Session, RefreshToken ORM Modelle
│   │   │   │   └── base.py                  # DeclarativeBase, UUID pk Mixin, Timestamps Mixin
│   │   │   ├── schemas/
│   │   │   │   ├── auth.py                  # Pydantic: LoginRequest, TokenResponse, IntrospectResponse
│   │   │   │   └── token.py                 # Pydantic: RefreshRequest, InternalClaims
│   │   │   ├── services/
│   │   │   │   ├── auth_service.py          # Login/Logout Geschäftslogik
│   │   │   │   └── token_service.py         # Token-Ausstellung, Refresh, Revocation
│   │   │   └── db/
│   │   │       └── session.py               # Async SQLAlchemy Engine + Session Factory
│   │   ├── alembic/
│   │   │   ├── env.py                       # Alembic Env mit App-Modellen Metadata
│   │   │   ├── alembic.ini                  # DB URL aus AUTH_DATABASE_URL Env Var
│   │   │   └── versions/                    # Migration Scripts (Auto-generiert + Hand-editiert)
│   │   │       └── 0001_initial_schema.py   # Users, Sessions, Refresh_tokens Tabellen
│   │   ├── tests/
│   │   │   ├── conftest.py                  # pytest Fixtures: Test DB, Async Client, Mock Redis
│   │   │   ├── test_auth.py                 # Integration: Login, Logout, Falsches Passwort
│   │   │   └── test_token.py                # Unit: JWT Sign/Verify, Ablauf, Revocation
│   │   ├── Dockerfile                       # Multi-stage: Builder (Deps) + Runtime (Slim)
│   │   ├── pyproject.toml                   # Poetry Deps: fastapi, sqlalchemy, alembic, pydantic-settings
│   │   └── .env.example                     # AUTH_DATABASE_URL, REDIS_URL, JWT_PRIVATE_KEY_PATH
│   │
│   ├── user-service/                        # FastAPI — Benutzerprofile, Einstellungen, Kontoverwaltung
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/v1/
│   │   │   │   ├── router.py                # Mounted /users, /profiles
│   │   │   │   ├── users.py                 # CRUD Handler — GET/PATCH /users/{id}
│   │   │   │   └── deps.py                  # require_internal: validiert eingehenden Service JWT
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── messaging.py             # RabbitMQ Publisher: user.created, user.updated Events
│   │   │   │   └── telemetry.py
│   │   │   ├── models/user.py               # SQLAlchemy User, Profile ORM Modelle
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
│   ├── notification-service/                # FastAPI — Email/SMS/Push über RabbitMQ Consumer
│   │   ├── app/
│   │   │   ├── main.py                      # Startet AMQP Consumer Loop + FastAPI Health Endpoint
│   │   │   ├── consumers/
│   │   │   │   ├── user_events.py           # Hört auf user.created, user.updated Warteschlangen
│   │   │   │   └── notification_events.py   # Hört auf notification.send Warteschlange
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── amqp.py                  # aio_pika Verbindungspooling, Consumer Setup, DLX Config
│   │   │   │   ├── email.py                 # SendGrid API Client Wrapper
│   │   │   │   └── telemetry.py
│   │   │   ├── schemas/events.py            # Pydantic: UserCreatedEvent, NotificationSendEvent
│   │   │   └── services/
│   │   │       └── notification_service.py  # Route Events → Channel (Email/SMS/Push)
│   │   ├── tests/
│   │   │   ├── conftest.py
│   │   │   └── test_consumers.py
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── .env.example                     # RABBITMQ_URL, SENDGRID_API_KEY
│   │
│   └── gateway/                             # Node.js + TypeScript — API Gateway, Auth Middleware, Routing
│       ├── src/
│       │   ├── index.ts                     # Express App Factory, Graceful Shutdown
│       │   ├── routes/
│       │   │   ├── auth.ts                  # Proxy: /api/v1/auth → auth-service:8001
│       │   │   ├── users.ts                 # Proxy: /api/v1/users → user-service:8002
│       │   │   └── health.ts               # GET /health, GET /ready — Aggregierte Service Health
│       │   ├── middleware/
│       │   │   ├── authenticate.ts          # Verifiziert eingehenden Benutzer JWT, Anhängen von Claims an Request
│       │   │   ├── inject-service-token.ts  # Signiert und injiziert internen Service JWT auf Proxy-Anfragen
│       │   │   ├── rate-limit.ts            # Redis-gestützte Rate-Limitierung über rate-limiter-flexible
│       │   │   └── request-id.ts            # Generiert/Propagiert X-Request-ID Header
│       │   ├── lib/
│       │   │   ├── proxy.ts                 # http-proxy-middleware Factory mit Retry + Circuit Breaker
│       │   │   ├── jwt.ts                   # RS256 Verify (Public Key), Interner JWT Sign (Private Key)
│       │   │   └── telemetry.ts             # OpenTelemetry SDK Init für Node.js
│       │   └── config.ts                    # Typed Config aus Env via Zod
│       ├── tests/
│       │   ├── middleware.test.ts            # Jest: Authenticate, Inject-Service-Token Unit Tests
│       │   └── routes.test.ts               # Supertest: Proxy Routing Integration Tests
│       ├── Dockerfile
│       ├── tsconfig.json                    # strict: true, target: ES2022, moduleResolution: bundler
│       ├── package.json
│       └── .env.example                     # AUTH_SERVICE_URL, USER_SERVICE_URL, JWT_PUBLIC_KEY_PATH
│
├── infrastructure/
│   ├── docker-compose.yml                   # Core Services: Gateway, Auth, User, Notification + DBs
│   ├── docker-compose.observability.yml     # Profil: Prometheus, Grafana, Jaeger, OTEL-Collector
│   ├── docker-compose.messaging.yml         # Profil: RabbitMQ + Management UI
│   ├── docker-compose.prod.yml              # Produktions-Overrides: Keine Volume-Mounts, Resource-Limits
│   ├── traefik/
│   │   ├── traefik.yml                      # Statische Config: Entrypoints (80, 443, 8080 Dashboard)
│   │   └── dynamic/
│   │       ├── services.yml                 # Router-Regeln: Host + PathPrefix pro Service
│   │       └── middlewares.yml              # stripPrefix, Headers, RateLimit Middleware-Definitionen
│   ├── prometheus/
│   │   ├── prometheus.yml                   # Scrape Configs: Alle Services auf /metrics, 15s Intervall
│   │   └── rules/
│   │       ├── service-alerts.yml           # Alerts: Hohe Fehlerrate, p99 Latenz, Queue-Tiefe
│   │       └── infra-alerts.yml             # Alerts: DB Verbindungspool Sättigung, Redis Memory
│   ├── grafana/
│   │   ├── provisioning/
│   │   │   ├── datasources/prometheus.yml   # Auto-bereitgestellte Prometheus-Datenquelle
│   │   │   └── dashboards/dashboards.yml    # Dashboard Provider Config (Datei-basiert)
│   │   └── dashboards/
│   │       ├── services-overview.json       # Pro-Service RPS, Fehlerrate, p50/p99 Latenz
│   │       ├── rabbitmq.json                # Queue-Tiefe, Message-Rate, Consumer-Count
│   │       └── postgres.json                # Verbindungspool, Query Duration, Replikations-Lag
│   └── otel-collector/
│       └── otel-collector.yml               # Empfängt OTLP (gRPC 4317), Exportiert zu Jaeger + Prometheus
│
├── helm/
│   ├── auth-service/                        # Helm Chart — spiegelt Service-Struktur für alle Services
│   │   ├── Chart.yaml                       # Chart Name, Version, appVersion
│   │   ├── values.yaml                      # Default: Replicas, Image, Resources, Env, Ingress
│   │   ├── values.staging.yaml              # Staging-Overrides: Replicas=1, Image Tag aus CI
│   │   ├── values.prod.yaml                 # Prod-Overrides: Replicas=3, PodDisruptionBudget
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       ├── hpa.yaml                     # HorizontalPodAutoscaler (CPU + Custom Metrics)
│   │       ├── configmap.yaml
│   │       └── secret.yaml                  # External Secrets Operator Annotation für versiegelte Secrets
│   ├── user-service/
│   ├── notification-service/
│   └── gateway/
│
├── scripts/
│   ├── dev-up.sh                            # docker compose --profile core up -d; läuft DB Seed
│   ├── dev-down.sh                          # docker compose down -v (löscht Volumes)
│   ├── migrate.sh                           # Läuft alembic upgrade head innerhalb des laufenden Containers
│   ├── seed.sh                              # Fügt Fixture-Daten in alle Service DBs für lokale Entwicklung ein
│   ├── generate-keys.sh                     # Generiert RS256 Keypair, schreibt zu .keys/ (Gitignored)
│   ├── deploy.sh                            # Wraps Helm Upgrade --install mit korrekter Values-Datei
│   └── health-check.sh                      # Pollt alle /health Endpunkte bis Ready oder Timeout
│
├── .github/
│   └── workflows/
│       ├── auth-service.yml                 # Trigger: paths: services/auth-service/** — Lint, Test, Build, Push
│       ├── user-service.yml                 # Trigger: paths: services/user-service/**
│       ├── notification-service.yml         # Trigger: paths: services/notification-service/**
│       ├── gateway.yml                      # Trigger: paths: services/gateway/**
│       ├── helm-lint.yml                    # Trigger: paths: helm/** — Helm Lint + Kubeval
│       └── integration-tests.yml            # Trigger: Manuell + Zeitplan — Full Stack Smoke Tests
│
├── .keys/                                   # Gitignored — RS256 Keypair nur für lokale Entwicklung
│   ├── private.pem
│   └── public.pem
│
├── .env                                     # Gitignored — Aktuelle lokale Entwicklungs-Secrets
├── .env.example                             # Alle erforderlichen Vars über alle Services, dokumentiert
└── CLAUDE.md                                # Anweisungen für Claude Code in diesem Repo
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `infrastructure/docker-compose.yml` | Definiert alle Core Services mit Health Checks, benannten Netzwerken (`services-net`), und Pro-Service DB Containern. Nutze `--profile` Flags, um Observability oder Messaging Stacks hinzuzufügen, ohne sie standardmäßig zu laufen. |
| `services/gateway/src/middleware/inject-service-token.ts` | Signiert einen internen RS256 JWT (kurze TTL: 30s) und hängt ihn als `X-Internal-Token` an, bevor Proxying erfolgt. Downstream Services validieren diesen Token in der `deps.py` `require_internal` Abhängigkeit, um Anfragen abzulehnen, die nicht durch das Gateway gekommen sind. |
| `services/auth-service/app/core/jwt.py` | Single Source of Truth für JWT Signierung (RS256 Private Key) und Verifikation (RS256 Public Key). Sowohl Auth-Service als auch Gateway importieren äquivalente Logik — diese Datei ist die Python Referenz. Behalte Claims-Schema (`sub`, `iat`, `exp`, `jti`, `service`) mit `lib/jwt.ts` des Gateways synchronisiert. |
| `infrastructure/traefik/dynamic/services.yml` | Mapped öffentliche Hostnamen und Path-Präfixe auf Docker Service-Namen. Wenn ein neuer Service hinzugefügt wird, registriere seinen Router und Service hier, bevor du erwartest, dass Traffic es durch Traefik erreicht. |
| `infrastructure/otel-collector/otel-collector.yml` | Zentraler OTLP Empfänger. Alle Services exportieren Traces hier via gRPC auf Port 4317. Der Collector verteilt auf Jaeger (Traces) und Prometheus (Metriken via Spanmetrics Connector). Ändere keine Exporter-Config ohne Koordination mit allen Service-Teams. |
| `scripts/migrate.sh` | Läuft `alembic upgrade head` innerhalb des bereits laufenden Service Containers. Führe dies immer aus, nachdem neue Migrationen gepullt wurden; wende diese nie direkt auf die Produktions-DB URL an, ohne ein Wartungsfenster. |
| `.github/workflows/auth-service.yml` | Pro-Service Pipeline: Läuft pytest mit `--cov`, baut Docker Image mit Tag `sha-${{ github.sha }}`, pushed zu ECR, läuft `helm lint`, und optionaler Deploy zu Staging bei Merge zu Main. |
| `helm/auth-service/values.prod.yaml` | Produktions-spezifische Overrides: 3 Replicas, Resource Limits (`cpu: 500m, memory: 512Mi`), PodDisruptionBudget minAvailable=2, und External Secrets Operator Annotation für DB Credentials aus AWS Secrets Manager. |

## Quick Scaffold

```bash
# Erstelle die vollständige Microservices-Verzeichnisstruktur von Grund auf
BASE="$HOME/projects/microservices"
mkdir -p "$BASE"

# Service-Verzeichnisse (Python FastAPI Services)
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

# Helm Charts
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

# Root-Dateien
mkdir -p "$BASE/.keys"
echo ".keys/\n.env" > "$BASE/.gitignore"
touch "$BASE/.env.example"
touch "$BASE/CLAUDE.md"

# Generiere lokales RS256 Keypair für Service-zu-Service-Authentifizierung
bash "$BASE/scripts/generate-keys.sh" 2>/dev/null || \
  openssl genrsa -out "$BASE/.keys/private.pem" 2048 && \
  openssl rsa -in "$BASE/.keys/private.pem" -pubout -out "$BASE/.keys/public.pem"

echo "Microservices Scaffold erstellt unter $BASE"

# Installiere relevante Skills
npx claudient add skill devops-infra/docker-compose-local-dev
npx claudient add skill devops-infra/k8s-deployment
npx claudient add skill devops-infra/helm-chart
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill backend/fastapi-crud
npx claudient add skill backend/alembic-migration
npx claudient add skill backend/rabbitmq-consumer
npx claudient add skill devops-infra/capacity-planner
```

## CLAUDE.md Template

```markdown
# Microservices-Plattform — CLAUDE.md

Dieses Repo enthält vier Services (Auth-Service, User-Service, Notification-Service, Gateway),
geteilte Infrastruktur (Docker Compose, Traefik, Prometheus, Grafana, RabbitMQ) und Helm
Charts für Kubernetes-Deployment. Änderungen an jedem Service sind isoliert — jeder hat seine eigene
Datenbank, CI-Pipeline und Dockerfile.

## Stack

- auth-service: FastAPI 0.111, PostgreSQL 16 (auth_db), Redis 7, Alembic Migrationen
- user-service: FastAPI 0.111, PostgreSQL 16 (user_db), RabbitMQ Publisher, Alembic Migrationen
- notification-service: FastAPI 0.111, aio_pika RabbitMQ Consumer, SendGrid
- gateway: Express 4, TypeScript 5.4, http-proxy-middleware, RS256 JWT Validierung
- Reverse Proxy: Traefik v3 — all öffentlicher Traffic routed durch it; Kein Service exponiert Ports direkt
- Observability: Prometheus + Grafana + Jaeger via OpenTelemetry (OTLP gRPC Port 4317)
- Asynchrones Messaging: RabbitMQ dauerhafte Warteschlangen mit Dead-Letter-Exchanges auf allen Consumer-Warteschlangen
- Deployment: Helm 3.14 Charts pro Service; Values.staging.yaml und values.prod.yaml pro Env

## Vollständigen Stack lokal ausführen

```bash
# Starten Core Services (alle vier Services + Pro-Service DBs + Redis + Traefik)
./scripts/dev-up.sh

# Starten mit Observability Stack (fügt Prometheus, Grafana, Jaeger, OTEL Collector hinzu)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.observability.yml up -d

# Starten mit Messaging (fügt RabbitMQ + Management UI unter http://localhost:15672 hinzu)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.messaging.yml up -d

# Überprüfe, dass alle Services gesund sind
./scripts/health-check.sh

# Herrunterfahren (entfernt Volumes — setzt alle DBs zurück)
./scripts/dev-down.sh
```

Services sind zugänglich via Traefik unter http://localhost:80:
- POST http://localhost/api/v1/auth/login
- GET  http://localhost/api/v1/users/{id}
- GET  http://localhost/health

## Einen neuen Service hinzufügen

1. Kopiere services/auth-service/ als Template: cp -r services/auth-service services/my-service
2. Aktualisiere services/my-service/app/core/config.py mit den neuen Service Env Vars
3. Füge einen neuen DB Container zu infrastructure/docker-compose.yml hinzu (my_service_db: postgres:16)
4. Registriere den Service in infrastructure/docker-compose.yml unter Services:
   - Build aus services/my-service/Dockerfile
   - Verbinde zu services-net, depends_on der DB
5. Füge Routing-Regeln zu infrastructure/traefik/dynamic/services.yml hinzu
6. Erstelle einen Helm Chart: cp -r helm/auth-service helm/my-service; update Chart.yaml + values.yaml
7. Erstelle einen GitHub Actions Workflow: cp .github/workflows/auth-service.yml .github/workflows/my-service.yml
   - Aktualisiere `paths:` Filter zu services/my-service/**
8. Füge .env.example Einträge für die neuen Service erforderlichen Env Vars hinzu
9. Führe ./scripts/generate-keys.sh aus, falls der Service interne JWTs ausstellen muss
10. Schreibe die Alembic-Initialversion und führe aus: ./scripts/migrate.sh my-service

## Inter-Service-Kommunikation

### Synchron (REST via Gateway)

Alle Sync-Aufrufe von Clients laufen durch das Gateway. Das Gateway:
1. Verifiziert den Benutzer JWT (RS256 Public Key aus .keys/public.pem)
2. Signiert einen internen Service JWT (RS256 Private Key, TTL 30s, Claims: {sub: "gateway", service: "gateway"})
3. Hängt es als X-Internal-Token Header an, bevor Proxying erfolgt

Downstream Services validieren X-Internal-Token in ihrer `require_internal` FastAPI Abhängigkeit.
Direkte Service-zu-Service REST-Aufrufe (nicht via Gateway) müssen auch einen signierten internen JWT verwenden.

### Asynchron (RabbitMQ)

Exchanges folgen dem Muster: {service}.events (z.B. user.events, auth.events).
Routing Keys folgen: {service}.{entity}.{action} (z.B. user.account.created).

Publishing (user-service Beispiel):
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

Consuming (notification-service Beispiel):
- Deklariere Warteschlange mit x-dead-letter-exchange zeigend auf {service}.events.dlx
- Bestätige immer nach erfolgreicher Verarbeitung; Negativ-Bestätigung (requeue=False) bei nicht wiederherstellbaren Fehlern
- Nur Idempotente Consumer — Nachrichten können nach einem Crash erneut geliefert werden

## Migrationen ausführen

```bash
# Führe ausstehende Migrationen für einen spezifischen Service aus
./scripts/migrate.sh auth-service     # Läuft alembic upgrade head innerhalb des Containers
./scripts/migrate.sh user-service

# Generiere eine neue Migration (nach Änderung von SQLAlchemy Modellen)
docker exec auth-service alembic revision --autogenerate -m "add_refresh_token_table"

# Inspiziere aktuellen Migrations-Status
docker exec auth-service alembic current
docker exec auth-service alembic history --verbose
```

Migrations-Regeln:
- Jede Migration muss rückwärts-kompatibel sein — die alte Service Version muss gegen diese laufen
- Lösche NIE COLUMN in demselben PR, der die Column aus dem ORM-Modell entfernt
- Für große Tabellen (>1M Zeilen): Nutze CREATE INDEX CONCURRENTLY, nie plain CREATE INDEX
- Füge immer einen Rollback SQL-Kommentar oben in jeder Migrations-Versionsdatei hinzu

## Service-zu-Service-Authentifizierung

Das RS256 Keypair in .keys/ wird für alle internen JWT-Signierungen verwendet:
- private.pem: Gateway und jeder Service, der interne Tokens ausstellt, signiert damit
- public.pem: Alle downstream Services verifizieren damit

Für lokale Entwicklung wird .keys/ als Volume in alle Container eingebunden.
Für Staging/Prod wird das Keypair in AWS Secrets Manager gespeichert und via Kubernetes Secrets injiziert.

Um das Keypair zu rotieren:
1. Generiere ein neues Paar: ./scripts/generate-keys.sh
2. Deployment des neuen Public Key zu allen Services zuerst (sie akzeptieren beide alte und neue während Rotationsfenster)
3. Deployment des neuen Private Key zum Gateway/Ausstellern
4. Entferne den alten Public Key von Verifiziern, nachdem alle im Umlauf befindlichen Tokens abgelaufen sind (max TTL: 30s)

## Observability

- Metriken: Alle Services exponieren GET /metrics (Prometheus Scrape); siehe infrastructure/prometheus/prometheus.yml
- Traces: Alle Services exportieren OTLP gRPC zu otel-collector:4317; Zeige Traces in Jaeger unter http://localhost:16686
- Dashboards: Grafana unter http://localhost:3000 (admin/admin lokal); Dashboards Auto-bereitgestellt aus infrastructure/grafana/dashboards/
- Alerts: Definiert in infrastructure/prometheus/rules/; feuern zu PagerDuty in Prod

## CI Pipelines

Jeder Service hat eine eigene Workflow-Datei in .github/workflows/:
- Ausgelöst durch Path Filter: Änderungen zu services/{name}/** oder helm/{name}/**
- Schritte: Checkout → Setup Language (Python 3.12 / Node 20) → Lint → Test → Build Docker → Push zu ECR → Helm Lint
- Bei Merge zu Main: Fügt einen Deploy-zu-Staging Schritt hinzu (helm upgrade --install mit values.staging.yaml)
- Image Tags: sha-${{ github.sha }} — nutze niemals `latest` als Deployment Tag

## Konventionen

- DB Naming: {service_name}_db (z.B. auth_db, user_db) — teile niemals eine DB zwischen Services
- Queue Naming: {service}.{entity}.{action} — füge immer alle drei Segmente hinzu
- Interner JWT Claims: Immer {sub, iat, exp, jti, service} — entferne niemals jti (für Replay-Verhinderung)
- Env Vars: ALL_CAPS_SNAKE_CASE; Füge immer .env.example mit Beschreibungs-Kommentar hinzu
- Ports (lokale Entwicklung): Gateway=8000, Auth-Service=8001, User-Service=8002, Notification-Service=8003
- Traefik Dashboard: http://localhost:8080 (lokal nur, niemals in Prod exponieren)
```

## MCP Server

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

## Empfohlene Hooks

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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"alembic upgrade|migrate\\.sh\"; then echo \"[HOOK] Migration erkannt — Bestätige, dass die Ziel-Service DB läuft und ein Backup existiert, bevor fortgefahren wird.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'REPO=\"$PWD\"; if docker compose -f \"$REPO/infrastructure/docker-compose.yml\" ps --quiet 2>/dev/null | grep -q .; then echo \"[REMINDER] Docker Compose Stack läuft noch. Führe ./scripts/dev-down.sh aus, wenn fertig, um Ressourcen freizugeben.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zu installieren

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

## Verwandt

- [DevOps & Infrastructure Guide](../guides/for-devops-sre.md)
- [Docker Compose Local Dev Workflow](../workflows/docker-compose-local-dev.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
