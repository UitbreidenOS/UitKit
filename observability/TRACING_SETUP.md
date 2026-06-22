# OpenTelemetry Tracing Setup

Distributed tracing instrumentation for Claudient's critical performance paths using OpenTelemetry (OTEL).

## Overview

This document defines span hierarchies, attributes, and sampling configuration for:
- **Theme switching** — UI state transitions
- **SVG rendering** — DOM measurement and paint cycles
- **Sandbox execution** — Subprocess lifecycle and I/O
- **Don't-stop-loop** — Polling and retry backoff mechanics

Sampling rate: **10%** for production observability without overhead.

---

## Installation

### Dependencies

```bash
npm install \
  @opentelemetry/api \
  @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/sdk-trace-node \
  @opentelemetry/exporter-trace-otlp-http \
  @opentelemetry/resources \
  @opentelemetry/semantic-conventions
```

### Environment Variables

```bash
# Exporter endpoint (must support OTLP/HTTP)
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318

# Service name and version
OTEL_SERVICE_NAME=claudient
OTEL_SERVICE_VERSION=1.0.0

# Sampling ratio (10% for production)
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=0.1

# Node-specific
NODE_OPTIONS=--require ./instrumentation.js
```

---

## Instrumentation Bootstrap

**File:** `instrumentation.js` (project root)

```javascript
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "claudient",
    [SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/traces",
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing shutdown complete"))
    .catch((err) => console.error("Tracing shutdown error:", err));
});
```

---

## Span Definitions

### 1. Theme Switch (`theme.switch`)

**Parent span:** Application startup or user gesture

**Child spans:**
- `theme.switch.classlist` — DOM element class mutation
- `theme.switch.storage` — LocalStorage write
- `theme.switch.emit` — Custom event broadcast

#### Attributes

```javascript
{
  "theme.from": "light" | "dark" | "auto",
  "theme.to": "light" | "dark" | "auto",
  "theme.transition_ms": number,
  "theme.elements_affected": number,
  "theme.prefers_color_scheme": boolean,
  "theme.system_override": boolean,
}
```

#### Example Instrumentation

```javascript
const { trace } = require("@opentelemetry/api");
const tracer = trace.getTracer("claudient-ui");

export async function switchTheme(newTheme) {
  const span = tracer.startSpan("theme.switch", {
    attributes: {
      "theme.from": currentTheme,
      "theme.to": newTheme,
    },
  });

  return trace.context.with(
    trace.setSpan(trace.context.active(), span),
    async () => {
      try {
        // DOM mutation
        const classlistSpan = tracer.startSpan("theme.switch.classlist");
        document.documentElement.classList.remove(`theme-${currentTheme}`);
        document.documentElement.classList.add(`theme-${newTheme}`);
        classlistSpan.end();

        // Storage persist
        const storageSpan = tracer.startSpan("theme.switch.storage");
        localStorage.setItem("claudient-theme", newTheme);
        storageSpan.end();

        // Event emit
        const emitSpan = tracer.startSpan("theme.switch.emit");
        window.dispatchEvent(new CustomEvent("theme-changed", { detail: { from: currentTheme, to: newTheme } }));
        emitSpan.end();

        span.addEvent("theme_switch_complete", {
          "theme.transition_ms": performance.now() - startTime,
        });
        span.setStatus({ code: SpanStatusCode.OK });
      } catch (err) {
        span.recordException(err);
        span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
        throw err;
      } finally {
        span.end();
      }
    }
  );
}
```

**Sampling:** Always sampled (high business value, low volume)

---

### 2. SVG Rendering (`svg.render`)

**Parent span:** Component mount or prop change

**Child spans:**
- `svg.render.measure` — getBoundingClientRect, computed styles
- `svg.render.construct` — Element creation and tree building
- `svg.render.paint` — requestAnimationFrame flush
- `svg.render.accessibility` — aria-label, role injection

#### Attributes

```javascript
{
  "svg.id": string,
  "svg.elements_count": number,
  "svg.measure_ms": number,
  "svg.construct_ms": number,
  "svg.paint_ms": number,
  "svg.total_ms": number,
  "svg.viewport_width": number,
  "svg.viewport_height": number,
  "svg.accessibility_roles": number,
  "svg.paint_thrashing": boolean,
}
```

#### Example Instrumentation

```javascript
const { SpanStatusCode } = require("@opentelemetry/api");

export function renderSVG(svgId, config) {
  const startTime = performance.now();
  const rootSpan = tracer.startSpan("svg.render", {
    attributes: { "svg.id": svgId },
  });

  return trace.context.with(
    trace.setSpan(trace.context.active(), rootSpan),
    () => {
      try {
        // Measure phase
        const measureStart = performance.now();
        const measureSpan = tracer.startSpan("svg.render.measure");
        const viewport = document.querySelector(`#${svgId}`).getBoundingClientRect();
        const computedStyle = window.getComputedStyle(document.querySelector(`#${svgId}`));
        const measureMs = performance.now() - measureStart;
        measureSpan.addEvent("measurement_complete", {
          "svg.viewport_width": viewport.width,
          "svg.viewport_height": viewport.height,
        });
        measureSpan.end();

        // Construct phase
        const constructStart = performance.now();
        const constructSpan = tracer.startSpan("svg.render.construct");
        const elements = buildSVGTree(config);
        const elementCount = document.querySelectorAll(`#${svgId} *`).length;
        constructSpan.addEvent("tree_built", { "svg.elements_count": elementCount });
        constructSpan.end();
        const constructMs = performance.now() - constructStart;

        // Paint phase
        const paintStart = performance.now();
        const paintSpan = tracer.startSpan("svg.render.paint");
        requestAnimationFrame(() => {
          const rect = document.querySelector(`#${svgId}`).getBoundingClientRect();
          paintSpan.end();
        });
        const paintMs = performance.now() - paintStart;

        // Accessibility phase
        const a11ySpan = tracer.startSpan("svg.render.accessibility");
        injectAccessibilityAttributes(svgId);
        const rolesCount = document.querySelectorAll(`#${svgId} [role]`).length;
        a11ySpan.addEvent("a11y_complete", { "svg.accessibility_roles": rolesCount });
        a11ySpan.end();

        rootSpan.setAttributes({
          "svg.measure_ms": measureMs,
          "svg.construct_ms": constructMs,
          "svg.paint_ms": paintMs,
          "svg.total_ms": performance.now() - startTime,
          "svg.elements_count": elementCount,
          "svg.accessibility_roles": rolesCount,
        });

        rootSpan.setStatus({ code: SpanStatusCode.OK });
      } catch (err) {
        rootSpan.recordException(err);
        rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
        throw err;
      } finally {
        rootSpan.end();
      }
    }
  );
}
```

**Sampling:** 10% (high-frequency path, acceptable loss for production)

---

### 3. Sandbox Execution (`sandbox.exec`)

**Parent span:** User code submission or test run

**Child spans:**
- `sandbox.exec.spawn` — Child process creation and env setup
- `sandbox.exec.io` — stdin/stdout/stderr buffering
- `sandbox.exec.timeout` — Timeout enforcement
- `sandbox.exec.cleanup` — Process teardown and resource release

#### Attributes

```javascript
{
  "sandbox.run_id": string,
  "sandbox.language": "javascript" | "python" | "bash",
  "sandbox.timeout_ms": number,
  "sandbox.memory_limit_mb": number,
  "sandbox.cpu_cores": number,
  "sandbox.exit_code": number,
  "sandbox.signal": string | null,
  "sandbox.elapsed_ms": number,
  "sandbox.peak_memory_mb": number,
  "sandbox.stdout_bytes": number,
  "sandbox.stderr_bytes": number,
  "sandbox.error_category": "timeout" | "memory" | "signal" | "logic" | null,
}
```

#### Example Instrumentation

```javascript
const { spawn } = require("child_process");
const { SpanStatusCode } = require("@opentelemetry/api");

export async function executeSandbox(runId, code, config) {
  const rootSpan = tracer.startSpan("sandbox.exec", {
    attributes: {
      "sandbox.run_id": runId,
      "sandbox.language": config.language,
      "sandbox.timeout_ms": config.timeoutMs,
      "sandbox.memory_limit_mb": config.memoryMb,
    },
  });

  return trace.context.with(
    trace.setSpan(trace.context.active(), rootSpan),
    () =>
      new Promise((resolve, reject) => {
        try {
          // Spawn phase
          const spawnStart = performance.now();
          const spawnSpan = tracer.startSpan("sandbox.exec.spawn");
          const child = spawn(config.interpreter, [config.scriptPath], {
            timeout: config.timeoutMs,
            maxBuffer: config.memoryMb * 1024 * 1024,
            stdio: ["pipe", "pipe", "pipe"],
          });
          spawnSpan.end();

          // I/O phase
          const ioSpan = tracer.startSpan("sandbox.exec.io");
          let stdoutBytes = 0;
          let stderrBytes = 0;
          let stdout = "";
          let stderr = "";

          child.stdout.on("data", (data) => {
            stdout += data.toString();
            stdoutBytes += data.length;
          });

          child.stderr.on("data", (data) => {
            stderr += data.toString();
            stderrBytes += data.length;
          });

          // Timeout enforcement
          const timeoutSpan = tracer.startSpan("sandbox.exec.timeout");
          const timeoutHandle = setTimeout(() => {
            child.kill("SIGKILL");
            timeoutSpan.addEvent("timeout_enforced", {
              "sandbox.timeout_ms": config.timeoutMs,
            });
            timeoutSpan.end();
          }, config.timeoutMs);

          // Exit handler
          child.on("exit", (code, signal) => {
            clearTimeout(timeoutHandle);
            ioSpan.end();

            // Cleanup phase
            const cleanupStart = performance.now();
            const cleanupSpan = tracer.startSpan("sandbox.exec.cleanup");
            // Process termination, resource cleanup
            cleanupSpan.end();

            const elapsed = performance.now() - spawnStart;
            const errorCategory =
              signal === "SIGKILL"
                ? "timeout"
                : signal
                  ? "signal"
                  : code !== 0
                    ? "logic"
                    : null;

            rootSpan.setAttributes({
              "sandbox.exit_code": code || 0,
              "sandbox.signal": signal || null,
              "sandbox.elapsed_ms": elapsed,
              "sandbox.stdout_bytes": stdoutBytes,
              "sandbox.stderr_bytes": stderrBytes,
              "sandbox.error_category": errorCategory,
            });

            if (errorCategory) {
              rootSpan.addEvent("sandbox_error", {
                "sandbox.error_category": errorCategory,
              });
              rootSpan.setStatus({ code: SpanStatusCode.ERROR });
            } else {
              rootSpan.setStatus({ code: SpanStatusCode.OK });
            }

            rootSpan.end();
            resolve({ code, signal, stdout, stderr });
          });

          child.on("error", (err) => {
            clearTimeout(timeoutHandle);
            rootSpan.recordException(err);
            rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
            rootSpan.end();
            reject(err);
          });

          child.stdin.write(code);
          child.stdin.end();
        } catch (err) {
          rootSpan.recordException(err);
          rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          rootSpan.end();
          reject(err);
        }
      })
  );
}
```

**Sampling:** 50% (moderate frequency, resource-intensive)

---

### 4. Don't-Stop-Loop (`loop.poll`)

**Parent span:** Task scheduler or user trigger

**Child spans:**
- `loop.poll.condition` — Predicate evaluation
- `loop.poll.backoff` — Exponential backoff calculation
- `loop.poll.delay` — setTimeout/setInterval sleep
- `loop.poll.iteration` — Actual work execution

#### Attributes

```javascript
{
  "loop.id": string,
  "loop.interval_ms": number,
  "loop.max_iterations": number,
  "loop.current_iteration": number,
  "loop.backoff_strategy": "linear" | "exponential" | "fixed",
  "loop.backoff_multiplier": number,
  "loop.current_delay_ms": number,
  "loop.condition_result": boolean,
  "loop.work_duration_ms": number,
  "loop.total_elapsed_ms": number,
  "loop.abort_reason": string | null,
  "loop.error_count": number,
}
```

#### Example Instrumentation

```javascript
export async function startDontStopLoop(loopId, config) {
  const rootSpan = tracer.startSpan("loop.poll", {
    attributes: {
      "loop.id": loopId,
      "loop.interval_ms": config.intervalMs,
      "loop.max_iterations": config.maxIterations,
      "loop.backoff_strategy": config.backoffStrategy || "exponential",
    },
  });

  const loopStart = performance.now();
  let iteration = 0;
  let errorCount = 0;
  let abortReason = null;

  return trace.context.with(
    trace.setSpan(trace.context.active(), rootSpan),
    async () => {
      try {
        while (iteration < config.maxIterations) {
          // Condition check
          const conditionSpan = tracer.startSpan("loop.poll.condition");
          let shouldContinue = true;
          try {
            shouldContinue = await config.condition();
            conditionSpan.addEvent("condition_evaluated", {
              "loop.condition_result": shouldContinue,
            });
          } catch (err) {
            conditionSpan.recordException(err);
            errorCount++;
          } finally {
            conditionSpan.end();
          }

          if (!shouldContinue) {
            abortReason = "condition_failed";
            break;
          }

          // Backoff calculation
          const backoffSpan = tracer.startSpan("loop.poll.backoff");
          let delayMs = config.intervalMs;
          if (config.backoffStrategy === "exponential" && iteration > 0) {
            const multiplier = config.backoffMultiplier || 2;
            delayMs = Math.min(
              config.intervalMs * Math.pow(multiplier, iteration),
              config.maxBackoffMs || 30000
            );
          }
          backoffSpan.addEvent("backoff_calculated", {
            "loop.current_delay_ms": delayMs,
          });
          backoffSpan.end();

          // Delay
          const delaySpan = tracer.startSpan("loop.poll.delay");
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          delaySpan.end();

          // Iteration work
          const workStart = performance.now();
          const iterationSpan = tracer.startSpan("loop.poll.iteration", {
            attributes: { "loop.current_iteration": iteration },
          });
          try {
            await config.work();
            const workDuration = performance.now() - workStart;
            iterationSpan.addEvent("iteration_complete", {
              "loop.work_duration_ms": workDuration,
            });
          } catch (err) {
            errorCount++;
            iterationSpan.recordException(err);
            if (!config.continueOnError) {
              abortReason = "work_error";
              throw err;
            }
          } finally {
            iterationSpan.end();
          }

          iteration++;
        }

        if (iteration >= config.maxIterations) {
          abortReason = "max_iterations_reached";
        }

        rootSpan.setAttributes({
          "loop.current_iteration": iteration,
          "loop.total_elapsed_ms": performance.now() - loopStart,
          "loop.error_count": errorCount,
          "loop.abort_reason": abortReason,
        });

        rootSpan.setStatus({ code: SpanStatusCode.OK });
      } catch (err) {
        rootSpan.recordException(err);
        rootSpan.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
        throw err;
      } finally {
        rootSpan.end();
      }
    }
  );
}
```

**Sampling:** 5% (high-frequency background task, minimal overhead required)

---

## Span Relationships (Parent-Child Tree)

```
application.startup
  └─ theme.switch [sampled]
      ├─ theme.switch.classlist
      ├─ theme.switch.storage
      └─ theme.switch.emit

user.render_view
  └─ svg.render [sampled at 10%]
      ├─ svg.render.measure
      ├─ svg.render.construct
      ├─ svg.render.paint
      └─ svg.render.accessibility

sandbox.queue_task
  └─ sandbox.exec [sampled at 50%]
      ├─ sandbox.exec.spawn
      ├─ sandbox.exec.io
      ├─ sandbox.exec.timeout
      └─ sandbox.exec.cleanup

scheduler.tick
  └─ loop.poll [sampled at 5%]
      ├─ loop.poll.condition
      ├─ loop.poll.backoff
      ├─ loop.poll.delay
      └─ loop.poll.iteration
```

---

## Sampling Configuration

| Span | Frequency | Business Value | Sampling Rate | Rationale |
|---|---|---|---|---|
| `theme.switch` | Low (user gesture) | High | 100% | Always capture UI state changes |
| `svg.render` | Medium (renders on mount/prop change) | High | 10% | Accept 90% loss; 10% provides sufficient insight |
| `sandbox.exec` | Medium (test runs, user code) | High | 50% | Resource-heavy; 50% balances visibility and cost |
| `loop.poll` | High (continuous polling) | Medium | 5% | Rare issues; minimal overhead needed |

### Sampler Configuration

```javascript
// settings.json snippet
{
  "tracing": {
    "samplingStrategies": {
      "theme.switch": { "type": "always" },
      "svg.render": { "type": "traceidratio", "ratio": 0.1 },
      "sandbox.exec": { "type": "traceidratio", "ratio": 0.5 },
      "loop.poll": { "type": "traceidratio", "ratio": 0.05 }
    }
  }
}
```

---

## Exporter Configuration

### OTLP/HTTP Endpoint

```javascript
// Typical receiver config (e.g., Jaeger, Grafana Loki, Datadog)
const exporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://localhost:4318/v1/traces",
  headers: {
    Authorization: `Bearer ${process.env.OTEL_AUTH_TOKEN || ""}`,
  },
});
```

### Local Development (Jaeger)

```bash
# Docker Compose: jaeger-all-in-one
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  jaegertracing/all-in-one

# Access UI: http://localhost:16686
```

### Production (Datadog Agent)

```bash
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
export DD_TRACE_ENABLED=true
export DD_SERVICE=claudient
export DD_VERSION=1.0.0
```

---

## Query Examples

### Jaeger UI

**Find all theme switches in the last hour:**
```
service.name=claudient AND span.kind=INTERNAL AND span.name=theme.switch
```

**Average SVG render time by element count:**
```
service.name=claudient AND span.name=svg.render
| stats avg(svg.total_ms) by svg.elements_count
```

**Sandbox execution errors:**
```
service.name=claudient AND span.name=sandbox.exec AND status=ERROR
| stats count by sandbox.error_category
```

**Loop poll backoff distribution:**
```
service.name=claudient AND span.name=loop.poll
| histogram(loop.current_delay_ms)
```

---

## Best Practices

1. **Context propagation:** Always use `trace.context.with()` for parent-child linkage
2. **Exception handling:** Call `span.recordException()` before setting ERROR status
3. **Sampling decisions:** Respect parent span's sampled flag to avoid broken chains
4. **Attribute cardinality:** Avoid unbounded strings (e.g., full file paths); use categories
5. **Span naming:** Use dot notation (service.operation.phase) for hierarchy
6. **Event creation:** Reserve events for state transitions; use attributes for measurements

---

## Troubleshooting

| Issue | Solution |
|---|---|
| Traces not arriving at exporter | Verify OTEL_EXPORTER_OTLP_ENDPOINT is reachable; check firewall rules |
| High cardinality attributes | Replace dynamic values with categorical enums (e.g., error_category instead of error_message) |
| Missing parent context | Ensure `trace.context.with()` wraps async operations |
| Sampler not applied | Verify SDK initialization includes `samplingStrategies`; check resource attributes |
| High exporter latency | Reduce sampling ratio; enable batch processor with larger flush interval |

---

## References

- [OpenTelemetry JS SDK](https://opentelemetry.io/docs/instrumentation/js/)
- [Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/)
- [OTLP Protocol](https://opentelemetry.io/docs/specs/otlp/)
- [Jaeger Getting Started](https://www.jaegertracing.io/docs/latest/)
