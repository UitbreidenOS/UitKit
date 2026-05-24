# Context Budget Management

Hoe je tokengebruik in een Claude Code sessie kunt volgen, plannen en optimaliseren — voor senior developers die grote sessies, agent pipelines en autonome werkloops uitvoeren.

---

## Waarom context budget belangrijk is

Claude Code sessies werken binnen een eindig context window. Naarmate een sessie groeit, accumuleert elke tool call, bestandslezing, bash output en assistant turn. Wanneer het window vol raakt:

- Claude's response kwaliteit verslechtert merkbaar voordat de hard limit wordt bereikt (empirisch, rond de 300–400k tokens op het 1M model)
- Je bent gedwongen `/compact` (lossy summarisation) of een frisse sessie te gebruiken
- Kosten schalen met context grootte — een opgeblazen window kost meer per turn

Het foutscenario is niet het bereiken van de hard limit — het is het grootste deel van je budget op ruis verbranden voordat je taak half klaar is. Lange log outputs zonder trimmen, hele bestanden lezen als je slechts 30 regels nodig hebt, herhaalde herzegging van hetzelfde bestand, agent sub-calls die volledige parent context meenemen: dit zijn de patronen die een budget doen instorten.

Deze handleiding behandelt wat budget verbruikt, hoe je het meet en hoe je controle behoudt in de volledige sessie lifecycle.

---

## Wat context verbruikt

| Bron | Typische kosten | Opmerkingen |
|---|---|---|
| System prompt / CLAUDE.md | 500–5.000 tokens | Geladen bij elke sessiestart |
| Elke tool call + resultaat | 200–2.000 tokens | Hangt volledig af van output uitgebreidheid |
| Bestandslesingen | ~1 token per 4 chars | Een 1.000-regel bestand is ruwweg 10K tokens |
| Bash stdout | Onbegrensd | Lange log output is de meest voorkomende budget killer |
| MCP tool definities (10 servers) | ~25.000–35.000 tokens | Geladen bij sessiestart, voordat je iets typt |
| Agent sub-calls | Volledige sub-context | Elke spawned agent initialiseert zijn eigen context window |
| Afbeeldingen / screenshots | 1.500–3.000 tokens | Per afbeelding, ongeacht inhouds complexiteit |
| Gespreksgeschiedenis | Groeit elke turn | Zowel user als assistant turns accumuleren |

De twee bronnen die meeste developers onderschatten zijn **Bash stdout** en **MCP tool definities**. Een enkele `npm install` met verbose logging kan 3–5K tokens toevoegen. Tien ingeschakelde MCP servers met elk acht tools is ~30K tokens overhead geladen voordat het eerste user bericht.

---

## De `/compact` commando

`/compact` vat de gespreksgeschiedenis samen in een samengeperste representatie en vervangt het in context. Dit is lossy — de samenvatting behoudt besluiten en uitkomsten maar gooit exacte details weg.

**Wat overleeft compactie:**
- High-level besluiten en rationale
- De huidige bestandsstatus (wat werd geschreven)
- Belangrijke feiten expliciet besproken

**Wat overleeft compactie niet:**
- Exacte foutmeldingen en stack traces
- Specifieke code snippets die werden gelezen maar niet geschreven
- Stap-voor-stap debugging kettingen
- Bestandsinhouded die werden gelezen maar niet gewijzigd

**Wanneer je moet compacten:**
- Bij 50–60% context gebruik, niet bij 90%. Compactie op 50% produceert een samenvatting van hogere kwaliteit omdat nog meer signaal in het window zit ten opzichte van ruis.
- Na afloop van een grote subtaak voordat je de volgende begint
- Voor een taak die veel grote bestanden gaat lezen
- Na een lange debug sessie waar mislukte pogingen context vervuilen

**Gerichte compactie** behoudt de belangrijkste thread:

```
/compact focus on the auth refactor — drop the test debugging context
```

Zonder hint maakt de summarizer zijn eigen keuzes over wat belangrijk is. Een specifieke hint verankert de samenvatting.

**Wacht niet op de automatische threshold.** De default auto-compact vuurt af op ~95% capaciteit. Op dat moment is kwaliteit al aanzienlijk gedegradeerd en heeft de samenvatting minder signaal om uit te werken.

---

## Context budget strategieën

### a. Lees alleen wat je nodig hebt

Gebruik de `limit` en `offset` parameters op het Read tool. Een 2.000-regel bestand helemaal gelezen is ~20K tokens. Als je regels 400–450 nodig hebt, dat is ~500 tokens.

```
# Heel bestand: ~20K tokens
Read /path/to/service.ts

# Gericht lezen: ~500 tokens
Read /path/to/service.ts, offset: 400, limit: 50
```

Gebruik Grep in plaats van bestandslezing wanneer je een patroon zoekt. Grep retourneert matchende regels en een kleine hoeveelheid context — niet het hele bestand. Voor een 5.000-regel codebase, dit is het verschil tussen 50K tokens en 500.

Lees nooit complete log bestanden. Pipe naar `head` en zoek eerst naar de relevante sectie.

### b. Trim Bash output

Ongecontroleerde Bash output is de meest voorkomende bron van runaway context consumptie. Pas deze systematisch toe:

```bash
# Beperk output volume
npm install 2>/dev/null | tail -5
docker logs mycontainer --tail 100
git log --oneline -20

# Onderdruk progress ruis
curl -s https://api.example.com/endpoint
rsync -a --quiet src/ dst/

# Redirect stderr als het niet relevant is
make build 2>/dev/null

# Samenvatten voordat je terugkeert
./run-tests.sh | grep -E "PASS|FAIL|ERROR" | tail -30
```

Voor elke commando die multi-screen output produceert, voeg `| head -N` of `| tail -N` toe als standaard discipline. De exacte N is minder belangrijk dan de gewoonte.

### c. Gebruik PostToolUse output compressie

Vanaf Claude Code v2.1.121+, kan een `PostToolUse` hook de tool output vervangen voordat Claude het verwerkt. Dit laat je verbose tool resultaten automatisch comprimeren, redactie of samenvatten — zonder de tool call zelf te wijzigen.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/compress-output.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/compress-output.sh`:**
```bash
#!/usr/bin/env bash
# Leest tool output uit stdin (JSON), comprimeert als boven threshold, schrijft naar stdout.
# Claude ontvangt de hook stdout als het tool resultaat.

set -euo pipefail

input=$(cat)
output=$(echo "$input" | jq -r '.output // ""')
line_count=$(echo "$output" | wc -l | tr -d ' ')

if [ "$line_count" -gt 150 ]; then
  # Truncate en annoteren — Claude ziet een getrimde versie
  trimmed=$(echo "$output" | head -100)
  tail_section=$(echo "$output" | tail -20)
  echo "$input" | jq --arg trimmed "$trimmed" --arg tail "$tail_section" \
    '.output = "[Output truncated from '"$line_count"' lines]\n\nFirst 100 lines:\n" + $trimmed + "\n\n[...]\n\nLast 20 lines:\n" + $tail'
else
  echo "$input"
fi
```

Dit vuurt af op elke Bash call. Als de output onder 150 regels is, gaat het ongewijzigd door. Over 150 regels, vervangt het het resultaat met een getrimde versie geannoteerd met het regelaantal. Claude's context ontvangt het gecomprimeerde resultaat — de volledige output voert nooit het window in.

Hetzelfde patroon werkt voor het redacteren van secrets: verwijder regels matching `API_KEY|SECRET|TOKEN|PASSWORD` voordat Claude het verwerkt.

### d. Scope CLAUDE.md agressief

Project-level `CLAUDE.md` laadt bij elke sessiestart. Elk token erin is een vaste kost die accumuleert over elke sessie je uitvoert.

**Doel:** Houd je project `CLAUDE.md` onder de 2.000 tokens (~300–400 regels van gewone proza). De user-level `~/.claude/CLAUDE.md` voegt erop toe — behandel het totaal als je baseline overhead.

**Wat je in CLAUDE.md houdt:**
- Project beschrijving (3–5 zinnen)
- Sleutel directories en hun doel
- Niet-duidelijke conventies die Claude moet volgen
- Commando's voor build, test, lint
- Dingen niet te wijzigen zonder te vragen

**Wat je eruit verplaatst:**
- Referentie documentatie (API shapes, schema beschrijvingen) — lees deze on demand, alleen relevant
- Lange voorbeelden — verwijs ernaar op bestandspad en lees on demand
- Historische besluiten — houd een aparte `decisions.md` en laad deze alleen wanneer in die domain werkt

Een `CLAUDE.md` dat organisch over maanden groeide bevat vaak regels voor problemen die niet meer bestaan. Controleer het en snij dode regels. Elk verwijderd regel bespaart tokens elke sessie voor altijd.

### e. Vat samen voordat je agents spawnt

Wanneer je een subagent spawnt, krijgt het zijn eigen context window. De manier waarop je informatie eraan geeft bepaalt of je signaal of ruis geeft.

**Stuur niet raw tool history vooruit.** Als je net 20 bestandslesingen en 10 bash calls in de parent context hebt gedaan, die gespreksgeschiedenis verbatim doorgeven aan een subagent verspilt budget en verslechtert de subagent's focus.

Vat in plaats daarvan bevindingen samen in een structured briefing voordat je spawnt:

```
# Slechte benadering:
Spawn agent met: volledige parent gespreksgeschiedenis

# Betere benadering:
Voordat je spawnt, construeer een briefing:
  "The auth module is in src/auth/. The issue is in jwt.ts line 84 —
  the expiry check compares against Date.now() but tokens use seconds, not
  milliseconds. The fix is to multiply exp by 1000 before comparing.
  Relevant files: jwt.ts, middleware/auth.ts, tests/auth.test.ts.
  Task: fix the comparison and update the test."

Spawn agent met: alleen de briefing
```

De subagent ontvangt precies wat het nodig heeft. De parent context wint het terug van de subagent's conclusies zonder de subagent's volledige tool history opnieuw ingespoten te hebben.

### f. LLMS.txt bewustzijn

Wanneer je externe documentatie binnenbrengt — API referentie van een bibliotheek, configuratie gids van een framework — controleer of het project een `llms.txt` bestand publiceert.

`llms.txt` is een samengeperste documentatie format specifiek ontworpen voor LLM consumptie. Het is typisch 5–10x kleiner dan gelijkwaardige docs site inhoud. Fetchen van `https://docs.example.com/llms.txt` in plaats van scraping van meerdere pagina's kan 50–200K tokens besparen op documentatie-zware taken.

Controleer ervoor voordat je raw docs leest:
```bash
curl -s https://docs.anthropic.com/llms.txt | head -50
```

Als het bestaat, gebruik het als je primaire bron. Als het niet bestaat, fetch alleen de specifieke pagina die je nodig hebt in plaats van links te volgen.

### g. Gebruik batch operaties

In agent pipelines en SDK workflows, verzamel resultaten in batch calls in plaats van individuele interactive turns. `agent_sdk.batch()` voert meerdere sub-taken uit en retourneert hun resultaten zonder dat elke sub-taak de parent's interactive context met intermediate tool history vult.

Dit is het programmatische equivalent van de subagent samenvatting strategie hierboven — structureer werk zodat intermediate stappen niet in de main context voorblijven.

---

## De `/usage` commando

`/usage` toont een per-categorie token breakdown voor de huidige sessie. Beschikbaar in Claude Code (controleer `claude --version` voor beschikbaarheid in je build).

**Categorieën getoond:**
- System prompt (CLAUDE.md + built-in systeem context)
- MCP tool definities
- Gespreksgeschiedenis (user + assistant turns)
- Tool resultaten (bestandslesingen, bash outputs, MCP responses)
- Agent sub-calls

**Hoe effectief gebruiken:**

Voer `/usage` uit op sessiestart, onmiddellijk nadat Claude laadt. Dit geeft je een baseline — de vaste overhead van je CLAUDE.md, MCP tools en system prompt voordat je enig werk hebt gedaan. Dit getal is je floor; elke sessie zal minstens dit veel kosten.

Als de session-start baseline boven de 30–40K tokens is, heb je een configuratieprobleem:
- Te veel MCP servers ingeschakeld
- CLAUDE.md is te groot
- Beide

Voer `/usage` opnieuw uit na een grote taak fase (bijv. na het voltooien van bestandsonderzoek, voordat je implementatie begint). Dit toont je hoeveel budget elke fase verbruikt, wat infoemeert over beslissingen over of je compacten voordat je doorgaat.

---

## Context budget in autonome / agent loops

Autonome loops (`/loop`, geplande agents, CI pipelines) accumuleren context anders dan interactive sessies. Elke iteratie van een loop voegt toe aan dezelfde context tenzij je het actief beheert.

**Belangrijke patronen:**

**Vat samen tussen iteraties.** Aan het einde van elke loop iteratie, schrijf een structured samenvatting naar een bestand. De volgende iteratie leest het samenvatting bestand in plaats van de volledige vorige iteratie's tool history mee te dragen.

```bash
# Einde van elke loop iteratie — schrijf status naar disk
cat > /tmp/loop-state.json <<EOF
{
  "iteration": 3,
  "completed": ["auth module", "user service"],
  "current": "payment service",
  "blockers": [],
  "next": "review payment integration tests"
}
EOF
```

**Gebruik ScheduleWakeup om context te resetten.** De `ScheduleWakeup` tool beëindigt het huidige context window en hervat op de volgende geplande tick in een fresh window. Voor lange autonome taken is dit beter dan context accumulatie over tientallen iteraties. De tradeoff is een cache miss (>5 minuut vertraging) — acceptabel wanneer iteratie werk meer dan een paar minuten duurt.

**Schrijf sessie samenvattingen in de Stop hook.** Wanneer Claude een turn in een autonome sessie beëindigt, vuurt de Stop hook af. Gebruik het om een sessie samenvatting naar disk te schrijven voordat context verder accumuleert.

**`.claude/hooks/stop-summary.sh`:**
```bash
#!/usr/bin/env bash
# Vuurt af op Stop event. Voegt een sessie samenvatting toe aan een persistent log.

set -euo pipefail

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
last_commit=$(git log -1 --oneline 2>/dev/null || echo "no commits")

cat >> "${CLAUDE_PROJECT_DIR}/.claude/session-log.md" <<EOF

## Session ended: ${timestamp}
Branch: ${branch}
Last commit: ${last_commit}

EOF
```

**Inject compact context op SessionStart.** In plaats van context opnieuw op te stellen door herhaalde bestandslesingen op het begin van elke autonome sessie, gebruik een `SessionStart` hook om de samenvatting geschreven door de vorige sessie's Stop hook in te spuiten. Dit geeft het nieuwe context window structured orientatie onmiddellijk.

**`.claude/hooks/session-start.sh`:**
```bash
#!/usr/bin/env bash
# Vuurt af op SessionStart. Outputte een compact briefing die Claude op sessie open leest.

set -euo pipefail

summary_file="${CLAUDE_PROJECT_DIR}/.claude/session-log.md"

if [ -f "$summary_file" ]; then
  echo "=== SESSION CONTEXT (from previous session) ==="
  tail -50 "$summary_file"
  echo "=== END SESSION CONTEXT ==="
fi
```

---

## Pre-compact hook patroon

Wanneer `/compact` vuurt, genereert Claude een samenvatting van het gesprek. De `PreCompact` hook vuurt af voordat die samenvatting wordt gegenereerd — je een venster geeft om structured staat in te spuiten die de samenvatting verrijkt.

Zonder PreCompact hook, wordt de samenvatting puur uit het gesprek gegenereerd. Met een PreCompact hook die de huidige branch, open taken, recente commits en sleutel besluiten injecteert, draagt de compactie samenvatting aanzienlijk meer operationele context in het volgende window.

**settings.json:**
```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact.sh",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

**`.claude/hooks/pre-compact.sh`:**
```bash
#!/usr/bin/env bash
# Vuurt af voordat /compact. Outputte structured staat die de compactie samenvatting verrijkt.

set -euo pipefail

branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
recent_commits=$(git log -5 --oneline 2>/dev/null || echo "unavailable")
staged=$(git diff --cached --stat 2>/dev/null || echo "none")
unstaged=$(git diff --stat 2>/dev/null || echo "none")

cat <<EOF
=== PRE-COMPACT STATE INJECTION ===
Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: ${branch}

Recent commits:
${recent_commits}

Staged changes:
${staged}

Unstaged changes:
${unstaged}
=== END STATE INJECTION ===
EOF
```

De ingespoten output verschijnt in context onmiddellijk voordat de compactie samenvatting wordt gegenereerd. Claude verwerkt deze staat wanneer de samenvatting wordt geschreven. De resulterende samenvatting — die het nieuwe context window's opening wordt — zal branch, recente commit history en wijzigings status bevatten zonder dat je deze feiten handmatig na compactie moet heractiveren.

Breid dit patroon uit om open taken op te nemen (uit een taak bestand), architecturale besluiten gemaakt tijdens de sessie (uit een decisions log), of andere structured staat die anders verloren zou gaan.

---

## Snelle referentie — context hygiëne checklist

- [ ] Project CLAUDE.md is onder 2.000 tokens; user CLAUDE.md is lean
- [ ] Alleen MCP servers nodig voor deze sessie zijn ingeschakeld
- [ ] Bash commando's pipe naar `| head -N` of `| tail -N` waar output onbegrensd is
- [ ] PostToolUse compressie hook geïnstalleerd voor verbose tools (Bash, log-producerende MCPs)
- [ ] Grote bestandslesingen gebruiken `limit` en `offset` — geen volledige lesingen van bestanden over 200 regels tenzij de volledige inhoud nodig is
- [ ] `/compact` triggerd op 50–60% context gebruik, niet op 90%+
- [ ] Subagents ontvangen een structured briefing, niet raw parent gespreksgeschiedenis
- [ ] Externe documentatie geladen via `llms.txt` wanneer beschikbaar
- [ ] Autonome loop iteraties schrijven staat naar disk; volgende iteratie leest van disk
- [ ] PreCompact hook geïnstalleerd om compactie samenvattingen te verrijken
- [ ] Stop hook schrijft sessie samenvatting voor de volgende sessie's context loader
- [ ] `/usage` gechecked op sessie start om te bevestigen baseline overhead acceptabel is

---

> **Werk met ons:** Claudient wordt ondersteund door [Uitbreiden](https://uitbreiden.com/) — we bouwen AI producten en B2B oplossingen met developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
