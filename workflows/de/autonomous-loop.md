# Autonome Task-Schleife

Langlebige Claude Code-Sitzung, die eine Task-Queue ohne menschliches Eingreifen abarbeitet — liest Tasks, führt sie aus, überprüft, markiert sie als erledigt und fährt fort, bis die Queue leer ist oder eine Beendigungsbedingung erfüllt ist.

---

## Wann zu verwenden

- Verarbeitung großer Rückstände ähnlicher Tasks (Code-Review, Migration, Lint-Fixes, Test-Generierung)
- Automations-Läufe über Nacht oder am Wochenende, wenn kein Mensch verfügbar ist, um Sitzungen fortzusetzen
- CI/CD-Pipeline-Schritte, die agentengesteuerte Entscheidungen erfordern, nicht nur Script-Ausführung
- Batch-Operationen, bei denen die Arbeitseinheit gut definiert und die Fehlergrenze klar ist

Nicht verwenden für Tasks, die menschliche Entscheidungen bei jedem Element erfordern, destruktive Operationen ohne Dry-Run-Validierung oder Workflows, bei denen eine schlechte Entscheidung bei allen verbleibenden Tasks zu Kaskadenausfällen führt.

---

## Phasen / Schritte

### Das Schleifenmuster

```
Task aus Queue lesen
  → Task ausführen
    → Ausgabe überprüfen
      → Als erledigt / fehlgeschlagen markieren
        → Nächste Task lesen (oder beenden)
```

Jede Iteration schreibt den Zustand, bevor sie fortfährt. Wenn die Sitzung während einer Task unterbrochen wird, nimmt die nächste Sitzung vom letzten committed Zustand aus wieder auf, anstatt abgeschlossene Arbeit erneut auszuführen.

---

### Task-Queue-Format

Tasks befinden sich in `.claude/tasks.jsonl` — ein JSON-Objekt pro Zeile, in Reihenfolge angefügt.

```jsonl
{"id": "t_001", "type": "review_pr", "payload": {"pr_number": 1042, "repo": "api-service"}, "status": "pending"}
{"id": "t_002", "type": "review_pr", "payload": {"pr_number": 1043, "repo": "api-service"}, "status": "pending"}
{"id": "t_003", "type": "auto_merge", "payload": {"pr_number": 1038, "repo": "api-service"}, "status": "pending", "requires_approval": true}
```

**Statuswerte:** `pending` → `in_progress` → `done` | `failed` | `skipped`

**Erforderliche Felder:** `id` (eindeutig), `type` (Task-Handler-Schlüssel), `payload` (Task-spezifische Daten), `status`

**Optionale Felder:**
- `requires_approval: true` — Menschliches Kontrolltор vor der Ausführung
- `dry_run: true` — Logik ausführen, aber Schreibvorgänge/Änderungen überspringen
- `depends_on: ["t_001"]` — Nicht ausführen, bis aufgelistete Tasks `done` sind
- `max_retries: 3` — Vor dem Markieren als `failed` bei Fehlschlag erneut versuchen

---

### Zustandspersistenz

Nach Abschluss jeder Task (Erfolg oder Fehler) den aktualisierten Zustand in `.claude/loop-state.json` schreiben:

```json
{
  "session_id": "loop_20260523_1400",
  "started_at": "2026-05-23T14:00:00Z",
  "last_updated": "2026-05-23T14:47:33Z",
  "iteration": 17,
  "tasks_total": 50,
  "tasks_done": 16,
  "tasks_failed": 1,
  "tasks_remaining": 33,
  "error_count": 1,
  "last_task_id": "t_016",
  "status": "running"
}
```

Bei Sitzungsstart liest die Schleife diese Datei, um von dort aus fortzufahren, wo sie stehen geblieben ist. Wenn die Datei nicht existiert, ist dies ein frischer Durchlauf.

---

### Keepalive-Mechanismus

Claude Code-Sitzungen enden, wenn Claude nicht mehr antwortet. Der Stop-Hook injiziert eine Fortsetzungsnachricht, um die Schleife automatisch neu zu starten.

**`.claude/settings.json` Eintrag:**

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/loop-keepalive.sh"
          }
        ]
      }
    ]
  }
}
```

**`.claude/loop-keepalive.sh`:**

```bash
#!/bin/bash
# Only keepalive if loop is active and not terminated
STATE_FILE=".claude/loop-state.json"
STOP_SENTINEL=".claude/stop"

if [ -f "$STOP_SENTINEL" ]; then
  echo "Stop sentinel found. Loop terminated." >&2
  exit 0
fi

if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

STATUS=$(python3 -c "import json,sys; d=json.load(open('$STATE_FILE')); print(d.get('status',''))")
if [ "$STATUS" = "running" ]; then
  echo "Continue the autonomous loop. Read .claude/loop-state.json for current position and .claude/tasks.jsonl for the task queue. Resume from where you left off."
fi
```

Der Hook wird beim Stopp von Claude ausgelöst. Wenn die Schleife noch im Status `running` ist, führt die Fortsetzungsnachricht dazu, dass Claude Code die Schleife automatisch neu startet.

---

### Schleife-Beendigungsbedingungen

Die Schleife wird beendet (setzt `status: terminated` in loop-state.json), wenn eine dieser Bedingungen erfüllt ist:

| Bedingung | Auslöser | Aktion |
|-----------|---------|--------|
| Queue leer | Keine `pending` Tasks verbleibend | Status auf `completed` setzen |
| Max Iterationen | `iteration >= max_iterations` (Standard 200) | Status auf `terminated_max_iter` setzen |
| Fehlergrenzwert | `error_count >= error_budget` (Standard 5) | Status auf `terminated_error_budget` setzen |
| Stop-Sentinel | `.claude/stop` Datei existiert | Status auf `terminated_sentinel` setzen |
| Manueller Kill | `SIGINT` / `SIGTERM` | Zustand schreiben, Status auf `terminated_signal` setzen |

Zum Stoppen einer laufenden Schleife: `touch .claude/stop` — die nächste Keepalive-Prüfung sieht das Sentinel und haltet an.

---

### Sicherheitsvorkehrungen

**Menschliche Kontrolltore:**

Für Tasks mit `requires_approval: true` pausiert die Schleife und gibt folgende Meldung aus:

```
[LOOP PAUSED — human approval required]
Task: t_003 (auto_merge pr #1038)
Payload: {"pr_number": 1038, "repo": "api-service"}
Type 'approve t_003' to continue or 'skip t_003' to skip this task.
```

Die Schleife wartet auf eine menschliche Antwort, bevor sie fortfährt. Dies ist angemessen für destruktive Operationen (Merges, Deletes, Deploys), auch in einer ansonsten autonomen Sitzung.

**Dry-Run-Modus:**

Übergeben Sie `--dry-run` an den anfänglichen Schleifenprompt oder setzen Sie `dry_run: true` auf einzelne Tasks. Im Dry-Run-Modus führt die Schleife alle Lese- und Analyseschritte aus, aber überspringt Schreibvorgänge, API-Mutationen und Nebeneffekte. Dry-Run ist der richtige erste Durchgang für jeden neuen Task-Typ.

**Fehlerbudget Auto-Abort:**

```python
if state["error_count"] >= ERROR_BUDGET:
    state["status"] = "terminated_error_budget"
    write_state(state)
    print(f"[LOOP ABORTED] Error budget of {ERROR_BUDGET} exceeded. "
          f"Last failed task: {state['last_task_id']}. Review .claude/loop-state.json.")
    break
```

Das Standard-Fehlerbudget beträgt 5 aufeinanderfolgende oder kumulative Fehler. Höher für verrauschte Tasks, niedriger für hochriskante Operationen.

---

### Loop-Prompt

Der Prompt, der eine autonome Schleife startet oder fortsetzt:

```
You are running an autonomous task loop. Your state is in .claude/loop-state.json and your task queue is in .claude/tasks.jsonl.

Loop rules:
1. Read loop-state.json to find your current position.
2. Read the next pending task from tasks.jsonl.
3. Execute the task according to its type and payload.
4. Verify the output meets the task's success criteria.
5. Update the task's status in tasks.jsonl (done/failed/skipped).
6. Update loop-state.json with current progress.
7. If the task has requires_approval: true, pause and wait for human input.
8. Check termination conditions. If none apply, proceed to the next task.

On any unexpected error: mark the task failed, increment error_count in state, and continue unless error_count >= error_budget.

Do not ask for permission between tasks unless requires_approval is set. Work autonomously.
```

---

## Beispiel

**CI/CD Use-Case: Auto-Review und Auto-Merge von 50 PRs**

**Setup:**

```bash
# Generate task queue from open PRs
gh pr list --repo my-org/api-service --state open --limit 50 --json number \
  | jq -r '.[] | {"id": ("t_" + (.number|tostring)), "type": "review_pr", "payload": {"pr_number": .number, "repo": "api-service"}, "status": "pending"}' \
  > .claude/tasks.jsonl

# Add auto-merge tasks for PRs that pass review (depends_on will be set by the loop)
# The review task itself appends an auto_merge task if review passes
```

**Task-Handler-Logik (im Schleifenprompt):**

- `review_pr`: PR-Diff mit `gh pr diff {pr_number}` abrufen, code-review Skill ausführen, Review-Kommentar posten, Ergebnis zum Zustand hinzufügen
- `auto_merge`: Wenn Review bestanden und CI grün (`gh pr checks {pr_number}`), mit `gh pr merge {pr_number} --squash` mergen; Wenn CI ausstehend, als `skipped` markieren und in die Queue zurück

**Parallele Verarbeitung:**

Für unabhängige Tasks (alle Review-Tasks, keine Merge-Abhängigkeiten) Subagentatoren spawnen:

```
For tasks t_001 through t_025: spawn a subagent for each review_pr task.
Each subagent writes its result back to tasks.jsonl atomically (use file locking).
Wait for all subagents to complete before processing auto_merge tasks.
```

**Schleifenausführung (50 PRs):**

```
[14:00:00] Loop started. 50 tasks pending.
[14:00:05] Spawned 25 review subagents (t_001–t_025)
[14:12:30] Reviews complete: 22 passed, 3 failed (changes requested)
[14:12:30] Processing auto_merge tasks for 22 approved PRs
[14:14:15] 19 merged (CI green). 3 skipped (CI pending — re-queued for next run).
[14:14:15] Queue empty. Loop completed. 41 done, 3 skipped, 3 failed (changes requested).
[14:14:15] Status: completed. Written to .claude/loop-state.json.
```

Gesamtzeit: ~14 Minuten für 50 PRs. Äquivalente manuelle Zeit: 3–4 Stunden.

---
