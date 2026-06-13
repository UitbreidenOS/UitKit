# Prompt Caching

## Wann aktivieren
Claude-API-Nutzung mit wiederholten großen Kontextblöcken — Systemprompts, vorangestellte Dokumente, große Tool-Definitionen — oder wenn der Nutzer API-Kosten oder Latenz für Workloads reduzieren möchte, die den gleichen Kontext über mehrere Aufrufe hinweg wiederverwenden.

## Wann NICHT verwenden
- Single-Shot-API-Aufrufe ohne wiederholten Kontext
- Gespräche, bei denen sich der Systemprompt bei jeder Anfrage ändert
- Kontexte kleiner als 1024 Tokens (Claude 3) oder 2048 Tokens (Claude 3.5+ Haiku) — unter diesen Schwellwerten hat Caching keine Auswirkung

## Anweisungen

### Wie Prompt Caching funktioniert
Cache-Breakpoints markieren Inhaltsblöcke als für das Caching berechtigt. Wenn Anthropic's Infrastruktur dasselbe Präfix erneut sieht (bis zum Breakpoint), liest sie aus dem Cache statt es erneut zu verarbeiten.

- **Cache-Write-Kosten:** 1,25× Standard-Input-Token-Preis
- **Cache-Read-Kosten:** 0,1× Standard-Input-Token-Preis
- **Break-Even-Punkt:** ~9 Lesevorgänge desselben Inhalts
- **Standard-TTL:** 5 Minuten
- **Erweiterte TTL:** 1 Stunde — setzen Sie `ENABLE_PROMPT_CACHING_1H=1` als Umgebungsvariable (Beta)

### cache_control-Syntax
Fügen Sie `"cache_control": {"type": "ephemeral"}` zum letzten Inhaltsblock hinzu, den Sie in das Cache-Präfix einbeziehen möchten:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "<your large system prompt here — must be >1024 tokens to cache>",
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=[{"role": "user", "content": "What does the system prompt say about X?"}],
)
```

### Wo Cache-Breakpoints platziert werden

**Systemprompt (immer cachen, wenn >1024 Tokens):**
```python
system=[
    {"type": "text", "text": base_instructions},          # not cached
    {"type": "text", "text": large_doc, "cache_control": {"type": "ephemeral"}},  # cache up to here
]
```

**Großes Dokument, das dem Gespräch vorangestellt ist:**
```python
messages=[
    {
        "role": "user",
        "content": [
            {"type": "text", "text": large_reference_doc, "cache_control": {"type": "ephemeral"}},
            {"type": "text", "text": "Now answer this question about the document above: ..."},
        ],
    }
]
```

**Tool-Definitionen (Cache bei vielen Tools):**
```python
tools=[
    # ... all your tool definitions ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "cache_control": {"type": "ephemeral"},  # cache everything up to and including this tool
    }
]
```

### Multi-Turn Caching
In einem Multi-Turn-Gespräch wächst das Messages-Array bei jedem Turn. Platzieren Sie den Cache-Breakpoint am Ende des Tools-Arrays oder des Systemprompts — das Messages-Array wird von Anthropic's Caching-Infrastruktur automatisch behandelt, während das Gespräch wächst.

Fügen Sie nicht `cache_control` zu jeder Nachricht hinzu — fügen Sie es nur zum großen statischen Inhalt am Anfang des Kontexts hinzu. Anthropic cachet alles bis zum letzten Breakpoint im Präfix.

### Messung der Cache-Effizienz
Überprüfen Sie `usage` in der Antwort:
```python
print(response.usage)
# Usage(
#   input_tokens=850,
#   cache_creation_input_tokens=12500,   # tokens written to cache (first call)
#   cache_read_input_tokens=12500,       # tokens read from cache (subsequent calls)
#   output_tokens=200
# )
```

Eine gesunde Multi-Turn-Sitzung sollte `cache_creation_input_tokens > 0` nur beim ersten Aufruf und `cache_read_input_tokens > 0` bei allen nachfolgenden Aufrufen zeigen.

### Kostenberechnung-Beispiel
Systemprompt: 15.000 Tokens. 50 Nutzernachrichten pro Stunde verarbeitet.

| Scenario | Cost per call | Cost/hour (50 calls) |
|---|---|---|
| Kein Caching | 15.000 × $3/MTok | $2,25 |
| Mit Caching (nach Break-Even) | 15.000 × $0,30/MTok | $0,225 |

10× Kostenreduktion für großen, häufig wiederverwendeten Kontext.

### Häufige Fehler
- Den Breakpoint zu früh platzieren — Inhalt nach dem Breakpoint wird bei jedem Aufruf erneut verarbeitet
- Breakpoints im Messages-Array bei kurzen Turns hinzufügen — die minimale cachierbare Größe wird nicht erreicht
- Vergessen, dass die Cache-TTL 5 Minuten beträgt — ein 10-Minuten-Batch-Job verliert den Cache während der Ausführung (verwenden Sie erweiterte TTL)
- Caching für eindeutigen Pro-Request-Inhalt verwenden — Caching hilft nur, wenn das Präfix über Aufrufe hinweg identisch ist

## Beispiel

Ein Dokumenten-Q&A-System verarbeitet 200 Fragen gegen dasselbe 80-seitige PDF pro Tag:

```python
# Load and cache the document once per session
doc_text = extract_text_from_pdf("report.pdf")  # ~50,000 tokens

def ask_question(question: str) -> str:
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=500,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"<document>\n{doc_text}\n</document>",
                        "cache_control": {"type": "ephemeral"},
                    },
                    {"type": "text", "text": question},
                ],
            }
        ],
    )
    return response.content[0].text

# Call 1: cache_creation_input_tokens=50000 (1.25× price)
# Calls 2-200: cache_read_input_tokens=50000 (0.1× price)
# Net savings vs no caching: ~88% on document tokens
```

---
