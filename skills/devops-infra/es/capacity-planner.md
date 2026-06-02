---
name: capacity-planner
description: "Planificación de capacidad de infraestructura: previsión de necesidades de recursos, proyecciones de costos, recomendaciones de escalado"
---

# Habilidad: Planificador de Capacidad de Infraestructura

## Cuándo activar
- Planificar la infraestructura antes del lanzamiento de un producto o un pico de tráfico
- Prever los costos en la nube para el próximo trimestre o año fiscal
- Decidir cuándo escalar un servicio horizontal o verticalmente
- Evaluar si reservar instancias o usar precios bajo demanda
- Preparar un presupuesto de infraestructura para una conversación de financiamiento
- Redimensionar recursos sobreaprovisionados para reducir el gasto en la nube
- Planificar la capacidad de base de datos ante el crecimiento de los datos

## Cuándo NO usar
- Decisiones de escalado en incidentes en tiempo real — use `/incident-response`
- Rediseño de arquitectura — use `/aws-architect`, `/gcp-architect` o `/azure-architect`
- Definición de SLO y presupuesto de error — use `/slo-architect`
- Optimización de costos del gasto existente (redimensionamiento, instancias reservadas) sin un contexto de planificación — use una herramienta de costos dedicada

## Instrucciones

### Prompt principal de planificación de capacidad

```
Build a capacity plan for [SERVICE or SYSTEM] for the next [3 / 6 / 12] months.

Current state:
- Service: [what it does]
- Traffic: [current requests/day or RPS]
- Infrastructure: [current compute — e.g., 3x t3.medium EC2, 2 Kubernetes pods, etc.]
- Database: [type, instance size, current storage used]
- Current monthly cloud cost: [$X]
- Current utilisation: [CPU: X%, Memory: X%, DB connections: X of Y]

Growth assumptions:
- Expected traffic growth: [X% per month / flat / specific event-driven spike]
- Expected data growth: [GB/month stored in database or object storage]
- Planned product launches: [any events that will cause sudden spikes]

Constraints:
- SLO: [availability target, latency SLO]
- Budget ceiling: [$X/month max]
- Cloud provider: [AWS / GCP / Azure]
- Existing commitments: [any reserved instances or savings plans already purchased]

Produce:

## 1. Capacity forecast
Projected resource needs at: [3 months out / 6 months / 12 months]
- Compute: current vs. needed
- Memory: current vs. needed
- Database: storage and IOPS growth
- Bandwidth / data transfer costs
- CDN or caching layer impact

## 2. Scaling triggers
At what metric threshold should we scale?
- CPU > X% sustained for Y minutes → scale out by Z replicas
- Memory > X% → vertical scale to next tier or add swap
- DB connections > X% of max → consider connection pooling (PgBouncer) or read replica

## 3. Cost projection
| Month | Compute | Database | Storage | Bandwidth | Total |
|---|---|---|---|---|---|
| Now | $X | $X | $X | $X | $X |
| +3mo | $X | $X | $X | $X | $X |
| +6mo | $X | $X | $X | $X | $X |
| +12mo | $X | $X | $X | $X | $X |

## 4. Scaling recommendations
Concrete actions in order:
1. [What to do now — immediate action]
2. [What to do in 30-60 days]
3. [What to plan for at 6 months]

## 5. Cost optimisation opportunities
Savings available without reducing capacity:
- Reserved instances / savings plans: $X/month saved if purchased now
- Rightsizing: [specific instances that are over-provisioned]
- Storage tiering: [any data that can move to cheaper storage]
- Caching: [what can be cached to reduce DB load and compute cost]
```

### Modelo de escalado basado en tráfico

```
Build a scaling model for [SERVICE] based on traffic patterns.

Current traffic data:
- Average RPS (requests per second): [X]
- Peak RPS (highest observed): [X]
- Daily traffic pattern: [flat / morning peak / evening peak / bursty]
- Weekly pattern: [weekday-heavy / weekend-heavy / flat]

Service characteristics:
- Average request latency: [Xms at current load]
- CPU per request (approximate): [X% per pod per 100 RPS]
- Memory per request: [X MB working set per pod]
- Stateless or stateful: [stateless = easy to scale horizontally]

Scaling model output:

For each RPS level:
| RPS | Pods needed | CPU headroom | Latency estimate | Cost/month |
|---|---|---|---|---|
| [Current: X] | [Y pods] | [X% headroom] | [Xms] | $X |
| [2x growth] | | | | |
| [5x growth] | | | | |
| [10x growth] | | | | |

Horizontal scaling rules:
- Scale out when: CPU > [X]% for [Y] minutes OR RPS > [Z]
- Scale in when: CPU < [X]% for [Y] minutes AND RPS < [Z]
- Minimum pods: [N] (for availability during scaling events)
- Maximum pods: [N] (cost ceiling or account limit)

HPA (Horizontal Pod Autoscaler) config for Kubernetes:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: [service-name]
  namespace: [namespace]
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: [service-name]
  minReplicas: [N]
  maxReplicas: [N]
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

Generate the scaling model for my service.
```

### Planificación de capacidad de base de datos

```
Plan database capacity for [SERVICE] over [N] months.

Current state:
- Database: [PostgreSQL / MySQL / MongoDB / DynamoDB / etc.]
- Instance: [current instance type and size]
- Storage: [current used / total provisioned]
- Connections: [current active connections / max connections]
- Largest tables: [name: X GB, name: Y GB]
- Query patterns: [read-heavy 80/20 / write-heavy / balanced]
- Backup retention: [X days]

Growth inputs:
- New data per day: [X GB / X rows in largest table]
- Monthly growth rate: [X%]
- Any planned data migrations or schema changes: [describe]

Database capacity plan output:

## Storage forecast
| Month | Data size | Index size | Total | Storage cost |
|---|---|---|---|---|
| Now | X GB | X GB | X GB | $X |
| +3mo | | | | |
| +6mo | | | | |
| +12mo | | | | |

Storage alert thresholds:
- Amber: storage > 70% full → plan upgrade
- Red: storage > 85% full → upgrade within 1 week

## Connection capacity
Current max connections for [instance type]: [N]
Current usage: [X connections, X% of max]
Connection pool recommendation:

If using PgBouncer or RDS Proxy:
- Pool size per application instance: [N]
- Max clients: [N]
- Pool mode: [transaction / session — transaction recommended for stateless APIs]

## Instance upgrade trigger
Upgrade instance when:
- Average CPU > 70% for > 30 minutes daily
- Free storage < 20% of total
- Read IOPS > 80% of provisioned IOPS consistently
- P99 query latency > [X]ms for top 10 queries

Next instance tier: [current] → [recommended next] at [X months]
Cost delta: $X/month additional

## Read replica consideration
Add a read replica when:
- Read:write ratio > 5:1
- Reporting/analytics queries are impacting primary performance
- Primary CPU is being driven by reads, not writes

Read replica cost: $X/month (same instance type as primary)
Connection routing: [describe how to route reads vs. writes in application code]
```

### Plan de capacidad para lanzamiento

```
Build a launch capacity plan for [PRODUCT / FEATURE / EVENT].

Launch details:
- What's launching: [describe]
- Expected launch date: [DATE]
- Traffic scenario (choose one or model all three):
  - Conservative: [X% of current traffic increase]
  - Base case: [X users in first 48 hours]
  - Optimistic: [X users, featured in [media / App Store / Product Hunt]]

Current infrastructure:
- Compute: [describe]
- Database: [describe]
- CDN / cache: [describe]
- Current capacity: [what's the maximum RPS the system can handle today?]

Launch plan output:

## Pre-launch checklist (infrastructure)
- [ ] Load test at [2x / 5x / 10x] expected peak traffic — document results
- [ ] Confirm auto-scaling is configured and tested
- [ ] Cache warm-up plan for static assets and common queries
- [ ] Database connection pool sized for peak connections
- [ ] CDN cache rules reviewed for new pages/assets
- [ ] Monitoring dashboards set up for launch day
- [ ] On-call engineer identified and briefed on runbook
- [ ] Rollback plan documented and tested

## Traffic scenarios and infrastructure needs
| Scenario | Peak RPS | Pods needed | DB connections | Action required |
|---|---|---|---|---|
| Conservative | X | N | X | [no change / minor tweak] |
| Base case | X | N | X | [pre-scale to N pods] |
| Optimistic | X | N | X | [temporary vertical scale + pre-warm] |

## Launch day procedure
T-24h: pre-scale compute to [N] pods (don't wait for autoscaler)
T-4h: warm CDN cache for all new pages
T-0: post in #engineering and tag on-call with launch dashboard link
T+1h: check error rates, latency, DB connections — compare to baseline
T+24h: review actual traffic vs. forecast, resize if over-provisioned

## Cost for launch period
Extra cost for [7 days of pre-scaled infrastructure]: $X
Rollback to normal provisioning after: [DATE] if traffic stabilises below [X] RPS
```

### Análisis de optimización de costos en la nube

```
Analyse my cloud costs and find savings opportunities.

Current monthly bill: [$X total]
Breakdown:
- Compute (EC2 / GKE nodes / Cloud Run): $X
- Database (RDS / Cloud SQL / Firestore): $X
- Storage (S3 / GCS / Azure Blob): $X
- Data transfer / CDN: $X
- Other (Lambda, SQS, monitoring, etc.): $X

Infrastructure inventory:
- Instances/nodes: [list with sizes and average utilisation]
- Databases: [list with sizes and average utilisation]
- Storage buckets: [total stored, access patterns]
- Any reserved instances or savings plans already in place: [list]

Analyse by category:

COMPUTE RIGHTSIZING:
- Instances with average CPU < 20%: candidates for downsizing
- Memory utilisation: over-provisioned instances
- Estimated savings from rightsizing: $X/month

RESERVED INSTANCES / SAVINGS PLANS:
- Break-even analysis: if we commit to [N]x [instance type] for 1 year, we save $X vs. on-demand
- Recommendation: which instances to reserve now vs. keep on-demand

STORAGE COST REDUCTION:
- S3 Intelligent Tiering for infrequently accessed data
- Log retention policy: reduce from [N] to [M] days → save $X/month
- Identify orphaned EBS volumes or snapshots: [common waste source]

DATABASE OPTIMISATION:
- Multi-AZ vs. single-AZ for dev/staging: save $X/month
- Aurora Serverless for variable workloads: break-even at [X hours/day utilisation]
- Read replicas that can be removed or downsized

Produce: ranked list of savings opportunities by monthly dollar impact, with implementation effort (low / medium / high).
```

## Ejemplo

**Usuario:** Estamos planeando hacer open source una herramienta y esperamos que aparezca en Product Hunt el próximo mes. Actualmente tenemos 2 instancias EC2 t3.medium detrás de un ALB, sirviendo 500 RPS al 45% de CPU. Esperamos un pico de tráfico de 5-10x el día del lanzamiento. La factura mensual es de 220 $.

**Resultado (extracto):**

```markdown
# Plan de Capacidad: Lanzamiento en Product Hunt

## Línea base actual
2x t3.medium (2 vCPU, 4 GB RAM) — 500 RPS al 45% de CPU.
Capacidad máxima estimada: ~1.100 RPS antes de la saturación de CPU.

## Escenarios de tráfico
| Escenario | RPS pico | Instancias requeridas | Margen |
|---|---|---|---|
| Conservador (5x) | 2.500 | 5x t3.medium | 20% |
| Caso base (7x) | 3.500 | 7x t3.medium | 10% |
| Optimista (10x+) | 5.000+ | 10x t3.medium o 5x t3.large | 15% |

## Acciones previas al lanzamiento (por prioridad)

**Ahora (hoy):**
- Habilitar EC2 Auto Scaling con min=2, max=12, escalado hacia fuera al CPU>60% durante 3 minutos
- Configurar el tiempo de enfriamiento de reducción en 15 minutos (evita oscilaciones después del pico)
- Verificar que la comprobación de estado del ALB esté correctamente configurada y responda en < 2s

**T-48h antes del lanzamiento:**
- Preescalar manualmente a 6 instancias (no dependa del autoescalador durante el pico — tarda 3-5 minutos)
- Ejecutar una prueba de carga a 3.500 RPS usando k6 o Locust — confirmar que la latencia se mantiene < 200ms

**T-4h:**
- Precalentar la caché de CloudFront para todos los activos estáticos en las nuevas páginas
- Si sirve contenido respaldado por base de datos: revisar las cabeceras cache-control

**Costo del día del lanzamiento:**
7 días de 6x t3.medium preescalado: ~90 $ adicionales
Si alcanza 10x y escala a 10 instancias: ~150 $ adicionales para la semana
Recomendación: preescalar, monitorear, reducir después de 48-72h cuando el tráfico se normalice.

**Qué monitorear el día del lanzamiento:**
- RequestCount del ALB (no solo RPS en su aplicación — el ALB es el indicador adelantado)
- Número de hosts saludables del grupo objetivo (debería mantenerse en N preescalado durante todo el período)
- Conexiones a la BD — t3.medium puede manejar ~50 conexiones cada una; con 10 instancias eso son 500 conexiones
- Si usa RDS: verificar las métricas FreeableMemory y DatabaseConnections
```

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
