> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../claude-api.md).

# Claude API Skill

## Wann aktivieren
- Code schreiben, der die Anthropic Claude API aufruft (Python oder TypeScript SDK)
- Prompt Caching, Streaming oder Batch-Verarbeitung implementieren
- Multi-Turn-Gesprächsverwaltung entwerfen
- Das richtige Claude-Modell (Haiku, Sonnet, Opus) für eine Aufgabe auswählen
- Tool Use / Funktionsaufrufe zu einer Claude-Integration hinzufügen
- Kosten oder Latenz in einer Produktions-Claude-App optimieren

## Wann NICHT verwenden
- OpenAI oder andere Provider-APIs — anderes SDK, andere Muster
- Allgemeiner LLM-Rat ohne Bezug zur Anthropic API
- Projekte, die bereits LangChain- oder LlamaIndex-Abstraktionen verwenden — die Abstraktionsebene direkt ansprechen

## Anweisungen

### Modellauswahl-Leitfaden
| Modell | Verwenden wenn | Vermeiden wenn |
|-------|----------|------------|
| `claude-haiku-4-5-20251001` | Klassifikation, Extraktion, Routing, einfache Q&A, hohes Volumen mit niedrigen Kosten | Komplexes Reasoning, mehrstufige Code-Generierung |
| `claude-sonnet-4-6` | Allgemein: Code, Analyse, Schreiben, agentische Workflows | Token-beschränkte Budgets in massivem Maßstab |
| `claude-opus-4-7` | Expertenniveau-Reasoning, differenziertes Urteil, komplexe Langform | Die meisten Aufgaben — Sonnet ist meist ausreichend |

### Einfacher Nachrichtenaufruf (Python)
```python
import anthropic

client = anthropic.Anthropic()  # liest ANTHROPIC_API_KEY aus der Umgebung

message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system="You are a helpful assistant specialized in Python.",
    messages=[
        {"role": "user", "content": "Explain Python's GIL in 3 sentences."}
    ]
)
print(message.content[0].text)
```

### Prompt Caching (kritisch für Kosten)
Prompt Caching kann die Kosten bei wiederholtem Kontext um bis zu 90% reduzieren. Stabilen Inhalt cachen (System-Prompts, große Dokumente, Few-Shot-Beispiele).

```python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a code review assistant. Here are our coding standards: ...",
            "cache_control": {"type": "ephemeral"}  # Diesen Block cachen
        }
    ],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": large_document,
                    "cache_control": {"type": "ephemeral"}  # Auch das Dokument cachen
                },
                {
                    "type": "text",
                    "text": "Summarize the key points."
                }
            ]
        }
    ]
)
# Cache-Nutzung in der Antwort prüfen
print(message.usage.cache_read_input_tokens)   # Token aus dem Cache gelesen
print(message.usage.cache_creation_input_tokens)  # Token in den Cache geschrieben
```

Cache-Regeln:
- Minimaler cachebarer Block: 1024 Token (Sonnet/Opus), 2048 Token (Haiku)
- Cache-TTL: 5 Minuten
- Nur der letzte `cache_control`-Block in einem Nachrichten-Array ist relevant — Cache-Punkte sind kumulativ

### Streaming
```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Oder mit Ereignissen:
with client.messages.stream(...) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="")
        elif event.type == "message_stop":
            print()  # Zeilenumbruch wenn fertig
```

### Tool Use
```python
tools = [
    {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "City name"},
                "unit": {"type": "string", "enum": ["celsius", "fahrenheit"]}
            },
            "required": ["city"]
        }
    }
]

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "What's the weather in Paris?"}]
)

# Prüfen ob Claude ein Tool verwenden möchte
if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    tool_result = call_tool(tool_use.name, tool_use.input)

    # Gespräch mit Tool-Ergebnis fortsetzen
    follow_up = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        tools=tools,
        messages=[
            {"role": "user", "content": "What's the weather in Paris?"},
            {"role": "assistant", "content": response.content},
            {
                "role": "user",
                "content": [{
                    "type": "tool_result",
                    "tool_use_id": tool_use.id,
                    "content": json.dumps(tool_result)
                }]
            }
        ]
    )
```

### Multi-Turn-Gespräch
```python
class Conversation:
    def __init__(self, system: str, model: str = "claude-sonnet-4-6"):
        self.client = anthropic.Anthropic()
        self.model = model
        self.system = system
        self.messages: list[dict] = []

    def chat(self, user_message: str, max_tokens: int = 1024) -> str:
        self.messages.append({"role": "user", "content": user_message})
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=self.system,
            messages=self.messages,
        )
        assistant_message = response.content[0].text
        self.messages.append({"role": "assistant", "content": assistant_message})
        return assistant_message
```

### Batch-Verarbeitung
```python
from anthropic.types.message_create_params import MessageCreateParamsNonStreaming
from anthropic.types.messages.batch_create_params import Request

requests = [
    Request(
        custom_id=f"review-{i}",
        params=MessageCreateParamsNonStreaming(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            messages=[{"role": "user", "content": f"Classify: {review}"}],
        )
    )
    for i, review in enumerate(reviews)
]

batch = client.messages.batches.create(requests=requests)
print(f"Batch ID: {batch.id}")

# Auf Ergebnisse warten (oder Webhooks verwenden)
import time
while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    time.sleep(60)

for result in client.messages.batches.results(batch.id):
    print(result.custom_id, result.result.message.content[0].text)
```

### Fehlerbehandlung und Wiederholungen
```python
from anthropic import APIStatusError, APITimeoutError, RateLimitError

def call_with_retry(client, **kwargs, max_retries=3):
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except RateLimitError:
            wait = 2 ** attempt
            time.sleep(wait)
        except APITimeoutError:
            if attempt == max_retries - 1:
                raise
            time.sleep(1)
        except APIStatusError as e:
            if e.status_code >= 500 and attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise
```

### Kostenoptimierungs-Checkliste
- Haiku für Klassifikation, Routing und einfache Extraktionsaufgaben verwenden
- Prompt Caching für jeden System-Prompt > 1024 Token aktivieren
- Batch-API für Offline-/Async-Workloads verwenden — 50% Kosteneinsparung
- `max_tokens` auf das benötigte Minimum setzen — Output-Token werden berechnet
- Große Dokumente in der Benutzernachricht cachen, nicht nur im System-Prompt
- Verhältnis `cache_read_input_tokens` zu `input_tokens` überwachen — >80% für stabile Kontexte anstreben

## Beispiel

**Benutzer:** Eine Python-Klasse bauen, die Kundensupport-Tickets mit Claude in Kategorien klassifiziert, mit Prompt Caching für die Kategorieliste und Streaming für die Erklärung.

**Erwartete Ausgabe:**
- `TicketClassifier`-Klasse mit `ANTHROPIC_API_KEY` aus der Umgebung
- System-Prompt mit allen gecachten Kategorien via `cache_control: ephemeral`
- `classify(ticket_text)` → gibt `{category: str, confidence: str}` aus geparster strukturierter Ausgabe zurück
- `classify_and_explain(ticket_text)` → streamt die Erklärung zu stdout
- Verwendet `claude-haiku-4-5-20251001` für Klassifikation (kosteneffizient), `claude-sonnet-4-6` für Erklärung

---
