# Claude para Ingenieros de DevOps y Plataforma

Todo lo que un ingeniero de DevOps o de plataforma necesita para ejecutar operaciones de infraestructura aumentadas con IA — respuesta a incidentes, runbooks, IaC, pipelines de CI/CD, planificación de capacidad, gestión de SLOs y los ritmos diarios para mantener la producción en buen estado.

---

## Para quién es esta guía

Eres un ingeniero de DevOps, SRE o ingeniero de plataforma responsable de la fiabilidad de la infraestructura, los pipelines de despliegue y la salud operativa de los sistemas en producción. Estás de guardia, escribes manifiestos de Terraform y Kubernetes, eres propietario de los pipelines de CI/CD y eres la primera línea de defensa cuando las cosas fallan.

**Antes de Claude Code:** 2 horas para escribir un runbook. 30 minutos para redactar un postmortem. Medio día para diseñar una nueva estrategia de monitoreo. Los cambios de IaC se revisan lentamente porque es difícil explicarlos a partes interesadas no técnicas.

**Después:** Runbook generado a partir del historial de incidentes en 20 minutos. Postmortem estructurado en 10 minutos. Módulos de Terraform redactados con valores predeterminados sensatos en una sesión. Estrategia de monitoreo diseñada con el contexto de SLO integrado.

---

## Instalación en 30 segundos

```bash
# Instalar el stack completo de DevOps/plataforma
npx claudient add skill devops-infra/kubernetes
npx claudient add skill devops-infra/terraform
npx claudient add skill devops-infra/docker
npx claudient add skill devops-infra/github-actions
npx claudient add skill devops-infra/observability-designer
npx claudient add skill devops-infra/incident-response
npx claudient add skill devops-infra/aws-architect
npx claudient add skill devops-infra/slo-architect
npx claudient add skill devops-infra/oncall-runbook
npx claudient add skill devops-infra/capacity-planner
npx claudient add agents roles/sre-engineer
npx claudient add agents roles/incident-commander
npx claudient add agents roles/platform-engineer
npx claudient add agents roles/kubernetes-architect
```

---

## Tu stack de DevOps en Claude Code

### Habilidades (comandos de barra)

| Habilidad | Qué hace | Cuándo usarla |
|---|---|---|
| `/incident-response` | Respuesta estructurada a incidentes: triage, sala de guerra, postmortem | Cualquier incidente en producción |
| `/oncall-runbook` | Genera runbooks a partir del historial de incidentes, audita los existentes | Antes de que nuevos servicios estén de guardia, después de incidentes |
| `/observability-designer` | Diseña estrategia de métricas, logs, trazas — Datadog, Prometheus, OTel | Nuevos servicios, huecos de monitoreo |
| `/slo-architect` | Define SLOs, presupuestos de error, umbrales de alertas | Nuevos servicios, revisiones de SLOs |
| `/capacity-planner` | Pronostica necesidades de recursos, proyecciones de costes, umbrales de escalado | Planificación trimestral, pre-lanzamiento |
| `/kubernetes` | Manifiestos de K8s, HPA, límites de recursos, depuración, políticas de red | Cualquier trabajo con K8s |
| `/terraform` | Módulos de IaC, gestión de estado, importación, revisión de planes | Cualquier aprovisionamiento de infraestructura |
| `/docker` | Dockerfiles, compilaciones multi-etapa, optimización de imágenes, compose | Trabajo con contenedores |
| `/github-actions` | Diseño de pipelines de CI/CD, optimización, secretos, caché | Trabajo de pipelines |
| `/aws-architect` | Diseño de arquitectura AWS: VPC, IAM, ECS, RDS, CloudFront | Infraestructura en AWS |

### Agentes

| Agente | Modelo | Cuándo activarlo |
|---|---|---|
| `sre-engineer` | Sonnet | Análisis de fiabilidad, diseño de SLOs, decisiones de presupuesto de error |
| `incident-commander` | Sonnet | Coordinación de incidentes graves, estructura de sala de guerra |
| `platform-engineer` | Sonnet | Experiencia del desarrollador, herramientas internas, diseño de plataforma |
| `kubernetes-architect` | Opus | Arquitectura K8s compleja, multi-cluster, service mesh |

---

## Flujo de trabajo diario

### Control de salud de la infraestructura por la mañana (15-20 minutos)

```
/observability-designer

Revisión de infraestructura matutina — [FECHA]:

Servicios: [lista tus servicios clave]
Período de tiempo: últimas 24 horas

Consulta tus dashboards y pega o describe:
- ¿Alguna alerta P1 o P2 disparada durante la noche?
- Tasas de error actuales de cada servicio versus SLO
- ¿Algún servicio con tasa de consumo del presupuesto de error > 1x (consumiendo más rápido de lo permitido)?
- Actividad de despliegue en las últimas 24 horas: ¿algún rollout en progreso o completado recientemente?
- Salud de la base de datos: retraso de replicación, conteo de conexiones, consultas lentas
- ¿Alguna anomalía de costes (pico en gasto en la nube)?

Resultado del triage:
- ¿Qué requiere acción hoy?
- ¿Qué vale la pena monitorear pero no es urgente?
- ¿Qué puedo cerrar sin acción?
```

### Planificación de cambios de infraestructura

```
/terraform (o /kubernetes o /aws-architect)

Estoy planificando este cambio de infraestructura: [describe]

Antes de implementar:
1. ¿Cuáles son los riesgos de este cambio?
2. ¿Qué debo probar en staging antes de aplicarlo a producción?
3. ¿Hay una forma más segura de hacer este cambio de manera incremental?
4. ¿Cuál es el plan de reversión si esto falla?
5. ¿Quién debería revisar esto antes de que lo aplique?
6. ¿Qué monitoreo debo observar inmediatamente después del cambio?

Cambio: [pega el plan de Terraform o el kubectl diff o describe el cambio]
```

### Mantenimiento de pipelines de CI/CD

```
/github-actions

Revisa y optimiza mi pipeline de CI/CD.

Pipeline actual: [pega el YAML del flujo de trabajo o describe]
Puntos de dolor: [builds lentos / tests inestables / problemas de gestión de secretos / fallos de caché]
Mejora deseada: [más rápido / más fiable / mejor seguridad / más económico]

Analiza:
1. ¿Cuál es la ruta crítica — qué pasos están ralentizando más el pipeline?
2. ¿Qué puede ejecutarse en paralelo que actualmente se ejecuta de forma secuencial?
3. ¿Hay oportunidades de caché que se están perdiendo?
4. ¿Algún antipatrón de seguridad (secretos hardcodeados, GITHUB_TOKEN con permisos excesivos, etc.)?
5. Versión optimizada del pipeline con explicaciones

Genera el YAML mejorado del flujo de trabajo.
```

---

## Flujos de trabajo clave por escenario

### Nuevo servicio saliendo a producción

```
Paso 1: Diseño de SLO
/slo-architect
Define los SLOs para [nombre del servicio]:
- Disponibilidad: ¿qué % de tiempo de actividad es aceptable?
- Latencia: objetivos p50 / p95 / p99
- Tasa de error: ¿qué tasa de error dispara una alerta?
- Presupuesto de error: ¿cuánto presupuesto de error por 30 días?

Paso 2: Observabilidad
/observability-designer
Diseña el stack de monitoreo para [servicio]:
- Métricas clave a instrumentar (método RED: Rate, Errors, Duration)
- Estructura y retención de logs
- Configuración de rastreo distribuido
- Diseño del dashboard para ingenieros de guardia

Paso 3: Runbook
/oncall-runbook
Genera el runbook inicial para [servicio]:
- Visión general del servicio
- Modos de fallo conocidos (incluso pre-lanzamiento — basados en la arquitectura)
- Ruta de escalada
- Respuestas a alertas del primer día

Paso 4: Base de capacidad
/capacity-planner
Establece la base de capacidad y los disparadores de escalado:
- Tráfico esperado en el lanzamiento
- Configuración de auto-escalado
- Previsión de costes para los primeros 3 meses
```

### Respuesta a incidentes

```
/incident-response

Incidente: [describe qué está ocurriendo]
Severidad: [P1 / P2 / P3]
Servicios afectados: [lista]
Impacto en clientes: [describe]
Momento de inicio: [¿cuándo empezó esto?]

Ejecuta respuesta estructurada al incidente:
1. Evaluación inicial y confirmación de severidad
2. Configuración de sala de guerra (a quién contactar, canal de comunicación)
3. Opciones de mitigación inmediata
4. Ruta de investigación (qué logs, métricas y trazas revisar primero)
5. Plantilla de comunicación a partes interesadas
6. Cuándo escalar versus cuándo seguir investigando
```

### Postmortem después de un incidente

```
/incident-response

Escribe el postmortem para [NOMBRE DEL INCIDENTE] del [FECHA].

Cronología (pega el historial de tu canal de incidentes o tus notas):
[pega la cronología]

Impacto:
- Duración: [X minutos]
- Servicios afectados: [lista]
- Clientes afectados: [N o %]
- Impacto en ingresos (si se conoce): [$X]

Causa raíz (lo que encontraste):
[describe]

Factores contribuyentes:
[describe]

Lo que hicimos bien:
[describe]

Genera: postmortem estructurado con cronología, análisis de causa raíz, factores contribuyentes, elementos de acción (con responsables y fechas de vencimiento), y el único cambio de monitoreo o alertas que habría detectado esto más rápido.
```

### Revisión de infraestructura de Terraform

```
/terraform

Revisa este plan de Terraform antes de aplicarlo a producción.

Entorno: [producción / staging]
Tipo de cambio: [nuevo recurso / modificación / destrucción]

Salida del plan:
[pega la salida del plan de terraform]

Revisa por:
1. Destrucciones de recursos inesperadas o arriesgadas
2. Configuraciones erróneas de seguridad (grupos de seguridad abiertos, buckets S3 públicos, exceso de permisos en IAM)
3. Etiquetas faltantes o violaciones de convenciones de nomenclatura
4. Cualquier problema de gestión de estado (datos sensibles en el estado, problemas de bloqueo de estado)
5. Estimación del impacto en costes del cambio

Además: ¿qué debo monitorear en los 30 minutos después de aplicar esto?
```

---

## Plan de 30 días (ingeniero de DevOps nuevo en un equipo o sistema)

### Semana 1 — Mapear el terreno
- Instala todas las habilidades y agentes de DevOps
- Ejecuta la auditoría `/oncall-runbook` en los 3 servicios más críticos — identifica huecos
- Mapea los SLOs actuales: ¿existen? ¿Se miden? Usa `/slo-architect` para evaluar
- Participa en un ciclo completo de incidente — incluso si no hay uno, revisa los últimos 3 postmortems

### Semana 2 — Construir confianza operativa
- Usa `/observability-designer` para construir un análisis de brechas de monitoreo — qué se está observando y qué no
- Ejecuta `/capacity-planner` en los 2 servicios principales — comprende el modelo de costes y escalado
- Configura un CLAUDE.md con el contexto de infraestructura (cuentas, clusters, servicios clave) para que Claude siempre tenga contexto

### Semana 3 — Mejorar el sistema
- Elige el peor runbook (el más vago, el más desactualizado) y reescríbelo con `/oncall-runbook`
- Optimiza un pipeline de CI/CD que esté causando más problemas con `/github-actions`
- Redacta o revisa un módulo de Terraform con `/terraform`

### Semana 4 — Apropiarse de una parte
- Toma tu primera guardia con los runbooks que has mejorado
- Ejecuta una simulación de chaos game day con `/incident-response` para probar tus runbooks
- Escribe tu primera previsión de capacidad para el próximo trimestre con `/capacity-planner`

---

## CLAUDE.md para ingenieros de DevOps

Crea un `CLAUDE.md` a nivel de proyecto para que Claude tenga contexto de infraestructura:

```markdown
# Contexto de infraestructura

Proveedor de nube: [AWS / GCP / Azure]
Región principal: [us-east-1 / europe-west1 / etc.]
Región secundaria: [si aplica]

## Servicios clave
- [nombre-del-servicio]: [qué hace, lenguaje, cluster/namespace]
- [nombre-del-servicio]: [...]

## Clusters de Kubernetes
- Producción: [nombre del cluster, método de acceso]
- Staging: [nombre del cluster]
- Herramientas: [nombre del cluster — para herramientas internas]

## IaC
- Herramienta: [Terraform / Pulumi / CDK]
- Estado: [bucket S3 / Terraform Cloud / local]
- Estructura de módulos: [monorepo / por servicio / biblioteca de módulos compartida]

## CI/CD
- Plataforma: [GitHub Actions / GitLab CI / CircleCI]
- Método de despliegue: [ArgoCD / Helm / kubectl directo / CDK pipelines]
- Entornos: [dev / staging / producción — ¿cómo se promueven?]

## Monitoreo
- Métricas: [Datadog / Prometheus + Grafana / CloudWatch]
- Logs: [Datadog / ELK / Loki]
- Trazas: [Datadog APM / Jaeger / Honeycomb]
- Alertas: [PagerDuty / OpsGenie]

## SLOs
- [servicio]: [definición del SLO]
- [servicio]: [...]

## Rotación de guardia
- Calendario: [nombre de la rotación en PagerDuty]
- Escalada: [nombre del responsable de ingeniería, Slack, teléfono]
```

---

## Integraciones de herramientas

### PagerDuty

```json
{
  "mcpServers": {
    "pagerduty": {
      "command": "npx",
      "args": ["-y", "@pagerduty/mcp-server"],
      "env": {
        "PAGERDUTY_API_KEY": "your-key"
      }
    }
  }
}
```

Con PagerDuty conectado, Claude puede extraer el historial de incidentes para generar runbooks, verificar los calendarios de guardia actuales y listar alertas recientes — sin cambiar de contexto.

### Datadog

Conecta el MCP de Datadog para que Claude pueda consultar métricas y logs directamente durante la respuesta a incidentes. En lugar de copiar dashboards, Claude puede ejecutar consultas en vivo e interpretar los resultados en contexto.

### AWS (mediante CLI o MCP)

Configura las credenciales de AWS en tu entorno. Claude Code puede entonces usar la herramienta Bash para ejecutar comandos de la CLI `aws` para el estado en vivo de la infraestructura — `aws ec2 describe-instances`, `aws cloudwatch get-metric-statistics`, `aws rds describe-db-instances` — en contexto con tu sesión de incidente o planificación de capacidad.

### Terraform Cloud

Conecta Terraform Cloud mediante la API para que Claude pueda leer las salidas de los planes y el historial de ejecuciones recientes. Combina con `/terraform` para sesiones de revisión previas a la aplicación donde Claude ve el plan real, no una descripción de él.

---

## Métricas a seguir

### Fiabilidad

| Métrica | Objetivo | Señal de alerta |
|---|---|---|
| Disponibilidad del servicio | Según SLO (p. ej., 99.9%) | Tasa de consumo del presupuesto de error > 2x |
| Latencia P99 | Según SLO (p. ej., < 500ms) | Incumplimiento sostenido por > 5 minutos |
| MTTR (tiempo medio de resolución) | < 30 min para P1 | > 60 min: brecha en runbooks o detección |
| MTTD (tiempo medio de detección) | < 5 min para P1 | > 15 min: brecha en alertas |
| Frecuencia de despliegue | Diaria a semanal | < Mensual: cuello de botella en la entrega |
| Tasa de fallos en cambios | < 5% | > 10%: problema de testing o revisión |

### Coste de infraestructura

| Métrica | Objetivo | Señal |
|---|---|---|
| Crecimiento de costes mes a mes | ≤ % de crecimiento del tráfico | Crecimiento más rápido: desperdicio |
| Utilización de CPU en la flota | Promedio 40-70% | < 30%: sobreaprovisionado |
| Cobertura de instancias reservadas | > 60% para cargas estables | < 40%: pagando de más bajo demanda |
| Coste por solicitud | Disminuyendo con el tiempo | Aumentando: problema de eficiencia |

---

## Errores comunes de DevOps que Claude Code ayuda a evitar

**Error 1: Runbooks desactualizados**
`/oncall-runbook` incluye una verificación de vigencia — cualquier runbook no actualizado en 90 días se marca. Usa el modo de auditoría antes de cada cambio de guardia.

**Error 2: Sorpresas de capacidad**
`/capacity-planner` construye una previsión de 12 meses con disparadores de escalado. Establece los umbrales de alerta de CPU a partir de la previsión, no de suposiciones.

**Error 3: SLOs sin presupuestos de error**
`/slo-architect` genera la definición completa del SLO incluyendo el cálculo del presupuesto de error. Nunca definas disponibilidad sin definir qué harás cuando el presupuesto se esté consumiendo.

**Error 4: Postmortems sin resultados accionables**
`/incident-response` genera postmortems con elementos de acción explícitamente asignados, responsables y fechas de vencimiento. "Mejoraremos el monitoreo" no es un elemento de acción.

**Error 5: Cambios de Terraform aplicados sin revisión**
`/terraform` incluye un análisis de riesgos y un plan de reversión para cada revisión de plan. Ejecútalo antes de cada `terraform apply` en producción.

---

## Recursos

- [Comenzar con Claude Code](getting-started.md)
- [Flujo de trabajo de incidentes de DevOps](../workflows/devops-incident.md)
- [Habilidad de runbook de guardia](../skills/devops-infra/oncall-runbook.md)
- [Habilidad de planificación de capacidad](../skills/devops-infra/capacity-planner.md)
- [Habilidad de arquitecto de SLOs](../skills/devops-infra/slo-architect.md)
- [Agente de ingeniero SRE](../agents/roles/sre-engineer.md)

---

> **Trabaja con nosotros:** Claudient está respaldado por [Uitbreiden](https://uitbreiden.com/) — construimos productos de IA y soluciones B2B con comunidades de desarrolladores.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
