---
name: api-contract-design
description: Designs REST/GraphQL API contracts with clear versioning, error handling, and backward compatibility. Outputs OpenAPI spec or GraphQL schema with examples, deprecation strategy, and test cases.
allowed-tools: Write
effort: medium
---

# API Contract Design

## When to activate

During architecture design phase when defining service boundaries and integration points. Triggered by: component breakdown complete, external integrations identified, or third-party API consumption planned. Should be done before any implementation starts (API-first design).

## When NOT to use

Not for implementing APIs (this is contract design, not coding). Not for existing APIs that are already in production (use versioning-strategy instead). Not for internal-only communication (use message queues or direct calls). Not without clear understanding of consumers and use cases.

## Design Checklist

1. **API Scope**
   - [ ] Who consumes this API? (internal services, external partners, public)
   - [ ] What business operations does it enable?
   - [ ] What data moves through it? (sensitivity, compliance requirements)
   - [ ] Latency requirements? (real-time, near-real-time, batch)
   - [ ] Throughput expectations? (req/sec, concurrent users)

2. **Resource Design**
   - [ ] REST resources identified (nouns, not verbs)
   - [ ] CRUD operations clear for each resource
   - [ ] Hierarchies defined (parent/child resources)
   - [ ] Filtering/sorting/pagination strategy
   - [ ] Relationships between resources documented

3. **Error Handling**
   - [ ] HTTP status codes mapped to scenarios
   - [ ] Error response format consistent
   - [ ] Error codes documented (for client handling)
   - [ ] Retry strategy (when safe to retry)
   - [ ] Detailed error messages for debugging

4. **Security & Auth**
   - [ ] Authentication strategy (API key, OAuth2, mTLS)
   - [ ] Authorization (scopes, roles, resource-level)
   - [ ] Rate limiting strategy (calls/sec per client)
   - [ ] Request signing or encryption needed?
   - [ ] Audit logging for sensitive operations

5. **Versioning & Compatibility**
   - [ ] Versioning strategy (URL path, header, query param)
   - [ ] Deprecation timeline (when old versions sunset)
   - [ ] Migration guide for clients
   - [ ] Backward compatibility rules (what can change)

6. **Documentation & Testing**
   - [ ] API spec complete (OpenAPI, GraphQL SDL)
   - [ ] Examples for every endpoint
   - [ ] Integration tests for key workflows
   - [ ] Mock server for early client development
   - [ ] API changelog maintained

## Output Format

### API Specification

**Overview**
```
Title: [API name]
Version: [version]
Base URL: https://api.company.com/v1
Contact: [name, email]
License: [MIT, etc.]
```

**Authentication**
```
Type: OAuth2 / API Key / mTLS
Scheme: Bearer [token]
or
Header: Authorization: Bearer {access_token}
Scopes: [read:orders, write:orders, read:customers, etc.]
```

**Endpoints** (organized by resource)

**GET /resource/{id}**
```
Description: Fetch a single [resource]

Parameters:
  id (path, required): Resource ID

Response (200 OK):
{
  "id": "123",
  "name": "Example",
  "created_at": "2026-06-13T10:30:00Z",
  "status": "active"
}

Errors:
  401: Not authenticated
  403: Forbidden (insufficient scope)
  404: Resource not found
  429: Rate limited (too many requests)
```

**POST /resource**
```
Description: Create a new [resource]

Request Body:
{
  "name": "New Item",
  "type": "premium"
}

Response (201 Created):
{
  "id": "124",
  "name": "New Item",
  "type": "premium",
  "created_at": "2026-06-13T10:31:00Z",
  "status": "pending"
}

Errors:
  400: Validation failed (see body for details)
  401: Not authenticated
  422: Unprocessable entity (data conflict)
```

**PUT /resource/{id}**
```
Description: Update a [resource] (full replacement)

Parameters:
  id (path, required): Resource ID

Request Body:
{
  "name": "Updated Item",
  "type": "premium",
  "status": "active"
}

Response (200 OK):
{
  "id": "123",
  ...
}

Errors:
  400: Validation failed
  404: Not found
  409: Conflict (version mismatch or concurrent update)
```

**PATCH /resource/{id}**
```
Description: Partial update [resource]

Request Body (only fields to update):
{
  "status": "inactive"
}

Response (200 OK): [Updated resource]

Errors: [same as PUT]
```

**DELETE /resource/{id}**
```
Description: Delete a [resource]

Response (204 No Content): [empty]

Errors:
  404: Not found
  409: Cannot delete (foreign key constraint, etc.)
```

**GET /resource?filter=value&sort=name&page=1&per_page=20**
```
Description: List [resources] with filtering and pagination

Query Parameters:
  filter (optional): Filter by [criteria]
  sort (optional): Sort by [field]. Prefix with - for DESC
  page (optional, default: 1): Page number
  per_page (optional, default: 20): Results per page

Response (200 OK):
{
  "data": [
    { ... },
    { ... }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "pages": 8
  }
}
```

**Error Response Format** (consistent across all endpoints)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address",
        "code": "INVALID_FORMAT"
      }
    ]
  }
}
```

**Status Codes**

| Code | Meaning | When to use |
|---|---|---|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE, or POST with no response body |
| 400 | Bad Request | Client validation error (bad format, missing field) |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Version mismatch, duplicate resource, etc. |
| 422 | Unprocessable Entity | Valid format but business logic violated |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Unexpected error (not client's fault) |

**Versioning Strategy**

**Approach:** URL path versioning (`/v1/`, `/v2/`)

**Compatibility Rules:**
- Can add optional fields to request/response (old clients ignore them)
- Cannot remove required fields
- Cannot change field data type
- Can add new endpoints
- Can deprecate old endpoints (with warning)

**Deprecation Timeline:**
- Current: v1 fully supported
- Supported: v1 (6 months remaining)
- Deprecated: v1 (supported for 6 months, then sunset)

**Migration Guide:**
```markdown
# Migrating from /v1/ to /v2/

Changes:
- `created_at` is now ISO 8601 format (was Unix timestamp)
- `status` field moved inside `metadata` object
- New required field: `account_id`

Before:
GET /v1/orders/123
{
  "id": "123",
  "created_at": 1623600600,
  "status": "shipped"
}

After:
GET /v2/orders/123
{
  "id": "123",
  "created_at": "2026-06-13T10:30:00Z",
  "metadata": {
    "status": "shipped"
  },
  "account_id": "acme"
}
```

**Rate Limiting**

```
- Authenticated: 1000 req/min per client
- Unauthenticated: 100 req/min per IP
- Spike allowance: 2x limit for 10 seconds

Headers returned:
RateLimit-Limit: 1000
RateLimit-Remaining: 956
RateLimit-Reset: 1623600660
```

**Webhooks** (if applicable)

```
POST https://customer.example.com/webhooks/orders

Event: order.created

Payload:
{
  "event_id": "evt_123456",
  "event_type": "order.created",
  "timestamp": "2026-06-13T10:30:00Z",
  "data": {
    "id": "ord_789",
    "customer_id": "cust_456",
    "amount": 129.99
  }
}

Signature (HMAC-SHA256):
X-Signature: sha256=abc123def456...
```

---
