---
name: gcp-architect
description: "Conception d'architecture GCP : Cloud Run, GKE Autopilot, Cloud Functions, BigQuery, modèles Terraform IaC, optimisation des coûts, IAM et patterns de pipeline de données"
---

# Compétence GCP Architect

## Quand activer
- Concevoir une nouvelle architecture GCP à partir de zéro
- Choisir entre les services GCP (Cloud Run vs GKE, Firestore vs Cloud SQL, Pub/Sub vs Cloud Tasks)
- Générer des modèles Terraform pour les ressources GCP
- Optimiser les coûts GCP (remises d'engagement, redimensionnement)
- Construire une pipeline de données sur GCP (Pub/Sub → Dataflow → BigQuery)
- Configurer le moindre privilège IAM pour les charges de travail GCP

## Quand NE PAS utiliser
- Architecture spécifique à AWS — utiliser la compétence aws-architect
- Architecture spécifique à Azure — utiliser la compétence azure-architect
- Patterns Kubernetes non spécifiques à GCP — utiliser la compétence kubernetes

## Instructions

### Sélection du pattern d'architecture

```
Sélectionner le pattern d'architecture GCP approprié pour [application].

Type d'application : [application web / API / event-driven / pipeline de données / charge de travail ML]
Échelle : [utilisateurs/jour, requêtes/seconde, volume de données]
Expérience GCP de l'équipe : [débutant / intermédiaire / avancé]
Budget : $[X]/mois cible
Résidence des données : [UE / US / APAC / aucune contrainte]

Guide du pattern GCP :

CLOUD RUN (recommandé pour : APIs, applications web, charges de travail conteneurisées) :
Stack : Cloud CDN + Cloud Run + Cloud SQL / Firestore + Secret Manager
Coût : ~$0-50/mois pour petites charges de travail (facturation à la requête, échelle à zéro)
Avantages : entièrement géré, aucune opération de cluster, échelle à zéro, déploiement rapide (conteneur vers URL en minutes)
Inconvénients : sans état uniquement ; timeout de requête max 60 min ; démarrages à froid si min-instances=0
Meilleur pour : APIs REST, backends web, microservices ; équipes voulant zéro opération K8s

GKE AUTOPILOT (recommandé pour : microservices complexes, équipes K8s existantes) :
Stack : Cloud Armor + GKE Autopilot + Cloud SQL + Memorystore + Artifact Registry
Coût : ~$100-500/mois (nœuds provisionnés à la demande par pod)
Avantages : nœuds gérés par Google, auto-scaling, pas de gestion de pool de nœuds
Inconvénients : certaines contraintes vs GKE standard ; coût plus élevé que Cloud Run pour charges simples
Meilleur pour : équipes avec expertise K8s, charges de travail stateful, exigences de réseau complexes

CLOUD FUNCTIONS (recommandé pour : déclencheurs d'événements, automatisation légère) :
Stack : Pub/Sub → Cloud Functions → Firestore / Cloud SQL
Coût : ~$0-20/mois pour volume modéré (facturation à l'invocation)
Meilleur pour : flux de travail déclenchés, webhooks, tâches programmées ; plus simple que Cloud Run

PIPELINE DE DONNÉES :
Stack : Pub/Sub → Dataflow → BigQuery → Looker Studio
Ou pour batch : Cloud Storage → Dataproc → BigQuery
Meilleur pour : analytique en streaming, ETL, entreposage de données, ingénierie de features ML

Recommander le pattern pour mon application avec estimation de coût et démarrage Terraform.
```

### Terraform pour GCP

```
Générer la configuration Terraform pour [pattern GCP].

Pattern : [API Cloud Run / service GKE / pipeline BigQuery]
ID du projet : [your-gcp-project-id]
Région : [europe-west1 / us-central1 / etc.]

Service Cloud Run (Terraform) :
terraform {
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" { type = string }
variable "region"     { default = "europe-west1" }
variable "app_name"   { type = string }

# Service Cloud Run
resource "google_cloud_run_v2_service" "app" {
  name     = var.app_name
  location = var.region

  template {
    scaling { min_instance_count = 0, max_instance_count = 10 }

    containers {
      image = "gcr.io/${var.project_id}/${var.app_name}:latest"

      resources {
        limits = { cpu = "1", memory = "512Mi" }
      }

      env {
        name = "DB_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_url.secret_id
            version = "latest"
          }
        }
      }
    }

    service_account = google_service_account.app.email
  }

  lifecycle { ignore_changes = [template[0].containers[0].image] }
}

# IAM — autoriser non authentifiés (public) ou restreindre à interne :
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"  # Supprimer pour interne uniquement
}

# Compte de service avec moindre privilège
resource "google_service_account" "app" {
  account_id   = "${var.app_name}-sa"
  display_name = "${var.app_name} service account"
}

# Secret Secret Manager
resource "google_secret_manager_secret" "db_url" {
  secret_id = "${var.app_name}-db-url"
  replication { auto {} }
}

# Accorder au compte de service l'accès au secret
resource "google_secret_manager_secret_iam_member" "app_secret_access" {
  secret_id = google_secret_manager_secret.db_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app.email}"
}

output "cloud_run_url" { value = google_cloud_run_v2_service.app.uri }

Générer la configuration Terraform pour mon pattern spécifique avec durcissement de la sécurité.
```

### Moindre privilège IAM

```
Concevoir IAM GCP pour [charge de travail].

Charge de travail : [service Cloud Run / pod GKE / Cloud Function / développeur / CI/CD]
Services accédés : [BigQuery / Cloud SQL / Pub/Sub / Cloud Storage / Secret Manager]
Opérations : [lecture seule / lecture-écriture / administrateur]

Principes GCP IAM :
1. Utiliser les comptes de service, jamais les credentials utilisateur pour les charges automatisées
2. Accorder au niveau des ressources, pas au niveau du projet si possible
3. Utiliser les rôles prédéfinis (roles/storage.objectViewer) avant les rôles personnalisés
4. Workload Identity pour GKE (pas de fichiers JSON key dans les pods)

Compte de service Cloud Run (lecture BigQuery + lecture Secret Manager) :
# Via Terraform (préféré) ou gcloud :
gcloud iam service-accounts create myapp-sa \
  --display-name="MyApp Service Account"

# Accorder BigQuery Data Viewer (lire les tables, pas d'admin)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

# Accorder Secret Manager accessor (lire les secrets, pas de gestion)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Cloud Run : assigner le compte de service
gcloud run services update SERVICE_NAME \
  --service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

GKE Workload Identity (pas de fichiers key) :
# Lier le compte de service K8s au compte de service GCP
gcloud iam service-accounts add-iam-policy-binding \
  myapp-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:PROJECT_ID.svc.id.goog[NAMESPACE/KSA_NAME]"

# Annoter le compte de service K8s
kubectl annotate serviceaccount KSA_NAME \
  iam.gke.io/gcp-service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

Générer la configuration IAM pour ma charge de travail et les services.
```

### Pipeline de données BigQuery

```
Concevoir une pipeline d'analytique BigQuery pour [cas d'usage].

Source de données : [flux Pub/Sub / fichiers Cloud Storage / bases de données existantes / API]
Volume : [X événements/jour, X Go/jour]
Exigence de latence : [temps réel / quasi-temps réel (< 1 min) / batch (horaire/quotidien)]
Cas d'usage : [analytique produit / rapports financiers / feature store ML / entrepôt de données]

Patterns de pipeline :

STREAMING (Pub/Sub → Dataflow → BigQuery) :
# Cloud Run publie les événements :
from google.cloud import pubsub_v1
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, 'events')
publisher.publish(topic_path, data=json.dumps(event).encode())

# Modèle Dataflow (Apache Beam géré) :
# Utiliser le modèle Google-fourni Pub/Sub vers BigQuery :
gcloud dataflow jobs run pipeline-name \
  --gcs-location gs://dataflow-templates-us-central1/latest/PubSub_to_BigQuery \
  --parameters \
    inputTopic=projects/PROJECT_ID/topics/events, \
    outputTableSpec=PROJECT_ID:dataset.table

BATCH (Cloud Storage → BigQuery) :
# Charger depuis GCS selon un calendrier (moins cher que le streaming) :
bq load \
  --source_format=NEWLINE_DELIMITED_JSON \
  dataset.table \
  gs://my-bucket/events/2026-05-20/*.json \
  schema.json

# Ou via requête programmée dans BigQuery :
CREATE OR REPLACE TABLE dataset.daily_summary AS
SELECT date, COUNT(*) as events, SUM(revenue) as revenue
FROM dataset.events
WHERE DATE(timestamp) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
GROUP BY date;

Optimisation des coûts BigQuery :
- Partitionner les tables par date : CREATE TABLE t (... event_date DATE) PARTITION BY event_date
- Clusteriser par colonnes de filtre fréquentes : CLUSTER BY user_id, event_type
- Utiliser le stockage en colonnes : SELECT uniquement les colonnes dont vous avez besoin (pas SELECT *)
- Définir les réservations de slot pour les charges de travail prévisibles (tarification Editions)

Concevoir la pipeline pour ma source de données et mon cas d'usage avec estimation de coût.
```

## Exemple

**Utilisateur :** Nous sommes une startup SaaS sur AWS qui envisage de passer à GCP. Charge de travail principale : API REST Node.js, PostgreSQL, et nous commençons à utiliser BigQuery pour l'analytique. Devrions-nous migrer et à quoi cela ressemblerait-il ?

**Évaluation de Claude :**

**Devrions-nous migrer ?** Uniquement si l'intégration Google Workspace / BigQuery est un vrai avantage pour vous — pas juste pour les coûts. Les migrations cloud-to-cloud sont coûteuses en temps d'ingénierie ; le faire pour des économies marginales ne vaut rarement le coup.

**La question BigQuery est le vrai moteur :** Si votre équipe d'analytique vit dans BigQuery et que vous en avez marre des ETL depuis RDS AWS vers BigQuery, alors consolider sur GCP rend la story analytique beaucoup plus propre. Cloud SQL (PostgreSQL) → BigQuery via Datastream est natif et temps réel. Sur AWS, vous exécutez des pipelines CDC personnalisés.

**Si vous migrez — l'architecture cible :**
```
Cloud CDN + Cloud Load Balancing
       ↓
  Cloud Run (votre API Node.js — conteneurisée, pas de changement de code)
       ↓
  Cloud SQL (PostgreSQL 16 — géré, même SQL que vous utilisez aujourd'hui)
       ↓
  BigQuery (via Datastream CDC — réplication temps réel)
       ↓
  Looker Studio (BI gratuit au-dessus de BigQuery)
```

**Chemin de migration (8-12 semaines) :**
1. Conteneuriser l'API (Docker) — pas de changement de code
2. Déployer vers Cloud Run en parallèle (environnement de test)
3. Configurer Cloud SQL avec réplication depuis RDS AWS (équivalent DMS : Datastream peut puller depuis RDS)
4. Basculement DNS avec Cloud Load Balancing
5. Désaffecte AWS une fois stable (garder 2 semaines d'exécution en parallèle)

**Comparaison des coûts (estimation pour 10K utilisateurs) :**
- AWS : ~$800/mois (EC2 + RDS + ALB + transfert de données)
- GCP : ~$400-600/mois (Cloud Run scale à zéro + Cloud SQL + utilisation BigQuery)

---
