# Build Orchestrator

## When to activate

When designing multi-agent workflows, defining task dependencies and resource constraints, coordinating agent interactions, or building resilient orchestration systems.

## When NOT to use

For single-agent systems; for simple sequential scripts; for orchestrations without failure handling.

## Instructions

Use this command to interactively design a multi-agent orchestration. You will define:

1. **Workflow name** — What process is being orchestrated?
2. **Agent list** — Which agents participate?
3. **Task graph** — Dependencies between agents
4. **Resource constraints** — Token budgets, timeouts, concurrency limits
5. **Failure scenarios** — What can go wrong and how to recover
6. **Coordination logic** — How agents share state and resolve conflicts
7. **Success criteria** — When is the orchestration complete?

The output is a complete orchestration specification with task graph, dependencies, resource limits, and failure recovery.

### Interactive Design Flow

```
1. What is this orchestration called? [Name]
2. What process does it implement? [Purpose]
3. Which agents participate?
   [List agents by name]

4. Draw the task graph (dependencies):
   Agent A → Agent B → Agent C
   or
   Agent A → [Agent B1, Agent B2] → Agent C (parallel)

5. Resource constraints:
   - Max concurrent agents: [N]
   - Total token budget: [K tokens]
   - Per-agent timeout: [T seconds]
   - Orchestration timeout: [T seconds]

6. Task dependencies (detailed):
   Task 1: Agent A (depends on: none)
   Task 2: Agent B (depends on: Task 1)
   Task 3: Agent C (depends on: Task 2)

7. Failure scenarios:
   - If Agent A times out: [retry/escalate/default]
   - If Agent B outputs invalid: [retry/escalate]
   - If token budget exceeded: [reduce scope/escalate]

8. State coordination:
   - How do agents share state? [database/event bus/direct]
   - How are conflicts resolved? [voting/priority/merge]

9. Success criteria:
   - All tasks complete
   - Latency < [T] seconds
   - Success rate > [X]%

Output:
- Orchestration specification (MARKDOWN)
- Task dependency graph (ASCII diagram)
- Failure recovery procedures
- Monitoring and alerting configuration
```

## Example

### Example: Content Production Orchestration

```
1. Orchestration name?
   → BlogPostProduction

2. Purpose?
   → Autonomously produce blog posts from topic to publication with research, outlining, writing, and review.

3. Agents?
   → ResearchAgent
   → OutlineAgent
   → WriteSectionAgent (parallelized x3)
   → MergeAgent
   → ReviewAgent

4. Task graph?
   Start
     → ResearchAgent
     → OutlineAgent
     → [WriteSec1, WriteSec2, WriteSec3] (parallel)
     → MergeAgent
     → ReviewAgent
     → Success or Rejected

5. Resource constraints?
   - Max concurrent agents: 4
   - Total token budget: 150,000 tokens
   - Per-agent timeout: 60-120 seconds
   - Orchestration timeout: 600 seconds

6. Task dependencies?
   Task 1: ResearchAgent (timeout: 120s, retries: 2)
   Task 2: OutlineAgent (depends on Task 1; timeout: 60s)
   Task 3a: WriteSec1 (depends on Task 2; timeout: 90s; parallel)
   Task 3b: WriteSec2 (depends on Task 2; timeout: 90s; parallel)
   Task 3c: WriteSec3 (depends on Task 2; timeout: 90s; parallel)
   Task 4: MergeAgent (depends on Tasks 3a,3b,3c; timeout: 30s)
   Task 5: ReviewAgent (depends on Task 4; timeout: 60s)

7. Failure scenarios?
   - Task timeout: Retry with backoff (1s, 2s, 4s), max 2 retries; escalate if still failing
   - Output validation: Retry with clarified instructions; escalate after 2 retries
   - Token budget exceeded: Stop new tasks; complete critical path only
   - Task failure: Dependent tasks timeout quickly (skip); escalate

8. State coordination?
   - Database: PostgreSQL table `article_drafts` with task outputs
   - Conflicts: Parallel write tasks cannot conflict (independent sections)
   - Merge: Validate all sections present before merging

9. Success criteria?
   - All tasks complete: Yes
   - Orchestration latency P95: < 300 seconds
   - Success rate (% producing final output): > 95%
   - Human approval rate: < 20% of articles rejected
```

**Output Generated:**

Complete orchestration specification with all details above, task graph diagram, resource allocation plan, failure recovery procedures, and monitoring configuration.

---

Output the orchestration specification in the following format:

```markdown
# Orchestration: [Name]

## Purpose
[What process does this orchestration implement?]

## Task Graph

[ASCII diagram of agent tasks and dependencies]

Example:
```
     Request
        |
     Task 1: Agent A
        |
     Task 2: Agent B
        |
   [Task 3a, 3b, 3c] (parallel)
        |
     Task 4: Merge
        |
     Task 5: Agent C
        |
     Success/Failure
```

## Resource Constraints

- Max concurrent agents: [N]
- Total token budget: [K tokens]
- Per-agent timeout: [T seconds]
- Orchestration timeout: [T seconds]
- Max retries per agent: [N]

## Task Dependencies

| Task ID | Agent | Depends On | Timeout | Retries |
|---|---|---|---|---|
| 1 | Agent A | none | 120s | 2 |
| 2 | Agent B | Task 1 | 60s | 2 |
| ... |

## Coordination Protocol

- State sharing: [Database/Event bus/Direct]
- Conflict resolution: [Voting/Priority/Merge]
- Ordering: [Strict/Partial]

## Failure Scenarios

| Failure | Detection | Recovery |
|---|---|---|
| Timeout | No response > T | Retry with backoff; escalate after max retries |
| Validation | Schema mismatch | Retry with clarified instructions; escalate |
| Resource exhaustion | Token budget exceeded | Reduce scope; complete critical path |

## Observability

- Key metrics: [latency, success rate, retry rate]
- Dashboards: [Task graph with status, latency distribution]
- Alerts: [Failure rate > 5%, latency P95 > target, token budget > 90%]

## Success Criteria

- [ ] All tasks complete without errors
- [ ] Orchestration latency < [target]
- [ ] Success rate > [target]%
```

This orchestration specification is production-ready and can be deployed immediately.
