# Bug Investigation Workflow

Parallel multi-hypothesis debugging — when a bug's root cause is unclear, run multiple agents simultaneously investigating different theories. Significantly faster than sequential debugging.

## When to use

Use this workflow when:
- A bug has multiple plausible causes and you don't know which one
- A production issue needs rapid root cause identification
- You've been debugging the same bug for more than 30 minutes
- The bug is intermittent and hard to reproduce deterministically

## Phase 1: Hypothesis generation (5 minutes)

Before running any agents, define 3-5 mutually exclusive hypotheses:

```
Bug: [describe the symptom — exact error or behaviour]
Context: [what changed recently, what environment, what conditions trigger it]

Generate 3-5 distinct root cause hypotheses ranked by probability.
Each hypothesis should be:
- Specific (names a concrete cause, not "something wrong with auth")
- Testable (can be confirmed or ruled out by reading specific code)
- Mutually exclusive (not "maybe it's the cache or maybe the database")

Format:
H1 (most likely): [hypothesis] — evidence: [why you think this]
H2: [hypothesis] — evidence: [...]
H3: [hypothesis] — evidence: [...]
```

**Example hypotheses for "payment fails intermittently":**
```
H1: Race condition — two simultaneous requests creating duplicate orders
    Evidence: error only happens at high concurrency, logs show duplicate order IDs
H2: Stripe rate limit — hitting 100 req/s limit in peak traffic
    Evidence: errors spike exactly at traffic peaks, 429 in some error logs
H3: Database connection exhaustion — pool times out during high load
    Evidence: error message "connection timeout" appears in some cases
H4: Webhook retry collision — Stripe retrying a previously-failed webhook
    Evidence: some duplicate charges trace to the same webhook event ID
```

## Phase 2: Parallel investigation

Spawn one agent per hypothesis. Each agent gets exactly one theory to investigate and nothing else:

```
[Run these agents in parallel, not sequentially]

Agent 1 (H1 — Race condition):
"Investigate whether a race condition is causing duplicate orders.
Look at: src/api/orders/create.ts, database transaction isolation level,
any mutex or locking mechanism in place.
Goal: confirm or rule out this hypothesis with specific code evidence."

Agent 2 (H2 — Stripe rate limit):
"Investigate whether we're hitting Stripe API rate limits.
Look at: src/services/stripe.ts, request logging, Stripe dashboard if accessible,
any retry logic or queue for Stripe calls.
Goal: confirm or rule out with evidence."

Agent 3 (H3 — DB connection pool):
"Investigate whether database connection pool exhaustion causes payment failures.
Look at: database connection config, pool size vs concurrent requests,
any connection error logs.
Goal: confirm or rule out with evidence."

Agent 4 (H4 — Webhook replay):
"Investigate whether Stripe webhook retries cause duplicate processing.
Look at: src/webhooks/stripe.ts, idempotency key implementation,
webhook event ID deduplication.
Goal: confirm or rule out with evidence."
```

## Phase 3: Synthesis (after all agents report)

```
Given these investigation results: [paste all agent outputs]

1. Which hypothesis was confirmed and why?
2. What evidence rules out the other hypotheses?
3. What is the specific fix?
4. What tests would prevent this regression?
```

## Phase 4: Fix and verify

Implement the fix for the confirmed hypothesis only.

Run the specific test case that would have caught this bug:
```bash
# Add a regression test first
# Then implement the fix
# Then confirm the test passes
```

## Alternative: Rapid-fire triage (< 15 min bugs)

For simpler bugs with an obvious culprit, skip parallel agents and use this fast checklist:

```
1. What changed in the last deploy? (git log --since="2 hours ago")
2. Is the error reproducible in isolation? (minimal reproduction)
3. What does the stack trace say? (read the actual line, don't guess)
4. Is there a test that should have caught this? (if not, write it before fixing)
5. Fix → verify test → deploy
```

## Related content

- `/agents/roles/incident-commander` — for production incidents requiring comms
- `/skills/productivity/debug` — debugging skill for single-agent investigation
- `/skills/productivity/self-eval` — score the quality of your debugging process

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
