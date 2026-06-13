---
name: code-review
description: "Structured code review: correctness, security, performance, maintainability — with severity and actionable feedback per finding"
---

# Code Review Skill

## Wann aktivieren
- Reviewing a PR before approving it
- Self-reviewing your own code before opening a PR
- Doing a thorough review of a critical or security-sensitive change
- Onboarding a junior developer and giving structured feedback
- Pre-merge checklist for a feature before going to production

## Wann NICHT verwenden
- Automated linting — use ESLint, Ruff, golangci-lint for style/formatting
- Dependency vulnerability scanning — use `npm audit`, Snyk, Dependabot
- Performance profiling — use a profiler, not a code review

## Anweisungen

### Invoking the review

```
/code-review

PR: [paste diff, or describe what changed]
Context: [what this PR is for, any specific concerns]
Focus: [correctness / security / performance / all]
```

Or for a specific file:
```
/code-review

File: src/billing/checkout.py
Concerns: payment processing, error handling, idempotency
```

### Review checklist Claude works through

**Correctness**
- [ ] Does the code do what the PR description says it does?
- [ ] Are edge cases handled? (empty input, null, zero, very large values)
- [ ] Are error conditions handled and errors informative?
- [ ] Is error handling at the right level? (don't catch and swallow errors silently)
- [ ] Are async operations awaited? Are race conditions possible?
- [ ] Is the logic correct for all branches of conditionals?

**Security**
- [ ] Is user input validated and sanitised before use?
- [ ] Are SQL queries parameterised?
- [ ] Are secrets / credentials handled correctly (env vars, not hardcoded)?
- [ ] Is authorization checked (not just authentication)?
- [ ] Are file paths validated? (path traversal)
- [ ] Are external URLs validated? (SSRF)

**Performance**
- [ ] Are there N+1 query patterns? (loop with a DB call inside)
- [ ] Are expensive operations cached where appropriate?
- [ ] Are database queries indexed on the filter columns?
- [ ] Are large payloads paginated or streamed?
- [ ] Are any O(n²) operations hiding in the logic?

**Maintainability**
- [ ] Are functions doing one thing? (< 30 lines as a rough guide)
- [ ] Are variable and function names descriptive?
- [ ] Is the code readable without comments? (good naming > comments)
- [ ] Is duplication introduced that could be extracted?
- [ ] Are there magic numbers that should be named constants?
- [ ] Is the change covered by tests?

**API / Interface design**
- [ ] Is the public API consistent with existing patterns?
- [ ] Are breaking changes documented?
- [ ] Are parameters in a sensible order?
- [ ] Does the function signature communicate its intent?

### Output format

Claude produces findings in priority order:

```
🔴 BLOCKING — {title}
File: {path}:{line}
Issue: {what's wrong and why it matters}
Fix:
  {specific code change}

🟠 IMPORTANT — {title}
...

🟡 SUGGESTION — {title}
...

ℹ️ NITS — {list of minor style/naming items}

Summary: X blocking, Y important, Z suggestions
Overall: [Approve / Request changes / Needs discussion]
```

**Severity levels:**
- 🔴 **BLOCKING** — must fix before merge: bug, security issue, data loss risk
- 🟠 **IMPORTANT** — should fix before merge: significant quality or reliability issue
- 🟡 **SUGGESTION** — worth discussing: design choice, alternative approach
- ℹ️ **NIT** — minor style, naming, or formatting (batch these at the end)

### High-signal review areas by change type

**New API endpoint:**
- Input validation on all parameters
- Authentication and authorization
- Rate limiting
- Error response format consistency
- Logging of important events

**Database schema change:**
- Migration is safe for zero-downtime deploy
- New columns are nullable or have defaults
- Indexes added for new query patterns
- Foreign keys have appropriate ON DELETE behaviour

**Payment / billing code:**
- Idempotency keys used for charge operations
- Webhook signature validation
- Refund/reversal handling
- Currency handling (integers/cents, not floats)
- Test mode vs production mode separation

**Authentication change:**
- Session invalidation on logout
- Password hashing algorithm (bcrypt/argon2, not MD5/SHA1)
- Token expiry and refresh logic
- CSRF protection on state-changing endpoints

### Giving feedback effectively

**Be specific, not vague:**
```
# Bad feedback
"This could be more efficient"

# Good feedback
🟠 IMPORTANT — N+1 query in the user listing
Line 47: `orders = [get_orders(user.id) for user in users]` runs one query per user.
Replace with a single JOIN query or use `select_related('orders')`.
```

**Suggest the fix, not just the problem:**
```
🔴 BLOCKING — User input used directly in SQL query
Line 23: f"SELECT * FROM products WHERE name = '{search_term}'"
SQL injection risk. Replace with a parameterised query:
  cursor.execute("SELECT * FROM products WHERE name = %s", (search_term,))
```

**Acknowledge good decisions:**
```
✅ Good call using UPSERT here instead of SELECT + INSERT — avoids race condition.
```

## Beispiel

**PR:** Add user search endpoint

**Diff (simplified):**
```python
@app.get("/users/search")
def search_users(query: str):
    results = db.execute(f"SELECT * FROM users WHERE email LIKE '%{query}%'")
    return [dict(r) for r in results]
```

**Expected review output:**
```
🔴 BLOCKING — SQL injection via unparameterised query
File: api/users.py:3
Issue: User-supplied `query` is interpolated directly into SQL. An attacker can
extract all data or drop tables.
Fix:
  results = db.execute(
      "SELECT * FROM users WHERE email LIKE %s",
      (f"%{query}%",)
  )

🟠 IMPORTANT — No authentication or authorization check
File: api/users.py:1
Issue: Endpoint returns user data without verifying the caller is authenticated.
Fix: Add `user = Depends(get_current_user)` and verify the caller has search permissions.

🟠 IMPORTANT — No pagination — will return all users
File: api/users.py:3
Issue: `SELECT *` with no LIMIT can return thousands of rows.
Fix: Add `LIMIT 50` and a `page` parameter.

🟡 SUGGESTION — SELECT * returns password_hash and other sensitive fields
Consider explicitly selecting only safe columns: id, email, name, created_at.

Summary: 2 blocking, 2 important
Decision: Request changes — security issues must be fixed before merge.
```

---
