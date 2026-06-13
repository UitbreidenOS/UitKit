# Claude Code Routines

Routines sind geplante, wiederkehrende Claude Code Sitzungen — sie führen einen vordefinierten Prompt nach einem cron-ähnlichen Zeitplan aus, ohne dass Sie anwesend sind. Richten Sie eine ein und Claude wird Ihre PRs jeden Morgen triagieren, Abhängigkeiten jeden Montag prüfen oder eine Standup-Zusammenfassung vor Ihrer 9 Uhr erstellen.

---

## Was Routines sind

Eine Routine ist eine Claude Code Sitzung, die:
- Zu einer geplanten Zeit startet (nicht von Ihnen ausgelöst)
- Einen bestimmten Prompt ausführt, den Sie definieren
- In einem Arbeitsverzeichnis läuft, das Sie angeben
- Alle Tools und Skills nutzt, die für dieses Projekt konfiguriert sind
- Ausgaben protokolliert, die Sie später überprüfen können

Routines sind keine Daemons. Jeder Aufruf ist eine neue Sitzung — keine Erinnerung an den vorherigen Lauf, es sei denn, Sie schreiben den Zustand ausdrücklich in eine Datei und lesen ihn im Prompt.

---

## Wo konfiguriert wird

**Web-Interface:** claude.ai/code → Routines-Tab → Neue Routine

**Settings-Datei** (`settings.json` oder `~/.claude/settings.json`):

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

## Routine-Definitionsfelder

| Feld | Typ | Erforderlich | Beschreibung |
|---|---|---|---|
| `name` | string | ja | Eindeutige Kennung, in Logs angezeigt |
| `schedule` | string | ja | Cron-Ausdruck oder natürliche Sprache |
| `prompt` | string | ja | Der vollständige Prompt, den Claude beim Sitzungsstart erhält |
| `workingDirectory` | string | ja | Absoluter Pfad; Claudes cwd für die Sitzung |
| `model` | string | nein | Standardmäßig Ihr konfiguriertes Standardmodell |
| `maxTurns` | integer | nein | Erzwungener Stopp nach N Zügen (verhindert unkontrollierte Sitzungen) |
| `enabled` | boolean | nein | `false`, um eine Routine zu pausieren, ohne sie zu löschen |

### Planungsformate

```
# Cron-Ausdruck
"schedule": "0 8 * * 1-5"        # 8 Uhr Montag–Freitag
"schedule": "0 9 * * 1"          # 9 Uhr jeden Montag
"schedule": "0 23 * * *"         # 23 Uhr jede Nacht
"schedule": "0 */4 * * *"        # Alle 4 Stunden

# Natürliche Sprache (intern in Cron konvertiert)
"schedule": "every weekday at 8am"
"schedule": "every Monday at 9am"
"schedule": "daily at 11pm"
"schedule": "every 4 hours"
```

---

## Häufige Routine-Muster

### Tägliche PR-Triage

```json
{
  "name": "pr-triage",
  "schedule": "0 8 * * 1-5",
  "prompt": "Check all open PRs using gh pr list. For each: note CI status, days open, and whether there are unresolved review comments. Output a markdown table to .claude/daily-triage.md. Flag anything blocked or stale.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Wöchentliche Abhängigkeitsprüfung

```json
{
  "name": "dep-audit",
  "schedule": "0 9 * * 1",
  "prompt": "Run npm audit and npm outdated. Summarize critical vulnerabilities and packages more than 2 major versions behind. Write findings to .claude/dep-audit.md with a recommended action for each item.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Nächtlicher Testlauf und Zusammenfassung

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

### Tägliche Standup-Zusammenfassung

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
| **Auslöser** | Zeitplan (Cron) | Ereignis in aktiver Sitzung | Kontinuierlich / Intervall in aktueller Sitzung |
| **Sitzung** | Neue Sitzung bei jedem Lauf | Wird in bestehender Sitzung ausgelöst | Aktuelle Sitzung |
| **Sie anwesend?** | Nein | Ja (oder unbeaufsichtigt laufend) | Ja (oder unbeaufsichtigt laufend) |
| **Verwenden für** | Wiederkehrende Hintergrundaufgaben | Reaktive Automatisierung | Kontinuierliche Überwachung in einer Sitzung |

**Wichtiger Unterschied:** Routines und Hooks sind keine Alternativen — sie ergänzen sich. Eine Routine startet zu einem geplanten Zeitpunkt eine neue Sitzung, und alle für dieses Projekt konfigurierten Hooks werden an ihren normalen Ereignispunkten ausgelöst.

---

## Routines mit Hooks kombinieren

Wenn eine Routine läuft, gilt der vollständige Claude Code Sitzungslebenszyklus. Hooks, die in `settings.json` konfiguriert sind, werden bei ihren normalen Ereignispunkten ausgelöst:

```
Routine wird um 8 Uhr ausgelöst
  → Neue Claude Code Sitzung startet
  → Claude liest Prompt und beginnt zu arbeiten
  → PostToolCall Hook wird nach jeder Tool-Nutzung ausgelöst (z.B. führt Linter aus)
  → Stop Hook wird ausgelöst, wenn Claude fertig ist (z.B. sendet Slack-Benachrichtigung)
```

Beispiel: Routine führt Tests nachts aus, `Stop` Hook sendet Ergebnisse zu Slack:

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

## Fehlerhafte Routines debuggen

1. **Routines-Log prüfen** — claude.ai/code → Routines-Tab → auf Routine klicken → Ausführungsverlauf ansehen. Jeder Lauf zeigt Startzeit, Endzeit, Zuganzahl und Beendigungsstatus.

2. **Sitzungsausgabe inspizieren** — das vollständige Transkript ist in der detaillierten Laufansicht verfügbar. Suchen Sie nach Tool-Fehlern, Zugriffsverweigerungen oder Claude, der vorzeitig stoppt.

3. **Prompt manuell testen** — kopieren Sie den Routine-Prompt und führen Sie ihn interaktiv im selben Arbeitsverzeichnis aus. Dies isoliert, ob das Problem in der Prompt-Logik oder der Planung liegt.

4. **`maxTurns` prüfen** — wenn eine Routine bei einer Aufgabe stoppt, hat sie möglicherweise die Zugbeschränkung erreicht. Erhöhen Sie `maxTurns` oder konzentrieren Sie den Prompt.

5. **Arbeitsverzeichnis prüfen** — eine Routine, die Dateien nicht finden kann, hat oft ein falsches `workingDirectory`. Verwenden Sie absolute Pfade.

---

## Programmatische Routine-Verwaltung

Claude Code stellt nun drei Tools zur Verwaltung von Routines aus einer Sitzung bereit — ohne Bedarf, settings.json manuell zu bearbeiten:

**CronCreate** — erstelle eine neue Routine aus einer Claude Code Sitzung:
```
CronCreate(
  prompt: "Check all open PRs and write summary to .claude/pr-triage.md",
  schedule: "0 8 * * 1-5",
  name: "daily-pr-triage"           // optional
)
```
Gibt die ID der erstellten Routine zurück. Die Routine ist sofort aktiv.

**CronList** — liste alle Routines auf, die für das aktuelle Projekt konfiguriert sind:
```
CronList()
```
Gibt ein Array von Routines mit id, name, schedule, letzter Laufzeit, nächster Laufzeit und aktiviertem Status zurück.

**CronDelete** — entferne eine Routine nach ID:
```
CronDelete(id: "routine-abc123")
```

**Wann das wichtig ist:**
- Claude in einer Sitzung auffordern, eine Routine einzurichten: "Create a routine that runs my test suite every night at 11pm"
- Claude kann Routines als Teil von Projekt-Setup-Workflows erstellen
- Kombinieren Sie mit dem Skill `skill/productivity/autofix-pr.md`: Claude richtet die Routine selbst nach der Skill-Installation ein

**Beispiel — Claude richtet seine eigene Überwachung ein:**
```
Benutzer: "Set up a routine to audit our npm dependencies every Monday morning"
Claude: [ruft CronCreate mit passendem Prompt und Zeitplan "0 9 * * 1" auf]
Claude: "Done — routine 'dep-audit' will run every Monday at 9am. Use CronList to verify."
```

**Session Crons vs. persistente Routines:** CronCreate erstellt persistente Routines, die über das Sitzungsende hinaus bestehen bleiben. Für Planung in der Sitzung (einmaliges Auslösen nach einer Verzögerung) verwenden Sie stattdessen ScheduleWakeup.

---

## Aktive Routines aus Hooks inspizieren

Die Stop-Hook Payload enthält jetzt ein `session_crons` Feld, das alle Routines auflistet, die während der Sitzung aktiv waren. Dies ermöglicht Ihrem Stop-Hook zu protokollieren, welche Routines geplant sind, oder zu warnen, wenn eine kritische Routine gelöscht wurde.

Beispiel Stop-Hook, der aktive Routines protokolliert:
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
