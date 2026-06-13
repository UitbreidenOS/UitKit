---
name: api-design
description: "REST API design: resource naming, versioning, pagination, error responses, rate limiting headers, idempotency, OpenAPI documentation"
updated: 2026-06-13
---

# API Design Skill

## When to activate
- Designing a new REST API (resource structure, HTTP methods, status codes)
- Adding pagination to an existing list endpoint
- Standardising error response format across a codebase
- Setting up API versioning strategy
- Writing OpenAPI/Swagger documentation
- Implementing idempotency for POST endpoints

## When NOT to use
- GraphQL APIs — different design constraints
- Internal microservice communication where gRPC is more appropriate
- WebSocket/realtime APIs — different protocol

## Instructions

### Resource naming

```
# Pattern: /resources/{id}/sub-resources/{sub-id}
# Nouns, not verbs. Plural. Lowercase with hyphens.

GET    /users              → list users
POST   /users              → create user
GET    /users/{id}         → get user
PATCH  /users/{id}         → partial update user
PUT    /users/{id}         → full replace user
DELETE /users/{id}         → delete user

GET    /users/{id}/posts   → list user's posts
POST   /users/{id}/posts   → create post for user

# Actions that don't fit CRUD — use a verb sub-resource
POST   /users/{id}/activate
POST   /users/{id}/password-reset
POST   /orders/{id}/cancel
POST   /invoices/{id}/send

# Never:
POST /getUser          ❌
GET  /deleteUser/{id}  ❌
POST /user_management  ❌
```

### HTTP status codes — use the right one

```
2xx Success
  200 OK           — GET, PATCH, PUT success with body
  201 Created      — POST success, include Location header
  204 No Content   — DELETE success, or PUT/PATCH with no response body
  202 Accepted     — async operation started (not yet complete)

4xx Client errors (their fault)
  400 Bad Request        — malformed JSON, missing required field
  401 Unauthorized       — not authenticated (no/invalid token)
  403 Forbidden          — authenticated but not authorised
  404 Not Found          — resource doesn't exist
  405 Method Not Allowed — GET on a write-only endpoint
  409 Conflict           — unique constraint (email taken)
  410 Gone               — resource permanently deleted
  422 Unprocessable      — valid JSON but failed validation
  429 Too Many Requests  — rate limit exceeded

5xx Server errors (your fault)
  500 Internal Server Error  — unexpected error
  502 Bad Gateway            — upstream service down
  503 Service Unavailable    — planned maintenance or overload
  504 Gateway Timeout        — upstream timeout
```

### Error response format

Consistent error format across every endpoint:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Must be a valid email address" },
      { "field": "password", "message": "Must be at least 8 characters" }
    ],
    "requestId": "req_01JKM3X2...",
    "docsUrl": "https://docs.example.com/errors/VALIDATION_FAILED"
  }
}
```

**Error code conventions:**
- `SNAKE_UPPER_CASE` string codes (not numeric)
- Specific enough to act on: `EMAIL_ALREADY_REGISTERED` not `CONFLICT`
- Stable across API versions (don't change them)

```python
# FastAPI example
from fastapi import Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, code: str, message: str, status: int, details=None):
        self.code = code
        self.message = message
        self.status = status
        self.details = details or []

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "requestId": request.state.request_id,
            }
        }
    )

# Usage
raise AppError(
    code="EMAIL_ALREADY_REGISTERED",
    message="This email address is already in use",
    status=409,
)
```

### Pagination

**Cursor-based pagination (recommended for large datasets):**
```json
GET /posts?limit=20&cursor=eyJpZCI6IjEwMCJ9

{
  "data": [...],
  "pagination": {
    "limit": 20,
    "nextCursor": "eyJpZCI6IjEyMCJ9",
    "hasMore": true
  }
}
```

```python
# Cursor = base64(JSON) of the last item's sort key
import base64, json

def encode_cursor(id: str) -> str:
    return base64.b64encode(json.dumps({"id": id}).encode()).decode()

def decode_cursor(cursor: str) -> dict:
    return json.loads(base64.b64decode(cursor).decode())

@router.get("/posts")
async def list_posts(limit: int = 20, cursor: str | None = None):
    query = Post.query.order_by(Post.id.desc())
    if cursor:
        last_id = decode_cursor(cursor)["id"]
        query = query.filter(Post.id < last_id)
    posts = query.limit(limit + 1).all()
    has_more = len(posts) > limit
    posts = posts[:limit]
    return {
        "data": posts,
        "pagination": {
            "limit": limit,
            "nextCursor": encode_cursor(str(posts[-1].id)) if has_more else None,
            "hasMore": has_more,
        }
    }
```

**Offset pagination (simpler, fine for small datasets):**
```json
GET /posts?page=2&perPage=20

{
  "data": [...],
  "pagination": {
    "page": 2,
    "perPage": 20,
    "total": 347,
    "totalPages": 18
  }
}
```

### Versioning strategy

```
# URL versioning (most common, most explicit)
/v1/users
/v2/users

# Header versioning (cleaner URLs, harder to test in browser)
GET /users
Accept: application/vnd.myapi.v2+json

# Query param (avoid — pollutes query space)
GET /users?version=2  ❌
```

**Rules for versioning:**
- Increment the version for **breaking changes** only
- Non-breaking additions (new fields, new optional params) don't need a version bump
- Keep old versions alive for at least 6 months after deprecation notice
- Communicate deprecation via `Deprecation` and `Sunset` headers:

```
Deprecation: Sun, 01 Jan 2027 00:00:00 GMT
Sunset: Sun, 01 Jul 2027 00:00:00 GMT
Link: <https://docs.example.com/migration/v1-to-v2>; rel="deprecation"
```

### Standard response headers

```python
# Rate limiting
X-RateLimit-Limit: 1000       # requests per window
X-RateLimit-Remaining: 450    # remaining in current window
X-RateLimit-Reset: 1716835200 # unix timestamp of window reset

# Idempotency
Idempotency-Key: client-generated-uuid

# Request tracking
X-Request-ID: req_01JKM3X2...

# Pagination links (RFC 5988)
Link: <https://api.example.com/posts?cursor=next>; rel="next"
```

### Idempotency for POST endpoints

```python
# Idempotency prevents duplicate charges/actions on network retry
import hashlib

@router.post("/payments")
async def create_payment(
    payload: PaymentRequest,
    idempotency_key: str = Header(alias="Idempotency-Key"),
    redis: Redis = Depends(get_redis),
):
    # Check if this key was already processed
    cache_key = f"idempotency:{idempotency_key}"
    cached = await redis.get(cache_key)
    if cached:
        return JSONResponse(content=json.loads(cached))  # return same response

    # Process the payment
    result = await charge_card(payload)

    # Cache the response for 24 hours
    await redis.setex(cache_key, 86400, json.dumps(result))
    return result
```

### OpenAPI documentation (FastAPI auto-generates this)

```python
@router.get(
    "/users/{user_id}",
    response_model=UserResponse,
    responses={
        404: {"model": ErrorResponse, "description": "User not found"},
        401: {"model": ErrorResponse, "description": "Not authenticated"},
    },
    summary="Get a user by ID",
    description="Returns the user's public profile. Requires authentication.",
    tags=["Users"],
)
async def get_user(
    user_id: str = Path(description="The user's UUID"),
    include_private: bool = Query(default=False, description="Include private fields (self only)"),
):
    ...
```

## Example

**User:** Design the API for a task management app with projects, tasks, and comments — including pagination, error format, and how to handle task assignment.

**Expected output:**
```
GET  /v1/projects                    → paginated list
POST /v1/projects                    → create, returns 201 + Location
GET  /v1/projects/{id}/tasks         → paginated, filterable (?status=open)
POST /v1/projects/{id}/tasks         → create task
PATCH /v1/tasks/{id}                 → update (title, description, status)
POST /v1/tasks/{id}/assign           → assign to user (action endpoint)
POST /v1/tasks/{id}/comments         → add comment
DELETE /v1/tasks/{id}                → soft delete, 204

Error format: { error: { code, message, details[], requestId } }
Pagination: cursor-based on all list endpoints
```

---
