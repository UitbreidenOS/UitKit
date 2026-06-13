---
name: webhooks
description: "Webhook security: HMAC-SHA256 signature verification, replay attack prevention, idempotency, Stripe + Svix + generic patterns"
---

> 🇫🇷 Version française. [English version](../webhooks.md).

# Compétence Sécurité Webhook

## Quand activer
- Implémenter un endpoint récepteur de webhook (Stripe, GitHub, Clerk, Svix, personnalisé)
- Vérifier les signatures de webhook pour confirmer l'authenticité du payload
- Ajouter une protection contre les attaques par rejeu (validation de l'horodatage)
- S'assurer que le traitement des webhooks est idempotent (sûr à recevoir deux fois)
- Déboguer un webhook qui échoue continuellement à la vérification de signature

## Quand NE PAS utiliser
- Envoi de webhooks (sortants) — cette compétence est pour les recevoir
- Intégrations basées sur le polling — aucun webhook impliqué

## Pourquoi c'est important

Le code webhook généré par IA est l'une des sources les plus courantes de vulnérabilités de sécurité critiques. Les LLM omettent fréquemment ou implémentent incorrectement : la vérification de signature, la comparaison à temps constant, la préservation du corps brut (analyser avant de vérifier invalide la signature), et les fenêtres d'attaque par rejeu. Une vérification de signature manquante permet à n'importe qui d'envoyer de faux événements de paiement.

## Instructions

### Concepts fondamentaux

Toute implémentation de webhook sécurisée nécessite :
1. **Préservation du corps brut** — vérifier la signature AVANT d'analyser le JSON
2. **Vérification HMAC-SHA256** — comparer la signature du fournisseur avec la vôtre
3. **Comparaison à temps constant** — `crypto.timingSafeEqual()` prévient les attaques temporelles
4. **Validation de l'horodatage** — rejeter les événements de plus de 5 minutes (prévention des rejeux)
5. **Idempotence** — traiter chaque ID d'événement exactement une fois

### Webhooks Stripe (Node.js)

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()       // Corps RAW — jamais req.json() d'abord
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Le SDK de Stripe gère la vérification de signature + horodatage
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Idempotence — ignorer si déjà traité
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

    // Marquer comme traité (TTL : 24 heures couvre la fenêtre de 5 minutes de Stripe)
    await redis.setex(`stripe:event:${event.id}`, 86400, '1')
    return NextResponse.json({ received: true })

  } catch (err) {
    console.error(`Failed to handle event ${event.type}:`, err)
    // Retourner 500 pour que Stripe réessaie
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
  }
}
```

```bash
# Tests locaux
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
    payload = await request.body()          # octets bruts — critique
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, WEBHOOK_SECRET)
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Idempotence
    if await redis.exists(f"stripe:event:{event['id']}"):
        return JSONResponse({"received": True})

    if event["type"] == "checkout.session.completed":
        await handle_checkout(event["data"]["object"])
    elif event["type"] == "customer.subscription.deleted":
        await handle_cancellation(event["data"]["object"])

    await redis.setex(f"stripe:event:{event['id']}", 86400, "1")
    return JSONResponse({"received": True})
```

### Vérification HMAC-SHA256 générique

Pour GitHub, Shopify et autres fournisseurs utilisant le HMAC standard :

```typescript
import crypto from 'crypto'

function verifyHmacSignature(
  payload: string,
  signature: string,    // depuis l'en-tête du fournisseur
  secret: string,       // votre secret webhook
  algorithm = 'sha256'
): boolean {
  const expected = crypto
    .createHmac(algorithm, secret)
    .update(payload, 'utf8')
    .digest('hex')

  // Comparaison à temps constant — prévient les attaques temporelles
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

### Protection contre les attaques par rejeu (validation de l'horodatage)

```typescript
function verifyTimestamp(timestampHeader: string, toleranceSec = 300): boolean {
  const timestamp = parseInt(timestampHeader, 10)
  if (isNaN(timestamp)) return false
  const age = Math.abs(Date.now() / 1000 - timestamp)
  return age < toleranceSec  // rejeter si plus vieux que 5 minutes
}

// Vérification combinée avec horodatage
function verifyWebhook(
  payload: string,
  signature: string,
  timestamp: string,
  secret: string,
): boolean {
  if (!verifyTimestamp(timestamp)) return false
  // Inclure l'horodatage dans la chaîne signée (comme Stripe le fait)
  const signedPayload = `${timestamp}.${payload}`
  return verifyHmacSignature(signedPayload, signature, secret)
}
```

### Svix (infrastructure webhook hébergée)

```typescript
// app/api/webhooks/clerk/route.ts — Clerk utilise Svix
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

### Idempotence avec base de données (quand Redis n'est pas disponible)

```typescript
// Utiliser une table processed_events à la place de Redis
async function processWebhookOnce(
  eventId: string,
  handler: () => Promise<void>
): Promise<void> {
  // Tenter d'insérer — la contrainte unique prévient les doublons
  try {
    await db.insert(processedEvents).values({ id: eventId, processedAt: new Date() })
  } catch (err) {
    if (isUniqueConstraintError(err)) return  // déjà traité
    throw err
  }
  await handler()
}

// Utilisation
await processWebhookOnce(event.id, async () => {
  await activateSubscription(session)
})
```

### Liste de contrôle sécurité webhook

```
[ ] Corps brut lu AVANT l'analyse JSON
[ ] En-tête de signature présent et vérification non-vide
[ ] HMAC-SHA256 vérifié avec comparaison à temps constant
[ ] Horodatage validé (< 5 minutes)
[ ] ID d'événement vérifié pour l'idempotence
[ ] Les erreurs du handler retournent 5xx (pour que le fournisseur réessaie)
[ ] Aucune donnée sensible journalisée depuis le payload
[ ] Secret webhook stocké dans une variable d'environnement, jamais en dur
[ ] Endpoint HTTPS uniquement (pas de HTTP)
```

## Exemple

**Utilisateur :** Ajouter la gestion des webhooks Stripe pour le cycle de vie des abonnements — paiement du checkout complété, abonnement annulé, et paiement échoué — avec idempotence et vérification de signature.

**Résultat attendu :**
- `app/api/webhooks/stripe/route.ts` avec `req.text()` + `stripe.webhooks.constructEvent()`
- Vérification d'idempotence Redis sur `event.id` avant traitement
- Trois gestionnaires d'événements : `activateSubscription`, `cancelSubscription`, `handlePaymentFailed`
- Retourner 500 sur les erreurs du gestionnaire pour que Stripe réessaie
- Retourner 200 pour les types d'événements inconnus (ne pas échouer sur les nouveaux types)

---
