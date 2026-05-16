> 🇩🇪 Deutsche Version. [Englische Version](../CLAUDE.md).

# CLAUDE.md — FastAPI AI-Anwendung

Ein produktionsreifes AI-Backend für Produkte, aufgebaut mit FastAPI und der Anthropic Claude API. Verarbeitet Streaming-Antworten, Prompt-Verwaltung, Kostenverfolgung und asynchrone Datenbankoperationen.

---

## Tech-Stack

| Schicht | Technologie |
|---------|------------|
| Framework | FastAPI (async) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Datenbank | PostgreSQL via SQLAlchemy async + asyncpg |
| Cache | Redis (Session-Zustand, Rate-Limiting) |
| Authentifizierung | JWT (python-jose) |
| Task-Queue | Celery + Redis |
| Deployment | Docker + Railway / Render |
| Testing | pytest + httpx AsyncClient |

---

## Wichtige Befehle

```bash
uvicorn app.main:app --reload          # Entwicklungsserver (Port 8000)
pytest tests/ -x                       # Tests ausführen, beim ersten Fehler stoppen
pytest tests/ -x --cov=app            # Mit Coverage
alembic upgrade head                   # DB-Migrationen anwenden
alembic revision --autogenerate -m "description"  # Neue Migration
celery -A app.celery worker -l info    # Hintergrund-Worker starten
```

---

## Projektstruktur

```
app/
├── main.py                    # FastAPI App-Factory
├── core/
│   ├── config.py              # Einstellungen via pydantic-settings
│   ├── security.py            # JWT-Hilfsfunktionen
│   └── claude.py              # Anthropic Client-Singleton + Hilfsfunktionen
├── api/
│   ├── deps.py                # Gemeinsame Depends(): db, current_user, rate_limit
│   └── v1/
│       ├── router.py
│       └── endpoints/
│           ├── auth.py
│           ├── chat.py        # Streaming Claude-Antworten
│           └── usage.py       # Token-Nutzung und Kostenberichte
├── models/                    # SQLAlchemy ORM-Modelle
├── schemas/                   # Pydantic Request-/Response-Schemas
├── crud/                      # Datenbankoperationen
├── services/
│   ├── ai.py                  # Claude API-Orchestrierungslogik
│   └── billing.py             # Token-Zählung und Kostenverfolgung
└── db/
    ├── session.py             # AsyncSession-Factory
    └── migrations/            # Alembic-Migrationsdateien
```

---

## Kernmuster

### Claude Client-Singleton
```python
# core/claude.py
import anthropic
from functools import lru_cache
from app.core.config import settings

@lru_cache(maxsize=1)
def get_claude_client() -> anthropic.Anthropic:
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
```

### Streaming-Endpunkt
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

### Prompt-Caching für wiederholten Kontext
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

### Rate-Limiting via Redis
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

### Kostenverfolgung
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

## Anti-Muster — NICHT tun

- **Niemals `anthropic.Anthropic()` innerhalb eines Request-Handlers aufrufen** — einmalig via `get_claude_client()` instanziieren
- **Niemals rohe API-Antworten in der Datenbank speichern** — nur Token-Zählungen und extrahierte Daten speichern
- **Niemals `ANTHROPIC_API_KEY` in Antworten oder Logs preisgeben** — muss ausschließlich serverseitig bleiben
- **Niemals `asyncio.run()` innerhalb einer FastAPI-Route verwenden** — FastAPI ist bereits async; einfach `await` nutzen
- **Niemals Prompt-Caching für System-Prompts überspringen** — immer `cache_control` zu System-Prompts > 1024 Token hinzufügen

---

## Umgebungsvariablen

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

## Ein neues AI-Feature hinzufügen

1. Prompt-Template als einfache `.txt`- oder Python-Zeichenkette zu `app/services/prompts/` hinzufügen
2. Service-Funktion in `app/services/ai.py` hinzufügen — immer `db` für die Nutzungsprotokollierung akzeptieren
3. Endpunkt in `app/api/v1/endpoints/` hinzufügen
4. Pydantic-Schema für Request/Response hinzufügen
5. Tests mit `AsyncClient` und einer echten Test-Datenbank schreiben (Datenbank niemals mocken)
