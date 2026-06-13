# Ingénierie de Plateforme

## Quand activer
Construction de plateformes de développeurs internes (IDPs), création de modèles de service au chemin doré qui encodent les normes organisationnelles, mise en place de catalogue de services Backstage ou modèles de scaffolder, conception de provisionnement d'infrastructure en self-service, création d'abstractions Kubernetes pour réduire la charge cognitive des développeurs, ou amélioration des métriques DORA en standardisant comment les équipes déploient les logiciels.

## Quand ne pas utiliser
Travaux d'infrastructure ponctuels pour une seule équipe (utilisez simplement Terraform directement). Administration générale du cluster Kubernetes non orientée vers l'amélioration de l'expérience du développeur. Travail de fonctionnalités dans un service de produit — l'ingénierie de plateforme concerne le système que les équipes utilisent pour construire et déployer les logiciels, pas le logiciel lui-même. Évitez de construire la plateforme avant d'avoir des points de friction — la platformisation prématurée crée une surcharge sans bénéfice.

## Instructions

### Le Principe du Chemin Doré

Un chemin doré est un modèle de service opiné, entièrement intégré, qui pré-câble tout ce qu'une équipe a besoin pour aller de « nouveau service » à « en production » sans prendre de décisions architecturales. L'équipe plateforme possède le chemin ; les équipes produit le suivent ou optent explicitement pour s'en écarter avec justification documentée.

Un chemin doré complet inclut :
- `Dockerfile` — multi-étape, utilisateur non-root, health check
- Manifestes Kubernetes — `Deployment`, `Service`, `HPA`, `PDB`, `NetworkPolicy`
- Flux de travail CI GitHub Actions — lint, test, build, push, deploy
- Observabilité — endpoint de métriques Prometheus, logs JSON structurés, tableau de bord Grafana pré-construit, alertes par défaut
- Entrée catalogue Backstage — `catalog-info.yaml` pré-rempli
- Filage secrets de service — manifestes external-secrets operator pointant vers Vault/AWS Secrets Manager
- Échafaudage README — modèle ADR (Architecture Decision Record)

### Entrée Catalogue Backstage

Chaque service doit avoir un `catalog-info.yaml` commité à sa racine :

```yaml
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: payment-service
  title: Payment Service
  description: Handles checkout, refunds, and subscription billing
  annotations:
    github.com/project-slug: acme/payment-service
    backstage.io/techdocs-ref: dir:.
    prometheus.io/scrape: "true"
    grafana/dashboard-selector: "payment-service"
  tags:
    - python
    - fastapi
    - payments
  links:
    - url: https://grafana.internal/d/payment-service
      title: Grafana Dashboard
    - url: https://runbook.internal/payment-service
      title: Runbook
spec:
  type: service
  lifecycle: production
  owner: team-payments
  system: checkout
  dependsOn:
    - component:order-service
    - resource:payments-postgres
  providesApis:
    - payment-api
```

### Modèle Scaffolder Backstage

Les modèles Scaffolder sont le point d'entrée du chemin doré — ils génèrent un nouveau dépôt avec tous les fichiers pré-câblés :

```yaml
# backstage/templates/python-service/template.yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: python-microservice
  title: Python Microservice
  description: FastAPI service with CI, k8s manifests, observability pre-wired
spec:
  owner: platform-team
  type: service
  parameters:
    - title: Service Details
      required: [name, owner, description]
      properties:
        name:
          type: string
          pattern: '^[a-z][a-z0-9-]*$'
        owner:
          type: string
          ui:field: OwnerPicker
        description:
          type: string

  steps:
    - id: fetch
      name: Fetch template
      action: fetch:template
      input:
        url: ./skeleton
        values:
          name: ${{ parameters.name }}
          owner: ${{ parameters.owner }}

    - id: publish
      name: Create GitHub repo
      action: publish:github
      input:
        repoUrl: github.com?owner=acme&repo=${{ parameters.name }}
        defaultBranch: main

    - id: catalog
      name: Register in catalog
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps.publish.output.repoContentsUrl }}
        catalogInfoPath: /catalog-info.yaml
```

### Abstraction CRD Kubernetes

Exposez un CRD `WebService` de haut niveau qui génère toutes les ressources de niveau inférieur — les équipes décrivent l'intention, pas l'implémentation :

```yaml
# What a team writes
apiVersion: platform.acme.io/v1
kind: WebService
metadata:
  name: payment-service
  namespace: payments
spec:
  image: acme/payment-service:v1.4.0
  port: 8080
  replicas:
    min: 2
    max: 10
    targetCPU: 70
  resources:
    cpu: "500m"
    memory: "512Mi"
  env:
    - name: DATABASE_URL
      secretRef: payments-postgres-url
```

L'opérateur plateforme génère : `Deployment` + `Service` + `HPA` + `PDB` (minAvailable=1) + `ServiceMonitor` + `NetworkPolicy`. L'équipe n'écrit jamais directement aucun de ces.

Implémentez avec [Operator SDK](https://sdk.operatorframework.io/) ou un simple post-renderer Helm si un opérateur complet est trop lourd pour l'étape actuelle.

### Modules Terraform avec Défauts Sensés

Les modules plateforme n'exposent que les variables que les équipes produit devraient faire varier ; tout le reste est configuré par défaut selon les normes organisationnelles :

```hcl
# modules/rds/main.tf
variable "name"            { type = string }
variable "instance_class"  { type = string; default = "db.t4g.medium" }
variable "storage_gb"      { type = number; default = 20 }
variable "env"             { type = string }

resource "aws_db_instance" "this" {
  identifier            = var.name
  instance_class        = var.instance_class
  allocated_storage     = var.storage_gb
  engine                = "postgres"
  engine_version        = "16.2"
  multi_az              = var.env == "prod"      # auto HA in prod
  deletion_protection   = var.env == "prod"      # prevent accidental drops
  backup_retention_period = var.env == "prod" ? 7 : 1
  storage_encrypted     = true                   # always
  parameter_group_name  = aws_db_parameter_group.pg16_performance.name
  # ... monitoring, enhanced insights, etc. always on
}
```

Les équipes ne peuvent pas refuser le chiffrement ou la surveillance — ce ne sont pas des variables.

### Contrat de Plateforme

Documentez ce que la plateforme garantit par rapport à ce que les équipes possèdent. L'ambiguïté ici cause le plus de friction :

| Garanties de Plateforme | Équipe Possède |
|---|---|
| Correction des images de base (hebdomadaire) | Logique métier |
| SLA de disponibilité du cluster (99,9%) | Migrations de schéma de données |
| Agrégation centralisée des logs | Gestion des erreurs au niveau de l'application |
| Rotation des secrets au niveau de l'infrastructure | Contrats et versionnement des API |
| HPA + autoscaling des nœuds | SLOs au niveau du service |
| Terminaison TLS d'Ingress | Feature flags et logique A/B |

Publiez ce contrat dans Backstage TechDocs afin que les équipes sachent quoi escalader à l'équipe plateforme par rapport à ce qu'elles réparent elles-mêmes.

### Métriques DORA comme KPIs de Santé de Plateforme

L'investissement en plateforme devrait faire bouger les métriques DORA. Suivez-les au niveau organisationnel :

```
Deployment Frequency     → how often teams ship to prod
Lead Time for Changes    → commit to prod elapsed time
Change Failure Rate      → % of deploys causing incidents
Mean Time to Restore     → how fast from incident to recovery
```

Un délai de 3 jours avec un taux d'échec de changement de 5% est un signe que le CI du chemin doré ou le processus de déploiement a trop de friction ou de tests insuffisants. Surfacez ces métriques dans la page d'accueil Backstage afin que chaque équipe voie ses propres chiffres.

## Exemple

Concevez un modèle de chemin doré pour un nouveau microservice Python :

1. Le modèle Scaffolder dans Backstage génère un nouveau dépôt GitHub avec : `Dockerfile` (multi-étape, non-root, healthcheck), skeleton d'application FastAPI, répertoire `k8s/` avec manifeste CRD `WebService`, flux de travail GitHub Actions (ruff lint → pytest → docker build → push vers ECR → kubectl apply).
2. L'opérateur Kubernetes de plateforme réconcilie les CRDs `WebService` et crée `Deployment` + `Service` + `HPA` (min 2, max 10, target CPU 70%) + `PDB` (minAvailable 1) + `ServiceMonitor` pour Prometheus.
3. Un modèle de tableau de bord Grafana pré-câblé est provisionné automatiquement à partir de `ServiceMonitor` — affiche le taux de requêtes, taux d'erreur, latence p99, nombre de réplicas.
4. `catalog-info.yaml` est commité à la racine du dépôt et auto-enregistré dans Backstage à la création du dépôt.
5. Une équipe crée un nouveau service en cliquant sur « Créer » dans Backstage, en remplissant le nom et le propriétaire — elle fonctionne en production dans les 30 minutes sans toucher à aucun code d'infrastructure.

---
