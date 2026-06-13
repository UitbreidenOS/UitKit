# Claude Batch

## Wanneer activeren
Verwerken van grote volumes prompts (10 of meer), niet-time-sensitive workloads, of wanneer gebruiker API kosten wil reduceren voor bulk operaties zoals document processing, evaluations, of dataset annotatie.

## Wanneer NIET gebruiken
- Real-time of latency-sensitive applicaties — batch processing duurt tot 24 uur
- Workflows waarbij elk resultaat volgende request moet voeden — gebruik in plaats daarvan synchrone streaming
- Minder dan 10 requests — synchrone API overhead is verwaarloosbaar op die schaal

## Instructies

### Batch API Overzicht
- Submitteer tot 10.000 requests per batch
- 50% kostenkorting vs synchrone Messages API
- Processing compleet binnen 24 uur (meestal veel sneller voor kleine batches)
- Resultaten geleverd als JSONL stream wanneer processing compleet
- Gefaalde individuele requests falen niet de batch

### Request Format
Elk item in de batch heeft:
- `custom_id`: jouw identifier — gebruikt om resultaten terug aan inputs te matchen
- `params`: standaard Messages API parameters (model, max_tokens, messages, system, tools, etc.)

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

### Submitting a Batch
```python
batch = client.messages.batches.create(requests=requests)
print(batch.id)           # msgbatch_...
print(batch.processing_status)  # "in_progress"
```

### Polling for Completion
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

### Retrieving Results
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

### Result Types
| Type | Meaning | Action |
|---|---|---|
| `succeeded` | Normal completion | Use `result.message` |
| `errored` | API-level error (invalid params, content policy) | Log and skip or retry |
| `expired` | 24-hour window elapsed before processing | Resubmit the request |

### Canceling a Batch
```python
client.messages.batches.cancel(batch.id)
# Already-completed requests are not rolled back — partial results may exist
```

### Rate Limits
- 10.000 requests per batch
- 100 gelijktijdige batches (in-progress tegelijk)
- Batch rate limits zijn apart van synchrone API rate limits — batches submitting telt niet tegen jouw synchrone quota

### Use Cases and Sizing

| Use case | Typical batch size | Est. turnaround |
|---|---|---|
| Document summarization | 100–5.000 | Minutes–hours |
| Eval run over test set | 500–10.000 | Hours |
| Dataset annotation | 1.000–10.000 | Hours |
| Bulk content generation | 50–2.000 | Minutes–hours |

### Production Pattern: Queue + Batch
Voor doorlopende high-volume workloads, combineer job queue met batch API:
1. Enqueue items als ze aankomen
2. Elke N minuten (of wanneer queue 500+ raakt), flush queue in batch
3. Sla `batch_id` → `custom_id[]` mapping op in database
4. Poll batch status op cron, schrijf resultaten naar DB wanneer `processing_status == "ended"`
5. Expose resultaten via API naar downstream consumers

## Voorbeeld

Annoteren 2.000 customer support tickets met sentiment en category:

```python
tickets = load_tickets_from_db()  # 2.000 rows

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
# Total cost: ~50% less than running 2.000 synchronous calls
```

---
