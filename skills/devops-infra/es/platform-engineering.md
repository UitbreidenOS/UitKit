# Ingeniería de Plataformas

## Cuándo activar
Construcción de plataformas internas para desarrolladores (IDPs), creación de plantillas de servicio de ruta dorada que codifiquen normas organizacionales, configuración de catálogo de servicios Backstage o plantillas de scaffolder, diseño de provisión de infraestructura de autoservicio, construcción de abstracciones de Kubernetes para reducir la carga cognitiva de los desarrolladores, o mejora de métricas DORA estandarizando cómo los equipos despliegan software.

## Cuándo no usar
Trabajo de infraestructura de una sola vez para un único equipo (use Terraform directamente). Administración general de cluster de Kubernetes no orientada a mejorar la experiencia del desarrollador. Trabajo de características en un servicio de producto — la ingeniería de plataforma se trata del sistema que los equipos usan para construir y desplegar software, no del software mismo. Evite construir la plataforma antes de tener puntos de dolor — la platformización prematura crea gastos sin beneficio.

## Instrucciones

### El Principio de Ruta Dorada

Una ruta dorada es una plantilla de servicio opinada, completamente integrada, que pre-conecta todo lo que un equipo necesita para pasar de "nuevo servicio" a "ejecutándose en producción" sin tomar decisiones arquitectónicas. El equipo de plataforma posee la ruta; los equipos de producto la siguen u optan explícitamente por desviarse con justificación documentada.

Una ruta dorada completa incluye:
- `Dockerfile` — multi-etapa, usuario no-root, health check
- Manifiestos de Kubernetes — `Deployment`, `Service`, `HPA`, `PDB`, `NetworkPolicy`
- Flujo de trabajo CI de GitHub Actions — lint, test, build, push, deploy
- Observabilidad — endpoint de métricas Prometheus, logs JSON estructurados, dashboard de Grafana pre-construido, alertas predeterminadas
- Entrada de catálogo Backstage — `catalog-info.yaml` pre-rellenado
- Cableado de secretos de servicio — manifiestos de operador de secretos externos apuntando a Vault/AWS Secrets Manager
- Andamiaje de README — plantilla de registro de decisiones arquitectónicas (ADR)

### Entrada de Catálogo Backstage

Cada servicio debe tener un `catalog-info.yaml` comprometido en su raíz:

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

### Plantilla de Scaffolder de Backstage

Las plantillas de Scaffolder son el punto de entrada para la ruta dorada — generan un nuevo repositorio con todos los archivos pre-conectados:

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

### Abstracción de CRD de Kubernetes

Exponga un CRD `WebService` de alto nivel que genere todos los recursos de bajo nivel — los equipos describen la intención, no la implementación:

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

El operador de plataforma genera: `Deployment` + `Service` + `HPA` + `PDB` (minAvailable=1) + `ServiceMonitor` + `NetworkPolicy`. El equipo nunca escribe ninguno de estos directamente.

Implemente con [Operator SDK](https://sdk.operatorframework.io/) o un simple post-renderizador de Helm si un operador completo es demasiado pesado para la etapa actual.

### Módulos de Terraform con Valores Predeterminados Sensibles

Los módulos de plataforma exponen solo las variables que los equipos de producto deberían variar; todo lo demás toma valores predeterminados según las normas organizacionales:

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

Los equipos no pueden optar por no tener cifrado o monitoreo — estos no son variables.

### Contrato de Plataforma

Documente qué garantiza la plataforma versus qué poseen los equipos. La ambigüedad aquí causa la mayor fricción:

| Garantías de Plataforma | Equipo Posee |
|---|---|
| Parches de imagen base (semanales) | Lógica de negocio |
| SLA de disponibilidad del cluster (99,9%) | Migraciones de esquema de datos |
| Agregación centralizada de logs | Manejo de errores a nivel de aplicación |
| Rotación de secretos en nivel de infraestructura | Contratos de API y versionamiento |
| HPA + escalado automático de nodos | SLOs a nivel de servicio |
| Terminación TLS de Ingress | Feature flags y lógica A/B |

Publique este contrato en Backstage TechDocs para que los equipos sepan qué escalar al equipo de plataforma versus qué arreglan ellos mismos.

### Métricas DORA como KPIs de Salud de Plataforma

La inversión en plataforma debe mover métricas DORA. Rastree estas a nivel organizacional:

```
Deployment Frequency     → how often teams ship to prod
Lead Time for Changes    → commit to prod elapsed time
Change Failure Rate      → % of deploys causing incidents
Mean Time to Restore     → how fast from incident to recovery
```

Un tiempo de entrega de 3 días con una tasa de falla de cambios del 5% es una señal de que el CI de ruta dorada o el proceso de implementación tiene demasiada fricción o pruebas insuficientes. Resalte estas métricas en la página de inicio de Backstage para que cada equipo vea sus propios números.

## Ejemplo

Diseñe una plantilla de ruta dorada para un nuevo microservicio de Python:

1. La plantilla de Scaffolder en Backstage genera un nuevo repositorio de GitHub con: `Dockerfile` (multi-etapa, no-root, healthcheck), esqueleto de aplicación FastAPI, directorio `k8s/` con manifiesto CRD `WebService`, flujo de trabajo de GitHub Actions (ruff lint → pytest → docker build → push a ECR → kubectl apply).
2. El operador de Kubernetes de plataforma reconcilia CRDs de `WebService` y crea `Deployment` + `Service` + `HPA` (min 2, max 10, target CPU 70%) + `PDB` (minAvailable 1) + `ServiceMonitor` para Prometheus.
3. Una plantilla de dashboard de Grafana pre-conectada se proporciona automáticamente desde `ServiceMonitor` — muestra tasa de solicitudes, tasa de errores, latencia p99, conteo de réplicas.
4. `catalog-info.yaml` está comprometido en la raíz del repositorio y se registra automáticamente en Backstage al crear el repositorio.
5. Un equipo crea un nuevo servicio haciendo clic en "Crear" en Backstage, rellenando nombre y propietario — está ejecutándose en producción dentro de 30 minutos sin tocar ningún código de infraestructura.

---
