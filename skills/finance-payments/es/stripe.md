> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../stripe.md).

# Skill de Integración con Stripe

## Cuándo activar
- Implementar Stripe Checkout o Payment Intents para pagos únicos
- Configurar suscripciones y ciclos de facturación en Stripe
- Manejar webhooks de Stripe para eventos de pago
- Implementar reembolsos, disputas o cancelaciones de pagos
- Configurar Stripe Connect para pagos en marketplace/plataforma
- Depurar pagos fallidos, tarjetas rechazadas o problemas de entrega de webhooks
- Implementar cumplimiento de SCA (Strong Customer Authentication)

## Cuándo NO usar
- PayPal, Braintree, Adyen, Mollie — proveedores de pago diferentes con SDKs diferentes
- Pagos con criptomonedas
- Sistemas internos de contabilidad o facturación sin pasarela de pago
- Flujos solo de transferencia bancaria/ACH (producto diferente de Stripe — Payment Elements aún aplica, pero el flujo difiere)

## Instrucciones

### Nunca hardcodees ni registres datos de pago
```typescript
// NUNCA registres detalles de tarjeta, objetos completos de payment intent o PII del cliente
// MALO:
console.log('Payment intent:', paymentIntent); // Puede contener datos sensibles

// BUENO:
console.log('Payment intent created:', paymentIntent.id, paymentIntent.status);
```

### Payment Intents — creación en el servidor
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',  // Siempre fija la versión de la API
});

// Crear payment intent en el servidor — nunca en el cliente
export async function createPaymentIntent(
  amount: number,   // Siempre en la unidad de moneda más pequeña (centavos para USD)
  currency: string,
  customerId: string,
  metadata: Record<string, string>
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,                    // p.ej., 2999 = $29.99
    currency,                  // p.ej., 'usd', 'eur'
    customer: customerId,
    automatic_payment_methods: { enabled: true },
    metadata,                  // Almacena tus IDs internos aquí
    idempotency_key: `pi_${customerId}_${Date.now()}`,  // Prevenir cargos duplicados
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
  };
}
```

### Manejo de webhooks — siempre verifica la firma
```typescript
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();  // Cuerpo sin procesar — no JSON parseado
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Firma inválida — rechazar inmediatamente
    return new Response('Invalid signature', { status: 400 });
  }

  // Procesar idempotentemente — los webhooks pueden entregarse más de una vez
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
      // Registrar pero no dar error en eventos desconocidos — Stripe agrega nuevos eventos con el tiempo
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}

// Siempre verifica si ya fue procesado antes de hacer cambios en la BD
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.order_id;

  // Verificación de idempotencia
  const existing = await db.order.findUnique({ where: { id: orderId } });
  if (existing?.status === 'paid') return;  // Ya procesado

  await db.order.update({
    where: { id: orderId },
    data: { status: 'paid', stripePaymentIntentId: paymentIntent.id }
  });
}
```

### Suscripciones
```typescript
// Crear suscripción
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',  // No activar hasta que se confirme el pago
  expand: ['latest_invoice.payment_intent'],
});

// Eventos webhook clave para suscripciones:
// customer.subscription.created → aprovisionar acceso
// customer.subscription.updated → manejar cambios de plan
// customer.subscription.deleted → revocar acceso
// invoice.payment_succeeded → extender período de acceso
// invoice.payment_failed → enviar correo de dunning, luego suspender después del período de gracia
```

### Disciplina en modo de prueba
```typescript
// Usar números de tarjeta de prueba en desarrollo:
// Éxito: 4242 4242 4242 4242
// Rechazada: 4000 0000 0000 0002
// Requiere autenticación: 4000 0025 0000 3155
// Usar webhook CLI de prueba: stripe listen --forward-to localhost:3000/api/webhooks/stripe

// Nunca usar claves de prueba en producción, nunca usar claves en vivo en desarrollo
const isLiveMode = process.env.STRIPE_SECRET_KEY!.startsWith('sk_live_');
if (isLiveMode && process.env.NODE_ENV !== 'production') {
  throw new Error('Live Stripe keys must not be used outside production');
}
```

### Manejo de errores
```typescript
try {
  const charge = await stripe.charges.create({ ... });
} catch (err) {
  if (err instanceof Stripe.errors.StripeCardError) {
    // Tarjeta rechazada — mostrar mensaje amigable al usuario
    return { error: err.message, code: err.code };
  }
  if (err instanceof Stripe.errors.StripeRateLimitError) {
    // Reintentar con backoff exponencial
    throw err;
  }
  if (err instanceof Stripe.errors.StripeInvalidRequestError) {
    // Llamada a la API incorrecta — registrar y corregir el código
    console.error('Invalid Stripe request:', err.message);
    throw err;
  }
  // Otros errores: StripeAPIError, StripeConnectionError, StripeAuthenticationError
  throw err;
}
```

## Ejemplo

**Usuario:** Implementar un flujo de checkout para un producto SaaS: crear un payment intent en el servidor, manejar el webhook al tener éxito para activar la suscripción y manejar pagos fallidos.

**Salida esperada:**
- `POST /api/checkout` — crea PaymentIntent, devuelve `clientSecret`
- `POST /api/webhooks/stripe` — verifica firma, maneja `payment_intent.succeeded` (actualización idempotente en BD), `payment_intent.payment_failed` (registrar + notificar)
- Metadata en PaymentIntent: `user_id`, `plan_id`, `order_id`
- Todos los importes en centavos, moneda explícita
- Versión de la API fijada
- Sin registro de datos sensibles

---
