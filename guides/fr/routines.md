# Claude Code Routines

Les routines sont des sessions Claude Code planifiées et récurrentes — elles exécutent un prompt prédéfini selon un calendrier de type cron sans votre présence. Configurez-en une et Claude triera vos PR chaque matin, auditeras les dépendances chaque lundi, ou générera un briefing de standup avant votre 9h.

---

## Qu'est-ce que les Routines

Une routine est une session Claude Code qui :
- Démarre à une heure planifiée (non déclenchée par vous)
- Exécute un prompt spécifique que vous définissez
- Opère dans un répertoire de travail que vous spécifiez
- Utilise tous les outils et skills configurés pour ce projet
- Enregistre les résultats que vous pouvez examiner après coup

Les routines ne sont pas des démons. Chaque invocation est une session nouvelle — pas de mémoire de la précédente sauf si vous écrivez explicitement l'état dans un fichier et le lisez dans le prompt.

---

## Où configurer

**Interface web :** claude.ai/code → onglet Routines → Nouvelle Routine

**Fichier settings** (`settings.json` ou `~/.claude/settings.json`) :

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

## Champs de définition de routine

| Champ | Type | Requis | Description |
|---|---|---|---|
| `name` | string | oui | Identifiant unique, affiché dans les logs |
| `schedule` | string | oui | Expression cron ou langage naturel |
| `prompt` | string | oui | Le prompt complet que Claude reçoit au démarrage de la session |
| `workingDirectory` | string | oui | Chemin absolu ; répertoire de travail de Claude pour la session |
| `model` | string | non | Par défaut votre modèle configuré par défaut |
| `maxTurns` | integer | non | Arrêt forcé après N tours (empêche les sessions qui s'échappent) |
| `enabled` | boolean | non | `false` pour mettre en pause une routine sans la supprimer |

### Formats de plannification

```
# Expression cron
"schedule": "0 8 * * 1-5"        # 8h du lundi au vendredi
"schedule": "0 9 * * 1"          # 9h chaque lundi
"schedule": "0 23 * * *"         # 23h chaque nuit
"schedule": "0 */4 * * *"        # Toutes les 4 heures

# Langage naturel (converti en cron en interne)
"schedule": "every weekday at 8am"
"schedule": "every Monday at 9am"
"schedule": "daily at 11pm"
"schedule": "every 4 hours"
```

---

## Patterns de routines courants

### Tri quotidien des PR

```json
{
  "name": "pr-triage",
  "schedule": "0 8 * * 1-5",
  "prompt": "Check all open PRs using gh pr list. For each: note CI status, days open, and whether there are unresolved review comments. Output a markdown table to .claude/daily-triage.md. Flag anything blocked or stale.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Audit hebdomadaire des dépendances

```json
{
  "name": "dep-audit",
  "schedule": "0 9 * * 1",
  "prompt": "Run npm audit and npm outdated. Summarize critical vulnerabilities and packages more than 2 major versions behind. Write findings to .claude/dep-audit.md with a recommended action for each item.",
  "workingDirectory": "/home/user/projects/my-app",
  "model": "claude-haiku-4-5"
}
```

### Exécution des tests nocturnes et résumé

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

### Briefing de standup quotidien

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
| **Déclencheur** | Programmation (cron) | Événement dans une session active | Continu / intervalle dans la session actuelle |
| **Session** | Nouvelle session à chaque exécution | Se déclenche dans la session existante | Session actuelle |
| **Vous présent ?** | Non | Oui (ou fonctionnement sans surveillance) | Oui (ou fonctionnement sans surveillance) |
| **Utiliser pour** | Tâches récurrentes en arrière-plan | Automatisation réactive | Surveillance continue dans une session |

**Distinction clé :** Les routines et les hooks ne sont pas des alternatives — ils se composent. Une routine démarre une nouvelle session selon un calendrier, et tous les hooks configurés pour ce projet se déclenchent aux points d'événement normaux.

---

## Combiner les routines avec les hooks

Quand une routine s'exécute, le cycle de vie complet de la session Claude Code s'applique. Les hooks configurés dans `settings.json` se déclenchent à leurs points d'événement normaux :

```
Routine se déclenche à 8h
  → La nouvelle session Claude Code démarre
  → Claude lit le prompt et commence le travail
  → Le hook PostToolCall se déclenche après chaque utilisation d'outil (par ex., exécute le linter)
  → Le hook Stop se déclenche quand Claude termine (par ex., envoie une notification Slack)
```

Exemple : routine exécute les tests chaque nuit, le hook `Stop` envoie les résultats à Slack :

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

## Déboguer les routines échouées

1. **Vérifiez le log des Routines** — claude.ai/code → onglet Routines → cliquez sur la routine → consultez l'historique des exécutions. Chaque exécution affiche l'heure de début, l'heure de fin, le nombre de tours et le statut de sortie.

2. **Inspectez la sortie de la session** — la transcription complète est disponible dans la vue détaillée de l'exécution. Cherchez les erreurs d'outil, les refus de permission, ou Claude s'arrêtant prématurément.

3. **Testez le prompt manuellement** — copiez le prompt de routine et exécutez-le de façon interactive dans le même répertoire de travail. Cela isole si le problème vient de la logique du prompt ou de la programmation.

4. **Vérifiez `maxTurns`** — si une routine s'arrête à mi-tâche, elle a peut-être atteint la limite de tours. Augmentez `maxTurns` ou rendez le prompt plus ciblé.

5. **Vérifiez le répertoire de travail** — une routine qui ne peut pas trouver les fichiers a souvent un `workingDirectory` incorrect. Utilisez les chemins absolus.

---

## Gestion programmatique des routines

Claude Code expose maintenant trois outils pour gérer les routines depuis une session — pas besoin d'éditer settings.json manuellement :

**CronCreate** — créer une nouvelle routine depuis une session Claude Code :
```
CronCreate(
  prompt: "Check all open PRs and write summary to .claude/pr-triage.md",
  schedule: "0 8 * * 1-5",
  name: "daily-pr-triage"           // optional
)
```
Retourne l'ID de la routine créée. La routine est immédiatement active.

**CronList** — lister toutes les routines configurées pour le projet actuel :
```
CronList()
```
Retourne un tableau de routines avec id, name, schedule, heure de dernière exécution, heure de prochaine exécution, et statut enabled.

**CronDelete** — supprimer une routine par ID :
```
CronDelete(id: "routine-abc123")
```

**Quand cela importe :**
- Demander à Claude de configurer une routine en cours de session : « Create a routine that runs my test suite every night at 11pm »
- Claude peut créer des routines dans le cadre de workflows de configuration de projets
- Combinez avec le skill `skill/productivity/autofix-pr.md` : Claude configure lui-même la routine après l'installation du skill

**Exemple — Claude configure sa propre surveillance :**
```
Utilisateur : « Set up a routine to audit our npm dependencies every Monday morning »
Claude : [appelle CronCreate avec le prompt et la programmation « 0 9 * * 1 » appropriés]
Claude : « Done — routine 'dep-audit' will run every Monday at 9am. Use CronList to verify. »
```

**Crons de session vs routines persistantes :** CronCreate crée des routines persistantes qui survivent à la fin de la session. Pour la programmation dans la session (se déclencher une fois après un délai), utilisez ScheduleWakeup à la place.

---

## Inspecter les routines actives depuis les hooks

Le payload du hook Stop inclut maintenant un champ `session_crons` listant toutes les routines qui étaient actives pendant la session. Cela laisse votre hook Stop enregistrer quelles routines sont programmées, ou alerter si une routine critique a été supprimée.

Exemple de hook Stop qui enregistre les routines actives :
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
