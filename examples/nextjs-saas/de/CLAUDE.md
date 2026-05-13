> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../CLAUDE.md).

# CLAUDE.md — Next.js SaaS Projekt

Dies ist eine Full-Stack-SaaS-Anwendung. Sie bietet authentifizierten Benutzern ein Dashboard, Abonnement-Abrechnung und eine Kernproduktfunktion. Diese Datei teilt Claude Code mit, wie in dieser Codebase gearbeitet werden soll.

---

## Tech-Stack

| Schicht | Technologie |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Datenbank | PostgreSQL via Prisma |
| Auth | NextAuth v5 (Auth.js) |
| Zahlungen | Stripe (Abonnements + Webhooks) |
| UI | shadcn/ui + Tailwind CSS |
| Deployment | Vercel |
| E-Mail | Resend |

---

## Wichtige Befehle

```bash
npm run dev          # Dev-Server starten (Port 3000)
npm run build        # Produktions-Build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit

npx prisma db push   # Schema-Änderungen in Dev-DB pushen (keine Migrationsdatei)
npx prisma migrate dev --name <name>   # Migrationsdatei erstellen
npx prisma studio    # DB-GUI
npx prisma db seed   # Dev-Daten seeden

stripe listen --forward-to localhost:3000/api/webhooks/stripe  # Stripe-Ereignisse weiterleiten
```

---

## Architektur

```
app/
├── (auth)/           # Login-, Registrierungs-, Passwort-vergessen-Seiten
├── (dashboard)/      # Authentifizierter Bereich — durch Middleware geschützt
│   ├── dashboard/    # Hauptdashboard
│   ├── settings/     # Konto- + Abrechnungseinstellungen
│   └── [feature]/    # Kernprodukt-Seiten
├── api/
│   ├── auth/         # NextAuth Route Handler
│   └── webhooks/
│       └── stripe/   # Stripe Webhook Handler
├── layout.tsx        # Root-Layout — SessionProvider befindet sich hier
└── page.tsx          # Marketing-Landingpage

lib/
├── auth.ts           # NextAuth-Konfiguration + Session-Hilfsfunktionen
├── db.ts             # Prisma Client Singleton
├── stripe.ts         # Stripe Client Singleton
└── actions/          # Server Actions (alle Mutationen kommen hierhin)

prisma/
├── schema.prisma
└── seed.ts
```

---

## Kernmuster

### Zugriff auf die Session in einer Server Component
```tsx
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')
  return <div>Welcome {session.user.email}</div>
}
```

### Mutationen über Server Actions
Alle Datenbankmutationen gehen in `lib/actions/`. Niemals `fetch()` auf eigene API-Routes für Mutationen aus Server Components aufrufen.

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

### Stripe Webhook Handler
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

export const runtime = 'edge'  // Stripe Webhook Handler läuft auf Edge
```

### Eine Datenbankabfrage hinzufügen
```ts
// lib/db.ts — Prisma Singleton (wichtig: nicht in jeder Datei instanziieren)
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Verwendung in Server Component:
import { db } from '@/lib/db'
const posts = await db.post.findMany({ where: { userId: session.user.id } })
```

---

## Middleware — Routen-Schutz
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

## Anti-Muster — NIEMALS tun

- **Niemals `fetch('/api/...')` aus einer Server Component** — die Funktion direkt aufrufen oder eine Server Action verwenden.
- **Niemals `STRIPE_SECRET_KEY` oder `NEXTAUTH_SECRET` in eine `NEXT_PUBLIC_`-Umgebungsvariable setzen** — sie würden dem Browser ausgesetzt.
- **Niemals `useEffect` verwenden, um initiale Daten zu laden** — stattdessen Server Components mit `await db.query()` verwenden.
- **Niemals die Server Action für Mutationen umgehen** — alle Schreibvorgänge gehen durch `lib/actions/`, damit Auth immer geprüft wird.
- **Niemals `'use client'` zu einer Komponente hinzufügen, nur um einen TypeScript-Fehler zu vermeiden** — den Typfehler stattdessen beheben.

---

## Umgebungsvariablen

Erforderlich in `.env`:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
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

## Ein neues Feature hinzufügen

1. Prisma-Modell zu `prisma/schema.prisma` hinzufügen, `npx prisma migrate dev --name add-feature` ausführen
2. `app/(dashboard)/[feature]/page.tsx` als Server Component erstellen
3. `lib/actions/[feature].ts` für Mutationen erstellen
4. Navigationslink zu `components/sidebar.tsx` hinzufügen
5. Bei Bedarf mit Middleware schützen (normalerweise durch den `/dashboard`-Matcher abgedeckt)
