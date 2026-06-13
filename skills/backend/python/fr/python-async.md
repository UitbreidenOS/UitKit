---
name: python-async
description: "Python asyncio patterns: async/await, concurrent tasks, aiohttp, timeouts, queues, background tasks, common pitfalls"
---

> 🇫🇷 Version française. [English version](../python-async.md).

# Compétence Python Async

## Quand activer
- Écriture de code Python asynchrone avec `asyncio`
- Exécution d'opérations I/O en parallèle (plusieurs appels API, requêtes DB)
- Utilisation de `aiohttp` pour des requêtes HTTP asynchrones
- Gestion des tâches en arrière-plan dans FastAPI ou d'autres frameworks asynchrones
- Débogage de code asynchrone (problèmes de boucle d'événements, deadlocks, appels bloquants)
- Mise en place de files de tâches asynchrones ou de patterns worker

## Quand NE PAS utiliser
- Travail lié au CPU — async n'aide pas ici, utilisez `multiprocessing` ou `ProcessPoolExecutor`
- Scripts simples avec un ou deux appels I/O séquentiels — `requests` est plus simple
- Quand la bibliothèque dont vous avez besoin n'a qu'une interface synchrone — encapsulez-la plutôt

## Instructions

### Patterns de base

```python
import asyncio

# Coroutine de base
async def fetch_user(user_id: int) -> dict:
    await asyncio.sleep(0.1)  # simulates I/O
    return {"id": user_id, "name": "Alice"}

# Exécuter une coroutine
user = asyncio.run(fetch_user(1))

# Await dans un contexte asynchrone
async def main():
    user = await fetch_user(1)
    print(user)
```

### Exécution concurrente — la compétence clé

```python
# Séquentiel (lent — attend chaque appel)
async def fetch_all_sequential(ids: list[int]) -> list[dict]:
    results = []
    for id in ids:  # each waits for the previous
        results.append(await fetch_user(id))
    return results

# Concurrent avec gather (tous démarrent en même temps)
async def fetch_all_concurrent(ids: list[int]) -> list[dict]:
    tasks = [fetch_user(id) for id in ids]
    return await asyncio.gather(*tasks)  # runs all concurrently

# gather avec gestion d'erreur (return_exceptions empêche un échec d'arrêter tout)
results = await asyncio.gather(*tasks, return_exceptions=True)
users = [r for r in results if not isinstance(r, Exception)]
errors = [r for r in results if isinstance(r, Exception)]
```

### TaskGroup (Python 3.11+ — concurrence structurée)

```python
# TaskGroup est plus sûr que gather — annule toutes les tâches si l'une échoue
async def fetch_dashboard(user_id: str) -> dict:
    async with asyncio.TaskGroup() as tg:
        user_task    = tg.create_task(fetch_user(user_id))
        orders_task  = tg.create_task(fetch_orders(user_id))
        metrics_task = tg.create_task(fetch_metrics(user_id))
    # All tasks finished by here (or all cancelled if any raised)
    return {
        "user":    user_task.result(),
        "orders":  orders_task.result(),
        "metrics": metrics_task.result(),
    }
```

### Timeouts

```python
import asyncio

# Timeout pour une seule opération
try:
    result = await asyncio.wait_for(fetch_user(id), timeout=5.0)
except asyncio.TimeoutError:
    raise HTTPException(504, "Upstream timed out")

# Timeout pour un groupe (Python 3.11+)
try:
    async with asyncio.timeout(10.0):
        async with asyncio.TaskGroup() as tg:
            t1 = tg.create_task(call_service_a())
            t2 = tg.create_task(call_service_b())
except TimeoutError:
    # Both tasks were cancelled
    ...
```

### aiohttp — client HTTP asynchrone

```python
import aiohttp

# La réutilisation de session est essentielle — ne créez pas une nouvelle session par requête
class HttpClient:
    _session: aiohttp.ClientSession | None = None

    @classmethod
    async def get_session(cls) -> aiohttp.ClientSession:
        if cls._session is None or cls._session.closed:
            cls._session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=10),
                headers={"User-Agent": "myapp/1.0"},
            )
        return cls._session

    @classmethod
    async def close(cls):
        if cls._session:
            await cls._session.close()

# Requête unique
async def fetch_github_user(username: str) -> dict:
    session = await HttpClient.get_session()
    async with session.get(f"https://api.github.com/users/{username}") as resp:
        resp.raise_for_status()
        return await resp.json()

# Plusieurs requêtes concurrentes
async def fetch_many(urls: list[str]) -> list[dict]:
    session = await HttpClient.get_session()
    async def fetch(url: str) -> dict:
        async with session.get(url) as resp:
            resp.raise_for_status()
            return await resp.json()
    return await asyncio.gather(*[fetch(url) for url in urls])
```

### Tâches en arrière-plan dans FastAPI

```python
from fastapi import BackgroundTasks

@router.post("/orders")
async def create_order(
    payload: CreateOrderRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    order = await order_service.create(db, payload)

    # Queue side effects — run after response is sent
    background_tasks.add_task(send_confirmation_email, order.id)
    background_tasks.add_task(update_inventory, order.items)

    return order

# Pour les tâches longues, utilisez une vraie file (Celery, arq, dramatiq)
```

### Files asynchrones pour producteur-consommateur

```python
import asyncio

async def producer(queue: asyncio.Queue, items: list):
    for item in items:
        await queue.put(item)
    # Signal completion
    await queue.put(None)

async def consumer(queue: asyncio.Queue, worker_id: int):
    while True:
        item = await queue.get()
        if item is None:
            queue.task_done()
            break  # sentinel received, shut down
        await process(item)
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=100)  # backpressure
    items = list(range(1000))

    # 5 workers concurrents
    workers = [asyncio.create_task(consumer(queue, i)) for i in range(5)]
    await producer(queue, items)
    await queue.join()  # wait for all items processed
    for w in workers:
        w.cancel()
```

### Semaphore — limiter la concurrence

```python
# Limiter à 10 requêtes sortantes simultanées (évite de surcharger les APIs externes)
semaphore = asyncio.Semaphore(10)

async def fetch_with_limit(url: str) -> dict:
    async with semaphore:
        async with session.get(url) as resp:
            return await resp.json()

results = await asyncio.gather(*[fetch_with_limit(url) for url in urls])
```

### Pièges courants

**Bloquer la boucle d'événements (l'erreur async #1) :**
```python
# Mauvais — time.sleep() bloque toute la boucle d'événements
async def do_work():
    time.sleep(1)          # ❌ blocks all other coroutines
    requests.get(url)      # ❌ sync HTTP library in async context

# Bon
async def do_work():
    await asyncio.sleep(1)         # ✅ yields control
    async with session.get(url):   # ✅ async HTTP
        ...

# Exécuter du code bloquant synchrone dans un thread pool
result = await asyncio.get_event_loop().run_in_executor(
    None, sync_blocking_function, arg1, arg2
)
```

**Oublier d'await :**
```python
# Mauvais — crée un objet coroutine, ne l'exécute pas
async def bad():
    result = fetch_user(1)  # ❌ missing await — just creates coroutine

# Bon
async def good():
    result = await fetch_user(1)  # ✅
```

**Créer des tâches sans les attendre :**
```python
# Mauvais — le "fire and forget" peut causer la perte silencieuse d'erreurs
async def bad():
    asyncio.create_task(risky_operation())  # errors are swallowed

# Bon — gardez une référence et gérez les erreurs
async def good():
    task = asyncio.create_task(risky_operation())
    task.add_done_callback(lambda t: t.exception() and log_error(t.exception()))
```

### Gestionnaires de contexte asynchrones

```python
class AsyncDatabaseConnection:
    async def __aenter__(self):
        self.conn = await asyncpg.connect(DATABASE_URL)
        return self.conn

    async def __aexit__(self, exc_type, exc, tb):
        await self.conn.close()

async def main():
    async with AsyncDatabaseConnection() as conn:
        await conn.fetch("SELECT 1")

# async generator pour le streaming
async def stream_rows(query: str):
    async with AsyncDatabaseConnection() as conn:
        async for row in conn.cursor(query):
            yield dict(row)

async def process():
    async for row in stream_rows("SELECT * FROM large_table"):
        await handle(row)
```

## Exemple

**Utilisateur :** Récupérer des données depuis 3 APIs externes en parallèle avec des timeouts individuels, relancer les requêtes échouées une fois, et retourner des résultats partiels si certaines échouent — le tout dans un budget total de 10 secondes.

**Résultat attendu :**
```python
async def fetch_dashboard(user_id: str) -> DashboardData:
    async with asyncio.timeout(10.0):
        async with asyncio.TaskGroup() as tg:
            profile_task = tg.create_task(
                fetch_with_retry(f"/profiles/{user_id}", timeout=3)
            )
            orders_task = tg.create_task(
                fetch_with_retry(f"/orders/{user_id}", timeout=5)
            )
            metrics_task = tg.create_task(
                fetch_with_retry(f"/metrics/{user_id}", timeout=3)
            )
    return DashboardData(
        profile=profile_task.result(),
        orders=orders_task.result(),
        metrics=metrics_task.result(),
    )
```

---
