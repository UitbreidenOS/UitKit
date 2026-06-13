---
name: opentelemetry
description: "OpenTelemetry setup: traces, metrics, logs, GenAI semantic conventions for LLM calls, export to Honeycomb/Datadog/Grafana, sampling strategies"
---

> 🇫🇷 Version française. [English version](../opentelemetry.md).

# Compétence OpenTelemetry

## Quand activer
- Ajout du traçage distribué à un service Node.js ou Python
- Instrumentation des appels API LLM/IA avec les conventions sémantiques GenAI
- Configuration des métriques et de la journalisation avec le SDK OTEL
- Export de la télémétrie vers Honeycomb, Datadog, Grafana ou Jaeger
- Configuration des stratégies d'échantillonnage pour la production (sans tout tracer)

## Quand NE PAS utiliser
- Simple suivi d'erreurs — utilisez la compétence Sentry à la place
- Agrégation de logs uniquement — un expéditeur de logs (Fluent Bit, Vector) est plus simple
- Quand vous avez juste besoin d'une surveillance de disponibilité — utilisez Uptime Robot ou Checkly

## Instructions

### Installation (Node.js)

```bash
npm install @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-otlp-http \
            @opentelemetry/semantic-conventions
```

### Configuration du SDK (doit être chargé avant le code de l'application)

```typescript
// instrumentation.ts — importer avant tout le reste
import { NodeSDK } from '@opentelemetry/sdk-node'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { Resource } from '@opentelemetry/resources'
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions'

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]:    'my-api',
    [ATTR_SERVICE_VERSION]: process.env.npm_package_version ?? '0.0.0',
    'deployment.environment': process.env.NODE_ENV ?? 'development',
  }),

  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/traces',
    headers: { 'x-honeycomb-team': process.env.HONEYCOMB_API_KEY ?? '' },
  }),

  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT + '/v1/metrics',
    }),
    exportIntervalMillis: 30_000,
  }),

  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': { enabled: true },
      '@opentelemetry/instrumentation-express': { enabled: true },
      '@opentelemetry/instrumentation-pg': { enabled: true },
    }),
  ],
})

sdk.start()
process.on('SIGTERM', () => sdk.shutdown())
```

```typescript
// server.ts — importer l'instrumentation en premier
import './instrumentation'
import express from 'express'
// ... reste de l'application
```

### Spans manuels pour les opérations personnalisées

```typescript
import { trace, SpanStatusCode } from '@opentelemetry/api'

const tracer = trace.getTracer('my-api', '1.0.0')

async function processOrder(orderId: string) {
  return tracer.startActiveSpan('order.process', async (span) => {
    span.setAttribute('order.id', orderId)
    span.setAttribute('order.source', 'web')

    try {
      const order = await db.orders.findById(orderId)
      span.setAttribute('order.total', order.total)

      await chargeCard(order)
      span.addEvent('payment.charged')

      await fulfillOrder(order)
      span.setStatus({ code: SpanStatusCode.OK })
      return order
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: (err as Error).message })
      span.recordException(err as Error)
      throw err
    } finally {
      span.end()
    }
  })
}
```

### Conventions sémantiques GenAI (traçage des appels LLM)

OpenTelemetry dispose de conventions sémantiques officielles pour les appels IA/LLM (espace de noms `gen_ai.*`) :

```typescript
import { trace, SpanKind } from '@opentelemetry/api'
import {
  ATTR_GEN_AI_SYSTEM,
  ATTR_GEN_AI_REQUEST_MODEL,
  ATTR_GEN_AI_REQUEST_MAX_TOKENS,
  ATTR_GEN_AI_RESPONSE_MODEL,
  ATTR_GEN_AI_USAGE_INPUT_TOKENS,
  ATTR_GEN_AI_USAGE_OUTPUT_TOKENS,
} from '@opentelemetry/semantic-conventions/incubating'

const tracer = trace.getTracer('ai-service')

async function callClaude(prompt: string, maxTokens: number) {
  return tracer.startActiveSpan('claude.chat', {
    kind: SpanKind.CLIENT,
    attributes: {
      [ATTR_GEN_AI_SYSTEM]:             'anthropic',
      [ATTR_GEN_AI_REQUEST_MODEL]:      'claude-opus-4-7',
      [ATTR_GEN_AI_REQUEST_MAX_TOKENS]: maxTokens,
    },
  }, async (span) => {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-7',
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      })

      span.setAttributes({
        [ATTR_GEN_AI_RESPONSE_MODEL]:       response.model,
        [ATTR_GEN_AI_USAGE_INPUT_TOKENS]:   response.usage.input_tokens,
        [ATTR_GEN_AI_USAGE_OUTPUT_TOKENS]:  response.usage.output_tokens,
        'gen_ai.response.finish_reasons':   [response.stop_reason ?? 'unknown'],
        'gen_ai.usage.cache_read_tokens':   response.usage.cache_read_input_tokens ?? 0,
      })

      span.setStatus({ code: SpanStatusCode.OK })
      return response
    } catch (err) {
      span.setStatus({ code: SpanStatusCode.ERROR })
      span.recordException(err as Error)
      throw err
    } finally {
      span.end()
    }
  })
}
```

### Métriques

```typescript
import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('my-api', '1.0.0')

// Compteur — événements qui se produisent
const httpRequestsTotal = meter.createCounter('http.requests.total', {
  description: 'Total HTTP requests',
})

// Histogramme — distributions de durée/taille
const httpDuration = meter.createHistogram('http.request.duration', {
  description: 'HTTP request duration in ms',
  unit: 'ms',
})

// Jauge observable — valeur actuelle
const activeConnections = meter.createObservableGauge('db.connections.active', {
  description: 'Active database connections',
})
activeConnections.addCallback(result => {
  result.observe(pool.totalCount - pool.idleCount)
})

// Enregistrer dans le middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const attrs = { 'http.method': req.method, 'http.status_code': res.statusCode }
    httpRequestsTotal.add(1, attrs)
    httpDuration.record(Date.now() - start, attrs)
  })
  next()
})
```

### Stratégies d'échantillonnage

```typescript
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base'

// Production : échantillonner 10% de toutes les requêtes, 100% des erreurs
const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(0.1),  // 10% des nouvelles traces
})

// Toujours échantillonner les erreurs — ajouter dans votre gestionnaire d'erreurs
span.setAttribute('sampling.priority', 1)  // force l'échantillonnage de cette trace
```

### Configuration Python

```python
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

provider = TracerProvider()
provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(
    endpoint=os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"],
    headers={"x-honeycomb-team": os.environ["HONEYCOMB_API_KEY"]},
)))
trace.set_tracer_provider(provider)

FastAPIInstrumentor.instrument_app(app)
SQLAlchemyInstrumentor().instrument(engine=engine)
```

## Exemple

**Utilisateur :** Ajouter OpenTelemetry à une API Next.js qui appelle Claude — tracer chaque appel LLM avec les comptages de tokens, exporter vers Honeycomb, et ajouter un span personnalisé pour la logique métier entre les prompts.

**Résultat attendu :**
- `instrumentation.ts` — initialisation du SDK OTEL avec export OTLP Honeycomb
- `next.config.ts` — `instrumentationHook: true`
- `lib/ai.ts` — `callClaude()` enveloppé dans un span avec attributs `gen_ai.*`
- Span personnalisé pour la chaîne de prompts multi-étapes montrant la latence de chaque étape
- Variables d'environnement : `OTEL_EXPORTER_OTLP_ENDPOINT`, `HONEYCOMB_API_KEY`

---
