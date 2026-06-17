---
name: webhook-builder
description: Design and implement webhook systems with payload signing, retry logic, and delivery monitoring
allowed-tools: [Read, Write, Bash, Grep]
effort: high
---

## When to activate

- Designing webhook event system for API platform
- Implementing webhook payload schemas and signing
- Building retry and delivery guarantee mechanisms
- Creating webhook management UI/API for subscribers
- Setting up webhook testing and debugging tools

## When NOT to use

- For real-time push via WebSockets/SSE
- For message queue consumer design
- For event sourcing architectures

## Instructions

1. **Define event types.** Catalog events: `user.created`, `order.completed`, `payment.failed`, etc. with JSON schemas.
2. **Design payload structure.** Standard wrapper: `{ id, type, timestamp, data: { ...event-specific } }`. Include API version.
3. **Implement signing.** HMAC-SHA256 signature in `X-Webhook-Signature` header using shared secret.
4. **Build delivery system.** Async queue (Redis/BullMQ), exponential backoff retries (1s, 5s, 30s, 5min, 1h), max 5 attempts.
5. **Add management API.** Endpoints to create/list/update/delete webhook subscriptions with URL, events, and secret.
6. **Implement verification.** Challenge-response verification on subscription creation; signature validation on delivery.
7. **Monitor delivery.** Dashboard: delivery success rate, latency p95, failure reasons, and dead letter queue.

## Example

```json
{
  "id": "evt_abc123",
  "type": "order.completed",
  "apiVersion": "2026-06-01",
  "timestamp": "2026-06-13T10:30:00Z",
  "data": {
    "orderId": "ord_789",
    "customerId": "cust_456",
    "total": 149.99,
    "currency": "USD",
    "items": 3
  }
}

Headers:
X-Webhook-Signature: sha256=a1b2c3d4...
X-Webhook-ID: evt_abc123
X-Webhook-Timestamp: 1718271000
```
