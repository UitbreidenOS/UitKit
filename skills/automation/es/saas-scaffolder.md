---
name: saas-scaffolder
description: "Andamiaje de proyecto SaaS: generar una base de código SaaS completa lista para producción a partir de una descripción — Next.js, autenticación, base de datos, pagos, correo electrónico e implementación configurados"
---

# Skill SaaS Scaffolder

## Cuándo activar
- Iniciar un nuevo producto SaaS desde cero
- Necesitas un iniciador listo para producción con autenticación, facturación y correo electrónico conectados
- Quieres omitir el código estándar y comenzar con infraestructura funcional
- Construir una prueba de concepto que necesita ser lista para envío

## Cuándo NO usar
- Agregar una característica a una base de código existente — usar la habilidad relevante directamente
- Proyectos no SaaS (sitios estáticos, aplicaciones móviles, herramientas CLI) — usar la habilidad apropiada
- Cuando necesites control granular sobre cada opción de dependencia desde el principio

## Instrucciones

### Andamiaje completo de SaaS

```
Andamiar una aplicación SaaS completa.

Producto: [nombre y descripción de una línea]
Preferencias de pila:
  - Marco: [Next.js 15 App Router (predeterminado) / otro]
  - Autenticación: [Better Auth (predeterminado) / Clerk / NextAuth]
  - Base de datos: [PostgreSQL + Drizzle (predeterminado) / Prisma / MongoDB]
  - Hosting DB: [Neon (predeterminado) / Supabase / PlanetScale]
  - Pagos: [Stripe (predeterminado) / Paddle / none]
  - Correo electrónico: [Resend (predeterminado) / SendGrid / none]
  - Estilo: [Tailwind + shadcn/ui (predeterminado)]
  - Desplegar: [Railway (predeterminado) / Vercel / Fly.io]

Generar:
1. Estructura de directorios completa
2. Todos los archivos de configuración (next.config.ts, drizzle.config.ts, etc.)
3. Esquema de base de datos para [entidades principales]
4. Configuración de autenticación con Google + correo electrónico/contraseña
5. Suscripción de Stripe con [planes descritos]
6. Todas las variables .env requeridas documentadas
7. Comandos de configuración de primera ejecución

Salida como: árbol de archivos + contenido de archivo clave
```

### Pila de tecnología predeterminada (recomendada para velocidad)

```
El camino más rápido de cero a envío:

Marco: Next.js 15 (App Router + Server Actions)
  Por qué: full-stack, sin API separada, SDK Vercel AI integrado

Autenticación: Better Auth
  Por qué: código abierto, sin bloqueo de proveedor, adaptador Drizzle integrado

Base de datos: PostgreSQL vía Drizzle ORM + Neon
  Por qué: postgres sin servidor con ramificación, ORM de tipo TypeScript primero

Pagos: Stripe
  Por qué: mejores documentos, confiabilidad de webhooks, gestión de suscripción

Correo electrónico: Resend + React Email
  Por qué: mejor experiencia de desarrollador, componentes React para plantillas

Interfaz: Tailwind CSS + shadcn/ui
  Por qué: componentes accesibles que Claude puede leer y modificar

Desplegar: Railway
  Por qué: despliegues con git push, base de datos administrada, vistas previas de PR

Pila completa generada en un comando:
npx create-t3-app@latest  # T3 stack (Next.js + Drizzle + tRPC)
# Luego agregar Better Auth, Stripe, Resend en la parte superior
```

### Configuración de suscripciones de Stripe

```
Configurar facturación de suscripción de Stripe para [planes].

Planes: [ej. Starter $19/mo, Pro $49/mo, Enterprise $199/mo]

Archivos para generar:
1. lib/stripe.ts — Cliente de Stripe + IDs de producto/precio
2. app/api/webhooks/stripe/route.ts — manejador de webhook
3. db/schema.ts adiciones — tabla de suscripciones
4. app/(auth)/billing/page.tsx — página de gestión de facturación
5. lib/subscription.ts — funciones de ayuda

// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 1900,  // cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: ['Up to 5 projects', '10,000 API calls/month'],
  },
  pro: {
    name: 'Pro',
    price: 4900,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: ['Unlimited projects', '100,000 API calls/month', 'Priority support'],
  },
} as const

// app/api/webhooks/stripe/route.ts
import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      await db.update(users)
        .set({
          stripeCustomerId: session.customer as string,
          stripePriceId: session.metadata?.priceId,
          stripeCurrentPeriodEnd: new Date(
            (await stripe.subscriptions.retrieve(session.subscription as string))
              .current_period_end * 1000
          ),
        })
        .where(eq(users.id, session.metadata!.userId))
      break
    }
    case 'invoice.payment_failed': {
      // Handle payment failure — restrict access
      break
    }
  }
  
  return new Response(null, { status: 200 })
}

Generar configuración de Stripe para mis planes específicos.
```

### Variables de entorno

```
Generar el .env.example completo para [pila].

# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/myapp_dev
DATABASE_URL_DIRECT=postgresql://user:password@localhost:5432/myapp_dev

# Autenticación (Better Auth)
BETTER_AUTH_SECRET=generate-with-openssl-rand-hex-32
BETTER_AUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Correo electrónico (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@yourdomain.com

# Aplicación
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Ejemplo

**Usuario:** Andamiar una herramienta SaaS para rastreo de facturas. Los usuarios inician sesión con Google, tienen un nivel gratuito (5 facturas) y un nivel pagado ($19/mo, ilimitado). Enviar correo electrónico cuando se pague la factura.

**Salida de andamiaje de Claude:**

```
Estructura de directorios:
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── billing/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── invoices/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── api/
│   │   ├── auth/[...all]/route.ts    ← Better Auth handler
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   └── layout.tsx
├── db/
│   └── schema.ts                     ← users, invoices, subscriptions tables
├── lib/
│   ├── auth.ts                        ← Better Auth config
│   ├── db.ts                          ← Drizzle client
│   ├── stripe.ts                      ← Stripe client + plan config
│   └── email.ts                       ← Resend client
├── emails/
│   └── InvoicePaidEmail.tsx           ← React Email template
├── drizzle.config.ts
├── .env.example
└── package.json
```

Comandos clave para comenzar:
```bash
npm install
cp .env.example .env    # fill in values
npx drizzle-kit migrate # run initial migration
npm run dev             # start at localhost:3000
```

---
