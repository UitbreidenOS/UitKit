---
name: opentelemetry
description: "OpenTelemetry setup: traces, metrics, logs, GenAI semantic conventions for LLM calls, export to Honeycomb/Datadog/Grafana, sampling strategies"
---

> 🇩🇪 Deutsche Version. [Englische Version](../opentelemetry.md).

# Skill: OpenTelemetry

## Wann aktivieren
- Hinzufügen von verteiltem Tracing zu einem Node.js- oder Python-Dienst
- Instrumentierung von LLM/KI-API-Aufrufen mit GenAI-Semantik-Konventionen
- Einrichten von Metriken und Logging mit dem OTEL-SDK
- Exportieren von Telemetrie nach Honeycomb, Datadog, Grafana oder Jaeger
- Konfigurieren von Sampling-Strategien für die Produktion (nicht alles tracen)

## Wann NICHT verwenden
- Einfaches Fehler-Tracking — stattdessen die Sentry-Kompetenz verwenden
- Nur Log-Aggregation — ein Log-Shipper (Fluent Bit, Vector) ist einfacher
- Wenn Sie nur Uptime-Monitoring benötigen — Uptime Robot oder Checkly verwenden

## Anweisungen

### Installation (Node.js)

```bash
npm install @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-otlp-http \
            @opentelemetry/semantic-conventions
```

### SDK-Setup (muss vor dem App-Code geladen werden)

```typescript
// instrumentation.ts — vor allem anderen importieren
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
// server.ts — Instrumentierung zuerst importieren
import './instrumentation'
import express from 'express'
// ... Rest der App
```

### Manuelle Spans für benutzerdefinierte Operationen

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

### GenAI-Semantik-Konventionen (LLM-Aufruf-Tracing)

OpenTelemetry hat offizielle Semantik-Konventionen für KI/LLM-Aufrufe (Namespace `gen_ai.*`):

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

### Metriken

```typescript
import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('my-api', '1.0.0')

// Zähler — Dinge, die passieren
const httpRequestsTotal = meter.createCounter('http.requests.total', {
  description: 'Total HTTP requests',
})

// Histogramm — Dauer-/Größenverteilungen
const httpDuration = meter.createHistogram('http.request.duration', {
  description: 'HTTP request duration in ms',
  unit: 'ms',
})

// Observable Gauge — aktueller Wert
const activeConnections = meter.createObservableGauge('db.connections.active', {
  description: 'Active database connections',
})
activeConnections.addCallback(result => {
  result.observe(pool.totalCount - pool.idleCount)
})

// In Middleware aufzeichnen
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

### Sampling-Strategien

```typescript
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base'

// Produktion: 10% aller Anfragen samplen, 100% der Fehler
const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(0.1),  // 10% neuer Traces
})

// Fehler immer samplen — in Ihrem Fehler-Handler hinzufügen
span.setAttribute('sampling.priority', 1)  // erzwingt Sampling dieses Traces
```

### Python-Setup

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

## Beispiel

**Benutzer:** OpenTelemetry zu einer Next.js API hinzufügen, die Claude aufruft — jeden LLM-Aufruf mit Token-Zählungen tracen, nach Honeycomb exportieren und einen benutzerdefinierten Span für die Geschäftslogik zwischen Prompts hinzufügen.

**Erwartete Ausgabe:**
- `instrumentation.ts` — OTEL-SDK-Init mit OTLP Honeycomb-Export
- `next.config.ts` — `instrumentationHook: true`
- `lib/ai.ts` — `callClaude()` in einem Span mit `gen_ai.*`-Attributen eingewickelt
- Benutzerdefinierter Span für mehrstufige Prompt-Kette, der die Latenz jedes Schritts zeigt
- Umgebungsvariablen: `OTEL_EXPORTER_OTLP_ENDPOINT`, `HONEYCOMB_API_KEY`

---
