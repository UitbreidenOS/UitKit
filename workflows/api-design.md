# API Design Workflow

Structured workflow for designing a new API — from requirements to implementation-ready spec.

## When to use

Use before implementing a new API endpoint or service interface, especially when:
- Multiple teams or services will consume the API
- The API will be external/customer-facing
- The endpoint involves data mutation or complex business logic
- You're designing a new service boundary

## Phase 1: Requirements (30 minutes)

**Answer these questions before writing any code or spec:**

1. Who are the consumers?
   - Internal service only / multiple internal services / external API consumers / mobile clients?
   
2. What does each consumer need to do?
   - List the use cases, not the endpoints

3. What data is involved?
   - What entities are created, read, updated, or deleted?
   - What are the data access patterns (by ID, by user, by date range)?

4. What are the non-functional requirements?
   - Latency target (p99 < X ms)
   - Throughput (X requests/second)
   - Consistency requirements (strong / eventual)
   - Auth requirements (public / authenticated / service-to-service)

## Phase 2: Interface Design (45 minutes)

**Design the endpoints from the consumer's perspective:**

1. Start with the use cases, not the data model
   ```
   Use case: "User wants to see their order history"
   → GET /api/orders?userId={id}&status=completed&limit=20&cursor={cursor}
   
   Use case: "User wants to cancel an order"
   → POST /api/orders/{id}/cancel  (action endpoint, not PATCH with status)
   ```

2. Apply REST conventions (see rules/common/api-design.md)

3. Design request/response schemas:
   ```typescript
   // Define TypeScript types or JSON Schema before implementation
   type CreateOrderRequest = {
     customerId: string
     items: Array<{ productId: string; quantity: number }>
     shippingAddressId: string
   }
   
   type Order = {
     id: string
     customerId: string
     status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
     items: OrderItem[]
     total: number
     createdAt: string  // ISO 8601
   }
   ```

4. Design error responses for each endpoint:
   - What can go wrong? (invalid input, not found, conflict, auth failure)
   - What does each error response look like?

## Phase 3: Validation and Review (20 minutes)

**Review the design against these criteria:**

**Consumer perspective:**
- Can a consumer complete every use case with the designed endpoints?
- Are response shapes predictable and consistent?
- Do error codes help the consumer recover?

**Implementation perspective:**
- Does this require N+1 queries to implement? (design to avoid)
- Are there latency traps? (large joins, synchronous external calls)
- Is pagination designed for the expected data volume?

**Security perspective:**
- Does every endpoint have clear auth requirements?
- Are there any endpoints that could leak data between users?
- Is rate limiting considered?

**Versioning:**
- Is this backwards-compatible with existing consumers?
- If breaking: is versioning planned?

## Phase 4: Document and Share (20 minutes)

**API spec format (OpenAPI or plain markdown):**

```markdown
## POST /api/orders

Create a new order.

**Auth:** Required (user)

**Request:**
\```json
{
  "customerId": "string (UUID)",
  "items": [{ "productId": "string", "quantity": "integer (> 0)" }],
  "shippingAddressId": "string (UUID)"
}
\```

**Response 201:**
\```json
{ "id": "string", "status": "pending", "total": "number" }
\```

**Response 400:**
\```json
{ "error": { "code": "validation_error", "message": "string", "details": {} } }
\```

**Response 404:**
\```json
{ "error": { "code": "not_found", "message": "Customer not found" } }
\```
```

**Share with:**
- Consuming teams (for feedback before implementation)
- Engineering lead (for architecture review)
- Security (if handling sensitive data)

## Phase 5: Implementation

1. Write the tests first (from the spec — these become your acceptance tests)
2. Implement the handler
3. Validate against the spec manually
4. Document any deviations from the original spec

## Related skills

- `/rules/common/api-design` — REST conventions to apply
- `/skills/productivity/spec-driven-workflow` — spec → test → implement pattern
- `/skills/productivity/api-test-builder` — generate test suites from specs

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
