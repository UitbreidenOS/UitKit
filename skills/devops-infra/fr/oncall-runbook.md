---
name: oncall-runbook
description: "Générer des runbooks d'astreinte à partir de l'historique des incidents : alertes courantes, étapes de résolution, chemins d'escalade"
---

# Compétence : Générateur de Runbook d'Astreinte

## Quand activer
- Rédiger un runbook pour un nouveau service entrant en production
- Formaliser la connaissance tribale avant qu'un ingénieur quitte la rotation d'astreinte
- Générer des modèles de runbook à partir de rapports d'incidents passés ou de l'historique PagerDuty
- Construire des arbres d'escalade pour une nouvelle équipe ou un nouveau périmètre de service
- Auditer des runbooks existants pour vérifier leur complétude et leur fraîcheur
- Intégrer un nouvel ingénieur dans une rotation d'astreinte

## Quand NE PAS utiliser
- Réponse aux incidents en temps réel — utiliser `/incident-response` à la place
- Conception d'infrastructure — utiliser `/aws-architect`, `/terraform`, ou `/kubernetes`
- Planification de la reprise après sinistre (RPO/RTO, stratégie de sauvegarde) — distincte des runbooks
- Scripts de remédiation automatisée — les runbooks documentent quoi faire ; l'automatisation est un sujet séparé

## Instructions

### Génération principale de runbook à partir de l'historique des incidents

```
Générer un runbook d'astreinte pour le service [NOM DU SERVICE].

Entrée (fournir autant d'éléments que possible) :
- Rapports d'incidents ou post-mortems passés : [coller ou décrire]
- Noms des alertes PagerDuty existantes : [liste]
- Modes de défaillance connus que l'équipe a observés : [décrire]
- Étapes manuelles actuelles utilisées pour résoudre les problèmes courants : [décrire]
- Architecture du service : [brève description — ce qu'il fait, comment il fonctionne, dépendances clés]
- SLO pour ce service : [objectif de disponibilité, objectif de latence]

Produire le runbook avec cette structure :

# Runbook d'Astreinte [NOM DU SERVICE]

## Vue d'ensemble du service (contexte en 60 secondes)
- Ce que ce service fait : [une phrase]
- Qui en dépend : [services amont et aval, clients affectés]
- Stack technologique : [langage, framework, fournisseur cloud, base de données, file de messages]
- SLO : [disponibilité X %, latence p99 < Xms]
- Classification des données : [gère-t-il des PII / paiements / données sensibles ?]
- Équipe propriétaire : [nom de l'équipe, canal Slack, contact d'escalade]

## Diagramme d'architecture (représentation textuelle)
[Dessiner un flux textuel : trafic externe → équilibreur de charge → service → dépendances]

## Catalogue d'alertes
Pour chaque alerte connue :

### ALERTE : [nom de l'alerte depuis PagerDuty/Datadog/etc.]
**Gravité :** [P1 / P2 / P3]
**Signification :** Que vous dit cette alerte ? Quel seuil a été dépassé ?
**Causes courantes (par ordre de fréquence) :**
1. [Cause la plus fréquente — X % des occurrences]
2. [Deuxième plus fréquente]
3. [Cause rare mais grave]
**5 premières étapes :**
1. [Étape — inclure les commandes exactes, pas "vérifier les journaux"]
2. [Étape avec commande : `kubectl logs -n [namespace] -l app=[service] --tail=100`]
3. [Étape]
4. [Étape]
5. [Étape]
**Schémas de résolution :**
- Cause A → faire [action spécifique]
- Cause B → faire [action spécifique]
- Cause C → escalader à [équipe/personne] — ne pas tenter de corriger soi-même
**Escalader si :** [condition signifiant que vous avez besoin d'aide humaine ou d'équipe]
**Temps de résolution typique :** [X-Y minutes]

## Chemins d'escalade

| Gravité | Premier intervenant | Si non résolu après X min | Escalade suivante |
|---|---|---|---|
| P1 | Ingénieur d'astreinte | 15 min | Responsable ingénierie → CTO |
| P2 | Ingénieur d'astreinte | 30 min | Responsable ingénierie |
| P3 | Ingénieur d'astreinte | Prochain jour ouvrable | — |

Liste de contacts :
- Astreinte : [rotation PagerDuty]
- Responsable ingénierie : [nom, téléphone, Slack]
- Propriétaire de la base de données : [nom / équipe, pour les P1 liés à la DB]
- Équipe infrastructure : [canal Slack]
- Équipe sécurité : [si violation de données suspectée — contacter immédiatement]

## Opérations courantes (hors incident)
[Tâches que les ingénieurs d'astreinte peuvent être amenés à effectuer en dehors des incidents :]

### Redémarrer un pod de service
```bash
kubectl rollout restart deployment/[service-name] -n [namespace]
# Vérifier : kubectl rollout status deployment/[service-name] -n [namespace]
```

### Vérifier le taux d'erreur actuel
```bash
# Requête Datadog ou lien vers le tableau de bord Grafana
# Ou : commande kubectl logs
```

### Déclencher manuellement un redéploiement
[Décrire le processus — est-ce une GitHub Action, une synchronisation ArgoCD ou une étape manuelle ?]

## Pièges connus
Choses qui ont déjà piégé des ingénieurs d'astreinte :
- [Piège 1 : ex. "Ne pas redémarrer le consommateur de file pendant les heures de pointe — les jobs en cours seront perdus"]
- [Piège 2 : ex. "L'environnement de staging utilise une base de données partagée — les changements affectent d'autres équipes"]
- [Piège 3]

## Journal des modifications du runbook
| Date | Modification | Auteur |
|---|---|---|
| [DATE] | Création initiale | [Nom] |

Générer ce runbook avec l'historique des incidents et le contexte du service que je fournis.
```

### Modèle de runbook spécifique à une alerte

```
Générer un runbook détaillé pour cette alerte spécifique : [NOM DE L'ALERTE]

Source de l'alerte : [PagerDuty / Datadog / Prometheus / CloudWatch]
Définition de l'alerte : [coller la requête ou le seuil de l'alerte — ex. "error_rate > 5 % pendant 5 minutes"]
Service affecté : [nom du service]
Déclenchement typique : [quand cette alerte se déclenche-t-elle habituellement — pic de trafic, après un déploiement, aléatoire ?]

Incidents passés déclenchés par cette alerte : [coller l'historique des incidents ou décrire les schémas]

Générer un arbre de décision pour cette alerte :

## Runbook [NOM DE L'ALERTE]

### Ce que signifie cette alerte
[En langage clair — pas "le seuil a été dépassé" mais ce que cela signifie pour les utilisateurs]

### Évaluation immédiate de la gravité (2 premières minutes)
Se demander :
- Cette alerte est-elle isolée, ou des alertes corrélées se déclenchent-elles ? (vérifier : [lister les alertes corrélées à vérifier])
- Le taux d'erreur est-il en augmentation, stable ou en récupération ?
- S'agit-il d'un nouveau déploiement dans les 30 dernières minutes ? (vérifier : [emplacement du journal de déploiement])
- L'ai-je déjà vu ? (vérifier : [lien vers l'historique des incidents])

### Arbre de décision

```
ALERTE SE DÉCLENCHE
│
├── Est-ce pendant ou après un déploiement ?
│   OUI → Vérifier les journaux de déploiement → rollback si le nouveau code a introduit l'erreur
│   NON ↓
│
├── Le taux d'erreur est-il > 20 % ?
│   OUI → Alerter immédiatement le responsable ingénierie (P1)
│   NON ↓
│
├── Le taux d'erreur est-il en augmentation ?
│   OUI → Démarrer la réponse P2, escalader dans 15 min si pas d'amélioration
│   STABLE → Investigation P3, résoudre avant le prochain jour ouvrable
│
└── S'agit-il d'un type d'erreur spécifique ?
    TIMEOUT → [étapes pour l'investigation des timeouts]
    5xx → [étapes pour l'investigation des erreurs serveur]
    DB → [étapes pour le problème de base de données]
```

### Investigation étape par étape
[Étapes numérotées avec les commandes exactes et ce qu'il faut chercher à chaque étape]

### Playbook de résolution
[Pour chaque cause courante : étapes de résolution exactes avec commandes]

### Post-résolution
Après résolution : que faut-il faire ?
- Mettre à jour l'incident dans PagerDuty / Slack
- Toute action de suivi (créer un ticket, notifier les parties prenantes, mettre à jour le runbook)
- Post-mortem requis ? [Oui pour P1 / À la discrétion de l'ingénieur d'astreinte pour P2 / Non pour P3]
```

### Audit de runbook

```
Auditer la qualité de ce runbook : [COLLER LE RUNBOOK EXISTANT]

Évaluer chaque section et identifier les lacunes :

CHECKLIST DE COMPLÉTUDE :
✅ Vue d'ensemble du service avec suffisamment de contexte pour un nouvel ingénieur
✅ Toutes les alertes connues documentées (pas seulement les plus critiques)
✅ Chaque alerte a : signification, causes courantes, résolution étape par étape
✅ Les commandes sont exactes (pas "vérifier les journaux" mais `kubectl logs -n X -l app=Y`)
✅ Chemins d'escalade définis avec des noms et contacts réels (pas seulement des fonctions)
✅ Pièges connus et anti-patterns documentés
✅ Opérations courantes documentées (redémarrage, mise à l'échelle, rollback)
✅ Le runbook a été mis à jour dans les 90 derniers jours (les runbooks obsolètes sont dangereux)

SIGNAUX DE QUALITÉ :
❌ "Vérifier le tableau de bord" sans préciser quel tableau de bord ou quoi chercher
❌ Étapes nécessitant des connaissances absentes du runbook
❌ Chemin d'escalade disant "contacter l'équipe" sans canal Slack ni contact
❌ Aucune mention de ce qu'il ne faut PAS faire (souvent la partie la plus importante)
❌ Définitions d'alertes n'expliquant pas pourquoi le seuil est important

VÉRIFICATION DE FRAÎCHEUR :
Quand ce runbook a-t-il été mis à jour pour la dernière fois ? Si > 90 jours : signaler chaque procédure pour vérification de l'exactitude.
Fait-il référence à des services, équipes ou outils qui ont peut-être changé ?

Résultat : score du runbook (1-10), les 5 principales lacunes à corriger, et une réécriture de la section la plus faible.
```

### Runbook à partir d'un post-mortem

```
Générer une section de runbook à partir de ce post-mortem : [COLLER LE POST-MORTEM]

Extraire :
1. La cause racine de l'incident
2. La méthode de détection (comment a-t-il été découvert ? alerte, signalement client, ingénieur l'a remarqué ?)
3. La chronologie de la résolution (quelles étapes ont été suivies, dans quel ordre)
4. Ce qui a fonctionné et ce qui n'a pas fonctionné
5. Les actions de suivi qui ont été réalisées (pour éviter les doublons)

Convertir cela en :
- Une nouvelle entrée d'alerte dans le runbook (si l'alerte n'existait pas ou était peu claire)
- Ou : une nouvelle section dans "Pièges connus" si c'était une surprise qui se reproduit
- Les commandes exactes utilisées lors de la résolution, avec des commentaires expliquant pourquoi

Si le post-mortem a identifié une lacune de surveillance : rédiger également la définition de l'alerte.
```

### Guide d'intégration à l'astreinte

```
Générer un guide d'intégration à l'astreinte pour un nouvel ingénieur rejoignant la rotation [SERVICE].

Son profil : [ingénieur senior / intermédiaire / nouveau sur cette base de code]
Il rejoint pour : [première astreinte solo / premier accompagnement / première semaine]
Planning de rotation : [une semaine sur / une semaine hors / suivi du soleil]

Générer un guide d'intégration structuré :

## Avant votre première semaine d'astreinte

Jour 1 :
- Lire le runbook complet — signaler tout ce qui n'est pas clair
- Passer 30 minutes à lire les 5 derniers post-mortems d'incidents
- Configurer PagerDuty, Datadog/Grafana et les notifications Slack
- Confirmer l'accès à : [lister tous les systèmes nécessaires — console cloud, Kubernetes, lecture de base de données, etc.]

Jours 2-3 :
- Accompagner un ingénieur d'astreinte plus expérimenté pendant un shift complet
- Reproduire les 2 incidents les plus fréquents en staging (cela développe la mémoire musculaire)
- Savoir où trouver : [emplacements des journaux, tableaux de bord, historique des déploiements, processus de rollback]

Avant de passer solo :
- Parcourir chaque alerte du runbook avec un ingénieur senior : "Que feriez-vous en premier ?"
- Connaître les chemins d'escalade par cœur : qui appelez-vous à 3h du matin pour un P1 ?
- Tester vos notifications PagerDuty — vous appeler réellement

## Que faire lors de votre premier shift solo
- 10 premières minutes : vérifier le tableau de bord, confirmer que tous les services sont sains
- Si une alerte se déclenche : le runbook d'abord, panique jamais
- Dans le doute : escalader. Il vaut toujours mieux réveiller quelqu'un et avoir tort que de ne pas le réveiller et avoir raison.
```

## Exemple

**Utilisateur :** Nous avons un service API Node.js appelé `billing-service`. Il a eu 3 incidents au cours des 6 derniers mois : (1) épuisement du pool de connexions Redis causant des 503, (2) une requête PostgreSQL lente bloquant toutes les écritures, (3) une fuite mémoire après un déploiement ayant causé des kill OOM. Aucun runbook formel n'existe. Les alertes PagerDuty sont : `billing-service-503-rate-high`, `billing-service-latency-p99-high`, `billing-service-pod-oom`.

**Résultat (extrait) :**

```markdown
# Runbook d'Astreinte billing-service

## Vue d'ensemble du service
billing-service est l'API Node.js qui gère tous les traitements de paiements et la génération de factures.
En aval : tableau de bord client, service email, livraison de webhooks.
SLO : disponibilité 99,9 %, p99 < 500ms.
Propriétaire : #platform-eng | Astreinte : rotation PagerDuty "billing-oncall"

## Alerte : billing-service-503-rate-high
**Gravité :** P1
**Signification :** Plus de 1 % des requêtes retournent 503 — les clients ne peuvent pas traiter les paiements.

**Causes courantes :**
1. Épuisement du pool de connexions Redis (observé 2x — se produit à fort trafic ou après une fuite de connexions)
2. Timeout d'une dépendance amont (passerelle de paiement ou base de données)
3. Échec de déploiement (nouveaux pods non sains)

**5 premières étapes :**
1. `kubectl get pods -n billing -l app=billing-service` — les pods sont-ils Running ?
2. `kubectl logs -n billing -l app=billing-service --tail=200 | grep -i "redis\|connection\|error"` — chercher les erreurs Redis
3. Vérifier le nombre de connexions Redis : `redis-cli -h [host] info clients` — `connected_clients` est-il proche de `maxclients` ?
4. Si Redis : `kubectl rollout restart deployment/billing-service -n billing` (vide le pool de connexions)
5. Si les pods ne sont pas Running : vérifier le déploiement récent — `kubectl rollout history deployment/billing-service -n billing`

**PIÈGE CONNU :** Ne PAS redémarrer billing-service pendant une fenêtre de traitement de paiements (vendredi 17h - samedi 2h) — les transactions en cours seront orphelines. Vérifier avec le responsable ingénierie avant le redémarrage.

**Escalader si :** taux de 503 > 5 %, ou pas de résolution dans les 10 minutes suivant le redémarrage Redis.
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
