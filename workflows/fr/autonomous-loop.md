# Boucle de tâche autonome

Session Claude Code longue durée qui traite une file d'attente de tâches sans intervention humaine — lit les tâches, exécute, vérifie, marque comme fait, et continue jusqu'à ce que la file soit vide ou qu'une condition de terminaison soit atteinte.

---

## Quand utiliser

- Traitement d'un grand carnet de commandes de tâches similaires (révision de code, migration, corrections lint, génération de tests)
- Exécutions d'automatisation de nuit ou de week-end quand aucun humain n'est disponible pour continuer les sessions
- Étapes de pipeline CI/CD qui nécessitent un jugement de l'agent, pas juste une exécution de script
- Opérations par lots où l'unité de travail est bien définie et la limite d'erreur est claire

Ne pas utiliser pour les tâches nécessitant un jugement humain sur chaque élément, les opérations destructives sans validation en mode essai, ou les flux de travail où une mauvaise décision se propage à toutes les tâches restantes.

---

## Phases / Étapes

### Le modèle de boucle

```
lire la tâche de la file
  → exécuter la tâche
    → vérifier la sortie
      → marquer comme fait / marquer comme échoué
        → lire la tâche suivante (ou terminer)
```

Chaque itération écrit l'état avant de continuer. Si la session meurt au milieu d'une tâche, la session suivante reprend depuis le dernier état validé plutôt que de ré-exécuter le travail terminé.

---

### Format de la file d'attente de tâches

Les tâches vivent dans `.claude/tasks.jsonl` — un objet JSON par ligne, ajouté dans l'ordre.

```jsonl
{"id": "t_001", "type": "review_pr", "payload": {"pr_number": 1042, "repo": "api-service"}, "status": "pending"}
{"id": "t_002", "type": "review_pr", "payload": {"pr_number": 1043, "repo": "api-service"}, "status": "pending"}
{"id": "t_003", "type": "auto_merge", "payload": {"pr_number": 1038, "repo": "api-service"}, "status": "pending", "requires_approval": true}
```

**Valeurs de statut :** `pending` → `in_progress` → `done` | `failed` | `skipped`

**Champs obligatoires :** `id` (unique), `type` (clé du gestionnaire de tâche), `payload` (données spécifiques à la tâche), `status`

**Champs optionnels :**
- `requires_approval: true` — barrière humaine dans la boucle avant exécution
- `dry_run: true` — exécute la logique mais ignore les écritures/mutations
- `depends_on: ["t_001"]` — ne s'exécute pas jusqu'à ce que les tâches listées soient `done`
- `max_retries: 3` — réessaye en cas d'échec avant de marquer `failed`

---

### Persistance d'état

Après que chaque tâche se termine (succès ou échec), écrivez l'état mis à jour dans `.claude/loop-state.json`:

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

Au démarrage de la session, l'agent de boucle lit ce fichier pour reprendre d'où il s'était arrêté. Si le fichier n'existe pas, c'est une nouvelle exécution.

---

### Mécanisme de maintien de la connexion

Les sessions Claude Code se terminent quand Claude arrête de répondre. Le hook Stop injecte un message de continuation pour redémarrer automatiquement la boucle.

**Entrée `.claude/settings.json` :**

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

**`.claude/loop-keepalive.sh` :**

```bash
#!/bin/bash
# Mantener vivo solo si la boucle está activa y no está terminada
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

Le hook se déclenche quand Claude s'arrête. Si la boucle est toujours dans l'état `running`, le message de continuation amène Claude Code à redémarrer automatiquement la boucle.

---

### Conditions de terminaison de boucle

La boucle se termine (définit `status: terminated` dans loop-state.json) quand l'un de ces éléments est vrai :

| Condition | Déclencheur | Action |
|-----------|---------|--------|
| File vide | Aucune tâche `pending` ne reste | Définir le statut `completed` |
| Max itérations | `iteration >= max_iterations` (par défaut 200) | Définir le statut `terminated_max_iter` |
| Seuil d'erreur | `error_count >= error_budget` (par défaut 5) | Définir le statut `terminated_error_budget` |
| Sentinel d'arrêt | Le fichier `.claude/stop` existe | Définir le statut `terminated_sentinel` |
| Arrêt manuel | `SIGINT` / `SIGTERM` | Écrire l'état, définir le statut `terminated_signal` |

Pour arrêter une boucle en cours : `touch .claude/stop` — la prochaine vérification de maintien de la connexion verra le sentinel et s'arrêtera.

---

### Garde-fous de sécurité

**Barrières humaines dans la boucle :**

Pour les tâches avec `requires_approval: true`, la boucle s'arrête et affiche :

```
[LOOP PAUSED — human approval required]
Task: t_003 (auto_merge pr #1038)
Payload: {"pr_number": 1038, "repo": "api-service"}
Type 'approve t_003' to continue or 'skip t_003' to skip this task.
```

La boucle attend une réponse humaine avant de continuer. C'est approprié pour les opérations destructives (fusions, suppressions, déploiements) même dans une session autonome.

**Mode essai :**

Passez `--dry-run` au message initial de boucle, ou définissez `dry_run: true` sur les tâches individuelles. En mode essai, la boucle exécute toutes les étapes de lecture et d'analyse mais ignore les écritures, les mutations API et les effets secondaires. L'essai est le premier passage correct pour tout nouveau type de tâche.

**Auto-abandon du budget d'erreur :**

```python
if state["error_count"] >= ERROR_BUDGET:
    state["status"] = "terminated_error_budget"
    write_state(state)
    print(f"[LOOP ABORTED] Error budget of {ERROR_BUDGET} exceeded. "
          f"Last failed task: {state['last_task_id']}. Review .claude/loop-state.json.")
    break
```

Le budget d'erreur par défaut est de 5 défaillances consécutives ou cumulatives. Augmentez pour les tâches bruyantes, diminuez pour les opérations à enjeux élevés.

---

### Invite de boucle

L'invite qui démarre ou reprend une boucle autonome :

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

## Exemple

**Cas d'utilisation CI/CD : auto-réviser et auto-fusionner 50 PR**

**Configuration :**

```bash
# Générer la file d'attente de tâches à partir des PR ouvertes
gh pr list --repo my-org/api-service --state open --limit 50 --json number \
  | jq -r '.[] | {"id": ("t_" + (.number|tostring)), "type": "review_pr", "payload": {"pr_number": .number, "repo": "api-service"}, "status": "pending"}' \
  > .claude/tasks.jsonl

# Ajouter les tâches de fusion automatique pour les PR qui passent la révision (depends_on sera défini par la boucle)
# La tâche de révision elle-même ajoute une tâche de fusion automatique si la révision réussit
```

**Logique du gestionnaire de tâche (dans l'invite de boucle) :**

- `review_pr`: récupérer la différence PR avec `gh pr diff {pr_number}`, exécuter la compétence de révision de code, publier un commentaire de révision, ajouter le résultat à l'état
- `auto_merge`: si la révision a réussi et que CI est vert (`gh pr checks {pr_number}`), fusionner avec `gh pr merge {pr_number} --squash`; si CI en attente, marquer `skipped` et re-mettre en file

**Traitement parallèle :**

Pour les tâches indépendantes (toutes les tâches de révision, pas de dépendances de fusion), spawner les sous-agents :

```
For tasks t_001 through t_025: spawn a subagent for each review_pr task.
Each subagent writes its result back to tasks.jsonl atomically (use file locking).
Wait for all subagents to complete before processing auto_merge tasks.
```

**Exécution de la boucle (50 PR) :**

```
[14:00:00] Loop started. 50 tasks pending.
[14:00:05] Spawned 25 review subagents (t_001–t_025)
[14:12:30] Reviews complete: 22 passed, 3 failed (changes requested)
[14:12:30] Processing auto_merge tasks for 22 approved PRs
[14:14:15] 19 merged (CI green). 3 skipped (CI pending — re-queued for next run).
[14:14:15] Queue empty. Loop completed. 41 done, 3 skipped, 3 failed (changes requested).
[14:14:15] Status: completed. Written to .claude/loop-state.json.
```

Temps total : ~14 minutes pour 50 PR. Temps manuel équivalent : 3–4 heures.

---
