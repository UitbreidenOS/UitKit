# Servicio REST API — Estructura de Proyecto

> Para ingenieros de backend que construyen y mantienen un servicio FastAPI de producción — optimizando el ciclo completo desde el modelo de dominio hasta el endpoint desplegado y observable.

## Stack

- **Framework:** FastAPI 0.115+ (Python 3.12+)
- **ORM:** SQLAlchemy 2.0 (async engine, `AsyncSession`, mapped dataclasses)
- **Migraciones:** Alembic 1.13+ (autogenerate, modos online/offline)
- **Base de datos:** PostgreSQL 16 (driver asyncpg)
- **Cache + broker:** Redis 7 (aioredis para cache, Redis Streams o Lists para broker de Celery)
- **Trabajos en background:** Celery 5.4+ con broker redis://, backend de resultados opcional
- **Validación:** Pydantic v2 (model_validator, field_validator, computed_field)
- **Auth:** python-jose (JWT RS256), passlib[bcrypt] (hash de contraseñas), API key vía header
- **Testing:** pytest 8+ con pytest-asyncio, httpx (AsyncClient), factory-boy, pytest-cov
- **Containerización:** Docker 25 (multi-stage build), docker-compose v2
- **CI/CD:** GitHub Actions (lint → test → build → push → deploy)
- **Linting/formatting:** Ruff 0.4+ (reemplaza flake8 + isort + pyupgrade), mypy 1.10+
- **Observabilidad:** structlog (JSON logs), OpenTelemetry SDK, Sentry SDK

## Árbol de directorios

```
rest-api-service/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # Verificaciones de PR: ruff, mypy, pytest, coverage gate
│       ├── cd-staging.yml                  # Push a staging al fusionar con main
│       └── cd-production.yml               # Desplegar a producción al hacer push de etiqueta de versión
├── alembic/
│   ├── env.py                              # Configuración de async engine, wiring de target_metadata
│   ├── script.py.mako                      # Plantilla de archivo de migración (tipada, con timestamp)
│   └── versions/
│       ├── 0001_create_users.py            # Schema inicial: tablas users + api_keys
│       ├── 0002_create_items.py            # Tabla items con FK a users
│       └── 0003_add_refresh_tokens.py      # Almacén de refresh tokens JWT
├── docker/
│   ├── Dockerfile                          # Multi-stage: builder → runtime (usuario no-root)
│   ├── Dockerfile.worker                   # Imagen de worker Celery (comparte src/, base más ligera)
│   └── docker-compose.yml                  # Dev local: app + worker + postgres + redis
├── src/
│   ├── __init__.py
│   ├── main.py                             # Factory de app FastAPI, lifespan, middleware, routers
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                         # Dependencias compartidas de FastAPI (get_session, get_current_user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py                   # APIRouter agregando todos los routers de dominio v1
│   │       ├── auth/
│   │       │   ├── __init__.py
│   │       │   ├── router.py               # POST /auth/token, POST /auth/refresh, POST /auth/logout
│   │       │   └── api_keys.py             # POST /auth/api-keys, DELETE /auth/api-keys/{key_id}
│   │       ├── users/
│   │       │   ├── __init__.py
│   │       │   └── router.py               # GET /users/me, PATCH /users/me, GET /users/{id} (admin)
│   │       └── items/
│   │           ├── __init__.py
│   │           └── router.py               # CRUD /items, POST /items/{id}/publish (trigger de tarea async)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                       # Configuración via pydantic-settings: DB_URL, REDIS_URL, JWT_*
│   │   ├── database.py                     # AsyncEngine, AsyncSessionMaker, dependencia get_session
│   │   ├── redis.py                        # Factory de pool Aioredis, helpers get/set/invalidate de cache
│   │   ├── security.py                     # JWT encode/decode (RS256), hash/verify de API key, bcrypt
│   │   ├── exceptions.py                   # Clases de excepción de dominio → mapeo a HTTPException de FastAPI
│   │   ├── middleware.py                   # Inyección de RequestID, middleware de structured logging
│   │   └── telemetry.py                    # Configuración de OpenTelemetry SDK, init de Sentry, config de structlog
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                         # DeclarativeBase, TimestampMixin (created_at, updated_at)
│   │   ├── user.py                         # User, ApiKey mapped dataclasses
│   │   ├── item.py                         # Item mapped dataclass, ItemStatus enum
│   │   └── token.py                        # RefreshToken mapped dataclass
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── common.py                       # Paginated[T] genérico, ErrorDetail, SuccessEnvelope
│   │   ├── auth.py                         # TokenRequest, TokenResponse, ApiKeyCreate, ApiKeyOut
│   │   ├── user.py                         # UserCreate, UserOut, UserUpdate, UserPublic
│   │   └── item.py                         # ItemCreate, ItemOut, ItemUpdate, ItemListOut
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py                 # login(), refresh_token(), revoke_token(), verify_api_key()
│   │   ├── user_service.py                 # create_user(), get_user(), update_user(), get_by_email()
│   │   └── item_service.py                 # create_item(), list_items(), publish_item() (encola tarea)
│   └── workers/
│       ├── __init__.py
│       ├── celery_app.py                   # Factory de app Celery, config broker/backend, autodiscovery de tareas
│       ├── tasks/
│       │   ├── __init__.py
│       │   ├── item_tasks.py               # process_item_publish(), lógica de retry, manejo de DLQ
│       │   └── notification_tasks.py       # send_email_notification(), send_webhook()
│       └── schedules.py                    # Schedule de Celery beat: cleanup_expired_tokens (diario)
├── tests/
│   ├── conftest.py                         # Async engine, test DB, AsyncClient, fixture factories
│   ├── factories.py                        # factory-boy: UserFactory, ItemFactory, ApiKeyFactory
│   ├── unit/
│   │   ├── test_security.py                # JWT encode/decode, hash de API key, expiración de token
│   │   ├── test_auth_service.py            # login(), refresh, revoke — sesión DB mockeada
│   │   ├── test_user_service.py            # crear, obtener, actualizar — sesión DB mockeada
│   │   └── test_item_service.py            # CRUD, encolado de publish — sesión mockeada + Celery
│   └── integration/
│       ├── test_auth_routes.py             # POST /auth/token happy path + casos de error
│       ├── test_user_routes.py             # GET /users/me con JWT real, PATCH /users/me
│       ├── test_item_routes.py             # CRUD completo, paginación, checks de ownership 403
│       └── test_api_key_auth.py            # End-to-end de auth X-API-Key header
├── alembic.ini                             # Configuración de Alembic: script_location, placeholder sqlalchemy.url
├── pyproject.toml                          # Todas las deps, configuración de ruff, configuración de mypy, configuración de pytest
├── .env.example                            # Todas las variables de env con descripciones, sin valores reales
├── .env.test                               # URLs de test DB/Redis para pytest (commitidas, sin secretos)
└── Makefile                                # Targets: dev, test, migrate, lint, worker, build
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `src/main.py` | Factory de app FastAPI con `@asynccontextmanager` lifespan para pool de DB e init de Redis; incluye todos los routers v1; registra exception handlers de `core/exceptions.py` |
| `src/core/config.py` | Clase `Settings` de `pydantic-settings` leyendo desde env; campos tipados para `DATABASE_URL`, `REDIS_URL`, `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `CELERY_BROKER_URL`, `SENTRY_DSN` |
| `src/core/security.py` | JWT RS256 sign/verify (`python-jose`); generación de API key (token de 32 bytes), almacenamiento SHA-256, comparación de tiempo constante; hash/verify de bcrypt via `passlib` |
| `src/api/deps.py` | FastAPI compartido `Depends`: `get_session` (yields `AsyncSession`), `get_current_user` (decodifica JWT Bearer o header X-API-Key), `require_admin` (verificación de rol en usuario) |
| `src/workers/celery_app.py` | App Celery conectada a broker Redis; `task_always_eager=True` en env de test; autodiscovery de `src.workers.tasks.*`; configura serializer de tarea como JSON |
| `alembic/env.py` | Importa `src.models.base.Base.metadata`; usa `asyncio.run()` para modo online de Alembic async; lee `DATABASE_URL` desde env para que `alembic upgrade head` funcione en CI |
| `tests/conftest.py` | Crea DB de test aislada (drop/recreate schema por sesión); proporciona fixture `async_client` (`httpx.AsyncClient` contra la app); inyecta `db_session` que hace rollback después de cada test |
| `pyproject.toml` | Fuente única de verdad: `[project.dependencies]`, `[tool.ruff]` (selecciona todo, lista de ignore), `[tool.mypy]` (strict), `[tool.pytest.ini_options]` (asyncio_mode=auto, configuración de cov) |

## Scaffold rápido

```bash
# Prerequisites: Python 3.12+, Docker, uv (pip install uv)
PROJECT=rest-api-service
mkdir -p $PROJECT && cd $PROJECT

# Inicialización de proyecto Python
uv init --python 3.12
uv add fastapi[standard] sqlalchemy[asyncio] asyncpg alembic \
    pydantic-settings pydantic[email] \
    python-jose[cryptography] passlib[bcrypt] \
    celery[redis] aioredis \
    structlog opentelemetry-sdk opentelemetry-instrumentation-fastapi sentry-sdk

uv add --dev pytest pytest-asyncio httpx factory-boy pytest-cov ruff mypy \
    types-passlib

# Estructura de directorios
mkdir -p .github/workflows
mkdir -p alembic/versions
mkdir -p docker
mkdir -p src/api/v1/auth src/api/v1/users src/api/v1/items
mkdir -p src/core src/models src/schemas src/services
mkdir -p src/workers/tasks
mkdir -p tests/unit tests/integration

# Crear todos los archivos fuente
touch src/__init__.py src/main.py
touch src/api/__init__.py src/api/deps.py
touch src/api/v1/__init__.py src/api/v1/router.py
touch src/api/v1/auth/__init__.py src/api/v1/auth/router.py src/api/v1/auth/api_keys.py
touch src/api/v1/users/__init__.py src/api/v1/users/router.py
touch src/api/v1/items/__init__.py src/api/v1/items/router.py
touch src/core/__init__.py src/core/config.py src/core/database.py
touch src/core/redis.py src/core/security.py src/core/exceptions.py
touch src/core/middleware.py src/core/telemetry.py
touch src/models/__init__.py src/models/base.py src/models/user.py
touch src/models/item.py src/models/token.py
touch src/schemas/__init__.py src/schemas/common.py src/schemas/auth.py
touch src/schemas/user.py src/schemas/item.py
touch src/services/__init__.py src/services/auth_service.py
touch src/services/user_service.py src/services/item_service.py
touch src/workers/__init__.py src/workers/celery_app.py src/workers/schedules.py
touch src/workers/tasks/__init__.py src/workers/tasks/item_tasks.py
touch src/workers/tasks/notification_tasks.py
touch tests/conftest.py tests/factories.py
touch tests/unit/test_security.py tests/unit/test_auth_service.py
touch tests/unit/test_user_service.py tests/unit/test_item_service.py
touch tests/integration/test_auth_routes.py tests/integration/test_user_routes.py
touch tests/integration/test_item_routes.py tests/integration/test_api_key_auth.py
touch alembic.ini alembic/env.py alembic/script.py.mako
touch .env.example .env.test Makefile

# Alembic init (genera alembic.ini — luego mover archivos al lugar)
uv run alembic init alembic 2>/dev/null || true

# docker-compose para dev local
cat > docker/docker-compose.yml << 'EOF'
version: "3.9"
services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    env_file: ../.env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  worker:
    build:
      context: ..
      dockerfile: docker/Dockerfile.worker
    env_file: ../.env
    depends_on:
      - redis
      - postgres

  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
EOF

# Makefile
cat > Makefile << 'EOF'
.PHONY: dev test lint migrate worker build

dev:
	docker compose -f docker/docker-compose.yml up

test:
	uv run pytest tests/ --cov=src --cov-report=term-missing --cov-fail-under=80

lint:
	uv run ruff check src/ tests/
	uv run ruff format --check src/ tests/
	uv run mypy src/

migrate:
	uv run alembic upgrade head

makemigration:
	uv run alembic revision --autogenerate -m "$(msg)"

worker:
	uv run celery -A src.workers.celery_app worker --loglevel=info

beat:
	uv run celery -A src.workers.celery_app beat --loglevel=info

build:
	docker build -f docker/Dockerfile -t rest-api-service:local .
EOF

# Instalar skills de Claudient
npx claudient add skill backend/python/fastapi-crud
npx claudient add skill backend/python/sqlalchemy-patterns
npx claudient add skill backend/python/celery-task
npx claudient add skill backend/auth/jwt-api-key
npx claudient add skill backend/python/alembic-migration
npx claudient add skill productivity/test-generator
npx claudient add skill productivity/security-audit
npx claudient add skill git/pr-description

echo "Scaffold de servicio REST API completado. Siguiente: cp .env.example .env && make dev"
```

## Plantilla de CLAUDE.md

```markdown
# Servicio REST API

API REST de producción construida con FastAPI, SQLAlchemy 2.0 (async) y Celery.
Este codebase sigue una estructura de capas por dominio: models → schemas → services → routers.
Todo acceso a DB es async. Los trabajos en background se ejecutan en workers de Celery separados.

## Stack

- FastAPI 0.115+ (Python 3.12) — app factory en src/main.py
- SQLAlchemy 2.0 async — models en src/models/, sesión en src/core/database.py
- Alembic 1.13 — migraciones en alembic/versions/, ejecutar vía `make migrate`
- PostgreSQL 16 (driver asyncpg) — DATABASE_URL en .env
- Redis 7 — REDIS_URL en .env; usado para cache (aioredis) y broker de Celery
- Celery 5.4 — workers en src/workers/; tareas autodiscovered desde src/workers/tasks/
- Pydantic v2 — esquemas de request/response en src/schemas/
- Auth: JWT RS256 (python-jose) + header X-API-Key (SHA-256 almacenado en tabla api_keys)
- Testing: pytest-asyncio, httpx AsyncClient, factory-boy, DB de test aislada por sesión

## Agregar un endpoint (pasos exactos)

1. **Model** — agregar o actualizar `src/models/<domain>.py` (SQLAlchemy mapped dataclass)
2. **Migration** — `make makemigration msg="add_<column_or_table>"` luego revisar el archivo
3. **Schema** — agregar modelos Pydantic de request/response a `src/schemas/<domain>.py`
4. **Service** — agregar función de lógica de negocio a `src/services/<domain>_service.py`
   - Aceptar `AsyncSession` como primer argumento; nunca importar `get_session` aquí
   - Lanzar excepciones de dominio de `src/core/exceptions.py`, no HTTPException
5. **Router** — agregar la ruta a `src/api/v1/<domain>/router.py`
   - Inyectar dependencias vía `Depends(get_current_user)`, `Depends(get_session)`
   - Llamar función de service; capturar excepciones de dominio; retornar schema
6. **Test** — agregar test unitario en `tests/unit/test_<domain>_service.py` (sesión mockeada)
   y test de integración en `tests/integration/test_<domain>_routes.py` (DB real)

## Ejecutar migraciones

```bash
# Aplicar todas las migraciones pendientes
make migrate

# Generar una nueva migración desde cambios de model
make makemigration msg="add_status_to_items"

# Degradar una revisión
uv run alembic downgrade -1

# Mostrar revisión actual
uv run alembic current
```

Reglas de migración:
- Nunca eliminar una columna en el mismo PR que elimina el código que la usa — despliegue en dos pasos
- Siempre probar `alembic downgrade -1` localmente antes de hacer push
- Migraciones en tablas grandes (>1M filas): agregar índices CONCURRENTLY, usar batch_alter_table

## Escribir una tarea Celery

Las tareas viven en `src/workers/tasks/<domain>_tasks.py`.

```python
from src.workers.celery_app import celery_app
from src.core.database import AsyncSessionMaker
import asyncio

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_item_publish(self, item_id: int) -> None:
    async def _run():
        async with AsyncSessionMaker() as session:
            # llamar funciones de service aquí
            pass
    try:
        asyncio.run(_run())
    except Exception as exc:
        raise self.retry(exc=exc)
```

Encolar desde un service:
```python
from src.workers.tasks.item_tasks import process_item_publish
process_item_publish.delay(item.id)
```

## Patrones de Auth

### JWT (Bearer token)
- Emitir: `POST /auth/token` con email + contraseña → retorna `access_token` + `refresh_token`
- Verificar: dependencia `get_current_user` en `src/api/deps.py` decodifica JWT RS256
- Rotar: `POST /auth/refresh` con refresh_token → nuevo access_token
- Revocar: almacenar hash de refresh token en tabla `refresh_tokens`; verificar en cada refresh

### API Key (header X-API-Key)
- Emitir: `POST /auth/api-keys` (usuario autenticado) → retorna clave sin formato, almacena SHA-256
- Verificar: `get_current_user` cae de vuelta a header X-API-Key; hashea y compara
- Revocar: `DELETE /auth/api-keys/{key_id}` — soft-delete o hard-delete fila

## Patrones SQLAlchemy comunes

**Query async con join:**
```python
stmt = select(Item).where(Item.owner_id == user_id).options(selectinload(Item.tags))
result = await session.execute(stmt)
items = result.scalars().all()
```

**Lista paginada:**
```python
stmt = select(Item).offset(skip).limit(limit).order_by(Item.created_at.desc())
count_stmt = select(func.count()).select_from(Item).where(Item.owner_id == user_id)
total = (await session.execute(count_stmt)).scalar_one()
```

**Upsert:**
```python
from sqlalchemy.dialects.postgresql import insert
stmt = insert(Item).values(**data).on_conflict_do_update(
    index_elements=["slug"], set_={"title": data["title"], "updated_at": func.now()}
)
await session.execute(stmt)
```

## Ejecutar tests

```bash
make test                          # suite completa con coverage
uv run pytest tests/unit/          # solo tests unitarios (sin DB)
uv run pytest tests/integration/   # tests de integración (requiere .env.test)
uv run pytest -k "test_auth" -v    # filtrar por nombre
uv run pytest --lf                 # reejecutar solo últimas fallas
```

DB de test se crea fresca cada sesión. `.env.test` debe tener `TEST_DATABASE_URL`
apuntando a una base de datos separada (no la DB dev).

## Variables de entorno

Todas las variables requeridas están en `.env.example`. Críticas:
- `DATABASE_URL` — formato asyncpg: `postgresql+asyncpg://user:pass@host/db`
- `REDIS_URL` — `redis://localhost:6379/0`
- `JWT_PRIVATE_KEY` — RS256 PEM (generar: `openssl genrsa 2048`)
- `JWT_PUBLIC_KEY` — correspondiente PEM de clave pública
- `JWT_ALGORITHM` — siempre `RS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES` — 15 (corto; depender de refresh)
- `REFRESH_TOKEN_EXPIRE_DAYS` — 30
- `CELERY_BROKER_URL` — `redis://localhost:6379/1` (índice DB diferente que cache)
- `SENTRY_DSN` — opcional; init de Sentry omitido si no se establece

## Qué no hacer

- No importar AsyncSession directamente en routers — usar Depends(get_session)
- No lanzar HTTPException desde capa de service — lanzar excepciones de dominio de core/exceptions.py
- No usar patrones síncronos de SQLAlchemy (session.query()) — usar select() + await
- No hacer commit de migraciones con --autogenerate sin revisar el archivo generado
- No almacenar claves API sin hash — siempre hashear SHA-256 antes de escribir en DB
- No ejecutar tareas Celery síncronamente en request handlers — siempre .delay() o .apply_async()
```

## Servidores MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/rest-api-service"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "${DATABASE_URL}"
      }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@sentry/mcp-server"],
      "env": {
        "SENTRY_AUTH_TOKEN": "${SENTRY_AUTH_TOKEN}",
        "SENTRY_ORG": "${SENTRY_ORG}",
        "SENTRY_PROJECT": "${SENTRY_PROJECT}"
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
            "command": "bash -c 'FILE=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$FILE\" == *.py ]]; then uv run ruff format \"$FILE\" 2>/dev/null || true; uv run ruff check --fix \"$FILE\" 2>/dev/null || true; fi'"
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
            "command": "bash -c 'CMD=\"$CLAUDE_TOOL_INPUT_COMMAND\"; if echo \"$CMD\" | grep -qE \"alembic (upgrade|downgrade)\"; then echo \"[HOOK] Running migration: $CMD\" >&2; fi; if echo \"$CMD\" | grep -q \"alembic upgrade\" && ! echo \"$CMD\" | grep -q \"head\"; then echo \"[HOOK] Warning: alembic upgrade target is not head — confirm this is intentional.\" >&2; fi'"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"${CLAUDE_PROJECT_DIR:-$PWD}\" && PENDING=$(uv run alembic history --verbose 2>/dev/null | grep \"(head)\" | wc -l | tr -d \" \"); CURRENT=$(uv run alembic current 2>/dev/null | grep \"(head)\"); if [ -z \"$CURRENT\" ]; then echo \"[Reminder] Unapplied migrations detected — run make migrate before testing.\"; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills a instalar

```bash
npx claudient add skill backend/python/fastapi-crud
npx claudient add skill backend/python/sqlalchemy-patterns
npx claudient add skill backend/python/celery-task
npx claudient add skill backend/auth/jwt-api-key
npx claudient add skill backend/python/alembic-migration
npx claudient add skill backend/python/pydantic-v2
npx claudient add skill productivity/test-generator
npx claudient add skill productivity/security-audit
npx claudient add skill git/pr-description
```

## Relacionado

- [Guía Backend Python](../guides/for-backend-python.md)
- [Workflow de Desarrollo de API](../workflows/api-endpoint-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
