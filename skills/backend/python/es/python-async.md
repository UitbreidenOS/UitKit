---
name: python-async
description: "Python asyncio patterns: async/await, concurrent tasks, aiohttp, timeouts, queues, background tasks, common pitfalls"
---

> 🇪🇸 Versión en español. [Versión en inglés](../python-async.md).

# Skill Python Async

## Cuándo activar
- Escritura de código Python asíncrono con `asyncio`
- Ejecución concurrente de operaciones I/O (múltiples llamadas a APIs, consultas a DB)
- Uso de `aiohttp` para solicitudes HTTP asíncronas
- Gestión de tareas en segundo plano en FastAPI u otros frameworks asíncronos
- Depuración de código asíncrono (problemas de event loop, deadlocks, llamadas bloqueantes)
- Configuración de colas de tareas asíncronas o patrones worker

## Cuándo NO usar
- Trabajo vinculado a la CPU — async no ayuda aquí, usa `multiprocessing` o `ProcessPoolExecutor`
- Scripts simples con una o dos llamadas I/O secuenciales — `requests` es más sencillo
- Cuando la biblioteca que necesitas solo tiene una interfaz síncrona — envuélvela en su lugar

## Instrucciones

### Patrones básicos

```python
import asyncio

# Coroutine básica
async def fetch_user(user_id: int) -> dict:
    await asyncio.sleep(0.1)  # simulates I/O
    return {"id": user_id, "name": "Alice"}

# Ejecutar una coroutine
user = asyncio.run(fetch_user(1))

# Await en un contexto asíncrono
async def main():
    user = await fetch_user(1)
    print(user)
```

### Ejecución concurrente — la habilidad clave

```python
# Secuencial (lento — espera cada llamada)
async def fetch_all_sequential(ids: list[int]) -> list[dict]:
    results = []
    for id in ids:  # each waits for the previous
        results.append(await fetch_user(id))
    return results

# Concurrente con gather (todos inician al mismo tiempo)
async def fetch_all_concurrent(ids: list[int]) -> list[dict]:
    tasks = [fetch_user(id) for id in ids]
    return await asyncio.gather(*tasks)  # runs all concurrently

# gather con manejo de errores (return_exceptions evita que un fallo detenga todo)
results = await asyncio.gather(*tasks, return_exceptions=True)
users = [r for r in results if not isinstance(r, Exception)]
errors = [r for r in results if isinstance(r, Exception)]
```

### TaskGroup (Python 3.11+ — concurrencia estructurada)

```python
# TaskGroup es más seguro que gather — cancela todas las tareas si alguna falla
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

# Timeout para una sola operación
try:
    result = await asyncio.wait_for(fetch_user(id), timeout=5.0)
except asyncio.TimeoutError:
    raise HTTPException(504, "Upstream timed out")

# Timeout para un grupo (Python 3.11+)
try:
    async with asyncio.timeout(10.0):
        async with asyncio.TaskGroup() as tg:
            t1 = tg.create_task(call_service_a())
            t2 = tg.create_task(call_service_b())
except TimeoutError:
    # Both tasks were cancelled
    ...
```

### aiohttp — cliente HTTP asíncrono

```python
import aiohttp

# La reutilización de sesión es crítica — no crees una nueva sesión por solicitud
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

# Solicitud única
async def fetch_github_user(username: str) -> dict:
    session = await HttpClient.get_session()
    async with session.get(f"https://api.github.com/users/{username}") as resp:
        resp.raise_for_status()
        return await resp.json()

# Múltiples solicitudes concurrentes
async def fetch_many(urls: list[str]) -> list[dict]:
    session = await HttpClient.get_session()
    async def fetch(url: str) -> dict:
        async with session.get(url) as resp:
            resp.raise_for_status()
            return await resp.json()
    return await asyncio.gather(*[fetch(url) for url in urls])
```

### Tareas en segundo plano en FastAPI

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

# Para tareas de larga duración, usa una cola apropiada (Celery, arq, dramatiq)
```

### Colas asíncronas para productor-consumidor

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

    # 5 workers concurrentes
    workers = [asyncio.create_task(consumer(queue, i)) for i in range(5)]
    await producer(queue, items)
    await queue.join()  # wait for all items processed
    for w in workers:
        w.cancel()
```

### Semaphore — limitar la concurrencia

```python
# Limitar a 10 solicitudes salientes simultáneas (evitar sobrecargar APIs externas)
semaphore = asyncio.Semaphore(10)

async def fetch_with_limit(url: str) -> dict:
    async with semaphore:
        async with session.get(url) as resp:
            return await resp.json()

results = await asyncio.gather(*[fetch_with_limit(url) for url in urls])
```

### Errores comunes

**Bloquear el event loop (el error async #1):**
```python
# Malo — time.sleep() bloquea todo el event loop
async def do_work():
    time.sleep(1)          # ❌ blocks all other coroutines
    requests.get(url)      # ❌ sync HTTP library in async context

# Bueno
async def do_work():
    await asyncio.sleep(1)         # ✅ yields control
    async with session.get(url):   # ✅ async HTTP
        ...

# Ejecutar código bloqueante síncrono en un thread pool
result = await asyncio.get_event_loop().run_in_executor(
    None, sync_blocking_function, arg1, arg2
)
```

**Olvidar el await:**
```python
# Malo — crea un objeto coroutine, no lo ejecuta
async def bad():
    result = fetch_user(1)  # ❌ missing await — just creates coroutine

# Bueno
async def good():
    result = await fetch_user(1)  # ✅
```

**Crear tareas sin esperarlas:**
```python
# Malo — el "fire and forget" puede causar que los errores se pierdan silenciosamente
async def bad():
    asyncio.create_task(risky_operation())  # errors are swallowed

# Bueno — mantener una referencia y manejar errores
async def good():
    task = asyncio.create_task(risky_operation())
    task.add_done_callback(lambda t: t.exception() and log_error(t.exception()))
```

### Gestores de contexto asíncronos

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

# async generator para streaming
async def stream_rows(query: str):
    async with AsyncDatabaseConnection() as conn:
        async for row in conn.cursor(query):
            yield dict(row)

async def process():
    async for row in stream_rows("SELECT * FROM large_table"):
        await handle(row)
```

## Ejemplo

**Usuario:** Obtener datos de 3 APIs externas de forma concurrente con timeouts individuales, reintentar las solicitudes fallidas una vez y devolver resultados parciales si algunas fallan — todo dentro de un presupuesto total de 10 segundos.

**Salida esperada:**
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
