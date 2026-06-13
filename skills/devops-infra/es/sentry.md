---
name: sentry
description: "Sentry error monitoring: SDK setup, source maps, automated error triage with Claude, performance monitoring, MCP integration for agent-driven debugging"
---

> 🇪🇸 Versión en español. [Versión en inglés](../sentry.md).

# Habilidad Sentry

## Cuándo activar
- Agregar monitoreo de errores a una aplicación Node.js, Python o Next.js
- Configurar source maps para que Sentry muestre el código fuente TypeScript/minificado original
- Configurar triage automatizado de errores: Claude consulta Sentry → prioriza crashes → abre PRs de corrección
- Usar el servidor Sentry MCP para que Claude navegue y resuelva problemas
- Configurar monitoreo de rendimiento (transacciones, spans, web vitals)

## Cuándo NO usar
- Agregación de logs (logs estructurados de aplicación) — usar Datadog Logs o Loki
- Métricas y paneles — usar Prometheus/Grafana o Datadog
- Depuración en desarrollo local — usar console.log y el depurador primero

## Instrucciones

### Configuración del SDK (Next.js)

```bash
npx @sentry/wizard@latest -i nextjs
# Esto configura automáticamente: SDK, source maps, ruta de túnel, archivos de config de Sentry
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,  // 10% en prod
  replaysSessionSampleRate: 0.1,   // grabar el 10% de las sesiones
  replaysOnErrorSampleRate: 1.0,   // siempre grabar sesiones con errores
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],
})

// sentry.server.config.ts
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
})
```

### Configuración del SDK (Node.js / Express / FastAPI)

```typescript
// Node.js — debe importarse PRIMERO antes que cualquier otro código
import './instrument'  // o require('./instrument')

// instrument.ts
import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  integrations: [
    Sentry.expressIntegration(),
    Sentry.prismaIntegration(),
  ],
})
```

```python
# Python / FastAPI
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

sentry_sdk.init(
    dsn=os.environ["SENTRY_DSN"],
    traces_sample_rate=0.1,
    profiles_sample_rate=0.1,
    integrations=[FastApiIntegration(), SqlalchemyIntegration()],
    environment=os.getenv("ENVIRONMENT", "development"),
)
```

### Captura de errores y contexto

```typescript
// Capturar una excepción manualmente
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, orderId, context: 'payment_processing' },
    tags: { component: 'billing', severity: 'critical' },
  })
  throw error  // siempre relanzar — Sentry captura, no absorbe
}

// Agregar contexto de usuario
Sentry.setUser({ id: session.user.id, email: session.user.email })

// Agregar breadcrumbs (rastro que lleva al error)
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User authenticated',
  level: 'info',
  data: { method: 'google_oauth' },
})

// Spans de rendimiento personalizados
const span = Sentry.startSpan({ name: 'db.query.findUser', op: 'db' }, () => {
  return db.user.findUnique({ where: { id } })
})
```

### Source maps (proyectos TypeScript)

Los source maps permiten que Sentry muestre su código fuente TypeScript original en lugar del JS compilado.

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,       // no servir source maps públicamente
  disableLogger: true,
  automaticVercelMonitors: true,
})
```

### Sentry MCP — Claude navega y clasifica problemas

```json
// ~/.claude/settings.json
{
  "mcpServers": {
    "sentry": {
      "command": "uvx",
      "args": ["mcp-server-sentry", "--auth-token", "${SENTRY_AUTH_TOKEN}"]
    }
  }
}
```

Obtenga su token de autenticación: Sentry → Configuración → Cuenta → API → Tokens de autenticación → Crear (alcances: `event:read`, `project:read`, `issues:read`).

**Con MCP conectado, dígale a Claude:**
```
Mostrarme los 5 principales problemas no resueltos en el entorno de producción de los últimos 7 días.
```
```
¿Qué errores están afectando a más usuarios esta semana? Agrupar por tipo de error.
```
```
Encontrar todos los TypeErrors en el flujo de pago y mostrarme el stack trace.
```

### Triage semanal automatizado (patrón de agente)

```typescript
// scripts/weekly-triage.ts — ejecutar como tarea cron
import * as Sentry from '@sentry/node'

const SENTRY_API = 'https://sentry.io/api/0'
const ORG = process.env.SENTRY_ORG
const PROJECT = process.env.SENTRY_PROJECT
const TOKEN = process.env.SENTRY_AUTH_TOKEN

async function getTopIssues(days = 7, limit = 20) {
  const since = new Date(Date.now() - days * 86400000).toISOString()
  const res = await fetch(
    `${SENTRY_API}/projects/${ORG}/${PROJECT}/issues/?query=is:unresolved&sort=users&limit=${limit}&start=${since}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  )
  return res.json()
}

async function triageWithClaude(issues: SentryIssue[]) {
  const issueList = issues.map(i =>
    `- [${i.metadata.type}] ${i.title} — ${i.userCount} users affected, ${i.count} events`
  ).join('\n')

  const { text } = await generateText({
    model: anthropic('claude-opus-4-7'),
    prompt: `Triage these Sentry issues by business impact. For each critical issue, suggest the likely root cause and first debugging step.\n\n${issueList}`,
  })

  return text
}

// Ejecutar semanalmente: publica el informe de triage en Slack
const issues = await getTopIssues()
const report = await triageWithClaude(issues)
await postToSlack(process.env.SLACK_WEBHOOK, `*Weekly Sentry Triage*\n${report}`)
```

### Monitoreo de rendimiento

```typescript
// Rastrear transacciones personalizadas
Sentry.startSpanManual({ name: 'checkout.complete', op: 'business' }, async (span) => {
  span.setAttribute('cart.items', cart.items.length)
  span.setAttribute('cart.total', cart.total)

  const order = await createOrder(cart)

  span.setStatus({ code: SpanStatusCode.OK })
  span.end()
  return order
})

// Web Vitals (Next.js) — agregar a app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.metrics.distribution(`web_vitals.${metric.name}`, metric.value, {
    tags: { route: metric.id },
    unit: 'millisecond',
  })
}
```

### Alertas y notificaciones

```yaml
# .sentry/alerts.yml — incluido en control de versiones
alerts:
  - name: High error rate
    conditions:
      - event_frequency_percent: 10
        comparison_interval: 1h
    actions:
      - slack: "#alerts-prod"

  - name: New issue affecting 50+ users
    conditions:
      - issue_occurrences: 50
        timeframe: 1h
    actions:
      - email: oncall@company.com
      - pagerduty: critical
```

## Ejemplo

**Usuario:** Agregar Sentry a una aplicación Next.js y configurar un script de triage automatizado del lunes por la mañana que consulte los 10 principales problemas, pida a Claude que los priorice y publique el informe en Slack.

**Resultado esperado:**
- `sentry.client.config.ts` + `sentry.server.config.ts` — con replay, tracing
- `next.config.ts` — envuelto con `withSentryConfig` para source maps
- `scripts/weekly-triage.ts` — obtiene los principales problemas, triage de Claude, publicación en Slack
- `.github/workflows/triage.yml` — cron: 0 9 * * 1 (lunes 9am)

---
