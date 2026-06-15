# Guide de Mesure de l'Expérience Développeur

Mesurer l'expérience développeur (DX) dans l'adoption de Claude Code nécessite la collecte, l'agrégation, et l'analyse systématiques de l'utilisation des skills, des patterns de session, et de l'efficacité des fonctionnalités. Ce guide définit le framework des métriques DX et les patterns d'instrumentation.

---

## Pourquoi mesurer DX

- **Validation de l'adoption** : Les utilisateurs découvrent-ils et invoquent-ils réellement les skills publiés ?
- **ROI des fonctionnalités** : Quels skills économisent du temps, réduisent les erreurs, ou débloquent les flux de travail ?
- **Détection de goulots d'étranglement** : Identifier les points de friction (skills lents, docs confuses, intégrations manquantes)
- **Amélioration itérative** : Quantifier l'impact des mises à jour des skills, des nouveaux guides, ou des changements de flux de travail
- **Soutien du cas commercial** : Démontrer la valeur de l'investissement Claude Code aux parties prenantes

---

## Schéma des métriques

### Métriques essentielles

| Métrique | Définition | Unité | Collection |
|---|---|---|---|
| `invocations` | Nombre de fois qu'un skill a été appelé dans une session/période | count | Hook PostToolUse |
| `success_rate` | % des invocations de skill qui ont été complétées sans erreur | % (0–100) | PostToolUse + code de sortie outil |
| `avg_duration_sec` | Temps d'exécution moyen par invocation de skill | secondes | Paire de timestamp PostToolUse |
| `time_saved_min` | Temps estimé économisé vs. exécution manuelle (rapporté par l'utilisateur ou déduit) | minutes | Métadonnées de session + heuristiques |
| `error_rate` | % des invocations résultant en erreur, timeout, ou retentative utilisateur | % (0–100) | Statut de sortie PostToolUse |
| `user_count` | Utilisateurs distincts invoquant le skill | count | Agrégation d'ID de session |
| `adoption_tier` | Classification : `abandoned` (<5 invocations), `low` (5–50), `active` (50–500), `core` (>500) | category | Invocations agrégées |

### Métriques dérivées

| Métrique | Formule | Interprétation |
|---|---|---|
| **DX Score** | `(success_rate * 0.4) + (adoption_tier_score * 0.3) + (time_saved_relevance * 0.3)` | 0–100 : santé générale |
| **Productivity Multiplier** | `total_time_saved_per_user / avg_session_duration` | Heures économisées par heure d'utilisation de Claude Code |
| **Friction Index** | `error_rate + (100 - success_rate)` | 0–200 : plus bas est mieux |

### Attributs au niveau de la session

Suivez dans `.claude/session-log.md` (créé au démarrage de la session, ajouté avec un résumé à la fin) :

```markdown
## Résumé de session — 2026-06-15T14:30:00Z

**Utilisateur** : alice@company.com
**Durée** : 47 minutes
**Skills invoqués** : code-review, simplify, deep-research
**Appels d'outil totaux** : 18
**Erreurs** : 1 (timeout deep-research à la 3e tentative, retentiative réussie)
**Temps économisé** : ~60 minutes (code-review + simplify auto-fixes ont économisé la refactorisation manuelle)
**Blocker** : Aucun
**Feedback** : « deep-research devrait cacher les résultats de recherche à travers les retentatives »
```

---

## Patterns d'instrumentation

### 1. Hook PostToolUse (Journalisation en temps réel)

Chaque invocation d'outil se connecte à `.claude/usage-log.jsonl` :

```json
{
  "timestamp": "2026-06-15T14:32:15.234Z",
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "skill_name": "code-review",
  "tool_called": "Bash",
  "invocation_num": 3,
  "duration_ms": 2847,
  "exit_code": 0,
  "success": true,
  "tool_output_length": 1247,
  "retry_count": 0
}
```

Voir `hooks/usage-tracker.md` pour l'implémentation.

### 2. Session Log (Résumé de fin de session)

Créez `.claude/session-log.md` au démarrage de session, ajoutez le résumé à la fin :

```bash
# Initialisez au démarrage de session
cat >> .claude/session-log.md << EOF
## Session Summary — $(date -u +"%Y-%m-%dT%H:%M:%SZ")

**User**: $USER
**Skills**: [will update at end]
**Duration**: [will calculate]
**Errors**: [will count]

---
EOF
```

À la fin de la session, analysez `usage-log.jsonl` pour agréger et ajouter :

```json
{
  "session_id": "sess_7f8a9b2c",
  "user_id": "alice@company.com",
  "start_time": "2026-06-15T13:45:00Z",
  "end_time": "2026-06-15T14:32:47Z",
  "duration_minutes": 47,
  "skills_invoked": ["code-review", "simplify", "deep-research"],
  "total_invocations": 18,
  "total_errors": 1,
  "estimated_time_saved_min": 60,
  "sentiment": "positive"
}
```

### 3. Agrégation hebdomadaire/mensuelle

Exécutez `/dx-metrics aggregate` (ou l'agent `dx-analyst`) pour produire `.claude/dx-scorecard.json` :

```json
{
  "period": "2026-06-08T00:00:00Z/2026-06-15T00:00:00Z",
  "metrics": {
    "code-review": {
      "invocations": 47,
      "success_rate": 97.9,
      "avg_duration_sec": 18.3,
      "error_rate": 2.1,
      "user_count": 12,
      "adoption_tier": "active",
      "time_saved_min": 891
    },
    "simplify": {
      "invocations": 31,
      "success_rate": 100,
      "avg_duration_sec": 12.1,
      "error_rate": 0,
      "user_count": 9,
      "adoption_tier": "active",
      "time_saved_min": 403
    },
    "deep-research": {
      "invocations": 8,
      "success_rate": 75.0,
      "avg_duration_sec": 45.7,
      "error_rate": 25.0,
      "user_count": 4,
      "adoption_tier": "low",
      "time_saved_min": 180
    }
  },
  "summary": {
    "total_users": 22,
    "avg_dx_score": 81.4,
    "total_time_saved_hours": 28.2,
    "friction_index": 12.3,
    "top_skill": "code-review",
    "lowest_adoption": "deep-research",
    "recommended_actions": [
      "Improve deep-research retry/caching to reduce 25% error rate",
      "Add session-log best practices guide (only 40% of sessions documented)"
    ]
  }
}
```

---

## Architecture de collecte de données

### Fichiers générés

| Fichier | Objectif | Fréquence | Rétention |
|---|---|---|---|
| `.claude/usage-log.jsonl` | Journaux de hook bruts (append-only) | Par appel d'outil | 90 jours |
| `.claude/session-log.md` | Résumé visible par l'utilisateur (une par session) | Par session | 30 jours (accumulé) |
| `.claude/dx-scorecard.json` | Snapshot des métriques agrégées | Hebdomadaire/mensuel | Indéfini |
| `.claude/dx-scorecard-history.jsonl` | Série temporelle des scorecards | Hebdomadaire/mensuel | 2 ans |

### Flux de collecte

```
[Invocation d'outil] 
    ↓
[Hook PostToolUse se déclenche]
    ↓
[usage-tracker.sh ajoute à usage-log.jsonl]
    ↓
[Session termine]
    ↓
[Résumé de session généré]
    ↓
[Hebdomadaire : dx-analyst agrège dans dx-scorecard.json]
    ↓
[Mensuel : les tendances sont analysées, les améliorations sont proposées]
```

---

## Meilleures pratiques

### Pour les utilisateurs (journalisation de session)

1. **Activez le suivi d'utilisation** dans votre projet `.claude/settings.json` :
   ```json
   {
     "hooks": {
       "PostToolUse": [{"type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/usage-tracker.sh"}]
     }
   }
   ```

2. **Ajoutez le feedback de session** à la fin de chaque session :
   ```markdown
   ## Feedback

   - **Ce qui a marché** : code-review a trouvé 3 bugs critiques dans le flux de connexion
   - **Ce qui était lent** : timeout deep-research à la 3e recherche (nécessite la limite de retentative heuristique)
   - **Manquant** : Aucun skill pour valider les performances des requêtes SQL
   - **Temps économisé** : ~2 heures sur refactorisation vs. review manuel
   ```

3. **Utilisez les noms de skills cohérents** dans les requêtes (vérifiez `/help` pour les noms exacts)

### Pour les auteurs de skill

1. **Nommez les skills pour l'introspection** : Utilisez des noms clairs, single-purpose (p. ex., `code-review`, pas `code-quality-plus`)
2. **Inclure les conseils de timing dans la sortie** : « Analysé 412 lignes en 2.3 secondes »
3. **Rapporter explicitement le succès/échec** : Code de sortie 0 = succès ; non-zéro = erreur (hook capture ceci)
4. **Documenter la durée attendue** : « Temps d'exécution typique : 30–120 secondes » aide les utilisateurs à estimer le ROI

### Pour les responsables DX d'organisation

1. **Cadence mensuelle d'examen** : Agrégez les métriques le premier lundi de chaque mois
2. **Boucles de feedback utilisateur** : Interrogez les utilisateurs de skill trimestriellement sur les points de friction
3. **Publiez les métriques** : Partagez `.claude/dx-scorecard.json` dans le tableau de bord d'équipe ou le wiki
4. **Agissez sur les goulots d'étranglement** : Si error_rate > 10%, enquêtez et proposez un correctif dans les 2 semaines
5. **Célébrez les victoires** : Partagez les totaux temps-économisé et la croissance d'adoption dans les syncs d'équipe

---

## Confidentialité et gouvernance des données

- **Anonymisation utilisateur** : Option pour agréger par rôle/équipe au lieu d'email individuel
- **Politique de rétention** : Supprimez les journaux bruts après 90 jours ; gardez les métriques agrégées indéfiniment
- **Opt-out** : Les utilisateurs peuvent définir `DX_TRACKING_DISABLED=1` pour ignorer la journalisation par hook
- **Local-only par défaut** : `.claude/usage-log.jsonl` et `.claude/session-log.md` vivent dans le répertoire du projet, jamais uploadés sauf configuration explicite

---

## Exemples d'intégration

### Notification Slack (Digest hebdomadaire)

Hook dans `.claude/settings.json` pour poster le scorecard à Slack :

```json
{
  "hooks": {
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL -d @.claude/dx-scorecard.json"
          }
        ]
      }
    ]
  }
}
```

### GitHub Issues (Bottleneck Tracking)

Auto-créez les issues GitHub pour les skills avec error_rate > 15% :

```bash
jq '.metrics[] | select(.error_rate > 15)' .claude/dx-scorecard.json | \
  while read skill; do
    gh issue create --title "High error rate: $(echo $skill | jq .name)" \
      --label "dx-bottleneck" \
      --body "Error rate: $(echo $skill | jq .error_rate)%"
  done
```

### Tableau de bord Grafana

Exportez les métriques de série temporelle vers Prometheus pour la visualisation :

```bash
jq '.metrics | to_entries[] | {name: .key, value: .value.success_rate}' \
  .claude/dx-scorecard-history.jsonl | prometheus_remote_write
```

---

## Checklist de mesure

- [ ] Activez le hook `usage-tracker` dans `.claude/settings.json`
- [ ] Créez le modèle `.claude/session-log.md`
- [ ] Planifiez l'examen DX hebdomadaire (ou déléguez à l'agent `dx-analyst`)
- [ ] Documentez les noms de skills et les durées attendues dans le wiki d'équipe
- [ ] Définissez error_rate et adoption_tier seuils pour l'escalade
- [ ] Partagez le scorecard mensuel avec l'équipe
- [ ] Itérez : ajustez les métriques basées sur le feedback

---
