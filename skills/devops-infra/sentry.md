---
name: sentry
description: "Sentry error monitoring: SDK setup, source maps, automated error triage with Claude, performance monitoring, MCP integration for agent-driven debugging"
updated: 2026-06-13
---

# Sentry Skill

## When to activate
- Adding error monitoring to a Node.js, Python, or Next.js application
- Configuring source maps so Sentry shows original TypeScript/minified source
- Setting up automated error triage: Claude queries Sentry → prioritises crashes → opens fix PRs
- Using the Sentry MCP server to let Claude browse and resolve issues
- Configuring performance monitoring (transactions, spans, web vitals)

## When NOT to use
- Log aggregation (structured app logs) — use Datadog Logs or Loki instead
- Metrics and dashboards — use Prometheus/Grafana or Datadog
- Local development debugging — use console.log and the debugger first

## Instructions

### SDK setup (Next.js)

```bash
npx @sentry/wizard@latest -i nextjs
# This auto-configures: SDK, source maps, tunnel route, Sentry config files
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,  // 10% in prod
  replaysSessionSampleRate: 0.1,   // record 10% of sessions
  replaysOnErrorSampleRate: 1.0,   // always record sessions with errors
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

### SDK setup (Node.js / Express / FastAPI)

```typescript
// Node.js — must be imported FIRST before any other code
import './instrument'  // or require('./instrument')

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

### Capturing errors and context

```typescript
// Capture an exception manually
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, orderId, context: 'payment_processing' },
    tags: { component: 'billing', severity: 'critical' },
  })
  throw error  // still rethrow — Sentry captures, doesn't swallow
}

// Add user context
Sentry.setUser({ id: session.user.id, email: session.user.email })

// Add breadcrumbs (trail leading to the error)
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User authenticated',
  level: 'info',
  data: { method: 'google_oauth' },
})

// Custom performance spans
const span = Sentry.startSpan({ name: 'db.query.findUser', op: 'db' }, () => {
  return db.user.findUnique({ where: { id } })
})
```

### Source maps (TypeScript projects)

Source maps let Sentry show your original TypeScript source instead of compiled JS.

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,       // don't serve source maps publicly
  disableLogger: true,
  automaticVercelMonitors: true,
})
```

### Sentry MCP — Claude browses and triages issues

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

Get your auth token: Sentry → Settings → Account → API → Auth Tokens → Create (scopes: `event:read`, `project:read`, `issues:read`).

**With MCP connected, tell Claude:**
```
Show me the top 5 unresolved issues in the production environment from the last 7 days.
```
```
What errors are affecting the most users this week? Group by error type.
```
```
Find all TypeErrors in the checkout flow and show me the stack trace.
```

### Automated weekly triage (agent pattern)

```typescript
// scripts/weekly-triage.ts — run as a cron job
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

// Run weekly: posts triage report to Slack
const issues = await getTopIssues()
const report = await triageWithClaude(issues)
await postToSlack(process.env.SLACK_WEBHOOK, `*Weekly Sentry Triage*\n${report}`)
```

### Performance monitoring

```typescript
// Track custom transactions
Sentry.startSpanManual({ name: 'checkout.complete', op: 'business' }, async (span) => {
  span.setAttribute('cart.items', cart.items.length)
  span.setAttribute('cart.total', cart.total)

  const order = await createOrder(cart)

  span.setStatus({ code: SpanStatusCode.OK })
  span.end()
  return order
})

// Web Vitals (Next.js) — add to app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.metrics.distribution(`web_vitals.${metric.name}`, metric.value, {
    tags: { route: metric.id },
    unit: 'millisecond',
  })
}
```

### Alerts and notifications

```yaml
# .sentry/alerts.yml — checked into version control
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

## Example

**User:** Add Sentry to a Next.js app and set up an automated Monday morning triage script that queries the top 10 issues, asks Claude to prioritise them, and posts the report to Slack.

**Expected output:**
- `sentry.client.config.ts` + `sentry.server.config.ts` — with replay, tracing
- `next.config.ts` — wrapped with `withSentryConfig` for source maps
- `scripts/weekly-triage.ts` — fetches top issues, Claude triage, Slack post
- `.github/workflows/triage.yml` — cron: 0 9 * * 1 (Monday 9am)

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
