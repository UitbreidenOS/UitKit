---
name: api-doc-writer
description: "API documentation from OpenAPI spec or code: endpoints, parameters, examples, error codes, SDKs"
---

# API Doc Writer Skill

## When to activate
- You have an OpenAPI/Swagger spec and need to produce human-readable reference documentation
- You're writing docs for a REST, GraphQL, or webhook API from code or a spec file
- Existing API docs are incomplete — missing examples, error codes, or authentication docs
- You need to produce SDK quickstarts or code examples in multiple languages
- You're producing a migration guide between API versions (v1 → v2, breaking changes)

## When NOT to use
- You need to design the API itself — this skill documents existing APIs, not designs new ones
- You need a changelog from git history — use `/changelog-writer`
- You need a full docs site architecture — use `/doc-site-builder` for that first, then use this skill to write the reference section
- The API is internal-only and the audience is your own team — adapt the depth and style; internal wikis don't need the full consumer-facing treatment

## Instructions

### OpenAPI spec → reference documentation

```
Convert this OpenAPI spec (or API description) into human-readable reference documentation.

## Input
Spec format: [OpenAPI 3.x / Swagger 2.x / plain description of endpoints]
API name: [name]
API version: [v1 / v2 / etc.]
Base URL: [https://api.example.com/v1]
Authentication: [API key / Bearer token / OAuth 2.0 / Basic]

[Paste OpenAPI JSON/YAML here, or describe endpoints]

## Output format
For each endpoint, produce a documentation section:

---

### [HTTP Method] [/path]
[One sentence — what this endpoint does and when to use it]

**Authentication:** [required / optional — and how]

**Request**

Headers:
| Header | Required | Value |
|---|---|---|
| `Authorization` | Yes | `Bearer {token}` |
| `Content-Type` | Yes | `application/json` |

Path parameters:
| Parameter | Type | Description |
|---|---|---|
| `{id}` | string | The unique identifier of the [resource] |

Query parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `limit` | integer | No | 20 | Max number of results (1-100) |
| `cursor` | string | No | — | Pagination cursor from previous response |

Request body:
```json
{
  "field_name": "string",        // Required. Description of field.
  "optional_field": 42,          // Optional. Default: 0. Description.
  "nested_object": {
    "child_field": true          // Required. Description.
  }
}
```

**Response**

Success response — `200 OK`:
```json
{
  "id": "res_abc123",
  "created_at": "2026-06-01T12:00:00Z",
  "status": "active",
  "data": {
    "field": "value"
  }
}
```

Response fields:
| Field | Type | Description |
|---|---|---|
| `id` | string | Unique identifier, prefixed with `res_` |
| `created_at` | ISO 8601 | Timestamp of resource creation (UTC) |
| `status` | enum | `active` \| `inactive` \| `pending` |

**Error responses**
| Status | Error code | When it occurs |
|---|---|---|
| `400` | `invalid_request` | Missing required field or invalid format |
| `401` | `unauthorized` | Missing or invalid API key |
| `403` | `forbidden` | Authenticated but insufficient permissions |
| `404` | `not_found` | Resource with that ID does not exist |
| `429` | `rate_limited` | Exceeded rate limit — see rate limits section |
| `500` | `internal_error` | Server-side error — retry with exponential backoff |

**Code examples**

```bash
# cURL
curl -X POST https://api.example.com/v1/[path] \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "field_name": "value"
  }'
```

```python
import requests

response = requests.post(
    "https://api.example.com/v1/[path]",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"field_name": "value"}
)
response.raise_for_status()
data = response.json()
```

```typescript
const response = await fetch('https://api.example.com/v1/[path]', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ field_name: 'value' }),
});
const data = await response.json();
```

---

## Cross-cutting sections to produce alongside endpoint docs:

### Authentication guide
[Write a complete authentication setup guide — not just a mention]

Sections:
1. How to get an API key / token
2. How to authenticate requests (show all supported methods)
3. Rotating keys / token refresh
4. Scopes and permissions (if applicable)
5. Testing authentication (a curl command they can run to verify it's working)

### Rate limits
- Rate limit values: [X requests per minute / hour / day]
- Which headers carry rate limit info: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- How to handle 429s: retry-after header, exponential backoff
- Per-endpoint vs global limits

### Pagination
If the API uses cursor or offset pagination:
- Explain the pagination model (cursor-based / offset / page-based)
- Show how to paginate through all results with a code example (a loop)
- Explain what happens at the last page

### Webhooks section (if applicable)
- Webhook payload structure (with example)
- Signature verification (with code example in 3 languages)
- Retry policy and delivery guarantees
- How to register webhook endpoints
- How to test locally (ngrok / Cloudflare Tunnel)

### Error handling guide (cross-cutting)
Don't just list error codes — write a guide:
- How to distinguish between retryable (5xx, 429) and non-retryable (4xx) errors
- Exponential backoff implementation example
- Idempotency keys — when to use them
- How to read and use the error response body

### SDK quickstart
For each supported SDK language, a minimal working example:
- Install the SDK
- Authenticate
- Make the most common API call
- Handle errors
- Full code example, runnable without modification (no placeholder values that break it)
```

### API migration guide (version upgrade)

```
Write a migration guide from [API vOLD] to [API vNEW].

## Breaking changes to document
[List each breaking change — endpoint renamed, parameter removed, response shape changed, auth method changed]

## Migration guide structure:

### Overview
- What changed and why (user-facing reason, not technical)
- Timeline: when v[OLD] is deprecated, when it's sunset
- Migration complexity: [hours / days / weeks for a typical integration]

### Breaking changes

For each breaking change:
**[Change title]**
What changed: [plain description]
Before (v[OLD]):
```[language]
[old code]
```
After (v[NEW]):
```[language]
[new code]
```
Migration steps:
1. [Specific step]
2. [Specific step]
Impact: [what breaks if you don't migrate this]

### Non-breaking additions
[Features available in vNEW that aren't in vOLD — optional reading for v[OLD] users]

### Migration checklist
- [ ] Update SDK version to [X]
- [ ] Update base URL from [old] to [new]
- [ ] [Each breaking change as a checkbox]
- [ ] Run test suite
- [ ] Deploy to staging and verify
- [ ] Deploy to production

### Getting help during migration
[Link to support channel, migration office hours, or feedback form]
```

### Docs quality audit — API reference

```
Audit this API documentation for completeness and quality.

[Paste existing API docs]

Check against this rubric:

COMPLETENESS:
- [ ] Every endpoint has: description, all parameters documented, success response, error responses
- [ ] Authentication is explained with working example
- [ ] Rate limits documented
- [ ] Pagination documented (if applicable)
- [ ] Code examples in at least 2 languages for every endpoint
- [ ] Webhook docs (if applicable) include signature verification

ACCURACY:
- [ ] Parameter types are accurate
- [ ] Required vs optional correctly marked
- [ ] Default values stated for optional parameters
- [ ] Error codes are real (not invented)

USABILITY:
- [ ] Can a developer integrate without reading the codebase?
- [ ] Are there working code examples (not pseudocode)?
- [ ] Is the language plain and precise (not marketing copy)?
- [ ] Are gotchas and edge cases documented where they exist?

For each gap: specific fix recommendation.
Priority: which gaps are most likely to cause integration failures or support tickets.
```

## Example

**User:** Document this REST endpoint. It's `POST /v1/payments` that creates a payment. Required fields: amount (integer, in cents), currency (ISO 4217 string), customer_id (string). Optional: description (string), metadata (object). Returns the payment object with id, status, amount, currency, created_at. Errors: 400 for invalid amount, 401 for bad auth, 402 for payment failure (with a decline_code field).

**Output:**

```markdown
### POST /v1/payments

Create a new payment charge for a customer.

**Authentication:** Required — Bearer token

**Request body**
```json
{
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "description": "Invoice #1042",
  "metadata": {
    "order_id": "ord_789"
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | integer | Yes | Amount in smallest currency unit (cents for USD). Must be > 0. |
| `currency` | string | Yes | ISO 4217 currency code in lowercase (`usd`, `eur`, `gbp`). |
| `customer_id` | string | Yes | ID of the customer to charge. Must exist. |
| `description` | string | No | A human-readable description stored on the payment. |
| `metadata` | object | No | Key-value pairs for your internal reference. Max 50 keys, 500 chars per value. |

**Success response — `200 OK`**
```json
{
  "id": "pay_abc123",
  "status": "succeeded",
  "amount": 2000,
  "currency": "usd",
  "customer_id": "cus_abc123",
  "created_at": "2026-06-01T12:00:00Z"
}
```

**Error responses**
| Status | Code | When |
|---|---|---|
| `400` | `invalid_amount` | Amount is 0, negative, or not an integer |
| `401` | `unauthorized` | Missing or invalid Bearer token |
| `402` | `payment_failed` | Card declined — check `decline_code` in response body |

For `402` responses, the body includes:
```json
{
  "error": "payment_failed",
  "decline_code": "insufficient_funds",
  "message": "The card has insufficient funds to complete the purchase."
}
```

Common `decline_code` values: `insufficient_funds`, `card_declined`, `expired_card`, `incorrect_cvc`.

**Code examples**

```bash
curl -X POST https://api.example.com/v1/payments \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"amount": 2000, "currency": "usd", "customer_id": "cus_abc123"}'
```

```python
response = requests.post(
    "https://api.example.com/v1/payments",
    headers={"Authorization": f"Bearer {api_key}"},
    json={"amount": 2000, "currency": "usd", "customer_id": customer_id},
)
if response.status_code == 402:
    decline_code = response.json()["decline_code"]
    # handle decline
response.raise_for_status()
payment = response.json()
```
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
