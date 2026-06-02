# Arquitectura de Microservicios — Estructura del Proyecto

> Para ingenieros backend y equipos DevOps que ejecutan una plataforma de microservicios basada en Docker Compose localmente y en staging, optimizando el ciclo diario de agregar servicios, configurar comunicación inter-servicio, ejecutar migraciones e implementar pipelines CI por servicio en Kubernetes.

## Stack

- **Services (Python):** FastAPI 0.111 + Pydantic v2 + SQLAlchemy 2.0 + Alembic — auth-service, user-service, notification-service
- **Services (Node.js):** Express 4 + TypeScript 5.4 + Prisma 5 — gateway (puerta de enlace API + capa de enrutamiento)
- **Bases de datos:** PostgreSQL 16 — una base de datos por servicio (aislamiento estricto de BD)
- **Cache + pub/sub:** Redis 7 (caché con espacio de claves por servicio, pub/sub para eventos ligeros)
- **Mensajería asincrónica:** RabbitMQ 3.13 con AMQP 0-9-1 (colas duraderas, intercambios de letra muerta)
- **Proxy inverso:** Traefik v3 (enrutamiento dinámico, terminación TLS, middleware por servicio)
- **Observabilidad:** Prometheus 2.51 + Grafana 10.4 (métricas); Jaeger 1.57 (backend de trazas)
- **Trazas:** OpenTelemetry SDK (Python: opentelemetry-sdk 1.24; Node.js: @opentelemetry/sdk-node 0.51)
- **CI:** GitHub Actions — pipelines por servicio con matriz de compilación, push de Docker, linting de Helm
- **Implementación:** Gráficos Helm 3.14 por servicio, implementados en Kubernetes (EKS o GKE)
- **Auth servicio-a-servicio:** JWT interno firmado con secreto compartido (par de claves RS256, rotado vía secreto de Kubernetes)
- **Orquestación local:** Docker Compose v2 con perfiles (core, observability, messaging)

## Árbol de directorios

```
microservices/
├── services/
│   ├── auth-service/                        # FastAPI — emite + valida JWTs, gestiona sesiones
│   │   ├── app/
│   │   │   ├── main.py                      # Fábrica de aplicación FastAPI, ciclo de vida, registro de enrutador
│   │   │   ├── api/
│   │   │   │   ├── v1/
│   │   │   │   │   ├── router.py            # Monta /auth, /token, /refresh, /revoke
│   │   │   │   │   ├── auth.py              # Manejadores POST /auth/login, /auth/logout
│   │   │   │   │   └── token.py             # Manejadores POST /token/refresh, /token/introspect
│   │   │   │   └── deps.py                  # Dependencias FastAPI: get_db, get_redis, require_internal
│   │   │   ├── core/
│   │   │   │   ├── config.py                # Configuración vía pydantic-settings (lee .env)
│   │   │   │   ├── jwt.py                   # Firma/verificación RS256, esquema de claims, lógica de expiración
│   │   │   │   ├── security.py              # Hash de contraseña Argon2, comparación segura en tiempo
│   │   │   │   └── telemetry.py             # Inicialización SDK OpenTelemetry, configuración exportador OTLP
│   │   │   ├── models/
│   │   │   │   ├── user.py                  # Modelos ORM SQLAlchemy User, Session, RefreshToken
│   │   │   │   └── base.py                  # DeclarativeBase, mixin de pk UUID, mixin de timestamps
│   │   │   ├── schemas/
│   │   │   │   ├── auth.py                  # Pydantic: LoginRequest, TokenResponse, IntrospectResponse
│   │   │   │   └── token.py                 # Pydantic: RefreshRequest, InternalClaims
│   │   │   ├── services/
│   │   │   │   ├── auth_service.py          # Lógica de negocio de login/logout
│   │   │   │   └── token_service.py         # Emisión de tokens, renovación, revocación
│   │   │   └── db/
│   │   │       └── session.py               # Motor SQLAlchemy asincrónico + fábrica de sesiones
│   │   ├── alembic/
│   │   │   ├── env.py                       # Entorno Alembic usando metadatos de modelos de aplicación
│   │   │   ├── alembic.ini                  # URL de BD leída de variable de entorno AUTH_DATABASE_URL
│   │   │   └── versions/                    # Scripts de migración (auto-generados + editados manualmente)
│   │   │       └── 0001_initial_schema.py   # Tablas users, sessions, refresh_tokens
│   │   ├── tests/
│   │   │   ├── conftest.py                  # Fixtures pytest: BD de prueba, cliente asincrónico, Redis simulado
│   │   │   ├── test_auth.py                 # Integración: login, logout, contraseña incorrecta
│   │   │   └── test_token.py                # Unidad: firma/verificación JWT, expiración, revocación
│   │   ├── Dockerfile                       # Multi-etapa: constructor (deps) + runtime (slim)
│   │   ├── pyproject.toml                   # Dependencias Poetry: fastapi, sqlalchemy, alembic, pydantic-settings
│   │   └── .env.example                     # AUTH_DATABASE_URL, REDIS_URL, JWT_PRIVATE_KEY_PATH
│   │
│   ├── user-service/                        # FastAPI — perfiles de usuario, preferencias, gestión de cuenta
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── api/v1/
│   │   │   │   ├── router.py                # Monta /users, /profiles
│   │   │   │   ├── users.py                 # Manejadores CRUD — GET/PATCH /users/{id}
│   │   │   │   └── deps.py                  # require_internal: valida JWT de servicio entrante
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── messaging.py             # Publicador RabbitMQ: eventos user.created, user.updated
│   │   │   │   └── telemetry.py
│   │   │   ├── models/user.py               # Modelos ORM SQLAlchemy User, Profile
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
│   ├── notification-service/                # FastAPI — email/SMS/push vía consumidor RabbitMQ
│   │   ├── app/
│   │   │   ├── main.py                      # Inicia bucle consumidor AMQP + endpoint de salud FastAPI
│   │   │   ├── consumers/
│   │   │   │   ├── user_events.py           # Escucha en colas user.created, user.updated
│   │   │   │   └── notification_events.py   # Escucha en cola notification.send
│   │   │   ├── core/
│   │   │   │   ├── config.py
│   │   │   │   ├── amqp.py                  # Grupo de conexiones aio_pika, configuración consumidor, config DLX
│   │   │   │   ├── email.py                 # Envoltorio cliente API SendGrid
│   │   │   │   └── telemetry.py
│   │   │   ├── schemas/events.py            # Pydantic: UserCreatedEvent, NotificationSendEvent
│   │   │   └── services/
│   │   │       └── notification_service.py  # Enrutar eventos → canal (email/SMS/push)
│   │   ├── tests/
│   │   │   ├── conftest.py
│   │   │   └── test_consumers.py
│   │   ├── Dockerfile
│   │   ├── pyproject.toml
│   │   └── .env.example                     # RABBITMQ_URL, SENDGRID_API_KEY
│   │
│   └── gateway/                             # Node.js + TypeScript — puerta de enlace API, middleware auth, enrutamiento
│       ├── src/
│       │   ├── index.ts                     # Fábrica de aplicación Express, cierre elegante
│       │   ├── routes/
│       │   │   ├── auth.ts                  # Proxy: /api/v1/auth → auth-service:8001
│       │   │   ├── users.ts                 # Proxy: /api/v1/users → user-service:8002
│       │   │   └── health.ts               # GET /health, GET /ready — salud de servicio agregada
│       │   ├── middleware/
│       │   │   ├── authenticate.ts          # Verifica JWT de usuario entrante, adjunta claims a req
│       │   │   ├── inject-service-token.ts  # Firma e inyecta JWT de servicio interno en solicitudes proxy
│       │   │   ├── rate-limit.ts            # Limitación de velocidad respaldada por Redis vía rate-limiter-flexible
│       │   │   └── request-id.ts            # Genera/propaga encabezado X-Request-ID
│       │   ├── lib/
│       │   │   ├── proxy.ts                 # Fábrica http-proxy-middleware con reintentos + interruptor de circuito
│       │   │   ├── jwt.ts                   # Verificación RS256 (clave pública), firma JWT interno (clave privada)
│       │   │   └── telemetry.ts             # Inicialización SDK OpenTelemetry para Node.js
│       │   └── config.ts                    # Configuración tipificada de env vía zod
│       ├── tests/
│       │   ├── middleware.test.ts            # Jest: pruebas unitarias authenticate, inject-service-token
│       │   └── routes.test.ts               # Supertest: pruebas integración enrutamiento proxy
│       ├── Dockerfile
│       ├── tsconfig.json                    # strict: true, target: ES2022, moduleResolution: bundler
│       ├── package.json
│       └── .env.example                     # AUTH_SERVICE_URL, USER_SERVICE_URL, JWT_PUBLIC_KEY_PATH
│
├── infrastructure/
│   ├── docker-compose.yml                   # Servicios principales: gateway, auth, user, notification + BDs
│   ├── docker-compose.observability.yml     # Perfil: prometheus, grafana, jaeger, otel-collector
│   ├── docker-compose.messaging.yml         # Perfil: rabbitmq + UI de gestión
│   ├── docker-compose.prod.yml              # Overrides de producción: sin montajes de volumen, límites de recursos
│   ├── traefik/
│   │   ├── traefik.yml                      # Configuración estática: puntos de entrada (80, 443, dashboard 8080)
│   │   └── dynamic/
│   │       ├── services.yml                 # Reglas router: Host + PathPrefix por servicio
│   │       └── middlewares.yml              # Definiciones middleware stripPrefix, headers, rateLimit
│   ├── prometheus/
│   │   ├── prometheus.yml                   # Configuraciones scrape: todos los servicios en /metrics, intervalo 15s
│   │   └── rules/
│   │       ├── service-alerts.yml           # Alertas: tasa de error alta, latencia p99, profundidad de cola
│   │       └── infra-alerts.yml             # Alertas: saturación grupo conexiones BD, memoria Redis
│   ├── grafana/
│   │   ├── provisioning/
│   │   │   ├── datasources/prometheus.yml   # Fuente de datos Prometheus aprovisionada automáticamente
│   │   │   └── dashboards/dashboards.yml    # Configuración proveedor de dashboard (basada en archivo)
│   │   └── dashboards/
│   │       ├── services-overview.json       # RPS por servicio, tasa de error, latencia p50/p99
│   │       ├── rabbitmq.json                # Profundidad de cola, tasa de mensaje, conteo de consumidores
│   │       └── postgres.json                # Grupo de conexiones, duración de consulta, lag de replicación
│   └── otel-collector/
│       └── otel-collector.yml               # Recibe OTLP (gRPC 4317), exporta a Jaeger + Prometheus
│
├── helm/
│   ├── auth-service/                        # Gráfico Helm — refleja estructura de servicio para todos los servicios
│   │   ├── Chart.yaml                       # nombre de gráfico, versión, appVersion
│   │   ├── values.yaml                      # Por defecto: réplicas, imagen, recursos, env, ingress
│   │   ├── values.staging.yaml              # Overrides staging: réplicas=1, etiqueta imagen de CI
│   │   ├── values.prod.yaml                 # Overrides producción: réplicas=3, PodDisruptionBudget
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── ingress.yaml
│   │       ├── hpa.yaml                     # HorizontalPodAutoscaler (CPU + métricas personalizadas)
│   │       ├── configmap.yaml
│   │       └── secret.yaml                  # Anotación External Secrets Operator para secretos sellados
│   ├── user-service/
│   ├── notification-service/
│   └── gateway/
│
├── scripts/
│   ├── dev-up.sh                            # docker compose --profile core up -d; ejecuta semilla BD
│   ├── dev-down.sh                          # docker compose down -v (limpia volúmenes)
│   ├── migrate.sh                           # Ejecuta alembic upgrade head dentro del contenedor ejecutándose
│   ├── seed.sh                              # Inserta datos fixture en todas las BDs de servicio para dev local
│   ├── generate-keys.sh                     # Genera par de claves RS256, escribe en .keys/ (gitignored)
│   ├── deploy.sh                            # Envuelve helm upgrade --install con archivo de valores correcto
│   └── health-check.sh                      # Consulta todos los puntos finales /health hasta que esté listo o agote tiempo
│
├── .github/
│   └── workflows/
│       ├── auth-service.yml                 # Trigger: paths: services/auth-service/** — lint, test, build, push
│       ├── user-service.yml                 # Trigger: paths: services/user-service/**
│       ├── notification-service.yml         # Trigger: paths: services/notification-service/**
│       ├── gateway.yml                      # Trigger: paths: services/gateway/**
│       ├── helm-lint.yml                    # Trigger: paths: helm/** — helm lint + kubeval
│       └── integration-tests.yml            # Trigger: manual + programación — pruebas smoke pila completa
│
├── .keys/                                   # Gitignored — par de claves RS256 solo para dev local
│   ├── private.pem
│   └── public.pem
│
├── .env                                     # Gitignored — secretos actuales de dev local
├── .env.example                             # Todas las variables requeridas en todos los servicios, documentadas
└── CLAUDE.md                                # Instrucciones para Claude Code trabajando en este repositorio
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `infrastructure/docker-compose.yml` | Define todos los servicios principales con verificaciones de salud, redes nombradas (`services-net`), y contenedores BD por servicio. Use banderas `--profile` para agregar pilas de observabilidad o mensajería sin ejecutarlas por defecto. |
| `services/gateway/src/middleware/inject-service-token.ts` | Firma un JWT RS256 interno (TTL corto: 30s) y lo adjunta como `X-Internal-Token` antes de hacer proxy. Los servicios descendentes validan este token en la dependencia `require_internal` de `deps.py` para rechazar solicitudes que no vinieron a través de la puerta de enlace. |
| `services/auth-service/app/core/jwt.py` | Fuente única de verdad para firma JWT (clave privada RS256) y verificación (clave pública RS256). Tanto el auth-service como la puerta de enlace importan lógica equivalente — este archivo es la referencia de Python. Mantenga el esquema de claims (`sub`, `iat`, `exp`, `jti`, `service`) sincronizado con `lib/jwt.ts` de la puerta de enlace. |
| `infrastructure/traefik/dynamic/services.yml` | Mapea nombres de host públicos y prefijos de ruta a nombres de servicio Docker. Al agregar un nuevo servicio, registre su router y servicio aquí antes de esperar que el tráfico lo alcance a través de Traefik. |
| `infrastructure/otel-collector/otel-collector.yml` | Receptor OTLP central. Todos los servicios exportan trazas aquí vía gRPC en el puerto 4317. El recolector se dispersa hacia Jaeger (trazas) y Prometheus (métricas vía conector spanmetrics). No cambie la configuración del exportador sin coordinar con todos los equipos de servicio. |
| `scripts/migrate.sh` | Ejecuta `alembic upgrade head` dentro del contenedor de servicio ya ejecutándose. Siempre ejecute esto después de extraer nuevas migraciones; nunca aplique directamente contra la URL de BD de producción sin una ventana de mantenimiento. |
| `.github/workflows/auth-service.yml` | Pipeline por servicio: ejecuta pytest con `--cov`, construye imagen Docker etiquetada con `sha-${{ github.sha }}`, empuja a ECR, ejecuta `helm lint`, e implementa opcionalmente en staging en merge a main. |
| `helm/auth-service/values.prod.yaml` | Overrides específicos de producción: 3 réplicas, límites de recursos (`cpu: 500m, memory: 512Mi`), PodDisruptionBudget minAvailable=2, y anotación External Secrets Operator para credenciales BD de AWS Secrets Manager. |

## Andamiaje rápido

```bash
# Crear la estructura de directorio completa de microservicios desde cero
BASE="$HOME/projects/microservices"
mkdir -p "$BASE"

# Directorios de servicio (servicios Python FastAPI)
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

# Puerta de enlace (Node.js + TypeScript)
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

# Infraestructura
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

# Gráficos Helm
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

# Archivos raíz
mkdir -p "$BASE/.keys"
echo ".keys/\n.env" > "$BASE/.gitignore"
touch "$BASE/.env.example"
touch "$BASE/CLAUDE.md"

# Generar par de claves RS256 local para auth servicio-a-servicio
bash "$BASE/scripts/generate-keys.sh" 2>/dev/null || \
  openssl genrsa -out "$BASE/.keys/private.pem" 2048 && \
  openssl rsa -in "$BASE/.keys/private.pem" -pubout -out "$BASE/.keys/public.pem"

echo "Andamiaje de microservicios creado en $BASE"

# Instalar skills relevantes
npx claudient add skill devops-infra/docker-compose-local-dev
npx claudient add skill devops-infra/k8s-deployment
npx claudient add skill devops-infra/helm-chart
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill backend/fastapi-crud
npx claudient add skill backend/alembic-migration
npx claudient add skill backend/rabbitmq-consumer
npx claudient add skill devops-infra/capacity-planner
```

## Plantilla CLAUDE.md

```markdown
# Plataforma de Microservicios — CLAUDE.md

Este repositorio contiene cuatro servicios (auth-service, user-service, notification-service, gateway),
infraestructura compartida (Docker Compose, Traefik, Prometheus, Grafana, RabbitMQ), y gráficos Helm
para implementación en Kubernetes. Los cambios en cualquier servicio están aislados — cada uno tiene su propia
base de datos, pipeline CI, y Dockerfile.

## Stack

- auth-service: FastAPI 0.111, PostgreSQL 16 (auth_db), Redis 7, migraciones Alembic
- user-service: FastAPI 0.111, PostgreSQL 16 (user_db), publicador RabbitMQ, migraciones Alembic
- notification-service: FastAPI 0.111, consumidor RabbitMQ aio_pika, SendGrid
- gateway: Express 4, TypeScript 5.4, http-proxy-middleware, validación JWT RS256
- Proxy inverso: Traefik v3 — todo tráfico público se enruta a través de él; ningún servicio expone puertos directamente
- Observabilidad: Prometheus + Grafana + Jaeger vía OpenTelemetry (puerto gRPC OTLP 4317)
- Mensajería asincrónica: colas duraderas RabbitMQ con intercambios de letra muerta en todas las colas de consumidor
- Implementación: gráficos Helm 3.14 por servicio; values.staging.yaml y values.prod.yaml por entorno

## Ejecutar la pila completa localmente

```bash
# Iniciar servicios principales (los cuatro servicios + BDs por servicio + Redis + Traefik)
./scripts/dev-up.sh

# Iniciar con pila de observabilidad (agrega Prometheus, Grafana, Jaeger, recolector OTEL)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.observability.yml up -d

# Iniciar con mensajería (agrega RabbitMQ + UI de gestión en http://localhost:15672)
docker compose -f infrastructure/docker-compose.yml \
               -f infrastructure/docker-compose.messaging.yml up -d

# Verificar que todos los servicios estén saludables
./scripts/health-check.sh

# Desmontar (elimina volúmenes — reinicia todas las BDs)
./scripts/dev-down.sh
```

Los servicios son accesibles vía Traefik en http://localhost:80:
- POST http://localhost/api/v1/auth/login
- GET  http://localhost/api/v1/users/{id}
- GET  http://localhost/health

## Agregar un nuevo servicio

1. Copiar services/auth-service/ como plantilla: cp -r services/auth-service services/mi-servicio
2. Actualizar services/mi-servicio/app/core/config.py con las variables de entorno del nuevo servicio
3. Agregar un nuevo contenedor BD a infrastructure/docker-compose.yml (mi_service_db: postgres:16)
4. Registrar el servicio en infrastructure/docker-compose.yml bajo services:
   - Compilar desde services/mi-servicio/Dockerfile
   - Conectar a services-net, depends_on de la BD
5. Agregar reglas de enrutamiento a infrastructure/traefik/dynamic/services.yml
6. Crear un gráfico Helm: cp -r helm/auth-service helm/mi-servicio; actualizar Chart.yaml + values.yaml
7. Crear un flujo de trabajo GitHub Actions: cp .github/workflows/auth-service.yml .github/workflows/mi-servicio.yml
   - Actualizar filtro `paths:` a services/mi-servicio/**
8. Agregar entradas .env.example para las variables de entorno requeridas del nuevo servicio
9. Ejecutar ./scripts/generate-keys.sh si el servicio necesita emitir JWTs internos
10. Escribir la migración inicial alembic y ejecutar: ./scripts/migrate.sh mi-servicio

## Comunicación inter-servicio

### Sincrónica (REST vía puerta de enlace)

Todas las llamadas sincrónicas de clientes van a través de la puerta de enlace. La puerta de enlace:
1. Verifica el JWT del usuario (clave pública RS256 de .keys/public.pem)
2. Firma un JWT de servicio interno (clave privada RS256, TTL 30s, claims: {sub: "gateway", service: "gateway"})
3. Lo adjunta como encabezado X-Internal-Token antes de hacer proxy

Los servicios descendentes validan X-Internal-Token en su dependencia `require_internal` de FastAPI.
Las llamadas REST servicio-a-servicio directas (no vía puerta de enlace) también deben usar un JWT interno firmado.

### Asincrónica (RabbitMQ)

Los intercambios siguen el patrón: {service}.events (por ejemplo, user.events, auth.events).
Las claves de enrutamiento siguen: {service}.{entity}.{action} (por ejemplo, user.account.created).

Publicación (ejemplo user-service):
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

Consumo (ejemplo notification-service):
- Declarar cola con x-dead-letter-exchange apuntando a {service}.events.dlx
- Siempre ack después del procesamiento exitoso; nack (requeue=False) en errores irrecuperables
- Solo consumidores idempotentes — los mensajes pueden entregarse de nuevo después de un bloqueo

## Ejecutar migraciones

```bash
# Ejecutar migraciones pendientes para un servicio específico
./scripts/migrate.sh auth-service     # ejecuta alembic upgrade head dentro del contenedor
./scripts/migrate.sh user-service

# Generar una nueva migración (después de cambiar modelos SQLAlchemy)
docker exec auth-service alembic revision --autogenerate -m "add_refresh_token_table"

# Inspeccionar estado de migración actual
docker exec auth-service alembic current
docker exec auth-service alembic history --verbose
```

Reglas de migración:
- Cada migración debe ser compatible hacia atrás — la versión anterior del servicio debe ejecutarse contra ella
- Nunca DROP COLUMN en la misma PR que elimina la columna del modelo ORM
- Para tablas grandes (>1M filas): usar CREATE INDEX CONCURRENTLY, nunca CREATE INDEX plano
- Siempre agregar un comentario SQL de reversión en la parte superior de cada archivo de versión de migración

## Auth servicio-a-servicio

El par de claves RS256 en .keys/ se usa para toda firma JWT interna:
- private.pem: la puerta de enlace y cualquier servicio que emita tokens internos firma con esto
- public.pem: todos los servicios descendentes verifican con esto

Para dev local, .keys/ se monta por volumen en todos los contenedores.
Para staging/prod, el par de claves se almacena en AWS Secrets Manager e inyecta vía secretos de Kubernetes.

Para rotar el par de claves:
1. Generar un nuevo par: ./scripts/generate-keys.sh
2. Implementar la nueva clave pública en todos los servicios primero (aceptan tanto vieja como nueva durante la ventana de rotación)
3. Implementar la nueva clave privada en la puerta de enlace/emisores
4. Remover la clave pública anterior de verificadores después de que todos los tokens en vuelo hayan expirado (TTL máximo: 30s)

## Observabilidad

- Métricas: todos los servicios exponen GET /metrics (scrape de Prometheus); ver infrastructure/prometheus/prometheus.yml
- Trazas: todos los servicios exportan OTLP gRPC a otel-collector:4317; ver trazas en Jaeger en http://localhost:16686
- Dashboards: Grafana en http://localhost:3000 (admin/admin localmente); dashboards aprovisionados automáticamente de infrastructure/grafana/dashboards/
- Alertas: definidas en infrastructure/prometheus/rules/; se disparan a PagerDuty en producción

## Pipelines CI

Cada servicio tiene su propio archivo de flujo de trabajo en .github/workflows/:
- Activado por filtro de ruta: cambios a services/{name}/** o helm/{name}/**
- Pasos: checkout → configurar idioma (Python 3.12 / Node 20) → lint → test → compilar Docker → push a ECR → helm lint
- En merge a main: agrega un paso deploy-to-staging (helm upgrade --install con values.staging.yaml)
- Etiquetas de imagen: sha-${{ github.sha }} — nunca usar `latest` como etiqueta de implementación

## Convenciones

- Nomenclatura BD: {service_name}_db (por ejemplo, auth_db, user_db) — nunca compartir BD entre servicios
- Nomenclatura cola: {service}.{entity}.{action} — siempre incluir los tres segmentos
- Claims JWT internos: siempre incluir {sub, iat, exp, jti, service} — nunca remover jti (para prevención de repetición)
- Variables de entorno: ALL_CAPS_SNAKE_CASE; siempre agregar a .env.example con comentario de descripción
- Puertos (dev local): gateway=8000, auth-service=8001, user-service=8002, notification-service=8003
- Dashboard Traefik: http://localhost:8080 (solo local, nunca exponer en prod)
```

## Servidores MCP

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

## Hooks recomendados

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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"alembic upgrade|migrate\\.sh\"; then echo \"[HOOK] Migración detectada — confirmar que la BD de servicio objetivo está ejecutándose y que existe una copia de seguridad antes de proceder.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'REPO=\"$PWD\"; if docker compose -f \"$REPO/infrastructure/docker-compose.yml\" ps --quiet 2>/dev/null | grep -q .; then echo \"[RECORDATORIO] La pila Docker Compose sigue ejecutándose. Ejecute ./scripts/dev-down.sh cuando termine para liberar recursos.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills a instalar

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

## Relacionado

- [Guía de DevOps e Infraestructura](../guides/for-devops-sre.md)
- [Flujo de Trabajo Docker Compose Dev Local](../workflows/docker-compose-local-dev.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
