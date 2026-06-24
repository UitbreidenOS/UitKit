---
name: "root-cause-tracing"
description: "Root cause analysis: multi-layer log correlation, timeline reconstruction, blameless RCA methodology, evidence chain building, and systematic incident investigation"
---

# Root Cause Tracing — Systematic Incident Investigation

## When to activate
- Production incidents requiring postmortem (outages, data corruption, security breaches)
- Intermittent bugs that don't reproduce consistently
- Performance regressions where the triggering change is unclear
- Cascading failures across multiple services where the origin is obscured
- When "it works on my machine" but fails in production
- Investigating data inconsistencies without an obvious source

## When NOT to use
- Simple, obvious bugs with clear reproduction steps ("button doesn't work")
- Typos, formatting issues, or trivial UI fixes
- Greenfield projects with no production history
- Tasks where the root cause is already known and only the fix is needed

## Instructions

### 1. Investigation Framework (5 Whys + Evidence)

```
Incident: "API returning 500 errors for 15 minutes"
    │
    ├── Why 1: Why 500? → Unhandled exception in user service
    │   Evidence: Error log shows NullPointerException at UserService.java:147
    │
    ├── Why 2: Why null? → Database query returned no result for user_id=42
    │   Evidence: Query log shows SELECT * FROM users WHERE id=42 → 0 rows
    │
    ├── Why 3: Why no user? → User was deleted 3 minutes before the request
    │   Evidence: Audit log shows DELETE /users/42 at 14:02:33
    │
    ├── Why 4: Why not handled? → No soft-delete, hard DELETE removes row
    │   Evidence: Schema shows no 'deleted_at' column
    │
    └── Why 5: Why no defensive code? → API doesn't check for missing users
        Evidence: UserService.getUser() has no null check before processing
        
Root cause: Hard delete + no null check = unhandled exception
Fix: Add soft-delete AND add null-safety in UserService
```

### 2. Timeline Reconstruction

Build a precise chronological timeline from all available evidence:

```yaml
timeline:
  format: "ISO8601 + source + event + evidence_ref"
  
  events:
    - time: "2026-06-13T14:00:00Z"
      source: "deploy-pipeline"
      event: "Deployment v1.10.2 started"
      evidence: "ci-log-deploy-12345"
      
    - time: "2026-06-13T14:02:12Z"
      source: "kubernetes"
      event: "Pod claudient-api-7x8f9 ready (3/3 containers)"
      evidence: "kubectl-events.log"
      
    - time: "2026-06-13T14:02:33Z"
      source: "api-gateway"
      event: "DELETE /users/42 — 200 OK"
      evidence: "access.log line 88421"
      
    - time: "2026-06-13T14:05:17Z"
      source: "api-gateway"
      event: "GET /users/42/orders — 500 Internal Server Error"
      evidence: "access.log line 88433"
      
    - time: "2026-06-13T14:05:17Z"
      source: "user-service"
      event: "NullPointerException at UserService.java:147"
      evidence: "app-error.log line 4421"
      
    - time: "2026-06-13T14:20:00Z"
      source: "monitoring"
      event: "Alert: error_rate > 5% for 15 minutes"
      evidence: "grafana-alert-789"
```

### 3. Multi-Layer Log Correlation

Correlate across different log sources to find causal chains:

```
Layer 1: Access logs (API Gateway)
  → 14:05:17 GET /users/42/orders → 500
  
Layer 2: Application logs (User Service)
  → 14:05:17 NullPointerException at UserService.getUser()
  
Layer 3: Database logs (PostgreSQL)
  → 14:05:17 SELECT * FROM users WHERE id=42 → 0 rows (1ms)
  
Layer 4: Audit logs (System)
  → 14:02:33 DELETE /users/42 executed by admin@company.com
  
Layer 5: Infrastructure logs (Kubernetes)
  → 14:02:12 Pod ready — no issues (rules out deployment as cause)
```

**Correlation technique:**
1. Start from the symptom (error at Layer 1)
2. Trace backward through layers using timestamps
3. Find the first anomaly in the chain
4. That anomaly is either the root cause or points to where to look next

### 4. Evidence Collection

For each hypothesis, collect supporting or refuting evidence:

```yaml
hypothesis: "Database connection pool exhaustion caused the 500 errors"

evidence_for:
  - {type: "log", ref: "db-pool.log", finding: "pool active: 20/20 at 14:05"}
  - {type: "metric", ref: "grafana-db", finding: "connection wait time spiked to 5s"}

evidence_against:
  - {type: "log", ref: "app-error.log", finding: "error is NullPointerException, not timeout"}
  - {type: "metric", ref: "grafana-db", finding: "pool recovered at 14:06 but errors continued"}

verdict: "Refuted — pool exhaustion was concurrent but not causal. Root cause is null user."
```

### 5. Blameless Postmortem Template

```markdown
# Incident Postmortem: [Title]
**Date:** 2026-06-13
**Duration:** 15 minutes (14:05 - 14:20 UTC)
**Severity:** S2 (partial outage, user-facing)
**Impact:** ~200 failed requests, 3 affected users

## Summary
[1-2 sentence description of what happened]

## Timeline
| Time (UTC) | Event | Source |
|------------|-------|--------|
| 14:00:00 | Deploy v1.10.2 started | CI pipeline |
| 14:05:17 | First 500 error on GET /users/42/orders | access.log |
| 14:05:30 | Error rate alert triggered | Grafana |
| 14:12:00 | On-call identified root cause | investigation |
| 14:15:00 | Hotfix deployed: null check added | CI pipeline |
| 14:20:00 | Error rate returned to normal | Grafana |

## Root Cause
[Technical explanation with evidence references]

## Contributing Factors
1. Hard delete removes user rows without soft-delete buffer
2. UserService.getUser() has no null-safety
3. No integration test covers the "deleted user" scenario

## Action Items
| Action | Owner | Priority | Due |
|--------|-------|----------|-----|
| Add soft-delete to users table | Backend | P1 | 2026-06-20 |
| Add null check in UserService | Backend | P0 | Done |
| Add integration test for deleted user flow | QA | P1 | 2026-06-20 |
| Review all services for similar null-unsafe patterns | Backend | P2 | 2026-06-27 |

## Lessons Learned
- [What went well in detection/response]
- [What could be improved]
- [Systemic improvements to prevent this class of incident]
```

### 6. Debugging Decision Tree

```
Symptom observed
    │
    ├── Reproducible?
    │   ├── YES → Binary search: disable half the system, test each half
    │   └── NO → Add logging, wait for recurrence, correlate timestamps
    │
    ├── Recent change?
    │   ├── YES → git bisect or revert the change, test
    │   └── NO → Check infrastructure (resources, network, dependencies)
    │
    ├── Error in logs?
    │   ├── YES → Trace the stack trace to the exact line, read the code
    │   └── NO → Add instrumentation, check for silent failures
    │
    └── External dependency?
        ├── YES → Check dependency health, timeouts, version changes
        └── NO → Internal logic error — trace data flow from input to output
```

## Example

**Investigating intermittent test failures in CI:**

```
Symptom: tests/auth.test.ts fails ~30% of the time in CI, always passes locally

Timeline reconstruction:
- Failing runs: 14:02, 15:47, 17:23 (irregular intervals)
- CI runner: shared GitHub Actions runner (not self-hosted)
- Test: "should send password reset email within 5 seconds"

Evidence collection:
Layer 1 (test output): "Expected email sent within 5000ms, but timed out"
Layer 2 (app logs): "Email queued at 14:02:03, sent at 14:02:09" (6s, not 5s)
Layer 3 (email service): "Rate limit: 10 emails/minute" — hit during parallel tests

Root cause: 
  Email service rate-limits to 10/min. When other tests run in parallel,
  they consume email quota, causing the auth test's email to queue longer
  than the 5-second timeout.

Fix:
  1. Mock the email service in unit tests (don't send real emails)
  2. Increase timeout to 15s for integration tests
  3. Serialize email-sending tests to avoid rate limit contention
```

## Anti-Patterns

- **Jumping to fix:** Implementing a fix before confirming the root cause — always validate the hypothesis with evidence first
- **Single-source investigation:** Only looking at app logs when the issue might be infrastructure, network, or dependency — always check multiple layers
- **Blame-focused postmortem:** "Bob broke it" instead of "the system allowed an unsafe state" — focus on systemic fixes, not individual blame
- **Correlation = causation:** "Deploy happened at 14:00, error at 14:05, therefore deploy caused it" — verify with evidence, not just temporal proximity
- **Incomplete timeline:** Missing events between symptom and resolution — fill gaps by checking every log source, not just the obvious ones
- **No regression test:** Fixing the root cause without adding a test that catches it — every RCA should produce at least one regression test
