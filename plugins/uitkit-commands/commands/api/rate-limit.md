---
description: Add rate limiting to API endpoints with configurable strategies and proper 429 responses
argument-hint: "[endpoint-or-router] [limit] [window]"
---
Implement rate limiting for: $ARGUMENTS

Parse as: target endpoint or router path, request limit (e.g. 100), time window (e.g. 1m, 1h). If unspecified, apply sensible defaults: 100 req/min for public endpoints, 1000 req/min for authenticated.

Implementation requirements:
- Identify the existing rate-limit infrastructure (Redis, in-memory, middleware library) — use it rather than introducing a second system
- If no rate limiter exists, choose based on deployment: Redis-backed for multi-instance, in-memory with a warning for single-instance
- Key by: IP for unauthenticated routes, user/tenant ID for authenticated routes, API key for key-authenticated routes
- Apply limits at the middleware/decorator level — do not scatter limit checks in business logic
- Return `429 Too Many Requests` with these headers:
  - `Retry-After: <seconds>`
  - `X-RateLimit-Limit: <limit>`
  - `X-RateLimit-Remaining: <remaining>`
  - `X-RateLimit-Reset: <unix-timestamp>`
- Response body: `{ "error": "rate_limit_exceeded", "retry_after": <seconds> }`
- Sliding window preferred over fixed window — avoids burst at window boundary
- Support per-route override of limits without touching the global config

Configuration:
- Limits must be configurable via environment variables or config file — no magic numbers in middleware
- Document the env var names in a comment at the definition site

Write tests for:
- Request within limit (passes)
- Request at exact limit (passes)
- Request exceeding limit (429 with correct headers)
- Limit reset after window expires
