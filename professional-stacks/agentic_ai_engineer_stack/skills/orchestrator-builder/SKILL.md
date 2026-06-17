# Orchestrator Builder

## When to activate

When designing multi-agent workflows, defining task dependencies and resource constraints, planning agent coordination logic, or building resilient orchestration systems.

## When NOT to use

For single-agent systems; for simple sequential scripts; for orchestrations without explicit failure handling or resource constraints.

## Instructions

An orchestrator coordinates multiple agents. It must define:

1. **Task graph** — Agents and their dependencies (which agent can start after which completes).
2. **Resource constraints** — Token budgets, concurrency limits, timeout windows.
3. **Coordination protocol** — How agents share state, resolve conflicts, coordinate decisions.
4. **Failure scenarios** — What happens when an agent fails, times out, or produces invalid output.
5. **Observability** — Metrics for orchestration health, latency, resource utilization, failure rates.

### Orchestration Design Checklist

- [ ] **Task graph is clear.** Explicit dependencies; ASCII diagram or textual description.
- [ ] **Ordering is defined.** Sequential? Parallel? Hierarchical? Consensus?
- [ ] **Resource limits are set.** Token budget, max concurrent agents, timeout per task.
- [ ] **State sharing is explicit.** How do agents share state? Shared database? Event bus? Direct handoff?
- [ ] **Conflict resolution is specified.** If two agents produce conflicting outputs, how is this resolved?
- [ ] **Failure scenarios are documented.** Each failure mode has a detection mechanism and recovery.
- [ ] **Monitoring is planned.** Metrics for latency, throughput, failure rates, resource usage.
- [ ] **Rollback is possible.** Can the orchestration be rolled back or paused if a step fails?

### Coordination Patterns

**Sequential (Pipeline):**
```
Agent A → Agent B → Agent C
```
Each agent waits for previous to complete. Used for workflows with strict ordering.

**Parallel (Map-Reduce):**
```
Agent A ⇉ [Agent B1, Agent B2, Agent B3] ⇉ Agent C
```
Multiple agents work on independent tasks simultaneously; results aggregated.

**Hierarchical (Tree):**
```
    Agent Supervisor
       /    |    \
    Agent1 Agent2 Agent3
```
Parent delegates to children; children escalate. Used for complex decision trees.

**Consensus (Voting):**
```
[Agent1, Agent2, Agent3] → Consensus Logic → Final Decision
```
Multiple agents evaluate same input; decision by voting or consensus. Used for high-stakes decisions.

**Pub-Sub (Event-Driven):**
```
Agent A (publishes event) → Event Bus → Agent B, Agent C (subscribe)
```
Agents react to events asynchronously. Used for loosely coupled systems.

### Template

```markdown
# Orchestration: [Name]

## Purpose
[One sentence: what process does this orchestration implement?]

## Task Graph

[ASCII diagram or textual description]

Example:
```
     Request
        |
     Agent A (research)
        |
     Agent B (outline)
        |
    [Agent C1, C2, C3] (write sections in parallel)
        |
     Merge Results
        |
     Agent D (review)
        |
     [Approved OR Rejected]
```

## Resource Constraints

- **Max concurrent agents:** [N agents running simultaneously]
- **Total token budget:** [K tokens across all agents]
- **Per-agent timeout:** [T seconds before aborting single agent]
- **Orchestration timeout:** [T seconds before aborting entire workflow]
- **Max retries per agent:** [N before escalating]

## Task Dependencies

| Task ID | Agent | Depends On | Type | Timeout | Retries |
|---|---|---|---|---|---|
| 1 | Agent A | none | sequential | 30s | 3 |
| 2 | Agent B | Task 1 | sequential | 60s | 2 |
| 3a | Agent C1 | Task 2 | parallel | 45s | 1 |
| 3b | Agent C2 | Task 2 | parallel | 45s | 1 |
| 4 | Merge | Tasks 3a, 3b | join | 10s | 1 |
| 5 | Agent D | Task 4 | sequential | 30s | 2 |

## Coordination Protocol

### State Sharing
- Type: [Shared database / Event bus / Direct handoff / Shared memory]
- Implementation: [How state is accessed, locked, updated]
- Consistency model: [Strong consistency / Eventual consistency / Weak consistency]

Example (database):
```
Agent A writes to table `orchestration_state` with key `run_id`
Agent B polls/subscribes to same table; reads after Agent A completes
```

### Conflict Resolution
If Agent C1 and C2 produce conflicting outputs:
- Voting: Majority wins
- Priority: C1 takes precedence if tied
- Human escalation: Escalate if disagreement threshold exceeded
- Merge: Combine outputs using defined merge logic

### Ordering Guarantees
- Agent A must complete before Agent B starts
- Agents C1, C2, C3 can run in any order or in parallel
- Merge task can start after ANY two of C1, C2, C3 complete (quorum) or AFTER ALL complete

## Failure Scenarios

### Scenario 1: Agent Timeout

**Detection:** Agent does not respond within timeout window

**Recovery:**
1. Cancel running task
2. Retry with backoff (exponential: 1s, 2s, 4s)
3. After max retries, escalate to supervisor or fallback agent
4. Log timeout with context for debugging

**Example code:**
```python
try:
    result = await agent_call(timeout=30s)
except TimeoutError:
    for attempt in range(max_retries):
        try:
            result = await agent_call(timeout=30s + backoff(attempt))
            break
        except TimeoutError:
            if attempt == max_retries - 1:
                escalate_to_supervisor()
```

### Scenario 2: Output Validation Failure

**Detection:** Agent output does not match expected schema

**Recovery:**
1. Log validation failure with expected/actual schemas
2. Retry agent with clarified instructions
3. After max retries, request human correction or escalate
4. Do NOT proceed with invalid output

### Scenario 3: Resource Exhaustion

**Detection:** Token budget exceeded or memory limit hit

**Recovery:**
1. Pause new agent tasks
2. Wait for running tasks to complete
3. If still over budget, reduce scope (skip lower-priority tasks)
4. Escalate if cannot continue with reduced scope

### Scenario 4: Deadlock (Multi-agent coordination)

**Detection:** No progress for [T] seconds; multiple agents waiting on each other

**Recovery:**
1. Identify which agents are blocked
2. Force-complete one agent with default output
3. Allow other agents to proceed
4. Log deadlock incident; review coordination logic

### Scenario 5: Cascading Failures

**Detection:** One agent failure causes multiple downstream agents to fail

**Recovery:**
1. Stop cascading immediately
2. Retry failed agent; if successful, retry downstream agents
3. If failed agent cannot be recovered, escalate entire orchestration
4. Log cascade pattern for root cause analysis

## Observability

### Key Metrics

| Metric | Type | Target | Alerting |
|---|---|---|---|
| `orchestration_success_rate` | Gauge | 95%+ | Alert if < 90% |
| `orchestration_latency_p95_ms` | Histogram | < 300s (TBD) | Alert if > 600s |
| `agent_task_timeout_rate` | Counter | < 5% | Alert if > 10% |
| `resource_utilization_percent` | Gauge | 60-80% | Alert if > 90% |
| `orchestration_retry_rate` | Gauge | < 10% | Alert if > 20% |

### Tracing & Logging

Log every event:

```json
{
  "timestamp": "2026-06-15T10:30:00Z",
  "orchestration_id": "run_12345",
  "task_id": "task_2",
  "agent_name": "Agent B",
  "event": "task_started|task_completed|task_failed|task_retried",
  "status": "success|failure|timeout|validation_error",
  "latency_ms": 1234,
  "tokens_used": 2048,
  "error_message": "[if failed]",
  "retry_count": 1,
  "cascade_depth": 0
}
```

### Alerting

- **High timeout rate** (> 10%): Check agent performance, external service availability
- **High escalation rate** (> 30%): Agent scope may be too broad; recalibrate
- **Resource exhaustion**: Increase budget or reduce scope
- **Cascading failures**: Review task dependencies; add circuit breakers

## Rollback & Pause

- **Pause:** Orchestration can pause after current task completes; resume from same point
- **Rollback:** If critical downstream step fails, can revert previous task outputs (if idempotent) and retry
- **Abort:** Stop immediately; document partial completion

## Monitoring Dashboard

Essential visualizations:
- Orchestration success rate over time
- Task latency distribution (P50, P95, P99)
- Agent utilization (tokens, time, success rate per agent)
- Failure rate by failure type
- Resource usage (tokens, concurrency)
```

## Example

### Example: Content Production Orchestration

```markdown
# Orchestration: ContentProductionPipeline

## Purpose
Autonomously produce high-quality blog articles with research, outlining, writing, and review.

## Task Graph

```
    User Request
         |
   1. Research Agent
         |
   2. Outline Agent
         |
  [3a, 3b, 3c] Write Sections (parallel)
         |
   4. Merge Sections
         |
   5. Review Agent
         |
   [Approved → Publish] OR [Rejected → Return to Research]
```

## Resource Constraints

- **Max concurrent agents:** 4 (write 3 sections + 1 review)
- **Token budget:** 150K tokens
- **Per-agent timeout:** 120s (research), 60s (outline), 90s (write), 60s (review)
- **Orchestration timeout:** 600s (10 minutes)
- **Max retries per agent:** 2

## Task Dependencies

| Task | Agent | Depends On | Type | Timeout | Retries |
|------|-------|-----------|------|---------|---------|
| 1 | Research | none | seq | 120s | 2 |
| 2 | Outline | Task 1 | seq | 60s | 2 |
| 3a | WriteSec1 | Task 2 | par | 90s | 1 |
| 3b | WriteSec2 | Task 2 | par | 90s | 1 |
| 3c | WriteSec3 | Task 2 | par | 90s | 1 |
| 4 | Merge | Tasks 3a, 3b, 3c | join | 30s | 1 |
| 5 | Review | Task 4 | seq | 60s | 1 |

## Coordination Protocol

**State Sharing:** Shared PostgreSQL database
- Table `articles_draft` stores intermediate outputs
- Each task writes to `articles_draft.task_output` with `task_id` key
- Next task reads from same row

**Conflict Resolution:**
- Section writes cannot conflict (independent sections)
- Merge step validates all sections present before combining
- Review step compares output to outline; if quality gap, escalate

**Ordering:**
- Research → Outline (strict)
- Outline → 3 writes (strict start; parallel execution)
- Writes → Merge (must complete all 3)
- Merge → Review (strict)

## Failure Scenarios

### Scenario: Write Agent Timeout
**Detection:** WriteSec1 does not complete in 90s
**Recovery:**
- Retry WriteSec1 once with extended timeout (120s)
- If still fails, use fallback outline as section content
- Continue to next task; flag quality issue for review

### Scenario: Merge Validation Fails
**Detection:** One section missing or malformed
**Recovery:**
- Request missing section from corresponding Write agent
- Retry merge; do not proceed with incomplete article

### Scenario: Review Rejects Article
**Detection:** Review agent confidence < 0.7
**Recovery:**
- Escalate to human editor (not automated retry)
- Do not re-run entire pipeline automatically

### Scenario: Token Budget Exceeded
**Detection:** 140K tokens used before review step
**Recovery:**
- Complete review task (critical path)
- Do not retry failed sections
- Log token budget overage; adjust future budget

## Observability

### Metrics

- `content_production_completion_rate` (target: 95%)
- `content_production_latency_p95_ms` (target: 300s, alert > 600s)
- `section_write_timeout_rate` (target: < 5%, alert > 10%)
- `review_rejection_rate` (target: < 20%)
- `token_utilization_percent` (target: 70-80%, alert > 95%)

### Logs (structured)

```json
{
  "orch_id": "article_run_20260615_001",
  "task_id": "task_3a",
  "agent": "WriteSec1",
  "event": "task_started",
  "timestamp": "2026-06-15T10:30:15Z",
  "outline_input_tokens": 512,
  "section_prompt_tokens": 1024
}
```

### Dashboards

- Content success rate (% completing review)
- Latency per task (bottleneck identification)
- Token consumption per task
- Failure reason breakdown (timeouts vs. rejections vs. validation)
```

This example shows task dependencies, parallel execution, failure recovery, and observability for a real content workflow.

## Success Criteria

A well-designed orchestration:

- [ ] Task graph is unambiguous (no circular dependencies)
- [ ] All failure scenarios have documented recovery
- [ ] Resource constraints are realistic and enforced
- [ ] State sharing mechanism is clear and consistent
- [ ] Metrics capture latency, success, and resource usage
- [ ] Rollback/pause is possible or explicitly documented as not possible
- [ ] Observability plan captures all critical path tasks
