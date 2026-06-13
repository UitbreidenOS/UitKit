---
name: oncall-runbook
description: "Genera runbooks de guardia a partir del historial de incidentes: alertas comunes, pasos de resolución, rutas de escalada"
---

# Habilidad: Generador de Runbooks de Guardia

## Cuándo activar
- Redactar un runbook para un nuevo servicio que entra en producción
- Formalizar el conocimiento tácito antes de que un ingeniero salga de la rotación de guardia
- Generar plantillas de runbook a partir de informes de incidentes pasados o historial de PagerDuty
- Construir árboles de escalada para un nuevo equipo o nuevo límite de servicio
- Auditar runbooks existentes en cuanto a completitud y vigencia
- Incorporar a un nuevo ingeniero a una rotación de guardia

## Cuándo NO usar
- Respuesta a incidentes en tiempo real — use `/incident-response` en su lugar
- Diseño de infraestructura — use `/aws-architect`, `/terraform` o `/kubernetes`
- Planificación de recuperación ante desastres (RPO/RTO, estrategia de copias de seguridad) — esos son distintos de los runbooks
- Scripts de remediación automatizados — los runbooks documentan qué hacer; la automatización es una preocupación separada

## Instrucciones

### Generación principal de runbook a partir del historial de incidentes

```
Generate an on-call runbook for the [SERVICE NAME] service.

Input (provide as many as you have):
- Past incident reports or postmortems: [paste or describe]
- Existing PagerDuty alert names: [list]
- Known failure modes the team has seen: [describe]
- Current manual steps used to resolve common issues: [describe]
- Service architecture: [brief description — what it does, how it works, key dependencies]
- SLO for this service: [availability target, latency target]

Produce the runbook with this structure:

# [SERVICE NAME] On-Call Runbook

## Service overview (60-second context)
- What this service does: [one sentence]
- Who depends on it: [upstream and downstream services, customers affected]
- Technology stack: [language, framework, cloud provider, database, message queue]
- SLO: [availability X%, p99 latency < Xms]
- Data classification: [does it handle PII / payments / sensitive data?]
- Owner team: [team name, Slack channel, escalation contact]

## Architecture diagram (text representation)
[Draw a text-based flow: external traffic → load balancer → service → dependencies]

## Alert catalogue
For each known alert:

### ALERT: [alert name from PagerDuty/Datadog/etc.]
**Severity:** [P1 / P2 / P3]
**Meaning:** What does this alert tell you? What threshold was breached?
**Common causes (in order of frequency):**
1. [Most common cause — X% of occurrences]
2. [Second most common]
3. [Rare but serious cause]
**First 5 steps:**
1. [Step — include exact commands, not "check the logs"]
2. [Step with command: `kubectl logs -n [namespace] -l app=[service] --tail=100`]
3. [Step]
4. [Step]
5. [Step]
**Resolution patterns:**
- Cause A → do [specific action]
- Cause B → do [specific action]
- Cause C → escalate to [team/person] — do not attempt to fix yourself
**Escalate if:** [condition that means you need human or team help]
**Typical time to resolve:** [X-Y minutes]

## Escalation paths

| Severity | First responder | If unresolved after X min | Next escalation |
|---|---|---|---|
| P1 | On-call engineer | 15 min | Engineering lead → CTO |
| P2 | On-call engineer | 30 min | Engineering lead |
| P3 | On-call engineer | Next business day | — |

Contact list:
- On-call: [PagerDuty rotation]
- Engineering lead: [name, phone, Slack]
- Database owner: [name / team, for DB-related P1s]
- Infrastructure team: [Slack channel]
- Security team: [if data breach suspected — contact immediately]

## Common operations (non-incident)
[Tasks on-call engineers may be asked to do outside of incidents:]

### Restart a service pod
```bash
kubectl rollout restart deployment/[service-name] -n [namespace]
# Verify: kubectl rollout status deployment/[service-name] -n [namespace]
```

### Check current error rate
```bash
# Datadog query or Grafana dashboard link
# Or: kubectl logs command
```

### Manually trigger a redeployment
[Describe the process — is it a GitHub Action, ArgoCD sync, or manual step?]

## Known gotchas
Things that have tripped up on-call engineers before:
- [Gotcha 1: e.g., "Do not restart the queue consumer during peak hours — jobs in-flight will be lost"]
- [Gotcha 2: e.g., "The staging environment uses a shared database — changes there affect other teams"]
- [Gotcha 3]

## Runbook changelog
| Date | Change | Author |
|---|---|---|
| [DATE] | Initial creation | [Name] |

Generate this runbook with the incident history and service context I provide.
```

### Plantilla de runbook específico por alerta

```
Generate a detailed runbook for this specific alert: [ALERT NAME]

Alert source: [PagerDuty / Datadog / Prometheus / CloudWatch]
Alert definition: [paste the alert query or threshold — e.g., "error_rate > 5% for 5 minutes"]
Service affected: [service name]
Typical onset: [when does this alert usually fire — peak traffic, after deploy, random?]

Past incidents triggered by this alert: [paste incident history or describe patterns]

Generate a decision tree for this alert:

## [ALERT NAME] Runbook

### What this alert means
[Plain English — not "the threshold was breached" but what that means for users]

### Immediate severity assessment (first 2 minutes)
Ask yourself:
- Is this alert alone, or are related alerts firing? (check: [list related alerts to check])
- Is the error rate growing, stable, or recovering?
- Is this a new deployment in the last 30 minutes? (check: [deployment log location])
- Have I seen this before? (check: [incident history link])

### Decision tree

```
ALERT FIRES
│
├── Is this during or after a deploy?
│   YES → Check deploy logs → rollback if new code introduced the error
│   NO ↓
│
├── Is error rate > 20%?
│   YES → Page engineering lead immediately (P1)
│   NO ↓
│
├── Is the error rate growing?
│   YES → Start P2 response, escalate in 15 min if not improving
│   STABLE → P3 investigation, resolve by next business day
│
└── Is it a specific error type?
    TIMEOUT → [steps for timeout investigation]
    5xx → [steps for server error investigation]
    DB → [steps for database issue]
```

### Step-by-step investigation
[Numbered steps with exact commands and what to look for at each step]

### Resolution playbook
[For each common cause: exact resolution steps with commands]

### Post-resolution
After resolving: what do you need to do?
- Update incident in PagerDuty / Slack
- Any follow-up action (create ticket, notify stakeholders, update runbook)
- Postmortem required? [Yes for P1 / At on-call engineer's discretion for P2 / No for P3]
```

### Auditoría de runbook

```
Audit the quality of this runbook: [PASTE EXISTING RUNBOOK]

Rate each section and identify gaps:

COMPLETENESS CHECKLIST:
✅ Service overview with enough context for a new engineer
✅ All known alerts documented (not just the scary ones)
✅ Each alert has: meaning, common causes, step-by-step resolution
✅ Commands are exact (not "check the logs" but `kubectl logs -n X -l app=Y`)
✅ Escalation paths defined with actual names and contacts (not just roles)
✅ Known gotchas and anti-patterns documented
✅ Common operations documented (restart, scale, rollback)
✅ Runbook has been updated in last 90 days (stale runbooks are dangerous)

QUALITY SIGNALS:
❌ "Check the dashboard" without specifying which dashboard or what to look for
❌ Steps that require knowledge not in the runbook
❌ Escalation path says "contact the team" without a Slack channel or contact
❌ No mention of what NOT to do (often the most important part)
❌ Alert definitions that don't explain why the threshold matters

FRESHNESS CHECK:
When was this runbook last updated? If > 90 days: flag every procedure for accuracy.
Does it reference services, teams, or tools that may have changed?

Output: runbook score (1-10), top 5 gaps to fix, and a rewrite of the worst section.
```

### Runbook a partir de un postmortem

```
Generate a runbook section from this postmortem: [PASTE POSTMORTEM]

Extract:
1. The root cause of the incident
2. The detection method (how was it discovered? alert, customer report, engineer noticed?)
3. The timeline of resolution (what steps were taken, in what order)
4. What worked and what didn't
5. The follow-up action items that were completed (to avoid duplication)

Convert this into:
- One new alert entry in the runbook (if the alert didn't exist or was unclear)
- Or: one new section in "Known Gotchas" if this was a surprise that recurs
- The exact commands used in the resolution, with comments explaining why

If the postmortem identified a monitoring gap: draft the alert definition as well.
```

### Guía de incorporación para guardia

```
Generate an on-call onboarding guide for a new engineer joining the [SERVICE] rotation.

Their background: [senior engineer / mid-level / new to this codebase]
They are joining: [first solo on-call / shadowing first / first week]
Rotation schedule: [week on / week off / follow-the-sun]

Generate a structured onboarding guide:

## Before your first on-call week

Day 1:
- Read the full runbook — flag anything that isn't clear
- Spend 30 minutes reading the last 5 incident postmortems
- Set up PagerDuty, Datadog/Grafana, and Slack notifications
- Confirm you have access to: [list all systems needed — cloud console, Kubernetes, database read, etc.]

Day 2-3:
- Shadow a more experienced on-call engineer for a full shift
- Reproduce the top 2 most common incidents in staging (this builds muscle memory)
- Know where to find: [log locations, dashboards, deployment history, rollback process]

Before going solo:
- Walk through each alert in the runbook with a senior engineer: "What would you do first?"
- Know the escalation paths by heart: who do you call at 3am for a P1?
- Test your PagerDuty notifications — actually call yourself

## What to do on your first solo shift
- First 10 minutes: check the dashboard, confirm all services are healthy
- If an alert fires: runbook first, panic never
- When in doubt: escalate. It's always better to wake someone up and be wrong than to not wake them up and be right.
```

## Ejemplo

**Usuario:** Tenemos un servicio API Node.js llamado `billing-service`. Ha tenido 3 incidentes en los últimos 6 meses: (1) agotamiento del pool de conexiones Redis causando errores 503, (2) una consulta PostgreSQL lenta bloqueando todas las escrituras, (3) una fuga de memoria tras un despliegue que causó terminaciones OOM. No existe un runbook formal. Las alertas de PagerDuty son: `billing-service-503-rate-high`, `billing-service-latency-p99-high`, `billing-service-pod-oom`.

**Resultado (extracto):**

```markdown
# Runbook de Guardia: billing-service

## Descripción del servicio
billing-service es la API Node.js que gestiona todo el procesamiento de pagos y la generación de facturas.
Dependientes: panel de clientes, servicio de correo electrónico, entrega de webhooks.
SLO: 99,9% de disponibilidad, p99 < 500ms.
Propietario: #platform-eng | Guardia: rotación PagerDuty "billing-oncall"

## Alerta: billing-service-503-rate-high
**Severidad:** P1
**Significado:** Más del 1% de las solicitudes devuelven 503 — los clientes no pueden procesar pagos.

**Causas comunes:**
1. Agotamiento del pool de conexiones Redis (visto 2 veces — ocurre con tráfico alto o tras una fuga de conexiones)
2. Tiempo de espera de dependencia upstream (pasarela de pago o base de datos)
3. Fallo de despliegue (nuevos pods no saludables)

**Primeros 5 pasos:**
1. `kubectl get pods -n billing -l app=billing-service` — ¿están los pods en estado Running?
2. `kubectl logs -n billing -l app=billing-service --tail=200 | grep -i "redis\|connection\|error"` — buscar errores de Redis
3. Verificar el recuento de conexiones Redis: `redis-cli -h [host] info clients` — ¿está `connected_clients` cerca de `maxclients`?
4. Si es Redis: `kubectl rollout restart deployment/billing-service -n billing` (vacía el pool de conexiones)
5. Si los pods no están en Running: verificar el despliegue reciente — `kubectl rollout history deployment/billing-service -n billing`

**ADVERTENCIA CONOCIDA:** NO reiniciar billing-service durante una ventana de procesamiento de pagos (viernes 17h - sábado 2h) — las transacciones en curso quedarán huérfanas. Consultar con el responsable de ingeniería antes de reiniciar.

**Escalar si:** la tasa de error 503 supera el 5%, o no se resuelve en 10 minutos tras el reinicio de Redis.
```

---
