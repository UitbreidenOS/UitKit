# Claude pour les Ingénieurs DevOps et Platform

Tout ce dont un ingénieur DevOps ou platform a besoin pour piloter avec l'IA les opérations d'infrastructure — réponse aux incidents, runbooks, IaC, pipelines CI/CD, planification de capacité, gestion des SLO et les rythmes quotidiens qui maintiennent la production en bonne santé.

---

## À qui s'adresse ce guide

Vous êtes un ingénieur DevOps, SRE ou platform responsable de la fiabilité de l'infrastructure, des pipelines de déploiement et de la santé opérationnelle des systèmes de production. Vous êtes d'astreinte, vous écrivez du Terraform et des manifests Kubernetes, vous possédez les pipelines CI/CD et vous êtes en première ligne quand quelque chose casse.

**Avant Claude Code :** 2 heures pour rédiger un runbook. 30 minutes pour ébaucher un postmortem. Une demi-journée pour concevoir une nouvelle stratégie de monitoring. Les changements IaC révisés lentement parce qu'il est difficile de les expliquer aux parties prenantes non-infra.

**Après :** Runbook généré depuis l'historique des incidents en 20 minutes. Postmortem structuré en 10 minutes. Modules Terraform ébauché avec des valeurs par défaut sensées en une session. Stratégie de monitoring conçue avec le contexte SLO intégré.

---

## Installation en 30 secondes

```bash
# Installer la stack DevOps/platform complète
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/github-actions
npx claudient add skill devops-infra/observability-designer
npx claudient add skill devops-infra/incident-response
npx claudient add skill devops-infra/aws-architect
npx claudient add skill devops-infra/slo-architect
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill devops-infra/capacity-planner
npx claudient add agents roles/sre-engineer
npx claudient add agents roles/incident-commander
npx claudient add agents roles/platform-engineer
npx claudient add agents roles/kubernetes-architect
```

---

## Votre stack DevOps avec Claude Code

### Compétences (commandes slash)

| Compétence | Ce qu'elle fait | Quand l'utiliser |
|---|---|---|
| `/incident-response` | Réponse structurée aux incidents : triage, war room, postmortem | Tout incident de production |
| `/oncall-runbook` | Générer des runbooks depuis l'historique des incidents, auditer les existants | Avant qu'un nouveau service passe en astreinte, après des incidents |
| `/observability-designer` | Concevoir la stratégie métriques, logs, traces — Datadog, Prometheus, OTel | Nouveaux services, lacunes de monitoring |
| `/slo-architect` | Définir les SLO, budgets d'erreur, seuils d'alerte | Nouveaux services, révisions des SLO |
| `/capacity-planner` | Prévoir les besoins en ressources, projections de coûts, seuils de scaling | Planification trimestrielle, pré-lancement |
| `/kubernetes` | Manifests K8s, HPA, limites de ressources, débogage, politiques réseau | Tout travail K8s |
| `/terraform` | Modules IaC, gestion d'état, import, revue de plan | Tout provisioning d'infrastructure |
| `/docker` | Dockerfiles, builds multi-étapes, optimisation d'images, compose | Travail sur les conteneurs |
| `/github-actions` | Conception de pipelines CI/CD, optimisation, secrets, mise en cache | Travail sur les pipelines |
| `/aws-architect` | Conception d'architecture AWS : VPC, IAM, ECS, RDS, CloudFront | Infrastructure AWS |

### Agents

| Agent | Modèle | Quand le solliciter |
|---|---|---|
| `sre-engineer` | Sonnet | Analyse de fiabilité, conception de SLO, décisions sur le budget d'erreur |
| `incident-commander` | Sonnet | Coordination d'incidents majeurs, structure de la war room |
| `platform-engineer` | Sonnet | Expérience développeur, outillage interne, conception de plateforme |
| `kubernetes-architect` | Opus | Architecture K8s complexe, multi-cluster, service mesh |

---

## Flux de travail quotidien

### Bilan de santé de l'infrastructure matinal (15-20 minutes)

```
/observability-designer

Revue de l'infrastructure matinale — [DATE] :

Services : [listez vos services clés]
Période : les 24 dernières heures

Extrayez de vos tableaux de bord et décrivez :
- Des alertes P1 ou P2 déclenchées cette nuit ?
- Taux d'erreur actuels pour chaque service vs. SLO
- Des services avec un taux de consommation du budget d'erreur > 1x (consommant plus vite qu'autorisé) ?
- Activité de déploiement dans les 24 dernières heures : déploiements en cours ou récemment terminés ?
- Santé des bases de données : lag de réplication, nombre de connexions, requêtes lentes
- Anomalies de coûts (pic de dépenses cloud) ?

Résultat de triage :
- Qu'est-ce qui nécessite une action aujourd'hui ?
- Qu'est-ce qui mérite surveillance sans être urgent ?
- Qu'est-ce que je peux clore sans action ?
```

### Planification des changements d'infrastructure

```
/terraform (ou /kubernetes ou /aws-architect)

Je planifie ce changement d'infrastructure : [décrire]

Avant d'implémenter :
1. Quels sont les risques de ce changement ?
2. Que dois-je tester en staging avant d'appliquer en production ?
3. Existe-t-il une manière plus sûre de faire ce changement de manière incrémentale ?
4. Quel est le plan de rollback si cela échoue ?
5. Qui devrait réviser ceci avant que je l'applique ?
6. Quel monitoring dois-je surveiller immédiatement après le changement ?

Changement : [collez le plan Terraform ou le diff kubectl ou décrivez le changement]
```

### Maintenance du pipeline CI/CD

```
/github-actions

Révisez et optimisez mon pipeline CI/CD.

Pipeline actuel : [collez le YAML du workflow ou décrivez]
Points douloureux : [builds lents / tests instables / problèmes de gestion des secrets / cache manqués]
Amélioration souhaitée : [plus rapide / plus fiable / meilleure sécurité / moins cher]

Analysez :
1. Quel est le chemin critique — quelles étapes ralentissent le plus le pipeline ?
2. Qu'est-ce qui peut s'exécuter en parallèle qui s'exécute actuellement séquentiellement ?
3. Y a-t-il des opportunités de mise en cache manquées ?
4. Des anti-patterns de sécurité (secrets codés en dur, GITHUB_TOKEN trop permissif, etc.) ?
5. Version optimisée du pipeline avec explications

Générez le YAML de workflow amélioré.
```

---

## Workflows clés par scénario

### Nouveau service en production

```
Étape 1 : Conception des SLO
/slo-architect
Définissez les SLO pour [nom du service] :
- Disponibilité : quel pourcentage de disponibilité est acceptable ?
- Latence : cibles p50 / p95 / p99
- Taux d'erreur : quel taux déclenche une alerte ?
- Budget d'erreur : quel budget d'erreur sur 30 jours ?

Étape 2 : Observabilité
/observability-designer
Concevez la stack de monitoring pour [service] :
- Métriques clés à instrumenter (méthode RED : Rate, Errors, Duration)
- Structure des logs et rétention
- Configuration du tracing distribué
- Disposition du tableau de bord pour les ingénieurs d'astreinte

Étape 3 : Runbook
/oncall-runbook
Générez le runbook initial pour [service] :
- Vue d'ensemble du service
- Modes de défaillance connus (même pré-lancement — basés sur l'architecture)
- Chemin d'escalade
- Réponses aux alertes du premier jour

Étape 4 : Référentiel de capacité
/capacity-planner
Établissez le référentiel de capacité et les déclencheurs de scaling :
- Trafic attendu au lancement
- Configuration de l'auto-scaling
- Prévision de coûts pour les 3 premiers mois
```

### Réponse aux incidents

```
/incident-response

Incident : [décrivez ce qui se passe]
Sévérité : [P1 / P2 / P3]
Services affectés : [liste]
Impact client : [décrire]
Heure de début : [quand cela a-t-il commencé ?]

Exécutez la réponse structurée à l'incident :
1. Évaluation initiale et confirmation de la sévérité
2. Mise en place de la war room (qui pager, canal de communication)
3. Options de mitigation immédiate
4. Chemin d'investigation (quels logs, métriques et traces regarder en premier)
5. Modèle de communication aux parties prenantes
6. Quand escalader vs. quand continuer à investiguer
```

### Postmortem après un incident

```
/incident-response

Rédigez le postmortem pour [NOM DE L'INCIDENT] le [DATE].

Chronologie (collez l'historique de votre canal d'incident ou vos notes) :
[collez la chronologie]

Impact :
- Durée : [X minutes]
- Services affectés : [liste]
- Clients affectés : [N ou %]
- Impact sur le revenu (si connu) : [$X]

Cause racine (ce que vous avez trouvé) :
[décrire]

Facteurs contributifs :
[décrire]

Ce que nous avons bien fait :
[décrire]

Générez : postmortem structuré avec chronologie, analyse de la cause racine, facteurs contributifs, actions à mener (avec responsables et dates d'échéance), et le seul changement de monitoring ou d'alerte qui aurait détecté cela plus rapidement.
```

### Revue d'infrastructure Terraform

```
/terraform

Révisez ce plan Terraform avant de l'appliquer en production.

Environnement : [production / staging]
Type de changement : [nouvelle ressource / modification / destruction]

Résultat du plan :
[collez le résultat de terraform plan]

Révisez pour :
1. Des destructions de ressources inattendues ou risquées
2. Des mauvaises configurations de sécurité (groupes de sécurité ouverts, buckets S3 publics, sur-permission IAM)
3. Des tags manquants ou violations des conventions de nommage
4. Des problèmes de gestion d'état (données sensibles dans l'état, problèmes de verrou d'état)
5. Estimation de l'impact sur les coûts du changement

Également : que dois-je surveiller dans les 30 minutes suivant l'application ?
```

---

## Plan de montée en compétence sur 30 jours (ingénieur DevOps nouveau dans une équipe ou un système)

### Semaine 1 — Cartographier le paysage
- Installez toutes les compétences et agents DevOps
- Exécutez l'audit `/oncall-runbook` sur les 3 services les plus critiques — identifiez les lacunes
- Cartographiez les SLO actuels : existent-ils ? Sont-ils mesurés ? Utilisez `/slo-architect` pour évaluer
- Participez à un cycle d'incident complet — même s'il n'y en a pas, révisez les 3 derniers postmortems

### Semaine 2 — Construire la confiance opérationnelle
- Utilisez `/observability-designer` pour effectuer une analyse des lacunes de monitoring — qu'est-ce qui est surveillé et qu'est-ce qui ne l'est pas
- Exécutez `/capacity-planner` sur les 2 services principaux — comprenez le modèle de coûts et de scaling
- Configurez un CLAUDE.md avec le contexte de l'infrastructure (comptes, clusters, services clés) pour que Claude ait toujours du contexte

### Semaine 3 — Améliorer le système
- Choisissez le pire runbook (le plus vague, le plus obsolète) et réécrivez-le avec `/oncall-runbook`
- Optimisez un pipeline CI/CD qui cause le plus de problèmes avec `/github-actions`
- Ébauchez ou révisez un module Terraform avec `/terraform`

### Semaine 4 — Prendre possession d'une partie
- Faites votre première astreinte avec les runbooks que vous avez améliorés
- Simulez un exercice de chaos avec `/incident-response` pour tester vos runbooks
- Rédigez votre première prévision de capacité pour le trimestre à venir avec `/capacity-planner`

---

## CLAUDE.md pour les ingénieurs DevOps

Créez un `CLAUDE.md` au niveau du projet pour que Claude dispose du contexte d'infrastructure :

```markdown
# Contexte d'infrastructure

Fournisseur cloud : [AWS / GCP / Azure]
Région principale : [us-east-1 / europe-west1 / etc.]
Région secondaire : [si applicable]

## Services clés
- [nom-service] : [ce qu'il fait, langage, cluster/namespace]
- [nom-service] : [...]

## Clusters Kubernetes
- Production : [nom du cluster, méthode d'accès]
- Staging : [nom du cluster]
- Outils : [nom du cluster — pour l'outillage interne]

## IaC
- Outil : [Terraform / Pulumi / CDK]
- État : [bucket S3 / Terraform Cloud / local]
- Structure des modules : [monorepo / par service / bibliothèque de modules partagés]

## CI/CD
- Plateforme : [GitHub Actions / GitLab CI / CircleCI]
- Méthode de déploiement : [ArgoCD / Helm / kubectl brut / pipelines CDK]
- Environnements : [dev / staging / production — comment sont-ils promus ?]

## Monitoring
- Métriques : [Datadog / Prometheus + Grafana / CloudWatch]
- Logs : [Datadog / ELK / Loki]
- Traces : [Datadog APM / Jaeger / Honeycomb]
- Alerting : [PagerDuty / OpsGenie]

## SLOs
- [service] : [définition du SLO]
- [service] : [...]

## Rotation d'astreinte
- Calendrier : [nom de la rotation PagerDuty]
- Escalade : [nom du responsable technique, Slack, téléphone]
```

---

## Intégrations d'outils

### PagerDuty

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp-server"],
      "env": {
        "PAGERDUTY_API_KEY": "your-key"
      }
    }
  }
}
```

Avec PagerDuty connecté, Claude peut extraire l'historique des incidents pour générer des runbooks, vérifier les calendriers d'astreinte actuels et lister les alertes récentes — sans changer de contexte.

### Datadog

Connectez le MCP Datadog pour que Claude puisse interroger directement les métriques et les logs pendant la réponse aux incidents. Au lieu de copier des tableaux de bord, Claude peut exécuter des requêtes en direct et interpréter les résultats en contexte.

### AWS (via CLI ou MCP)

Configurez les identifiants AWS dans votre environnement. Claude Code peut alors utiliser l'outil Bash pour exécuter des commandes `aws` CLI pour l'état de l'infrastructure en direct — `aws ec2 describe-instances`, `aws cloudwatch get-metric-statistics`, `aws rds describe-db-instances` — en contexte avec votre session d'incident ou de planification de capacité.

### Terraform Cloud

Connectez Terraform Cloud via l'API pour que Claude puisse lire les résultats de plans et l'historique récent des runs. Combinez avec `/terraform` pour des sessions de revue pré-application où Claude voit le plan réel, pas une description.

---

## Métriques à suivre

### Fiabilité

| Métrique | Cible | Signal d'alarme |
|---|---|---|
| Disponibilité du service | Selon le SLO (ex. 99,9%) | Taux de consommation du budget d'erreur > 2x |
| Latence P99 | Selon le SLO (ex. < 500ms) | Dépassement soutenu pendant > 5 minutes |
| MTTR (temps moyen de résolution) | < 30 min pour P1 | > 60 min : lacune de runbooks ou de détection |
| MTTD (temps moyen de détection) | < 5 min pour P1 | > 15 min : lacune d'alerting |
| Fréquence de déploiement | Quotidienne à hebdomadaire | < Mensuelle : goulot d'étranglement de livraison |
| Taux d'échec des changements | < 5% | > 10% : problème de tests ou de revue |

### Coûts d'infrastructure

| Métrique | Cible | Signal |
|---|---|---|
| Croissance des coûts mois sur mois | ≤ croissance du trafic % | Croissance plus rapide : gaspillage |
| Utilisation CPU sur la flotte | 40-70% en moyenne | < 30% : sur-provisionné |
| Couverture des instances réservées | > 60% pour les charges stables | < 40% : paiement excessif à la demande |
| Coût par requête | En baisse au fil du temps | En hausse : problème d'efficacité |

---

## Erreurs DevOps courantes que Claude Code aide à éviter

**Erreur 1 : Des runbooks obsolètes**
`/oncall-runbook` inclut une vérification de fraîcheur — tout runbook non mis à jour depuis 90 jours est signalé. Utilisez le mode audit avant chaque transfert de rotation d'astreinte.

**Erreur 2 : Des surprises de capacité**
`/capacity-planner` construit une prévision sur 12 mois avec des déclencheurs de scaling. Définissez les seuils d'alerte CPU à partir de la prévision, pas en devinant.

**Erreur 3 : Des SLO sans budgets d'erreur**
`/slo-architect` génère la définition complète du SLO, y compris les calculs du budget d'erreur. Ne définissez jamais la disponibilité sans définir ce que vous ferez quand le budget se consomme.

**Erreur 4 : Des postmortems sans résultat actionnable**
`/incident-response` génère des postmortems avec des actions explicitement assignées, des responsables et des dates d'échéance. "Nous améliorerons le monitoring" n'est pas une action.

**Erreur 5 : Des changements Terraform appliqués sans revue**
`/terraform` inclut une analyse des risques et un plan de rollback pour chaque revue de plan. Exécutez-le avant chaque `terraform apply` en production.

---

## Ressources

- [Démarrer avec Claude Code](getting-started.md)
- [Workflow d'incident DevOps](../workflows/devops-incident.md)
- [Compétence On-call Runbook](../skills/devops-infra/oncall-runbook.md)
- [Compétence Capacity Planner](../skills/devops-infra/capacity-planner.md)
- [Compétence SLO Architect](../skills/devops-infra/slo-architect.md)
- [Agent SRE Engineer](../agents/roles/sre-engineer.md)

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous créons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
