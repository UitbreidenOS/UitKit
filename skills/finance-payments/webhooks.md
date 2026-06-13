---
name: webhooks
description: "Webhook security: HMAC-SHA256 signature verification, replay attack prevention, idempotency, Stripe + Svix + generic patterns"
updated: 2026-06-13
---

# Webhook Security Skill

## When to activate
- Implementing a webhook receiver endpoint (Stripe, GitHub, Clerk, Svix, custom)
- Verifying webhook signatures to confirm the payload is authentic
- Adding replay attack prevention (timestamp validation)
- Ensuring webhook processing is idempotent (safe to receive twice)
- Debugging a webhook that keeps failing signature verification

## When NOT to use
- Sending webhooks (outbound) — this skill is for receiving them
- Polling-based integrations — no webhook involved

## Why this matters

AI-generated webhook code is one of the most common sources of critical security vulnerabilities. LLMs frequently omit or implement incorrectly: signature verification, timing-safe comparison, raw body preservation (parsing before verification invalidates the signature), and replay attack windows. A missing signature check allows anyone to send fake payment events.

## Instructions

### Core concepts

Every secure webhook implementation requires:
1. **Raw body preservation** — verify the signature BEFORE parsing JSON
2. **HMAC-SHA256 verification** — compare the provider's signature with your own
3. **Timing-safe comparison** — `crypto.timingSafeEqual()` prevents timing attacks
4. **Timestamp validation** — reject events older than 5 minutes (replay prevention)
5. **Idempotency** — process each event ID exactly once

### Stripe webhooks (Node.js)

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()       // RAW body — never req.json() first
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Stripe's SDK handles signature + timestamp verification
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotency — skip if already processed
  const processed = await redis.get(`stripe:event:${event.id}`)
  if (processed) return NextResponse.json({ received: true })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await activateSubscription(session)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await cancelSubscription(subscription.customer as string)
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailure(invoice)
        break
      }
    }

    // Mark as processed (TTL: 24 hours covers Stripe's 5-minute retry window)
    await redis.setex(`stripe:event:${event.id}`, 86400, '1')
    return NextResponse.json({ received: true })

  } catch (err) {
    console.error(`Failed to handle event ${event.type}:`, err)
    // Return 500 so Stripe retries
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
```

```bash
# Local testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Stripe webhooks (Python/FastAPI)

```python
# app/routers/webhooks.py
import stripe
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

router = APIRouter()
stripe.api_key = os.environ["STRIPE_SECRET_KEY"]
WEBHOOK_SECRET = os.environ["STRIPE_WEBHOOK_SECRET"]

@router.post("/webhooks/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()          # raw bytes — critical
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Idempotency
    if await redis.exists(f"stripe:event:{event['id']}"):
        return JSONResponse({"received": True})

    if event["type"] == "checkout.session.completed":
        await handle_checkout(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        await handle_cancellation(event["data"]["object"])

    await redis.setex(f"stripe:event:{event['id']}", 86400, "1")
    return JSONResponse({"received": True})
```

### Generic HMAC-SHA256 verification

For GitHub, Shopify, and other providers that use standard HMAC:

```typescript
import crypto from 'crypto'

function verifyHmacSignature(
  payload: string,
  signature: string,    // from provider header
  secret: string,       // your webhook secret
  algorithm = 'sha256'
): boolean {
  const expected = crypto
    .createHmac(algorithm, secret)
    .update(payload, 'utf8')
    .digest('hex')

  // Timing-safe comparison — prevents timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace(/^sha256=/, ''), 'hex'),
    Buffer.from(expected, 'hex'),
  )
}

// GitHub webhooks
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256') ?? ''

  if (!verifyHmacSignature(body, signature, process.env.GITHUB_WEBHOOK_SECRET!)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = req.headers.get('x-github-event')
  const payload = JSON.parse(body)

  if (event === 'push') {
    await handlePush(payload)
  }

  return NextResponse.json({ received: true })
}
```

### Replay attack prevention (timestamp validation)

```typescript
function verifyTimestamp(timestampHeader: string, toleranceSec = 300): boolean {
  const timestamp = parseInt(timestampHeader, 10)
  if (isNaN(timestamp)) return false
  const age = Math.abs(Date.now() / 1000 - timestamp)
  return age < toleranceSec  // reject if older than 5 minutes
}

// Combined verification with timestamp
function verifyWebhook(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string,
): boolean {
  if (!verifyTimestamp(timestamp)) return false
  // Include timestamp in the signed string (as Stripe does)
  const signedPayload = `${timestamp}.${payload}`
  return verifyHmacSignature(signedPayload, signature, secret)
}
```

### Svix (hosted webhook infrastructure)

```typescript
// app/api/webhooks/clerk/route.ts — Clerk uses Svix
import { Webhook } from 'svix'
import { headers } from 'next/headers'

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headerPayload = await headers()

  const svixHeaders = {
    'svix-id':        headerPayload.get('svix-id') ?? '',
    'svix-timestamp': headerPayload.get('svix-timestamp') ?? '',
    'svix-signature': headerPayload.get('svix-signature') ?? '',
  }

  const wh = new Webhook(webhookSecret)
  let event: { type: string; data: Record<string, unknown> }

  try {
    event = wh.verify(body, svixHeaders) as typeof event
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'user.created':
      await createUserInDb(event.data)
      break
    case 'user.deleted':
      await deleteUserFromDb(event.data.id as string)
      break
  }

  return NextResponse.json({ received: true })
}
```

### Idempotency with database (when Redis isn't available)

```typescript
// Use a processed_events table instead of Redis
async function processWebhookOnce(
  eventId: string,
  handler: () => Promise<void>
): Promise<void> {
  // Attempt to insert — unique constraint prevents duplicates
  try {
    await db.insert(processedEvents).values({ id: eventId, processedAt: new Date() })
  } catch (err) {
    if (isUniqueConstraintError(err)) return  // already processed
    throw err
  }
  await handler()
}

// Usage
await processWebhookOnce(event.id, async () => {
  await activateSubscription(session)
})
```

### Webhook security checklist

```
[ ] Raw body read BEFORE parsing JSON
[ ] Signature header present and non-empty check
[ ] HMAC-SHA256 verified with timing-safe comparison
[ ] Timestamp validated (< 5 minutes old)
[ ] Event ID checked for idempotency
[ ] Handler errors return 5xx (so provider retries)
[ ] No sensitive data logged from payload
[ ] Webhook secret stored in env var, never hardcoded
[ ] HTTPS-only endpoint (no HTTP)
```

## Example

**User:** Add Stripe webhook handling for subscription lifecycle — checkout completed, subscription cancelled, and payment failed — with idempotency and signature verification.

**Expected output:**
- `app/api/webhooks/stripe/route.ts` with `req.text()` + `stripe.webhooks.constructEvent()`
- Redis idempotency check on `event.id` before processing
- Three event handlers: `activateSubscription`, `cancelSubscription`, `handlePaymentFailed`
- Return 500 on handler errors so Stripe retries
- Return 200 for unknown event types (don't fail on new event types)

---
