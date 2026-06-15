# Dispatch & Channels — Background Jobs and Real-Time Event Streaming

Dispatch runs long tasks in the background while you keep working. Channels let multiple Claude Code sessions share state and coordinate in real time. Together they enable autonomous, multi-agent workflows that would otherwise require custom orchestration code.

---

## Dispatch — Background Job Execution

### What It Does

Dispatch spawns a task as a background sub-agent with a job ID. You can poll its progress, cancel it, or wait for it to complete — all without blocking your current session.

### Basic Usage

```bash
# Run a task in the background
claude dispatch "Audit all workspace stacks for skill coverage" --parallelism 4

# Check status
claude dispatch status <job-id>

# Get results when done
claude dispatch result <job-id>
```

### Inside a Session

```
User: "Run a full validation of all 42 stacks in the background while I work on the README"

Agent: Dispatching stack validation as background job.
  Job ID: val-2026-06-13-a1b2c3
  Parallelism: 4 concurrent validations
  Estimated time: ~5 minutes
  I'll notify you when it's done.
```

### Job Definition

```yaml
dispatch:
  job_id: "batch-audit"
  parallelism: 6
  timeout_minutes: 30
  retry:
    max_attempts: 2
    backoff: exponential
  tasks:
    - type: "batch"
      inputs: ["stack-1", "stack-2", ..., "stack-42"]
      action: "validate-stack"
    - type: "reduce"
      depends_on: [previous]
      action: "aggregate-results"
```

### Progress Polling

Three ways to track background jobs:

| Method | How | Best for |
|--------|-----|----------|
| **Active poll** | Ask "How's the background job?" | Checking in periodically |
| **Event callback** | Agent reports when done | Fire-and-forget |
| **File watch** | Results written to file | CI/CD integration |

### Error Handling

- **Task failure:** Continues other tasks, logs failed inputs to dead-letter directory
- **Timeout:** Returns partial results from completed tasks
- **Retry:** Failed tasks retry up to `max_attempts` with exponential backoff

### Best Practices

- **Cap parallelism** at 4-8 workers to avoid rate limits
- **Always set a timeout** — background jobs can hang indefinitely
- **Write results to disk** before reporting completion — prevents result loss on session disconnect
- **Summarize sub-task outputs** before the reduce step to avoid context overflow

---

## Channels — Real-Time Event Streaming

### What It Does

Channels provide pub/sub event streams between Claude Code sessions. One session publishes events, others subscribe and react in real time.

### Channel Types

| Type | Use Case | Frequency |
|------|----------|-----------|
| **Progress** | Report task completion % | Per milestone |
| **State** | Sync shared state | On change |
| **Alert** | Notify on conditions | On trigger |
| **Stream** | Continuous data flow | Continuous |
| **Signal** | One-shot coordination | Once |

### Basic Pub/Sub

**Publisher (Session A):**
```yaml
channel: "ci-pipeline"
publish:
  - type: "build.started"
    data: {branch: "main", commit: "abc123"}
  - type: "build.complete"
    data: {status: "success", duration: "3m42s"}
```

**Subscriber (Session B):**
```yaml
channel: "ci-pipeline"
subscribe:
  filter: {types: ["build.complete", "build.failed"]}
  on_event:
    build.complete: "Prepare release notes"
    build.failed: "Analyze error and suggest fix"
```

### Event Filtering

Reduce noise by filtering:
- **Type filter:** Only specific event types
- **Source filter:** Only from specific sessions
- **Data filter:** Match on payload fields (e.g., `environment: "production"`)
- **Rate filter:** Throttle high-frequency events to max N per minute

### Cross-Session Coordination

```
Session A (dev):       publishes file changes → auto-triggers tests
Session B (tests):     subscribes to changes → runs tests → publishes results
Session C (docs):      subscribes to results → updates docs if tests pass
```

### Event Schema

```json
{
  "id": "evt_a1b2c3",
  "channel": "ci-pipeline",
  "type": "build.failed",
  "source": "session-ci-runner",
  "timestamp": "2026-06-13T14:32:00Z",
  "data": {"stage": "lint", "error": "3 errors found"}
}
```

---

## Combining Dispatch + Channels

The most powerful pattern: dispatch background jobs that publish progress to channels.

```yaml
workflow:
  dispatch:
    job: "refactor-auth-module"
    tasks:
      - batch: "refactor each auth file (12 files, 4 parallel)"
      - reduce: "run full test suite"
      
  channels:
    publish_to: "dev-progress"
    events:
      - "task.started"     # when each file begins
      - "task.complete"    # when each file finishes
      - "job.complete"     # when all tasks done
      - "job.failed"       # on any failure
      
  subscribers:
    - session: "main-dev"
      on: "job.complete"
      action: "Review changes and create PR"
    - session: "monitoring"
      on: "job.failed"
      action: "Alert developer with error details"
```

---

## Common Patterns

### Overnight Autonomous Work
1. Dispatch a large refactoring job before leaving
2. Job publishes progress to a channel
3. Next morning, check the channel for completion status and results

### CI/CD Integration
1. CI pipeline dispatches Claude Code for code review
2. Review results published to a channel
3. PR comment subscriber automatically posts the review

### Multi-Agent Research
1. Dispatch 3 research agents in parallel (frontend, backend, infra)
2. Each publishes findings to a shared channel
3. Synthesizer agent subscribes, waits for all 3, then produces the report

---

## Related

- **Skills:** `dispatch-background-jobs`, `channels-event-streaming`
- **Guides:** Auto Mode, Remote Control
- **Concepts:** Agent Teams, Skill Composition
