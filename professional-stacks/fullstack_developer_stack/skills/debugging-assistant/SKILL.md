# Debugging Assistant

## When to activate

- Tests fail or produce unexpected behavior
- Application crashes or throws errors in production or development
- Feature works partially but not as expected
- Performance degradation or memory leaks detected
- Integration between components breaks after changes
- Need systematic root-cause analysis for flaky or intermittent bugs

## When NOT to use

- Architecture or design questions (use design review skills instead)
- Feature requests or new functionality planning
- General refactoring or code cleanup (use simplify/code-review skills)
- Debugging external services or third-party APIs (delegate to those services' documentation/support)
- Static analysis or linting issues (use code-review skill)

## Instructions

### Step 1: Establish Reproducibility
- Ask for exact reproduction steps, error messages, and logs
- Create minimal reproducible example (MRE) if not provided
- Identify: does it always fail, intermittently, or only under specific conditions
- Check error logs, stack traces, and console output
- Verify: is this new (regression) or pre-existing behavior

### Step 2: Narrow Scope
- Identify which subsystem is affected (frontend, backend, database, network, etc.)
- Use binary search: disable/enable features to isolate the problem
- Check recent changes: git diff, git log with `--since` flags
- Verify environment: dependencies versions, configuration, OS differences
- Confirm: is this a code issue or environment/infrastructure issue

### Step 3: Inspect Root Cause
- Read error messages carefully — stack traces point to the failure location
- Add debugging statements (console.log, print, debugger breakpoints) at suspected points
- Use IDE debugger to step through code execution
- Check variable states at breakpoints — are they what you expect
- Inspect network requests/responses using browser DevTools or tools like curl/Postman
- Review logs systematically — search for ERROR, WARN, and EXCEPTION patterns

### Step 4: Form Hypothesis
- Based on evidence gathered, propose what's broken and why
- State what behavior is expected vs. actual
- Identify the exact line/function causing the issue
- Check: does this hypothesis explain all observed symptoms

### Step 5: Test Hypothesis
- Apply minimal fix to test theory
- Run reproduction steps again
- Verify: does the fix resolve ALL symptoms, not just one
- Check for side effects — does the fix break other functionality
- Add regression test to prevent recurrence

### Step 6: Implement & Verify
- Apply the permanent fix
- Run existing test suite
- Add new test case covering this bug
- Update documentation if behavior changed
- Verify in development, staging, and production-like environments

### Debugging Toolkit

**For Frontend (JavaScript/TypeScript):**
- Browser DevTools console and debugger
- Network tab for API requests
- React/Vue DevTools extensions
- Performance profiler for memory leaks

**For Backend (Node/Python/Java):**
- Console/print statements with context
- IDE debugger with breakpoints and watch expressions
- Log aggregation tools (grep, tail, structured logging)
- APM tools for performance bottlenecks
- Database query logs for ORM issues

**For Full Stack:**
- Request/response inspection (curl, Postman, fetch)
- Environment variable verification
- Dependency version conflicts (package-lock.json, requirements.txt)
- Git blame for when behavior changed
- Docker logs and container state inspection

## Example

### Scenario: Authentication token expires mid-request

**Problem:** User gets "Unauthorized" error mid-workflow after 30 minutes of inactivity.

**Step 1 — Reproducibility:**
- Reproduction: Login, wait 30+ minutes, attempt API call
- Error: 401 Unauthorized from backend
- Logs show: Token validation failed

**Step 2 — Scope:**
- Affected: API requests from frontend
- Recent changes: Token refresh logic updated 2 commits ago
- Environment: Both dev and staging show issue

**Step 3 — Root Cause Inspection:**
- Added debugger to token refresh middleware
- Inspected localStorage: token expires at timestamp X
- Checked network: refresh endpoint returns 401 instead of new token
- Git diff shows: refresh endpoint authorization check added, but refresh itself requires valid token (circular dependency)

**Step 4 — Hypothesis:**
Refresh endpoint requires a valid token to refresh, but the token is expired. The circular dependency prevents token renewal.

**Step 5 — Test Fix:**
- Remove token requirement from refresh endpoint temporarily
- Retry reproduction: token refreshes successfully
- User workflow completes without 401

**Step 6 — Permanent Fix:**
- Use refresh token (separate, longer-lived token) for refresh endpoint
- Update token refresh logic to use refresh token, not access token
- Add test: verify token refreshes when access token expired but refresh token valid
- Deploy and verify in staging
