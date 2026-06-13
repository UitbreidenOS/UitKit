# Programmatic Tool Calling (PTC)

## Wanneer activeren
Gebruiker wil API token gebruik reduceren voor tool-heavy workflows, noemt programmatic tool calling, of heeft patroon waarbij dezelfde tool meer dan 3 keer in single inference pass aangeroepen wordt.

## Wanneer NIET gebruiken
- Tools met side effects die human review tussen calls nodig hebben (write, delete, deploy)
- Tools vereisend re-authenticatie per call of per-call autorisatie prompts
- Single tool calls — PTC overhead is niet waard het onder ~3 calls
- Non-Python execution environments — PTC sandbox is Python only

## Instructies

### What PTC Does
Standaard tool use: Claude roept tool aan → result geretourneerd → Claude roept volgende tool aan. Elke round trip is één API inference pass.

Met PTC: Claude schrijft Python orchestration code die meerdere tools in loop aanroept, voert in sandbox uit, en alleen finale stdout enter context. Drie tools = 1 inference pass in plaats van 3.

**Gemeten token reductie: ~37% minder tokens voor multi-tool workflows.**

### Enabling PTC
Voeg `code_execution_20250825` als allowed caller in jouw tool definitie:
```python
tools = [
    {
        "name": "read_file",
        "description": "Read a file from the filesystem",
        "input_schema": {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "File path to read"},
            },
            "required": ["path"],
        },
        "allowed_callers": ["code_execution_20250825"],  # Enable PTC for this tool
    }
]
```

Wanneer PTC ingeschakeld, kan Claude ervoor kiezen orchestration code te schrijven in plaats van tool direct aan te roepen.

### Execution Sandbox
- Python only
- Geen filesystem access standaard (tenzij tool zelf het voorziet)
- Beperkte standard library — geen network calls vanuit sandbox code
- Tool results geretourneerd als Python objects naar sandbox code
- Alleen stdout vanuit sandbox enter conversatie context

### When Claude Uses PTC Automatically
Claude selecteert PTC wanneer het patroon detecteert dat van batching profiteert:
- N files lezen en veld uit elk extraheren
- Dezelfde transformation op list inputs uitvoeren
- Resultaten van meerdere tool calls aggregeren voordat responding
- Elke loop waarbij tool aangeroepen met verschillende parameters elke iteratie

### When to Force PTC (Prompt Engineering)
Als Claude PTC niet gebruikt voor patroon dat duidelijk ervan profiteert, voeg toe aan system prompt:
```
When you need to call the same tool multiple times with different inputs, write Python orchestration code using code_execution_20250825 to batch the calls rather than calling the tool individually each time.
```

### Tool Design for PTC Compatibility
Tools gebruikt met PTC moeten:
- Eenvoudige, serializable inputs accepteren (strings, numbers, lists)
- Schoon, parseable output retourneren (prefer JSON over freeform text)
- Idempotent zijn (reads, lookups) in plaats van stateful (writes, mutations)
- Geen interactieve confirmation vereisen

### Combining PTC with Prompt Caching
Voor maximale token efficiency: cache tool definities (die groot kunnen zijn) met `cache_control`, en enable PTC om aantal round trips te reduceren:
```python
tools = [
    # ... your tools ...
    {
        "name": "last_tool",
        "description": "...",
        "input_schema": {...},
        "allowed_callers": ["code_execution_20250825"],
        "cache_control": {"type": "ephemeral"},  # Cache all tools up to here
    }
]
```

### Limitations
- PTC kan tools niet aanroepen die human-in-the-loop approval mid-execution vereisen
- Sandbox heeft timeout — zeer long-running loops kunnen afgebroken worden
- Tools die binary data retourneren (images, files) zijn niet geschikt voor PTC orchestration
- Debugging is moeilijker — code en intermediate results zijn niet zichtbaar in main context

## Voorbeeld

Extracting function signatures van 20 source files zonder PTC: 20 `read_file` tool calls, 20 round trips, ~40.000 tokens van tool call + result overhead.

Met PTC enabled op `read_file`:

Claude schrijft (intern, in sandbox):
```python
files = [
    "src/api/users.ts", "src/api/orders.ts", "src/api/products.ts",
    # ... 17 more
]
signatures = []
for f in files:
    content = read_file(path=f)
    # Extract export function lines
    sigs = [line.strip() for line in content.split("\n") if line.startswith("export function")]
    signatures.extend(sigs)
print("\n".join(signatures))
```

Één inference pass. Alleen extracted signatures (niet volledige file contents) enter context. Token reductie: 37% op deze workflow.

---
