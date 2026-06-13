> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../claude-api.md).

# Claude API Skill

## Wanneer te activeren
- Code schrijven die de Anthropic Claude API aanroept (Python of TypeScript SDK)
- Prompt-caching, streaming of batchverwerking implementeren
- Beheer van gesprekken met meerdere beurten ontwerpen
- Het juiste Claude-model (Haiku, Sonnet, Opus) kiezen voor een taak
- Toolgebruik / function calling toevoegen aan een Claude-integratie
- Optimaliseren voor kosten of latentie in een productie-Claude-app

## Wanneer NIET te gebruiken
- OpenAI of andere provider-API's — andere SDK, andere patronen
- Algemeen LLM-advies dat niet gerelateerd is aan de Anthropic API
- Projecten die al LangChain of LlamaIndex-abstracties gebruiken — adresseer de abstractielaag in plaats daarvan

## Instructies

### Modelselectiegids
| Model | Gebruik wanneer | Vermijd wanneer |
|-------|----------|------------|
| `claude-haiku-4-5-20251001` | Classificatie, extractie, routing, eenvoudige Q&A, hoog-volume goedkoop | Complexe redenering, meerstaps codegeneratie |
| `claude-sonnet-4-6` | Algemeen gebruik: code, analyse, schrijven, agentische workflows | Token-beperkte budgetten op massale schaal |
| `claude-opus-4-7` | Expertniveau-redenering, genuanceerd oordeel, complexe lange tekst | De meeste taken — Sonnet is meestal voldoende |

### Basis berichtaanroep (Python)
```python
import anthropic

client = anthropic.Anthropic()  # leest ANTHROPIC_API_KEY uit omgeving

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

### Prompt-caching (kritisch voor kosten)
Prompt-caching kan kosten met maximaal 90% verlagen voor herhaalde context. Cache stabiele inhoud (systeemprompts, grote documenten, few-shot-voorbeelden).

```python
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "You are a code review assistant. Here are our coding standards: ...",
            "cache_control": {"type": "ephemeral"}  # Cache dit blok
        }
    ],
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": large_document,
                    "cache_control": {"type": "ephemeral"}  # Cache ook het document
                },
                {
                    "type": "text",
                    "text": "Summarize the key points."
                }
            ]
        }
    ]
)
# Controleer cachegebruik in respons
print(message.usage.cache_read_input_tokens)   # tokens gelezen uit cache
print(message.usage.cache_creation_input_tokens)  # tokens geschreven naar cache
```

Cacheregels:
- Minimaal cacheerbaar blok: 1024 tokens (Sonnet/Opus), 2048 tokens (Haiku)
- Cache-TTL: 5 minuten
- Alleen het laatste `cache_control`-blok in een berichtarray telt — cachepunten zijn cumulatief

### Streaming
```python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": prompt}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

# Of met events:
with client.messages.stream(...) as stream:
    for event in stream:
        if event.type == "content_block_delta":
            print(event.delta.text, end="")
        elif event.type == "message_stop":
            print()  # nieuwe regel wanneer klaar
```

### Toolgebruik
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

# Controleer of Claude een tool wil gebruiken
if response.stop_reason == "tool_use":
    tool_use = next(b for b in response.content if b.type == "tool_use")
    tool_result = call_tool(tool_use.name, tool_use.input)

    # Ga door met gesprek met toolresultaat
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

### Gesprek met meerdere beurten
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

### Batchverwerking
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

# Poll voor resultaten (of gebruik webhooks)
import time
while True:
    batch = client.messages.batches.retrieve(batch.id)
    if batch.processing_status == "ended":
        break
    time.sleep(60)

for result in client.messages.batches.results(batch.id):
    print(result.custom_id, result.result.message.content[0].text)
```

### Foutafhandeling en herhaalpogingen
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

### Kostenoptimalisatie-checklist
- Gebruik Haiku voor classificatie, routing en eenvoudige extractietaken
- Schakel prompt-caching in voor elke systeemprompt > 1024 tokens
- Gebruik de batch API voor offline/async-workloads — 50% kostenvermindering
- Stel `max_tokens` in op het minimum dat nodig is — je betaalt voor gegenereerde output-tokens
- Cache grote documenten in het gebruikersbericht, niet alleen de systeemprompt
- Monitor de verhouding `cache_read_input_tokens` vs `input_tokens` — streef naar >80% voor stabiele contexten

## Voorbeeld

**Gebruiker:** Bouw een Python-klasse die klantenservicetickets indeelt in categorieën met Claude, met prompt-caching voor de categorielijst en streaming voor de uitleg.

**Verwachte output:**
- `TicketClassifier`-klasse met `ANTHROPIC_API_KEY` uit omgeving
- Systeemprompt met alle categorieën gecacht via `cache_control: ephemeral`
- `classify(ticket_text)` → retourneert `{category: str, confidence: str}` geparseerd uit gestructureerde output
- `classify_and_explain(ticket_text)` → streamt de uitleg naar stdout
- Gebruikt `claude-haiku-4-5-20251001` voor classificatie (kostenefficiënt), `claude-sonnet-4-6` voor uitleg

---
