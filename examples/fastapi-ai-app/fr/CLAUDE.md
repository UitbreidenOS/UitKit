> 🇫🇷 Version française. [English version](../CLAUDE.md).

# CLAUDE.md — Application IA FastAPI

Un backend IA prêt pour la production, construit avec FastAPI et l'API Anthropic Claude. Gère les réponses en streaming, la gestion des prompts, le suivi des coûts et les opérations de base de données asynchrones.

---

## Stack technique

| Couche | Technologie |
|-------|-----------|
| Framework | FastAPI (async) |
| IA | Anthropic Claude API (claude-sonnet-4-6) |
| Base de données | PostgreSQL via SQLAlchemy async + asyncpg |
| Cache | Redis (état de session, limitation de débit) |
| Auth | JWT (python-jose) |
| File de tâches | Celery + Redis |
| Déploiement | Docker + Railway / Render |
| Tests | pytest + httpx AsyncClient |

---

## Commandes principales

```bash
uvicorn app.main:app --reload          # Serveur de développement (port 8000)
pytest tests/ -x                       # Lancer les tests, arrêt au premier échec
pytest tests/ -x --cov=app            # Avec couverture de code
alembic upgrade head                   # Appliquer les migrations DB
alembic revision --autogenerate -m "description"  # Nouvelle migration
celery -A app.celery worker -l info    # Démarrer le worker en arrière-plan
```

---

## Structure du projet

```
app/
├── main.py                    # Fabrique d'application FastAPI
├── core/
│   ├── config.py              # Paramètres via pydantic-settings
│   ├── security.py            # Utilitaires JWT
│   └── claude.py              # Singleton du client Anthropic + utilitaires
├── api/
│   ├── deps.py                # Depends() partagés : db, current_user, rate_limit
│   └── v1/
│       ├── router.py
│       └── endpoints/
│           ├── auth.py
│           ├── chat.py        # Réponses Claude en streaming
│           └── usage.py       # Rapport d'utilisation des tokens et des coûts
├── models/                    # Modèles ORM SQLAlchemy
├── schemas/                   # Schémas Pydantic requête/réponse
├── crud/                      # Opérations sur la base de données
├── services/
│   ├── ai.py                  # Logique d'orchestration de l'API Claude
│   └── billing.py             # Comptage des tokens et suivi des coûts
└── db/
    ├── session.py             # Fabrique AsyncSession
    └── migrations/            # Fichiers de migration Alembic
```

---

## Patterns fondamentaux

### Singleton du client Claude
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

### Mise en cache des prompts pour les contextes répétés
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
            "cache_control": {"type": "ephemeral"},  # Cache par utilisateur
        }],
        messages=messages,
    ) as stream:
        input_tokens = 0
        output_tokens = 0
        async for text in stream.text_stream:
            yield text
        # Journaliser l'utilisation après la fin du stream
        usage = stream.get_final_message().usage
        await log_usage(user_id, usage, db)
```

### Limitation de débit via Redis
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

### Suivi des coûts
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

## Anti-patterns — À ne PAS faire

- **Ne jamais appeler `anthropic.Anthropic()` dans un gestionnaire de requête** — instancier une seule fois via `get_claude_client()`
- **Ne jamais stocker les réponses brutes de l'API en base de données** — stocker uniquement les comptages de tokens et les données extraites
- **Ne jamais exposer `ANTHROPIC_API_KEY` dans les réponses ou les journaux** — elle doit rester côté serveur uniquement
- **Ne jamais utiliser `asyncio.run()` dans une route FastAPI** — FastAPI est déjà asynchrone ; utilisez simplement `await`
- **Ne jamais omettre la mise en cache des prompts système** — toujours ajouter `cache_control` aux prompts système de plus de 1024 tokens

---

## Variables d'environnement

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

## Ajouter une nouvelle fonctionnalité IA

1. Ajouter le template de prompt dans `app/services/prompts/` sous forme de fichier `.txt` ou chaîne Python
2. Ajouter la fonction de service dans `app/services/ai.py` — toujours accepter `db` pour la journalisation d'utilisation
3. Ajouter l'endpoint dans `app/api/v1/endpoints/`
4. Ajouter le schéma Pydantic pour la requête/réponse
5. Écrire les tests avec `AsyncClient` et une vraie base de données de test (ne jamais simuler la DB)
