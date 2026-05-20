# API Design Rules

Apply these rules when designing or reviewing REST APIs.

## URL and method conventions

- Resources are nouns, never verbs: `/users` not `/getUsers`
- Use plural nouns for collections: `/users` not `/user`
- Nested resources for ownership: `/users/:id/orders` not `/user-orders?userId=`
- HTTP methods are semantic:
  - `GET` — read, idempotent, no side effects
  - `POST` — create, not idempotent
  - `PUT` — full replacement, idempotent
  - `PATCH` — partial update, idempotent
  - `DELETE` — remove, idempotent

## Status codes

Use the right status code — never use 200 for everything:

| Code | When to use |
|---|---|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST (created a resource) |
| 204 | Successful action with no response body |
| 400 | Client sent invalid data |
| 401 | Not authenticated |
| 403 | Authenticated but not authorised |
| 404 | Resource doesn't exist |
| 409 | Conflict (duplicate, stale version) |
| 422 | Validation failure (malformed input) |
| 429 | Rate limited |
| 500 | Server error (never expose stack traces) |

## Request and response shape

```typescript
// Consistent response envelope
type ApiResponse<T> = {
  data: T
  error?: never
} | {
  data?: never
  error: { code: string; message: string; details?: unknown }
}

// Pagination (cursor-based, not offset)
type PaginatedResponse<T> = {
  data: T[]
  nextCursor: string | null
  hasMore: boolean
}
```

## Validation

- Validate all input at the boundary — never trust client data
- Return validation errors with field-level detail:
  ```json
  {
    "error": {
      "code": "validation_error",
      "message": "Validation failed",
      "details": {
        "email": "Must be a valid email address",
        "age": "Must be a positive integer"
      }
    }
  }
  ```
- Use Zod (TypeScript) or Pydantic (Python) for schema validation

## Versioning

- Version in the URL path: `/api/v1/users`
- Never break existing versions — add a new version
- Deprecate old versions with a `Deprecation` response header

## Security

- Authentication via `Authorization: Bearer <token>` header
- Never put secrets or tokens in query parameters
- CORS: restrict origins in production (never `*` for APIs with auth)
- Rate limit all endpoints; stricter limits on auth endpoints

## Idempotency

- `GET`, `PUT`, `DELETE`, `PATCH` must be safe to retry
- `POST` operations that must be idempotent: require `Idempotency-Key` header
- Return the same result for repeated identical requests
