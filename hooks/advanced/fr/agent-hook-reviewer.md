# Hook: Agent Reviewer — Spawn a Code-Review Subagent on Session Stop

Démontre le hook de type `"type": "agent"`, qui crée un sous-agent complet lorsqu'un événement se produit. Le sous-agent s'exécute de manière asynchrone avec son propre accès aux outils, lit les modifications de la session et produit un examen structuré — sans bloquer la session principale ou nécessiter une invocation manuelle.

## What it does

Lorsque la session principale Claude Code se termine (événement `Stop`), le harness crée un sous-agent configuré par le bloc `agent` du hook. Le sous-agent :

1. Reçoit le `stop_reason`, le `session_id` et le `project_dir` de la session dans son contexte système.
2. Lit le diff git des modifications effectuées pendant la session (`git diff HEAD~1` ou `git diff --staged`).
3. Évalue le diff pour les bugs de correction, les problèmes de sécurité et les violations de style.
4. Écrit un examen structuré dans `.claude/reviews/<session_id>-review.md`.
5. S'il détecte des problèmes bloquants (sévérité `error`), il ajoute également un résumé à `.claude/reviews/open-issues.log` pour que le développeur les traite lors de la prochaine session.

Le sous-agent généré a un ensemble d'outils limité — uniquement `Bash` (commandes git en lecture seule), `Read`, et `Write` dans le répertoire `.claude/reviews/`. Il n'a pas la permission de modifier les fichiers du projet, de faire des commits ou d'appeler des API externes.

Exemple de sortie d'examen à `.claude/reviews/abc123-review.md` :

```markdown
# Code Review — Session abc123 (2026-06-03T11:00:00Z)

## Summary
3 files changed, 120 insertions, 14 deletions

## Findings

### ERROR — src/auth/token.py:47
Hardcoded fallback secret `"dev-secret-do-not-use"` reachable in production if
`SECRET_KEY` env var is unset. Must be replaced with a hard failure.

### WARNING — src/api/users.py:112
N+1 query in `list_users()` — `get_user_permissions()` called inside loop.
Consider a bulk fetch before the loop.

### INFO — tests/test_auth.py
Good: new token expiry tests cover both the happy path and the expired-token branch.
```

## When it fires

`Stop` — se déclenche lorsque la session principale se termine, soit parce que l'utilisateur a tapé `/exit`, la tâche s'est terminée, ou la session a expiré. Le sous-agent s'exécute après que la session ait déjà été arrêtée ; il ne retarde pas la capacité de l'utilisateur à fermer le terminal.

Autres appariements utiles pour le type de hook `agent` :

| Event | Subagent purpose |
|---|---|
| `Stop` | Examen du code post-session, résumé des coûts, entrée changelog |
| `SubagentStop` | Valider la sortie du sous-agent avant qu'elle ne soit présentée à l'agent principal |
| `PostToolUse` (Write) | Déclencher un agent de mise à jour de documentation lorsque les fichiers source changent |

## settings.json entry

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "agent",
            "agent": {
              "prompt": "You are a code reviewer. A Claude Code session has just ended. Your job is to review the changes made during this session and write a structured report.\n\nSteps:\n1. Run `git diff HEAD~1 --stat` to see which files changed.\n2. Run `git diff HEAD~1` to read the full diff.\n3. Analyse the diff for: correctness bugs, security issues (hardcoded secrets, injection vectors, missing auth checks), performance problems (N+1 queries, unbounded loops), and missing test coverage.\n4. Write your findings to `.claude/reviews/${CLAUDE_SESSION_ID}-review.md` using this format:\n   - A Summary section (files changed, lines added/removed)\n   - A Findings section with severity labels: ERROR / WARNING / INFO\n   - Each finding: severity, file:line, one-sentence description, one-sentence recommendation\n5. If any ERROR-severity findings exist, append a one-line summary to `.claude/reviews/open-issues.log`.\n6. If there are no changes (clean working tree), write a one-line note and exit.\n\nBe concise. Findings should be actionable. Do not restate the diff — diagnose and recommend.",
              "model": "claude-sonnet-4-5",
              "tools": ["Bash", "Read", "Write"],
              "tool_permissions": {
                "Bash": {
                  "allow": ["git diff*", "git log*", "git show*", "git status*"],
                  "deny": ["git commit*", "git push*", "git reset*", "rm *", "curl *"]
                },
                "Write": {
                  "allow": [".claude/reviews/*"]
                }
              },
              "max_turns": 10,
              "timeout": 120
            }
          }
        ]
      }
    ]
  }
}
```

## The spawned agent's tools and output

**Outils disponibles pour le sous-agent :**

| Tool | Scope |
|---|---|
| `Bash` | Commandes git en lecture seule uniquement (`git diff`, `git log`, `git show`, `git status`). Les commandes d'écriture sont bloquées par la liste de refus `tool_permissions`. |
| `Read` | Sans restriction — peut lire n'importe quel fichier du projet pour comprendre le contexte autour d'un hunk diff. |
| `Write` | Limité à `.claude/reviews/` — ne peut pas modifier les fichiers du projet. |

**Artefacts de sortie :**

- `.claude/reviews/<session_id>-review.md` — l'examen structuré complet pour cette session.
- `.claude/reviews/open-issues.log` — journal d'ajout unique des conclusions de sévérité ERROR dans les sessions. Vérifiez ce fichier au début d'une nouvelle session pour récupérer les problèmes non résolus.

**Cycle de vie du sous-agent :**

Le sous-agent est généré de manière asynchrone après `Stop`. Il s'exécute dans un processus séparé ; le terminal est libre immédiatement. Le harness écrit le statut de sortie du sous-agent dans `.claude/reviews/<session_id>-agent.log`. Si le sous-agent dépasse `timeout` (120 secondes), le harness le tue et écrit un examen partiel avec un avis d'expiration.

## Notes

- Définissez `"model": "claude-sonnet-4-5"` pour l'examinateur. Haiku produit des conclusions superficielles sur les diffs complexes ; Opus est inutile pour la correspondance de schémas structurés. Sonnet atteint le bon équilibre qualité/coût.
- `max_turns: 10` est suffisant pour la plupart des diffs. Si vos sessions modifient régulièrement plus de 20 fichiers, augmentez à 20 et augmentez `timeout` proportionnellement.
- Ajoutez `.claude/reviews/` à `.gitignore` à moins que vous ne vouliez que les examens soient validés avec le code. Les examens contiennent des métadonnées de session qui ne sont pas utiles dans l'historique des versions.
- Les listes `tool_permissions` allow/deny utilisent des modèles de glob. Resserrez ou assouplissez selon les besoins — par exemple, ajoutez `"git stash*"` à la liste allow si votre workflow utilise des stashes.
- Pour afficher les examens automatiquement dans la session suivante, ajoutez un hook de cycle de vie `Start` qui lit `open-issues.log` et ajoute les conclusions non résolues au contexte initial de Claude.

---


📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
