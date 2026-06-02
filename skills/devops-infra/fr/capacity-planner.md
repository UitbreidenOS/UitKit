---
name: capacity-planner
description: "Planification de la capacité d'infrastructure : prévoir les besoins en ressources, les projections de coûts, les recommandations de mise à l'échelle"
---

# Compétence : Planificateur de Capacité d'Infrastructure

## Quand activer
- Planifier l'infrastructure en amont d'un lancement de produit ou d'un pic de trafic
- Prévoir les coûts cloud pour le prochain trimestre ou exercice fiscal
- Décider quand mettre à l'échelle horizontalement ou verticalement un service
- Évaluer s'il faut réserver des instances ou utiliser la tarification à la demande
- Préparer un budget d'infrastructure pour une conversation de levée de fonds
- Recalibrer des ressources sur-provisionnées pour réduire les dépenses cloud
- Planifier la capacité de base de données en amont de la croissance des données

## Quand NE PAS utiliser
- Décisions de mise à l'échelle lors d'un incident en temps réel — utiliser `/incident-response`
- Refonte d'architecture — utiliser `/aws-architect`, `/gcp-architect`, ou `/azure-architect`
- Définition des SLO et budget d'erreur — utiliser `/slo-architect`
- Optimisation des coûts existants (recalibrage, instances réservées) sans contexte de planification — utiliser un outil dédié aux coûts

## Instructions

### Invite principale de planification de capacité

```
Construire un plan de capacité pour [SERVICE ou SYSTÈME] pour les [3 / 6 / 12] prochains mois.

État actuel :
- Service : [ce qu'il fait]
- Trafic : [requêtes/jour ou RPS actuels]
- Infrastructure : [calcul actuel — ex. 3x t3.medium EC2, 2 pods Kubernetes, etc.]
- Base de données : [type, taille d'instance, stockage actuellement utilisé]
- Coût cloud mensuel actuel : [X$]
- Utilisation actuelle : [CPU : X %, Mémoire : X %, Connexions DB : X sur Y]

Hypothèses de croissance :
- Croissance de trafic attendue : [X % par mois / stable / pic lié à un événement spécifique]
- Croissance des données attendue : [Go/mois stockés en base de données ou stockage objet]
- Lancements de produits planifiés : [tout événement qui causera des pics soudains]

Contraintes :
- SLO : [objectif de disponibilité, SLO de latence]
- Plafond budgétaire : [X$/mois max]
- Fournisseur cloud : [AWS / GCP / Azure]
- Engagements existants : [instances réservées ou plans d'économies déjà achetés]

Produire :

## 1. Prévision de capacité
Besoins en ressources projetés à : [3 mois / 6 mois / 12 mois]
- Calcul : actuel vs. nécessaire
- Mémoire : actuelle vs. nécessaire
- Base de données : croissance du stockage et des IOPS
- Bande passante / coûts de transfert de données
- Impact de la couche CDN ou de cache

## 2. Seuils de déclenchement de la mise à l'échelle
À quel seuil de métrique devons-nous mettre à l'échelle ?
- CPU > X % maintenu pendant Y minutes → scale out de Z répliques
- Mémoire > X % → mise à l'échelle verticale vers le niveau suivant ou ajout de swap
- Connexions DB > X % du maximum → envisager le pooling de connexions (PgBouncer) ou un réplica de lecture

## 3. Projection des coûts
| Mois | Calcul | Base de données | Stockage | Bande passante | Total |
|---|---|---|---|---|---|
| Maintenant | X$ | X$ | X$ | X$ | X$ |
| +3 mois | X$ | X$ | X$ | X$ | X$ |
| +6 mois | X$ | X$ | X$ | X$ | X$ |
| +12 mois | X$ | X$ | X$ | X$ | X$ |

## 4. Recommandations de mise à l'échelle
Actions concrètes dans l'ordre :
1. [Quoi faire maintenant — action immédiate]
2. [Quoi faire dans 30-60 jours]
3. [Quoi planifier à 6 mois]

## 5. Opportunités d'optimisation des coûts
Économies disponibles sans réduire la capacité :
- Instances réservées / plans d'économies : X$/mois économisés si achetés maintenant
- Recalibrage : [instances spécifiques sur-provisionnées]
- Hiérarchisation du stockage : [données pouvant migrer vers un stockage moins cher]
- Mise en cache : [ce qui peut être mis en cache pour réduire la charge DB et le coût calcul]
```

### Modèle de mise à l'échelle basé sur le trafic

```
Construire un modèle de mise à l'échelle pour [SERVICE] basé sur les schémas de trafic.

Données de trafic actuelles :
- RPS moyen (requêtes par seconde) : [X]
- RPS maximum (le plus élevé observé) : [X]
- Schéma de trafic quotidien : [stable / pic matinal / pic vespéral / en rafale]
- Schéma hebdomadaire : [forte semaine / fort week-end / stable]

Caractéristiques du service :
- Latence moyenne des requêtes : [Xms à la charge actuelle]
- CPU par requête (approximatif) : [X % par pod par 100 RPS]
- Mémoire par requête : [X Mo de working set par pod]
- Sans état ou avec état : [sans état = facile à mettre à l'échelle horizontalement]

Sortie du modèle de mise à l'échelle :

Pour chaque niveau de RPS :
| RPS | Pods nécessaires | Marge CPU | Latence estimée | Coût/mois |
|---|---|---|---|---|
| [Actuel : X] | [Y pods] | [X % de marge] | [Xms] | X$ |
| [Croissance 2x] | | | | |
| [Croissance 5x] | | | | |
| [Croissance 10x] | | | | |

Règles de mise à l'échelle horizontale :
- Scale out quand : CPU > [X] % pendant [Y] minutes OU RPS > [Z]
- Scale in quand : CPU < [X] % pendant [Y] minutes ET RPS < [Z]
- Pods minimum : [N] (pour la disponibilité pendant les événements de mise à l'échelle)
- Pods maximum : [N] (plafond de coût ou limite de compte)

Configuration HPA (Horizontal Pod Autoscaler) pour Kubernetes :
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: [service-name]
  namespace: [namespace]
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: [service-name]
  minReplicas: [N]
  maxReplicas: [N]
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

Générer le modèle de mise à l'échelle pour mon service.
```

### Planification de la capacité de base de données

```
Planifier la capacité de base de données pour [SERVICE] sur [N] mois.

État actuel :
- Base de données : [PostgreSQL / MySQL / MongoDB / DynamoDB / etc.]
- Instance : [type d'instance actuel et taille]
- Stockage : [utilisé actuellement / total provisionné]
- Connexions : [connexions actives actuelles / connexions max]
- Tables les plus volumineuses : [nom : X Go, nom : Y Go]
- Schémas de requêtes : [lecture dominante 80/20 / écriture dominante / équilibré]
- Rétention des sauvegardes : [X jours]

Données d'entrée de croissance :
- Nouvelles données par jour : [X Go / X lignes dans la table principale]
- Taux de croissance mensuel : [X %]
- Migrations de données ou changements de schéma planifiés : [décrire]

Sortie du plan de capacité de base de données :

## Prévision de stockage
| Mois | Taille des données | Taille des index | Total | Coût de stockage |
|---|---|---|---|---|
| Maintenant | X Go | X Go | X Go | X$ |
| +3 mois | | | | |
| +6 mois | | | | |
| +12 mois | | | | |

Seuils d'alerte de stockage :
- Ambre : stockage > 70 % plein → planifier la mise à niveau
- Rouge : stockage > 85 % plein → mise à niveau dans la semaine

## Capacité de connexions
Connexions max actuelles pour [type d'instance] : [N]
Utilisation actuelle : [X connexions, X % du max]
Recommandation de pool de connexions :

Si PgBouncer ou RDS Proxy est utilisé :
- Taille du pool par instance d'application : [N]
- Clients max : [N]
- Mode de pool : [transaction / session — transaction recommandé pour les API sans état]

## Déclencheur de mise à niveau d'instance
Mettre à niveau l'instance quand :
- CPU moyen > 70 % pendant > 30 minutes par jour
- Stockage libre < 20 % du total
- IOPS de lecture > 80 % des IOPS provisionnées de façon soutenue
- Latence P99 des requêtes > [X]ms pour le top 10 des requêtes

Prochain niveau d'instance : [actuel] → [prochain recommandé] à [X mois]
Delta de coût : X$/mois supplémentaire

## Considération de réplica de lecture
Ajouter un réplica de lecture quand :
- Ratio lecture:écriture > 5:1
- Les requêtes de reporting/analytique impactent les performances du primaire
- Le CPU du primaire est conduit par les lectures, pas les écritures

Coût du réplica de lecture : X$/mois (même type d'instance que le primaire)
Routage des connexions : [décrire comment router les lectures vs. écritures dans le code applicatif]
```

### Plan de capacité pour un lancement

```
Construire un plan de capacité pour le lancement de [PRODUIT / FONCTIONNALITÉ / ÉVÉNEMENT].

Détails du lancement :
- Ce qui est lancé : [décrire]
- Date de lancement prévue : [DATE]
- Scénario de trafic (choisir un ou modéliser les trois) :
  - Conservateur : [X % d'augmentation du trafic actuel]
  - Cas de base : [X utilisateurs dans les 48 premières heures]
  - Optimiste : [X utilisateurs, mis en avant dans [médias / App Store / Product Hunt]]

Infrastructure actuelle :
- Calcul : [décrire]
- Base de données : [décrire]
- CDN / cache : [décrire]
- Capacité actuelle : [quel est le RPS maximum que le système peut gérer aujourd'hui ?]

Sortie du plan de lancement :

## Checklist pré-lancement (infrastructure)
- [ ] Test de charge à [2x / 5x / 10x] le trafic de pointe attendu — documenter les résultats
- [ ] Confirmer que la mise à l'échelle automatique est configurée et testée
- [ ] Plan de préchauffage du cache pour les assets statiques et les requêtes fréquentes
- [ ] Pool de connexions de base de données dimensionné pour les connexions de pointe
- [ ] Règles de cache CDN revues pour les nouvelles pages/assets
- [ ] Tableaux de bord de surveillance configurés pour le jour du lancement
- [ ] Ingénieur d'astreinte identifié et briefé sur le runbook
- [ ] Plan de rollback documenté et testé

## Scénarios de trafic et besoins en infrastructure
| Scénario | RPS de pointe | Pods nécessaires | Connexions DB | Action requise |
|---|---|---|---|---|
| Conservateur | X | N | X | [aucun changement / ajustement mineur] |
| Cas de base | X | N | X | [pré-scaler à N pods] |
| Optimiste | X | N | X | [mise à l'échelle verticale temporaire + préchauffage] |

## Procédure du jour du lancement
T-24h : pré-scaler le calcul à [N] pods (ne pas attendre l'auto-scaleur)
T-4h : préchauffer le cache CDN pour toutes les nouvelles pages
T-0 : poster dans #engineering et taguer l'astreinte avec le lien du tableau de bord de lancement
T+1h : vérifier les taux d'erreur, la latence, les connexions DB — comparer au référentiel
T+24h : revoir le trafic réel vs. prévision, redimensionner si sur-provisionné

## Coût pour la période de lancement
Coût supplémentaire pour [7 jours d'infrastructure pré-scalée] : X$
Retour au provisionnement normal après : [DATE] si le trafic se stabilise en dessous de [X] RPS
```

### Analyse d'optimisation des coûts cloud

```
Analyser mes coûts cloud et trouver des opportunités d'économies.

Facture mensuelle actuelle : [X$ total]
Ventilation :
- Calcul (EC2 / nœuds GKE / Cloud Run) : X$
- Base de données (RDS / Cloud SQL / Firestore) : X$
- Stockage (S3 / GCS / Azure Blob) : X$
- Transfert de données / CDN : X$
- Autre (Lambda, SQS, surveillance, etc.) : X$

Inventaire d'infrastructure :
- Instances/nœuds : [liste avec tailles et utilisation moyenne]
- Bases de données : [liste avec tailles et utilisation moyenne]
- Buckets de stockage : [total stocké, schémas d'accès]
- Instances réservées ou plans d'économies déjà en place : [liste]

Analyser par catégorie :

RECALIBRAGE DU CALCUL :
- Instances avec CPU moyen < 20 % : candidates au downgrade
- Utilisation de la mémoire : instances sur-provisionnées
- Économies estimées du recalibrage : X$/mois

INSTANCES RÉSERVÉES / PLANS D'ÉCONOMIES :
- Analyse du seuil de rentabilité : si nous nous engageons sur [N]x [type d'instance] pour 1 an, nous économisons X$ vs. à la demande
- Recommandation : quelles instances réserver maintenant vs. garder à la demande

RÉDUCTION DES COÛTS DE STOCKAGE :
- S3 Intelligent Tiering pour les données peu fréquemment accédées
- Politique de rétention des journaux : réduire de [N] à [M] jours → économiser X$/mois
- Identifier les volumes EBS orphelins ou les snapshots : [source de gaspillage courante]

OPTIMISATION DES BASES DE DONNÉES :
- Multi-AZ vs. mono-AZ pour dev/staging : économiser X$/mois
- Aurora Serverless pour les charges de travail variables : seuil de rentabilité à [X heures/jour d'utilisation]
- Réplicas de lecture pouvant être supprimés ou réduits

Produire : liste classée des opportunités d'économies par impact dollar mensuel, avec effort de mise en œuvre (faible / moyen / élevé).
```

## Exemple

**Utilisateur :** Nous planifions de rendre un outil open source et prévoyons qu'il sera mis en avant sur Product Hunt le mois prochain. Actuellement nous avons 2 instances t3.medium EC2 derrière un ALB, servant 500 RPS à 45 % de CPU. Nous attendons un pic de trafic de 5-10x le jour du lancement. La facture mensuelle est de 220 $.

**Résultat (extrait) :**

```markdown
# Plan de Capacité : Lancement Product Hunt

## Référentiel actuel
2x t3.medium (2 vCPU, 4 Go RAM) — 500 RPS à 45 % de CPU.
Capacité max estimée : ~1 100 RPS avant saturation du CPU.

## Scénarios de trafic
| Scénario | RPS de pointe | Instances requises | Marge |
|---|---|---|---|
| Conservateur (5x) | 2 500 | 5x t3.medium | 20 % |
| Cas de base (7x) | 3 500 | 7x t3.medium | 10 % |
| Optimiste (10x+) | 5 000+ | 10x t3.medium ou 5x t3.large | 15 % |

## Actions pré-lancement (par priorité)

**Maintenant (aujourd'hui) :**
- Activer EC2 Auto Scaling avec min=2, max=12, scale-out à CPU>60 % pendant 3 minutes
- Définir le cooldown de scale-in à 15 minutes (évite l'oscillation après le pic)
- Vérifier que le health check ALB est correctement configuré et répond en < 2s

**T-48h avant le lancement :**
- Pré-scaler manuellement à 6 instances (ne pas compter sur l'auto-scaleur pendant le pic — il prend 3-5 minutes)
- Exécuter un test de charge à 3 500 RPS avec k6 ou Locust — confirmer que la latence reste < 200ms

**T-4h :**
- Préchauffer le cache CloudFront pour tous les assets statiques des nouvelles pages
- Si du contenu alimenté par la base de données est servi : revoir les en-têtes cache-control

**Coût du jour du lancement :**
7 jours de 6x t3.medium pré-scalées : ~90 $ supplémentaires
Si vous atteignez 10x et scalez à 10 instances : ~150 $ supplémentaires pour la semaine
Recommandation : pré-scaler, surveiller, réduire après 48-72h quand le trafic se normalise.

**À surveiller le jour du lancement :**
- RequestCount ALB (pas seulement le RPS au niveau de votre app — ALB est l'indicateur avancé)
- Nombre d'hôtes sains dans le groupe cible (devrait rester à N pré-scalées tout au long)
- Connexions DB — une t3.medium peut gérer ~50 connexions chacune ; à 10 instances, c'est 500 connexions
- Si RDS est utilisé : surveiller les métriques FreeableMemory et DatabaseConnections
```

---

> **Travaillez avec nous :** Claudient est soutenu par [Uitbreiden](https://uitbreiden.com/) — nous construisons des produits IA et des solutions B2B avec des communautés de développeurs.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
