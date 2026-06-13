---
name: gcp-architect
description: "GCP-Architektur-Design: Cloud Run, GKE Autopilot, Cloud Functions, BigQuery, Terraform IaC, Kostenoptimierung, IAM und Datenpipeline-Muster"
---

# GCP Architect Skill

## Wann aktivieren
- Entwerfen einer neuen GCP-Architektur von Grund auf
- Wahl zwischen GCP-Services (Cloud Run vs GKE, Firestore vs Cloud SQL, Pub/Sub vs Cloud Tasks)
- Generierung von Terraform-Vorlagen für GCP-Ressourcen
- Optimierung der GCP-Kosten (Committed Use Discounts, Sizing)
- Aufbau einer Datenpipeline auf GCP (Pub/Sub → Dataflow → BigQuery)
- Einrichtung von IAM Least-Privilege für GCP-Workloads

## Wann NICHT verwenden
- AWS-spezifische Architektur — verwenden Sie den aws-architect Skill
- Azure-spezifische Architektur — verwenden Sie den azure-architect Skill
- Kubernetes-Muster nicht GCP-spezifisch — verwenden Sie den kubernetes Skill

## Anweisungen

### Architekturmuster-Auswahl

```
Wählen Sie das richtige GCP-Architekturmuster für [Anwendung].

Anwendungstyp: [Web-App / API / event-driven / Datenpipeline / ML-Workload]
Skalierung: [Benutzer/Tag, Anfragen/Sekunde, Datenvolumen]
GCP-Erfahrung des Teams: [Anfänger / Fortgeschrittene / Experte]
Budget: $[X]/Monat Ziel
Datenspeicherort: [EU / US / APAC / keine Einschränkung]

Leitfaden zum GCP-Muster:

CLOUD RUN (empfohlen für: APIs, Web-Apps, containerisierte Workloads):
Stack: Cloud CDN + Cloud Run + Cloud SQL / Firestore + Secret Manager
Kosten: ~$0-50/Monat für kleine Workloads (Bezahlung pro Anfrage, Skalierung auf null)
Vorteile: vollständig verwaltet, keine Cluster-Operationen, Skalierung auf null, schnelle Bereitstellung (Container zu URL in Minuten)
Nachteile: nur zustandslos; 60-Minuten-Max-Anfrage-Timeout; Cold Starts wenn min-instances=0
Am besten für: REST-APIs, Web-Backends, Microservices; Teams wollen null K8s-Operationen

GKE AUTOPILOT (empfohlen für: komplexe Microservices, bestehende K8s Teams):
Stack: Cloud Armor + GKE Autopilot + Cloud SQL + Memorystore + Artifact Registry
Kosten: ~$100-500/Monat (Knoten bedarfsgerecht pro Pod bereitgestellt)
Vorteile: von Google verwaltete Knoten, Auto-Scaling, keine Knoten-Pool-Verwaltung
Nachteile: einige Einschränkungen gegenüber Standard-GKE; höhere Kosten als Cloud Run für einfache Workloads
Am besten für: Teams mit K8s-Expertise, zustandsbehaftete Workloads, komplexe Netzwerkanforderungen

CLOUD FUNCTIONS (empfohlen für: Event-Trigger, leichte Automatisierung):
Stack: Pub/Sub → Cloud Functions → Firestore / Cloud SQL
Kosten: ~$0-20/Monat für moderates Volumen (Bezahlung pro Invocation)
Am besten für: ausgelöste Workflows, Webhooks, geplante Jobs; einfacher als Cloud Run

DATENPIPELINE:
Stack: Pub/Sub → Dataflow → BigQuery → Looker Studio
Oder für Batch: Cloud Storage → Dataproc → BigQuery
Am besten für: Streaming-Analytics, ETL, Data Warehousing, ML Feature Engineering

Empfehlen Sie das Muster für meine Anwendung mit Kostenschätzung und Terraform-Starter.
```

### Terraform für GCP

```
Generieren Sie Terraform-Konfiguration für [GCP-Muster].

Muster: [Cloud Run API / GKE Service / BigQuery Pipeline]
Projekt-ID: [your-gcp-project-id]
Region: [europe-west1 / us-central1 / etc.]

Cloud Run Service (Terraform):
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

# Cloud Run Service
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

# IAM — unauthentifiziert (öffentlich) zulassen oder auf intern beschränken:
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"  # Für nur intern entfernen
}

# Service Account mit Least Privilege
resource "google_service_account" "app" {
  account_id   = "${var.app_name}-sa"
  display_name = "${var.app_name} service account"
}

# Secret Manager Secret
resource "google_secret_manager_secret" "db_url" {
  secret_id = "${var.app_name}-db-url"
  replication { auto {} }
}

# Service Account Zugriff auf Secret gewähren
resource "google_secret_manager_secret_iam_member" "app_secret_access" {
  secret_id = google_secret_manager_secret.db_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app.email}"
}

output "cloud_run_url" { value = google_cloud_run_v2_service.app.uri }

Generieren Sie die Terraform-Konfiguration für mein spezifisches Muster mit Sicherheitshärtung.
```

### IAM Least-Privilege

```
Entwerfen Sie GCP IAM für [Workload].

Workload: [Cloud Run Service / GKE Pod / Cloud Function / Entwickler / CI/CD]
Zugegriffene Services: [BigQuery / Cloud SQL / Pub/Sub / Cloud Storage / Secret Manager]
Operationen: [Nur Lesezugriff / Lese-Schreibzugriff / Admin]

GCP IAM Grundsätze:
1. Service Accounts verwenden, niemals Benutzer-Credentials für automatisierte Workloads
2. Auf Ressourcenebene gewähren, wenn möglich nicht auf Projektebene
3. Vordefinierte Rollen (roles/storage.objectViewer) vor benutzerdefinierten Rollen verwenden
4. Workload Identity für GKE (keine JSON-Schlüsseldateien in Pods)

Cloud Run Service Account (BigQuery Lesezugriff + Secret Manager Lesezugriff):
# Via Terraform (bevorzugt) oder gcloud:
gcloud iam service-accounts create myapp-sa \
  --display-name="MyApp Service Account"

# BigQuery Data Viewer gewähren (Tabellen lesen, nicht Admin)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

# Secret Manager Accessor gewähren (Secrets lesen, nicht verwalten)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Cloud Run: Service Account zuweisen
gcloud run services update SERVICE_NAME \
  --service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

GKE Workload Identity (keine Schlüsseldateien):
# Kubernetes Service Account an GCP Service Account binden
gcloud iam service-accounts add-iam-policy-binding \
  myapp-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:PROJECT_ID.svc.id.goog[NAMESPACE/KSA_NAME]"

# Kubernetes Service Account annotieren
kubectl annotate serviceaccount KSA_NAME \
  iam.gke.io/gcp-service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

Generieren Sie die IAM-Konfiguration für meine Workload und Services.
```

### BigQuery Datenpipeline

```
Entwerfen Sie eine BigQuery-Analytics-Pipeline für [Anwendungsfall].

Datenquelle: [Pub/Sub Stream / Cloud Storage Dateien / bestehende Datenbanken / API]
Volumen: [X Ereignisse/Tag, X GB/Tag]
Latenzanforderung: [Echtzeit / Nahezu-Echtzeit (< 1 min) / Batch (stündlich/täglich)]
Anwendungsfall: [Produktanalytics / Finanzberichterstattung / ML Feature Store / Data Warehouse]

Pipeline-Muster:

STREAMING (Pub/Sub → Dataflow → BigQuery):
# Cloud Run veröffentlicht Ereignisse:
from google.cloud import pubsub_v1
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, 'events')
publisher.publish(topic_path, data=json.dumps(event).encode())

# Dataflow Template (verwaltetes Apache Beam):
# Google-bereitgestelltes Pub/Sub zu BigQuery Template verwenden:
gcloud dataflow jobs run pipeline-name \
  --gcs-location gs://dataflow-templates-us-central1/latest/PubSub_to_BigQuery \
  --parameters \
    inputTopic=projects/PROJECT_ID/topics/events, \
    outputTableSpec=PROJECT_ID:dataset.table

BATCH (Cloud Storage → BigQuery):
# Von GCS nach Zeitplan laden (günstiger als Streaming):
bq load \
  --source_format=NEWLINE_DELIMITED_JSON \
  dataset.table \
  gs://my-bucket/events/2026-05-20/*.json \
  schema.json

# Oder über geplante Abfrage in BigQuery:
CREATE OR REPLACE TABLE dataset.daily_summary AS
SELECT date, COUNT(*) as events, SUM(revenue) as revenue
FROM dataset.events
WHERE DATE(timestamp) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
GROUP BY date;

BigQuery Kostenoptimierung:
- Tabellen nach Datum partitionieren: CREATE TABLE t (... event_date DATE) PARTITION BY event_date
- Nach häufigen Filterspalten clusterisieren: CLUSTER BY user_id, event_type
- Spaltenweisen Speicher verwenden: SELECT nur benötigte Spalten (nicht SELECT *)
- Slot-Reservierungen für vorhersagbare Workloads setzen (Editions Pricing)

Entwerfen Sie die Pipeline für meine Datenquelle und meinen Anwendungsfall mit Kostenschätzung.
```

## Beispiel

**Benutzer:** Wir sind ein SaaS-Startup auf AWS und erwägen einen Umzug zu GCP. Hauptlast: Node.js REST API, PostgreSQL, und wir fangen an BigQuery für Analytics zu nutzen. Sollten wir migrieren und wie würde es aussehen?

**Claude's Bewertung:**

**Sollten Sie migrieren?** Nur wenn Google Workspace / BigQuery Integration ein echter Vorteil für Sie ist — nicht nur für Kosten. Cloud-zu-Cloud-Migrationen sind teuer in Ingenieurzeit; es für marginale Einsparungen zu tun, lohnt sich selten.

**Die BigQuery Frage ist der echte Treiber:** Wenn Ihr Analytics-Team in BigQuery lebt und Sie es satt haben, ETL-Pipelines von AWS RDS zu BigQuery zu schreiben, dann die Konsolidierung auf GCP macht die Analytics-Story viel sauberer. Cloud SQL (PostgreSQL) → BigQuery via Datastream ist nativ und Echtzeit. Auf AWS führen Sie benutzerdefinierte CDC-Pipelines aus.

**Wenn Sie migrieren — die Zielarchitektur:**
```
Cloud CDN + Cloud Load Balancing
       ↓
  Cloud Run (Ihre Node.js API — containerisiert, keine Code-Änderungen)
       ↓
  Cloud SQL (PostgreSQL 16 — verwaltet, gleiche SQL wie heute)
       ↓
  BigQuery (via Datastream CDC — Echtzeit-Replikation)
       ↓
  Looker Studio (kostenlose BI auf BigQuery)
```

**Migrationspfad (8-12 Wochen):**
1. API containerisieren (Docker) — keine Code-Änderungen
2. In Cloud Run parallel bereitstellen (Test-Umgebung)
3. Cloud SQL mit Replikation von AWS RDS einrichten (DMS Äquivalent: Datastream kann von RDS pullen)
4. DNS-Cutover mit Cloud Load Balancing
5. AWS deaktivieren sobald stabil (2 Wochen Parallel-Betrieb behalten)

**Kostenvergleich (Schätzung für 10K Benutzer):**
- AWS: ~$800/Monat (EC2 + RDS + ALB + Datentransfer)
- GCP: ~$400-600/Monat (Cloud Run skaliert auf null + Cloud SQL + BigQuery Nutzung)

---
