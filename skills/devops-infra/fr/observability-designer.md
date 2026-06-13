---
name: observability-designer
description: "Stratégie d'observabilité : concevoir les trois piliers (logs, métriques, traces), instrumenter les services, choisir les outils, définir la philosophie d'alerte, passer du réactif au proactif"
---

# Compétence Concepteur d'Observabilité

## Quand l'activer
- Concevoir une stratégie d'observabilité à partir de zéro
- Passer de logs uniquement à observabilité complète trois piliers
- Décider entre outils d'observabilité (Datadog, Grafana, Honeycomb, New Relic)
- Instrumenter un service avec OpenTelemetry
- Configurer le logging structuré à l'échelle
- Définir sur quoi alerter (et sur quoi ne pas alerter)

## Quand NE PAS l'utiliser
- Design SLO — utiliser la compétence slo-architect d'abord
- Rédaction de carnet — utiliser la compétence runbook-generator
- Surveillance de sécurité (SIEM) — outillage et modèle de menace différent
- Analytique métier / métriques produit — utiliser la compétence analytics-tracking

## Instructions

### Conception d'observabilité trois piliers

Les trois piliers :
1. LOGS — Ce qui s'est passé (événements)
2. METRICS — Combien / à quelle vitesse (agrégations)
3. TRACES — Pourquoi c'est arrivé (causalité)

**Logging structuré :** Chaque ligne de log = JSON valide avec timestamp, level, service, trace_id, message, champs de contexte.

**Métriques clés :** Counters, Gauges, Histograms. Méthode USE : Utilisation, Saturation, Erreurs. Méthode RED : Rate, Errors, Duration.

**Instrumentation de traces :** Inbound HTTP, outbound calls, database queries, message queues, external APIs.

Concevoir la stratégie trois piliers pour mon système avec recommandations d'outils spécifiques.

### Sélection d'outillage

```
Choisir l'outillage d'observabilité pour [équipe/budget].

Managed : Datadog (tout-en-un), Honeycomb (traces), New Relic (free tier généreux), Grafana Cloud (bon marché)

Self-Hosted : Prometheus + Grafana + Loki + Tempo (coût infrastructure ~$50-200/mois, meilleur pour budget > $5K/mois)

Recommandation : instruments toujours avec OpenTelemetry — permet de changer de backend sans modifications de code.

Recommandation pour mes contraintes : [pile d'outils + justification + coût mensuel estimé]
```

### Implémentation de logging structuré

```
Implémenter le logging structuré pour [service].

Langage/framework : [Node.js/Express / Python/FastAPI / Go / Java/Spring]
Destination : [CloudWatch / Datadog / Elasticsearch / stdout (pour k8s)]

Standards à appliquer :
- JSON valide en sortie
- Timestamp ISO 8601
- Niveaux : DEBUG/INFO/WARN/ERROR
- Contexte : user_id, request_id, duration_ms, error_code
- Corrélation : trace_id pour lier les logs, metrics et traces

Implémenter le logging structuré avec les meilleures pratiques pour mon langage/framework.
```

### Philosophie d'alerte

```
Définir la philosophie d'alerte pour [système].

Qu'alerter :
- Défaillances réelles affectant les utilisateurs
- Dégradation de performance mesurable (p99 latency, error rate)
- Ressources épuisées (disque, mémoire, connexions DB)

Ne pas alerter :
- Avertissements de log (peu utiles à l'échelle)
- Métriques sans action (alertes spectateur)
- Seuils théoriques sans impact utilisateur réel

Règles pour bonnes alertes :
- Actionnable : l'alerte dit exactement quoi faire
- Basée sur symptômes, pas sur causes (alerter sur latence, pas sur CPU)
- Peu faux positifs : on-call fatigué = alertes ignorées

Concevoir l'ensemble des alertes pour mon système.
```

---
