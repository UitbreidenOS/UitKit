---
name: sentry
description: "Sentry error monitoring: SDK setup, source maps, automated error triage with Claude, performance monitoring, MCP integration for agent-driven debugging"
---

> 🇩🇪 Deutsche Version. [Englische Version](../sentry.md).

# Sentry-Kompetenz

## Wann aktivieren
- Fehlerüberwachung zu einer Node.js-, Python- oder Next.js-Anwendung hinzufügen
- Source Maps konfigurieren, damit Sentry den ursprünglichen TypeScript/minimierten Quellcode anzeigt
- Automatisches Fehler-Triage einrichten: Claude fragt Sentry ab → priorisiert Crashes → öffnet Fix-PRs
- Den Sentry MCP-Server verwenden, um Claude zu ermöglichen, Issues zu durchsuchen und zu lösen
- Leistungsüberwachung konfigurieren (Transaktionen, Spans, Web Vitals)

## Wann NICHT verwenden
- Log-Aggregation (strukturierte App-Logs) — stattdessen Datadog Logs oder Loki verwenden
- Metriken und Dashboards — Prometheus/Grafana oder Datadog verwenden
- Lokales Entwicklungs-Debugging — zuerst console.log und den Debugger verwenden

## Anweisungen

### SDK-Setup (Next.js)

```bash
npx @sentry/wizard@latest -i nextjs
# Konfiguriert automatisch: SDK, Source Maps, Tunnel-Route, Sentry-Konfigurationsdateien
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,  // 10% in Prod
  replaysSessionSampleRate: 0.1,   // 10% der Sitzungen aufzeichnen
  replaysOnErrorSampleRate: 1.0,   // Sitzungen mit Fehlern immer aufzeichnen
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

### SDK-Setup (Node.js / Express / FastAPI)

```typescript
// Node.js — muss ZUERST vor jedem anderen Code importiert werden
import './instrument'  // oder require('./instrument')

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

### Fehler erfassen und Kontext hinzufügen

```typescript
// Eine Ausnahme manuell erfassen
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, orderId, context: 'payment_processing' },
    tags: { component: 'billing', severity: 'critical' },
  })
  throw error  // immer neu werfen — Sentry erfasst, schluckt nicht
}

// Benutzerkontext hinzufügen
Sentry.setUser({ id: session.user.id, email: session.user.email })

// Breadcrumbs hinzufügen (Spur zum Fehler)
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User authenticated',
  level: 'info',
  data: { method: 'google_oauth' },
})

// Benutzerdefinierte Performance-Spans
const span = Sentry.startSpan({ name: 'db.query.findUser', op: 'db' }, () => {
  return db.user.findUnique({ where: { id } })
})
```

### Source Maps (TypeScript-Projekte)

Source Maps ermöglichen es Sentry, Ihren ursprünglichen TypeScript-Code statt des kompilierten JS anzuzeigen.

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,       // Source Maps nicht öffentlich bereitstellen
  disableLogger: true,
  automaticVercelMonitors: true,
})
```

### Sentry MCP — Claude durchsucht und triagiert Issues

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

Auth-Token erhalten: Sentry → Einstellungen → Konto → API → Auth-Tokens → Erstellen (Bereiche: `event:read`, `project:read`, `issues:read`).

**Mit verbundenem MCP Claude sagen:**
```
Die 5 wichtigsten ungelösten Probleme in der Produktionsumgebung der letzten 7 Tage anzeigen.
```
```
Welche Fehler betreffen diese Woche die meisten Benutzer? Nach Fehlertyp gruppieren.
```
```
Alle TypeErrors im Checkout-Flow finden und den Stack-Trace anzeigen.
```

### Automatisches wöchentliches Triage (Agentenmuster)

```typescript
// scripts/weekly-triage.ts — als Cron-Job ausführen
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

// Wöchentlich ausführen: Triage-Bericht an Slack senden
const issues = await getTopIssues()
const report = await triageWithClaude(issues)
await postToSlack(process.env.SLACK_WEBHOOK, `*Weekly Sentry Triage*\n${report}`)
```

### Leistungsüberwachung

```typescript
// Benutzerdefinierte Transaktionen verfolgen
Sentry.startSpanManual({ name: 'checkout.complete', op: 'business' }, async (span) => {
  span.setAttribute('cart.items', cart.items.length)
  span.setAttribute('cart.total', cart.total)

  const order = await createOrder(cart)

  span.setStatus({ code: SpanStatusCode.OK })
  span.end()
  return order
})

// Web Vitals (Next.js) — zu app/layout.tsx hinzufügen
export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.metrics.distribution(`web_vitals.${metric.name}`, metric.value, {
    tags: { route: metric.id },
    unit: 'millisecond',
  })
}
```

### Alerts und Benachrichtigungen

```yaml
# .sentry/alerts.yml — in Versionskontrolle eingecheckt
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

## Beispiel

**Benutzer:** Sentry zu einer Next.js-App hinzufügen und ein automatisches Montagmorgen-Triage-Skript einrichten, das die Top-10-Issues abfragt, Claude um Priorisierung bittet und den Bericht an Slack sendet.

**Erwartetes Ergebnis:**
- `sentry.client.config.ts` + `sentry.server.config.ts` — mit Replay, Tracing
- `next.config.ts` — mit `withSentryConfig` für Source Maps umhüllt
- `scripts/weekly-triage.ts` — ruft Top-Issues ab, Claude-Triage, Slack-Post
- `.github/workflows/triage.yml` — cron: 0 9 * * 1 (Montag 9 Uhr)

---
