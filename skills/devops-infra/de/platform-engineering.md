# Plattformtechnik

## Wann aktivieren
Aufbau von internen Entwicklerplattformen (IDPs), Erstellung von Golden-Path-Service-Templates, die Organisationsnormen kodieren, Einrichtung von Backstage Service Catalog oder Scaffolder Templates, Gestaltung von Self-Service Infrastructure Provisioning, Aufbau von Kubernetes-Abstraktionen zur Reduzierung der kognitiven Belastung der Entwickler, oder Verbesserung der DORA-Metriken durch Standardisierung wie Teams Software ausliefern.

## Wann nicht verwenden
Einmalige Infrastrukturarbeiten für ein einzelnes Team (nutzen Sie einfach direkt Terraform). Allgemeine Kubernetes-Cluster-Administration ohne Fokus auf Entwicklererfahrung. Feature-Arbeit in einem Produktservice — Plattformtechnik befasst sich mit dem System, das Teams zum Aufbau und zur Bereitstellung von Software nutzen, nicht mit der Software selbst. Vermeiden Sie den Aufbau der Plattform, bevor Sie Schmerzpunkte haben — vorzeitige Plattformisierung erzeugt Overhead ohne Nutzen.

## Anweisungen

### Das Golden-Path-Prinzip

Ein Golden Path ist ein opinioniertes, vollständig integriertes Service-Template, das alles vorverkabelt, was ein Team braucht, um von „neuer Service" zu „läuft in Produktion" zu gehen, ohne architektonische Entscheidungen zu treffen. Das Platform-Team besitzt den Weg; Product-Teams folgen ihm oder entscheiden sich explizit mit dokumentierter Begründung abzuweichen.

Ein kompletter Golden Path umfasst:
- `Dockerfile` — Multi-Stage, Non-Root-Benutzer, Health Check
- Kubernetes-Manifeste — `Deployment`, `Service`, `HPA`, `PDB`, `NetworkPolicy`
- GitHub Actions CI-Workflow — lint, test, build, push, deploy
- Observability — Prometheus Metrics Endpoint, strukturierte JSON-Logs, vorgefertigtes Grafana Dashboard, Standard-Alerts
- Backstage Katalog-Eintrag — `catalog-info.yaml` vorausgefüllt
- Service-Secrets Verkabelung — External-Secrets Operator Manifeste auf Vault/AWS Secrets Manager
- README-Gerüst — Architecture Decision Record (ADR) Template

### Backstage Katalog-Eintrag

Jeder Service muss einen `catalog-info.yaml` in seiner Root haben:

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

### Backstage Scaffolder Template

Scaffolder Templates sind der Einstiegspunkt für den Golden Path — sie generieren ein neues Repository mit allen vorgekabelten Dateien:

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

### Kubernetes CRD Abstraktion

Stellen Sie ein High-Level `WebService` CRD bereit, das alle Low-Level Ressourcen generiert — Teams beschreiben Intent, nicht Implementierung:

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

Der Platform Operator generiert: `Deployment` + `Service` + `HPA` + `PDB` (minAvailable=1) + `ServiceMonitor` + `NetworkPolicy`. Das Team schreibt niemals direkt einen dieser.

Implementieren Sie mit [Operator SDK](https://sdk.operatorframework.io/) oder einem einfachen Helm Post-Renderer, wenn ein vollständiger Operator für die aktuelle Phase zu schwer ist.

### Terraform Module mit vernünftigen Standardwerten

Plattform Module stellen nur Variablen bereit, die Product Teams variieren sollten; alles andere ist standardmäßig auf Organisationsnormen eingestellt:

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

Teams können nicht auf Verschlüsselung oder Überwachung verzichten — das sind keine Variablen.

### Plattformvertrag

Dokumentieren Sie, was die Plattform garantiert vs. was Teams besitzen. Mehrdeutigkeit ist hier die größte Reibungsquelle:

| Plattformgarantien | Team Besitzt |
|---|---|
| Base Image Patching (wöchentlich) | Geschäftslogik |
| Cluster Uptime SLA (99,9%) | Datenschema-Migrationen |
| Zentralisierte Log-Aggregation | Application-Level Error Handling |
| Secret Rotation auf Infrastruktur-Ebene | API Contracts und Versionierung |
| HPA + Node Autoscaling | Service-Level SLOs |
| Ingress TLS Termination | Feature Flags und A/B-Logik |

Veröffentlichen Sie diesen Vertrag in Backstage TechDocs, damit Teams wissen, was sie an das Plattform-Team eskalieren vs. selbst beheben.

### DORA Metriken als Plattform-Gesundheit KPIs

Plattform-Investitionen sollten DORA-Metriken bewegen. Folgen Sie diesen auf Organisationsebene:

```
Deployment Frequency     → how often teams ship to prod
Lead Time for Changes    → commit to prod elapsed time
Change Failure Rate      → % of deploys causing incidents
Mean Time to Restore     → how fast from incident to recovery
```

Eine 3-Tage-Lead-Time mit 5% Change-Failure-Rate ist ein Zeichen, dass der Golden-Path-CI oder der Deployment-Prozess zu viel Reibung oder unzureichendes Testen hat. Zeigen Sie diese Metriken auf der Backstage-Homepage, damit jedes Team seine eigenen Zahlen sieht.

## Beispiel

Gestalten Sie ein Golden-Path Template für einen neuen Python Microservice:

1. Das Scaffolder Template in Backstage generiert ein neues GitHub Repository mit: `Dockerfile` (Multi-Stage, Non-Root, Healthcheck), FastAPI App Skeleton, `k8s/` Verzeichnis mit `WebService` CRD Manifest, GitHub Actions Workflow (ruff lint → pytest → docker build → push zu ECR → kubectl apply).
2. Der Kubernetes Platform Operator rekonstruiert `WebService` CRDs und erstellt `Deployment` + `Service` + `HPA` (min 2, max 10, target CPU 70%) + `PDB` (minAvailable 1) + `ServiceMonitor` für Prometheus.
3. Ein vorgekabeltes Grafana Dashboard Template wird automatisch aus dem `ServiceMonitor` bereitgestellt — zeigt Request Rate, Error Rate, p99 Latency, Replica Count.
4. `catalog-info.yaml` ist in der Repository-Root committed und wird automatisch in Backstage bei Repository-Erstellung registriert.
5. Ein Team erstellt einen neuen Service, indem es in Backstage auf „Erstellen" klickt, Name und Owner ausfüllt — in 30 Minuten läuft er in Produktion, ohne Infrastruktur-Code zu berühren.

---
