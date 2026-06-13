# Challenge Prompts

## Purpose
Three prompts that push Claude to verify its own work rather than just completing it.

## When to use
Use these prompts when you want to slow down and pressure-test before shipping — specifically:
- **Prompt A** — before creating a PR on any non-trivial change; when you want a code review simulation
- **Prompt B** — when Claude says "this should work" and you need proof, not assurance
- **Prompt C** — after a working-but-ugly fix lands and you want the clean version before merging

---

## Prompt A — Grill me before committing

### When to use
Before creating a PR. Particularly useful after a long session where confidence may have drifted and assumptions piled up.

### The Prompt

```
Before creating the PR, I want you to grill me on these changes. Ask me the 5 hardest questions a senior engineer would ask in a code review. Don't create the PR until I answer all 5 questions satisfactorily.
```

### Variables

None.

### Example

**Scenario:** You've refactored a payment processing module and Claude is about to open a PR.

**Usage:** Paste Prompt A before asking for the PR.

**Expected output:**

```
1. You've changed how idempotency keys are generated — what happens if the same request comes in twice within the new key window?
2. The retry logic now catches all errors — should network timeouts and business logic errors really be retried the same way?
3. You removed the mutex on the charge lock — what prevents a race condition under concurrent requests?
4. The new code hits the Stripe API before validating the cart total — is that intentional?
5. You haven't updated the integration tests — do the existing ones still cover the new code path?
```

---

## Prompt B — Prove it works

### When to use
When Claude has just completed a task and reports success without running anything. When you need evidence, not confidence.

### The Prompt

```
Prove to me this works. Don't tell me it should work — demonstrate it. Run the tests, check the diff between main and this branch, show me the actual output. If anything fails, fix it before reporting back.
```

### Variables

None.

### Example

**Scenario:** Claude has just wired up a new API endpoint and says "the implementation looks correct."

**Usage:** Paste Prompt B immediately after.

**Expected output:**

```
Running: npm test -- --testPathPattern=src/api/orders
PASS src/api/orders.test.ts (12 tests, 0 failures)

Running: git diff main...HEAD --stat
 src/api/orders.ts     | 47 +++++++++
 src/api/orders.test.ts| 31 ++++++

curl -X POST http://localhost:3000/orders -d '{"item":"abc"}' -H "Content-Type: application/json"
{"id":"ord_123","status":"created"}

All checks pass. PR is ready.
```

---

## Prompt C — Elegant solution after a mediocre fix

### When to use
After a working fix lands that you know is hacky. Before merging anything with "TODO: clean this up" in it. When a working solution exists but its shape is wrong.

### The Prompt

```
I know this works, but it's not elegant. Knowing everything you've learned solving this problem, scrap the current implementation and build the clean version. What would you write if you were doing this fresh?
```

### Variables

None.

### Example

**Scenario:** You just fixed a race condition using a global flag variable — it works but the approach is fragile.

**Usage:** Paste Prompt C after confirming the fix works.

**Expected output:**

```
The flag-based approach works but it's a symptom fix. Now that I understand the root cause — concurrent writes to the same record — the clean version uses a database-level advisory lock instead of application state.

Here's the rewrite:
[clean implementation using proper locking]

This removes the global, makes the concurrency guarantee explicit, and works correctly across multiple processes.
```

---
