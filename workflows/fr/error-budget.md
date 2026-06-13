# Application du budget d'erreur

Workflow SRE pour le suivi de la consommation du budget d'erreur par rapport aux fenêtres de SLO et application des exigences de gel des fonctionnalités et d'examen post-mortem lorsque les seuils sont dépassés.

---

## Quand utiliser

- Équipes avec SLOs définis qui ont besoin d'application automatisée au-delà de la surveillance manuelle
- Services où les déploiements continuent sans contrôle même lorsque la fiabilité est dégradée
- Examens post-incidents où « nous ne savions pas que le budget était épuisé » est un thème récurrent
- Plates-formes déployant plusieurs fois par jour où les vérifications manuelles du budget ne sont pas pratiques

---

## Phases / Étapes

### Formule du budget d'erreur

```
budget_erreur_restant = (1 - cible_slo) × secondes_fenetre - secondes_erreur_observées
taux_consommation = taux_erreur_actuel / taux_erreur_épuisant_budget_en_fenetre
```

Pour un SLO de 99,9 % sur une fenêtre de 30 jours :
- Budget d'erreur autorisé = 0,1 % × 2 592 000 s = **2 592 secondes** (~43 minutes)
- Si le taux d'erreur actuel est de 1 % : taux de consommation = 1 % / 0,1 % = **10×** (épuisera le budget en 3 jours, pas 30)

**Interprétation du taux de consommation :**

| Taux de consommation | Temps d'épuisement (budget sur 30j) | Urgence |
|-----------|------------------------------|---------|
| 1× | 30 jours | Normal |
| 2× | 15 jours | Surveiller |
| 6× | 5 jours | Alerte |
| 14,4× | ~2 jours | Avertissement |
| 36× | 20 heures | Immédiat |

---

### Alertes de taux de consommation multi-fenêtre

Les taux de consommation à une seule fenêtre produisent des faux positifs (pics courts) ou des faux négatifs (fuites lentes). Utilisez une confirmation à deux fenêtres :

**Consommation rapide — avertissez immédiatement :**
```
taux_consommation(1h) > 14,4 ET taux_consommation(6h) > 6
```
Signification : consommation >2 % du budget mensuel en 1 heure, confirmée sur 6 heures. C'est un incident en production.

**Consommation lente — ouvrez un ticket :**
```
taux_consommation(72h) > 3 ET taux_consommation(24h) > 3
```
Signification : consommation >10 % du budget mensuel en 3 jours, confirmée sur 1 jour. Nécessite une enquête avant le prochain déploiement.

**Justification des deux fenêtres :** la courte fenêtre capture les pics rapides ; la longue fenêtre filtre le bruit transitoire. Les deux doivent être vraies pour déclencher — éliminant la majorité des fausses alertes des anomalies brèves.

---

### Exemples PromQL

**Budget d'erreur restant (ratio, fenêtre de 30j) :**
```promql
(
  1 - (
    sum(increase(http_requests_total{status=~"5.."}[30d]))
    /
    sum(increase(http_requests_total[30d]))
  )
) / (1 - 0.999)
```
Retourne 1,0 quand le budget complet reste, 0,0 quand épuisé, négatif quand dépassé.

**Taux de consommation sur une fenêtre :**
```promql
# Taux de consommation 1h
(
  sum(rate(http_requests_total{status=~"5.."}[1h]))
  /
  sum(rate(http_requests_total[1h]))
) / (1 - 0.999)

# Remplacez [1h] par [6h], [24h], [72h] pour d'autres fenêtres
```

**Règle d'alerte de consommation rapide :**
```yaml
- alert: ErrorBudgetFastBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[1h]))
      / sum(rate(http_requests_total[1h]))
    ) / (1 - 0.999) > 14.4
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[6h]))
      / sum(rate(http_requests_total[6h]))
    ) / (1 - 0.999) > 6
  for: 2m
  labels:
    severity: page
  annotations:
    summary: "Consommation rapide du budget d'erreur — {{ $value }}× taux de consommation"
```

**Règle d'alerte de consommation lente :**
```yaml
- alert: ErrorBudgetSlowBurn
  expr: |
    (
      sum(rate(http_requests_total{status=~"5.."}[24h]))
      / sum(rate(http_requests_total[24h]))
    ) / (1 - 0.999) > 3
    and
    (
      sum(rate(http_requests_total{status=~"5.."}[72h]))
      / sum(rate(http_requests_total[72h]))
    ) / (1 - 0.999) > 3
  for: 15m
  labels:
    severity: ticket
  annotations:
    summary: "Consommation lente du budget d'erreur — {{ $value }}× taux de consommation"
```

---

### Application de la politique budgétaire

| Budget consommé | Politique |
|-----------------|--------|
| < 50% | Pas de restrictions |
| 50–100% | Gel des fusions non critiques ; approbation SRE requise pour les déploiements |
| > 100% | Gel complet du travail de fonctionnalité ; examen post-mortem requis avant déblocage |

**Définition du gel :**
- Fusions non critiques : tout PR non étiqueté `severity:critical` ou `type:hotfix`
- Gel complet : aucune fusion à la branche de production indépendamment de l'étiquette — seules les annulations autorisées
- Conditions de déblocage : examen post-mortem publié, actions correctives suivies, budget rétabli au-dessus de 20%

---

### Workflow Claude Code

Un agent cron hebdomadaire lit les métriques Prometheus, calcule les taux de consommation, publie un rapport budgétaire sur Slack, et ouvre un ticket de gel lorsque les seuils sont dépassés.

**Entrée hook dans `.claude/settings.json` :**
```json
{
  "hooks": {
    "schedule": [
      {
        "cron": "0 9 * * MON",
        "command": "claude -p 'Exécutez le workflow de budget d'erreur : récupérez les métriques, calculez les taux de consommation, publiez le rapport Slack, créez un ticket de gel si >50% consommé.'",
        "description": "Rapport budgétaire d'erreur hebdomadaire"
      }
    ]
  }
}
```

**Décomposition de la tâche de l'agent :**

1. **Récupérer les métriques** — interroger Prometheus pour les taux d'erreur 1h, 6h, 24h, 72h, 30j
2. **Calculer les taux de consommation** — appliquer la formule pour chaque fenêtre
3. **Déterminer l'état de la politique** — comparer la consommation % par rapport aux seuils
4. **Publier le rapport Slack** — formater le résumé budgétaire avec tableau de taux de consommation et état de la politique
5. **Créer un ticket de gel** — si >50% consommé, ouvrir un problème Linear/GitHub avec répartition budgétaire et instructions de gel
6. **Enregistrer dans un fichier** — ajouter le résultat à `.claude/error-budget-log.jsonl` pour suivi des tendances

**Format du rapport Slack :**
```
[Rapport de budget d'erreur — semaine du 2026-05-23]
Service: api-gateway  SLO: 99,9%  Fenêtre: 30j

Budget consommé: 67% ⚠️  GEL ACTIF
Restant: 855 secondes

Taux de consommation :
  1h:  2,1×   6h:  1,8×
  24h: 3,4×   72h: 3,1×

Politique: Fusions non critiques GELÉES. Approbation SRE requise.
Ticket: LIN-2847
```

---

## Exemple

**Scénario :** La passerelle API se dégrade après un déploiement de configuration manqué le jour 8 d'une fenêtre de 30 jours.

**Chronologie :**

| Heure | Événement | Budget consommé |
|------|-------|-----------------|
| Jour 1–7 | Opération normale, taux d'erreur de 0,05% | 12% |
| Jour 8, 14:00 | Le déploiement de configuration augmente le taux d'erreur à 2% | — |
| Jour 8, 15:00 | Taux de consommation 1h = 20×; taux de consommation 6h = 8× | — |
| Jour 8, 15:02 | L'alerte FastBurn se déclenche → avertissez la garde | — |
| Jour 8, 17:30 | Configuration restaurée, taux d'erreur revient à 0,05% | 71% consommé |
| Jour 8, 18:00 | L'agent Claude lit les métriques, publie le rapport Slack | — |
| Jour 8, 18:00 | Budget >50% → ticket de gel ouvert (LIN-2847) | — |
| Jour 9 | SRE examine. Consommation lente disparaît. Gel levé après approbation | — |
| Jour 9 | Examen post-mortem programmé (non requis — budget pas >100%) | — |

**Sans ce workflow :** les ingénieurs continueraient à fusionner le travail de fonctionnalité sans savoir que 71 % du budget de fiabilité du mois a été consommé un seul après-midi.

---
