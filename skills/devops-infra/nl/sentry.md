---
name: sentry
description: "Sentry error monitoring: SDK setup, source maps, automated error triage with Claude, performance monitoring, MCP integration for agent-driven debugging"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../sentry.md).

# Sentry-vaardigheid

## Wanneer activeren
- Foutbewaking toevoegen aan een Node.js-, Python- of Next.js-applicatie
- Source maps configureren zodat Sentry de originele TypeScript/geminificeerde broncode toont
- Geautomatiseerde foutbeoordeling instellen: Claude raadpleegt Sentry → prioriteert crashes → opent fix-PR's
- De Sentry MCP-server gebruiken om Claude problemen te laten doorbladeren en oplossen
- Prestatiebewaking configureren (transacties, spans, web vitals)

## Wanneer NIET gebruiken
- Logaggregatie (gestructureerde applicatielogs) — gebruik Datadog Logs of Loki
- Statistieken en dashboards — gebruik Prometheus/Grafana of Datadog
- Lokaal ontwikkelingsdebugging — gebruik eerst console.log en de debugger

## Instructies

### SDK-instelling (Next.js)

```bash
npx @sentry/wizard@latest -i nextjs
# Dit configureert automatisch: SDK, source maps, tunnelroute, Sentry-configuratiebestanden
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,  // 10% in prod
  replaysSessionSampleRate: 0.1,   // 10% van sessies opnemen
  replaysOnErrorSampleRate: 1.0,   // altijd sessies met fouten opnemen
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

### SDK-instelling (Node.js / Express / FastAPI)

```typescript
// Node.js — moet EERST worden geïmporteerd vóór alle andere code
import './instrument'  // of require('./instrument')

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

### Fouten vastleggen en context toevoegen

```typescript
// Een uitzondering handmatig vastleggen
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, orderId, context: 'payment_processing' },
    tags: { component: 'billing', severity: 'critical' },
  })
  throw error  // altijd opnieuw gooien — Sentry legt vast, slikt niet in
}

// Gebruikerscontext toevoegen
Sentry.setUser({ id: session.user.id, email: session.user.email })

// Breadcrumbs toevoegen (spoor naar de fout)
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User authenticated',
  level: 'info',
  data: { method: 'google_oauth' },
})

// Aangepaste prestatiespans
const span = Sentry.startSpan({ name: 'db.query.findUser', op: 'db' }, () => {
  return db.user.findUnique({ where: { id } })
})
```

### Source maps (TypeScript-projecten)

Met source maps kan Sentry uw originele TypeScript-broncode tonen in plaats van gecompileerde JS.

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,       // source maps niet publiek beschikbaar stellen
  disableLogger: true,
  automaticVercelMonitors: true,
})
```

### Sentry MCP — Claude doorzoekt en beoordeelt problemen

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

Uw authenticatietoken ophalen: Sentry → Instellingen → Account → API → Auth-tokens → Aanmaken (bereiken: `event:read`, `project:read`, `issues:read`).

**Met MCP verbonden, vertel Claude:**
```
Toon mij de top 5 onopgeloste problemen in de productieomgeving van de afgelopen 7 dagen.
```
```
Welke fouten treffen deze week de meeste gebruikers? Groeperen op fouttype.
```
```
Alle TypeErrors in de betalingsstroom vinden en de stacktrace tonen.
```

### Geautomatiseerde wekelijkse beoordeling (agentpatroon)

```typescript
// scripts/weekly-triage.ts — uitvoeren als een cronjob
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

// Wekelijks uitvoeren: beoordelingsrapport naar Slack posten
const issues = await getTopIssues()
const report = await triageWithClaude(issues)
await postToSlack(process.env.SLACK_WEBHOOK, `*Weekly Sentry Triage*\n${report}`)
```

### Prestatiebewaking

```typescript
// Aangepaste transacties bijhouden
Sentry.startSpanManual({ name: 'checkout.complete', op: 'business' }, async (span) => {
  span.setAttribute('cart.items', cart.items.length)
  span.setAttribute('cart.total', cart.total)

  const order = await createOrder(cart)

  span.setStatus({ code: SpanStatusCode.OK })
  span.end()
  return order
})

// Web Vitals (Next.js) — toevoegen aan app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.metrics.distribution(`web_vitals.${metric.name}`, metric.value, {
    tags: { route: metric.id },
    unit: 'millisecond',
  })
}
```

### Waarschuwingen en meldingen

```yaml
# .sentry/alerts.yml — ingecheckt in versiebeheer
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

## Voorbeeld

**Gebruiker:** Sentry toevoegen aan een Next.js-app en een geautomatiseerd maandagochtendbeoordeling-script instellen dat de top 10 problemen raadpleegt, Claude vraagt ze te prioriteren en het rapport naar Slack post.

**Verwachte uitvoer:**
- `sentry.client.config.ts` + `sentry.server.config.ts` — met replay, tracing
- `next.config.ts` — omhulld met `withSentryConfig` voor source maps
- `scripts/weekly-triage.ts` — haalt top problemen op, Claude-beoordeling, Slack-post
- `.github/workflows/triage.yml` — cron: 0 9 * * 1 (maandag 9 uur)

---
