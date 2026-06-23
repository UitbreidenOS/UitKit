# CLAUDE.md — FastAPI AI Backend (Annotated Example)
> FastAPI service powering an AI product — LangChain orchestration, PostgreSQL + pgvector, async throughout — shows how to express AI-specific constraints Claude must follow.

<!-- ANNOTATION: The first sentence is a contract. "Async throughout" tells Claude to never write sync database calls or blocking I/O. This one phrase prevents an entire class of performance bugs. -->
This is a production FastAPI service. Everything is async — no sync database calls, no blocking I/O in route handlers. Python 3.12. Dependencies managed with Poetry.

## Stack

<!-- ANNOTATION: Pinning library versions here is intentional. LangChain has breaking changes across minor versions. Claude knowing the exact version picks the right import paths and avoids deprecated APIs. -->
- FastAPI 0.115
- LangChain 0.3 + LangChain-Community 0.3 (not 0.1/0.2 — APIs differ significantly)
- SQLAlchemy 2.0 async (ORM mode)
- asyncpg driver (not psycopg2)
- PostgreSQL 16 + pgvector extension
- Pydantic v2 (not v1 — validators and model syntax differ)
- Celery + Redis for background tasks
- pytest-asyncio for tests

## Project Structure

```
app/
  api/v1/         # Route handlers — thin, delegate to services
  services/       # Business logic — one file per domain
  models/         # SQLAlchemy ORM models
  schemas/        # Pydantic request/response schemas
  chains/         # LangChain chain definitions
  agents/         # LangChain agent definitions
  db/             # Database session, migrations (Alembic)
  core/           # Config, logging, middleware
  workers/        # Celery tasks
tests/
  unit/
  integration/
  fixtures/
```

## Async Database Rules

<!-- ANNOTATION: SQLAlchemy 2.0 async has specific session patterns. Without this, Claude might use the sync `session.query()` API or forget to await. These rules prevent the most common async ORM mistakes. -->
- Always use `async with get_session() as session:` — never create sessions manually
- Use `session.execute(select(...))` not `session.query(...)` — the old query API is removed in 2.0
- All relationships must be loaded explicitly with `selectinload()` or `joinedload()` — lazy loading raises `MissingGreenlet` in async context
- Use `await session.commit()` and `await session.refresh(obj)` after mutations
- Alembic migrations live in `alembic/versions/` — run `alembic revision --autogenerate` to create

## Pydantic v2 Rules

<!-- ANNOTATION: Pydantic v2 is not backwards compatible with v1. These two bullet points alone prevent 80% of migration-era bugs that appear when Claude uses v1 syntax on a v2 project. -->
- Use `model_validator` not `root_validator`, `field_validator` not `validator`
- Use `model_config = ConfigDict(...)` not `class Config:`
- Response schemas inherit from `BaseModel` — do not use `orm_mode = True`, use `model_config = ConfigDict(from_attributes=True)`

## LangChain Patterns

<!-- ANNOTATION: LangChain 0.3 uses LCEL (pipe syntax) as the primary composition model. Stating this prevents Claude from writing legacy `LLMChain` patterns that still appear in its training data. -->
- Use LCEL (pipe `|` syntax) for all chain composition — no `LLMChain`, no `SequentialChain`
- Chains are defined in `app/chains/` as functions returning a `Runnable`
- Always use `ainvoke()` / `astream()` — never `invoke()` in an async context
- Prompts live in `app/chains/prompts/` as `ChatPromptTemplate` objects, not inline strings
- LLM client is instantiated once in `app/core/llm.py` and imported — no inline instantiation in routes

## Vector Search

<!-- ANNOTATION: pgvector queries have a specific pattern. Without this, Claude might try to use a separate vector DB or write raw SQL instead of the ORM extension. -->
- Use `pgvector.sqlalchemy` for vector columns: `Vector(1536)` type
- Embeddings are generated in `app/services/embeddings.py` using the OpenAI `text-embedding-3-small` model
- Similarity search uses `l2_distance` or `cosine_distance` operators from `pgvector.sqlalchemy`
- Always index vector columns with `HNSW` — `IVFFlat` is too slow for our data size

## API Design

- All routes are versioned under `/api/v1/`
- Route handlers are thin: validate input (Pydantic), call a service function, return a schema
- Use `HTTPException` for expected errors, let the global exception handler catch unexpected ones
- Streaming responses use `StreamingResponse` with an `async_generator`
- Long-running jobs are dispatched to Celery — never `await` them in a route handler

## Background Tasks

<!-- ANNOTATION: Distinguishing Celery from FastAPI BackgroundTasks prevents the mistake of using the lighter-weight option for tasks that survive request cancellation. -->
- Use Celery for tasks that must survive request cancellation or take > 2 seconds
- Use FastAPI `BackgroundTasks` only for fire-and-forget tasks tied to the request lifecycle (e.g., audit logging)
- All Celery tasks are in `app/workers/` and are idempotent

## Testing

- All tests are async — use `@pytest.mark.asyncio` and `AsyncClient`
- Integration tests run against a real local Postgres with pgvector
- Mock the LLM with `langchain_core.runnables.fake.FakeListLLM` in unit tests — never hit the real API
- Use `pytest-cov` and maintain > 80% coverage on `app/services/`

## Environment Variables

```
DATABASE_URL         # asyncpg connection string
OPENAI_API_KEY       # LLM and embeddings
REDIS_URL            # Celery broker
SECRET_KEY           # JWT signing
ENVIRONMENT          # development | staging | production
```

## What Not To Do

<!-- ANNOTATION: "No sync DB calls" appears both in the opening and here. Repetition is intentional — this is the most common mistake in async FastAPI projects and worth stating twice. -->
- Do not use `psycopg2` or any sync DB driver
- Do not use `session.query()` — use `session.execute(select(...))`
- Do not instantiate LLM clients inside route handlers
- Do not call `chain.invoke()` in async code — use `ainvoke()`
- Do not define Pydantic models with v1 syntax (`class Config`, `@validator`)
- Do not run long tasks synchronously in route handlers — dispatch to Celery
