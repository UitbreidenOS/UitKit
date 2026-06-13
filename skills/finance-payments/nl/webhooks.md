---
name: webhooks
description: "Webhook security: HMAC-SHA256 signature verification, replay attack prevention, idempotency, Stripe + Svix + generic patterns"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../webhooks.md).

# Webhook Beveiliging Vaardigheid

## Wanneer activeren
- Een webhook-ontvanger-endpoint implementeren (Stripe, GitHub, Clerk, Svix, aangepast)
- Webhook-handtekeningen verifiëren om de authenticiteit van de payload te bevestigen
- Bescherming tegen replay-aanvallen toevoegen (tijdstempelvalidatie)
- Verzekeren dat webhookverwerking idempotent is (veilig om twee keer te ontvangen)
- Debuggen van een webhook die steeds mislukt bij handtekeningverificatie

## Wanneer NIET gebruiken
- Webhooks verzenden (uitgaand) — deze vaardigheid is voor het ontvangen
- Op polling gebaseerde integraties — geen webhook betrokken

## Waarom dit belangrijk is

AI-gegenereerde webhookcode is een van de meest voorkomende bronnen van kritieke beveiligingskwetsbaarheden. LLM's laten vaak weg of implementeren onjuist: handtekeningverificatie, tijdconstante vergelijking, behoud van de ruwe body (parsen vóór verificatie maakt de handtekening ongeldig) en replay-aanvalsvensters. Een ontbrekende handtekeningcontrole stelt iedereen in staat nep-betalingsgebeurtenissen te sturen.

## Instructies

### Kernconcepten

Elke veilige webhook-implementatie vereist:
1. **Behoud van de ruwe body** — handtekening verifiëren VOOR het parsen van JSON
2. **HMAC-SHA256-verificatie** — de handtekening van de provider vergelijken met de uwe
3. **Tijdconstante vergelijking** — `crypto.timingSafeEqual()` voorkomt timing-aanvallen
4. **Tijdstempelvalidatie** — gebeurtenissen ouder dan 5 minuten weigeren (replay-preventie)
5. **Idempotentie** — elke gebeurtenis-ID precies één keer verwerken

### Stripe-webhooks (Node.js)

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()       // RUWE body — nooit eerst req.json()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Stripe's SDK verwerkt handtekening + tijdstempelverificatie
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotentie — overslaan als al verwerkt
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

    // Markeer als verwerkt (TTL: 24 uur dekt Stripe's 5-minuten herhalingsvenster)
    await redis.setex(`stripe:event:${event.id}`, 86400, '1')
    return NextResponse.json({ received: true })

  } catch (err) {
    console.error(`Failed to handle event ${event.type}:`, err)
    // 500 teruggeven zodat Stripe het opnieuw probeert
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
```

```bash
# Lokaal testen
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Stripe-webhooks (Python/FastAPI)

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
    payload = await request.body()          # ruwe bytes — kritiek
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Idempotentie
    if await redis.exists(f"stripe:event:{event['id']}"):
        return JSONResponse({"received": True})

    if event["type"] == "checkout.session.completed":
        await handle_checkout(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        await handle_cancellation(event["data"]["object"])

    await redis.setex(f"stripe:event:{event['id']}", 86400, "1")
    return JSONResponse({"received": True})
```

### Generieke HMAC-SHA256-verificatie

Voor GitHub, Shopify en andere providers die standaard HMAC gebruiken:

```typescript
import crypto from 'crypto'

function verifyHmacSignature(
  payload: string,
  signature: string,    // van de provider-header
  secret: string,       // uw webhook-secret
  algorithm = 'sha256'
): boolean {
  const expected = crypto
    .createHmac(algorithm, secret)
    .update(payload, 'utf8')
    .digest('hex')

  // Tijdconstante vergelijking — voorkomt timing-aanvallen
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace(/^sha256=/, ''), 'hex'),
    Buffer.from(expected, 'hex'),
  )
}

// GitHub-webhooks
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

### Bescherming tegen replay-aanvallen (tijdstempelvalidatie)

```typescript
function verifyTimestamp(timestampHeader: string, toleranceSec = 300): boolean {
  const timestamp = parseInt(timestampHeader, 10)
  if (isNaN(timestamp)) return false
  const age = Math.abs(Date.now() / 1000 - timestamp)
  return age < toleranceSec  // weigeren als ouder dan 5 minuten
}

// Gecombineerde verificatie met tijdstempel
function verifyWebhook(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string,
): boolean {
  if (!verifyTimestamp(timestamp)) return false
  // Tijdstempel opnemen in de ondertekende string (zoals Stripe doet)
  const signedPayload = `${timestamp}.${payload}`
  return verifyHmacSignature(signedPayload, signature, secret)
}
```

### Svix (gehoste webhook-infrastructuur)

```typescript
// app/api/webhooks/clerk/route.ts — Clerk gebruikt Svix
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

### Idempotentie met database (wanneer Redis niet beschikbaar is)

```typescript
// Een processed_events-tabel gebruiken in plaats van Redis
async function processWebhookOnce(
  eventId: string,
  handler: () => Promise<void>
): Promise<void> {
  // Invoegen proberen — unique constraint voorkomt duplicaten
  try {
    await db.insert(processedEvents).values({ id: eventId, processedAt: new Date() })
  } catch (err) {
    if (isUniqueConstraintError(err)) return  // al verwerkt
    throw err
  }
  await handler()
}

// Gebruik
await processWebhookOnce(event.id, async () => {
  await activateSubscription(session)
})
```

### Webhook beveiligingschecklist

```
[ ] Ruwe body gelezen VOOR het parsen van JSON
[ ] Handtekeningheader aanwezig en niet-lege controle
[ ] HMAC-SHA256 geverifieerd met tijdconstante vergelijking
[ ] Tijdstempel gevalideerd (< 5 minuten oud)
[ ] Gebeurtenis-ID gecontroleerd op idempotentie
[ ] Handler-fouten geven 5xx terug (zodat provider het opnieuw probeert)
[ ] Geen gevoelige gegevens uit payload gelogd
[ ] Webhook-secret opgeslagen in omgevingsvariabele, nooit hardgecodeerd
[ ] Alleen HTTPS-endpoint (geen HTTP)
```

## Voorbeeld

**Gebruiker:** Stripe-webhookverwerking toevoegen voor de levenscyclus van abonnementen — checkout voltooid, abonnement geannuleerd en betaling mislukt — met idempotentie en handtekeningverificatie.

**Verwachte uitvoer:**
- `app/api/webhooks/stripe/route.ts` met `req.text()` + `stripe.webhooks.constructEvent()`
- Redis-idempotentiecontrole op `event.id` vóór verwerking
- Drie gebeurtenis-handlers: `activateSubscription`, `cancelSubscription`, `handlePaymentFailed`
- 500 teruggeven bij handler-fouten zodat Stripe het opnieuw probeert
- 200 teruggeven voor onbekende gebeurtenistypen (niet falen bij nieuwe typen)

---
