---
name: bug-triage-classifier
description: Categorizes failing tests and bugs by severity (Critical/High/Medium/Low) and priority (P1-P4). Analyzes root causes, identifies patterns, and logs to bug-registry.md. Escalates P1/P2 bugs automatically.
allowed-tools: Read, Write
effort: medium
---

# Bug Triage Classifier

## When to activate

Immediately after test execution when failures are detected. Triage each failure to determine severity, impact, and required remediation. Route critical bugs for immediate escalation.

## When NOT to use

Not for pre-release validation (use regression-risk-assessor instead). Not without test failure output. Not for test infrastructure issues (use different troubleshooting process). Not for speculation — only triage bugs with clear reproduction steps.

## Severity & Priority Matrix

### Severity Levels

| Severity | Definition | Examples | Impact |
|---|---|---|---|
| **Critical** | Production outage; data loss; security breach; payment failure | Database corruption, auth bypass, payment processing broken | Business stops |
| **High** | Feature broken; major workflow blocked; significant perf impact | Login API returns 500; user can't checkout; 50%+ page slowdown | Critical path blocked |
| **Medium** | Feature partially broken; workaround exists; minor perf impact | Email validation has false positive; UI button misaligned; 10% slowdown | Workaround available |
| **Low** | Edge case; cosmetic issue; documentation gap | Hover state missing; typo in error message; unused code warning | Nice-to-have fix |

### Priority Levels

| Priority | Severity | Response Time | Action |
|---|---|---|---|
| **P1** | Critical | Immediate (<30 min) | Page incident; assign engineer; drop other work |
| **P2** | High | 4 hours | Schedule for today; high visibility |
| **P3** | Medium | 24 hours | Schedule for this week; normal priority |
| **P4** | Low | Next sprint | Backlog; address if time permits |

## Root Cause Analysis Framework

For each bug, determine the root cause:

1. **Code defect:** Logic error, null pointer, off-by-one, etc.
2. **Configuration error:** Wrong env variable, missing setting, bad config
3. **External service failure:** API timeout, database connection, third-party service down
4. **Race condition:** Concurrent access issue, timing dependency
5. **Environment issue:** Missing dependency, database not seeded, service not running
6. **Test infrastructure:** Flaky mock, bad test data, test isolation issue
7. **Unknown:** Need more investigation

## Bug Triage Template

```
## Bug: [BUG-ID]

**Title:** [One-line description of the bug]

**Test Case:** [Which test case detected this]

**Severity:** [Critical / High / Medium / Low]

**Priority:** [P1 / P2 / P3 / P4]

**Environment:** [dev / staging / prod]

**Affected Version/Build:** [commit hash or version]

**Description:**
[What is broken and how it manifests]

**Root Cause:**
[Technical analysis: what code is wrong, why, how it happened]

**Steps to Reproduce:**
1. [Reproduction step 1]
2. [Reproduction step 2]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Suggested Fix:**
[Recommended code change or remediation]

**Estimated Effort:**
[X hours to fix]

**Status:** [OPEN / IN PROGRESS / BLOCKED / FIXED / CLOSED]

**Assigned To:** [Engineer name or "UNASSIGNED"]

**Related Bugs:** [Links to similar/related issues]

**Attachments:**
[Error logs, screenshots, stack traces]

**Investigation Notes:**
- [Note 1]
- [Note 2]
```

## Triage Decision Tree

```
Test Failure Detected
├── Can be reproduced consistently?
│   ├── No → Flaky Test (low priority, investigate test isolation)
│   └── Yes → Proceed to severity assessment
├── Is it a production outage or data loss?
│   ├── Yes → CRITICAL / P1
│   └── No → Proceed
├── Does it block a critical user workflow?
│   ├── Yes → HIGH / P2
│   └── No → Proceed
├── Does it affect a significant feature or >10% of users?
│   ├── Yes → HIGH / P2
│   └── No → Proceed
├── Does it affect a non-critical feature with workaround?
│   ├── Yes → MEDIUM / P3
│   └── No → Proceed
└── Is it a cosmetic/documentation issue?
    └── Yes → LOW / P4
```

## Root Cause Examples

### Code Defect
```
**Bug:** BUG-AUTH-042
**Root Cause:** Token rotation logic missing database transaction

The refresh_token() function queries the database for old tokens,
but the DELETE statement is not wrapped in a transaction. This causes
a race condition where concurrent calls both see the old token as valid.

**Suggested Fix:**
Wrap database operations in a transaction; add unique constraint
on (user_id, refresh_token) to prevent duplicate valid tokens.
```

### External Service Failure
```
**Bug:** BUG-PAYMENT-015
**Root Cause:** Payment gateway API timeout not handled gracefully

The /checkout API calls Stripe without a timeout or retry logic.
When Stripe is slow (>30s), the request hangs, causing browser timeout.

**Suggested Fix:**
Add 10s timeout to Stripe API call; implement exponential backoff
retry logic; return 503 Service Unavailable if Stripe is unreachable.
```

### Race Condition
```
**Bug:** BUG-CONCURRENCY-008
**Root Cause:** Concurrent database updates without locking

User simultaneously updates profile from 2 devices. Both devices read
the old version, increment a counter, and write back. One write is lost.

**Suggested Fix:**
Implement optimistic locking using version field; or use atomic
database update operations instead of read-modify-write pattern.
```

## Escalation Criteria

**P1 Bugs (Critical):**
- Trigger immediate escalation to on-call engineer
- Post alert to session log and team channel
- Assign engineer and request status updates every 15 min
- Do not release until fixed

**P2 Bugs (High):**
- Assign to engineer within 4 hours
- Schedule fix for same day
- Track in sprint board with high priority
- Consider if release should be blocked

**P3 Bugs (Medium):**
- Add to sprint backlog
- Schedule for current or next sprint
- Track in normal priority

**P4 Bugs (Low):**
- Add to backlog
- Schedule for future sprint if capacity permits
- No immediate action required

## Example Triage

```
## Bug: BUG-AUTH-042

**Title:** Token refresh rotation has race condition — old tokens remain valid

**Test Case:** TC-AUTH-008

**Severity:** CRITICAL

**Priority:** P1

**Environment:** staging

**Affected Version:** d4e5f6g (commit hash)

**Description:**
User logs in and receives JWT + refresh token. User calls /auth/refresh
to get new token. The system should revoke the old refresh token
immediately and issue a new one. However, due to a race condition,
if the user makes concurrent refresh calls, BOTH calls see the old
token as valid and both rotate successfully. This allows an attacker
to use the old token after rotation, bypassing token rotation security.

**Root Cause:**
The refresh_token() function in auth/services.py (line 42) performs
these steps:
1. SELECT refresh_token FROM tokens WHERE id = ?
2. Verify token signature
3. DELETE old token
4. INSERT new token

Steps 1-4 are not atomic. Concurrent calls can both pass step 2
before either reaches step 3, causing both to see the old token
as valid. Additionally, there is no database unique constraint
preventing duplicate valid tokens.

**Steps to Reproduce:**
1. User logs in: POST /auth/login → receive JWT + refresh_token_1
2. Open 2 browser tabs, both logged in
3. Tab 1: POST /auth/refresh with refresh_token_1
4. Tab 2: POST /auth/refresh with refresh_token_1 (within 100ms)
5. Both tabs receive new tokens and HTTP 200
6. Tab 1 can still use refresh_token_1 (should be invalid)

**Expected Behavior:**
Only one of the concurrent refresh calls should succeed. The other
should receive 401 Unauthorized indicating token was already rotated.
The old token should be invalidated immediately.

**Actual Behavior:**
Both refresh calls succeed and return new tokens. The old refresh_token_1
remains valid and can be used again.

**Suggested Fix:**
1. Wrap database operations in transaction:
   ```python
   with db.transaction():
       old_token = db.query(Token).filter_by(id=id).with_for_update().first()
       if old_token is None:
           raise TokenAlreadyRotatedException()
       db.delete(old_token)
       new_token = Token.create(...)
       db.commit()
   ```
2. Add database unique constraint: CREATE UNIQUE INDEX idx_user_valid_token ON tokens(user_id) WHERE revoked_at IS NULL
3. Add integration test for concurrent refresh calls

**Estimated Effort:** 3 hours (1 hour implementation, 2 hours testing/code review)

**Status:** OPEN

**Assigned To:** john-engineer

**Related Bugs:** BUG-AUTH-041 (similar issue in logout flow)

**Investigation Notes:**
- Reproduced consistently with 2-thread concurrent test
- Issue exists in staging; unknown if production has this version
- Affects all user accounts with active sessions
- No indication of exploit in production logs yet (but logs are not exhaustive)
- Similar issue noted in post-call-processor; may be widespread pattern

---

**Escalation:** CRITICAL P1 - Security vulnerability  
**Action:** Page on-call engineer immediately; block any release until fixed
**Next Update:** 2026-06-13 15:00 UTC
```

---
