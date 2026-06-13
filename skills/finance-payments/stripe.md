---
name: stripe
description: "Stripe Checkout, subscriptions, webhooks, customer portal, payment intents, test mode, idempotency"
updated: 2026-06-13
---

# Stripe Integration Skill

## When to activate
- Implementing Stripe Checkout or Payment Intents for one-time payments
- Setting up Stripe subscriptions and billing cycles
- Handling Stripe webhooks for payment events
- Implementing refunds, disputes, or payment cancellations
- Setting up Stripe Connect for marketplace/platform payments
- Debugging failed payments, declined cards, or webhook delivery issues
- Implementing SCA (Strong Customer Authentication) compliance

## When NOT to use
- PayPal, Braintree, Adyen, Mollie — different payment providers with different SDKs
- Crypto payments
- Internal accounting or invoicing systems without a payment gateway
- Bank transfer / ACH-only flows (different Stripe product — Payment Elements still apply, but flow differs)

## Instructions

### Never hardcode or log payment data
```typescript
// NEVER log card details, full payment intent objects, or customer PII
// BAD:
console.log('Payment intent:', paymentIntent); // May contain sensitive data

// GOOD:
console.log('Payment intent created:', paymentIntent.id, paymentIntent.status);
```

### Payment Intents — server-side creation
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',  // Always pin the API version
});

// Create payment intent server-side — never client-side
export async function createPaymentIntent(
  amount: number,   // Always in smallest currency unit (cents for USD)
  currency: string,
  customerId: string,
  metadata: Record<string, string>
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,                    // e.g., 2999 = $29.99
    currency,                  // e.g., 'usd', 'eur'
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata,                  // Store your internal IDs here
    idempotency_key: `pi_${customerId}_${Date.now()}`,  // Prevent duplicate charges
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}
```

### Webhook handling — always verify signature
```typescript
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();  // Raw body — not parsed JSON
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Invalid signature — reject immediately
    return new Response('Invalid signature', { status: 400 });
  }

  // Process idempotently — webhooks can be delivered more than once
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
      // Log but don't error on unknown events — Stripe adds new events over time
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}

// Always check if already processed before making DB changes
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.order_id;

  // Idempotency check
  const existing = await db.order.findUnique({ where: { id: orderId } });
  if (existing?.status === 'paid') return;  // Already processed

  await db.order.update({
    where: { id: orderId },
    data: { status: 'paid', stripePaymentIntentId: paymentIntent.id }
  });
}
```

### Subscriptions
```typescript
// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',  // Don't activate until payment confirmed
  expand: ['latest_invoice.payment_intent'],
});

// Key webhook events for subscriptions:
// customer.subscription.created → provision access
// customer.subscription.updated → handle plan changes
// customer.subscription.deleted → revoke access
// invoice.payment_succeeded → extend access period
// invoice.payment_failed → send dunning email, then suspend after grace period
```

### Test mode discipline
```typescript
// Use test card numbers in development:
// Success: 4242 4242 4242 4242
// Decline: 4000 0000 0000 0002
// Auth required: 4000 0025 0000 3155
// Use test webhook CLI: stripe listen --forward-to localhost:3000/api/webhooks/stripe

// Never use test keys in production, never use live keys in development
const isLiveMode = process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_');
if (isLiveMode && process.env.NODE_ENV !== 'production') {
  throw new Error('Live Stripe keys must not be used outside production');
}
```

### Error handling
```typescript
try {
  const charge = await stripe.charges.create({ ... });
} catch (err) {
  if (err instanceof Stripe.errors.StripeCardError) {
    // Card declined — show user-friendly message
    return { error: err.message, code: err.code };
  }
  if (err instanceof Stripe.errors.StripeRateLimitError) {
    // Retry with exponential backoff
    throw err;
  }
  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    // Bad API call — log and fix the code
    console.error('Invalid Stripe request:', err.message);
    throw err;
  }
  // Other errors: StripeAPIError, StripeConnectionError, StripeAuthenticationError
  throw err;
}
```

## Example

**User:** Implement a checkout flow for a SaaS product: create a payment intent server-side, handle the webhook on success to activate the subscription, and handle failed payments.

**Expected output:**
- `POST /api/checkout` — creates PaymentIntent, returns `clientSecret`
- `POST /api/webhooks/stripe` — verifies signature, handles `payment_intent.succeeded` (idempotent DB update), `payment_intent.payment_failed` (log + notify)
- Metadata on PaymentIntent: `user_id`, `plan_id`, `order_id`
- All amounts in cents, currency explicit
- API version pinned
- No logging of sensitive data

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities. Building payment flows or monetizing AI products? [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
