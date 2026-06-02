# REST API Service — Projektstruktur

> Für Backend-Ingenieure, die einen Production-FastAPI-Service bauen und warten — optimiert für den gesamten Zyklus von der Domänenmodellierung bis zum bereitgestellten, getesteten und beobachtbaren Endpoint.

## Stack

- **Framework:** FastAPI 0.115+ (Python 3.12+)
- **ORM:** SQLAlchemy 2.0 (async engine, `AsyncSession`, mapped dataclasses)
- **Migrations:** Alembic 1.13+ (autogenerate, online/offline modes)
- **Datenbank:** PostgreSQL 16 (asyncpg driver)
- **Cache + Broker:** Redis 7 (aioredis für Cache, Redis Streams oder Lists für Celery Broker)
- **Background Jobs:** Celery 5.4+ mit redis:// broker, result backend optional
- **Validierung:** Pydantic v2 (model_validator, field_validator, computed_field)
- **Authentifizierung:** python-jose (JWT RS256), passlib[bcrypt] (Password Hashing), API Key via Header
- **Testing:** pytest 8+ mit pytest-asyncio, httpx (AsyncClient), factory-boy, pytest-cov
- **Containerisierung:** Docker 25 (multi-stage build), docker-compose v2
- **CI/CD:** GitHub Actions (lint → test → build → push → deploy)
- **Linting/Formatierung:** Ruff 0.4+ (ersetzt flake8 + isort + pyupgrade), mypy 1.10+
- **Observability:** structlog (JSON logs), OpenTelemetry SDK, Sentry SDK

## Verzeichnisbaum

```
rest-api-service/
├── .github/
│   └── workflows/
│       ├── ci.yml                          # PR checks: ruff, mypy, pytest, coverage gate
│       ├── cd-staging.yml                  # Push to staging on merge to main
│       └── cd-production.yml               # Deploy to production on version tag push
├── alembic/
│   ├── env.py                              # Async engine setup, target_metadata wiring
│   ├── script.py.mako                      # Migration file template (typed, timestamped)
│   └── versions/
│       ├── 0001_create_users.py            # Initial schema: users + api_keys tables
│       ├── 0002_create_items.py            # Items table with FK to users
│       └── 0003_add_refresh_tokens.py      # JWT refresh token store
├── docker/
│   ├── Dockerfile                          # Multi-stage: builder → runtime (non-root user)
│   ├── Dockerfile.worker                   # Celery worker image (shares src/, lighter base)
│   └── docker-compose.yml                  # Local dev: app + worker + postgres + redis
├── src/
│   ├── __init__.py
│   ├── main.py                             # FastAPI app factory, lifespan, middleware, routers
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                         # Shared FastAPI dependencies (get_session, get_current_user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py                   # APIRouter aggregating all v1 domain routers
│   │       ├── auth/
│   │       │   ├── __init__.py
│   │       │   ├── router.py               # POST /auth/token, POST /auth/refresh, POST /auth/logout
│   │       │   └── api_keys.py             # POST /auth/api-keys, DELETE /auth/api-keys/{key_id}
│   │       ├── users/
│   │       │   ├── __init__.py
│   │       │   └── router.py               # GET /users/me, PATCH /users/me, GET /users/{id} (admin)
│   │       └── items/
│   │           ├── __init__.py
│   │           └── router.py               # CRUD /items, POST /items/{id}/publish (async job trigger)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                       # Settings via pydantic-settings: DB_URL, REDIS_URL, JWT_*
│   │   ├── database.py                     # AsyncEngine, AsyncSessionMaker, get_session dependency
│   │   ├── redis.py                        # Aioredis pool factory, cache get/set/invalidate helpers
│   │   ├── security.py                     # JWT encode/decode (RS256), API key hash/verify, bcrypt
│   │   ├── exceptions.py                   # Domain exception classes → FastAPI HTTPException mapping
│   │   ├── middleware.py                   # RequestID injection, structured logging middleware
│   │   └── telemetry.py                    # OpenTelemetry SDK setup, Sentry init, structlog config
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base.py                         # DeclarativeBase, TimestampMixin (created_at, updated_at)
│   │   ├── user.py                         # User, ApiKey mapped dataclasses
│   │   ├── item.py                         # Item mapped dataclass, ItemStatus enum
│   │   └── token.py                        # RefreshToken mapped dataclass
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── common.py                       # Paginated[T] generic, ErrorDetail, SuccessEnvelope
│   │   ├── auth.py                         # TokenRequest, TokenResponse, ApiKeyCreate, ApiKeyOut
│   │   ├── user.py                         # UserCreate, UserOut, UserUpdate, UserPublic
│   │   └── item.py                         # ItemCreate, ItemOut, ItemUpdate, ItemListOut
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py                 # login(), refresh_token(), revoke_token(), verify_api_key()
│   │   ├── user_service.py                 # create_user(), get_user(), update_user(), get_by_email()
│   │   └── item_service.py                 # create_item(), list_items(), publish_item() (enqueues task)
│   └── workers/
│       ├── __init__.py
│       ├── celery_app.py                   # Celery app factory, broker/backend config, task autodiscovery
│       ├── tasks/
│       │   ├── __init__.py
│       │   ├── item_tasks.py               # process_item_publish(), retry logic, DLQ handling
│       │   └── notification_tasks.py       # send_email_notification(), send_webhook()
│       └── schedules.py                    # Celery beat schedule: cleanup_expired_tokens (daily)
├── tests/
│   ├── conftest.py                         # Async engine, test DB, AsyncClient, fixture factories
│   ├── factories.py                        # factory-boy: UserFactory, ItemFactory, ApiKeyFactory
│   ├── unit/
│   │   ├── test_security.py                # JWT encode/decode, API key hashing, token expiry
│   │   ├── test_auth_service.py            # login(), refresh, revoke — mocked DB session
│   │   ├── test_user_service.py            # create, get, update — mocked DB session
│   │   └── test_item_service.py            # CRUD, publish enqueue — mocked session + Celery
│   └── integration/
│       ├── test_auth_routes.py             # POST /auth/token happy path + error cases
│       ├── test_user_routes.py             # GET /users/me with real JWT, PATCH /users/me
│       ├── test_item_routes.py             # Full CRUD, pagination, 403 ownership checks
│       └── test_api_key_auth.py            # X-API-Key header auth end-to-end
├── alembic.ini                             # Alembic config: script_location, sqlalchemy.url placeholder
├── pyproject.toml                          # All deps, ruff config, mypy config, pytest config
├── .env.example                            # All env vars with descriptions, no real values
├── .env.test                               # Test DB/Redis URLs for pytest (committed, no secrets)
└── Makefile                                # Targets: dev, test, migrate, lint, worker, build
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `src/main.py` | FastAPI App Factory mit `@asynccontextmanager` Lifespan für DB Pool und Redis Init; enthält alle v1 Router; registriert Exception Handler aus `core/exceptions.py` |
| `src/core/config.py` | `pydantic-settings` `Settings` Klasse liest aus Environment; typisierte Felder für `DATABASE_URL`, `REDIS_URL`, `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `CELERY_BROKER_URL`, `SENTRY_DSN` |
| `src/core/security.py` | JWT RS256 sign/verify (`python-jose`); API Key Generierung (32-byte token), SHA-256 Speicherung, constant-time compare; bcrypt password hash/verify über `passlib` |
| `src/api/deps.py` | Gemeinsame FastAPI `Depends`: `get_session` (ergibt `AsyncSession`), `get_current_user` (dekodiert Bearer JWT oder X-API-Key Header), `require_admin` (Rollenprüfung auf User) |
| `src/workers/celery_app.py` | Celery App verbunden mit Redis Broker; `task_always_eager=True` in Test Env; autodiskovered `src.workers.tasks.*`; konfiguriert task serializer als JSON |
| `alembic/env.py` | Importiert `src.models.base.Base.metadata`; benutzt `asyncio.run()` für async Alembic online mode; liest `DATABASE_URL` aus Env damit `alembic upgrade head` in CI funktioniert |
| `tests/conftest.py` | Erstellt isolierte Test DB (dropt/erstellt Schema pro Session); bietet `async_client` Fixture (`httpx.AsyncClient` gegen die App); injiziert `db_session` die nach jedem Test zurückrollt |
| `pyproject.toml` | Einzige Quelle der Wahrheit: `[project.dependencies]`, `[tool.ruff]` (select all, ignore list), `[tool.mypy]` (strict), `[tool.pytest.ini_options]` (asyncio_mode=auto, cov settings) |

## Quick Scaffold

```bash
# Voraussetzungen: Python 3.12+, Docker, uv (pip install uv)
PROJECT=rest-api-service
mkdir -p $PROJECT && cd $PROJECT

# Python project init
uv init --python 3.12
uv add fastapi[standard] sqlalchemy[asyncio] asyncpg alembic \
    pydantic-settings pydantic[email] \
    python-jose[cryptography] passlib[bcrypt] \
    celery[redis] aioredis \
    structlog opentelemetry-sdk opentelemetry-instrumentation-fastapi sentry-sdk

uv add --dev pytest pytest-asyncio httpx factory-boy pytest-cov ruff mypy \
    types-passlib

# Verzeichnisstruktur
mkdir -p .github/workflows
mkdir -p alembic/versions
mkdir -p docker
mkdir -p src/api/v1/auth src/api/v1/users src/api/v1/items
mkdir -p src/core src/models src/schemas src/services
mkdir -p src/workers/tasks
mkdir -p tests/unit tests/integration

# Alle Source-Dateien erstellen
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

# Alembic init (generiert alembic.ini — dann move files into place)
uv run alembic init alembic 2>/dev/null || true

# docker-compose für lokale Entwicklung
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

# Claudient Skills installieren
npx claudient add skill backend/python/fastapi-crud
npx claudient add skill backend/python/sqlalchemy-patterns
npx claudient add skill backend/python/celery-task
npx claudient add skill backend/auth/jwt-api-key
npx claudient add skill backend/python/alembic-migration
npx claudient add skill productivity/test-generator
npx claudient add skill productivity/security-audit
npx claudient add skill git/pr-description

echo "REST API service scaffold complete. Next: cp .env.example .env && make dev"
```

## CLAUDE.md Template

```markdown
# REST API Service

Production REST API gebaut mit FastAPI, SQLAlchemy 2.0 (async), und Celery.
Diese Codebase folgt einer domain-layered Struktur: models → schemas → services → routers.
Alle DB Access sind async. Background Jobs laufen in separaten Celery Workers.

## Stack

- FastAPI 0.115+ (Python 3.12) — app factory in src/main.py
- SQLAlchemy 2.0 async — models in src/models/, session in src/core/database.py
- Alembic 1.13 — migrations in alembic/versions/, run via `make migrate`
- PostgreSQL 16 (asyncpg driver) — DATABASE_URL in .env
- Redis 7 — REDIS_URL in .env; used for cache (aioredis) and Celery broker
- Celery 5.4 — workers in src/workers/; tasks autodiscovered from src/workers/tasks/
- Pydantic v2 — request/response schemas in src/schemas/
- Auth: JWT RS256 (python-jose) + X-API-Key header (SHA-256 stored in api_keys table)
- Testing: pytest-asyncio, httpx AsyncClient, factory-boy, isolated test DB per session

## Einen Endpoint hinzufügen (exakte Schritte)

1. **Model** — add oder update `src/models/<domain>.py` (SQLAlchemy mapped dataclass)
2. **Migration** — `make makemigration msg="add_<column_or_table>"` dann review die Datei
3. **Schema** — add request/response Pydantic models zu `src/schemas/<domain>.py`
4. **Service** — add business logic Funktion zu `src/services/<domain>_service.py`
   - Accept `AsyncSession` als erstes Argument; nie `get_session` hier importieren
   - Raise domain exceptions aus `src/core/exceptions.py`, nicht HTTPException
5. **Router** — add die Route zu `src/api/v1/<domain>/router.py`
   - Inject dependencies via `Depends(get_current_user)`, `Depends(get_session)`
   - Call service function; catch domain exceptions; return schema
6. **Test** — add unit test in `tests/unit/test_<domain>_service.py` (mock session)
   und integration test in `tests/integration/test_<domain>_routes.py` (real DB)

## Migrations ausführen

```bash
# Alle ausstehenden Migrations anwenden
make migrate

# Eine neue Migration aus Model Changes generieren
make makemigration msg="add_status_to_items"

# Eine Revision downgraden
uv run alembic downgrade -1

# Aktuelle Revision zeigen
uv run alembic current
```

Migration Regeln:
- Nie eine Column im selben PR droppen, der Code der sie nutzt - zwei-step deploy
- Immer `alembic downgrade -1` lokal testen bevor du pusht
- Large-table migrations (>1M rows): add indexes CONCURRENTLY, use batch_alter_table

## Eine Celery Task schreiben

Tasks leben in `src/workers/tasks/<domain>_tasks.py`.

```python
from src.workers.celery_app import celery_app
from src.core.database import AsyncSessionMaker
import asyncio

@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_item_publish(self, item_id: int) -> None:
    async def _run():
        async with AsyncSessionMaker() as session:
            # call service functions here
            pass
    try:
        asyncio.run(_run())
    except Exception as exc:
        raise self.retry(exc=exc)
```

Enqueue aus einem Service:
```python
from src.workers.tasks.item_tasks import process_item_publish
process_item_publish.delay(item.id)
```

## Auth Patterns

### JWT (Bearer Token)
- Issue: `POST /auth/token` mit email + password → returns `access_token` + `refresh_token`
- Verify: `get_current_user` dependency in `src/api/deps.py` dekodiert RS256 JWT
- Rotate: `POST /auth/refresh` mit refresh_token → new access_token
- Revoke: store refresh token hash in `refresh_tokens` table; check on every refresh

### API Key (X-API-Key Header)
- Issue: `POST /auth/api-keys` (authenticated user) → returns raw key once, stores SHA-256
- Verify: `get_current_user` falls back zu X-API-Key header; hashes und compares
- Revoke: `DELETE /auth/api-keys/{key_id}` — soft-delete oder hard-delete row

## Häufige SQLAlchemy Patterns

**Async Query mit Join:**
```python
stmt = select(Item).where(Item.owner_id == user_id).options(selectinload(Item.tags))
result = await session.execute(stmt)
items = result.scalars().all()
```

**Paginierte Liste:**
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

## Tests ausführen

```bash
make test                          # full suite with coverage
uv run pytest tests/unit/          # unit tests only (no DB)
uv run pytest tests/integration/   # integration tests (requires .env.test)
uv run pytest -k "test_auth" -v    # filter by name
uv run pytest --lf                 # rerun last failures only
```

Test DB wird jede Session frisch erstellt. `.env.test` muss `TEST_DATABASE_URL`
haben die auf eine separate Datenbank zeigt (nicht die dev DB).

## Environment Variables

Alle erforderlichen Vars sind in `.env.example`. Kritische:
- `DATABASE_URL` — asyncpg format: `postgresql+asyncpg://user:pass@host/db`
- `REDIS_URL` — `redis://localhost:6379/0`
- `JWT_PRIVATE_KEY` — RS256 PEM (generate: `openssl genrsa 2048`)
- `JWT_PUBLIC_KEY` — corresponding public key PEM
- `JWT_ALGORITHM` — always `RS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES` — 15 (short; rely on refresh)
- `REFRESH_TOKEN_EXPIRE_DAYS` — 30
- `CELERY_BROKER_URL` — `redis://localhost:6379/1` (different DB index than cache)
- `SENTRY_DSN` — optional; Sentry init skipped if unset

## Was nicht zu tun ist

- Do not import AsyncSession directly into routers — use Depends(get_session)
- Do not raise HTTPException from service layer — raise domain exceptions from core/exceptions.py
- Do not use synchronous SQLAlchemy patterns (session.query()) — use select() + await
- Do not commit migrations with --autogenerate without reviewing the generated file
- Do not store raw API keys — always SHA-256 hash before writing to DB
- Do not run Celery tasks synchronously in request handlers — always .delay() or .apply_async()
```

## MCP Server

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

## Skills zum Installieren

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

## Verwandt

- [Backend Python Guide](../guides/for-backend-python.md)
- [API Development Workflow](../workflows/api-endpoint-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
