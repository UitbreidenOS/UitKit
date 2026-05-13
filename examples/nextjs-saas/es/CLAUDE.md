> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../CLAUDE.md).

# CLAUDE.md — Proyecto SaaS Next.js

Esta es una aplicación SaaS full-stack. Proporciona a los usuarios autenticados un dashboard, facturación por suscripción y una funcionalidad central del producto. Este archivo le dice a Claude Code cómo trabajar en este codebase.

---

## Tech Stack

| Capa | Tecnología |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Base de datos | PostgreSQL via Prisma |
| Autenticación | NextAuth v5 (Auth.js) |
| Pagos | Stripe (suscripciones + webhooks) |
| UI | shadcn/ui + Tailwind CSS |
| Despliegue | Vercel |
| Email | Resend |

---

## Comandos Clave

```bash
npm run dev          # Iniciar servidor de desarrollo (puerto 3000)
npm run build        # Build de producción
npm run lint         # ESLint
npm run type-check   # tsc --noEmit

npx prisma db push   # Enviar cambios de esquema a BD de desarrollo (sin archivo de migración)
npx prisma migrate dev --name <name>   # Crear un archivo de migración
npx prisma studio    # GUI de la BD
npx prisma db seed   # Sembrar datos de desarrollo

stripe listen --forward-to localhost:3000/api/webhooks/stripe  # Reenviar eventos de Stripe
```

---

## Arquitectura

```
app/
├── (auth)/           # Páginas de login, registro, contraseña olvidada
├── (dashboard)/      # Área autenticada — protegida por middleware
│   ├── dashboard/    # Dashboard principal
│   ├── settings/     # Configuración de cuenta y facturación
│   └── [feature]/    # Páginas del producto central
├── api/
│   ├── auth/         # Manejador de rutas de NextAuth
│   └── webhooks/
│       └── stripe/   # Manejador de webhooks de Stripe
├── layout.tsx        # Layout raíz — SessionProvider vive aquí
└── page.tsx          # Página de marketing (landing)

lib/
├── auth.ts           # Configuración NextAuth + helpers de sesión
├── db.ts             # Singleton del cliente Prisma
├── stripe.ts         # Singleton del cliente Stripe
└── actions/          # Server Actions (todas las mutations van aquí)

prisma/
├── schema.prisma
└── seed.ts
```

---

## Patrones Centrales

### Acceder a la sesión en un Server Component
```tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <div>Welcome {session.user.email}</div>
}
```

### Mutations mediante Server Actions
Todas las mutations a la base de datos van en `lib/actions/`. Nunca uses `fetch()` en tus propias rutas de API para mutations desde Server Components.

```ts
// lib/actions/subscription.ts
'use server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

export async function createCheckoutSession() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/settings/billing`,
  })

  return { url: checkoutSession.url }
}
```

### Manejador de webhooks de Stripe
```ts
// app/api/webhooks/stripe/route.ts
export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

  switch (event.type) {
    case 'checkout.session.completed':
      await activateSubscription(event.data.object)
      break
    case 'customer.subscription.deleted':
      await deactivateSubscription(event.data.object)
      break
  }

  return NextResponse.json({ received: true })
}

export const runtime = 'edge'  // El manejador de webhooks de Stripe se ejecuta en edge
```

### Agregar una consulta a la base de datos
```ts
// lib/db.ts — Singleton de Prisma (importante: no instanciar en cada archivo)
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Uso en Server Component:
import { db } from '@/lib/db'
const posts = await db.post.findMany({ where: { userId: session.user.id } })
```

---

## Middleware — protección de rutas
```ts
// middleware.ts
import { auth } from '@/lib/auth'

export default auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith('/dashboard')) {
    return Response.redirect(new URL('/login', req.url))
  }
})

export const config = { matcher: ['/dashboard/:path*', '/settings/:path*'] }
```

---

## Anti-Patrones — NO hacer

- **Nunca uses `fetch('/api/...')` desde un Server Component** — llama a la función directamente o usa una Server Action.
- **Nunca pongas `STRIPE_SECRET_KEY` o `NEXTAUTH_SECRET` en una variable de entorno `NEXT_PUBLIC_`** — quedarían expuestos al navegador.
- **Nunca uses `useEffect` para cargar datos iniciales** — usa Server Components con `await db.query()` en su lugar.
- **Nunca omitas la Server Action para mutations** — todas las escrituras pasan por `lib/actions/` para que la autenticación siempre se verifique.
- **Nunca agregues `'use client'` a un componente solo para evitar un error de TypeScript** — corrige el error de tipo en su lugar.

---

## Variables de Entorno

Requeridas en `.env`:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generar con: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_URL=http://localhost:3000
RESEND_API_KEY=re_...
```

---

## Agregar una Nueva Funcionalidad

1. Agrega el modelo Prisma a `prisma/schema.prisma`, ejecuta `npx prisma migrate dev --name add-feature`
2. Crea `app/(dashboard)/[feature]/page.tsx` como Server Component
3. Crea `lib/actions/[feature].ts` para las mutations
4. Agrega el enlace de navegación a `components/sidebar.tsx`
5. Protege con middleware si es necesario (usualmente cubierto por el matcher de `/dashboard`)
