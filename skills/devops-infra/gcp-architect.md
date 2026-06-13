---
name: gcp-architect
description: "GCP architecture design: Cloud Run, GKE Autopilot, Cloud Functions, BigQuery, Terraform IaC, cost optimisation, IAM, and data pipeline patterns"
updated: 2026-06-13
---

# GCP Architect Skill

## When to activate
- Designing a new GCP architecture from scratch
- Choosing between GCP services (Cloud Run vs GKE, Firestore vs Cloud SQL, Pub/Sub vs Cloud Tasks)
- Generating Terraform templates for GCP resources
- Optimising GCP costs (committed use discounts, right-sizing)
- Building a data pipeline on GCP (Pub/Sub → Dataflow → BigQuery)
- Setting up IAM least-privilege for GCP workloads

## When NOT to use
- AWS-specific architecture — use the aws-architect skill
- Azure-specific architecture — use the azure-architect skill
- Kubernetes patterns not GCP-specific — use the kubernetes skill

## Instructions

### Architecture pattern selection

```
Select the right GCP architecture pattern for [application].

Application type: [web app / API / event-driven / data pipeline / ML workload]
Scale: [users/day, requests/second, data volume]
Team GCP experience: [beginner / intermediate / advanced]
Budget: $[X]/month target
Data residency: [EU / US / APAC / no constraint]

GCP pattern guide:

CLOUD RUN (recommended for: APIs, web apps, containerised workloads):
Stack: Cloud CDN + Cloud Run + Cloud SQL / Firestore + Secret Manager
Cost: ~$0-50/month for small workloads (pay-per-request, scales to zero)
Pros: fully managed, no cluster ops, scales to zero, fast deploy (container to URL in minutes)
Cons: stateless only; 60-min max request timeout; cold starts if min-instances=0
Best for: REST APIs, web backends, microservices; teams wanting zero K8s ops

GKE AUTOPILOT (recommended for: complex microservices, existing K8s teams):
Stack: Cloud Armor + GKE Autopilot + Cloud SQL + Memorystore + Artifact Registry
Cost: ~$100-500/month (node provisioned on-demand per pod)
Pros: Google-managed nodes, auto-scaling, no node pool management
Cons: some constraints vs standard GKE; higher cost than Cloud Run for simple workloads
Best for: teams with K8s expertise, stateful workloads, complex networking requirements

CLOUD FUNCTIONS (recommended for: event triggers, lightweight automation):
Stack: Pub/Sub → Cloud Functions → Firestore / Cloud SQL
Cost: ~$0-20/month for moderate volume (pay-per-invocation)
Best for: triggered workflows, webhooks, scheduled jobs; simpler than Cloud Run

DATA PIPELINE:
Stack: Pub/Sub → Dataflow → BigQuery → Looker Studio
Or for batch: Cloud Storage → Dataproc → BigQuery
Best for: streaming analytics, ETL, data warehousing, ML feature engineering

Recommend the pattern for my application with cost estimate and Terraform starter.
```

### Terraform for GCP

```
Generate Terraform configuration for [GCP pattern].

Pattern: [Cloud Run API / GKE service / BigQuery pipeline]
Project ID: [your-gcp-project-id]
Region: [europe-west1 / us-central1 / etc.]

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

# IAM — allow unauthenticated (public) or restrict to internal:
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"  # Remove for internal-only
}

# Service account with least privilege
resource "google_service_account" "app" {
  account_id   = "${var.app_name}-sa"
  display_name = "${var.app_name} service account"
}

# Secret Manager secret
resource "google_secret_manager_secret" "db_url" {
  secret_id = "${var.app_name}-db-url"
  replication { auto {} }
}

# Grant service account access to the secret
resource "google_secret_manager_secret_iam_member" "app_secret_access" {
  secret_id = google_secret_manager_secret.db_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app.email}"
}

output "cloud_run_url" { value = google_cloud_run_v2_service.app.uri }

Generate the Terraform config for my specific pattern with security hardening.
```

### IAM least-privilege

```
Design GCP IAM for [workload].

Workload: [Cloud Run service / GKE pod / Cloud Function / developer / CI/CD]
Services accessed: [BigQuery / Cloud SQL / Pub/Sub / Cloud Storage / Secret Manager]
Operations: [read-only / read-write / admin]

GCP IAM principles:
1. Use service accounts, never user credentials for automated workloads
2. Grant at resource level, not project level where possible
3. Use predefined roles (roles/storage.objectViewer) before custom roles
4. Workload Identity for GKE (no JSON key files in pods)

Cloud Run service account (BigQuery read + Secret Manager read):
# Via Terraform (preferred) or gcloud:
gcloud iam service-accounts create myapp-sa \
  --display-name="MyApp Service Account"

# Grant BigQuery Data Viewer (read tables, not admin)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

# Grant Secret Manager accessor (read secrets, not manage)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Cloud Run: assign the service account
gcloud run services update SERVICE_NAME \
  --service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

GKE Workload Identity (no key files):
# Bind K8s service account to GCP service account
gcloud iam service-accounts add-iam-policy-binding \
  myapp-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:PROJECT_ID.svc.id.goog[NAMESPACE/KSA_NAME]"

# Annotate K8s service account
kubectl annotate serviceaccount KSA_NAME \
  iam.gke.io/gcp-service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

Generate the IAM configuration for my workload and services.
```

### BigQuery data pipeline

```
Design a BigQuery analytics pipeline for [use case].

Data source: [Pub/Sub stream / Cloud Storage files / existing databases / API]
Volume: [X events/day, X GB/day]
Latency requirement: [real-time / near-real-time (< 1 min) / batch (hourly/daily)]
Use case: [product analytics / financial reporting / ML feature store / data warehouse]

Pipeline patterns:

STREAMING (Pub/Sub → Dataflow → BigQuery):
# Cloud Run publishes events:
from google.cloud import pubsub_v1
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, 'events')
publisher.publish(topic_path, data=json.dumps(event).encode())

# Dataflow template (managed Apache Beam):
# Use Google-provided Pub/Sub to BigQuery template:
gcloud dataflow jobs run pipeline-name \
  --gcs-location gs://dataflow-templates-us-central1/latest/PubSub_to_BigQuery \
  --parameters \
    inputTopic=projects/PROJECT_ID/topics/events, \
    outputTableSpec=PROJECT_ID:dataset.table

BATCH (Cloud Storage → BigQuery):
# Load from GCS on schedule (cheaper than streaming):
bq load \
  --source_format=NEWLINE_DELIMITED_JSON \
  dataset.table \
  gs://my-bucket/events/2026-05-20/*.json \
  schema.json

# Or via scheduled query in BigQuery:
CREATE OR REPLACE TABLE dataset.daily_summary AS
SELECT date, COUNT(*) as events, SUM(revenue) as revenue
FROM dataset.events
WHERE DATE(timestamp) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
GROUP BY date;

BigQuery cost optimisation:
- Partition tables by date: CREATE TABLE t (... event_date DATE) PARTITION BY event_date
- Cluster by frequent filter columns: CLUSTER BY user_id, event_type
- Use columnar storage: SELECT only the columns you need (not SELECT *)
- Set slot reservations for predictable workloads (Editions pricing)

Design the pipeline for my data source and use case with cost estimate.
```

## Example

**User:** We're a SaaS startup on AWS considering moving to GCP. Main workload: Node.js REST API, PostgreSQL, and we're starting to use BigQuery for analytics. Should we migrate and what would it look like?

**Claude's assessment:**

**Should you migrate?** Only if Google Workspace / BigQuery integration is a genuine advantage for you — not just for cost. Cloud-to-cloud migrations are expensive in engineering time; doing it for marginal savings is rarely worth it.

**The BigQuery question is the real driver:** If your analytics team is living in BigQuery and you're tired of ETL from AWS RDS to BigQuery, then consolidating on GCP makes the analytics story much cleaner. Cloud SQL (PostgreSQL) → BigQuery via Datastream is native and real-time. On AWS, you're running custom CDC pipelines.

**If you do migrate — the target architecture:**
```
Cloud CDN + Cloud Load Balancing
       ↓
  Cloud Run (your Node.js API — containerised, no changes to code)
       ↓
  Cloud SQL (PostgreSQL 16 — managed, same SQL you use today)
       ↓
  BigQuery (via Datastream CDC — real-time replication)
       ↓
  Looker Studio (free BI on top of BigQuery)
```

**Migration path (8-12 weeks):**
1. Containerise the API (Docker) — no code changes
2. Deploy to Cloud Run in parallel (test environment)
3. Set up Cloud SQL with replication from AWS RDS (DMS equivalent: Datastream can pull from RDS)
4. DNS cutover with Cloud Load Balancing
5. Decommission AWS once stable (keep 2 weeks of parallel running)

**Cost comparison (estimate for 10K users):**
- AWS: ~$800/month (EC2 + RDS + ALB + data transfer)
- GCP: ~$400-600/month (Cloud Run scales to zero + Cloud SQL + BigQuery usage)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
