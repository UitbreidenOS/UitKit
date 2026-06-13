> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../stripe.md).

# Stripe Integration Skill

## Wann aktivieren
- Stripe Checkout oder Payment Intents für Einmalzahlungen implementieren
- Stripe-Abonnements und Abrechnungszyklen einrichten
- Stripe-Webhooks für Zahlungsereignisse verarbeiten
- Rückerstattungen, Streitigkeiten oder Zahlungsabbrüche implementieren
- Stripe Connect für Marktplatz-/Plattformzahlungen einrichten
- Fehlgeschlagene Zahlungen, abgelehnte Karten oder Webhook-Zustellprobleme debuggen
- SCA (Starke Kundenauthentifizierung) Compliance implementieren

## Wann NICHT verwenden
- PayPal, Braintree, Adyen, Mollie — andere Zahlungsanbieter mit anderen SDKs
- Krypto-Zahlungen
- Interne Buchhaltungs- oder Rechnungssysteme ohne Zahlungs-Gateway
- Banküberweisung / nur ACH-Flows (anderes Stripe-Produkt — Payment Elements gelten noch, aber Flow unterscheidet sich)

## Anweisungen

### Niemals Zahlungsdaten hardcoden oder protokollieren
```typescript
// NIEMALS Kartendetails, vollständige Payment-Intent-Objekte oder Kunden-PII protokollieren
// SCHLECHT:
console.log('Payment intent:', paymentIntent); // Kann sensible Daten enthalten

// GUT:
console.log('Payment intent created:', paymentIntent.id, paymentIntent.status);
```

### Payment Intents — serverseitige Erstellung
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',  // API-Version immer pinnen
});

// Payment Intent serverseitig erstellen — niemals clientseitig
export async function createPaymentIntent(
  amount: number,   // Immer in kleinster Währungseinheit (Cents für USD)
  currency: string,
  customerId: string,
  metadata: Record<string, string>
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,                    // z.B. 2999 = $29.99
    currency,                  // z.B. 'usd', 'eur'
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata,                  // Interne IDs hier speichern
    idempotency_key: `pi_${customerId}_${Date.now()}`,  // Doppelte Abbuchungen verhindern
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}
```

### Webhook-Verarbeitung — immer Signatur verifizieren
```typescript
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();  // Roher Body — kein geparsten JSON
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Ungültige Signatur — sofort ablehnen
    return new Response('Invalid signature', { status: 400 });
  }

  // Idempotent verarbeiten — Webhooks können mehr als einmal zugestellt werden
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
      // Protokollieren, aber kein Fehler bei unbekannten Ereignissen — Stripe fügt neue Ereignisse im Laufe der Zeit hinzu
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}

// Immer prüfen, ob bereits verarbeitet, bevor DB-Änderungen vorgenommen werden
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.order_id;

  // Idempotenzprüfung
  const existing = await db.order.findUnique({ where: { id: orderId } });
  if (existing?.status === 'paid') return;  // Bereits verarbeitet

  await db.order.update({
    where: { id: orderId },
    data: { status: 'paid', stripePaymentIntentId: paymentIntent.id }
  });
}
```

### Abonnements
```typescript
// Abonnement erstellen
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',  // Nicht aktivieren bis Zahlung bestätigt
  expand: ['latest_invoice.payment_intent'],
});

// Wichtige Webhook-Ereignisse für Abonnements:
// customer.subscription.created → Zugang bereitstellen
// customer.subscription.updated → Planänderungen verarbeiten
// customer.subscription.deleted → Zugang widerrufen
// invoice.payment_succeeded → Zugangsperiode verlängern
// invoice.payment_failed → Mahnung senden, dann nach Nachfrist sperren
```

### Testmodus-Disziplin
```typescript
// Testkartennummern in der Entwicklung verwenden:
// Erfolg: 4242 4242 4242 4242
// Ablehnung: 4000 0000 0000 0002
// Auth erforderlich: 4000 0025 0000 3155
// Test-Webhook-CLI verwenden: stripe listen --forward-to localhost:3000/api/webhooks/stripe

// Niemals Testschlüssel in der Produktion, niemals Live-Schlüssel in der Entwicklung verwenden
const isLiveMode = process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_');
if (isLiveMode && process.env.NODE_ENV !== 'production') {
  throw new Error('Live Stripe keys must not be used outside production');
}
```

### Fehlerbehandlung
```typescript
try {
  const charge = await stripe.charges.create({ ... });
} catch (err) {
  if (err instanceof Stripe.errors.StripeCardError) {
    // Karte abgelehnt — benutzerfreundliche Meldung anzeigen
    return { error: err.message, code: err.code };
  }
  if (err instanceof Stripe.errors.StripeRateLimitError) {
    // Mit exponentiellem Backoff wiederholen
    throw err;
  }
  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    // Fehlerhafter API-Aufruf — protokollieren und Code korrigieren
    console.error('Invalid Stripe request:', err.message);
    throw err;
  }
  // Andere Fehler: StripeAPIError, StripeConnectionError, StripeAuthenticationError
  throw err;
}
```

## Beispiel

**Benutzer:** Einen Checkout-Flow für ein SaaS-Produkt implementieren: serverseitig einen Payment Intent erstellen, beim Erfolg den Webhook verarbeiten, um das Abonnement zu aktivieren, und fehlgeschlagene Zahlungen behandeln.

**Erwartete Ausgabe:**
- `POST /api/checkout` — erstellt PaymentIntent, gibt `clientSecret` zurück
- `POST /api/webhooks/stripe` — verifiziert Signatur, verarbeitet `payment_intent.succeeded` (idempotentes DB-Update), `payment_intent.payment_failed` (protokollieren + benachrichtigen)
- Metadaten auf PaymentIntent: `user_id`, `plan_id`, `order_id`
- Alle Beträge in Cents, Währung explizit
- API-Version gepinnt
- Keine Protokollierung sensibler Daten

---
