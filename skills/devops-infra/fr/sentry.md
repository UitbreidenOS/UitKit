---
name: sentry
description: "Sentry error monitoring: SDK setup, source maps, automated error triage with Claude, performance monitoring, MCP integration for agent-driven debugging"
---

> 🇫🇷 Version française. [English version](../sentry.md).

# Compétence Sentry

## Quand activer
- Ajouter une surveillance des erreurs à une application Node.js, Python ou Next.js
- Configurer les source maps pour que Sentry affiche le code source TypeScript/minifié original
- Mettre en place un triage automatisé des erreurs : Claude interroge Sentry → priorise les crashs → ouvre des PRs de correction
- Utiliser le serveur Sentry MCP pour permettre à Claude de parcourir et résoudre les problèmes
- Configurer la surveillance des performances (transactions, spans, web vitals)

## Quand NE PAS utiliser
- Agrégation de logs (logs d'application structurés) — utiliser Datadog Logs ou Loki à la place
- Métriques et tableaux de bord — utiliser Prometheus/Grafana ou Datadog
- Débogage en développement local — utiliser console.log et le débogueur d'abord

## Instructions

### Configuration du SDK (Next.js)

```bash
npx @sentry/wizard@latest -i nextjs
# Cela configure automatiquement : SDK, source maps, route tunnel, fichiers de config Sentry
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,  // 10% en prod
  replaysSessionSampleRate: 0.1,   // enregistrer 10% des sessions
  replaysOnErrorSampleRate: 1.0,   // toujours enregistrer les sessions avec erreurs
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

### Configuration du SDK (Node.js / Express / FastAPI)

```typescript
// Node.js — doit être importé EN PREMIER avant tout autre code
import './instrument'  // ou require('./instrument')

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

### Capture d'erreurs et contexte

```typescript
// Capturer une exception manuellement
try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error, {
    extra: { userId, orderId, context: 'payment_processing' },
    tags: { component: 'billing', severity: 'critical' },
  })
  throw error  // toujours relancer — Sentry capture, ne swallow pas
}

// Ajouter le contexte utilisateur
Sentry.setUser({ id: session.user.id, email: session.user.email })

// Ajouter des breadcrumbs (traces menant à l'erreur)
Sentry.addBreadcrumb({
  category: 'auth',
  message: 'User authenticated',
  level: 'info',
  data: { method: 'google_oauth' },
})

// Spans de performance personnalisés
const span = Sentry.startSpan({ name: 'db.query.findUser', op: 'db' }, () => {
  return db.user.findUnique({ where: { id } })
})
```

### Source maps (projets TypeScript)

Les source maps permettent à Sentry d'afficher votre code TypeScript original au lieu du JS compilé.

```typescript
// next.config.ts
import { withSentryConfig } from '@sentry/nextjs'

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,       // ne pas servir les source maps publiquement
  disableLogger: true,
  automaticVercelMonitors: true,
})
```

### Sentry MCP — Claude parcourt et triage les problèmes

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

Obtenez votre token d'authentification : Sentry → Paramètres → Compte → API → Tokens d'authentification → Créer (portées : `event:read`, `project:read`, `issues:read`).

**Avec MCP connecté, dites à Claude :**
```
Me montrer les 5 principaux problèmes non résolus dans l'environnement de production des 7 derniers jours.
```
```
Quelles erreurs affectent le plus d'utilisateurs cette semaine ? Grouper par type d'erreur.
```
```
Trouver toutes les TypeErrors dans le flux de paiement et me montrer la trace de la pile.
```

### Triage hebdomadaire automatisé (modèle d'agent)

```typescript
// scripts/weekly-triage.ts — exécuter comme tâche cron
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

// Exécuter hebdomadairement : poste le rapport de triage sur Slack
const issues = await getTopIssues()
const report = await triageWithClaude(issues)
await postToSlack(process.env.SLACK_WEBHOOK, `*Weekly Sentry Triage*\n${report}`)
```

### Surveillance des performances

```typescript
// Suivre des transactions personnalisées
Sentry.startSpanManual({ name: 'checkout.complete', op: 'business' }, async (span) => {
  span.setAttribute('cart.items', cart.items.length)
  span.setAttribute('cart.total', cart.total)

  const order = await createOrder(cart)

  span.setStatus({ code: SpanStatusCode.OK })
  span.end()
  return order
})

// Web Vitals (Next.js) — ajouter à app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  Sentry.metrics.distribution(`web_vitals.${metric.name}`, metric.value, {
    tags: { route: metric.id },
    unit: 'millisecond',
  })
}
```

### Alertes et notifications

```yaml
# .sentry/alerts.yml — enregistré dans le contrôle de version
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

## Exemple

**Utilisateur :** Ajouter Sentry à une application Next.js et configurer un script de triage automatisé du lundi matin qui interroge les 10 principaux problèmes, demande à Claude de les prioriser, et poste le rapport sur Slack.

**Résultat attendu :**
- `sentry.client.config.ts` + `sentry.server.config.ts` — avec replay, traçage
- `next.config.ts` — enveloppé avec `withSentryConfig` pour les source maps
- `scripts/weekly-triage.ts` — récupère les principaux problèmes, triage Claude, post Slack
- `.github/workflows/triage.yml` — cron: 0 9 * * 1 (lundi 9h)

---
