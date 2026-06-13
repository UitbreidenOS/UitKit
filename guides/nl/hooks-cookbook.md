# Hooks Kookboek

Real, gebruiksklare hook-patronen voor het automatiseren van kwaliteit, veiligheid en observeerbaarheid in Claude Code.

---

## Hook-fundamenten

Hooks zijn shell-scripts of commandos die Claude Code automatisch uitvoert in reactie op events. Ze draaien buiten Claude's context — het zijn echte shell-processen, geen Claude-instructies.

**Hook-events:**
| Event | Wanneer het afvuurt |
|---|---|
| `SessionStart` | Wanneer een Claude Code-sessie begint |
| `PreToolUse` | Voor het uitvoeren van tool-oproepen |
| `PostToolUse` | Na het voltooien van tool-oproepen |
| `PreCompact` | Voor context compactie afspeelt |
| `PostCompact` | Na context compactie voltooid |
| `Stop` | Wanneer Claude klaar is met antwoorden |
| `Notification` | Wanneer Claude een bureaublad-melding verzendt |

**Configuratielocatie voor hooks:** `.claude/settings.json` (project) of `~/.claude/settings.json` (gebruikersniveau)

**Basis hook-structuur:**
```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "ToolName",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/your-script.sh",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

**Matcher:** Filtert welke tool-oproepen de hook activeren. Lege string `""` matcht alles. `"Bash"` matcht alleen Bash-tools. `"Write|Edit"` matcht Write of Edit.

---

## Recept 1 — Prettier Auto-Format op bestandsschrijven

Formatteer bestanden automatisch nadat Claude ze schrijft of bewerkt. Geen "please run prettier" prompts meer.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write ${tool_input.file_path}",
            "async": true
          }
        ]
      }
    ]
  }
}
```

**Opmerkingen:**
- `async: true` voert formatting op de achtergrond uit — Claude wacht niet
- Draait alleen op Write en Edit tool-oproepen
- `${tool_input.file_path}` is het pad van het bestand dat werd geschreven

---

## Recept 2 — Blokkeer gevaarlijke shell-commandos

Voorkom dat Claude destructieve commandos uitvoert zelfs als het besluit dat te doen.

**.claude/hooks/block-dangerous.sh:**
```bash
#!/usr/bin/env bash
# Leest de tool-input van stdin als JSON
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))")

# Blokkeer patronen
BLOCKED_PATTERNS=("rm -rf" "sudo " "| bash" "| sh" "curl.*| " "wget.*| " "git push --force" "git reset --hard" "DROP TABLE" "truncate ")

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOCKED: command matches dangerous pattern '$pattern'" >&2
    exit 2  # Exit code 2 = blok de tool-oproep
  fi
done

exit 0  # Toestaan
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/block-dangerous.sh",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

**Exit codes:** `0` = toestaan, `1` = waarschuwen (Claude ziet de output maar gaat door), `2` = blokkeren (tool-oproep is geannuleerd).

---

## Recept 3 — Audit log elke tool-oproep

Log elke tool-oproep met tijdstempel, tool-naam en input-samenvatting. Essentieel voor debugging en beveiligings-auditing.

**.claude/hooks/audit-log.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name','unknown'))" 2>/dev/null)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/audit.log"

mkdir -p "$(dirname "$LOG_FILE")"
echo "${TIMESTAMP} | ${TOOL_NAME} | $(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); inp=d.get('tool_input',{}); print(str(inp)[:200])" 2>/dev/null)" >> "$LOG_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

Voeg `.claude/logs/` toe aan `.gitignore`.

---

## Recept 4 — Pre-Compact sessie-spaarder

Voor compactie afspeelt, sla de huidige sessiestatus op zodat context behouden blijft.

**.claude/hooks/pre-compact-save.sh:**
```bash
#!/usr/bin/env bash
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$MEMORY_FILE")"

cat >> "$MEMORY_FILE" << EOF

---
## Session snapshot: ${TIMESTAMP}
[Claude will append a summary here during PreCompact]
EOF
```

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
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/pre-compact-save.sh"
          }
        ]
      }
    ]
  }
}
```

Combineer dit met een CLAUDE.md-instructie: "When PreCompact fires, summarize: current task, files changed, open decisions, next steps — append to `.claude/memory/session-state.md`."

---

## Recept 5 — Kosten-tracker

Schat tokenkosten per sessie en log ze.

**.claude/hooks/cost-tracker.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COST_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/costs.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$COST_FILE")"

# Extract usage data if available
USAGE=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
usage = d.get('usage', {})
inp = usage.get('input_tokens', 0)
out = usage.get('output_tokens', 0)
print(f'input={inp} output={out}')
" 2>/dev/null || echo "usage=unavailable")

echo "${TIMESTAMP} | ${USAGE}" >> "$COST_FILE"
```

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/cost-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  }
}
```

---

## Recept 6 — TypeScript type check op bewerking

Draai `tsc --noEmit` na Claude TypeScript-bestanden bewerkt. Vang type-fouten voordat ze zich opstapelen.

**settings.json:**
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'echo \"${tool_input.file_path}\" | grep -q \"\\.tsx\\?$\" && npx tsc --noEmit 2>&1 | head -20 || true'",
            "async": false,
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Stel `async: false` in zodat Claude de type-fouten ziet en ze onmiddellijk kan corrigeren.

---

## Recept 7 — Git push herinnering

Herinner Claude om te bevestigen voor git push-operaties.

**.claude/hooks/git-push-confirm.sh:**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)

if echo "$COMMAND" | grep -q "git push"; then
  echo "⚠️  About to push to remote. Confirm this is intentional." >&2
  exit 1  # Waarschuwen — Claude zou dit moeten bevestigen
fi

exit 0
```

**settings.json:**
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/git-push-confirm.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Recept 8 — Session Start context loader

Bij sessiestart, herinner Claude automatisch sleutelcontextbestanden te lezen.

**.claude/hooks/session-start.sh:**
```bash
#!/usr/bin/env bash
# Output text that gets prepended to Claude's context at session start
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"

if [ -f "$MEMORY_FILE" ]; then
  echo "Previous session state found at .claude/memory/session-state.md — read it before starting work."
fi

if [ -f "${CLAUDE_PROJECT_DIR}/CONTEXT.md" ]; then
  echo "Domain glossary available at CONTEXT.md — read it for project terminology."
fi
```

**settings.json:**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Hooks combineren

Hooks stellen samen — je kunt meerdere hooks op dezelfde event hebben, elk met verschillende matchers.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "npx prettier --write ${tool_input.file_path}", "async": true }
        ]
      },
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/tsc-check.sh", "async": false }
        ]
      },
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/audit-log.sh", "async": true }
        ]
      }
    ]
  }
}
```

Dit draait: prettier (async) + TypeScript check (sync, Claude wacht) + audit log (async) op elk bestandsschrijven.

---

## Hooks troubleshooten

**Hook vuurt niet af:**
- Controleer event-naam exact: `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`
- Controleer script uitvoerbaar is: `chmod +x .claude/hooks/your-script.sh`
- Controleer pad gebruikt `${CLAUDE_PROJECT_DIR}` correct

**Hook blokkeert alles:**
- Als je hook met `2` op elke oproep afsluit, worden alle tool-oproepen geblokkeerd
- Voeg logging toe aan de hook om te zien welke input het ontvangt
- Test hook handmatig: `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | bash .claude/hooks/your-script.sh`

**Hook draait maar output niet zichtbaar:**
- Stdout van async hooks wordt verworpen. Gebruik stderr (`>&2`) voor berichten die je wilt zien.
- Voor sync hooks, stdout wordt getoond aan Claude; stderr aan gebruiker.

---

## Geavanceerde hook-mogelijkheden

### continueOnBlock

Standaard, wanneer een PostToolUse hook afsluit met code `2` om een tool-oproep te blokkeren, eindigt Claude's beurt. Met `continueOnBlock: true` wordt de blokreden aan Claude gefeed als bericht en gaat de beurt door — Claude kan de reden lezen en een ander approach proberen zonder gebruiker-tussenkomst.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{"type": "command", "command": "bash /hooks/validate-command.sh"}],
      "continueOnBlock": true
    }]
  }
}
```

Primaire use case: lint en format hooks die op schendingen blokkeren en Claude auto-fix toestaan en opnieuw proberen, in plaats van stoppen en wachten op mensenlijks prompt.

---

### terminalSequence output

Hooks kunnen OSC escape-reeksen in hun JSON stdout uitzenden om desktop-meldingen te activeren, titel van venster in te stellen of terminalklok te rinkelen — zonder controlerende terminal nodig.

```python
import json, sys

result = {
    "terminalSequence": "\033]0;Claude — Task Complete\007",  # sets window title
}
print(json.dumps(result))
```

Nuttig voor oppervlakte-voltooiing-status of fouten in titelbalk wanneer lange achtergrondtaken draaien.

---

### exec form (args array)

In plaats van shell string `command`, geef een `args` array door om het hook-proces direct te spawnen zonder shell aan te roepen. Dit elimineert quoting en escaping-problemen wanneer geïnterpoleerde waarden als `${tool_name}` of `${tool_input}` spaties, aanhalingstekens of speciale karakters bevatten.

```json
{
  "type": "command",
  "command": {
    "args": ["/usr/local/bin/my-hook", "--tool", "${tool_name}", "--input", "${tool_input}"]
  }
}
```

Gebruik args form voor elke hook die gestructureerde data ontvangt van tool-inputs. Gebruik string form alleen wanneer je echt shell-features nodig hebt (pipes, conditionele logica, globs).

---

### type: "mcp_tool"

Hooks kunnen een tool op een al-verbonden MCP-server direct aanroepen, zonder subprocess te spawnen. Dit is lagere overhead dan shell-script en houdt de hook binnen de auth-context van MCP-verbinding.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "hooks": [{
        "type": "mcp_tool",
        "server": "my-mcp-server",
        "tool": "log_file_write",
        "input": {"path": "${tool_input.file_path}"}
      }]
    }]
  }
}
```

De MCP-server benoemd in `server` moet al in de sessie verbonden zijn. Het `tool` veld is de exacte tool-naam blootgesteld door die server. Gebruik dit patroon voor audit logging, meldingen of state synchronisatie via MCP zonder subprocess laag toe te voegen.

---

### PreCompact — compactie blokkeren

PreCompact hooks kunnen actief compactie blokkeren door af te sluiten met code `2` of `{"decision": "block"}` in stdout. Gebruik dit om save of backup uit te voeren en compactie alleen toestaan zodra status veilig is opgeslagen.

**.claude/hooks/pre-compact-backup.sh:**
```bash
#!/bin/bash
# Save transcript first, then allow compaction
cp .claude/session.jsonl .claude/backups/session-$(date +%s).jsonl
# Exit 0 to allow compaction, exit 2 to block it
exit 0
```

Als backup faalt en je compactie wilt voorkomen, sluit af met `2`. Claude zal blokreden oppervlakte en sessie gaat door zonder compactie.

---

### Agent-scoped hooks

Hooks kunnen scoped zijn naar een specifieke agent door `hooks:` veld toe te voegen aan agent's frontmatter. Deze hooks vuren alleen af wanneer die agent actief is — ze beïnvloeden niet root sessie of andere agents.

```yaml
---
name: my-agent
description: "..."
hooks:
  Stop:
    - type: command
      command: echo "Agent finished" >> .claude/agent.log
---
```

Gebruik agent-scoped hooks voor agent-specifieke observeerbaarheid (logging als agent voltooit), resource cleanup (temp bestanden verwijderen die agent maakte) of kostentracking scoped naar single agent's activiteit.

---

### effort.level in hook-environment

Het actieve effort level is beschikbaar als `$CLAUDE_EFFORT` environment variabele in hook-scripts. Waarden: `low`, `normal`, `high`, `xhigh`.

```bash
#!/bin/bash
if [ "$CLAUDE_EFFORT" = "xhigh" ]; then
  echo "Running extended validation..."
  run-full-test-suite
fi
```

Gebruik dit voor conditioneel dure validatie runnen alleen wanneer Claude in extended-effort modus draait, of skip optionele checks op low effort voor latency.

---

### Conditional `if:` Hooks

Voer hook uit alleen wanneer conditie waar is. Het `if:` veld neemt shell-expressie die is geëvalueerd voor hook draait. Als het non-zero afsluit, hook is helt overgeslagen.

```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write",
      "if": "echo \"$TOOL_INPUT\" | grep -q '\\.(ts|tsx)$'",
      "hooks": [{"type": "command", "command": "npx tsc --noEmit"}]
    }]
  }
}
```

De `if:` expressie heeft toegang tot dezelfde environment variabelen als hook zelf — `$TOOL_INPUT`, `$TOOL_NAME`, `$CLAUDE_PROJECT_DIR`, `$CLAUDE_EFFORT`, etc.

**Veel voorkomende `if:` patronen:**

Draai alleen op TypeScript-bestanden:
```bash
"if": "echo \"$TOOL_INPUT\" | grep -q '\\.tsx\\?$'"
```

Draai alleen wanneer op main branch:
```bash
"if": "[ \"$(git branch --show-current)\" = \"main\" ]"
```

Draai alleen wanneer specifiek config-bestand bestaat:
```bash
"if": "[ -f .env.production ]"
```

Draai alleen op xhigh effort:
```bash
"if": "[ \"$CLAUDE_EFFORT\" = \"xhigh\" ]"
```

Conditional hooks stellen schoon samen met bestaande matcher-systeem — matcher filtert op tool-naam, `if:` filtert op runtime-voorwaarden. Gebruik beide samen voor precieze, low-overhead hook-triggers.

---

### `background_tasks` en `session_crons` in Stop/SubagentStop hooks

De `Stop` en `SubagentStop` hook-payloads bevatten nu twee extra velden die rapporteren wat nog draait wanneer sessie eindigt:

```json
{
  "event": "Stop",
  "background_tasks": [
    {"id": "task-123", "status": "running", "started_at": "2026-05-23T10:00:00Z"}
  ],
  "session_crons": [
    {"id": "cron-456", "schedule": "0 * * * *", "last_run": "2026-05-23T09:00:00Z"}
  ]
}
```

**`background_tasks`** — taken gestart via `claude --bg` of gespawnd door agent tijdens sessie die nog draaien bij stop-tijd.

**`session_crons`** — terugkerende taken geregistreerd met `/loop` of Cron API die gepland zijn en nog actief.

**Use cases:**

Wacht op achtergrondtaken voordat archivering:
```bash
#!/bin/bash
INPUT=$(cat)
RUNNING=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
tasks = d.get('background_tasks', [])
print(len([t for t in tasks if t['status'] == 'running']))
" 2>/dev/null || echo "0")

if [ "$RUNNING" -gt 0 ]; then
  echo "Session stopped with $RUNNING background task(s) still running." >&2
fi
```

Alert wanneer cron wees gemaakt wordt door sessieeinde:
```bash
#!/bin/bash
INPUT=$(cat)
CRON_COUNT=$(echo "$INPUT" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(len(d.get('session_crons', [])))
" 2>/dev/null || echo "0")

if [ "$CRON_COUNT" -gt 0 ]; then
  echo "Warning: $CRON_COUNT session cron(s) will stop when this session ends." >&2
fi
```

Registreer dit script als `Stop` hook met `matcher: ""` om het te draaien op elk sessieeinde.

---

## PostToolUse output vervangen

PostToolUse hooks kunnen vervangen wat Claude ziet van ELKE tool's output — niet alleen MCP-tools. Dit is een van de meest impactvolle hook-features voor context budget management, want tool-resultaten verbruiken ~60% van context-tokens in typische agentic sessies.

**Hoe het werkt:**
Hook ontvangt tool-output in stdin. Het kan een gewijzigde versie teruggeven via `hookSpecificOutput.updatedToolOutput`. Claude ziet de vervangen output in plaats van origineel. De tool is al uitgevoerd — bestanden geschreven, commando's draaide, network-verzoeken verzonden — dus dit verandert alleen wat Claude's context inkomt, niet wat gebeurde.

**Configuratie:**
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/compress-output.py"
      }]
    }]
  }
}
```

**Script-voorbeeld — comprimeer breedsprakige bash output:**
```python
#!/usr/bin/env python3
"""Compress Bash tool output that exceeds a threshold."""
import json, sys

THRESHOLD = 10_000  # characters

data = json.load(sys.stdin)
output = data.get("tool_output", "")

if len(output) > THRESHOLD:
    # Keep first 2000 and last 2000 chars, summarize middle
    compressed = (
        output[:2000]
        + f"\n\n... [{len(output) - 4000} characters truncated] ...\n\n"
        + output[-2000:]
    )
    result = {
        "hookSpecificOutput": {
            "updatedToolOutput": compressed
        }
    }
    print(json.dumps(result))
else:
    # Output unchanged — print nothing (no replacement)
    pass
```

**Use cases:**
- **Redact geheimen:** scan output voor API-sleutels/tokens en vervang met `[REDACTED]` voor Claude ziet
- **Normalize diffs:** verwijder ruis van git diff output (tijdstempels, index regels)
- **Comprimeer breedsprakige output:** truncate npm install logs, grote query-resultaten, build output
- **Context budget recuperatie:** tool-resultaten verbruiken ~60% tokens; vervangen 50K chars met 500 chars wint massieve context

**Belangrijk:** originele output wordt vastgelegd in telemetrie/analytics voor hook draait. Vervanging beïnvloedt alleen wat Claude ziet in zijn contextvenster.

**Beschikbaar sinds:** v2.1.121+

---

## Agent Team hook-events

Drie hook-events specifiek voor Agent Teams. Deze vuren af tijdens team-coördinatie en laten je kwaliteitsgrenzen afdwingen op taak-management.

### TeammateIdle

Fires wanneer teamgenoot op punt staat werkeloos te worden (stoppen met werken). Gebruik om teamgenoten productief te houden.

- **Exit 0:** sta teamgenoot toe werkeloos te gaan
- **Exit 2:** stuur feedback naar teamgenoot en hou hem werkend

```json
{
  "hooks": {
    "TeammateIdle": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/check-remaining-tasks.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# check-remaining-tasks.sh — keep teammate working if tasks remain
PENDING=$(cat ~/.claude/tasks/*/tasks.json 2>/dev/null | python3 -c "
import json,sys
tasks = json.load(sys.stdin)
pending = [t for t in tasks if t.get('status') == 'pending']
print(len(pending))
" 2>/dev/null || echo "0")

if [ "$PENDING" -gt 0 ]; then
  echo "There are $PENDING pending tasks. Pick up the next one."
  exit 2  # keep working
fi
exit 0  # allow idle
```

### TaskCreated

Fires wanneer taak aan gedeelde takenlijst wordt toegevoegd. Gebruik om taak-kwaliteitnormen af te dwingen.

- **Exit 0:** sta taak-aanmaak toe
- **Exit 2:** voorkom aanmaak en stuur feedback

```json
{
  "hooks": {
    "TaskCreated": [{
      "hooks": [{
        "type": "command",
        "command": "python3 ~/.claude/hooks/validate-task.py"
      }]
    }]
  }
}
```

Use case: verwerp taken die te vaag zijn (geen acceptatiecriteria), te groot (moet splitsen) of dubbel bestaande taken.

### TaskCompleted

Fires wanneer taak als compleet wordt gemarkeerd. Gebruik als kwaliteitsgate.

- **Exit 0:** sta voltooiing toe
- **Exit 2:** voorkom voltooiing en stuur feedback (teamgenoot moet probleem oplossen)

```json
{
  "hooks": {
    "TaskCompleted": [{
      "hooks": [{
        "type": "command",
        "command": "bash ~/.claude/hooks/verify-tests-pass.sh"
      }]
    }]
  }
}
```

```bash
#!/bin/bash
# verify-tests-pass.sh — block task completion if tests fail
if ! npm test --silent 2>/dev/null; then
  echo "Tests are failing. Fix test failures before marking this task complete."
  exit 2  # block completion
fi
exit 0  # allow completion
```

**Opmerking:** Deze hooks vuren alleen af wanneer Agent Teams ingeschakeld is (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). Ze hebben geen effect in normale single-sessie modus.

---

## Werk met ons
