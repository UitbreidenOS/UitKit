---
name: webhooks
description: "Webhook security: HMAC-SHA256 signature verification, replay attack prevention, idempotency, Stripe + Svix + generic patterns"
---

> 🇪🇸 Versión en español. [Versión en inglés](../webhooks.md).

# Habilidad Seguridad Webhook

## Cuándo activar
- Implementar un endpoint receptor de webhook (Stripe, GitHub, Clerk, Svix, personalizado)
- Verificar firmas de webhook para confirmar la autenticidad del payload
- Añadir protección contra ataques de repetición (validación de marca temporal)
- Asegurar que el procesamiento de webhooks es idempotente (seguro de recibir dos veces)
- Depurar un webhook que sigue fallando en la verificación de firma

## Cuándo NO usar
- Envío de webhooks (salientes) — esta habilidad es para recibirlos
- Integraciones basadas en polling — no hay webhook involucrado

## Por qué esto importa

El código webhook generado por IA es una de las fuentes más comunes de vulnerabilidades de seguridad críticas. Los LLM omiten frecuentemente o implementan incorrectamente: verificación de firma, comparación de tiempo constante, preservación del cuerpo raw (parsear antes de verificar invalida la firma) y ventanas de ataque de repetición. Una verificación de firma ausente permite que cualquiera envíe eventos de pago falsos.

## Instrucciones

### Conceptos fundamentales

Toda implementación segura de webhook requiere:
1. **Preservación del cuerpo raw** — verificar la firma ANTES de parsear JSON
2. **Verificación HMAC-SHA256** — comparar la firma del proveedor con la tuya
3. **Comparación de tiempo constante** — `crypto.timingSafeEqual()` previene ataques de temporización
4. **Validación de marca temporal** — rechazar eventos de más de 5 minutos (prevención de repetición)
5. **Idempotencia** — procesar cada ID de evento exactamente una vez

### Webhooks Stripe (Node.js)

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()       // Cuerpo RAW — nunca req.json() primero
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // El SDK de Stripe maneja la verificación de firma + marca temporal
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotencia — omitir si ya fue procesado
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

    // Marcar como procesado (TTL: 24 horas cubre la ventana de 5 minutos de Stripe)
    await redis.setex(`stripe:event:${event.id}`, 86400, '1')
    return NextResponse.json({ received: true })

  } catch (err) {
    console.error(`Failed to handle event ${event.type}:`, err)
    // Devolver 500 para que Stripe reintente
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
```

```bash
# Pruebas locales
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger checkout.session.completed
```

### Webhooks Stripe (Python/FastAPI)

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
    payload = await request.body()          # bytes raw — crítico
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Idempotencia
    if await redis.exists(f"stripe:event:{event['id']}"):
        return JSONResponse({"received": True})

    if event["type"] == "checkout.session.completed":
        await handle_checkout(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        await handle_cancellation(event["data"]["object"])

    await redis.setex(f"stripe:event:{event['id']}", 86400, "1")
    return JSONResponse({"received": True})
```

### Verificación HMAC-SHA256 genérica

Para GitHub, Shopify y otros proveedores que usan HMAC estándar:

```typescript
import crypto from 'crypto'

function verifyHmacSignature(
  payload: string,
  signature: string,    // del encabezado del proveedor
  secret: string,       // tu secreto webhook
  algorithm = 'sha256'
): boolean {
  const expected = crypto
    .createHmac(algorithm, secret)
    .update(payload, 'utf8')
    .digest('hex')

  // Comparación de tiempo constante — previene ataques de temporización
  return crypto.timingSafeEqual(
    Buffer.from(signature.replace(/^sha256=/, ''), 'hex'),
    Buffer.from(expected, 'hex'),
  )
}

// Webhooks GitHub
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

### Protección contra ataques de repetición (validación de marca temporal)

```typescript
function verifyTimestamp(timestampHeader: string, toleranceSec = 300): boolean {
  const timestamp = parseInt(timestampHeader, 10)
  if (isNaN(timestamp)) return false
  const age = Math.abs(Date.now() / 1000 - timestamp)
  return age < toleranceSec  // rechazar si más antiguo que 5 minutos
}

// Verificación combinada con marca temporal
function verifyWebhook(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string,
): boolean {
  if (!verifyTimestamp(timestamp)) return false
  // Incluir la marca temporal en la cadena firmada (como hace Stripe)
  const signedPayload = `${timestamp}.${payload}`
  return verifyHmacSignature(signedPayload, signature, secret)
}
```

### Svix (infraestructura webhook alojada)

```typescript
// app/api/webhooks/clerk/route.ts — Clerk usa Svix
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

### Idempotencia con base de datos (cuando Redis no está disponible)

```typescript
// Usar una tabla processed_events en lugar de Redis
async function processWebhookOnce(
  eventId: string,
  handler: () => Promise<void>
): Promise<void> {
  // Intentar insertar — la restricción unique previene duplicados
  try {
    await db.insert(processedEvents).values({ id: eventId, processedAt: new Date() })
  } catch (err) {
    if (isUniqueConstraintError(err)) return  // ya procesado
    throw err
  }
  await handler()
}

// Uso
await processWebhookOnce(event.id, async () => {
  await activateSubscription(session)
})
```

### Lista de verificación de seguridad webhook

```
[ ] Cuerpo raw leído ANTES de parsear JSON
[ ] Encabezado de firma presente y verificación no-vacía
[ ] HMAC-SHA256 verificado con comparación de tiempo constante
[ ] Marca temporal validada (< 5 minutos de antigüedad)
[ ] ID de evento comprobado para idempotencia
[ ] Los errores del handler devuelven 5xx (para que el proveedor reintente)
[ ] Ningún dato sensible del payload registrado en logs
[ ] Secreto webhook almacenado en variable de entorno, nunca hardcodeado
[ ] Endpoint solo HTTPS (sin HTTP)
```

## Ejemplo

**Usuario:** Añadir manejo de webhooks Stripe para el ciclo de vida de suscripciones — checkout completado, suscripción cancelada y pago fallido — con idempotencia y verificación de firma.

**Resultado esperado:**
- `app/api/webhooks/stripe/route.ts` con `req.text()` + `stripe.webhooks.constructEvent()`
- Verificación de idempotencia Redis en `event.id` antes de procesar
- Tres manejadores de eventos: `activateSubscription`, `cancelSubscription`, `handlePaymentFailed`
- Devolver 500 en errores del manejador para que Stripe reintente
- Devolver 200 para tipos de eventos desconocidos (no fallar con nuevos tipos)

---
