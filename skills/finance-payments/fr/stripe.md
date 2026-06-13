> 🇫🇷 This is the French translation. [English version](../stripe.md).

# Compétence Intégration Stripe

## Quand activer
- Implémenter Stripe Checkout ou Payment Intents pour les paiements uniques
- Configurer les abonnements Stripe et les cycles de facturation
- Gérer les webhooks Stripe pour les événements de paiement
- Implémenter des remboursements, litiges ou annulations de paiement
- Configurer Stripe Connect pour les paiements marketplace/plateforme
- Déboguer des paiements échoués, des cartes refusées ou des problèmes de livraison de webhooks
- Implémenter la conformité SCA (Strong Customer Authentication)

## Quand NE PAS utiliser
- PayPal, Braintree, Adyen, Mollie — fournisseurs de paiement différents avec des SDKs différents
- Paiements crypto
- Systèmes comptables internes ou de facturation sans passerelle de paiement
- Flux uniquement par virement bancaire / ACH (produit Stripe différent — Payment Elements s'applique toujours, mais le flux diffère)

## Instructions

### Ne jamais coder en dur ou logger des données de paiement
```typescript
// NE JAMAIS logger les détails de carte, les objets payment intent complets, ou les PII clients
// MAUVAIS :
console.log('Payment intent:', paymentIntent); // Peut contenir des données sensibles

// BON :
console.log('Payment intent created:', paymentIntent.id, paymentIntent.status);
```

### Payment Intents — création côté serveur
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',  // Toujours épingler la version de l'API
});

// Créer le payment intent côté serveur — jamais côté client
export async function createPaymentIntent(
  amount: number,   // Toujours dans la plus petite unité monétaire (centimes pour USD)
  currency: string,
  customerId: string,
  metadata: Record<string, string>
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,                    // ex: 2999 = 29,99€
    currency,                  // ex: 'usd', 'eur'
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata,                  // Stocker vos IDs internes ici
    idempotency_key: `pi_${customerId}_${Date.now()}`,  // Prévenir les charges en doublon
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}
```

### Gestion des webhooks — toujours vérifier la signature
```typescript
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();  // Corps brut — pas de JSON parsé
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Signature invalide — rejeter immédiatement
    return new Response('Invalid signature', { status: 400 });
  }

  // Traiter de manière idempotente — les webhooks peuvent être livrés plus d'une fois
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
      // Logger mais ne pas lever d'erreur sur les événements inconnus — Stripe en ajoute de nouveaux au fil du temps
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}

// Toujours vérifier si déjà traité avant de modifier la DB
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.order_id;

  // Vérification d'idempotence
  const existing = await db.order.findUnique({ where: { id: orderId } });
  if (existing?.status === 'paid') return;  // Déjà traité

  await db.order.update({
    where: { id: orderId },
    data: { status: 'paid', stripePaymentIntentId: paymentIntent.id }
  });
}
```

### Abonnements
```typescript
// Créer un abonnement
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',  // Ne pas activer avant confirmation du paiement
  expand: ['latest_invoice.payment_intent'],
});

// Événements webhook clés pour les abonnements :
// customer.subscription.created → provisionner l'accès
// customer.subscription.updated → gérer les changements de plan
// customer.subscription.deleted → révoquer l'accès
// invoice.payment_succeeded → étendre la période d'accès
// invoice.payment_failed → envoyer un email de relance, puis suspendre après la période de grâce
```

### Discipline du mode test
```typescript
// Utiliser des numéros de carte de test en développement :
// Succès : 4242 4242 4242 4242
// Refus : 4000 0000 0000 0002
// Auth requise : 4000 0025 0000 3155
// Utiliser la CLI webhook de test : stripe listen --forward-to localhost:3000/api/webhooks/stripe

// Ne jamais utiliser des clés de test en production, ne jamais utiliser des clés live en développement
const isLiveMode = process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_');
if (isLiveMode && process.env.NODE_ENV !== 'production') {
  throw new Error('Live Stripe keys must not be used outside production');
}
```

### Gestion des erreurs
```typescript
try {
  const charge = await stripe.charges.create({ ... });
} catch (err) {
  if (err instanceof Stripe.errors.StripeCardError) {
    // Carte refusée — afficher un message convivial
    return { error: err.message, code: err.code };
  }
  if (err instanceof Stripe.errors.StripeRateLimitError) {
    // Réessayer avec backoff exponentiel
    throw err;
  }
  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    // Mauvais appel API — logger et corriger le code
    console.error('Invalid Stripe request:', err.message);
    throw err;
  }
  // Autres erreurs : StripeAPIError, StripeConnectionError, StripeAuthenticationError
  throw err;
}
```

## Exemple

**Utilisateur :** Implémenter un flux de checkout pour un produit SaaS : créer un payment intent côté serveur, gérer le webhook au succès pour activer l'abonnement et gérer les paiements échoués.

**Sortie attendue :**
- `POST /api/checkout` — crée le PaymentIntent, retourne `clientSecret`
- `POST /api/webhooks/stripe` — vérifie la signature, gère `payment_intent.succeeded` (mise à jour DB idempotente), `payment_intent.payment_failed` (log + notification)
- Métadonnées sur le PaymentIntent : `user_id`, `plan_id`, `order_id`
- Tous les montants en centimes, devise explicite
- Version de l'API épinglée
- Pas de logging de données sensibles

---
