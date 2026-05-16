# CLAUDE.md — FastAPI AI Application

A production-ready AI product backend built with FastAPI and the Anthropic Claude API. Handles streaming responses, prompt management, cost tracking, and async database operations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI (async) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Database | PostgreSQL via SQLAlchemy async + asyncpg |
| Cache | Redis (session state, rate limiting) |
| Auth | JWT (python-jose) |
| Task queue | Celery + Redis |
| Deployment | Docker + Railway / Render |
| Testing | pytest + httpx AsyncClient |

---

## Key Commands

```bash
uvicorn app.main:app --reload          # Dev server (port 8000)
pytest tests/ -x                       # Run tests, stop on first failure
pytest tests/ -x --cov=app            # With coverage
alembic upgrade head                   # Apply DB migrations
alembic revision --autogenerate -m "description"  # New migration
celery -A app.celery worker -l info    # Start background worker
```

---

## Project Structure

```
app/
├── main.py                    # FastAPI app factory
├── core/
│   ├── config.py              # Settings via pydantic-settings
│   ├── security.py            # JWT helpers
│   └── claude.py              # Anthropic client singleton + helpers
├── api/
│   ├── deps.py                # Shared Depends(): db, current_user, rate_limit
│   └── v1/
│       ├── router.py
│       └── endpoints/
│           ├── auth.py
│           ├── chat.py        # Streaming Claude responses
│           └── usage.py       # Token usage and cost reporting
├── models/                    # SQLAlchemy ORM models
├── schemas/                   # Pydantic request/response schemas
├── crud/                      # DB operations
├── services/
│   ├── ai.py                  # Claude API orchestration logic
│   └── billing.py             # Token counting and cost tracking
└── db/
    ├── session.py             # AsyncSession factory
    └── migrations/            # Alembic migration files
```

---

## Core Patterns

### Claude client singleton
```python
# core/claude.py
import anthropic
from functools import lru_cache
from app.core.config import settings

@lru_cache(maxsize=1)
def get_claude_client() -> anthropic.Anthropic:
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
```

### Streaming endpoint
```python
# api/v1/endpoints/chat.py
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from app.api.deps import get_current_user, get_db
from app.services.ai import stream_chat

router = APIRouter()

@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    async def generator():
        async for chunk in stream_chat(request.messages, current_user.id, db):
            yield f"data: {chunk}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(generator(), media_type="text/event-stream")
```

### Prompt caching for repeated context
```python
# services/ai.py
async def stream_chat(messages: list, user_id: int, db: AsyncSession):
    client = get_claude_client()
    system_prompt = await get_user_system_prompt(user_id, db)

    with client.messages.stream(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        system=[{
            "type": "text",
            "text": system_prompt,
            "cache_control": {"type": "ephemeral"},  # Cache per user
        }],
        messages=messages,
    ) as stream:
        input_tokens = 0
        output_tokens = 0
        async for text in stream.text_stream:
            yield text
        # Log usage after stream completes
        usage = stream.get_final_message().usage
        await log_usage(user_id, usage, db)
```

### Rate limiting via Redis
```python
# api/deps.py
async def rate_limit(
    request: Request,
    current_user: User = Depends(get_current_user),
    redis: Redis = Depends(get_redis),
):
    key = f"rate:{current_user.id}:{datetime.utcnow().strftime('%Y%m%d%H')}"
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, 3600)
    if count > settings.HOURLY_RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")
```

### Cost tracking
```python
# services/billing.py
COST_PER_MTK = {
    "claude-sonnet-4-6": {"input": 0.003, "output": 0.015},
    "claude-haiku-4-5-20251001": {"input": 0.00025, "output": 0.00125},
}

def calculate_cost(model: str, input_tokens: int, output_tokens: int, cache_read: int = 0) -> float:
    rates = COST_PER_MTK.get(model, COST_PER_MTK["claude-sonnet-4-6"])
    input_cost = (input_tokens - cache_read) * rates["input"] / 1_000_000
    cache_cost = cache_read * rates["input"] * 0.1 / 1_000_000  # 90% discount
    output_cost = output_tokens * rates["output"] / 1_000_000
    return input_cost + cache_cost + output_cost
```

---

## Anti-Patterns — Do NOT

- **Never call `anthropic.Anthropic()` inside a request handler** — instantiate once via `get_claude_client()`
- **Never store raw API responses in the DB** — store token counts and extracted data only
- **Never expose `ANTHROPIC_API_KEY` in responses or logs** — it must stay server-side only
- **Never use `asyncio.run()` inside a FastAPI route** — FastAPI is already async; just `await`
- **Never skip prompt caching for system prompts** — always add `cache_control` to system prompts > 1024 tokens

---

## Environment Variables

```
DATABASE_URL=postgresql+asyncpg://...
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=<openssl rand -base64 32>
JWT_EXPIRE_MINUTES=1440
HOURLY_RATE_LIMIT=100
ENVIRONMENT=development
```

---

## Adding a New AI Feature

1. Add prompt template to `app/services/prompts/` as a plain `.txt` or Python string
2. Add service function in `app/services/ai.py` — always accept `db` for usage logging
3. Add endpoint in `app/api/v1/endpoints/`
4. Add Pydantic schema for request/response
5. Write tests using `AsyncClient` with a real test DB (never mock the DB)
