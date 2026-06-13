# Prompt Caching

## Wanneer activeren
Claude API gebruik met herhaalde grote context blokken — system prompts, prepended documents, grote tool definities — of wanneer gebruiker API kosten wil reduceren of latency voor workloads die dezelfde context hergebruiken over meerdere calls.

## Wanneer NIET gebruiken
- Single-shot API calls zonder herhaalde context
- Conversaties waar system prompt elke request verandert
- Contexts kleiner dan 1024 tokens (Claude 3) of 2048 tokens (Claude 3.5+ Haiku) — onder deze drempels, caching heeft geen effect

## Instructies

### How Prompt Caching Works
Cache breakpoints markeren content blokken als eligible voor caching. Wanneer Anthropic infrastructure dezelfde prefix opnieuw ziet (tot breakpoint), leest het van cache in plaats van opnieuw te verwerken.

- **Cache write cost:** 1.25× standaard input token prijs
- **Cache read cost:** 0.1× standaard input token prijs
- **Break-even point:** ~9 reads van dezelfde content
- **Default TTL:** 5 minuten
- **Extended TTL:** 1 uur — set `ENABLE_PROMPT_CACHING_1H=1` als environment variable (beta)

### cache_control Syntax
Voeg `"cache_control": {"type": "ephemeral"}` toe aan laatste content blok je wilt opgenomen in cache prefix:

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

### Where to Place Breakpoints

**System prompt (altijd cache als >1024 tokens):**
```python
system=[
    {"type": "text", "text": base_instructions},          # not cached
    {"type": "text", "text": large_doc, "cache_control": {"type": "ephemeral"}},  # cache up to here
]
```

**Large document prepended to conversation:**
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

**Tool definitions (cache bij veel tools):**
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
In een multi-turn conversatie, messages array groeit met elke turn. Plaats cache breakpoint aan einde van tools array of system prompt — messages array wordt automatisch verwerkt door Anthropic caching infrastructure als conversatie groeit.

Voeg niet `cache_control` toe aan elke message — voeg toe alleen aan grote static content bovenaan context. Anthropic cached alles tot laatste breakpoint in prefix.

### Measuring Cache Effectiveness
Controleer `usage` in response:
```python
print(response.usage)
# Usage(
#   input_tokens=850,
#   cache_creation_input_tokens=12500,   # tokens written to cache (first call)
#   cache_read_input_tokens=12500,       # tokens read from cache (subsequent calls)
#   output_tokens=200
# )
```

Een gezonde multi-turn sessie moet `cache_creation_input_tokens > 0` tonen alleen op eerste call en `cache_read_input_tokens > 0` op alle volgende calls.

### Cost Calculation Example
System prompt: 15.000 tokens. 50 user messages verwerkt per uur.

| Scenario | Cost per call | Cost/hour (50 calls) |
|---|---|---|
| No caching | 15.000 × $3/MTok | $2.25 |
| With caching (after break-even) | 15.000 × $0.30/MTok | $0.225 |

10× kostenreductie voor grote, frequent hergebruikte context.

### Common Mistakes
- Breakpoint te vroeg plaatsen — content na breakpoint wordt elke call opnieuw verwerkt
- Breakpoints toevoegen binnen messages array op korte turns — minimale cacheable size wordt niet geraakt
- Vergeten dat cache TTL 5 minuten is — 10-minute batch job verliest cache mid-run (gebruik extended TTL)
- Caching gebruiken voor unique per-request content — caching helpt alleen wanneer prefix identiek over calls

## Voorbeeld

Document Q&A systeem verwerkt 200 vragen tegen dezelfde 80-page PDF per dag:

```python
# Load and cache the document once per session
doc_text = extract_text_from_pdf("report.pdf")  # ~50.000 tokens

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
