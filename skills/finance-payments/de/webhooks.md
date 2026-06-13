---
name: webhooks
description: "Webhook security: HMAC-SHA256 signature verification, replay attack prevention, idempotency, Stripe + Svix + generic patterns"
---

> 🇩🇪 Deutsche Version. [Englische Version](../webhooks.md).

# Webhook-Sicherheit Skill

## Wann aktivieren
- Implementierung eines Webhook-Empfänger-Endpunkts (Stripe, GitHub, Clerk, Svix, benutzerdefiniert)
- Verifizierung von Webhook-Signaturen zur Bestätigung der Payload-Authentizität
- Hinzufügen von Schutz gegen Replay-Angriffe (Zeitstempel-Validierung)
- Sicherstellen, dass die Webhook-Verarbeitung idempotent ist (sicher zweimal zu empfangen)
- Debuggen eines Webhooks, der bei der Signaturverifizierung wiederholt scheitert

## Wann NICHT verwenden
- Senden von Webhooks (ausgehend) — dieser Skill ist für den Empfang
- Polling-basierte Integrationen — kein Webhook beteiligt

## Warum das wichtig ist

KI-generierter Webhook-Code ist eine der häufigsten Quellen kritischer Sicherheitslücken. LLMs lassen häufig aus oder implementieren falsch: Signaturverifizierung, zeitkonstanten Vergleich, Beibehaltung des Rohkörpers (Parsen vor der Verifizierung macht die Signatur ungültig) und Replay-Angriffsfenster. Eine fehlende Signaturprüfung ermöglicht es jedem, gefälschte Zahlungsereignisse zu senden.

## Anweisungen

### Kernkonzepte

Jede sichere Webhook-Implementierung erfordert:
1. **Beibehaltung des Rohkörpers** — Signatur VOR dem JSON-Parsen verifizieren
2. **HMAC-SHA256-Verifizierung** — Anbietersignatur mit eigener vergleichen
3. **Zeitkonstanter Vergleich** — `crypto.timingSafeEqual()` verhindert Timing-Angriffe
4. **Zeitstempel-Validierung** — Ereignisse älter als 5 Minuten ablehnen (Replay-Prävention)
5. **Idempotenz** — jede Ereignis-ID genau einmal verarbeiten

### Stripe-Webhooks (Node.js)

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()       // ROHER Körper — niemals zuerst req.json()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Stripes SDK übernimmt Signatur + Zeitstempel-Verifizierung
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotenz — überspringen wenn bereits verarbeitet
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

    // Als verarbeitet markieren (TTL: 24 Stunden deckt Stripes 5-Minuten-Wiederholungsfenster ab)
    await redis.setex(`stripe:event:${event.id}`, 86400, '1')
    return NextResponse.json({ received: true })

  } catch (err) {
    console.error(`Failed to handle event ${event.type}:`, err)
    // 500 zurückgeben, damit Stripe es erneut versucht
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
```

```bash
# Lokales Testen
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Stripe-Webhooks (Python/FastAPI)

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
    payload = await request.body()          # rohe Bytes — kritisch
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Idempotenz
    if await redis.exists(f"stripe:event:{event['id']}"):
        return JSONResponse({"received": True})

    if event["type"] == "checkout.session.completed":
        await handle_checkout(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        await handle_cancellation(event["data"]["object"])

    await redis.setex(f"stripe:event:{event['id']}", 86400, "1")
    return JSONResponse({"received": True})
```

### Generische HMAC-SHA256-Verifizierung

Für GitHub, Shopify und andere Anbieter, die Standard-HMAC verwenden:

```typescript
import crypto from 'crypto'

function verifyHmacSignature(
  payload: string,
  signature: string,    // vom Anbieter-Header
  secret: string,       // Ihr Webhook-Secret
  algorithm = 'sha256'
): boolean {
  const expected = crypto
    .createHmac(algorithm, secret)
    .update(payload, 'utf8')
    .digest('hex')

  // Zeitkonstanter Vergleich — verhindert Timing-Angriffe
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace(/^sha256=/, ''), 'hex'),
    Buffer.from(expected, 'hex'),
  )
}

// GitHub-Webhooks
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

### Schutz gegen Replay-Angriffe (Zeitstempel-Validierung)

```typescript
function verifyTimestamp(timestampHeader: string, toleranceSec = 300): boolean {
  const timestamp = parseInt(timestampHeader, 10)
  if (isNaN(timestamp)) return false
  const age = Math.abs(Date.now() / 1000 - timestamp)
  return age < toleranceSec  // ablehnen wenn älter als 5 Minuten
}

// Kombinierte Verifizierung mit Zeitstempel
function verifyWebhook(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string,
): boolean {
  if (!verifyTimestamp(timestamp)) return false
  // Zeitstempel in den signierten String einbeziehen (wie Stripe es tut)
  const signedPayload = `${timestamp}.${payload}`
  return verifyHmacSignature(signedPayload, signature, secret)
}
```

### Svix (gehostete Webhook-Infrastruktur)

```typescript
// app/api/webhooks/clerk/route.ts — Clerk verwendet Svix
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

### Idempotenz mit Datenbank (wenn Redis nicht verfügbar ist)

```typescript
// Eine processed_events-Tabelle anstelle von Redis verwenden
async function processWebhookOnce(
  eventId: string,
  handler: () => Promise<void>
): Promise<void> {
  // Einfügen versuchen — Unique-Constraint verhindert Duplikate
  try {
    await db.insert(processedEvents).values({ id: eventId, processedAt: new Date() })
  } catch (err) {
    if (isUniqueConstraintError(err)) return  // bereits verarbeitet
    throw err
  }
  await handler()
}

// Verwendung
await processWebhookOnce(event.id, async () => {
  await activateSubscription(session)
})
```

### Webhook-Sicherheits-Checkliste

```
[ ] Rohkörper VOR dem JSON-Parsen gelesen
[ ] Signatur-Header vorhanden und Nicht-Leer-Prüfung
[ ] HMAC-SHA256 mit zeitkonstantem Vergleich verifiziert
[ ] Zeitstempel validiert (< 5 Minuten alt)
[ ] Ereignis-ID auf Idempotenz geprüft
[ ] Handler-Fehler geben 5xx zurück (damit Anbieter es erneut versucht)
[ ] Keine sensiblen Daten aus dem Payload protokolliert
[ ] Webhook-Secret in Umgebungsvariable gespeichert, nie hartcodiert
[ ] Nur HTTPS-Endpunkt (kein HTTP)
```

## Beispiel

**Benutzer:** Stripe-Webhook-Handling für den Abonnement-Lebenszyklus hinzufügen — Checkout abgeschlossen, Abonnement gekündigt und Zahlung fehlgeschlagen — mit Idempotenz und Signaturverifizierung.

**Erwartete Ausgabe:**
- `app/api/webhooks/stripe/route.ts` mit `req.text()` + `stripe.webhooks.constructEvent()`
- Redis-Idempotenzprüfung auf `event.id` vor der Verarbeitung
- Drei Ereignis-Handler: `activateSubscription`, `cancelSubscription`, `handlePaymentFailed`
- Bei Handler-Fehlern 500 zurückgeben, damit Stripe es erneut versucht
- 200 für unbekannte Ereignistypen zurückgeben (nicht bei neuen Ereignistypen scheitern)

---
