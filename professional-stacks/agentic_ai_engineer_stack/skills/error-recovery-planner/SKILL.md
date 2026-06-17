# Error Recovery Planner

## When to activate

When designing fault tolerance for agents, planning retry strategies, implementing circuit breakers, or defining rollback procedures for multi-agent systems.

## When NOT to use

For systems with no failure tolerance requirements; for one-off scripts; for non-critical operations where failure is acceptable.

## Instructions

Every agent failure must have a recovery plan. Recovery is not optional; it is designed into the system.

A complete recovery plan includes:

1. **Failure detection** — How do we know something went wrong?
2. **Failure classification** — Transient (retry) or permanent (escalate)?
3. **Retry strategy** — How many times, with what backoff, with what limits?
4. **Fallback behavior** — What happens if retry exhausted?
5. **Escalation path** — Who/what do we escalate to?
6. **Rollback capability** — Can we undo the failed action?
7. **Circuit breaker** — When do we stop retrying and fail fast?
8. **Observability** — How do we detect and alert on repeated failures?

### Failure Classification

**Transient failures** (retry safely):
- Network timeout
- Temporary service unavailability
- Rate limit (try again later)
- Deadlock in orchestration (backoff and retry)

**Permanent failures** (escalate, don't retry):
- Input validation failure
- Constraint violation (agent violated bounds)
- Authorization failure
- Unsupported request type

**Ambiguous failures** (retry N times, then escalate):
- Agent timeout with unknown state
- Invalid output (schema mismatch)
- Inconsistent results across retries

### Template

```markdown
# Error Recovery Plan: [System/Agent Name]

## Failure Modes

### Failure 1: [Timeout]

**Detection:** Agent does not respond within timeout window

**Classification:** Transient (likely recoverable with retry)

**Root Causes:**
- External service latency
- Agent processing took longer than expected
- Network delay

**Recovery Strategy:**

```
Attempt 1: retry after 1s
Attempt 2: retry after 2s
Attempt 3: retry after 4s
Attempt 4: escalate to supervisor (do not retry further)
```

**Timeout per attempt:** [N] seconds
**Max retries:** 3
**Backoff:** Exponential (1s, 2s, 4s)
**Jitter:** Add ±10% random jitter to avoid thundering herd

**Fallback if all retries fail:**
- Escalate to human supervisor with "agent_timeout" reason
- Do NOT default to unsafe decision
- Log all retry attempts and latencies

**Circuit breaker:**
- If timeout rate > 10% over last 5 minutes, stop retrying
- Switch to manual approval queue
- Alert ops team

**Logging:**
```json
{
  "failure_type": "timeout",
  "agent": "Agent Name",
  "attempt": 1,
  "timeout_ms": 30000,
  "backoff_ms": 1000,
  "next_action": "retry",
  "timestamp": "ISO 8601"
}
```

### Failure 2: [Output Validation Failure]

**Detection:** Agent output does not match expected schema

**Classification:** Ambiguous (could be transient or permanent)

**Root Causes:**
- Agent hallucination
- Prompt misunderstanding
- Model state corruption

**Recovery Strategy:**

```
Attempt 1: retry with clarified prompt
Attempt 2: retry with example in prompt
Attempt 3: escalate to human (do not retry further)
```

**Retry logic:**
- Attempt 1: Include current output in feedback loop
- Attempt 2: Add concrete example to system prompt
- Attempt 3: Escalate (do not force invalid output)

**Fallback:**
- Escalate to human with validation failure details
- Provide expected schema and actual output for debugging

**Do NOT:**
- Ignore validation failure
- Force invalid output through
- Modify output to make it valid (data loss)

**Logging:**
```json
{
  "failure_type": "output_validation",
  "agent": "Agent Name",
  "expected_schema": {...},
  "actual_output": {...},
  "validation_errors": ["field X missing", "field Y type mismatch"],
  "attempt": 1,
  "next_action": "retry_with_clarified_prompt"
}
```

### Failure 3: [Constraint Violation]

**Detection:** Agent violates hard constraint (e.g., tries to approve expense > limit)

**Classification:** Permanent (agent is miscalibrated)

**Root Causes:**
- Agent misunderstood its bounds
- Constraint not enforced in prompt
- Agent behavior drift over time

**Recovery Strategy:**

```
Detect constraint violation → Block immediately → Escalate
DO NOT RETRY (constraint is hard limit)
```

**Escalation:**
- Log constraint violation with full context
- Escalate to supervisor with "constraint_violated" reason
- Do NOT execute the violating action
- Never weaken the constraint; investigate agent behavior instead

**Circuit breaker:**
- If single agent violates constraint > 5 times, suspend agent
- Require manual review before re-enabling
- Alert security/ops team

**Logging:**
```json
{
  "failure_type": "constraint_violation",
  "agent": "Agent Name",
  "constraint_name": "max_expense_limit",
  "constraint_value": 10000,
  "violated_value": 15000,
  "action_blocked": true,
  "escalation_action": "supervisor_review"
}
```

### Failure 4: [Multi-Agent Deadlock]

**Detection:** No progress in orchestration for [T] seconds; multiple agents waiting

**Classification:** Transient (coordination issue)

**Root Causes:**
- Circular dependencies in task graph
- Shared state lock held too long
- Race condition in agent coordination

**Recovery Strategy:**

```
Detect deadlock (no progress for 60s) →
Identify blocked agents →
Force-unblock one agent with default output →
Allow other agents to continue →
Escalate for root cause analysis
```

**Prevention:**
- Design task graph with no circular dependencies (validate with topological sort)
- Use timeout on shared state locks (no indefinite waiting)
- Implement deadlock detection (no task progress for T seconds)

**Recovery:**
1. Identify which agents are blocked
2. Force one blocked agent to complete with safe default
3. Retry other blocked agents
4. Continue orchestration
5. Log deadlock incident for post-mortem

**Logging:**
```json
{
  "failure_type": "deadlock",
  "agents_blocked": ["Agent A", "Agent B"],
  "detection_time_ms": 62000,
  "recovery_action": "force_complete_Agent_A",
  "default_value": {...}
}
```

### Failure 5: [Cascading Failures]

**Detection:** One agent fails; downstream agents also fail

**Classification:** Transient (dependent on upstream recovery)

**Root Causes:**
- Upstream agent produces invalid/incomplete output
- Downstream agent expects specific input format
- Propagation of single failure through pipeline

**Recovery Strategy:**

```
Upstream agent fails →
Retry upstream agent →
If upstream recovers, retry downstream agents →
If upstream unrecoverable, escalate entire orchestration
```

**Prevention:**
- Each task validates input before processing
- Fallback outputs available (e.g., cached prior results)
- Graceful degradation (reduced functionality, not failure)

**Recovery:**
1. Detect failure in downstream agent
2. Retry upstream agent that produced invalid output
3. If upstream succeeds, retry downstream
4. If upstream still fails, escalate entire orchestration

**Do NOT:**
- Ignore upstream failure and continue
- Propagate invalid data through pipeline
- Hope downstream agent handles bad input

**Logging:**
```json
{
  "failure_type": "cascading",
  "primary_failure": "Agent A",
  "secondary_failures": ["Agent B", "Agent C"],
  "cascade_depth": 2,
  "recovery_action": "retry_upstream_then_downstream"
}
```

## Retry Strategy Patterns

### Pattern 1: Exponential Backoff

Best for: Transient failures (timeouts, rate limits)

```
Attempt 1: wait 1s, retry
Attempt 2: wait 2s, retry
Attempt 3: wait 4s, retry
Attempt 4: wait 8s, retry
Attempt 5: escalate
```

Max retries: 3-5 (depends on cost)
Jitter: ±10% to avoid thundering herd

### Pattern 2: Linear Backoff

Best for: Gradual resource recovery

```
Attempt 1: wait 5s, retry
Attempt 2: wait 10s, retry
Attempt 3: wait 15s, retry
Attempt 4: escalate
```

### Pattern 3: Immediate Retry (No Backoff)

Best for: Transient race conditions, deadlock avoidance

```
Attempt 1: retry immediately
Attempt 2: retry immediately
Attempt 3: wait 100ms, retry
Attempt 4: escalate
```

Use sparingly; wastes resources if failure is persistent.

### Pattern 4: Adaptive Retry (Based on Failure Type)

Best for: Mixed failure modes

```
If timeout:
    use exponential backoff, max 5 retries
If rate limited:
    use exponential backoff, max 10 retries, longer wait
If validation error:
    retry max 2 times with modified prompt
If constraint violation:
    do not retry; escalate immediately
```

## Circuit Breaker Pattern

A circuit breaker stops retrying when failure rate exceeds threshold.

```
State: CLOSED (normal operation, retries allowed)
Condition: failure_count > threshold → switch to OPEN

State: OPEN (stop retrying, fail fast)
Condition: time_in_open > timeout → switch to HALF_OPEN

State: HALF_OPEN (test if service recovered)
Condition: next request succeeds → switch to CLOSED
Condition: next request fails → switch to OPEN (reset timeout)
```

**Configuration:**

- Failure threshold: 5 failures in window
- Time window: 5 minutes
- Timeout before retry: 60 seconds
- Test request: Next incoming request

**Implementation:**

```
if (circuit_state == OPEN):
    if (time_since_opened > timeout):
        circuit_state = HALF_OPEN
    else:
        fail_fast("circuit breaker open")

if (circuit_state == HALF_OPEN):
    try_request()
    if (success):
        circuit_state = CLOSED
        reset_failure_count()
    else:
        circuit_state = OPEN
        reset_timeout()

if (circuit_state == CLOSED):
    try_request()
    if (failure):
        increment_failure_count()
        if (failure_count > threshold):
            circuit_state = OPEN
```

## Rollback & State Recovery

**Idempotent operations:** Safe to replay. If agent returns "success", result is same if replayed.

Example: "Approve request 123" → idempotent (approving twice = approved once)

**Non-idempotent operations:** Unsafe to replay. Replaying changes result.

Example: "Deduct $100 from account" → non-idempotent (deducting twice = -$200)

**Recovery strategy:**

- **Idempotent:** Retry safely; state is consistent
- **Non-idempotent:** Require explicit rollback; log all side effects for manual recovery

**Logging for rollback:**

```json
{
  "action_id": "action_12345",
  "agent": "Agent Name",
  "action_type": "approve|deduct|modify",
  "idempotent": true|false,
  "side_effects": ["effect 1", "effect 2"],
  "rollback_procedure": "To undo: [steps]"
}
```

## Monitoring & Alerting

### Metrics to Track

| Metric | Type | Alert Threshold |
|---|---|---|
| `failure_rate` | Gauge | Alert if > 5% |
| `retry_rate` | Gauge | Alert if > 10% |
| `escalation_rate` | Gauge | Alert if > 20% |
| `circuit_breaker_open_count` | Counter | Alert if > 0 |
| `mean_retry_latency_ms` | Histogram | Alert if P95 > 60s |

### Dashboards

- **Failure breakdown:** By failure type (timeout, validation, constraint, deadlock)
- **Retry effectiveness:** % of failures that recover on first retry vs. requiring escalation
- **Circuit breaker status:** Which agents have open circuit breakers, for how long
- **Escalation load:** Volume of manual escalations per hour
- **Recovery latency:** Time from failure detection to successful recovery

## Testing Recovery

Before deploying, test every failure scenario:

- [ ] Timeout detection and retry works
- [ ] Retry with backoff doesn't retry too fast
- [ ] Max retry limit is enforced
- [ ] Escalation path is triggered after max retries
- [ ] Circuit breaker opens after failure threshold
- [ ] Circuit breaker closes after recovery
- [ ] Deadlock is detected within timeout window
- [ ] Cascading failure is contained (upstream failure doesn't crash downstream)
- [ ] Constraint violation is blocked (no unsafe action executed)
- [ ] All recovery attempts are logged with full context
```

## Example

### Example: Error Recovery for Content Moderator Agent

```markdown
# Error Recovery Plan: ContentModerator

## Failure Mode 1: Timeout (Agent takes > 10s)

**Detection:** Claude API timeout after 10 seconds

**Classification:** Transient

**Recovery:**
- Attempt 1: wait 500ms, retry
- Attempt 2: wait 1s, retry
- Attempt 3: wait 2s, retry
- Attempt 4: escalate with "timeout_after_3_retries"

**Circuit breaker:** If > 10% of requests timeout in 5-min window, pause moderation; alert ops

**Fallback:** Escalate to human moderator; flag content as "pending_human_review"

## Failure Mode 2: Output Validation (Invalid JSON response)

**Detection:** Response is not valid JSON; schema validation fails

**Classification:** Ambiguous (could be model hallucination or prompt misunderstanding)

**Recovery:**
- Attempt 1: retry with clearer JSON instructions
- Attempt 2: retry with example output in prompt
- Attempt 3: escalate (do not force invalid output)

**Fallback:** Escalate with "validation_failure_after_retries"; flag content for human review

**Do NOT:** Try to "fix" invalid JSON by modifying it

## Failure Mode 3: Constraint Violation (Agent violates content policy)

**Detection:** Agent attempts to approve content that violates critical policy

**Classification:** Permanent (agent is miscalibrated)

**Recovery:**
- Block action immediately
- Escalate to supervisor with full context
- Do NOT retry
- Do NOT execute violating action
- Investigate agent behavior drift

**Circuit breaker:** If single agent violates constraint > 3 times, suspend agent; require manual review

## Failure Mode 4: Cascading Failures (Merge step fails because write agent timed out)

**Detection:** Merge task fails because not all section outputs available

**Classification:** Transient (dependent on upstream recovery)

**Recovery:**
1. Detect merge failure (section missing)
2. Retry failed write agent
3. If write succeeds, retry merge
4. If write still fails, escalate entire moderation

## Monitoring

- `moderation_timeout_rate` (alert if > 5%)
- `moderation_validation_failure_rate` (alert if > 2%)
- `moderation_escalation_rate` (normal: 5-15%; alert if > 30%)
- `moderation_circuit_breaker_open` (alert if any open)
```

## Success Criteria

A complete error recovery plan:

- [ ] Every failure mode has detection mechanism
- [ ] Each failure is classified (transient vs. permanent)
- [ ] Retry strategy is specified (backoff, max attempts)
- [ ] Fallback behavior is defined
- [ ] Escalation path is clear
- [ ] Circuit breaker logic is implemented
- [ ] Rollback procedures are documented (for non-idempotent actions)
- [ ] All recovery attempts are logged
- [ ] Monitoring and alerting cover all failure modes
- [ ] Recovery is tested before deployment
