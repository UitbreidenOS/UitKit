# REST API Rules

Apply when building or consuming HTTP/REST services.

## Request design

- Accept `Content-Type: application/json` by default; support `application/x-www-form-urlencoded` only where required (OAuth, forms)
- Treat `Accept` headers correctly — return `406` if you can't satisfy the requested media type
- Parse and validate query parameters strictly; reject unknown parameters with `400` rather than ignoring them
- Use `If-Match` / `ETag` for optimistic concurrency on mutable resources
- Support `Prefer: return=minimal` to let callers skip the response body on mutations

## Response design

- Consistent envelope across all endpoints — agree on a shape and never deviate:
  ```json
  { "data": {}, "error": null, "meta": {} }
  ```
- Date/time fields: ISO 8601 with timezone (`2025-01-15T14:30:00Z`)
- Boolean fields: use actual `true`/`false`, never `"yes"`/`"no"` or `1`/`0`
- Null vs. absent: pick one convention and apply it everywhere — prefer omitting optional absent fields

## Error responses

- Every error response includes: `code` (machine-readable string), `message` (human-readable), optional `details`
- `code` values are stable — clients branch on them; `message` is for humans and may change
- Never return `500` for client errors; classify the error correctly before responding
- Log the full error server-side; return only the safe summary to the client

## Caching

- Set `Cache-Control` on every `GET` response — default to `no-store` only if you have a reason
- Use `ETag` or `Last-Modified` to enable conditional requests
- `Vary` header must list every header that affects the response shape (e.g., `Vary: Accept, Accept-Language`)
- Never cache responses that contain user-specific data without `private` directive

## Rate limiting

- Return `429 Too Many Requests` with `Retry-After` header
- Expose rate limit state in response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Apply stricter limits to auth endpoints and bulk operations
- Rate limit by authenticated identity when possible, by IP only as a fallback

## Client consumption

- Treat all undocumented fields as unstable — don't build logic on them
- Implement exponential backoff with jitter for `429` and `5xx` retries
- Set explicit read and connection timeouts on every HTTP client — never rely on defaults
- Verify TLS certificates in all environments; never disable certificate validation
