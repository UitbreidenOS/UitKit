# Claude Batch

## Wann aktivieren
Verarbeitung großer Mengen von Prompts (10 oder mehr), nicht zeitkritische Workloads oder wenn der Nutzer API-Kosten für Bulk-Operationen wie Dokumentverarbeitung, Evaluationen oder Datensatz-Annotation reduzieren möchte.

## Wann NICHT verwenden
- Echtzeit- oder latenzempfindliche Anwendungen — Batch-Verarbeitung dauert bis zu 24 Stunden
- Workflows, bei denen jedes Ergebnis die nächste Anfrage speisen muss — nutzen Sie stattdessen synchrones Streaming
- Weniger als 10 Anfragen — synchroner API-Overhead ist in diesem Maßstab vernachlässigbar

## Anweisungen

### Batch-API-Übersicht
- Bis zu 10.000 Anfragen pro Batch einreichen
- 50% Kosteneinsparung gegenüber synchroner Messages API
- Verarbeitung wird innerhalb von 24 Stunden abgeschlossen (normalerweise viel schneller für kleine Batches)
- Ergebnisse werden als JSONL-Stream bereitgestellt, wenn die Verarbeitung abgeschlossen ist
- Fehlgeschlagene einzelne Anfragen führen nicht zum Scheitern des gesamten Batches

### Request-Format
Jedes Element im Batch hat:
- `custom_id`: Ihre Kennung — wird verwendet, um Ergebnisse mit Eingaben abzugleichen
- `params`: Standard-Messages-API-Parameter (model, max_tokens, messages, system, tools, usw.)

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

### Einen Batch einreichen
```python
batch = client.messages.batches.create(requests=requests)
print(batch.id)           # msgbatch_...
print(batch.processing_status)  # "in_progress"
```

### Auf Fertigstellung warten
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

### Ergebnisse abrufen
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

### Ergebnis-Typen
| Type | Meaning | Action |
|---|---|---|
| `succeeded` | Normalabschluss | `result.message` verwenden |
| `errored` | API-Fehler (ungültige Parameter, Content-Richtlinie) | Protokollieren und überspringen oder erneut versuchen |
| `expired` | 24-Stunden-Fenster ist abgelaufen, bevor Verarbeitung stattgefunden hat | Anfrage erneut einreichen |

### Einen Batch abbrechen
```python
client.messages.batches.cancel(batch.id)
# Already-completed requests are not rolled back — partial results may exist
```

### Rate Limits
- 10.000 Anfragen pro Batch
- 100 gleichzeitige Batches (in Bearbeitung gleichzeitig)
- Batch-Rate-Limits sind getrennt von synchronen API-Rate-Limits — Einreichen von Batches zählt nicht zu Ihrer synchronen Quote

### Use Cases und Sizing

| Use case | Typical batch size | Est. turnaround |
|---|---|---|
| Dokumentzusammenfassung | 100–5.000 | Minuten–Stunden |
| Eval-Run über Test-Set | 500–10.000 | Stunden |
| Datensatz-Annotation | 1.000–10.000 | Stunden |
| Bulk-Content-Generierung | 50–2.000 | Minuten–Stunden |

### Production Pattern: Queue + Batch
Für anhaltende High-Volume-Workloads kombinieren Sie eine Job-Queue mit der Batch-API:
1. Enqueue-Elemente, sobald sie ankommen
2. Alle N Minuten (oder wenn die Queue 500+ erreicht), leeren Sie die Queue in einem Batch
3. Speichern Sie die `batch_id` → `custom_id[]`-Zuordnung in einer Datenbank
4. Batch-Status bei einem Cron-Job abfragen, Ergebnisse in DB schreiben, wenn `processing_status == "ended"`
5. Ergebnisse über eine API für nachgelagerte Consumer verfügbar machen

## Beispiel

Annotieren von 2.000 Kundenservice-Tickets mit Sentiment und Kategorie:

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
