---
description: Define and enforce a consistent error response schema across all API endpoints
argument-hint: "[scope: file, router, or 'all']"
---
Audit and enforce a consistent error response schema for: $ARGUMENTS

Scope defaults to the entire API if $ARGUMENTS is empty or "all".

Target error schema (RFC 9457 / Problem Details for HTTP APIs):
```json
{
  "type": "https://example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The 'email' field must be a valid email address.",
  "instance": "/requests/abc-123",
  "trace_id": "3f2e1d..."
}
```

Use this schema unless the project already has an established error format — if so, standardize to that instead.

Steps:
1. Scan all error-returning code paths: thrown exceptions, error middleware, catch blocks, validation handlers
2. Identify inconsistencies: bare strings, inconsistent keys (`message` vs `error` vs `detail`), missing status codes, mixed shapes
3. Define a single error type/interface/class at the project root (`ApiError` or equivalent)
4. Replace every ad-hoc error response with structured construction of that type
5. Centralize all error serialization in one place (error middleware / exception handler) — not scattered across controllers
6. Ensure validation errors enumerate per-field errors:
   ```json
   "errors": [{ "field": "email", "message": "Invalid format" }]
   ```
7. Strip stack traces from production responses — log them server-side, never send to client
8. Map internal error types to HTTP status codes in one lookup table — no status code literals outside that map
9. Add a `trace_id` correlated with your logging system if one is in use

Output:
- The error type definition
- The centralized error handler
- List of all files changed
- Any error responses that could not be standardized (with reason)
