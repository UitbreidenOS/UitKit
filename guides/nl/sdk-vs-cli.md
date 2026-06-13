# SDK vs CLI — Verschillen in Systeemprompt

Wanneer u Claude Code via de CLI versus via de Claude Agent SDK gebruikt, is de systeemprompt die in de modelcontext wordt geladen dramatisch anders. Dit is belangrijk bij het bouwen van geautomatiseerde pipelines, het debuggen van onverwacht gedrag of het afstemmen van kosten.

---

## Wat de CLI laadt

De CLI laadt een modulaire systeemprompt die is samengesteld uit 110+ voorwaardelijk geactiveerde fragmenten bij het starten. Wat wordt opgenomen, hangt af van uw projectconfiguratie:

| Fragment-categorie | Tokens (ongeveer) |
|---|---|
| Basis-prompt (altijd geladen) | ~269 |
| Tool-beschrijvingen (Read, Write, Edit, Bash, etc.) | ~800–1.200 |
| CLAUDE.md-inhoud (globaal + project) | Varieert — kan 0 tot 4.000+ zijn |
| Vaardigheids-beschrijvingen (`.claude/skills/`) | ~50–200 per vaardigheid |
| Regel-bestanden (`.claude/rules/`) | Varieert |
| MCP-tool-beschrijvingen | ~100–500 per server |
| Sessie-context (cwd, git status, platform) | ~100–300 |
| **Totaal met volledige configuratie** | **tot ~5.000–8.000 tokens** |

Niets hiervan is zichtbaar voor u in de terminal. De fragmenten worden vóór uw eerste bericht ingespoten.

---

## Wat het SDK laadt

Zonder expliciete configuratie laadt de SDK (pakket `anthropic` met standaard `messages.create`) geen Claude Code-context — het gedraagt zich als een gewone API-aanroep. Geen CLAUDE.md, geen vaardigheden, geen tool-beschrijvingen buiten wat u expliciet doorgeeft.

Om de CLI-equivalente systeemprompt vanuit het SDK te laden:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system=[
        {
            "type": "text",
            "text": "Your custom instructions here"
        }
    ],
    messages=[{"role": "user", "content": "Do X"}]
)
```

Om de Claude Code-voorinstelling te laden (inclusief tool-beschrijvingen en basis-prompt):

```python
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8096,
    system={"type": "preset", "preset": "claude_code"},
    messages=[{"role": "user", "content": "Do X"}]
)
```

Om ook projectinstellingen uit `.claude/settings.json` te laden, voegt u toe:

```python
extra_headers={"X-Setting-Sources": "project"}
```

---

## Gedragsverschillen in een oogopslag

| Gedrag | CLI | SDK (standaard) | SDK + voorinstelling |
|---|---|---|---|
| CLAUDE.md geladen | Ja | Nee | Nee (handmatig toevoegen) |
| Tool-gebruik ingeschakeld | Ja | Vereist expliciete tools | Ja |
| Vaardigheids-beschrijvingen | Ja | Nee | Nee |
| Regel-bestanden | Ja | Nee | Nee |
| Sessie-git-context | Ja | Nee | Nee |
| Basis-veiligheid-instructies | Ja | Ja | Ja |
| MCP-tool-beschrijvingen | Ja (indien geconfigureerd) | Nee | Nee |
| Kosten versus CLI-sessie | Referentie | ~40–70% lager | ~80–95% van CLI |

---

## De `--bare` Flag

`claude -p "task" --bare` slaat alle projectdetectie op CLI-niveau over:

- Geen CLAUDE.md laden
- Geen `.claude/settings.json` detectie
- Geen MCP-server verbindingen
- Geen vaardigheid laden

Het resultaat is een CLI-aanroep die zich gedraagt als een directe SDK-aanroep, met de CLI UX-laag erboven. De starttijd daalt op warme systemen van ~2–3 seconden naar ~200ms.

Gebruik `--bare` voor:
- Hogefrequentie-automatiseringsscripts die Claude via CLI aanroepen
- SDK-stijl-integraties die toevallig de CLI-binaire gebruiken
- Testprompts isoleren zonder projectcontextinterferentie

Gebruik `--bare` niet voor:
- Interactieve ontwikkelingssessies (u verliest CLAUDE.md, vaardigheden, regels)
- Werkstromen die toegang tot project-MCP-servers nodig hebben

---

## Geen determinisme-garantie

Er is geen gelijkwaardige `seed` parameter voor Claude Code of de Claude API. Bij temperature=0 zijn reacties in de praktijk consistent, maar niet gegarandeerd identiek over API-aanroepen. Dit is een fundamentele modeleigenschap — niet een configuratieprobleem, en niet iets wat `--bare` of de voorinstelling oplost.

Als uw automatisering afhankelijk is van deterministische uitvoer:
- Gebruik gestructureerde uitvoer met gedefinieerde JSON-schema's
- Valideer uitvoer tegen een schema in plaats van onbewerkte tekst te vergelijken
- Bouw idempotente pipelines die variatie in formulering tolereren

---

## Startup-latentie-referentie

| Modus | Typische koude start | Typische warme start |
|---|---|---|
| `claude` (volledige CLI) | 3–5 seconden | 1–2 seconden |
| `claude -p "x"` (afdruk-modus) | 2–4 seconden | 1–1,5 seconden |
| `claude -p "x" --bare` | 0,3–0,5 seconden | 0,1–0,2 seconden |
| SDK `messages.create` | ~100–200ms (netwerk) | ~100ms (netwerk) |

Bare CLI-modus is de juiste keuze wanneer u de Claude Code-binaire nodig hebt, maar zich zorgen maakt over latentie. Het SDK is nog sneller wanneer u de CLI helemaal niet nodig hebt.

---
