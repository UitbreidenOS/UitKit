---
description: Scaffold een multi-stap Claude agent met tool use, memory, en een gedefinieerde stoppingvoorwaarde
argument-hint: "[agent doel of taakbeschrijving]"
---
Scaffold een productie Claude agent die dit bereikt: $ARGUMENTS

**Stap 1 — Agent design spec**

Voor het schrijven van code, definieer:

- **Doel** — de terminal success condition (niet een proces, een toestand)
- **Invoer** — wat de agent ontvangt bij lancering (strings, bestandspaden, gestructureerde data)
- **Uitvoer** — wat het produceert wanneer klaar (bestanden geschreven, API-aanroepen gedaan, gestructureerd resultaat geretourneerd)
- **Benodigde tools** — arceer elke tool: naam, doel, input schema, return shape
- **Memory model** — kies één:
  - Stateless (context window alleen, geschikt voor <20 tool calls)
  - Summary memory (comprimeer geschiedenis met Haiku na elke N stappen)
  - External memory (schrijf belangrijke feiten naar een scratchpad bestand of key-value store)
- **Stoppingvoorwaarden** — wat triggert de agent om einduitvoer terug te geven vs. doorgaan met loopen:
  - Success: doelstaat bereikt
  - Failure: foutenteller overschreden, contradictoire toestand gedetecteerd
  - Ceiling: max_iterations bereikt (altijd opnemen)

**Stap 2 — Genereer de agent**

Schrijf `agent.py` met de Anthropic Python SDK. Vereisten:

- Model: `claude-sonnet-4-6` (configureerbaar via `AGENT_MODEL` omgevingsvariabele)
- Implementeer de agentic loop:
  ```
  while not done and iterations < max_iterations:
      response = client.messages.create(tools=tools, messages=history)
      if response.stop_reason == "tool_use":
          results = execute_tools(response)
          history.append(assistant_turn)
          history.append(tool_results_turn)
      elif response.stop_reason == "end_turn":
          done = True
  ```
- Definieer elke tool als een dict met `name`, `description`, `input_schema` (JSON Schema)
- Tool dispatch: een `dispatch(tool_name, tool_input)` functie die naar Python callables routet
- Gebruik `cache_control: {"type": "ephemeral"}` op het systeem prompt bericht
- Gestructureerde einduitvoer: agent retourneert een getypte dataclass, niet raw text
- Log elke iteratie: tool aangeroepen, input samenvatting, resultaat samenvatting (niet volledige inhoud)

**Stap 3 — Error handling**

- Wrap elke tool call in try/except; return `{"error": str(e)}` als tool resultaat — nooit raise in de loop
- Bij `max_iterations` overschreden: return partiële resultaten met een `status: "incomplete"` vlag
- Bij API fouten (`anthropic.APIStatusError`): retry tot 3 keer met exponentiële backoff

**Stap 4 — CLI entrypoint**

Expose via `argparse`:
- `--goal` (of positional): overschrijf het hardcoded doel
- `--max-iterations`: standaard 25
- `--dry-run`: print het plan (systeem prompt + tools) zonder uit te voeren

**Uitvoer:** `agent.py` met alle tools geïmplementeerd, geen stubs. Voeg een gebruiksvoorbeeld in een commentaarblok bovenaan het bestand toe.
