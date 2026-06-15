# Systèmes Multi-Agents : Liste de Contrôle de Préparation à la Production

Liste de contrôle complète pour assurer qu'un système multi-agents est prêt pour la production — couvrant l'observabilité, la fiabilité, le contrôle des coûts et la réponse aux incidents.

---

## Liste de Contrôle Pré-Déploiement

### Architecture

- [ ] Les agents ont des rôles sans chevauchement (pas de chevauchement de domaine)
- [ ] L'accès aux outils utilise le principe du moindre privilège (chaque agent n'a que les outils nécessaires)
- [ ] La topologie d'orchestration est documentée (DAG, tableau noir, superviseur, etc.)
- [ ] Les dépendances circulaires sont détectées et rejetées
- [ ] Les stratégies de délai d'attente et de nouvelle tentative sont définies pour tous les agents
- [ ] La stratégie de récupération en cas de défaillance est définie (réessayer, escalader, compenser)

### Tests

- [ ] Tests unitaires pour chaque agent (outils moqués)
- [ ] Tests d'intégration pour les remises d'agent (avec vraie communication inter-agents)
- [ ] Tests end-to-end pour les flux de travail complets (50+ cas de test)
- [ ] Tests de chaos : injecter des défaillances d'agents, des retards réseau, des délais d'attente
- [ ] Tests de charge : vérifier les performances avec les demandes concurrentes
- [ ] Simulation des coûts : estimer les tokens/coûts pour les flux de travail typiques

### Gestion de l'État

- [ ] Le schéma du tableau noir est défini et validé
- [ ] Le mécanisme de persistance d'état (fichier, DB) a été testé
- [ ] Le suivi des versions et la résolution des conflits ont été testés
- [ ] Le mécanisme de verrouillage empêche les écritures concurrentes
- [ ] La récupération suite à des défaillances partielles a été testée

### Observabilité

- [ ] L'ID de corrélation de trace est propagé à travers tous les appels d'agents
- [ ] La journalisation couvre tous les chemins critiques (succès, nouvelle tentative, défaillance, escalade)
- [ ] Les métriques sont collectées pour la latence, les tokens, les coûts
- [ ] La télémétrie d'appel d'agent est exportée (Datadog, Prometheus, etc.)
- [ ] La stratégie d'échantillonnage est définie (trace 100% ou exemple ?)

### Fiabilité

- [ ] Des délais d'attente sont définis pour tous les appels d'agents (avec alertes de monitoring)
- [ ] La logique de nouvelle tentative avec backoff exponentiel (max 3 tentatives)
- [ ] File d'attente des messages non traitables pour les défaillances irrécupérables
- [ ] SLO défini pour la disponibilité et la latence
- [ ] Budget d'erreur calculé et surveillé
- [ ] Les chemins d'escalade sont définis (email, Slack, PagerDuty)

### Contrôle des Coûts

- [ ] Budget de tokens défini par agent et total
- [ ] Alertes de coûts définies (avertissez si > 80% du budget, erreur si > 100%)
- [ ] Sélection du modèle optimisée (utilisez Haiku où possible, Opus seulement si nécessaire)
- [ ] Stratégie de mise en cache définie (réutiliser les résultats pour les mêmes entrées)
- [ ] Audit de tokenisation des entrées (ne pas passer un contexte inutile)

### Documentation

- [ ] README explique le flux d'orchestration avec un diagramme
- [ ] Les rôles des agents sont documentés (objectif, domaine, outils, SLA)
- [ ] Guide de dépannage pour les défaillances courantes
- [ ] Runbook pour la réponse aux incidents et l'escalade
- [ ] Guide des développeurs pour ajouter de nouveaux agents ou flux de travail

---

## Surveillance et Alerting

### Métriques Clés

**Disponibilité :**
```
success_rate = (successful_runs / total_runs) × 100%
Cible : 99.5% (budget d'erreur 0.5%)
Seuil d'alerte : < 95%
```

**Latence :**
```
p50_latency_ms = 50e percentile de la durée d'exécution
p99_latency_ms = 99e percentile de la durée d'exécution
Cible : p99 < 5 minutes
Seuil d'alerte : p99 > 4 minutes
```

**Coût :**
```
cost_per_run_cents = total_tokens × cost_per_token
Cible : < $1.00 par exécution
Seuil d'alerte : > $0.80 par exécution
```

**Spécifique à l'agent :**
```
Pour chaque agent :
├─ call_count (appels totaux effectués)
├─ success_rate (% réussis)
├─ avg_latency_ms
├─ p99_latency_ms
├─ avg_tokens
└─ cost_cents
```

### Règles d'Alerte

```json
{
  "alerts": [
    {
      "name": "success_rate_low",
      "condition": "success_rate < 95%",
      "severity": "page",
      "window": "5 minutes"
    },
    {
      "name": "latency_spike",
      "condition": "p99_latency_ms > 4 minutes",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "cost_spike",
      "condition": "cost_per_run_cents > 80",
      "severity": "warning",
      "window": "1 hour"
    },
    {
      "name": "agent_timeout",
      "condition": "agent.latency_ms > timeout_ms × 0.9",
      "severity": "warning",
      "window": "5 minutes"
    },
    {
      "name": "error_budget_depleted",
      "condition": "error_budget_remaining < 0.1%",
      "severity": "critical",
      "window": "1 day"
    }
  ]
}
```

---

## Réponse aux Incidents

### Définitions de Gravité de l'Incident

**SEV1 : Panne Complète**
- Taux de succès < 90% OU latence > 10 minutes
- Impact : Les utilisateurs ne peuvent pas effectuer de flux de travail
- Temps de réponse : < 5 minutes
- Escalade : Alertez tous les ingénieurs en support

**SEV2 : Dégradation Significative**
- Taux de succès 90-95% OU latence > 5 minutes
- Impact : Certains utilisateurs affectés, fonctionnalité partielle
- Temps de réponse : < 15 minutes
- Escalade : Alertez l'ingénieur en support

**SEV3 : Problèmes Mineurs**
- Taux de succès > 95% ET latence < 5 minutes
- Pic de coût (> 50% au-dessus de la base)
- Impact : Mineur, contournement disponible
- Temps de réponse : < 1 heure
- Escalade : Connectez à Slack, traitez pendant les heures de bureau

### Runbook : Réponse SEV1

```
1. DÉCLARER L'INCIDENT (1 min)
   └─ Alertez l'ingénieur en support
   └─ Créez un fil #incidents
   └─ Attribuez un commandant d'incident (IC)

2. ÉVALUER L'IMPACT (5 min)
   └─ Quels flux de travail échouent ? (% affectés)
   └─ Quels agents échouent ?
   └─ Depuis combien de temps cela se produit-il ?
   └─ Impact sur les revenus ?

3. ENQUÊTER (5-15 min)
   ├─ Vérifier les logs des agents (appels récents)
   ├─ Vérifier l'état du tableau noir (cohérent ?)
   ├─ Vérifier l'infrastructure (disponibilité, latence)
   ├─ Vérifier les dépendances (APIs que nous appelons)
   └─ Vérifier la disponibilité du modèle (l'API Anthropic est-elle disponible ?)

4. ATTÉNUER (5-30 min, choisissez le plus rapide)
   ├─ Option A : Indicateur de fonctionnalité désactiver (instantané)
   ├─ Option B : Agent de restauration (restauration à partir de main)
   ├─ Option C : Augmenter les ressources (si problème de capacité)
   └─ Option D : Correctif rapide (si correction de code simple)

5. VÉRIFIER LA RÉCUPÉRATION (5 min)
   ├─ Surveiller les métriques pendant 30 minutes
   ├─ Quand success_rate > 99%, déclarer récupéré
   └─ Si toujours en échec, revenir à ENQUÊTER

6. COMMUNIQUER
   ├─ Mises à jour internes toutes les 30 minutes
   └─ Mise à jour de la page d'état des clients
```

### Causes Courantes et Corrections

**Délai d'attente de l'agent (agent unique lent) :**
```
Cause racine : Invite système trop détaillée, ou modèle lent
Correction :
  1. Vérifier les paramètres du modèle/température
  2. Réduire l'invite système (supprimer le préambule détaillé)
  3. Réduire la taille des entrées (moins de tokens de contexte)
  4. Abaisser le seuil de délai d'attente et échouer rapidement
```

**Incohérence d'état (tableau noir corrompu) :**
```
Cause racine : Conflit d'écriture concurrente non détecté
Correction :
  1. Lire le dernier snapshot de tableau noir cohérent
  2. Restaurer à une version connue comme bonne
  3. Relire les tâches en attente à partir du snapshot
  4. Enquêter sur la logique de détection de conflit
```

**Pic de coûts (tokens dépassés le budget) :**
```
Cause racine : Entrées plus longues, tempêtes de nouvelles tentatives ou changement de modèle
Correction :
  1. Ajouter une limite de taille d'entrée (contexte de troncature)
  2. Ajouter l'application du budget de tokens (échouer rapidement si > 80%)
  3. Basculer vers un modèle moins cher (Haiku au lieu d'Opus)
  4. Implémenter la mise en cache (réutiliser les résultats pour les mêmes entrées)
```

**Blocage de l'orchestration (agents attendant indéfiniment) :**
```
Cause racine : Dépendance circulaire ou agent qui ne progresse pas
Correction :
  1. Vérifier le DAG d'orchestration pour les cycles
  2. Vérifier les logs des agents (est-il bloqué ou juste lent ?)
  3. Forcer le délai d'attente et escalader
  4. Examiner le graphique de dépendance et supprimer les cycles
```

---

## Stratégie de Déploiement

### Déploiement Canari

```
Phase 1 : Déployer en canari (5% du trafic)
├─ Surveiller le taux de succès, la latence, les coûts
├─ Cible : 1 heure
└─ Si les métriques stables → passer à la phase 2

Phase 2 : Déployer à 25% du trafic
├─ Surveiller pendant 1 heure
└─ Si les métriques stables → passer à la phase 3

Phase 3 : Déployer à 100% du trafic
├─ Surveiller pendant 4 heures
└─ Si les métriques stables → marquer comme GA
```

### Plan de Restauration

```
Si les métriques se dégradent pendant le canari :
├─ Revenir à la version d'agent précédente
├─ Revenir à la configuration d'orchestration précédente
└─ Si la restauration réussit, déclarer sûr

Conservez les 5 dernières versions d'agents en production (prêtes à la restauration).
```

---

## Optimisation des Coûts

### Sélection du Modèle par Agent

| Type d'Agent | Objectif | Modèle Recommandé | Raison |
|-----------|---------|-------------------|--------|
| Classifieur | Marquer ou catégoriser l'entrée | Haiku | Rapide, bon marché, raisonnement faible |
| Résumeur | Condenser le texte | Sonnet | Vitesse/qualité équilibrée |
| Raisonneur | Analyse complexe | Opus | Raisonnement, synthèse |
| Récupérateur | Recherche/lookup | Haiku | Raisonnement faible |

### Stratégies de Réduction des Tokens

1. **Contexte de troncature :** Passer uniquement les N derniers tokens (pas d'historique complet)
2. **Historique récapitulatif :** Au lieu du contexte complet, passer un résumé + 3 derniers tours
3. **Résultats de cache :** Réutiliser les sorties d'agent pour les entrées identiques
4. **Traitement par batch :** Traiter plusieurs demandes ensemble (amortir les frais généraux)

### Exemple : Optimisation des Coûts

```
Avant :
├─ Tokens moyens par exécution : 12,000
├─ Coût par exécution : $1.20
├─ Coût pour 10,000 exécutions/mois : $12,000

Optimisations :
├─ Basculer chercheur Opus vers Sonnet : -30% tokens
├─ Implémenter le cache (80% taux de réussite du cache) : -80% appels
├─ Tronquer le contexte à max 500 tokens : -50% tokens

Après :
├─ Tokens moyens par exécution : 2,400 (80% économisé sur 80% des appels)
├─ Coût par exécution : $0.24
├─ Coût pour 10,000 exécutions/mois : $2,400
└─ Économies : $9,600/mois (réduction de 80% des coûts)
```

---

## Conformité et Gouvernance

### Journalisation d'Audit

Toutes les décisions et mutations d'état des agents doivent être enregistrées :

```json
{
  "timestamp": "2026-06-15T14:20:00Z",
  "request_id": "req_abc123",
  "agent": "decision_agent",
  "action": "approve_order",
  "input": {"order_id": "o_789", "amount": 299.99},
  "output": {"approved": true, "reason": "..."},
  "model": "claude-opus-4-20250514",
  "tokens_used": 450,
  "cost_cents": 12
}
```

Emplacement : `.claude/audit-log.jsonl` (ajout uniquement, hachage à preuve de falsification).

### Confidentialité des Données

- [ ] Les invites des agents n'incluent pas les PII sans masquage
- [ ] Les sorties des agents ne divulguent pas les données des utilisateurs
- [ ] L'historique des conversations est chiffré au repos
- [ ] Journaux d'accès pour qui a interrogé quoi et quand
- [ ] Politique de rétention (supprimer les anciennes traces après 90 jours)

### Contraintes de Sécurité

- [ ] La sortie des agents est validée par rapport aux garde-fous de sécurité
- [ ] Les actions dangereuses (supprimer, modifier) nécessitent une approbation explicite
- [ ] Les tentatives de jailbreak sont détectées et enregistrées
- [ ] La limitation du débit empêche les abus (max N demandes par utilisateur par heure)

---

## Opérations à Long Terme

### Amélioration Continue

1. **Examens hebdomadaires :**
   - Vérifier le taux d'erreur, les tendances de latence, de coûts
   - Examiner les 10 premiers erreurs et défaillances
   - Planifier les optimisations pour la semaine prochaine

2. **Examens mensuels :**
   - Analyser le taux de consommation du budget d'erreur
   - Examiner les performances des agents (quel agent contribue le plus à la latence/au coût ?)
   - Planifier les améliorations architecturales

3. **Examens trimestriels :**
   - Comparer les métriques aux objectifs SLO
   - Planifier les mises à niveau du modèle (nouvelles versions Claude)
   - Évaluer les nouveaux agents ou flux de travail

### Mises à Jour du Runbook

Après chaque incident SEV1 ou SEV2 :
1. Documenter la cause racine dans RCA
2. Mettre à jour le runbook avec les étapes de prévention/récupération
3. Former l'équipe sur les nouvelles procédures
4. Ajouter un cas de test de régression

---
