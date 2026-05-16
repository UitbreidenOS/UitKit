> 🇪🇸 Versión en español. [Versión en inglés](../CLAUDE.md).

# CLAUDE.md — Aplicación de IA con FastAPI

Un backend de producto de IA listo para producción, construido con FastAPI y la API de Claude de Anthropic. Gestiona respuestas en streaming, administración de prompts, seguimiento de costos y operaciones asíncronas con la base de datos.

---

## Stack tecnológico

| Capa | Tecnología |
|-------|-----------|
| Framework | FastAPI (async) |
| IA | Anthropic Claude API (claude-sonnet-4-6) |
| Base de datos | PostgreSQL mediante SQLAlchemy async + asyncpg |
| Caché | Redis (estado de sesión, limitación de tasa) |
| Autenticación | JWT (python-jose) |
| Cola de tareas | Celery + Redis |
| Despliegue | Docker + Railway / Render |
| Pruebas | pytest + httpx AsyncClient |

---

## Comandos principales

```bash
uvicorn app.main:app --reload          # Servidor de desarrollo (puerto 8000)
pytest tests/ -x                       # Ejecutar pruebas, detener en el primer fallo
pytest tests/ -x --cov=app            # Con cobertura de código
alembic upgrade head                   # Aplicar migraciones de BD
alembic revision --autogenerate -m "description"  # Nueva migración
celery -A app.celery worker -l info    # Iniciar worker en segundo plano
```

---

## Estructura del proyecto

```
app/
├── main.py                    # Fábrica de la aplicación FastAPI
├── core/
│   ├── config.py              # Configuración mediante pydantic-settings
│   ├── security.py            # Utilidades JWT
│   └── claude.py              # Singleton del cliente Anthropic + utilidades
├── api/
│   ├── deps.py                # Depends() compartidos: db, current_user, rate_limit
│   └── v1/
│       ├── router.py
│       └── endpoints/
│           ├── auth.py
│           ├── chat.py        # Respuestas Claude en streaming
│           └── usage.py       # Reportes de uso de tokens y costos
├── models/                    # Modelos ORM de SQLAlchemy
├── schemas/                   # Esquemas Pydantic de solicitud/respuesta
├── crud/                      # Operaciones con la BD
├── services/
│   ├── ai.py                  # Lógica de orquestación de la Claude API
│   └── billing.py             # Conteo de tokens y seguimiento de costos
└── db/
    ├── session.py             # Fábrica de AsyncSession
    └── migrations/            # Archivos de migración de Alembic
```

---

## Patrones fundamentales

### Singleton del cliente Claude
```python
# core/claude.py
import anthropic
from functools import lru_cache
from app.core.config import settings

@lru_cache(maxsize=1)
def get_claude_client() -> anthropic.Anthropic:
    return anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)
```

### Endpoint de streaming
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

### Caché de prompts para contexto repetido
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
            "cache_control": {"type": "ephemeral"},  # Caché por usuario
        }],
        messages=messages,
    ) as stream:
        input_tokens = 0
        output_tokens = 0
        async for text in stream.text_stream:
            yield text
        # Registrar uso después de que el stream finalice
        usage = stream.get_final_message().usage
        await log_usage(user_id, usage, db)
```

### Limitación de tasa mediante Redis
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

### Seguimiento de costos
```python
# services/billing.py
COST_PER_MTK = {
    "claude-sonnet-4-6": {"input": 0.003, "output": 0.015},
    "claude-haiku-4-5-20251001": {"input": 0.00025, "output": 0.00125},
}

def calculate_cost(model: str, input_tokens: int, output_tokens: int, cache_read: int = 0) -> float:
    rates = COST_PER_MTK.get(model, COST_PER_MTK["claude-sonnet-4-6"])
    input_cost = (input_tokens - cache_read) * rates["input"] / 1_000_000
    cache_cost = cache_read * rates["input"] * 0.1 / 1_000_000  # 90% de descuento
    output_cost = output_tokens * rates["output"] / 1_000_000
    return input_cost + cache_cost + output_cost
```

---

## Antipatrones — NO hacer

- **Nunca llamar `anthropic.Anthropic()` dentro de un manejador de solicitudes** — instanciar una sola vez mediante `get_claude_client()`
- **Nunca almacenar respuestas crudas de la API en la BD** — guardar únicamente conteos de tokens y datos extraídos
- **Nunca exponer `ANTHROPIC_API_KEY` en respuestas o logs** — debe permanecer exclusivamente en el servidor
- **Nunca usar `asyncio.run()` dentro de una ruta FastAPI** — FastAPI ya es asíncrono; simplemente usar `await`
- **Nunca omitir la caché de prompts para system prompts** — siempre añadir `cache_control` a system prompts de más de 1024 tokens

---

## Variables de entorno

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

## Agregar una nueva funcionalidad de IA

1. Agregar la plantilla de prompt en `app/services/prompts/` como archivo `.txt` plano o cadena Python
2. Agregar función de servicio en `app/services/ai.py` — siempre aceptar `db` para el registro de uso
3. Agregar endpoint en `app/api/v1/endpoints/`
4. Agregar esquema Pydantic para solicitud/respuesta
5. Escribir pruebas usando `AsyncClient` con una BD de prueba real (nunca simular la BD)
