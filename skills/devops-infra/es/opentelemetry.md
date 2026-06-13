---
name: opentelemetry
description: "OpenTelemetry setup: traces, metrics, logs, GenAI semantic conventions for LLM calls, export to Honeycomb/Datadog/Grafana, sampling strategies"
---

> 🇪🇸 Versión en español. [Versión en inglés](../opentelemetry.md).

# Habilidad OpenTelemetry

## Cuándo activar
- Agregar rastreo distribuido a un servicio Node.js o Python
- Instrumentar llamadas a API LLM/IA con convenciones semánticas GenAI
- Configurar métricas y registro con el SDK de OTEL
- Exportar telemetría a Honeycomb, Datadog, Grafana o Jaeger
- Configurar estrategias de muestreo para producción (sin rastrear todo)

## Cuándo NO usar
- Seguimiento simple de errores — usar la habilidad Sentry en su lugar
- Solo agregación de logs — un despachador de logs (Fluent Bit, Vector) es más simple
- Cuando solo necesita monitoreo de tiempo de actividad — usar Uptime Robot o Checkly

## Instrucciones

### Instalación (Node.js)

```bash
npm install @opentelemetry/sdk-node \
            @opentelemetry/auto-instrumentations-node \
            @opentelemetry/exporter-otlp-http \
            @opentelemetry/semantic-conventions
```

### Configuración del SDK (debe cargarse antes del código de la aplicación)

```typescript
// instrumentation.ts — importar antes que todo lo demás
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
// server.ts — importar instrumentación primero
import './instrumentation'
import express from 'express'
// ... resto de la aplicación
```

### Spans manuales para operaciones personalizadas

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

### Convenciones semánticas GenAI (rastreo de llamadas LLM)

OpenTelemetry tiene convenciones semánticas oficiales para llamadas IA/LLM (espacio de nombres `gen_ai.*`):

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

### Métricas

```typescript
import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('my-api', '1.0.0')

// Contador — cosas que suceden
const httpRequestsTotal = meter.createCounter('http.requests.total', {
  description: 'Total HTTP requests',
})

// Histograma — distribuciones de duración/tamaño
const httpDuration = meter.createHistogram('http.request.duration', {
  description: 'HTTP request duration in ms',
  unit: 'ms',
})

// Gauge observable — valor actual
const activeConnections = meter.createObservableGauge('db.connections.active', {
  description: 'Active database connections',
})
activeConnections.addCallback(result => {
  result.observe(pool.totalCount - pool.idleCount)
})

// Registrar en middleware
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

### Estrategias de muestreo

```typescript
import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base'

// Producción: muestrear el 10% de todas las solicitudes, 100% de los errores
const sampler = new ParentBasedSampler({
  root: new TraceIdRatioBasedSampler(0.1),  // 10% de nuevas trazas
})

// Siempre muestrear errores — agregar en su gestor de errores
span.setAttribute('sampling.priority', 1)  // fuerza el muestreo de esta traza
```

### Configuración Python

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

## Ejemplo

**Usuario:** Agregar OpenTelemetry a una API Next.js que llama a Claude — rastrear cada llamada LLM con recuentos de tokens, exportar a Honeycomb y agregar un span personalizado para la lógica de negocio entre prompts.

**Resultado esperado:**
- `instrumentation.ts` — inicialización del SDK OTEL con exportación OTLP a Honeycomb
- `next.config.ts` — `instrumentationHook: true`
- `lib/ai.ts` — `callClaude()` envuelto en un span con atributos `gen_ai.*`
- Span personalizado para la cadena de prompts de varios pasos que muestra la latencia de cada paso
- Variables de entorno: `OTEL_EXPORTER_OTLP_ENDPOINT`, `HONEYCOMB_API_KEY`

---
