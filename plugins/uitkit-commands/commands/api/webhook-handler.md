---
description: Implement a secure, idempotent webhook receiver with signature verification and retry tolerance
argument-hint: "[provider] [event-types]"
---
Implement a webhook handler for: $ARGUMENTS

Parse as: webhook provider name (e.g. Stripe, GitHub, Twilio) and a comma-separated list of event types to handle. If provider is unknown, build a generic signed-webhook pattern.

Security — non-negotiable:
- Verify the provider's signature before processing any payload. Read the provider's docs pattern for the exact header and HMAC algorithm (usually `HMAC-SHA256`)
- Compare signatures with a constant-time comparison function — never string equality
- Reject requests with missing or invalid signatures with `401` immediately — log the failure
- Validate the `timestamp` field if the provider includes one; reject events older than 5 minutes to prevent replay attacks
- Secret must come from an environment variable — never hardcoded

Idempotency:
- Every webhook delivery has a unique event ID in the header or payload — extract it
- Check a deduplication store (DB table or Redis set with TTL) before processing
- If the event ID was already processed, return `200` immediately — do not reprocess
- Store the event ID with a TTL of at least the provider's retry window (typically 72 hours)

Processing pattern:
- Acknowledge immediately with `200` — do not make the provider wait for business logic
- Enqueue the validated, deserialized payload into a job queue for async processing
- If no job queue exists, process synchronously but still respond within 5 seconds
- Log the event type, event ID, and processing result for every event

Handler structure:
1. Signature verification middleware (reusable, not inline)
2. Deduplication check
3. Payload parsing and type dispatch by event type
4. Per-event handler functions (one per event type listed in $ARGUMENTS)
5. Error handling that returns 200 even on processing failure (to avoid retries for bugs)

Write tests for: valid signature, invalid signature, duplicate event, each event type dispatched correctly.
