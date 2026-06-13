# Multi-Agent Saga Pattern

Coordinates distributed operations across multiple agents using compensating transactions — any step failure triggers automatic rollback in reverse order, without requiring distributed locks or two-phase commit.

---

## When to use

- Multi-agent workflows where each agent mutates state independently (database writes, API calls, file changes)
- Operations that must be atomically committed or fully reversed
- Sequences longer than 2 steps where partial failure leaves the system in an inconsistent state
- Anywhere you'd otherwise reach for distributed transactions but want to avoid the coordination overhead

Do not use for read-only workflows, single-agent pipelines, or operations that are naturally idempotent and safe to retry without rollback.

---

## Phases / Steps

### Saga vs. Two-Phase Commit

2PC requires a coordinator to hold distributed locks while all participants vote and commit. It guarantees atomicity but blocks on lock contention and fails hard if the coordinator crashes mid-commit. The saga pattern trades strong atomicity for eventual consistency: each step commits locally and publishes an event. If a later step fails, compensating actions undo prior commits. No locks, no coordinator bottleneck. The system may be transiently inconsistent (payment charged before order confirmed) but converges to a consistent state.

**Choose saga when:** steps span external services with their own transaction boundaries, or lock contention is unacceptable at scale.  
**Choose 2PC when:** all participants share one database and atomicity is non-negotiable.

---

### Step Definition Format

Every saga step is a pair:

```json
{
  "step_id": "charge_payment",
  "forward": {
    "agent": "payment-agent",
    "action": "charge",
    "input": { "order_id": "{{order_id}}", "amount": "{{total}}" },
    "output_key": "payment_id"
  },
  "compensate": {
    "agent": "payment-agent",
    "action": "refund",
    "input": { "payment_id": "{{payment_id}}" }
  }
}
```

Rules:
- `output_key` captures forward-action output into the compensation context map.
- `compensate.input` can reference any key in the accumulated context using `{{key}}` notation.
- Every forward action must have a defined compensating action — no exceptions.
- Compensating actions must be idempotent (safe to call twice).

---

### Execution Sequence

**Forward pass:** execute steps in order. After each step, append its output to the compensation context.

```
step 1 → success → context += {order_id: "o_123"}
step 2 → success → context += {reservation_id: "r_456"}
step 3 → FAIL
  → rollback: compensate step 2 (context has reservation_id) → success
  → rollback: compensate step 1 (context has order_id) → success
  → return saga_result: FAILED_AND_ROLLED_BACK
```

**On failure:** run compensations in reverse order for all previously successful steps. Do not run the compensation for the failed step itself — it never committed.

**On compensation failure:** see Dead Letter Handling below.

---

### Passing Compensation Context Between Agents

The orchestrator maintains a mutable context map. Each agent call adds its output keys before the next step runs. Agents receive only the keys they need — do not pass the full context to every agent (reduces prompt injection risk and token cost).

```python
context = {}

for step in saga_steps:
    agent_input = resolve_template(step["forward"]["input"], context)
    result = run_agent(step["forward"]["agent"], step["forward"]["action"], agent_input)
    
    if result["status"] == "error":
        rollback(saga_steps, context, failed_at=step)
        return {"saga": "FAILED", "reason": result["error"]}
    
    context[step["forward"]["output_key"]] = result["output"]

return {"saga": "COMMITTED", "context": context}


def rollback(steps, context, failed_at):
    completed = [s for s in steps if s["step_id"] != failed_at["step_id"]]
    for step in reversed(completed):
        comp_input = resolve_template(step["compensate"]["input"], context)
        run_agent(step["compensate"]["agent"], step["compensate"]["action"], comp_input)
```

---

### Claude Code Implementation

Use the `Agent` tool with structured JSON handoff between agents. The orchestrator agent holds the saga plan in its system prompt and passes context as JSON in each subagent invocation.

**Orchestrator prompt pattern:**

```
You are a saga orchestrator. You are executing the following saga plan:

<saga_plan>
{{saga_plan_json}}
</saga_plan>

Current context:
<context>
{{context_json}}
</context>

Execute step: {{current_step_id}}

On success: return {"status": "ok", "output_key": "<value>"}
On failure: return {"status": "error", "error": "<reason>"}

Do not proceed to the next step. The orchestrator handles sequencing.
```

The orchestrator agent is the only agent that reads and writes the context map. Subagents are stateless — they receive exactly what they need and return exactly what the forward or compensate action produces.

---

### Dead Letter Handling

When a compensating action also fails, the saga cannot automatically achieve consistency. Steps:

1. Log the failed compensation with full context to a dead letter store (`.claude/saga-dead-letters.jsonl`).
2. Halt all remaining compensations — do not proceed blindly.
3. Page on-call or open a ticket with the dead letter payload.
4. Mark the saga state as `COMPENSATION_FAILED` — distinguishable from `FAILED_AND_ROLLED_BACK`.

```json
{
  "saga_id": "s_abc123",
  "state": "COMPENSATION_FAILED",
  "failed_step": "reserve_inventory",
  "failed_compensation": "release_inventory",
  "context": { "order_id": "o_123", "reservation_id": "r_456" },
  "error": "Inventory service timeout after 3 retries",
  "timestamp": "2026-05-23T14:32:00Z"
}
```

Compensations should be retried with exponential backoff before declaring failure — transient errors account for the majority of compensation failures.

---

## Example

**E-commerce order saga — 4 steps:**

| Step | Forward action | Compensating action |
|------|---------------|---------------------|
| 1 | `order-agent`: create order → `order_id` | `order-agent`: cancel order |
| 2 | `inventory-agent`: reserve items → `reservation_id` | `inventory-agent`: release reservation |
| 3 | `payment-agent`: charge card → `payment_id` | `payment-agent`: refund payment |
| 4 | `notification-agent`: send confirmation email | `notification-agent`: send cancellation email |

**Scenario: payment step fails (card declined)**

```
→ step 1: create order           → ok, order_id = "o_789"
→ step 2: reserve inventory      → ok, reservation_id = "r_012"
→ step 3: charge payment         → FAIL (card declined)
← compensate step 2: release reservation r_012  → ok
← compensate step 1: cancel order o_789          → ok
→ saga result: FAILED_AND_ROLLED_BACK
→ user sees: "Payment failed. Your order has been cancelled and inventory released."
```

Note: notification step (step 4) never ran, so it has no compensation to execute.

**Saga plan JSON for Claude Code orchestrator:**

```json
{
  "saga_id": "ecommerce_order",
  "steps": [
    {
      "step_id": "create_order",
      "forward": { "agent": "order-agent", "action": "create", "input": { "cart_id": "{{cart_id}}" }, "output_key": "order_id" },
      "compensate": { "agent": "order-agent", "action": "cancel", "input": { "order_id": "{{order_id}}" } }
    },
    {
      "step_id": "reserve_inventory",
      "forward": { "agent": "inventory-agent", "action": "reserve", "input": { "order_id": "{{order_id}}" }, "output_key": "reservation_id" },
      "compensate": { "agent": "inventory-agent", "action": "release", "input": { "reservation_id": "{{reservation_id}}" } }
    },
    {
      "step_id": "charge_payment",
      "forward": { "agent": "payment-agent", "action": "charge", "input": { "order_id": "{{order_id}}", "amount": "{{total}}" }, "output_key": "payment_id" },
      "compensate": { "agent": "payment-agent", "action": "refund", "input": { "payment_id": "{{payment_id}}" } }
    },
    {
      "step_id": "send_confirmation",
      "forward": { "agent": "notification-agent", "action": "confirm", "input": { "order_id": "{{order_id}}" }, "output_key": "notification_id" },
      "compensate": { "agent": "notification-agent", "action": "cancel_notify", "input": { "order_id": "{{order_id}}" } }
    }
  ]
}
```

---
