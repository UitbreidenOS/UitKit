# Carnet d'exploitation de production agentic

Carnet d'exploitation opérationnel pour la surveillance, les alertes et la récupération des workflows multi-agents en production — définit les SLOs, la réaction aux incidents, les procédures de restauration et les chemins d'escalade.

---

## Quand utiliser

- Exécution de workflows multi-agents en production gérant les demandes d'utilisateurs en direct ou les tâches par lots critiques
- Workflows avec exigences SLO (temps de réponse, disponibilité, coût)
- Systèmes qui doivent maintenir la cohérence en cas de défaillances partielles
- Déploiements nécessitant la récupération automatique ou les procédures d'escalade manuelle

Ne pas utiliser pour les workflows expérimentaux ou de développement uniquement, ou les tâches par lots ponctuelles sans contraintes temps réel.

---

## SLOs et budgets d'erreur

Définissez les cibles de disponibilité et de performance pour le workflow multi-agent :

```json
{
  "workflow": "research_and_synthesize",
  "slo_version": "2026-06",
  "slos": [
    {
      "slo_id": "slo_availability",
      "metric": "workflow_success_rate",
      "target": "99.5%",
      "window": "30_days",
      "error_budget_pct": 0.5,
      "alert_threshold": "95%"
    },
    {
      "slo_id": "slo_latency_p99",
      "metric": "workflow_latency_ms",
      "target": 300000,
      "percentile": 99,
      "window": "7_days",
      "alert_threshold": 250000
    },
    {
      "slo_id": "slo_cost",
      "metric": "cost_per_workflow_cents",
      "target": 150,
      "window": "30_days",
      "alert_threshold": 130,
      "direction": "lower_is_better"
    }
  ],
  "error_budget_tracking": {
    "budget_available_pct": 0.42,
    "budget_consumed_pct": 0.08,
    "budget_remaining_days": 28,
    "burn_rate_pct_per_day": 0.0027
  }
}
```

**Règles SLO :**
- Disponibilité : pourcentage de workflows qui se terminent avec succès
- Latence : temps de réponse de la demande à la sortie finale (p99 est typique)
- Coût : jetons/appels API moyens par workflow
- Budget d'erreur : combien de défaillances sont acceptables avant d'appeler en appel

---

## Surveillance et alertes

Métriques en temps réel collectées de `.claude/workflow-metrics.jsonl` :

```json
{
  "metric_id": "metric_xyz789",
  "workflow": "research_and_synthesize",
  "timestamp": "2026-06-15T14:20:00Z",
  "execution_id": "exec_abc123",
  "metrics": {
    "workflow_status": "completed",
    "success": true,
    "latency_ms": 897000,
    "total_tokens": 24200,
    "cost_cents": 145,
    "agent_calls": 3,
    "retries": 0,
    "errors": 0,
    "timeout_count": 0
  },
  "agent_metrics": [
    {
      "agent": "researcher",
      "status": "completed",
      "latency_ms": 929000,
      "input_tokens": 2400,
      "output_tokens": 1850,
      "cost_cents": 78,
      "tool_calls": 5
    },
    {
      "agent": "analyst",
      "status": "completed",
      "latency_ms": 390000,
      "input_tokens": 3100,
      "output_tokens": 1200,
      "cost_cents": 48,
      "tool_calls": 1
    },
    {
      "agent": "writer",
      "status": "completed",
      "latency_ms": 78000,
      "input_tokens": 1800,
      "output_tokens": 890,
      "cost_cents": 19,
      "tool_calls": 0
    }
  ]
}
```

**Règles d'alerte (déclenchez immédiatement) :**

```json
{
  "alerts": [
    {
      "alert_id": "alert_workflow_failure",
      "condition": "success == false",
      "severity": "page",
      "throttle_seconds": 300,
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_latency_spike",
      "condition": "latency_ms > 600000",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_cost_spike",
      "condition": "cost_cents > 200",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_agent_timeout",
      "condition": "any(agent_metrics.latency_ms > 300000)",
      "severity": "page",
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_error_budget_exceeded",
      "condition": "burn_rate_pct_per_day > 0.01",
      "severity": "critical",
      "action": "page_engineering"
    }
  ]
}
```

---

## Réaction aux incidents

Quand une alerte se déclenche, suivez ce carnet d'exploitation :

### SEV1 : Défaillance de workflow

Panne complète du service (success_rate < 90% ou latence > 10 min).

```
1. DÉCLAREZ L'INCIDENT
   ├─ Appelez l'ingénieur en appel
   ├─ Créez le thread #incidents
   └─ Affectez IC (incident commander)

2. ÉVALUEZ L'IMPACT (5 min)
   ├─ Combien de workflows ont échoué ? (% du trafic)
   ├─ Quels agents échouent ? (tous ou agent spécifique ?)
   ├─ Depuis combien de temps cela se produit-il ?
   └─ Affecte-t-il les utilisateurs ? (impact sur les revenus ?)

3. ENQUÊTE (5-15 min)
   ├─ Vérifiez les journaux d'agent (30 derniers appels d'agent)
   ├─ Vérifiez l'état blackboard (l'état est-il cohérent ?)
   ├─ Vérifiez l'infrastructure (stockage, limites de débit API)
   ├─ Vérifiez le modèle d'agent (le modèle est-il disponible ?)
   └─ Vérifiez les dépendances en amont (les API que nous appelons, sont-elles arrêtées ?)

4. ATTÉNUEZ (chemin le plus court pour réduire l'impact utilisateur)
   ├─ Option A : Désactiver le workflow (feature flag)
   ├─ Option B : Restaurer à la dernière version d'agent connue
   ├─ Option C : Augmenter les ressources (si problème de capacité)
   └─ Option D : Appliquer correctif d'urgence (si correction simple)

5. RÉSOLVEZ (après atténuation)
   ├─ Corriger la cause racine (code, config, infrastructure)
   ├─ Déployer la correction
   ├─ Vérifier que les métriques reviennent à la normale
   └─ Planifier post-mortem

6. COMMUNIQUEZ (en continu)
   ├─ Mises à jour internes toutes les 30 min
   └─ Mises à jour de page de statut client
```

### SEV2 : Timeout ou dégradation d'agent

Un agent constamment lent (latence > 5 min) mais taux de succès global > 90%.

```
1. ENQUÊTE (10 min)
   ├─ Quel agent est lent ? (vérifiez agent_metrics.latency_ms)
   ├─ Est-il constamment lent ou intermittent ?
   ├─ Qu'est-ce qui a changé ? (nouveau modèle ? nouveau prompt ? nouveaux outils ?)
   └─ Bloque-t-il d'autres agents ? (l'écrivain attend-il l'analyste ?)

2. ATTÉNUEZ
   ├─ Option A : Basculez vers modèle plus rapide (Sonnet au lieu d'Opus)
   ├─ Option B : Réduisez la taille d'entrée (p. ex. moins de sources à analyser)
   ├─ Option C : Ajoutez timeout et implémentez fallback agent
   └─ Option D : Désactivez temporairement le workflow

3. RÉSOLVEZ
   ├─ Analyse de cause racine
   ├─ Déployer la correction
   └─ Tester avant de réactiver
```

### SEV3 : Augmentation des coûts

Coût du workflow augmenté > 50% (cost_cents > 150 pour slo_cost=100).

```
1. ENQUÊTE (5 min)
   ├─ Le nombre de jetons a-t-il augmenté ? (input_tokens, output_tokens)
   ├─ Le nombre de relances a-t-il augmenté ? (champ retries)
   ├─ Le modèle a-t-il changé ? (p. ex. Haiku → Opus)
   └─ Le nombre d'appels d'outils a-t-il augmenté ?

2. ATTÉNUEZ
   ├─ Option A : Réduire le contexte d'entrée (moins de sources au analyste)
   ├─ Option B : Basculer vers modèle moins cher (si précision acceptable)
   ├─ Option C : Ajouter couche de cache (résultats de recherche en cache par sujet)
   └─ Option D : Implémenter budget de jetons (abandon si > max_tokens)

3. RÉSOLVEZ
   ├─ Optimiser prompts système (supprimer préambule verbeux)
   ├─ Optimiser formatage d'entrée (supprimer données redondantes)
   └─ Ajouter limite de jetons explicite aux appels d'agent
```

---

## Procédures de restauration

### Restauration de version d'agent

Si une nouvelle version d'agent cause des défaillances :

```bash
# Current production agents
agents/roles/researcher.md@HEAD
agents/roles/analyst.md@HEAD
agents/roles/writer.md@HEAD

# Previous stable version (known to work)
agents/roles/researcher.md@v1.2.3
agents/roles/analyst.md@v1.2.3
agents/roles/writer.md@v1.2.3

# Rollback
git checkout v1.2.3 -- agents/roles/
# Verify in staging
# Deploy to production
```

### Restauration de configuration de workflow

Si un changement de schéma blackboard ou contrat de coordination rompt les workflows :

```bash
# Current config
workflows/agent-team-kickoff.md@HEAD

# Previous stable config
workflows/agent-team-kickoff.md@v1.1.0

# Rollback
git checkout v1.1.0 -- workflows/agent-team-kickoff.md
# Verify in staging
# Deploy to production
```

**Liste de contrôle de restauration :**
- [ ] Identifier quel composant est cassé
- [ ] Identifier version stable précédente
- [ ] Vérifier correction en environnement staging (relire 10 exécutions récentes)
- [ ] Effectuer restauration
- [ ] Surveiller métriques pendant 30 minutes
- [ ] Si métriques normales, déclarer récupéré
- [ ] Si toujours échoue, escalader à l'équipe d'ingénierie

---

## Chemins d'escalade

```
L'utilisateur signale erreur
       ↓
Alerte se déclenche (SEV3: avertissement)
       ↓
Consigner à #ops-alerts Slack
       ↓
Attendre 10 min pour récupération automatique
       ↓
       ├─ Récupéré ? → Fermer ticket, planifier RCA
       │
       └─ Toujours échoue ?
              ↓
         Alerte se déclenche (SEV2: appel)
              ↓
         Appelez l'ingénieur en appel
              ↓
         Accusé réception en 5 min ?
              ↓
         ├─ OUI → Commencer atténuation
         │
         └─ NON → Escalader à backup en appel
                ↓
         Appelez ingénieur backup
                ↓
         Accusé réception en 5 min ?
                ↓
         ├─ OUI → Commencer atténuation
         │
         └─ NON → Appelez manager d'ingénierie
                ↓
         Déclarez SEV1
                ↓
         Réponse d'incident all-hands
```

---

## Examen post-incident

Après chaque incident SEV1 ou SEV2, planifiez RCA (post-mortem) :

```json
{
  "rca_id": "rca_2026_06_15_001",
  "incident_id": "inc_abc123",
  "workflow": "research_and_synthesize",
  "date": "2026-06-15",
  "severity": "SEV1",
  "duration_minutes": 18,
  "impact": {
    "workflows_failed": 847,
    "revenue_lost": 12340
  },
  "timeline": [
    {"time": "14:02", "event": "Alert fired: success_rate < 90%"},
    {"time": "14:05", "event": "On-call paged"},
    {"time": "14:08", "event": "Identified analyst timeout"},
    {"time": "14:15", "event": "Rolled back analyst to v1.2.3"},
    {"time": "14:20", "event": "Metrics recovered"}
  ],
  "root_cause": "Analyst agent system prompt was too verbose, causing token overflow and timeout",
  "contributing_factors": [
    "No token budget enforced at agent level",
    "Analyst timeout not caught by circuit breaker"
  ],
  "action_items": [
    {
      "action": "Add token budget to agent calls (max 5000 tokens)",
      "assigned_to": "alice@example.com",
      "due_date": "2026-06-20"
    },
    {
      "action": "Implement circuit breaker (fail fast after 3 timeouts)",
      "assigned_to": "bob@example.com",
      "due_date": "2026-06-25"
    },
    {
      "action": "Add agent latency SLI to monitoring dashboard",
      "assigned_to": "charlie@example.com",
      "due_date": "2026-06-18"
    }
  ]
}
```

---

## Exemple : Réaction aux incidents

**Incident :** Augmentation des défaillances de workflow le 2026-06-15 à 14:02 UTC.

```
14:02 → Alert fires: "research_and_synthesize success_rate = 85% (target 99.5%)"
14:02 → On-call paged
14:05 → IC (Alice) joins war room
14:05 → IC assess impact: ~800 workflows failed in last 3 minutes
14:07 → IC checks metrics: analyst agent latency spiked to 15 minutes (normal: 6 min)
14:09 → IC checks logs: analyst model API rate limited (hitting OpenAI quota? no, we use Anthropic)
14:10 → IC hypothesis: Analyst system prompt changed in last deploy
14:11 → IC checks git: Analyst prompt was updated 45 min ago
14:12 → IC reviews change: Added extensive reasoning preamble (200 tokens)
14:13 → IC rolls back: git revert HEAD~1 -- agents/roles/analyst.md
14:14 → IC deploys to production
14:15 → IC monitors: latency decreasing, success_rate recovering
14:20 → Metrics normal: latency = 6m, success_rate = 99.6%
14:22 → IC closes incident
14:30 → RCA scheduled for 2026-06-16

Action items:
- Add token budget enforcement (max 5000 input tokens per agent)
- Implement circuit breaker (fail after 3 consecutive timeouts)
- Add pre-deploy validation (max system prompt size 1000 tokens)
```

---
