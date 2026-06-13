> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../stripe.md).

# Stripe Integratie Skill

## Wanneer te activeren
- Stripe Checkout of Payment Intents implementeren voor eenmalige betalingen
- Stripe-abonnementen en factureringscycli instellen
- Stripe-webhooks afhandelen voor betalingsgebeurtenissen
- Terugbetalingen, geschillen of betalingsannuleringen implementeren
- Stripe Connect instellen voor marketplace/platform-betalingen
- Mislukte betalingen, geweigerde kaarten of problemen met webhookbezorging debuggen
- SCA (Strong Customer Authentication)-compliance implementeren

## Wanneer NIET te gebruiken
- PayPal, Braintree, Adyen, Mollie — andere betalingsproviders met andere SDK's
- Crypto-betalingen
- Interne boekhouding of factureringssystemen zonder een betalingsgateway
- Bankoverschrijving/ACH-only-flows (ander Stripe-product — Payment Elements zijn nog steeds van toepassing, maar flow verschilt)

## Instructies

### Codeer of log nooit betalingsgegevens
```typescript
// Log NOOIT kaartgegevens, volledige payment intent-objecten of klant-PII
// SLECHT:
console.log('Payment intent:', paymentIntent); // Kan gevoelige data bevatten

// GOED:
console.log('Payment intent created:', paymentIntent.id, paymentIntent.status);
```

### Payment Intents — aanmaken aan serverzijde
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',  // Pin altijd de API-versie
});

// Maak payment intent aan serverzijde — nooit aan clientzijde
export async function createPaymentIntent(
  amount: number,   // Altijd in kleinste valuta-eenheid (centen voor USD)
  currency: string,
  customerId: string,
  metadata: Record<string, string>
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,                    // bijv. 2999 = €29,99
    currency,                  // bijv. 'usd', 'eur'
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata,                  // Sla hier je interne ID's op
    idempotency_key: `pi_${customerId}_${Date.now()}`,  // Voorkom dubbele kosten
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}
```

### Webhook-afhandeling — verifieer altijd handtekening
```typescript
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();  // Ruwe body — geen geparseerde JSON
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Ongeldige handtekening — direct weigeren
    return new Response('Invalid signature', { status: 400 });
  }

  // Idempotent verwerken — webhooks kunnen meer dan eens worden bezorgd
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
      break;
    default:
      // Log maar geef geen fout bij onbekende events — Stripe voegt nieuwe events toe in de loop der tijd
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}

// Controleer altijd of al verwerkt voordat DB-wijzigingen worden aangebracht
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.order_id;

  // Idempotentiecontrole
  const existing = await db.order.findUnique({ where: { id: orderId } });
  if (existing?.status === 'paid') return;  // Al verwerkt

  await db.order.update({
    where: { id: orderId },
    data: { status: 'paid', stripePaymentIntentId: paymentIntent.id }
  });
}
```

### Abonnementen
```typescript
// Abonnement aanmaken
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',  // Activeer niet totdat betaling bevestigd is
  expand: ['latest_invoice.payment_intent'],
});

// Sleutel webhook-events voor abonnementen:
// customer.subscription.created → toegang verlenen
// customer.subscription.updated → planwijzigingen afhandelen
// customer.subscription.deleted → toegang intrekken
// invoice.payment_succeeded → toegangsperiode verlengen
// invoice.payment_failed → dunning-e-mail sturen, dan opschorten na respijtperiode
```

### Testmodus-discipline
```typescript
// Gebruik testkaartnummers in ontwikkeling:
// Succes: 4242 4242 4242 4242
// Geweigerd: 4000 0000 0000 0002
// Authenticatie vereist: 4000 0025 0000 3155
// Gebruik test webhook CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe

// Gebruik nooit testsleutels in productie, gebruik nooit live sleutels in ontwikkeling
const isLiveMode = process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_');
if (isLiveMode && process.env.NODE_ENV !== 'production') {
  throw new Error('Live Stripe keys must not be used outside production');
}
```

### Foutafhandeling
```typescript
try {
  const charge = await stripe.charges.create({ ... });
} catch (err) {
  if (err instanceof Stripe.errors.StripeCardError) {
    // Kaart geweigerd — toon gebruiksvriendelijk bericht
    return { error: err.message, code: err.code };
  }
  if (err instanceof Stripe.errors.StripeRateLimitError) {
    // Opnieuw proberen met exponentieel wachten
    throw err;
  }
  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    // Slechte API-aanroep — log en herstel de code
    console.error('Invalid Stripe request:', err.message);
    throw err;
  }
  // Andere fouten: StripeAPIError, StripeConnectionError, StripeAuthenticationError
  throw err;
}
```

## Voorbeeld

**Gebruiker:** Implementeer een checkout-flow voor een SaaS-product: maak aan serverzijde een payment intent aan, handel de webhook bij succes af om het abonnement te activeren en behandel mislukte betalingen.

**Verwachte output:**
- `POST /api/checkout` — maakt PaymentIntent aan, retourneert `clientSecret`
- `POST /api/webhooks/stripe` — verifieert handtekening, behandelt `payment_intent.succeeded` (idempotente DB-update), `payment_intent.payment_failed` (log + notificeer)
- Metadata op PaymentIntent: `user_id`, `plan_id`, `order_id`
- Alle bedragen in centen, valuta expliciet
- API-versie gepind
- Geen logging van gevoelige data

---
