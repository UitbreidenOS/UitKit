---
description: Een multi-stap Claude-agent schetsen met tool-gebruik, geheugen en een gedefinieerde stoppingvoorwaarde
argument-hint: "[agent goal or task description]"
---
Maak een productie Claude-agent die het volgende bereikt: $ARGUMENTS

**Stap 1 — Agent design spec**

Voordat u code schrijft, definieert u:

- **Doel** — de uiteindelijke succesvoowaarde (geen proces, een toestand)
- **Invoer** — wat de agent bij start ontvangt (strings, bestandspaden, gestructureerde gegevens)
- **Uitvoer** — wat het produceert als het klaar is (geschreven bestanden, API-aanroepen, gestructureerd resultaat teruggegeven)
- **Benodigde tools** — soem op elke tool: naam, doel, invoerschema, terugkeervormen
- **Geheugenmodel** — kies één:
  - Stateless (context-venster alleen, geschikt voor <20 tool-aanroepen)
  - Summary memory (comprimeer geschiedenis met Haiku na elke N stappen)
  - External memory (schrijf belangrijke feiten naar een scratchpad-bestand of key-value-opslag)
- **Stoppingvoorwaarden** — wat triggert de agent om uiteindelijke uitvoer terug te geven versus doorgaan:
  - Succes: doeltoestand bereikt
  - Mislukking: foutentelling overschreden, tegenstrijdige toestand gedetecteerd
  - Plafond: max_iterations bereikt (altijd opnemen)

**Stap 2 — Agent genereren**

Schrijf `agent.py` met behulp van de Anthropic Python SDK. Vereisten:

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
- Tool dispatch: een `dispatch(tool_name, tool_input)` functie die routeert naar Python callables
- Gebruik `cache_control: {"type": "ephemeral"}` op het systeempromptbericht
- Gestructureerde uiteindelijke uitvoer: agent retourneert een getypte dataclass, niet ruwe tekst
- Log elke iteratie: tool aangeroepen, invoersamenvattinng, resultaatsamenvat (niet volledige inhoud)

**Stap 3 — Foutafhandeling**

- Wikkel elke tool-aanroep in try/except; retourneer `{"error": str(e)}` als tool-resultaat — verhoog nooit in de loop
- Bij overschrijding van `max_iterations`: retourneer partiële resultaten met een `status: "incomplete"` vlag
- Bij API-fouten (`anthropic.APIStatusError`): opnieuw proberen tot 3 keer met exponentiële terugschakeling

**Stap 4 — CLI-beginpunt**

Blootstellen via `argparse`:
- `--goal` (of positioneel): override de hardcoded doelstelling
- `--max-iterations`: standaard 25
- `--dry-run`: druk het plan af (systeemprompt + tools) zonder uit te voeren

**Uitvoer:** `agent.py` met alle tools geïmplementeerd, geen stubs. Voeg een gebruiksvoorbeeld op in een commentaarvak boven in het bestand.
