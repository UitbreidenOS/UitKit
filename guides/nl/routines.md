# Claude Code Routines

Routines zijn geplande, terugkerende Claude Code sessies — ze voeren een voorgedefinieerde prompt uit volgens een cron-achtig schema zonder dat u aanwezig bent. Stel er een in en Claude zal uw PR's elke ochtend triëren, afhankelijkheden elke maandag controleren, of een standup-briefing genereren voor uw 9 uur.

---

## Wat Routines zijn

Een routine is een Claude Code sessie die:
- Op een geplande tijd start (niet door u geactiveerd)
- Een specifieke prompt uitvoert die u definieert
- In een werkdirectory werkt die u aangeeft
- Alle tools en skills gebruikt die voor dat project zijn geconfigureerd
- Uitvoer registreert die u later kunt bekijken

Routines zijn geen daemons. Elke aanroep is een nieuwe sessie — geen herinnering van de vorige run tenzij u de status expliciet naar een bestand schrijft en deze in de prompt leest.

---

## Waar configureren

**Webinterface:** claude.ai/code → Routines-tabblad → Nieuwe Routine

**Instellingsbestand** (`settings.json` of `~/.claude/settings.json`):

```json
{
  "routines": [
    {
      "name": "daily-pr-triage",
      "schedule": "0 8 * * 1-5",
      "prompt": "Review all open PRs in this repo. For each PR: check if CI is passing, identify any review comments that need a response, flag PRs older than 3 days with no activity. Write a summary to .claude/pr-triage.md",
      "workingDirectory": "/home/user/projects/my-app",
      "model": "claude-sonnet-4-5"
    }
  ]
}
```

---

## Routine Definitievelden

| Veld | Type | Vereist | Beschrijving |
|---|---|---|---|
| `name` | string | ja | Unieke identifier, weergegeven in logs |
| `schedule` | string | ja | Cron-expressie of natuurlijke taal |
| `prompt` | string | ja | De volledige prompt die Claude ontvangt wanneer de sessie start |
| `workingDirectory` | string | ja | Absoluut pad; Claude's cwd voor de sessie |
| `model` | string | nee | Standaard uw geconfigureerde standaardmodel |
| `maxTurns` | integer | nee | Gedwongen stop na N beurten (voorkomt weglopende sessies) |
| `enabled` | boolean | nee | `false` om een routine te pauzeren zonder deze te verwijderen |

### Planningsformaten

```
# Cron-expressie
"schedule": "0 8 * * 1-5"        # 8 uur maandag–vrijdag
"schedule": "0 9 * * 1"          # 9 uur elke maandag
"schedule": "0 23 * * *"         # 23 uur elke nacht
"schedule": "0 */4 * * *"        # Elke 4 uur

# Natuurlijke taal (intern omgezet naar cron)
"schedule": "every weekday at 8am"
"schedule": "every Monday at 9am"
"schedule": "daily at 11pm"
"schedule": "every 4 hours"
```

---

## Veelvoorkomende Routine Patronen

### Dagelijkse PR Triage

```json
{
  "name": "pr-triage",
  "schedule": "0 8 * * 1-5",
  "prompt": "Check all open PRs using gh pr list. For each: note CI status, days open, and whether there are unresolved review comments. Output a markdown table to .claude/daily-triage.md. Flag anything blocked or stale.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Wekelijkse Afhankelijkheidenaudit

```json
{
  "name": "dep-audit",
  "schedule": "0 9 * * 1",
  "prompt": "Run npm audit and npm outdated. Summarize critical vulnerabilities and packages more than 2 major versions behind. Write findings to .claude/dep-audit.md with a recommended action for each item.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Nachtelijke Testruns en Samenvatting

```json
{
  "name": "nightly-tests",
  "schedule": "0 23 * * *",
  "prompt": "Run the full test suite with npm test. Capture output. If any tests fail, analyze the failure, check git log for today's commits that touched those files, and write a failure report to .claude/test-failures.md including the most likely cause per failure.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-sonnet-4-5",
  "maxTurns": 20
}
```

### Dagelijkse Standup Briefing

```json
{
  "name": "standup-prep",
  "schedule": "30 8 * * 1-5",
  "prompt": "Prepare my standup briefing for today. Read: (1) git log --since=yesterday to see what I committed, (2) .claude/pr-triage.md for PR status, (3) any TODO comments I left in code yesterday. Write a 3-section standup doc to .claude/standup-today.md: What I did, What I'm doing today, Blockers.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

---

## Routines vs Hooks vs `/loop`

| | Routines | Hooks | `/loop` |
|---|---|---|---|
| **Activering** | Schema (cron) | Gebeurtenis in actieve sessie | Doorlopend / interval in huidige sessie |
| **Sessie** | Nieuwe sessie per run | Geactiveerd in bestaande sessie | Huidige sessie |
| **U aanwezig?** | Nee | Ja (of zonder toezicht actief) | Ja (of zonder toezicht actief) |
| **Gebruiken voor** | Terugkerende achtergrondtaken | Reactieve automatisering | Voortdurende monitoring in een sessie |

**Belangrijk verschil:** Routines en hooks zijn niet onderling uitwisselbaar — ze werken samen. Een routine start op een geplande tijd een nieuwe sessie, en alle hooks die voor dat project zijn geconfigureerd, worden geactiveerd op hun normale gebeurtenispunten.

---

## Routines met Hooks combineren

Wanneer een routine wordt uitgevoerd, is de volledige Claude Code sessielifecycle van toepassing. Hooks die in `settings.json` zijn geconfigureerd, worden geactiveerd op hun normale gebeurtenispunten:

```
Routine activeert om 8 uur
  → Nieuwe Claude Code sessie start
  → Claude leest prompt en begint te werken
  → PostToolCall hook activeert na elk toolgebruik (bijv. voert linter uit)
  → Stop hook activeert wanneer Claude klaar is (bijv. stuurt Slack-bericht)
```

Voorbeeld: routine voert tests 's nachts uit, `Stop` hook stuurt resultaten naar Slack:

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/notify-slack.sh"
          }
        ]
      }
    ]
  }
}
```

---

## Mislukte Routines debuggen

1. **Controleer het Routines-logboek** — claude.ai/code → Routines-tabblad → klik op de routine → bekijk uitvoeringsgeschiedenis. Elke run geeft starttijd, eindtijd, beurtenaantal en exit-status weer.

2. **Inspecteer sessieuitvoer** — het volledige transcript is beschikbaar in de gedetailleerde runweergave. Zoek naar toolfouten, machtigingsweigering, of Claude die voortijdig stopt.

3. **Test de prompt handmatig** — kopieer de routine-prompt en voer deze interactief uit in dezelfde werkdirectory. Dit isoleert of het probleem in de prompt-logica of de planning zit.

4. **Controleer `maxTurns`** — als een routine halverwege stopt, heeft deze mogelijk de beurtenlimiet bereikt. Verhoog `maxTurns` of maak de prompt gerichter.

5. **Controleer werkdirectory** — een routine die bestanden niet kan vinden, heeft vaak een onjuiste `workingDirectory`. Gebruik absolute paden.

---

## Programmatisch Routinebeheer

Claude Code stelt nu drie tools beschikbaar voor het beheren van routines vanuit een sessie — geen noodzaak om settings.json handmatig te bewerken:

**CronCreate** — maak een nieuwe routine aan vanuit een Claude Code sessie:
```
CronCreate(
  prompt: "Check all open PRs and write summary to .claude/pr-triage.md",
  schedule: "0 8 * * 1-5",
  name: "daily-pr-triage"           // optional
)
```
Retourneert de ID van de aangemaakte routine. De routine is onmiddellijk actief.

**CronList** — list alle routines op die voor het huidige project zijn geconfigureerd:
```
CronList()
```
Retourneert een array van routines met id, name, schedule, tijd van laatste run, tijd van volgende run, en enabled status.

**CronDelete** — verwijder een routine op ID:
```
CronDelete(id: "routine-abc123")
```

**Wanneer dit van belang is:**
- Claude vragen om een routine in te stellen gedurende een sessie: "Create a routine that runs my test suite every night at 11pm"
- Claude kan routines maken als onderdeel van projectsetup-workflows
- Combineer met de skill `skill/productivity/autofix-pr.md`: Claude stelt de routine zelf in na skillinstallatie

**Voorbeeld — Claude stelt zijn eigen monitoring in:**
```
Gebruiker: "Set up a routine to audit our npm dependencies every Monday morning"
Claude: [roept CronCreate aan met passende prompt en schema "0 9 * * 1"]
Claude: "Done — routine 'dep-audit' will run every Monday at 9am. Use CronList to verify."
```

**Sessie crons vs persistente routines:** CronCreate maakt persistente routines aan die na de sessie blijven bestaan. Voor schema's binnen de sessie (eenmalig activeren na een vertraging), gebruik in plaats daarvan ScheduleWakeup.

---

## Actieve Routines uit Hooks inspizeren

De Stop-hook payload bevat nu een `session_crons` veld met alle routines die actief waren tijdens de sessie. Dit stelt uw Stop-hook in staat om te registreren welke routines zijn ingepland, of te waarschuwen als een kritieke routine is verwijderd.

Voorbeeld Stop-hook die actieve routines registreert:
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/log-session-crons.sh"
          }
        ]
      }
    ]
  }
}
```

```bash
#!/usr/bin/env bash
# log-session-crons.sh
INPUT=$(cat)
SESSION_CRONS=$(echo "$INPUT" | python3 -c "
import json, sys
data = json.load(sys.stdin)
crons = data.get('session_crons', [])
for c in crons:
    print(f\"  {c.get('name','unnamed')} → {c.get('schedule','?')}\")
")
if [ -n "$SESSION_CRONS" ]; then
  echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] Active routines this session:" >> .claude/session.log
  echo "$SESSION_CRONS" >> .claude/session.log
fi
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
