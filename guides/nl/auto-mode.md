# Auto Mode en autonoom bedrijf

Auto mode laat Claude werken met minimale interrupts — het keurt veilige, niet-destructieve operaties automatisch goed en pauzeert alleen voor menselijke input op acties die irreversibel zijn of echt risico dragen. Gebruik dit voor langdurige taken waarbij constante goedkeuringsprompts uw werkstroom onderbreken.

---

## Hoe in te schakelen

**Slash-opdracht (schakelt voor huidige sessie):**
```
/auto
```

**Instellingenbestand:**
```json
{
  "autoMode": true
}
```

**CLI-vlag:**
```bash
claude --auto "Refactor all API handlers to use the new error middleware"
```

**Gecombineerd met effort voor autonoom werk 's nachts:**
```bash
claude --auto --effort xhigh "Implement the full feature spec in tasks.jsonl"
```

---

## Wat verandert in Auto Mode

In een standaardsessie prompts Claude voor bevestiging vóór de meeste tooloproepen. In auto mode is bevestiging gelaagd:

### Toestemmingslagen

**Altijd auto-goedkeuren (geen prompt)**
- `Read` — elk bestand lezen
- `Grep` / `Glob` — doorzoeken in de codebase
- `Bash` (alleen lezen) — `ls`, `cat`, `find`, `git log`, `git diff`, `git status`, `npm list`, test-opdrachten uitvoeren die state niet wijzigen
- `WebFetch` (GET-aanvragen)

**Eenmaal per sessie vragen (prompt eerste keer, onthoud antwoord)**
- `git add`, `git commit`, `git checkout`
- `npm install`, `npm ci`
- Nieuwe bestanden schrijven
- Directories maken

**Altijd vragen (prompt elke keer)**
- Bestandverwijdering (`rm`, `unlink`)
- `git push --force`
- Database writes (INSERT, UPDATE, DELETE via MCP of CLI)
- Externe API-oproepen die state wijzigen (POST, PUT, PATCH, DELETE)
- Alle `Bash` opdrachten die `sudo` bevatten
- Opdrachten die systeemconfiguratie wijzigen

---

## Veiligheidsmechanismen

### `--max-cost`-vlag
Stop de sessie als de uitgaven een dollardrempel overschrijden:
```bash
claude --auto --max-cost 5.00 "Refactor the entire auth module"
```
Sessie wordt schoon beëindigd wanneer de kosten de limiet bereiken. Claude schrijft een voortgangssamenvatting voordat het stopt.

### `.claude/stop` sentinel file
Maak dit bestand op elk moment aan om een autonome sessie te beëindigen:
```bash
touch .claude/stop
```
Claude controleert dit bestand tussen beurten. Wanneer het bestaat, eindigt de sessie graceful. Verwijder het bestand vóór de volgende sessie.

### Keepalive hook
Voor sessies die 's nachts lopen of over netwerkonderbrekingen heen, configureer u een keepalive die Claude opnieuw start als het onverwacht stopt:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "incomplete",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/keepalive.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
# .claude/hooks/keepalive.sh
# Only restart if there are remaining tasks and no stop sentinel
if [ ! -f ".claude/stop" ] && [ -s ".claude/tasks.jsonl" ]; then
  claude --auto --effort high "Continue working through tasks.jsonl"
fi
```

### `maxTurns`
Harde limiet op het aantal beurten per sessie:
```json
{
  "autoMode": true,
  "maxTurns": 100
}
```

---

## Auto Mode versus `--dangerously-skip-permissions`

Dit zijn niet hetzelfde:

| | Auto Mode | `--dangerously-skip-permissions` |
|---|---|---|
| **Destructieve ops** | Vraagt nog steeds | Volledig omzeild — geen prompts op alles |
| **Bestandverwijdering** | Vraagt altijd | Auto-goedgekeurd |
| **Force push** | Vraagt altijd | Auto-goedgekeurd |
| **Gebruik voor** | Langdurige taken met een mens in de buurt | Volledig vertrouwde sandboxes, CI-omgevingen |
| **Risiconiveau** | Laag — destructieve poort blijft | Hoog — geen veiligheidsnet |

Gebruik nooit `--dangerously-skip-permissions` in interactieve ontwikkeling. Het is ontworpen voor geïsoleerde CI-pijplijnen waar Claude is beperkt tot een weggooibare omgeving.

---

## Best practices voor autonoom bedrijf

**Definieer een taakwachtrij voordat u start.** Claude werkt gedefinieerde taken betrouwbaarder af dan een open-ended prompt. Gebruik `.claude/tasks.jsonl`:

```jsonl
{"id": "1", "task": "Add input validation to all POST endpoints in src/routes/", "status": "pending"}
{"id": "2", "task": "Write tests for each validation rule added in task 1", "status": "pending"}
{"id": "3", "task": "Update API docs to reflect new validation errors", "status": "pending"}
```

```bash
claude --auto "Work through tasks in .claude/tasks.jsonl. Mark each task done as you complete it."
```

**Stel maximale iteraties expliciet in.** Open-ended autonome sessies dwalen af. Een `maxTurns` van 50–150 is geschikt voor de meeste multi-uur taken.

**Test eerst met `--dry-run`.** Voer dezelfde prompt uit met `--dry-run` om de geplande tooloproepen te zien vóór toestemming voor uitvoering:
```bash
claude --auto --dry-run "Delete all TODO comments from the codebase"
```

**Bereik de werkdirectory.** Auto mode respecteert projectgrenzen. Voer Claude uit vanuit de projectroot of een subdirectory om te beperken wat het kan bereiken.

**Lees het sessietranscript achteraf.** Auto-mode sessies produceren een volledig transcript. Lees het — Claudes beslissingen in een lange autonome sessie zijn het waard om te controleren, vooral de "eenmaal per sessie vragen" keuzes die het maakte.

---

## Voorbeeld: autonoom refactor 's nachts

```bash
# Create task queue
cat > .claude/tasks.jsonl << 'EOF'
{"id": "1", "task": "Find all usages of the deprecated fetchUser() function across src/", "status": "pending"}
{"id": "2", "task": "Replace each fetchUser() call with the new getUser() API, preserving error handling", "status": "pending"}
{"id": "3", "task": "Run the test suite and fix any failures caused by the migration", "status": "pending"}
{"id": "4", "task": "Delete the deprecated fetchUser() function and its tests", "status": "pending"}
{"id": "5", "task": "Update CHANGELOG.md with a summary of the deprecation removal", "status": "pending"}
EOF

# Start autonomous session with cost cap
claude --auto --effort high --max-cost 8.00 \
  "Work through .claude/tasks.jsonl in order. Mark each task completed in the file when done. Stop if you encounter an ambiguity that requires a product decision."
```

---
