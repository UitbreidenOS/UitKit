# Plattform Engineering

## Wanneer activeren
Bouwen van internal developer platforms (IDPs), creëren van golden path service templates die organisationale normen coderen, instellen van Backstage service catalog of scaffolder templates, ontwerpen van self-service infrastructure provisioning, bouwen van Kubernetes abstractions om developer cognitive load te reduceren, of verbeteren van DORA metrics door standaardiseren hoe teams software uitrollen.

## Wanneer niet gebruiken
One-off infrastructure werk voor een enkel team (use Terraform direct). Algemene Kubernetes cluster administratie niet gericht op developer experience. Feature werk in product service — platform engineering gaat over het systeem dat teams gebruiken om software te bouwen en te deployen, niet over de software zelf. Vermijd platform te bouwen voordat je pijnpunten hebt — voortijdige platformisering creëert overhead zonder voordeel.

## Instructies

### Het Golden Path Principe

Een golden path is een opinionated, volledig geïntegreerde service template die alles pre-wired wat een team nodig heeft om van 'new service' naar 'running in production' te gaan zonder architectuurbeslissingen te nemen. Het platform team bezit het path; product teams volgen het of kiezen expliciet ervoor af te wijken met gedocumenteerde justificatie.

Een compleet golden path omvat:
- `Dockerfile` — multi-stage, non-root user, health check
- Kubernetes manifests — `Deployment`, `Service`, `HPA`, `PDB`, `NetworkPolicy`
- GitHub Actions CI workflow — lint, test, build, push, deploy
- Observability — Prometheus metrics endpoint, structured JSON logs, pre-built Grafana dashboard, default alerts
- Backstage catalog entry — `catalog-info.yaml` pre-populated
- Service secrets wiring — external-secrets operator manifests pointing at Vault/AWS Secrets Manager
- README scaffold — architecture decision record (ADR) template

### Backstage Catalog Entry

Elk service moet een `catalog-info.yaml` hebben gecommit naar zijn root:

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

Scaffolder templates zijn het inganspunt voor het golden path — ze genereren een nieuw repository met alle pre-wired files:

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

### Kubernetes CRD Abstractie

Stel een high-level `WebService` CRD bloot die alle lower-level resources genereert — teams beschrijven intent, niet implementatie:

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

De platform operator genereert: `Deployment` + `Service` + `HPA` + `PDB` (minAvailable=1) + `ServiceMonitor` + `NetworkPolicy`. Het team schrijft nooit direct een van deze.

Implementeer met [Operator SDK](https://sdk.operatorframework.io/) of een eenvoudige Helm post-renderer als een volledig operator te zwaar is voor het huidige stadium.

### Terraform Modules met Sensibele Defaults

Platform modules stellen alleen variabelen bloot die product teams zouden moeten variëren; alles anders is standaard ingesteld op organisatienormen:

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

Teams kunnen niet afzien van encryptie of monitoring — dit zijn geen variabelen.

### Platform Contract

Documenteer wat het platform garandeert versus wat teams bezitten. Ambiguïteit veroorzaakt hier de meeste wrijving:

| Platform Garanties | Team Bezit |
|---|---|
| Base image patching (weekly) | Business logic |
| Cluster uptime SLA (99.9%) | Data schema migrations |
| Centralized log aggregation | Application-level error handling |
| Secret rotation at infra layer | API contracts and versioning |
| HPA + node autoscaling | Service-level SLOs |
| Ingress TLS termination | Feature flags and A/B logic |

Publiceer dit contract in Backstage TechDocs zodat teams weten wat ze moeten escaleren naar het platform team versus wat zij zelf repareren.

### DORA Metrics als Platform Health KPIs

Platform investering zou DORA metrics moeten verplaatsen. Track deze op organisatie niveau:

```
Deployment Frequency     → how often teams ship to prod
Lead Time for Changes    → commit to prod elapsed time
Change Failure Rate      → % of deploys causing incidents
Mean Time to Restore     → how fast from incident to recovery
```

Een 3-daagse lead time met 5% change failure rate is een teken dat het golden path CI of deployment proces te veel wrijving of onvoldoende testing heeft. Zet deze metrics op de Backstage homepage zodat elk team hun eigen nummers ziet.

## Voorbeeld

Ontwerp een golden path template voor een nieuwe Python microservice:

1. Het Scaffolder template in Backstage genereert een nieuw GitHub repository met: `Dockerfile` (multi-stage, non-root, healthcheck), FastAPI app skeleton, `k8s/` directory met `WebService` CRD manifest, GitHub Actions workflow (ruff lint → pytest → docker build → push to ECR → kubectl apply).
2. De platform Kubernetes operator reconcilieert `WebService` CRDs en creëert `Deployment` + `Service` + `HPA` (min 2, max 10, target CPU 70%) + `PDB` (minAvailable 1) + `ServiceMonitor` voor Prometheus.
3. Een pre-wired Grafana dashboard template wordt automatisch ingericht vanuit `ServiceMonitor` — toont request rate, error rate, p99 latency, replica count.
4. `catalog-info.yaml` is gecommit naar repo root en auto-registered in Backstage op repo creatie.
5. Een team creëert een nieuw service door op 'Creëren' in Backstage te klikken, naam en owner in te vullen — draait in productie binnen 30 minuten zonder infrastructuurcode aan te raken.

---
