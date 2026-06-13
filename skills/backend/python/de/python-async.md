---
name: python-async
description: "Python asyncio patterns: async/await, concurrent tasks, aiohttp, timeouts, queues, background tasks, common pitfalls"
---

> 🇩🇪 Deutsche Version. [Englische Version](../python-async.md).

# Python Async Skill

## Wann aktivieren
- Schreiben von asynchronem Python-Code mit `asyncio`
- Parallele Ausführung von I/O-Operationen (mehrere API-Aufrufe, DB-Abfragen)
- Verwendung von `aiohttp` für asynchrone HTTP-Anfragen
- Verwaltung von Hintergrundaufgaben in FastAPI oder anderen asynchronen Frameworks
- Debugging von asynchronem Code (Event-Loop-Probleme, Deadlocks, blockierende Aufrufe)
- Einrichtung von asynchronen Task-Queues oder Worker-Patterns

## Wann NICHT verwenden
- CPU-gebundene Arbeit — async hilft hier nicht, verwende `multiprocessing` oder `ProcessPoolExecutor`
- Einfache Skripte mit ein oder zwei sequentiellen I/O-Aufrufen — `requests` ist einfacher
- Wenn die benötigte Bibliothek nur eine synchrone Schnittstelle hat — stattdessen einwickeln

## Anweisungen

### Grundlegende Muster

```python
import asyncio

# Grundlegende Coroutine
async def fetch_user(user_id: int) -> dict:
    await asyncio.sleep(0.1)  # simulates I/O
    return {"id": user_id, "name": "Alice"}

# Eine Coroutine ausführen
user = asyncio.run(fetch_user(1))

# Await in einem asynchronen Kontext
async def main():
    user = await fetch_user(1)
    print(user)
```

### Parallele Ausführung — die Kernkompetenz

```python
# Sequentiell (langsam — wartet auf jeden Aufruf)
async def fetch_all_sequential(ids: list[int]) -> list[dict]:
    results = []
    for id in ids:  # each waits for the previous
        results.append(await fetch_user(id))
    return results

# Parallel mit gather (alle starten gleichzeitig)
async def fetch_all_concurrent(ids: list[int]) -> list[dict]:
    tasks = [fetch_user(id) for id in ids]
    return await asyncio.gather(*tasks)  # runs all concurrently

# gather mit Fehlerbehandlung (return_exceptions verhindert, dass ein Fehler alles stoppt)
results = await asyncio.gather(*tasks, return_exceptions=True)
users = [r for r in results if not isinstance(r, Exception)]
errors = [r for r in results if isinstance(r, Exception)]
```

### TaskGroup (Python 3.11+ — strukturierte Parallelität)

```python
# TaskGroup ist sicherer als gather — bricht alle Tasks ab, wenn einer fehlschlägt
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

# Timeout für eine einzelne Operation
try:
    result = await asyncio.wait_for(fetch_user(id), timeout=5.0)
except asyncio.TimeoutError:
    raise HTTPException(504, "Upstream timed out")

# Timeout für eine Gruppe (Python 3.11+)
try:
    async with asyncio.timeout(10.0):
        async with asyncio.TaskGroup() as tg:
            t1 = tg.create_task(call_service_a())
            t2 = tg.create_task(call_service_b())
except TimeoutError:
    # Both tasks were cancelled
    ...
```

### aiohttp — asynchroner HTTP-Client

```python
import aiohttp

# Session-Wiederverwendung ist entscheidend — erstelle keine neue Session pro Anfrage
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

# Einzelne Anfrage
async def fetch_github_user(username: str) -> dict:
    session = await HttpClient.get_session()
    async with session.get(f"https://api.github.com/users/{username}") as resp:
        resp.raise_for_status()
        return await resp.json()

# Mehrere parallele Anfragen
async def fetch_many(urls: list[str]) -> list[dict]:
    session = await HttpClient.get_session()
    async def fetch(url: str) -> dict:
        async with session.get(url) as resp:
            resp.raise_for_status()
            return await resp.json()
    return await asyncio.gather(*[fetch(url) for url in urls])
```

### Hintergrundaufgaben in FastAPI

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

# Für länger laufende Aufgaben, verwende eine echte Queue (Celery, arq, dramatiq)
```

### Asynchrone Queues für Produzent-Konsument

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

    # 5 parallele Worker
    workers = [asyncio.create_task(consumer(queue, i)) for i in range(5)]
    await producer(queue, items)
    await queue.join()  # wait for all items processed
    for w in workers:
        w.cancel()
```

### Semaphore — Parallelität begrenzen

```python
# Auf 10 gleichzeitige ausgehende Anfragen beschränken (externe APIs nicht überlasten)
semaphore = asyncio.Semaphore(10)

async def fetch_with_limit(url: str) -> dict:
    async with semaphore:
        async with session.get(url) as resp:
            return await resp.json()

results = await asyncio.gather(*[fetch_with_limit(url) for url in urls])
```

### Häufige Fehler

**Event Loop blockieren (Async-Fehler #1):**
```python
# Schlecht — time.sleep() blockiert den gesamten Event Loop
async def do_work():
    time.sleep(1)          # ❌ blocks all other coroutines
    requests.get(url)      # ❌ sync HTTP library in async context

# Gut
async def do_work():
    await asyncio.sleep(1)         # ✅ yields control
    async with session.get(url):   # ✅ async HTTP
        ...

# Synchronen blockierenden Code in einem Thread Pool ausführen
result = await asyncio.get_event_loop().run_in_executor(
    None, sync_blocking_function, arg1, arg2
)
```

**Await vergessen:**
```python
# Schlecht — erstellt ein Coroutine-Objekt, führt es nicht aus
async def bad():
    result = fetch_user(1)  # ❌ missing await — just creates coroutine

# Gut
async def good():
    result = await fetch_user(1)  # ✅
```

**Tasks erstellen ohne sie abzuwarten:**
```python
# Schlecht — "fire and forget" kann dazu führen, dass Fehler still verschwinden
async def bad():
    asyncio.create_task(risky_operation())  # errors are swallowed

# Gut — Referenz behalten und Fehler behandeln
async def good():
    task = asyncio.create_task(risky_operation())
    task.add_done_callback(lambda t: t.exception() and log_error(t.exception()))
```

### Asynchrone Kontextmanager

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

# async Generator für Streaming
async def stream_rows(query: str):
    async with AsyncDatabaseConnection() as conn:
        async for row in conn.cursor(query):
            yield dict(row)

async def process():
    async for row in stream_rows("SELECT * FROM large_table"):
        await handle(row)
```

## Beispiel

**Nutzer:** Daten von 3 externen APIs gleichzeitig abrufen mit individuellen Timeouts, fehlgeschlagene Anfragen einmal wiederholen und Teilergebnisse zurückgeben, falls einige scheitern — alles innerhalb eines 10-Sekunden-Gesamtbudgets.

**Erwartete Ausgabe:**
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
