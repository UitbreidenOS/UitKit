---
name: python-async
description: "Python asyncio patterns: async/await, concurrent tasks, aiohttp, timeouts, queues, background tasks, common pitfalls"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../python-async.md).

# Python Async Skill

## Wanneer activeren
- Schrijven van asynchrone Python-code met `asyncio`
- Gelijktijdig uitvoeren van I/O-operaties (meerdere API-aanroepen, DB-queries)
- Gebruik van `aiohttp` voor asynchrone HTTP-verzoeken
- Beheren van achtergrondtaken in FastAPI of andere asynchrone frameworks
- Debuggen van asynchrone code (event loop-problemen, deadlocks, blokkerende aanroepen)
- Opzetten van asynchrone task queues of worker-patronen

## Wanneer NIET gebruiken
- CPU-gebonden werk — async helpt hier niet, gebruik `multiprocessing` of `ProcessPoolExecutor`
- Eenvoudige scripts met één of twee sequentiële I/O-aanroepen — `requests` is eenvoudiger
- Als de benodigde bibliotheek alleen een synchrone interface heeft — wikkel deze dan in

## Instructies

### Kernpatronen

```python
import asyncio

# Basis coroutine
async def fetch_user(user_id: int) -> dict:
    await asyncio.sleep(0.1)  # simulates I/O
    return {"id": user_id, "name": "Alice"}

# Een coroutine uitvoeren
user = asyncio.run(fetch_user(1))

# Await in een asynchrone context
async def main():
    user = await fetch_user(1)
    print(user)
```

### Gelijktijdige uitvoering — de kernvaardigheid

```python
# Sequentieel (langzaam — wacht op elke aanroep)
async def fetch_all_sequential(ids: list[int]) -> list[dict]:
    results = []
    for id in ids:  # each waits for the previous
        results.append(await fetch_user(id))
    return results

# Gelijktijdig met gather (alle starten tegelijk)
async def fetch_all_concurrent(ids: list[int]) -> list[dict]:
    tasks = [fetch_user(id) for id in ids]
    return await asyncio.gather(*tasks)  # runs all concurrently

# gather met foutafhandeling (return_exceptions voorkomt dat één mislukking alles stopt)
results = await asyncio.gather(*tasks, return_exceptions=True)
users = [r for r in results if not isinstance(r, Exception)]
errors = [r for r in results if isinstance(r, Exception)]
```

### TaskGroup (Python 3.11+ — gestructureerde gelijktijdigheid)

```python
# TaskGroup is veiliger dan gather — annuleert alle taken als één mislukt
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

# Timeout voor een enkele operatie
try:
    result = await asyncio.wait_for(fetch_user(id), timeout=5.0)
except asyncio.TimeoutError:
    raise HTTPException(504, "Upstream timed out")

# Timeout voor een groep (Python 3.11+)
try:
    async with asyncio.timeout(10.0):
        async with asyncio.TaskGroup() as tg:
            t1 = tg.create_task(call_service_a())
            t2 = tg.create_task(call_service_b())
except TimeoutError:
    # Both tasks were cancelled
    ...
```

### aiohttp — asynchrone HTTP-client

```python
import aiohttp

# Hergebruik van sessies is essentieel — maak geen nieuwe sessie per verzoek aan
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

# Enkel verzoek
async def fetch_github_user(username: str) -> dict:
    session = await HttpClient.get_session()
    async with session.get(f"https://api.github.com/users/{username}") as resp:
        resp.raise_for_status()
        return await resp.json()

# Meerdere gelijktijdige verzoeken
async def fetch_many(urls: list[str]) -> list[dict]:
    session = await HttpClient.get_session()
    async def fetch(url: str) -> dict:
        async with session.get(url) as resp:
            resp.raise_for_status()
            return await resp.json()
    return await asyncio.gather(*[fetch(url) for url in urls])
```

### Achtergrondtaken in FastAPI

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

# Voor langlopende taken, gebruik een echte queue (Celery, arq, dramatiq)
```

### Asynchrone queues voor producent-consument

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

    # 5 gelijktijdige workers
    workers = [asyncio.create_task(consumer(queue, i)) for i in range(5)]
    await producer(queue, items)
    await queue.join()  # wait for all items processed
    for w in workers:
        w.cancel()
```

### Semaphore — gelijktijdigheid beperken

```python
# Beperken tot 10 gelijktijdige uitgaande verzoeken (externe APIs niet overbelasten)
semaphore = asyncio.Semaphore(10)

async def fetch_with_limit(url: str) -> dict:
    async with semaphore:
        async with session.get(url) as resp:
            return await resp.json()

results = await asyncio.gather(*[fetch_with_limit(url) for url in urls])
```

### Veelvoorkomende valkuilen

**De event loop blokkeren (de #1 async-fout):**
```python
# Slecht — time.sleep() blokkeert de volledige event loop
async def do_work():
    time.sleep(1)          # ❌ blocks all other coroutines
    requests.get(url)      # ❌ sync HTTP library in async context

# Goed
async def do_work():
    await asyncio.sleep(1)         # ✅ yields control
    async with session.get(url):   # ✅ async HTTP
        ...

# Synchrone blokkerende code uitvoeren in een thread pool
result = await asyncio.get_event_loop().run_in_executor(
    None, sync_blocking_function, arg1, arg2
)
```

**Await vergeten:**
```python
# Slecht — maakt een coroutine-object aan, voert het niet uit
async def bad():
    result = fetch_user(1)  # ❌ missing await — just creates coroutine

# Goed
async def good():
    result = await fetch_user(1)  # ✅
```

**Taken aanmaken zonder ze af te wachten:**
```python
# Slecht — "fire and forget" kan ervoor zorgen dat fouten stil verdwijnen
async def bad():
    asyncio.create_task(risky_operation())  # errors are swallowed

# Goed — referentie bewaren en fouten afhandelen
async def good():
    task = asyncio.create_task(risky_operation())
    task.add_done_callback(lambda t: t.exception() and log_error(t.exception()))
```

### Asynchrone contextmanagers

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

# async generator voor streaming
async def stream_rows(query: str):
    async with AsyncDatabaseConnection() as conn:
        async for row in conn.cursor(query):
            yield dict(row)

async def process():
    async for row in stream_rows("SELECT * FROM large_table"):
        await handle(row)
```

## Voorbeeld

**Gebruiker:** Gegevens ophalen van 3 externe APIs tegelijkertijd met individuele timeouts, mislukte verzoeken één keer opnieuw proberen en gedeeltelijke resultaten teruggeven als sommige mislukken — alles binnen een totaalbudget van 10 seconden.

**Verwachte uitvoer:**
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
