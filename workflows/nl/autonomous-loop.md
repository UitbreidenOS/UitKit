# Autonome Taakschleife

Langdurige Claude Code-sessie die een taakwachtrij zonder menselijke tussenkomst verwerkt — leest taken, voert ze uit, verifieert, markeert ze als voltooid en gaat verder totdat de wachtrij leeg is of een afsluitingsvoorwaarde wordt bereikt.

---

## Wanneer te gebruiken

- Verwerking van grote achterstanden van gelijkaardige taken (code review, migratie, lint-fixes, testgeneratie)
- Automatiseringsuitvoeringen 's nachts of in het weekend wanneer geen mens beschikbaar is om sessies voort te zetten
- CI/CD-pijplijnstappen die agentgestuurde beslissingen vereisen, niet alleen scriptuitvoering
- Batchbewerkingen waarbij de werkeenheid goed gedefinieerd en de foutgrens duidelijk is

Niet gebruiken voor taken die menselijk oordeel op elk item vereisen, destructieve bewerkingen zonder dry-run-validatie of workflows waarbij één slechte beslissing over alle resterende taken cascadeert.

---

## Fasen / Stappen

### Het lus-patroon

```
taak uit wachtrij lezen
  → taak uitvoeren
    → uitvoer verifiëren
      → als voltooid / mislukt markeren
        → volgende taak lezen (of beëindigen)
```

Elke iteratie schrijft status voordat deze verder gaat. Als de sessie halverwege een taak afbreekt, neemt de volgende sessie vanaf de laatste vastgestelde status op, in plaats van voltooid werk opnieuw uit te voeren.

---

### Taakwachtrij-indeling

Taken bevinden zich in `.claude/tasks.jsonl` — één JSON-object per regel, in volgorde toegevoegd.

```jsonl
{"id": "t_001", "type": "review_pr", "payload": {"pr_number": 1042, "repo": "api-service"}, "status": "pending"}
{"id": "t_002", "type": "review_pr", "payload": {"pr_number": 1043, "repo": "api-service"}, "status": "pending"}
{"id": "t_003", "type": "auto_merge", "payload": {"pr_number": 1038, "repo": "api-service"}, "status": "pending", "requires_approval": true}
```

**Statuswaarden:** `pending` → `in_progress` → `done` | `failed` | `skipped`

**Verplichte velden:** `id` (uniek), `type` (taakhandlerarsleutel), `payload` (taakspecifieke gegevens), `status`

**Optionele velden:**
- `requires_approval: true` — menselijke goedkeuringshek voor uitvoering
- `dry_run: true` — logica uitvoeren maar schrijfbewerkingen/mutaties overslaan
- `depends_on: ["t_001"]` — niet uitvoeren totdat genoemde taken `done` zijn
- `max_retries: 3` — opnieuw proberen bij mislukking voordat als `failed` wordt gemarkeerd

---

### Statushandhaving

Na voltooiing van elke taak (succes of mislukking) de bijgewerkte status naar `.claude/loop-state.json` schrijven:

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

Bij sessiestart leest de lus dit bestand om van waar het stopte over te gaan. Als het bestand niet bestaat, is dit een vervroegde uitvoering.

---

### Keepalive-mechanisme

Claude Code-sessies eindigen wanneer Claude niet meer antwoordt. De Stop-hook injecteert een vervolgbericht om de lus automatisch opnieuw te starten.

**`.claude/settings.json` vermelding:**

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

De hook wordt geactiveerd wanneer Claude stopt. Als de lus nog in `running`-status staat, zorgt het vervolgbericht ervoor dat Claude Code de lus automatisch opnieuw opstart.

---

### Lusafsluitingsvoorwaarden

De lus eindigt (stelt `status: terminated` in loop-state.json) wanneer een van deze waar is:

| Voorwaarde | Trigger | Actie |
|-----------|---------|--------|
| Wachtrij leeg | Geen `pending` taken resterend | Status op `completed` zetten |
| Max iteraties | `iteration >= max_iterations` (standaard 200) | Status op `terminated_max_iter` zetten |
| Foutgrens | `error_count >= error_budget` (standaard 5) | Status op `terminated_error_budget` zetten |
| Stop-sentinel | `.claude/stop` bestand bestaat | Status op `terminated_sentinel` zetten |
| Handmatige kill | `SIGINT` / `SIGTERM` | Status schrijven, status op `terminated_signal` zetten |

Een actieve lus stoppen: `touch .claude/stop` — de volgende keepalive-controle ziet het sentinel en stopt.

---

### Veiligheidsmaatregelen

**Menselijke goedkeuringshekken:**

Voor taken met `requires_approval: true` pauzeert de lus en voert uit:

```
[LOOP PAUSED — human approval required]
Task: t_003 (auto_merge pr #1038)
Payload: {"pr_number": 1038, "repo": "api-service"}
Type 'approve t_003' to continue or 'skip t_003' to skip this task.
```

De lus wacht op menselijke reactie voordat deze doorgaat. Dit is passend voor destructieve bewerkingen (merges, deletes, deploys) ook in een anderszins autonome sessie.

**Dry-run-modus:**

Geef `--dry-run` door aan de initiële lusprompte of stel `dry_run: true` in op afzonderlijke taken. In dry-run-modus voert de lus alle lees- en analysestappen uit maar slaat schrijfbewerkingen, API-mutaties en bijwerkingen over. Dry-run is de juiste eerste poging voor elk nieuw taaktype.

**Foutbudget automatisch afbreken:**

```python
if state["error_count"] >= ERROR_BUDGET:
    state["status"] = "terminated_error_budget"
    write_state(state)
    print(f"[LOOP ABORTED] Error budget of {ERROR_BUDGET} exceeded. "
          f"Last failed task: {state['last_task_id']}. Review .claude/loop-state.json.")
    break
```

Het standaardfoutbudget is 5 opeenvolgende of cumulatieve fouten. Hoger voor ruwige taken, lager voor high-stakes-bewerkingen.

---

### Lusprompte

De prompt die een autonome lus start of hervat:

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

## Voorbeeld

**CI/CD use-case: auto-review en auto-merge van 50 PRs**

**Setup:**

```bash
# Generate task queue from open PRs
gh pr list --repo my-org/api-service --state open --limit 50 --json number \
  | jq -r '.[] | {"id": ("t_" + (.number|tostring)), "type": "review_pr", "payload": {"pr_number": .number, "repo": "api-service"}, "status": "pending"}' \
  > .claude/tasks.jsonl

# Add auto-merge tasks for PRs that pass review (depends_on will be set by the loop)
# The review task itself appends an auto_merge task if review passes
```

**Taakhandlerlogica (in lusprompte):**

- `review_pr`: PR-diff ophalen met `gh pr diff {pr_number}`, code-review-vaardigheid uitvoeren, review-opmerking plaatsen, resultaat aan status toevoegen
- `auto_merge`: als review is geslaagd en CI groen (`gh pr checks {pr_number}`), samenvoegen met `gh pr merge {pr_number} --squash`; als CI in behandeling, markeren als `skipped` en opnieuw in wachtrij plaatsen

**Parallelle verwerking:**

Voor onafhankelijke taken (alle review-taken, geen merge-afhankelijkheden) subagenties spawnen:

```
For tasks t_001 through t_025: spawn a subagent for each review_pr task.
Each subagent writes its result back to tasks.jsonl atomically (use file locking).
Wait for all subagents to complete before processing auto_merge tasks.
```

**Lusuitvoering (50 PRs):**

```
[14:00:00] Loop started. 50 tasks pending.
[14:00:05] Spawned 25 review subagents (t_001–t_025)
[14:12:30] Reviews complete: 22 passed, 3 failed (changes requested)
[14:12:30] Processing auto_merge tasks for 22 approved PRs
[14:14:15] 19 merged (CI green). 3 skipped (CI pending — re-queued for next run).
[14:14:15] Queue empty. Loop completed. 41 done, 3 skipped, 3 failed (changes requested).
[14:14:15] Status: completed. Written to .claude/loop-state.json.
```

Totale tijd: ~14 minuten voor 50 PRs. Gelijkwaardige handmatige tijd: 3–4 uur.

---
