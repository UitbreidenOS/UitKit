# Two-Claude Spec Review

## Purpose
Uses a subagent to independently review a plan or spec as a skeptical senior engineer before implementation begins.

## When to use
- Before implementing any non-trivial feature from a written spec or design doc
- When you've written a plan yourself and want an adversarial review before committing to it
- At the start of a greenfield project to stress-test assumptions early
- When the cost of a wrong approach is high (schema migrations, public APIs, infrastructure changes)

## The Prompt

```
Before we implement this, spin up a subagent to review the plan as a skeptical staff engineer.

Give the subagent this exact spec:
---
$SPEC
---

Ask the subagent to:
1. Identify the 3 most likely ways this plan will fail
2. List any unstated assumptions that could invalidate the approach
3. Flag any missing edge cases
4. Suggest the one change that would most improve the plan
5. Give a GO / NO-GO verdict with one sentence of reasoning

Report back the subagent's full findings before we write any code.
```

## Variables

- `$SPEC` — the plan, design doc, or feature description to review. Can be a paragraph, a bullet list, or a full technical spec. Paste it directly in place of `$SPEC`.

## Example

**Scenario:** You've written a plan to add rate limiting to an API using Redis.

**Fill in the prompt:**

```
Before we implement this, spin up a subagent to review the plan as a skeptical staff engineer.

Give the subagent this exact spec:
---
Add rate limiting to all authenticated API endpoints. Use Redis to store a counter per user ID with a 1-minute sliding window. If a user exceeds 100 requests per minute, return 429. The counter key is `ratelimit:{userId}` and expires after 60 seconds.
---

Ask the subagent to:
1. Identify the 3 most likely ways this plan will fail
2. List any unstated assumptions that could invalidate the approach
3. Flag any missing edge cases
4. Suggest the one change that would most improve the plan
5. Give a GO / NO-GO verdict with one sentence of reasoning

Report back the subagent's full findings before we write any code.
```

**Expected subagent output:**

```
Failure modes:
1. Redis unavailable — no fallback defined; all requests will fail or all will pass depending on error handling, neither is correct
2. Sliding window via TTL is actually a fixed window — `EXPIRE 60` resets on each write, not a true sliding window
3. Counter increment and expiry are two separate commands — race condition possible under concurrent requests

Unstated assumptions:
- Redis is already in the infrastructure and latency is acceptable on every request
- "Authenticated endpoints" means all routes behind auth middleware — unauthenticated endpoints are excluded

Missing edge cases:
- What happens to the rate limit counter when a user's auth token is revoked?
- Bulk API clients that legitimately need >100 req/min have no override path

Top improvement: Use a Lua script for atomic increment-and-expire to eliminate the race condition.

Verdict: NO-GO — the sliding window implementation is incorrect and will produce unexpected behavior under load. Fix the windowing logic before implementing.
```

---
