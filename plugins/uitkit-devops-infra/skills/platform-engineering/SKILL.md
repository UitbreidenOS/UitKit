---
name: "platform-engineering"
description: "Building internal developer platforms (IDPs), creating golden path service templates that encode organizational standards, setting up Backstage ser..."
---

# Platform Engineering

## When to activate
Building internal developer platforms (IDPs), creating golden path service templates that encode organizational standards, setting up Backstage service catalog or scaffolder templates, designing self-service infrastructure provisioning, building Kubernetes abstractions to reduce developer cognitive load, or improving DORA metrics by standardizing how teams ship software.

## When NOT to use
One-off infrastructure work for a single team (just use Terraform directly). General Kubernetes cluster administration not aimed at improving the developer experience. Feature work inside a product service — platform engineering is about the system teams use to build and deploy software, not the software itself. Avoid building the platform before you have pain points — premature platformization creates overhead without payoff.

## Instructions

### The Golden Path Principle

A golden path is an opinionated, fully integrated service template that pre-wires everything a team needs to go from "new service" to "running in production" without making architectural decisions. The platform team owns the path; product teams follow it or explicitly opt out with documented justification.

A complete golden path includes:
- `Dockerfile` — multi-stage, non-root user, health check
- Kubernetes manifests — `Deployment`, `Service`, `HPA`, `PDB`, `NetworkPolicy`
- GitHub Actions CI workflow — lint, test, build, push, deploy
- Observability — Prometheus metrics endpoint, structured JSON logs, pre-built Grafana dashboard, default alerts
- Backstage catalog entry — `catalog-info.yaml` pre-populated
- Service secrets wiring — external-secrets operator manifests pointing at Vault/AWS Secrets Manager
- README scaffold — architecture decision record (ADR) template

### Backstage Catalog Entry

Every service must have a `catalog-info.yaml` committed to its root:

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

Scaffolder templates are the entry point for the golden path — they generate a new repository with all the pre-wired files:

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

### Kubernetes CRD Abstraction

Expose a high-level `WebService` CRD that generates all the lower-level resources — teams describe intent, not implementation:

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

The platform operator generates: `Deployment` + `Service` + `HPA` + `PDB` (minAvailable=1) + `ServiceMonitor` + `NetworkPolicy`. The team never writes any of these directly.

Implement with [Operator SDK](https://sdk.operatorframework.io/) or a simple Helm post-renderer if a full operator is too heavyweight for the current stage.

### Terraform Modules with Sane Defaults

Platform modules expose only the variables that product teams should vary; everything else is defaulted to org standards:

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

Teams cannot opt out of encryption or monitoring — those are not variables.

### Platform Contract

Document what the platform guarantees versus what teams own. Ambiguity here causes the most friction:

| Platform Guarantees | Team Owns |
|---|---|
| Base image patching (weekly) | Business logic |
| Cluster uptime SLA (99.9%) | Data schema migrations |
| Centralized log aggregation | Application-level error handling |
| Secret rotation at the infra layer | API contracts and versioning |
| HPA + node autoscaling | Service-level SLOs |
| Ingress TLS termination | Feature flags and A/B logic |

Publish this contract in Backstage TechDocs so teams know what to escalate to the platform team versus what they fix themselves.

### DORA Metrics as Platform Health KPIs

Platform investment should move DORA metrics. Track these at the org level:

```
Deployment Frequency     → how often teams ship to prod
Lead Time for Changes    → commit to prod elapsed time
Change Failure Rate      → % of deploys causing incidents
Mean Time to Restore     → how fast from incident to recovery
```

A 3-day lead time with a 5% change failure rate is a sign the golden path CI or deployment process has too much friction or insufficient testing. Surface these metrics in the Backstage homepage so every team sees their own numbers.

## Example

Design a golden path template for a new Python microservice:

1. Scaffolder template in Backstage generates a new GitHub repo with: `Dockerfile` (multi-stage, non-root, healthcheck), FastAPI app skeleton, `k8s/` directory with `WebService` CRD manifest, GitHub Actions workflow (ruff lint → pytest → docker build → push to ECR → kubectl apply).
2. The platform Kubernetes operator reconciles `WebService` CRDs and creates `Deployment` + `Service` + `HPA` (min 2, max 10, target CPU 70%) + `PDB` (minAvailable 1) + `ServiceMonitor` for Prometheus.
3. A pre-wired Grafana dashboard template is provisioned automatically from the `ServiceMonitor` — shows request rate, error rate, p99 latency, replica count.
4. `catalog-info.yaml` is committed to the repo root and auto-registered in Backstage on repo creation.
5. A team creates a new service by clicking "Create" in Backstage, filling in name and owner — they are running in production within 30 minutes without touching any infrastructure code.

---
