# Runbook de producción agentic

Playbook operacional para monitoreo, alertas y recuperación de workflows multi-agentes en producción — define SLOs, respuesta a incidentes, procedimientos de reversión y caminos de escalada.

---

## Cuándo usar

- Ejecución de workflows multi-agentes en producción manejando solicitudes de usuario en vivo o trabajos por lotes críticos
- Workflows con requisitos SLO (tiempo de respuesta, disponibilidad, costo)
- Sistemas que deben mantener consistencia bajo fallos parciales
- Despliegues que requieren recuperación automática o procedimientos de escalada manual

No usar para workflows experimentales o solo de desarrollo, o trabajos por lotes únicos sin restricciones de tiempo real.

---

## SLOs y presupuestos de error

Defina objetivos de disponibilidad y rendimiento para workflow multi-agente:

```json
{
  "workflow": "research_and_synthesize",
  "slo_version": "2026-06",
  "slos": [
    {
      "slo_id": "slo_availability",
      "metric": "workflow_success_rate",
      "target": "99.5%",
      "window": "30_days",
      "error_budget_pct": 0.5,
      "alert_threshold": "95%"
    },
    {
      "slo_id": "slo_latency_p99",
      "metric": "workflow_latency_ms",
      "target": 300000,
      "percentile": 99,
      "window": "7_days",
      "alert_threshold": 250000
    },
    {
      "slo_id": "slo_cost",
      "metric": "cost_per_workflow_cents",
      "target": 150,
      "window": "30_days",
      "alert_threshold": 130,
      "direction": "lower_is_better"
    }
  ],
  "error_budget_tracking": {
    "budget_available_pct": 0.42,
    "budget_consumed_pct": 0.08,
    "budget_remaining_days": 28,
    "burn_rate_pct_per_day": 0.0027
  }
}
```

**Reglas SLO:**
- Disponibilidad: porcentaje de workflows que se completan exitosamente
- Latencia: tiempo de respuesta de solicitud a salida final (p99 es típico)
- Costo: promedio de tokens/llamadas API por workflow
- Presupuesto de error: cuánto fallo es aceptable antes de paginar on-call

---

## Monitoreo y alertas

Métricas en tiempo real recopiladas de `.claude/workflow-metrics.jsonl`:

```json
{
  "metric_id": "metric_xyz789",
  "workflow": "research_and_synthesize",
  "timestamp": "2026-06-15T14:20:00Z",
  "execution_id": "exec_abc123",
  "metrics": {
    "workflow_status": "completed",
    "success": true,
    "latency_ms": 897000,
    "total_tokens": 24200,
    "cost_cents": 145,
    "agent_calls": 3,
    "retries": 0,
    "errors": 0,
    "timeout_count": 0
  },
  "agent_metrics": [
    {
      "agent": "researcher",
      "status": "completed",
      "latency_ms": 929000,
      "input_tokens": 2400,
      "output_tokens": 1850,
      "cost_cents": 78,
      "tool_calls": 5
    },
    {
      "agent": "analyst",
      "status": "completed",
      "latency_ms": 390000,
      "input_tokens": 3100,
      "output_tokens": 1200,
      "cost_cents": 48,
      "tool_calls": 1
    },
    {
      "agent": "writer",
      "status": "completed",
      "latency_ms": 78000,
      "input_tokens": 1800,
      "output_tokens": 890,
      "cost_cents": 19,
      "tool_calls": 0
    }
  ]
}
```

**Reglas de alerta (dispare inmediatamente):**

```json
{
  "alerts": [
    {
      "alert_id": "alert_workflow_failure",
      "condition": "success == false",
      "severity": "page",
      "throttle_seconds": 300,
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_latency_spike",
      "condition": "latency_ms > 600000",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_cost_spike",
      "condition": "cost_cents > 200",
      "severity": "warning",
      "throttle_seconds": 600,
      "action": "log_to_slack"
    },
    {
      "alert_id": "alert_agent_timeout",
      "condition": "any(agent_metrics.latency_ms > 300000)",
      "severity": "page",
      "action": "page_on_call"
    },
    {
      "alert_id": "alert_error_budget_exceeded",
      "condition": "burn_rate_pct_per_day > 0.01",
      "severity": "critical",
      "action": "page_engineering"
    }
  ]
}
```

---

## Respuesta a incidentes

Cuando alerta dispara, siga este playbook:

### SEV1: Fallo de workflow

Outage completo de servicio (success_rate < 90% o latencia > 10 min).

```
1. DECLARE INCIDENT
   ├─ Página on-call engineer
   ├─ Cree thread #incidents
   └─ Asigne IC (incident commander)

2. ASSESS IMPACT (5 min)
   ├─ ¿Cuántos workflows fallaron? (% de tráfico)
   ├─ ¿Qué agentes están fallando? (¿todos o agente específico?)
   ├─ ¿Cuánto tiempo ha pasado desde que comenzó?
   └─ ¿Está afectando usuarios? (¿impacto en ingresos?)

3. INVESTIGATE (5-15 min)
   ├─ Compruebe agent logs (últimas 30 llamadas de agent)
   ├─ Compruebe blackboard state (¿es estado coherente?)
   ├─ Compruebe infraestructura (almacenamiento, límites de tasa API)
   ├─ Compruebe agent model (¿está disponible modelo?)
   └─ Compruebe dependencias upstream (APIs que llamamos, ¿están abajo?)

4. MITIGATE (camino más corto a reducción de impacto usuario)
   ├─ Opción A: Deshabilitar workflow (feature flag)
   ├─ Opción B: Revertir a última versión de agent conocida como funcional
   ├─ Opción C: Escalar recursos (si es problema de capacidad)
   └─ Opción D: Aplicar hotfix de emergencia (si es corrección simple)

5. RESOLVE (después de mitigation)
   ├─ Arreglar root cause (código, configuración, infraestructura)
   ├─ Desplegar corrección
   ├─ Verificar que métricas vuelvan a normal
   └─ Planificar post-mortem

6. COMMUNICATE (continuo)
   ├─ Actualizaciones internas cada 30 min
   └─ Actualizaciones de página de estado de cliente
```

### SEV2: Timeout o degradación de agent

Uno agente consistentemente lento (latencia > 5 min) pero tasa de éxito general > 90%.

```
1. INVESTIGATE (10 min)
   ├─ ¿Qué agente está lento? (verifique agent_metrics.latency_ms)
   ├─ ¿Está consistentemente lento o intermitente?
   ├─ ¿Qué cambió? (¿nuevo modelo? ¿nuevo prompt? ¿nuevas herramientas?)
   └─ ¿Está bloqueando otros agentes? (¿writer esperando analyst?)

2. MITIGATE
   ├─ Opción A: Cambiar a modelo más rápido (Sonnet en lugar de Opus)
   ├─ Opción B: Reducir tamaño de entrada (p. ej. menos sources para analizar)
   ├─ Opción C: Agregar timeout e implementar fallback agent
   └─ Opción D: Deshabilitar workflow temporalmente

3. RESOLVE
   ├─ Análisis de root cause
   ├─ Desplegar corrección
   └─ Probar antes de re-habilitar
```

### SEV3: Pico de costo

Costo de workflow aumentó > 50% (cost_cents > 150 para slo_cost=100).

```
1. INVESTIGATE (5 min)
   ├─ ¿Aumentó conteo de token? (input_tokens, output_tokens)
   ├─ ¿Aumentó conteo de reintentos? (campo retries)
   ├─ ¿Cambió modelo? (p. ej. Haiku → Opus)
   └─ ¿Aumentó conteo de llamadas de herramientas?

2. MITIGATE
   ├─ Opción A: Reducir contexto de entrada (menos sources al analyst)
   ├─ Opción B: Cambiar a modelo más barato (si precisión aceptable)
   ├─ Opción C: Agregar capa de cache (resultados de investigación en cache por topic)
   └─ Opción D: Implementar presupuesto de tokens (abortar si > max_tokens)

3. RESOLVE
   ├─ Optimizar prompts de sistema (remover preamble verboso)
   ├─ Optimizar formateo de entrada (remover datos redundantes)
   └─ Agregar límite de tokens explícito a llamadas de agent
```

---

## Procedimientos de reversión

### Reversión de versión de agent

Si nueva versión de agent causa fallos:

```bash
# Current production agents
agents/roles/researcher.md@HEAD
agents/roles/analyst.md@HEAD
agents/roles/writer.md@HEAD

# Previous stable version (known to work)
agents/roles/researcher.md@v1.2.3
agents/roles/analyst.md@v1.2.3
agents/roles/writer.md@v1.2.3

# Rollback
git checkout v1.2.3 -- agents/roles/
# Verify in staging
# Deploy to production
```

### Reversión de configuración de workflow

Si cambio de esquema blackboard o contrato de coordinación rompe workflows:

```bash
# Current config
workflows/agent-team-kickoff.md@HEAD

# Previous stable config
workflows/agent-team-kickoff.md@v1.1.0

# Rollback
git checkout v1.1.0 -- workflows/agent-team-kickoff.md
# Verify in staging
# Deploy to production
```

**Lista de verificación de reversión:**
- [ ] Identificar qué componente está roto
- [ ] Identificar versión estable previa
- [ ] Verificar corrección en ambiente staging (reproducir 10 ejecuciones recientes)
- [ ] Realizar reversión
- [ ] Monitorear métricas por 30 minutos
- [ ] Si métricas normales, declarar recuperado
- [ ] Si aún falla, escalar a equipo de ingeniería

---

## Caminos de escalada

```
Usuario reporta error
       ↓
Alerta dispara (SEV3: advertencia)
       ↓
Registrar a #ops-alerts Slack
       ↓
Esperar 10 min para recuperación automática
       ↓
       ├─ ¿Recuperado? → Cerrar ticket, planificar RCA
       │
       └─ ¿Aún falla?
              ↓
         Alerta dispara (SEV2: página)
              ↓
         Página on-call engineer
              ↓
         ¿Confirmación en 5 min?
              ↓
         ├─ SÍ → Comenzar mitigación
         │
         └─ NO → Escalar a backup on-call
                ↓
         Página backup engineer
                ↓
         ¿Confirmación en 5 min?
                ↓
         ├─ SÍ → Comenzar mitigación
         │
         └─ NO → Página engineering manager
                ↓
         Declarar SEV1
                ↓
         Respuesta de incidente all-hands
```

---

## Revisión post-incidente

Después de cada incidente SEV1 o SEV2, planificar RCA (post-mortem):

```json
{
  "rca_id": "rca_2026_06_15_001",
  "incident_id": "inc_abc123",
  "workflow": "research_and_synthesize",
  "date": "2026-06-15",
  "severity": "SEV1",
  "duration_minutes": 18,
  "impact": {
    "workflows_failed": 847,
    "revenue_lost": 12340
  },
  "timeline": [
    {"time": "14:02", "event": "Alert fired: success_rate < 90%"},
    {"time": "14:05", "event": "On-call paged"},
    {"time": "14:08", "event": "Identified analyst timeout"},
    {"time": "14:15", "event": "Rolled back analyst to v1.2.3"},
    {"time": "14:20", "event": "Metrics recovered"}
  ],
  "root_cause": "Analyst agent system prompt was too verbose, causing token overflow and timeout",
  "contributing_factors": [
    "No token budget enforced at agent level",
    "Analyst timeout not caught by circuit breaker"
  ],
  "action_items": [
    {
      "action": "Add token budget to agent calls (max 5000 tokens)",
      "assigned_to": "alice@example.com",
      "due_date": "2026-06-20"
    },
    {
      "action": "Implement circuit breaker (fail fast after 3 timeouts)",
      "assigned_to": "bob@example.com",
      "due_date": "2026-06-25"
    },
    {
      "action": "Add agent latency SLI to monitoring dashboard",
      "assigned_to": "charlie@example.com",
      "due_date": "2026-06-18"
    }
  ]
}
```

---

## Ejemplo: Respuesta a incidente

**Incidente:** Pico de fallo de workflow el 2026-06-15 a las 14:02 UTC.

```
14:02 → Alert fires: "research_and_synthesize success_rate = 85% (target 99.5%)"
14:02 → On-call paged
14:05 → IC (Alice) joins war room
14:05 → IC assess impact: ~800 workflows failed in last 3 minutes
14:07 → IC checks metrics: analyst agent latency spiked to 15 minutes (normal: 6 min)
14:09 → IC checks logs: analyst model API rate limited (hitting OpenAI quota? no, we use Anthropic)
14:10 → IC hypothesis: Analyst system prompt changed in last deploy
14:11 → IC checks git: Analyst prompt was updated 45 min ago
14:12 → IC reviews change: Added extensive reasoning preamble (200 tokens)
14:13 → IC rolls back: git revert HEAD~1 -- agents/roles/analyst.md
14:14 → IC deploys to production
14:15 → IC monitors: latency decreasing, success_rate recovering
14:20 → Metrics normal: latency = 6m, success_rate = 99.6%
14:22 → IC closes incident
14:30 → RCA scheduled for 2026-06-16

Action items:
- Add token budget enforcement (max 5000 input tokens per agent)
- Implement circuit breaker (fail after 3 consecutive timeouts)
- Add pre-deploy validation (max system prompt size 1000 tokens)
```

---
