# Claude Batch

## Cuándo activar
Procesamiento de grandes volúmenes de prompts (10 o más), cargas de trabajo que no son sensibles al tiempo, o cuando el usuario quiere reducir costos de API para operaciones en lote como procesamiento de documentos, evaluaciones o anotación de conjuntos de datos.

## Cuándo NO usar
- Aplicaciones en tiempo real o sensibles a latencia — el procesamiento por lote toma hasta 24 horas
- Flujos de trabajo donde cada resultado debe alimentar la siguiente solicitud — usar streaming síncrono en su lugar
- Menos de 10 solicitudes — el gasto general de API síncrona es insignificante en esa escala

## Instrucciones

### Descripción general de Batch API
- Enviar hasta 10,000 solicitudes por lote
- Descuento del 50% de costo vs Messages API síncrona
- El procesamiento se completa dentro de 24 horas (generalmente mucho más rápido para lotes pequeños)
- Los resultados se entregan como una secuencia JSONL cuando se completa el procesamiento
- Las solicitudes individuales fallidas no fallan el lote

### Formato de Solicitud
Cada elemento en el lote tiene:
- `custom_id`: su identificador — se usa para coincidir resultados con entradas
- `params`: parámetros estándar de Messages API (model, max_tokens, messages, system, tools, etc.)

```python
import anthropic

client = anthropic.Anthropic()

requests = [
    {
        "custom_id": f"doc-{i}",
        "params": {
            "model": "claude-opus-4-5",
            "max_tokens": 1024,
            "messages": [
                {"role": "user", "content": f"Summarize this document: {doc}"}
            ],
        },
    }
    for i, doc in enumerate(documents)
]
```

### Envío de un Lote
```python
batch = client.messages.batches.create(requests=requests)
print(batch.id)           # msgbatch_...
print(batch.processing_status)  # "in_progress"
```

### Sondeo de Finalización
```python
import time

def wait_for_batch(batch_id: str) -> anthropic.MessageBatch:
    while True:
        batch = client.messages.batches.retrieve(batch_id)
        if batch.processing_status == "ended":
            return batch
        print(f"Status: {batch.processing_status} — waiting 30s")
        time.sleep(30)

batch = wait_for_batch(batch.id)
print(f"Request counts: {batch.request_counts}")
# RequestCounts(canceled=0, errored=1, expired=0, processing=0, succeeded=199)
```

### Recuperación de Resultados
```python
# Results stream as JSONL — iterate without loading all into memory
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        message = result.result.message
        print(f"{result.custom_id}: {message.content[0].text[:100]}")
    elif result.result.type == "errored":
        error = result.result.error
        print(f"{result.custom_id}: ERROR {error.type} — {error.message}")
    elif result.result.type == "expired":
        print(f"{result.custom_id}: EXPIRED — resubmit")
```

### Tipos de Resultados
| Type | Meaning | Action |
|---|---|---|
| `succeeded` | Normal completion | Use `result.message` |
| `errored` | API-level error (invalid params, content policy) | Log and skip or retry |
| `expired` | 24-hour window elapsed before processing | Resubmit the request |

### Cancelación de un Lote
```python
client.messages.batches.cancel(batch.id)
# Already-completed requests are not rolled back — partial results may exist
```

### Límites de Velocidad
- 10,000 requests per batch
- 100 concurrent batches (in-progress at once)
- Batch rate limits are separate from synchronous API rate limits — submitting batches does not count against your synchronous quota

### Casos de Uso y Dimensionamiento

| Use case | Typical batch size | Est. turnaround |
|---|---|---|
| Document summarization | 100–5,000 | Minutes–hours |
| Eval run over test set | 500–10,000 | Hours |
| Dataset annotation | 1,000–10,000 | Hours |
| Bulk content generation | 50–2,000 | Minutes–hours |

### Patrón de Producción: Cola + Lote
Para cargas de trabajo de alto volumen continuo, combina una cola de trabajos con la API de lote:
1. Encolar elementos a medida que llegan
2. Cada N minutos (o cuando la cola alcanza 500+), vaciar la cola en un lote
3. Almacenar mapeo `batch_id` → `custom_id[]` en una base de datos
4. Sondear estado del lote en un cron, escribir resultados en DB cuando `processing_status == "ended"`
5. Exponer resultados a través de una API a consumidores descendentes

## Ejemplo

Anotación de 2,000 tickets de soporte al cliente con sentimiento y categoría:

```python
tickets = load_tickets_from_db()  # 2,000 rows

requests = [
    {
        "custom_id": str(ticket["id"]),
        "params": {
            "model": "claude-haiku-4-5",
            "max_tokens": 64,
            "system": "Respond with JSON only: {\"sentiment\": \"positive|neutral|negative\", \"category\": \"billing|technical|general\"}",
            "messages": [{"role": "user", "content": ticket["text"]}],
        },
    }
    for ticket in tickets
]

batch = client.messages.batches.create(requests=requests)
batch = wait_for_batch(batch.id)

results = {}
for result in client.messages.batches.results(batch.id):
    if result.result.type == "succeeded":
        import json
        data = json.loads(result.result.message.content[0].text)
        results[result.custom_id] = data

save_annotations_to_db(results)
# Total cost: ~50% less than running 2,000 synchronous calls
```

---
