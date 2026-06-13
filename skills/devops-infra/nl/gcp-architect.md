---
name: gcp-architect
description: "GCP-architectuur ontwerp: Cloud Run, GKE Autopilot, Cloud Functions, BigQuery, Terraform IaC, kostenoptimalisatie, IAM en datapijplijnpatronen"
---

# GCP Architect Skill

## Wanneer activeren
- Een nieuwe GCP-architectuur helemaal opnieuw ontwerpen
- Kiezen tussen GCP-services (Cloud Run vs GKE, Firestore vs Cloud SQL, Pub/Sub vs Cloud Tasks)
- Terraform-sjablonen genereren voor GCP-resources
- GCP-kosten optimaliseren (committed use discounts, right-sizing)
- Een datapijplijn op GCP bouwen (Pub/Sub → Dataflow → BigQuery)
- IAM minimale bevoegdheden instellen voor GCP-workloads

## Wanneer NIET gebruiken
- AWS-specifieke architectuur — gebruik de aws-architect skill
- Azure-specifieke architectuur — gebruik de azure-architect skill
- Kubernetes-patronen niet GCP-specifiek — gebruik de kubernetes skill

## Instructies

### Selectie van architectuurpatroon

```
Selecteer het juiste GCP-architectuurpatroon voor [toepassing].

Toepassingstype: [web-app / API / event-driven / datapijplijn / ML-werkbelasting]
Schaal: [gebruikers/dag, verzoeken/seconde, gegevensvolume]
GCP-ervaring van het team: [beginner / intermediate / gevorderd]
Budget: $[X]/maand doel
Gegevenslocatie: [EU / US / APAC / geen beperking]

Handleiding voor GCP-patroon:

CLOUD RUN (aanbevolen voor: API's, web-apps, gecontaineriseerde workloads):
Stack: Cloud CDN + Cloud Run + Cloud SQL / Firestore + Secret Manager
Kosten: ~$0-50/maand voor kleine workloads (betaal-per-verzoek, schaal naar nul)
Voordelen: volledig beheerd, geen clusteroperaties, schaal naar nul, snelle implementatie (container naar URL in minuten)
Nadelen: alleen stateless; 60 minuten max aanvraaginactief; koude starts als min-instances=0
Beste voor: REST API's, web-backends, microservices; teams willen nul K8s-operaties

GKE AUTOPILOT (aanbevolen voor: complexe microservices, bestaande K8s teams):
Stack: Cloud Armor + GKE Autopilot + Cloud SQL + Memorystore + Artifact Registry
Kosten: ~$100-500/maand (knopen ingericht op aanvraag per pod)
Voordelen: door Google beheerde knooppunten, auto-schaling, geen knoop-pool-beheer
Nadelen: enkele beperkingen tegenover standaard GKE; hogere kosten dan Cloud Run voor eenvoudige workloads
Beste voor: teams met K8s-expertise, stateful workloads, complexe netwerkvereisten

CLOUD FUNCTIONS (aanbevolen voor: event-triggers, lichte automatisering):
Stack: Pub/Sub → Cloud Functions → Firestore / Cloud SQL
Kosten: ~$0-20/maand voor matig volume (betaal-per-aanroeping)
Beste voor: geactiveerde workflows, webhooks, geplande taken; eenvoudiger dan Cloud Run

DATAPIJPLIJN:
Stack: Pub/Sub → Dataflow → BigQuery → Looker Studio
Of voor batch: Cloud Storage → Dataproc → BigQuery
Beste voor: streaming analytics, ETL, datawarehousing, ML feature engineering

Aanbeveel het patroon voor mijn toepassing met kostenschatting en Terraform starter.
```

### Terraform voor GCP

```
Genereer Terraform-configuratie voor [GCP-patroon].

Patroon: [Cloud Run API / GKE service / BigQuery pijplijn]
Project-ID: [your-gcp-project-id]
Regio: [europe-west1 / us-central1 / etc.]

Cloud Run service (Terraform):
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

# Cloud Run service
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

# IAM — niet-geverifieerd (publiek) toestaan of beperken tot intern:
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"  # Verwijder voor alleen intern
}

# Service account met minimale bevoegdheden
resource "google_service_account" "app" {
  account_id   = "${var.app_name}-sa"
  display_name = "${var.app_name} service account"
}

# Secret Manager secret
resource "google_secret_manager_secret" "db_url" {
  secret_id = "${var.app_name}-db-url"
  replication { auto {} }
}

# Service account toegang tot secret verlenen
resource "google_secret_manager_secret_iam_member" "app_secret_access" {
  secret_id = google_secret_manager_secret.db_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app.email}"
}

output "cloud_run_url" { value = google_cloud_run_v2_service.app.uri }

Genereer de Terraform-configuratie voor mijn specifieke patroon met beveiligingshardening.
```

### IAM minimale bevoegdheden

```
Ontwerp GCP IAM voor [werkbelasting].

Werkbelasting: [Cloud Run service / GKE pod / Cloud Function / ontwikkelaar / CI/CD]
Toegang tot services: [BigQuery / Cloud SQL / Pub/Sub / Cloud Storage / Secret Manager]
Operaties: [alleen-lezen / lezen-schrijven / beheerder]

GCP IAM-beginselen:
1. Service accounts gebruiken, nooit gebruikers-credentials voor geautomatiseerde workloads
2. Verlenen op resourceniveau, waar mogelijk niet op projectniveau
3. Voorgedefinieerde rollen (roles/storage.objectViewer) voor aangepaste rollen gebruiken
4. Workload Identity voor GKE (geen JSON-sleutelbestanden in pods)

Cloud Run service account (BigQuery lezen + Secret Manager lezen):
# Via Terraform (aanbevolen) of gcloud:
gcloud iam service-accounts create myapp-sa \
  --display-name="MyApp Service Account"

# BigQuery Data Viewer verlenen (tabellen lezen, niet admin)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

# Secret Manager accessor verlenen (secrets lezen, niet beheren)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Cloud Run: service account toewijzen
gcloud run services update SERVICE_NAME \
  --service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

GKE Workload Identity (geen sleutelbestanden):
# Kubernetes service account binden aan GCP service account
gcloud iam service-accounts add-iam-policy-binding \
  myapp-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:PROJECT_ID.svc.id.goog[NAMESPACE/KSA_NAME]"

# Kubernetes service account annoteren
kubectl annotate serviceaccount KSA_NAME \
  iam.gke.io/gcp-service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

Genereer de IAM-configuratie voor mijn workload en services.
```

### BigQuery datapijplijn

```
Ontwerp een BigQuery analytics-pijplijn voor [gebruiksscenario].

Gegevensbron: [Pub/Sub stream / Cloud Storage bestanden / bestaande databases / API]
Volume: [X gebeurtenissen/dag, X GB/dag]
Latencievereiste: [real-time / near-realtime (< 1 min) / batch (per uur/dag)]
Gebruiksscenario: [productanalytics / financiële rapportage / ML feature store / datawarehouse]

Pijplijnpatronen:

STREAMING (Pub/Sub → Dataflow → BigQuery):
# Cloud Run publiceert gebeurtenissen:
from google.cloud import pubsub_v1
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, 'events')
publisher.publish(topic_path, data=json.dumps(event).encode())

# Dataflow-sjabloon (beheerd Apache Beam):
# Google-verstrekte Pub/Sub naar BigQuery-sjabloon gebruiken:
gcloud dataflow jobs run pipeline-name \
  --gcs-location gs://dataflow-templates-us-central1/latest/PubSub_to_BigQuery \
  --parameters \
    inputTopic=projects/PROJECT_ID/topics/events, \
    outputTableSpec=PROJECT_ID:dataset.table

BATCH (Cloud Storage → BigQuery):
# Laden vanaf GCS volgens schema (goedkoper dan streaming):
bq load \
  --source_format=NEWLINE_DELIMITED_JSON \
  dataset.table \
  gs://my-bucket/events/2026-05-20/*.json \
  schema.json

# Of via geplande query in BigQuery:
CREATE OR REPLACE TABLE dataset.daily_summary AS
SELECT date, COUNT(*) as events, SUM(revenue) as revenue
FROM dataset.events
WHERE DATE(timestamp) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
GROUP BY date;

BigQuery kostenoptimalisatie:
- Tabellen partitioneren op datum: CREATE TABLE t (... event_date DATE) PARTITION BY event_date
- Clusteriseren op veelgebruikte filterkolommen: CLUSTER BY user_id, event_type
- Kolom-opslag gebruiken: SELECT alleen benodigde kolommen (niet SELECT *)
- Slot-reserveringen instellen voor voorspelbare workloads (Editions pricing)

Ontwerp de pijplijn voor mijn gegevensbron en gebruiksscenario met kostenschatting.
```

## Voorbeeld

**Gebruiker:** We zijn een SaaS-startup op AWS die overweegt naar GCP te gaan. Hoofdwerkbelasting: Node.js REST API, PostgreSQL, en we beginnen BigQuery voor analytics te gebruiken. Moeten we migreren en hoe zou dat eruitzien?

**Claude's beoordeling:**

**Moet je migreren?** Alleen als Google Workspace / BigQuery-integratie een echt voordeel voor u is — niet alleen voor kosten. Cloud-naar-cloud-migraties zijn duur in engineeringstijd; dit doen voor marginale besparingen loont zelden.

**De BigQuery-vraag is de echte drijver:** Als uw analytics-team in BigQuery leeft en u het zat bent ETL-pijplijnen van AWS RDS naar BigQuery te schrijven, dan consolideren op GCP maakt het analytics-verhaal veel schoner. Cloud SQL (PostgreSQL) → BigQuery via Datastream is native en real-time. Op AWS voert u aangepaste CDC-pijplijnen uit.

**Als je migreert — de doelarchitectuur:**
```
Cloud CDN + Cloud Load Balancing
       ↓
  Cloud Run (uw Node.js API — gecontaineriseerd, geen codewijzigingen)
       ↓
  Cloud SQL (PostgreSQL 16 — beheerd, dezelfde SQL als vandaag)
       ↓
  BigQuery (via Datastream CDC — real-time replicatie)
       ↓
  Looker Studio (gratis BI bovenop BigQuery)
```

**Migratiepad (8-12 weken):**
1. API containeriseren (Docker) — geen codewijzigingen
2. Parallel implementeren naar Cloud Run (testomgeving)
3. Cloud SQL instellen met replicatie van AWS RDS (DMS equivalent: Datastream kan van RDS pullen)
4. DNS-cutover met Cloud Load Balancing
5. AWS deactiveren zodra stabiel (2 weken parallelle werking behouden)

**Kostenvergleich (schatting voor 10K gebruikers):**
- AWS: ~$800/maand (EC2 + RDS + ALB + gegevensoverdracht)
- GCP: ~$400-600/maand (Cloud Run schaal naar nul + Cloud SQL + BigQuery-gebruik)

---
