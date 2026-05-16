> 🇳🇱 Nederlandse versie. [Engelse versie](../CLAUDE.md).

# CLAUDE.md — FastAPI AI-applicatie

Een productieklare AI-productbackend gebouwd met FastAPI en de Anthropic Claude API. Verwerkt streaming responses, promptbeheer, kostenbewaking en asynchrone databasebewerkingen.

---

## Tech Stack

| Laag | Technologie |
|-------|-----------|
| Framework | FastAPI (async) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Database | PostgreSQL via SQLAlchemy async + asyncpg |
| Cache | Redis (sessietoestand, rate limiting) |
| Auth | JWT (python-jose) |
| Taakrij | Celery + Redis |
| Deployment | Docker + Railway / Render |
| Testen | pytest + httpx AsyncClient |

---

## Belangrijkste commando's

```bash
uvicorn app.main:app --reload          # Dev server (poort 8000)
pytest tests/ -x                       # Tests uitvoeren, stoppen bij eerste fout
pytest tests/ -x --cov=app            # Met dekking
alembic upgrade head                   # DB-migraties toepassen
alembic revision --autogenerate -m "description"  # Nieuwe migratie
celery -A app.celery worker -l info    # Achtergrondwerker starten
```

---

## Projectstructuur

```
app/
├── main.py                    # FastAPI app factory
├── core/
│   ├── config.py              # Instellingen via pydantic-settings
│   ├── security.py            # JWT-hulpfuncties
│   └── claude.py              # Anthropic client singleton + hulpfuncties
├── api/
│   ├── deps.py                # Gedeelde Depends(): db, current_user, rate_limit
│   └── v1/
│       ├── router.py
│       └── endpoints/
│           ├── auth.py
│           ├── chat.py        # Streaming Claude responses
│           └── usage.py       # Token-gebruik en kostenrapportage
├── models/                    # SQLAlchemy ORM-modellen
├── schemas/                   # Pydantic request/response-schema's
├── crud/                      # DB-bewerkingen
├── services/
│   ├── ai.py                  # Claude API-orkestratie logica
│   └── billing.py             # Tokens tellen en kosten bijhouden
└── db/
    ├── session.py             # AsyncSession factory
    └── migrations/            # Alembic migratiebestanden
```

---

## Kernpatronen

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

### Prompt caching voor herhaalde context
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

### Kostenbewaking
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

## Anti-patronen — Doe dit NIET

- **Roep `anthropic.Anthropic()` nooit aan binnen een request handler** — instantieer eenmalig via `get_claude_client()`
- **Sla nooit ruwe API-responses op in de DB** — sla alleen tokenaantallen en geëxtraheerde data op
- **Stel `ANTHROPIC_API_KEY` nooit bloot in responses of logs** — deze sleutel moet uitsluitend server-side blijven
- **Gebruik `asyncio.run()` nooit binnen een FastAPI-route** — FastAPI is al async; gebruik gewoon `await`
- **Sla prompt caching voor systeemprompts nooit over** — voeg altijd `cache_control` toe aan systeemprompts van meer dan 1024 tokens

---

## Omgevingsvariabelen

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

## Een nieuwe AI-functie toevoegen

1. Voeg een prompttemplate toe aan `app/services/prompts/` als een gewoon `.txt`-bestand of Python-string
2. Voeg een servicefunctie toe in `app/services/ai.py` — accepteer altijd `db` voor gebruiksregistratie
3. Voeg een endpoint toe in `app/api/v1/endpoints/`
4. Voeg een Pydantic-schema toe voor request/response
5. Schrijf tests met `AsyncClient` en een echte test-DB (mock de DB nooit)
