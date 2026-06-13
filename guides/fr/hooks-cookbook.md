# Cookbook Hooks

Modèles de hooks réels et prêts à l'emploi pour automatiser la qualité, la sécurité et l'observabilité dans Claude Code.

---

## Fondamentaux des hooks

Les hooks sont des scripts shell ou des commandes que Claude Code exécute automatiquement en réponse aux événements. Ils s'exécutent en dehors du contexte de Claude — ce sont des processus shell réels, pas des instructions Claude.

**Événements de hooks :**
| Événement | Quand il se déclenche |
|---|---|
| `SessionStart` | Quand une session Claude Code commence |
| `PreToolUse` | Avant l'exécution de n'importe quel appel d'outil |
| `PostToolUse` | Après la fin de n'importe quel appel d'outil |
| `PreCompact` | Avant le déclenchement de la compaction du contexte |
| `PostCompact` | Après l'achèvement de la compaction du contexte |
| `Stop` | Quand Claude termine sa réponse |
| `Notification` | Quand Claude envoie une notification de bureau |

**Emplacement de la configuration des hooks :** `.claude/settings.json` (projet) ou `~/.claude/settings.json` (niveau utilisateur)

**Structure de hook basique :**
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

**Matcher :** Filtre les appels d'outil qui déclenchent le hook. Chaîne vide `""` correspond à tous. `"Bash"` ne correspond qu'aux appels d'outil Bash. `"Write|Edit"` correspond à Write ou Edit.

---

## Recette 1 — Auto-format Prettier sur écriture de fichier

Formate automatiquement les fichiers après que Claude les écrive ou les édite. Plus besoin de demandes « veuillez exécuter prettier ».

**settings.json :**
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

**Notes :**
- `async: true` exécute le formatage en arrière-plan — Claude n'attend pas
- Ne s'exécute que sur les appels d'outil Write et Edit
- `${tool_input.file_path}` est le chemin du fichier qui a été écrit

---

## Recette 2 — Bloquer les commandes shell dangereuses

Empêchez Claude d'exécuter des commandes destructrices même s'il décide d'essayer.

**.claude/hooks/block-dangerous.sh :**
```bash
#!/usr/bin/env bash
# Lit l'entrée de l'outil depuis stdin en tant que JSON
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))")

# Modèles à bloquer
BLOCKED_PATTERNS=("rm -rf" "sudo " "| bash" "| sh" "curl.*| " "wget.*| " "git push --force" "git reset --hard" "DROP TABLE" "truncate ")

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qi "$pattern"; then
    echo "BLOCKED: command matches dangerous pattern '$pattern'" >&2
    exit 2  # Code de sortie 2 = bloquer l'appel d'outil
  fi
done

exit 0  # Autoriser
```

**settings.json :**
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

**Codes de sortie :** `0` = autoriser, `1` = avertir (Claude voit la sortie mais continue), `2` = bloquer (l'appel d'outil est annulé).

---

## Recette 3 — Journal d'audit de chaque appel d'outil

Enregistrez chaque appel d'outil avec horodatage, nom d'outil et résumé d'entrée. Essentiel pour le débogage et l'audit de sécurité.

**.claude/hooks/audit-log.sh :**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_name','unknown'))" 2>/dev/null)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LOG_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/audit.log"

mkdir -p "$(dirname "$LOG_FILE")"
echo "${TIMESTAMP} | ${TOOL_NAME} | $(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); inp=d.get('tool_input',{}); print(str(inp)[:200])" 2>/dev/null)" >> "$LOG_FILE"
```

**settings.json :**
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

Ajoutez `.claude/logs/` à `.gitignore`.

---

## Recette 4 — Sauvegarde de session avant compaction

Avant le déclenchement de la compaction, sauvegardez l'état actuel de la session pour que le contexte survive.

**.claude/hooks/pre-compact-save.sh :**
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

**settings.json :**
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

Associez-le à une instruction CLAUDE.md : « Quand PreCompact se déclenche, résumez : tâche actuelle, fichiers modifiés, décisions ouvertes, étapes suivantes — ajouter à `.claude/memory/session-state.md`. »

---

## Recette 5 — Suivi des coûts

Estimez les coûts de tokens par session et enregistrez-les.

**.claude/hooks/cost-tracker.sh :**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COST_FILE="${CLAUDE_PROJECT_DIR}/.claude/logs/costs.log"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$(dirname "$COST_FILE")"

# Extraire les données d'utilisation si disponibles
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

**settings.json :**
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

## Recette 6 — Vérification de type TypeScript à la modification

Exécutez `tsc --noEmit` après que Claude modifie les fichiers TypeScript. Détectez les erreurs de type avant qu'elles s'accumulent.

**settings.json :**
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

Réglez `async: false` pour que Claude voie les erreurs de type et puisse les corriger immédiatement.

---

## Recette 7 — Rappel de push Git

Rappelez à Claude de confirmer avant toute opération git push.

**.claude/hooks/git-push-confirm.sh :**
```bash
#!/usr/bin/env bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('command',''))" 2>/dev/null)

if echo "$COMMAND" | grep -q "git push"; then
  echo "⚠️  About to push to remote. Confirm this is intentional." >&2
  exit 1  # Avertir — Claude voit cela et devrait demander à l'utilisateur avant de continuer
fi

exit 0
```

**settings.json :**
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

## Recette 8 — Chargeur de contexte au démarrage de session

Au démarrage de la session, rappelez automatiquement à Claude de lire les fichiers de contexte clés.

**.claude/hooks/session-start.sh :**
```bash
#!/usr/bin/env bash
# Le texte de sortie est ajouté au contexte de Claude au démarrage de la session
MEMORY_FILE="${CLAUDE_PROJECT_DIR}/.claude/memory/session-state.md"

if [ -f "$MEMORY_FILE" ]; then
  echo "Previous session state found at .claude/memory/session-state.md — read it before starting work."
fi

if [ -f "${CLAUDE_PROJECT_DIR}/CONTEXT.md" ]; then
  echo "Domain glossary available at CONTEXT.md — read it for project terminology."
fi
```

**settings.json :**
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

## Combinaison de hooks

Les hooks se composent — vous pouvez avoir plusieurs hooks sur le même événement, chacun avec des matchers différents.

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

Cela exécute : prettier (async) + vérification TypeScript (sync, Claude attend) + journal d'audit (async) à chaque écriture de fichier.

---

## Dépannage des hooks

**Hook ne se déclenche pas :**
- Vérifiez que le nom de l'événement est exact : `PreToolUse`, `PostToolUse`, `SessionStart`, `PreCompact`
- Vérifiez que le script est exécutable : `chmod +x .claude/hooks/your-script.sh`
- Vérifiez que le chemin utilise correctement `${CLAUDE_PROJECT_DIR}`

**Hook bloquant tout :**
- Si votre hook quitte avec `2` à chaque appel, tous les appels d'outil sont bloqués
- Ajoutez des journaux au hook pour voir l'entrée qu'il reçoit
- Testez le hook manuellement : `echo '{"tool_name":"Bash","tool_input":{"command":"ls"}}' | bash .claude/hooks/your-script.sh`

**Hook s'exécutant mais la sortie n'est pas visible :**
- La sortie standard des hooks async est ignorée. Utilisez l'erreur standard (`>&2`) pour les messages que vous voulez voir.
- Pour les hooks sync, la sortie standard est montrée à Claude ; l'erreur standard est montrée à l'utilisateur.

---

## Capacités avancées de hooks

### continueOnBlock

Par défaut, quand un hook PostToolUse quitte avec le code `2` pour bloquer un appel d'outil, le tour de Claude se termine. Avec `continueOnBlock: true`, la raison du blocage est renvoyée à Claude sous forme de message et le tour continue — Claude peut lire la raison et essayer une approche différente sans nécessiter une intervention de l'utilisateur.

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

Cas d'utilisation principal : les hooks de lint et de format qui bloquent les violations et permettent à Claude de corriger automatiquement le fichier et de réessayer, plutôt que de s'arrêter et d'attendre une invite humaine.

---

### Sortie terminalSequence

Les hooks peuvent émettre des séquences d'échappement OSC dans leur sortie JSON pour déclencher des notifications de bureau, définir le titre de la fenêtre ou sonner la cloche du terminal — sans nécessiter un terminal de contrôle.

```python
import json, sys

result = {
    "terminalSequence": "\033]0;Claude — Task Complete\007",  # définit le titre de la fenêtre
}
print(json.dumps(result))
```

Utile pour surfer l'état d'achèvement ou les erreurs dans la barre de titre de la fenêtre lors de l'exécution de tâches de fond longues.

---

### Forme exec (tableau args)

Au lieu d'une commande shell `command`, passez un tableau `args` pour générer le processus hook directement sans invoquer un shell. Cela élimine les problèmes de citation et d'échappement quand les valeurs interpolées comme `${tool_name}` ou `${tool_input}` contiennent des espaces, des guillemets ou des caractères spéciaux.

```json
{
  "type": "command",
  "command": {
    "args": ["/usr/local/bin/my-hook", "--tool", "${tool_name}", "--input", "${tool_input}"]
  }
}
```

Utilisez la forme args pour tout hook qui reçoit des données structurées à partir des entrées d'outil. Utilisez la forme string uniquement quand vous avez vraiment besoin de fonctionnalités shell (pipes, conditionnels, globs).

---

### type: "mcp_tool"

Les hooks peuvent appeler un outil sur un serveur MCP déjà connecté directement, sans générer un sous-processus. C'est une surcharge inférieure à un script shell et garde le hook dans le contexte d'authentification de la connexion MCP.

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

Le serveur MCP nommé dans `server` doit déjà être connecté dans la session. Le champ `tool` est le nom exact de l'outil exposé par ce serveur. Utilisez ce modèle pour l'enregistrement d'audit, les notifications ou la synchronisation d'état via MCP sans ajouter une couche de sous-processus.

---

### PreCompact — blocage de compaction

Les hooks PreCompact peuvent activement bloquer la compaction en quittant avec le code `2` ou en retournant `{"decision": "block"}` dans la sortie standard. Utilisez cela pour exécuter une opération de sauvegarde ou de sauvegarde et permettre à la compaction de ne procéder que quand l'état est en sécurité persisted.

**.claude/hooks/pre-compact-backup.sh :**
```bash
#!/bin/bash
# Sauvegardez la transcription d'abord, puis autorisez la compaction
cp .claude/session.jsonl .claude/backups/session-$(date +%s).jsonl
# Quittez 0 pour autoriser la compaction, quittez 2 pour la bloquer
exit 0
```

Si la sauvegarde échoue et que vous voulez empêcher la compaction, quittez `2`. Claude surfacera la raison du blocage et la session continue sans compacter.

---

### Hooks scoped à l'agent

Les hooks peuvent être scoped à un agent spécifique en ajoutant un champ `hooks:` au frontmatter de l'agent. Ces hooks ne se déclenchent que quand cet agent est l'agent actif — ils n'affectent pas la session racine ou d'autres agents.

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

Utilisez les hooks scoped à l'agent pour l'observabilité spécifique à l'agent (enregistrement quand un agent se termine), le nettoyage des ressources (suppression de fichiers temporaires que l'agent a créés) ou le suivi des coûts scoped à l'activité d'un seul agent.

---

### effort.level dans l'environnement du hook

Le niveau d'effort actif est disponible en tant que variable d'environnement `$CLAUDE_EFFORT` dans les scripts hook. Valeurs : `low`, `normal`, `high`, `xhigh`.

```bash
#!/bin/bash
if [ "$CLAUDE_EFFORT" = "xhigh" ]; then
  echo "Running extended validation..."
  run-full-test-suite
fi
```

Utilisez ceci pour exécuter conditionnellement une validation coûteuse uniquement quand Claude fonctionne en mode effort étendu, ou pour ignorer les vérifications optionnelles à faible effort afin de réduire la latence.

---

### Hooks conditionnels `if:`

Exécutez un hook uniquement quand une condition est vraie. Le champ `if:` prend une expression shell qui est évaluée avant que le hook s'exécute. S'il quitte non-zéro, le hook est complètement ignoré.

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

L'expression `if:` a accès aux mêmes variables d'environnement que le hook lui-même — `$TOOL_INPUT`, `$TOOL_NAME`, `$CLAUDE_PROJECT_DIR`, `$CLAUDE_EFFORT`, etc.

**Modèles `if:` courants :**

Exécutez uniquement sur les fichiers TypeScript :
```bash
"if": "echo \"$TOOL_INPUT\" | grep -q '\\.tsx\\?$'"
```

Exécutez uniquement quand vous êtes sur la branche principale :
```bash
"if": "[ \"$(git branch --show-current)\" = \"main\" ]"
```

Exécutez uniquement quand un fichier de configuration spécifique existe :
```bash
"if": "[ -f .env.production ]"
```

Exécutez uniquement au effort xhigh :
```bash
"if": "[ \"$CLAUDE_EFFORT\" = \"xhigh\" ]"
```

Les hooks conditionnels se composent proprement avec le système de matcher existant — le matcher filtre par nom d'outil, `if:` filtre par conditions d'exécution. Utilisez les deux ensemble pour créer des déclencheurs de hook précis et à faible surcharge.

---

### `background_tasks` et `session_crons` dans les hooks Stop/SubagentStop

Les payloads des hooks `Stop` et `SubagentStop` incluent maintenant deux champs supplémentaires qui rapportent ce qui fonctionne toujours quand la session se termine :

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

**`background_tasks`** — tâches démarrées via `claude --bg` ou générées par l'agent pendant la session qui fonctionnent toujours au moment de l'arrêt.

**`session_crons`** — tâches récurrentes enregistrées avec `/loop` ou l'API Cron qui sont programmées et toujours actives.

**Cas d'utilisation :**

Attendez les tâches de fond avant l'archivage :
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

Alertez quand un cron sera orphelin par la fin de session :
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

Enregistrez ce script comme un hook `Stop` avec `matcher: ""` pour l'exécuter à chaque fin de session.

---

## Remplacement de sortie PostToolUse

Les hooks PostToolUse peuvent remplacer ce que Claude voit à partir de la sortie de N'IMPORTE QUEL outil — pas seulement les outils MCP. C'est l'une des fonctionnalités de hook les plus impactantes pour gérer le budget de contexte, puisque les résultats d'outils consomment environ 60 % des tokens de contexte dans les sessions d'agents typiques.

**Comment cela fonctionne :**
Le hook reçoit la sortie d'outil dans stdin. Il peut retourner une version modifiée via `hookSpecificOutput.updatedToolOutput`. Claude voit la sortie remplacée au lieu de l'original. L'outil a déjà exécuté — fichiers écrits, commandes exécutées, requêtes réseau envoyées — donc cela ne change que ce qui entre dans le contexte de Claude, pas ce qui s'est passé.

**Configuration :**
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

**Exemple de script — compressez la sortie bash verbeux :**
```python
#!/usr/bin/env python3
"""Compress Bash tool output that exceeds a threshold."""
import json, sys

THRESHOLD = 10_000  # characters

data = json.load(sys.stdin)
output = data.get("tool_output", "")

if len(output) > THRESHOLD:
    # Conservez les premiers 2000 et les derniers 2000 caractères, résumez le milieu
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
    # Sortie inchangée — ne rien imprimer (pas de remplacement)
    pass
```

**Cas d'utilisation :**
- **Rédaction de secrets :** analysez la sortie pour les clés API/tokens et remplacez par `[REDACTED]` avant que Claude ne la voit
- **Normaliser les diffs :** supprimez le bruit de la sortie git diff (horodatages, lignes d'index)
- **Compressez la sortie verbeux :** tronquez les journaux npm install, les grands résultats de requête, la sortie de construction
- **Récupération du budget de contexte :** les résultats d'outils consomment environ 60 % des tokens ; remplacer 50K caractères par 500 caractères récupère un énorme contexte

**Important :** la sortie d'origine est capturée dans la télémétrie/analytique avant que le hook s'exécute. Le remplacement n'affecte que ce que Claude voit dans sa fenêtre de contexte.

**Disponible depuis :** v2.1.121+

---

## Événements de hooks d'équipes d'agents

Trois événements de hooks spécifiquement pour les équipes d'agents. Ceux-ci se déclenchent pendant la coordination d'équipe et vous permettent d'appliquer des portes de qualité sur la gestion des tâches.

### TeammateIdle

Se déclenche quand un coéquipier est sur le point de devenir inactif (cesser de travailler). Utilisez pour garder les coéquipiers productifs.

- **Quittez 0 :** autorisez le coéquipier à devenir inactif
- **Quittez 2 :** envoyez un retour d'information au coéquipier et gardez-le actif

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
# check-remaining-tasks.sh — gardez le coéquipier actif s'il reste des tâches
PENDING=$(cat ~/.claude/tasks/*/tasks.json 2>/dev/null | python3 -c "
import json,sys
tasks = json.load(sys.stdin)
pending = [t for t in tasks if t.get('status') == 'pending']
print(len(pending))
" 2>/dev/null || echo "0")

if [ "$PENDING" -gt 0 ]; then
  echo "There are $PENDING pending tasks. Pick up the next one."
  exit 2  # continuez à travailler
fi
exit 0  # autorisez l'inactivité
```

### TaskCreated

Se déclenche quand une tâche est en cours d'ajout à la liste de tâches partagée. Utilisez pour appliquer les normes de qualité des tâches.

- **Quittez 0 :** autorisez la création de tâche
- **Quittez 2 :** empêchez la création et envoyez un retour d'information

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

Cas d'utilisation : rejetez les tâches qui sont trop vagues (pas de critères d'acceptation), trop grandes (doivent être divisées) ou dupliquées de tâches existantes.

### TaskCompleted

Se déclenche quand une tâche est marquée comme complète. Utilisez comme porte de qualité.

- **Quittez 0 :** autorisez l'achèvement
- **Quittez 2 :** empêchez l'achèvement et envoyez un retour d'information (le coéquipier doit traiter le problème)

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
# verify-tests-pass.sh — bloquez l'achèvement de la tâche si les tests échouent
if ! npm test --silent 2>/dev/null; then
  echo "Tests are failing. Fix test failures before marking this task complete."
  exit 2  # bloquez l'achèvement
fi
exit 0  # autorisez l'achèvement
```

**Remarque :** ces hooks ne se déclenchent que quand les équipes d'agents sont activées (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). Ils n'ont aucun effet en mode session unique régulier.

---

## Travaillez avec nous
