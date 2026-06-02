# REST API Service — Projectstructuur

> Voor backend engineers die een production FastAPI-service bouwen en onderhouden — optimaliseer de volledige cyclus van domeinmodel tot gedeployde, geteste, waarneembare endpoint.

## Stack

- **Framework:** FastAPI 0.115+ (Python 3.12+)
- **ORM:** SQLAlchemy 2.0 (async engine, `AsyncSession`, mapped dataclasses)
- **Migraties:** Alembic 1.13+ (autogenerate, online/offline modes)
- **Database:** PostgreSQL 16 (asyncpg driver)
- **Cache + broker:** Redis 7 (aioredis voor cache, Redis Streams of Lists voor Celery broker)
- **Achtergrondtaken:** Celery 5.4+ met redis:// broker, result backend optioneel
- **Validatie:** Pydantic v2 (model_validator, field_validator, computed_field)
- **Auth:** python-jose (JWT RS256), passlib[bcrypt] (wachtwoordhashing), API key via header
- **Testen:** pytest 8+ met pytest-asyncio, httpx (AsyncClient), factory-boy, pytest-cov
- **Containerisatie:** Docker 25 (multi-stage build), docker-compose v2
- **CI/CD:** GitHub Actions (lint → test → build → push → deploy)
- **Linting/opmaak:** Ruff 0.4+ (vervangt flake8 + isort + pyupgrade), mypy 1.10+
- **Observabiliteit:** structlog (JSON logs), OpenTelemetry SDK, Sentry SDK

## Directoryboom

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

## Belangrijke bestanden uitgelegd

| Pad | Doel |
|---|---|
| `src/main.py` | FastAPI app factory met `@asynccontextmanager` lifespan voor DB pool en Redis init; omvat alle v1 routers; registreert exception handlers van `core/exceptions.py` |
| `src/core/config.py` | `pydantic-settings` `Settings` class leest van env; getypte velden voor `DATABASE_URL`, `REDIS_URL`, `JWT_PRIVATE_KEY`, `JWT_PUBLIC_KEY`, `CELERY_BROKER_URL`, `SENTRY_DSN` |
| `src/core/security.py` | JWT RS256 sign/verify (`python-jose`); API key generatie (32-byte token), SHA-256 opslag, constant-time compare; bcrypt wachtwoordhash/verify via `passlib` |
| `src/api/deps.py` | Gedeelde FastAPI `Depends`: `get_session` (geeft `AsyncSession`), `get_current_user` (decodeert Bearer JWT of X-API-Key header), `require_admin` (rolecheck op user) |
| `src/workers/celery_app.py` | Celery app verbonden met Redis broker; `task_always_eager=True` in test env; autodiscovert `src.workers.tasks.*`; configureert task serializer als JSON |
| `alembic/env.py` | Importeert `src.models.base.Base.metadata`; gebruikt `asyncio.run()` voor async Alembic online mode; leest `DATABASE_URL` van env zodat `alembic upgrade head` werkt in CI |
| `tests/conftest.py` | Maakt geïsoleerde test DB (dropt/herbeurt schema per sessie); biedt `async_client` fixture (`httpx.AsyncClient` tegen de app); injecteert `db_session` die na elke test terugdraait |
| `pyproject.toml` | Single source of truth: `[project.dependencies]`, `[tool.ruff]` (select all, ignore list), `[tool.mypy]` (strict), `[tool.pytest.ini_options]` (asyncio_mode=auto, cov settings) |

## Snelle basis

```bash
# Vereisten: Python 3.12+, Docker, uv (pip install uv)
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

# Directory structure
mkdir -p .github/workflows
mkdir -p alembic/versions
mkdir -p docker
mkdir -p src/api/v1/auth src/api/v1/users src/api/v1/items
mkdir -p src/core src/models src/schemas src/services
mkdir -p src/workers/tasks
mkdir -p tests/unit tests/integration

# Touch all source files
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

# Alembic init (generates alembic.ini — then move files into place)
uv run alembic init alembic 2>/dev/null || true

# docker-compose for local dev
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

# Install Claudient skills
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

## CLAUDE.md sjabloon

```markdown
# REST API Service

Production REST API gebouwd met FastAPI, SQLAlchemy 2.0 (async), en Celery.
Deze codebase volgt een domeingelaagde structuur: models → schemas → services → routers.
Alle DB-toegang is async. Achtergrondtaken draaien in aparte Celery workers.

## Stack

- FastAPI 0.115+ (Python 3.12) — app factory in src/main.py
- SQLAlchemy 2.0 async — models in src/models/, session in src/core/database.py
- Alembic 1.13 — migrations in alembic/versions/, draai via `make migrate`
- PostgreSQL 16 (asyncpg driver) — DATABASE_URL in .env
- Redis 7 — REDIS_URL in .env; gebruikt voor cache (aioredis) en Celery broker
- Celery 5.4 — workers in src/workers/; tasks autodiscovered van src/workers/tasks/
- Pydantic v2 — request/response schemas in src/schemas/
- Auth: JWT RS256 (python-jose) + X-API-Key header (SHA-256 opgeslagen in api_keys table)
- Testen: pytest-asyncio, httpx AsyncClient, factory-boy, geïsoleerde test DB per sessie

## Een endpoint toevoegen (exacte stappen)

1. **Model** — voeg toe of update `src/models/<domain>.py` (SQLAlchemy mapped dataclass)
2. **Migratie** — `make makemigration msg="add_<column_or_table>"` controleer dan het bestand
3. **Schema** — voeg request/response Pydantic models toe aan `src/schemas/<domain>.py`
4. **Service** — voeg business logic functie toe aan `src/services/<domain>_service.py`
   - Accepteer `AsyncSession` als eerste arg; importeer nooit `get_session` hier
   - Verhef domein exceptions van `src/core/exceptions.py`, niet HTTPException
5. **Router** — voeg de route toe aan `src/api/v1/<domain>/router.py`
   - Injecteer dependencies via `Depends(get_current_user)`, `Depends(get_session)`
   - Roep service functie aan; vang domein exceptions af; retourneer schema
6. **Test** — voeg unit test toe in `tests/unit/test_<domain>_service.py` (mock session)
   en integration test in `tests/integration/test_<domain>_routes.py` (real DB)

## Migraties uitvoeren

```bash
# Pas alle ausstekende migraties toe
make migrate

# Genereer een nieuwe migratie van modelwijzigingen
make makemigration msg="add_status_to_items"

# Draai één revisie terug
uv run alembic downgrade -1

# Toon huidige revisie
uv run alembic current
```

Migratie regels:
- Drop nooit een kolom in dezelfde PR die code ermee verwijdert — twee-staps deploy
- Test altijd `alembic downgrade -1` lokaal voordat je pushes
- Grote-tabel migraties (>1M rijen): voeg indexes CONCURRENTLY toe, use batch_alter_table

## Een Celery taak schrijven

Tasks leven in `src/workers/tasks/<domain>_tasks.py`.

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

Enqueue van een service:
```python
from src.workers.tasks.item_tasks import process_item_publish
process_item_publish.delay(item.id)
```

## Auth patronen

### JWT (Bearer token)
- Uitgave: `POST /auth/token` met email + wachtwoord → retourneert `access_token` + `refresh_token`
- Verifieer: `get_current_user` dependency in `src/api/deps.py` decodeert RS256 JWT
- Roteer: `POST /auth/refresh` met refresh_token → nieuwe access_token
- Intrekken: sla refresh token hash op in `refresh_tokens` table; controleer op elke refresh

### API Key (X-API-Key header)
- Uitgave: `POST /auth/api-keys` (authenticated user) → retourneert raw key eenmalig, slaat SHA-256 op
- Verifieer: `get_current_user` valt terug op X-API-Key header; hasht en vergelijkt
- Intrekken: `DELETE /auth/api-keys/{key_id}` — soft-delete of hard-delete rij

## Algemene SQLAlchemy patronen

**Async query met join:**
```python
stmt = select(Item).where(Item.owner_id == user_id).options(selectinload(Item.tags))
result = await session.execute(stmt)
items = result.scalars().all()
```

**Gepagineerde lijst:**
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

## Tests uitvoeren

```bash
make test                          # volledige suite met coverage
uv run pytest tests/unit/          # unit tests alleen (geen DB)
uv run pytest tests/integration/   # integration tests (vereist .env.test)
uv run pytest -k "test_auth" -v    # filter op naam
uv run pytest --lf                 # herrun alleen laatste mislukkingen
```

Test DB wordt vers gecreëerd elke sessie. `.env.test` moet `TEST_DATABASE_URL` hebben
die naar een aparte database wijst (niet de dev DB).

## Omgevingsvariabelen

Alle vereiste vars zijn in `.env.example`. Kritieke:
- `DATABASE_URL` — asyncpg formaat: `postgresql+asyncpg://user:pass@host/db`
- `REDIS_URL` — `redis://localhost:6379/0`
- `JWT_PRIVATE_KEY` — RS256 PEM (genereer: `openssl genrsa 2048`)
- `JWT_PUBLIC_KEY` — overeenkomende openbare sleutel PEM
- `JWT_ALGORITHM` — altijd `RS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES` — 15 (kort; vertrouw op refresh)
- `REFRESH_TOKEN_EXPIRE_DAYS` — 30
- `CELERY_BROKER_URL` — `redis://localhost:6379/1` (andere DB index dan cache)
- `SENTRY_DSN` — optioneel; Sentry init overgeslagen als niet ingesteld

## Wat niet te doen

- Importeer AsyncSession niet rechtstreeks in routers — use Depends(get_session)
- Verhef HTTPException niet van service layer — verhef domein exceptions van core/exceptions.py
- Gebruik niet synchrone SQLAlchemy patronen (session.query()) — use select() + await
- Commit migraties niet met --autogenerate zonder het gegenereerde bestand te beoordelen
- Sla raw API keys niet op — hash altijd SHA-256 voordat je naar DB schrijft
- Voer Celery tasks niet synchroon in request handlers uit — altijd .delay() of .apply_async()
```

## MCP servers

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

## Te installeren skills

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

## Gerelateerde

- [Backend Python Gids](../guides/for-backend-python.md)
- [API Development Workflow](../workflows/api-endpoint-development.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
