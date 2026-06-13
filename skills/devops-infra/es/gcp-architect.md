---
name: gcp-architect
description: "Diseño de arquitectura GCP: Cloud Run, GKE Autopilot, Cloud Functions, BigQuery, Terraform IaC, optimización de costos, IAM y patrones de canalizaciones de datos"
---

# Habilidad GCP Architect

## Cuándo activar
- Diseñar una nueva arquitectura GCP desde cero
- Elegir entre servicios GCP (Cloud Run vs GKE, Firestore vs Cloud SQL, Pub/Sub vs Cloud Tasks)
- Generar plantillas Terraform para recursos GCP
- Optimizar costos de GCP (committed use discounts, right-sizing)
- Construir una canalización de datos en GCP (Pub/Sub → Dataflow → BigQuery)
- Configurar IAM de privilegio mínimo para cargas de trabajo GCP

## Cuándo NO usar
- Arquitectura específica de AWS — usa la habilidad aws-architect
- Arquitectura específica de Azure — usa la habilidad azure-architect
- Patrones Kubernetes no específicos de GCP — usa la habilidad kubernetes

## Instrucciones

### Selección de patrones de arquitectura

```
Selecciona el patrón de arquitectura GCP correcto para [aplicación].

Tipo de aplicación: [app web / API / event-driven / canalización de datos / carga de trabajo ML]
Escala: [usuarios/día, solicitudes/segundo, volumen de datos]
Experiencia en GCP del equipo: [principiante / intermedio / avanzado]
Presupuesto: $[X]/mes objetivo
Residencia de datos: [UE / US / APAC / sin restricción]

Guía de patrones GCP:

CLOUD RUN (recomendado para: API, aplicaciones web, cargas de trabajo containerizadas):
Stack: Cloud CDN + Cloud Run + Cloud SQL / Firestore + Secret Manager
Costo: ~$0-50/mes para pequeñas cargas de trabajo (pago por solicitud, escala a cero)
Ventajas: completamente gestionado, sin operaciones de clúster, escala a cero, despliegue rápido (contenedor a URL en minutos)
Desventajas: solo sin estado; timeout máximo de solicitud 60 min; arranques en frío si min-instances=0
Mejor para: API REST, backends web, microservicios; equipos que quieren cero operaciones K8s

GKE AUTOPILOT (recomendado para: microservicios complejos, equipos K8s existentes):
Stack: Cloud Armor + GKE Autopilot + Cloud SQL + Memorystore + Artifact Registry
Costo: ~$100-500/mes (nodos aprovisionados bajo demanda por pod)
Ventajas: nodos gestionados por Google, auto-escalado, sin gestión de grupos de nodos
Desventajas: algunas restricciones vs GKE estándar; costo más alto que Cloud Run para cargas simples
Mejor para: equipos con experiencia K8s, cargas de trabajo con estado, requisitos de redes complejos

CLOUD FUNCTIONS (recomendado para: triggers de eventos, automatización ligera):
Stack: Pub/Sub → Cloud Functions → Firestore / Cloud SQL
Costo: ~$0-20/mes para volumen moderado (pago por invocación)
Mejor para: flujos de trabajo activados, webhooks, trabajos programados; más simple que Cloud Run

CANALIZACIÓN DE DATOS:
Stack: Pub/Sub → Dataflow → BigQuery → Looker Studio
O para batch: Cloud Storage → Dataproc → BigQuery
Mejor para: análisis de transmisión, ETL, almacén de datos, ingeniería de features ML

Recomienda el patrón para mi aplicación con estimación de costo e inicio de Terraform.
```

### Terraform para GCP

```
Genera configuración Terraform para [patrón GCP].

Patrón: [API Cloud Run / servicio GKE / canalización BigQuery]
ID del proyecto: [your-gcp-project-id]
Región: [europe-west1 / us-central1 / etc.]

Servicio Cloud Run (Terraform):
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

# Servicio Cloud Run
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

# IAM — permitir no autenticado (público) o restringir a interno:
resource "google_cloud_run_v2_service_iam_member" "public" {
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"  # Eliminar para solo interno
}

# Cuenta de servicio con privilegio mínimo
resource "google_service_account" "app" {
  account_id   = "${var.app_name}-sa"
  display_name = "${var.app_name} service account"
}

# Secret de Secret Manager
resource "google_secret_manager_secret" "db_url" {
  secret_id = "${var.app_name}-db-url"
  replication { auto {} }
}

# Otorgar acceso de cuenta de servicio al secreto
resource "google_secret_manager_secret_iam_member" "app_secret_access" {
  secret_id = google_secret_manager_secret.db_url.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.app.email}"
}

output "cloud_run_url" { value = google_cloud_run_v2_service.app.uri }

Genera la configuración Terraform para mi patrón específico con endurecimiento de seguridad.
```

### IAM de privilegio mínimo

```
Diseña IAM GCP para [carga de trabajo].

Carga de trabajo: [servicio Cloud Run / pod GKE / Cloud Function / desarrollador / CI/CD]
Servicios accedidos: [BigQuery / Cloud SQL / Pub/Sub / Cloud Storage / Secret Manager]
Operaciones: [solo lectura / lectura-escritura / administrador]

Principios GCP IAM:
1. Usar cuentas de servicio, nunca credenciales de usuario para cargas de trabajo automatizadas
2. Otorgar a nivel de recurso, no a nivel de proyecto si es posible
3. Usar roles predefinidos (roles/storage.objectViewer) antes de roles personalizados
4. Workload Identity para GKE (sin archivos de clave JSON en pods)

Cuenta de servicio Cloud Run (lectura BigQuery + lectura Secret Manager):
# Via Terraform (recomendado) o gcloud:
gcloud iam service-accounts create myapp-sa \
  --display-name="MyApp Service Account"

# Otorgar BigQuery Data Viewer (leer tablas, no admin)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/bigquery.dataViewer"

# Otorgar Secret Manager accessor (leer secretos, no gestionar)
gcloud projects add-iam-policy-binding PROJECT_ID \
  --member="serviceAccount:myapp-sa@PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Cloud Run: asignar cuenta de servicio
gcloud run services update SERVICE_NAME \
  --service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

GKE Workload Identity (sin archivos de clave):
# Vincular cuenta de servicio de Kubernetes a cuenta de servicio GCP
gcloud iam service-accounts add-iam-policy-binding \
  myapp-sa@PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="serviceAccount:PROJECT_ID.svc.id.goog[NAMESPACE/KSA_NAME]"

# Anotar cuenta de servicio de Kubernetes
kubectl annotate serviceaccount KSA_NAME \
  iam.gke.io/gcp-service-account=myapp-sa@PROJECT_ID.iam.gserviceaccount.com

Genera la configuración IAM para mi carga de trabajo y servicios.
```

### Canalización de datos BigQuery

```
Diseña una canalización de análisis BigQuery para [caso de uso].

Fuente de datos: [flujo Pub/Sub / archivos Cloud Storage / bases de datos existentes / API]
Volumen: [X eventos/día, X GB/día]
Requisito de latencia: [tiempo real / casi tiempo real (< 1 min) / batch (cada hora/día)]
Caso de uso: [análisis de productos / reportes financieros / tienda de features ML / almacén de datos]

Patrones de canalizaciones:

STREAMING (Pub/Sub → Dataflow → BigQuery):
# Cloud Run publica eventos:
from google.cloud import pubsub_v1
publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path(project_id, 'events')
publisher.publish(topic_path, data=json.dumps(event).encode())

# Plantilla de Dataflow (Apache Beam gestionado):
# Usar plantilla de Pub/Sub a BigQuery proporcionada por Google:
gcloud dataflow jobs run pipeline-name \
  --gcs-location gs://dataflow-templates-us-central1/latest/PubSub_to_BigQuery \
  --parameters \
    inputTopic=projects/PROJECT_ID/topics/events, \
    outputTableSpec=PROJECT_ID:dataset.table

BATCH (Cloud Storage → BigQuery):
# Cargar desde GCS según cronograma (más barato que streaming):
bq load \
  --source_format=NEWLINE_DELIMITED_JSON \
  dataset.table \
  gs://my-bucket/events/2026-05-20/*.json \
  schema.json

# O mediante consulta programada en BigQuery:
CREATE OR REPLACE TABLE dataset.daily_summary AS
SELECT date, COUNT(*) as events, SUM(revenue) as revenue
FROM dataset.events
WHERE DATE(timestamp) = DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY)
GROUP BY date;

Optimización de costos de BigQuery:
- Particionar tablas por fecha: CREATE TABLE t (... event_date DATE) PARTITION BY event_date
- Agrupar por columnas de filtro frecuentes: CLUSTER BY user_id, event_type
- Usar almacenamiento columnar: SELECT solo las columnas que necesitas (no SELECT *)
- Establecer reservas de slots para cargas de trabajo predecibles (precios de Editions)

Diseña la canalización para mi fuente de datos y caso de uso con estimación de costo.
```

## Ejemplo

**Usuario:** Somos una startup SaaS en AWS considerando pasar a GCP. Carga de trabajo principal: API REST Node.js, PostgreSQL, y estamos empezando a usar BigQuery para análisis. ¿Deberíamos migrar y cómo se vería?

**Evaluación de Claude:**

**¿Deberías migrar?** Solo si la integración Google Workspace / BigQuery es una ventaja genuina para ti — no solo por costos. Las migraciones de nube a nube son caras en tiempo de ingeniería; hacerlo por ahorros marginales rara vez vale la pena.

**La pregunta de BigQuery es el verdadero impulsor:** Si tu equipo de análisis vive en BigQuery y estás cansado de escribir pipelines ETL de AWS RDS a BigQuery, entonces consolidar en GCP hace la historia de análisis mucho más limpia. Cloud SQL (PostgreSQL) → BigQuery via Datastream es nativo y en tiempo real. En AWS estás ejecutando pipelines CDC personalizados.

**Si migras — la arquitectura objetivo:**
```
Cloud CDN + Cloud Load Balancing
       ↓
  Cloud Run (tu API Node.js — contenida, sin cambios de código)
       ↓
  Cloud SQL (PostgreSQL 16 — gestionado, mismo SQL que usas hoy)
       ↓
  BigQuery (via Datastream CDC — replicación en tiempo real)
       ↓
  Looker Studio (BI gratuito sobre BigQuery)
```

**Ruta de migración (8-12 semanas):**
1. Containerizar la API (Docker) — sin cambios de código
2. Desplegar a Cloud Run en paralelo (entorno de prueba)
3. Configurar Cloud SQL con replicación desde AWS RDS (equivalente DMS: Datastream puede extraer de RDS)
4. Cambio de DNS con Cloud Load Balancing
5. Decommission AWS una vez estable (mantener 2 semanas de ejecución en paralelo)

**Comparación de costos (estimación para 10K usuarios):**
- AWS: ~$800/mes (EC2 + RDS + ALB + transferencia de datos)
- GCP: ~$400-600/mes (Cloud Run escala a cero + Cloud SQL + uso de BigQuery)

---
