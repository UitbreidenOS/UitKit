# Mode automatique et opération autonome

Le mode automatique permet à Claude d'opérer avec des interruptions minimales — il approuve automatiquement les opérations sûres et non destructrices et fait une pause uniquement pour les interventions humaines sur les actions qui sont irréversibles ou comportent un risque réel. Utilisez-le pour les tâches de longue durée où les invites d'approbation constantes cassent votre flux.

---

## Comment activer

**Commande slash (bascule pour la session actuelle) :**
```
/auto
```

**Fichier de paramètres :**
```json
{
  "autoMode": true
}
```

**Drapeau CLI :**
```bash
claude --auto "Refactoriser tous les gestionnaires API pour utiliser le nouveau middleware d'erreur"
```

**Combiné avec effort pour le travail autonome du jour au lendemain :**
```bash
claude --auto --effort xhigh "Implémenter la spécification complète des fonctionnalités dans tasks.jsonl"
```

---

## Ce qui change en mode automatique

Dans une session standard, Claude demande une confirmation avant la plupart des appels d'outils. En mode automatique, la confirmation est échelonnée :

### Niveaux d'autorisation

**Toujours approuver automatiquement (pas d'invite)**
- `Read` — lire n'importe quel fichier
- `Grep` / `Glob` — rechercher la base de code
- `Bash` (lecture seule) — `ls`, `cat`, `find`, `git log`, `git diff`, `git status`, `npm list`, exécuter les commandes de test qui ne mutent pas l'état
- `WebFetch` (demandes GET)

**Demander une fois par session (invite la première fois, mémoriser la réponse)**
- `git add`, `git commit`, `git checkout`
- `npm install`, `npm ci`
- Écrire de nouveaux fichiers
- Créer des répertoires

**Toujours demander (invite à chaque fois)**
- Suppression de fichier (`rm`, `unlink`)
- `git push --force`
- Les écritures de base de données (INSERT, UPDATE, DELETE via MCP ou CLI)
- Les appels d'API externe qui mutent l'état (POST, PUT, PATCH, DELETE)
- N'importe quelle commande `Bash` contenant `sudo`
- Les commandes qui modifient la configuration du système

---

## Mécanismes de sécurité

### Drapeau `--max-cost`
Arrêter la session si les dépenses dépassent un seuil en dollars :
```bash
claude --auto --max-cost 5.00 "Refactoriser l'ensemble du module d'authentification"
```
La session se termine proprement quand le coût atteint la limite. Claude écrit un résumé des progrès avant d'arrêter.

### Fichier sentinel `.claude/stop`
Créer ce fichier à tout moment pour terminer une session autonome :
```bash
touch .claude/stop
```
Claude vérifie ce fichier entre les tours. Quand il existe, la session se termine proprement. Supprimez le fichier avant de démarrer la session suivante.

### Hook de maintien de la vie
Pour les sessions s'exécutant la nuit ou sur les interruptions de réseau, configurez un maintien de la vie qui redémarre Claude s'il s'arrête inopinément :

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
# Redémarrer uniquement s'il y a des tâches restantes et pas de sentinel d'arrêt
if [ ! -f ".claude/stop" ] && [ -s ".claude/tasks.jsonl" ]; then
  claude --auto --effort high "Continuer à travailler par tasks.jsonl"
fi
```

### `maxTurns`
Plafond dur sur le nombre de tours par session :
```json
{
  "autoMode": true,
  "maxTurns": 100
}
```

---

## Mode automatique vs `--dangerously-skip-permissions`

Ce ne sont pas la même chose :

| | Mode automatique | `--dangerously-skip-permissions` |
|---|---|---|
| **Opérations destructrices** | Toujours des invites | Complètement contournées — aucune invite du tout |
| **Suppression de fichier** | Toujours demander | Approuvé automatiquement |
| **Forcer l'envoi** | Toujours demander | Approuvé automatiquement |
| **Utiliser pour** | Tâches longues avec un humain à proximité | Bacs à sable de confiance totale, environnements CI |
| **Niveau de risque** | Bas — la porte destructive reste | Haut — aucun filet de sécurité |

N'utilisez jamais `--dangerously-skip-permissions` dans le développement interactif. Il est conçu pour les pipelines CI en sandbox où Claude a été limité à un environnement jetable.

---

## Meilleures pratiques pour l'opération autonome

**Définir une file d'attente de tâches avant de démarrer.** Claude fonctionne mieux à travers les tâches définies que sur une invite ouverte. Utiliser `.claude/tasks.jsonl` :

```jsonl
{"id": "1", "task": "Add input validation to all POST endpoints in src/routes/", "status": "pending"}
{"id": "2", "task": "Write tests for each validation rule added in task 1", "status": "pending"}
{"id": "3", "task": "Update API docs to reflect new validation errors", "status": "pending"}
```

```bash
claude --auto "Work through tasks in .claude/tasks.jsonl. Mark each task done as you complete it."
```

**Définir les itérations max explicitement.** Les sessions autonomes ouvertes dérivent. Un `maxTurns` de 50–150 est approprié pour la plupart des tâches multi-heures.

**Tester avec `--dry-run` d'abord.** Exécutez la même invite avec `--dry-run` pour voir les appels d'outils planifiés avant d'autoriser l'exécution :
```bash
claude --auto --dry-run "Supprimer tous les commentaires TODO de la base de code"
```

**Limiter le répertoire de travail.** Le mode automatique respecte les limites du projet. Exécutez Claude à partir de la racine du projet ou d'un sous-répertoire pour limiter ce qu'il peut atteindre.

**Examiner la transcription de la session par la suite.** Les sessions en mode automatique produisent une transcription complète. Lisez-la — les décisions de Claude dans une longue session autonome valent la peine d'être vérifiées, en particulier les choix « demander une fois par session » qu'elle a fait.

---

## Exemple : refactorisation autonome du jour au lendemain

```bash
# Créer la file d'attente de tâches
cat > .claude/tasks.jsonl << 'EOF'
{"id": "1", "task": "Find all usages of the deprecated fetchUser() function across src/", "status": "pending"}
{"id": "2", "task": "Replace each fetchUser() call with the new getUser() API, preserving error handling", "status": "pending"}
{"id": "3", "task": "Run the test suite and fix any failures caused by the migration", "status": "pending"}
{"id": "4", "task": "Delete the deprecated fetchUser() function and its tests", "status": "pending"}
{"id": "5", "task": "Update CHANGELOG.md with a summary of the deprecation removal", "status": "pending"}
EOF

# Démarrer la session autonome avec plafond de coût
claude --auto --effort high --max-cost 8.00 \
  "Work through .claude/tasks.jsonl in order. Mark each task completed in the file when done. Stop if you encounter an ambiguity that requires a product decision."
```

---
