# Hook : Suivi d'utilisation

Enregistre chaque invocation d'outil Claude Code dans `.claude/usage-log.jsonl` pour la collecte de métriques d'expérience utilisateur, le suivi d'adoption et la mesure de l'efficacité des compétences.

## Événement

`PostToolUse` — s'active immédiatement après tout appel d'outil (Bash, Read, Write, WebSearch, appels API, etc.)

## entrée settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh",
            "async": true
          }
        ]
      }
    ]
  },
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
}
```

## Ce qu'il fait

Ajoute une ligne JSON à `.claude/usage-log.jsonl` pour chaque appel d'outil, en capturant :

- **Horodatage** (ISO 8601 UTC)
- **Session ID** et utilisateur
- **Nom de la compétence** (analysé à partir du contexte, le cas échéant)
- **Outil appelé** (Bash, Read, Write, WebSearch, etc.)
- **Durée** (millisecondes)
- **Succès** (code de sortie 0 = vrai)
- **Métadonnées spécifiques à l'outil** (commande, chemin du fichier, requête, etc.)

Enregistrement d'exemple :

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_abc123",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "tool_input_summary": "git diff --name-only",
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "invocation_num": 3,
  "retry_count": 0,
  "metadata": {
    "project_dir": "/Users/alice/myapp",
    "git_branch": "feature/auth",
    "model": "haiku-4.5"
  }
}
```

## Fonctionnalités

- **Léger** : La journalisation asynchrone ne bloque pas l'exécution de Claude Code
- **Respectueux de la vie privée** : Enregistre les résumés de commandes, pas l'intégralité des entrées sensibles
- **Suivi d'adoption** : Lie les appels d'outil aux compétences pour l'analyse /dx-metrics
- **Surcharge minimale** : ~10ms par entrée de journal, écritures par lots
- **Rotation automatique** : Déplace les anciens journaux vers `.jsonl.1`, `.jsonl.2` lorsque > 50MB
- **Politique de rétention** : Supprime automatiquement les journaux datant de plus de 90 jours
- **Suivi de session** : Tous les appels dans une session partagent un session_id pour la corrélation
- **Détection de nouvelle tentative** : Compte les appels répétés au même outil dans 30 secondes

## Installation

```bash
# Copier le script de hook au projet
cp hooks/usage-tracker.sh .claude/hooks/
chmod +x .claude/hooks/usage-tracker.sh

# Créer le répertoire de journalisation
mkdir -p .claude
touch .claude/usage-log.jsonl

# Ajouter à .gitignore (les journaux d'utilisation contiennent des métadonnées, pas des secrets)
echo ".claude/usage-log.jsonl*" >> .gitignore
echo ".claude/dx-scorecard*.json" >> .gitignore
echo ".claude/session-log*.md" >> .gitignore

# Vérifier dans settings.json (ajouter au-dessus de l'entrée hooks)
cat >> .claude/settings.json << 'EOF'
  "dx": {
    "tracking_enabled": true,
    "usage_log_file": "${CLAUDE_PROJECT_DIR}/.claude/usage-log.jsonl",
    "rotation_size_mb": 50,
    "retention_days": 90
  }
EOF
```

## Exemples de requête

**Lister tous les appels d'outil dans une session** :
```bash
jq 'select(.session_id == "sess_abc123")' .claude/usage-log.jsonl
```

**Compter les invocations de compétences (pour /dx-metrics)** :
```bash
jq -s 'group_by(.skill_name) | map({skill: .[0].skill_name, count: length})' \
  .claude/usage-log.jsonl
```

**Trouver les erreurs** :
```bash
jq 'select(.success == false)' .claude/usage-log.jsonl | jq -s 'length'
```

**Calculer la durée moyenne par outil** :
```bash
jq -s 'group_by(.tool_called) | map({tool: .[0].tool_called, avg_ms: (map(.duration_ms) | add / length)})' \
  .claude/usage-log.jsonl
```

**Trouver les opérations lentes** (> 30 secondes) :
```bash
jq 'select(.duration_ms > 30000) | {timestamp, tool_called, duration_ms}' \
  .claude/usage-log.jsonl | head -10
```

**Détecter les boucles de nouvelle tentative** (même outil appelé 3+ fois en 60 secondes) :
```bash
jq -s '[.[] | select(.retry_count > 0)]' .claude/usage-log.jsonl
```

## Intégration avec /dx-metrics

Le hook usage-tracker alimente les données brutes à `/dx-metrics`, qui agrège pour le score DX :

```
[Invocation d'outil]
  ↓
[Hook PostToolUse]
  ↓
[usage-tracker.sh ajoute à .claude/usage-log.jsonl]
  ↓
[/dx-metrics lit usage-log.jsonl]
  ↓
[Génère .claude/dx-scorecard.json (invocations, taux de réussite, économies de temps, etc.)]
```

## Détection du nom de compétence

Le hook tente de déduire `skill_name` du contexte :

1. Vérifier la variable d'environnement `CLAUDE_ACTIVE_SKILL` (définie si s'exécutant dans une compétence)
2. Analyser les métadonnées de session pour la commande `/skill-name` en cours d'exécution
3. Déduire de la séquence d'outils (par exemple, si Bash + Read + Write en séquence, probablement une compétence de type code-review)
4. Secours : `skill_name = "manual"` (utilisateur exécutant directement les outils)

Pour de meilleurs résultats, les compétences doivent définir `CLAUDE_ACTIVE_SKILL` lors de l'invocation :

```bash
# À l'intérieur d'une compétence (par exemple, skills/productivity/code-review.md)
export CLAUDE_ACTIVE_SKILL="code-review"
# ... les instructions de compétence suivent
```

## Réglage des performances

Si la journalisation affecte la réactivité :

1. **Augmentez la taille de rotation** pour regrouper les rotations de journaux :
   ```json
   "rotation_size_mb": 100
   ```

2. **Diminuer la rétention** pour réduire l'utilisation du disque :
   ```json
   "retention_days": 30
   ```

3. **Désactiver temporairement** (lors de calculs lourds) :
   ```bash
   export DX_TRACKING_DISABLED=1
   ```

4. **Exemple de journaux** (enregistrer tous les Nième appels) — éditer usage-tracker.sh :
   ```bash
   SAMPLE_RATE=10  # Enregistrer 1 appel sur 10
   [ $((RANDOM % SAMPLE_RATE)) -ne 0 ] && exit 0
   ```

## Gouvernance des données

- **Propriété** : Équipe de projet / responsable DX
- **Accès** : Les utilisateurs peuvent interroger `.claude/usage-log.jsonl` localement ; aucun téléchargement vers le cloud
- **Anonymisation** : Supprimer user_id avant de partager les rapports (optionnel) :
  ```bash
  jq 'del(.user_id)' .claude/usage-log.jsonl > usage-log-anon.jsonl
  ```
- **Rétention** : Suppression automatique après 90 jours (configurable)
- **Refus** : Définir `DX_TRACKING_DISABLED=1` pour ignorer la journalisation

## Dépannage

**Aucun journal en cours d'écriture** :
- Vérifier que le hook est activé dans `.claude/settings.json`
- Vérifier les permissions du fichier `.claude/usage-log.jsonl` : `ls -la .claude/`
- Test d'exécution : `echo '{"test": 1}' | bash .claude/hooks/usage-tracker.sh`

**Les journaux se développent trop rapidement** :
- Augmentez `rotation_size_mb` ou diminuez `retention_days`
- Vérifier que le hook est vraiment asynchrone (ne doit pas bloquer Claude Code)

**Nom de compétence manquant** :
- Envelopper le code de compétence avec `export CLAUDE_ACTIVE_SKILL="skill-name"`
- Ou ajouter le nom de la compétence au contexte `.claude/settings.json`

---
