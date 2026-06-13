> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../nextjs.md).

# Next.js Skill

## Wanneer te activeren
- Een Next.js-applicatie bouwen met de App Router
- Kiezen tussen Server Components en Client Components
- Server Actions schrijven voor formulierinzendingen en mutaties
- Route handlers instellen (API-endpoints in App Router)
- Authenticatie implementeren met NextAuth of een JWT-patroon
- Middleware configureren voor redirects en auth-guards
- Datafetching optimaliseren met React `cache()` en `unstable_cache`
- Parallelle routes, onderscheppende routes of routegroepen gebruiken

## Wanneer NIET te gebruiken
- Pages Router-projecten — de patronen verschillen aanzienlijk
- Pure SPA's zonder server-rendering (gebruik Vite + React)
- NestJS of Express backends — gebruik de NestJS skill
- Statische sites zonder dynamische data (gebruik Astro)

## Instructies

### App Router-directorystructuur
```
app/
├── (auth)/              # Routegroep — geen URL-segment
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx       # Auth-specifieke layout
├── (dashboard)/
│   ├── dashboard/
│   │   ├── page.tsx     # Server Component standaard
│   │   └── loading.tsx  # Suspense-grens UI
│   └── layout.tsx
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts # Route Handler
├── layout.tsx           # Root layout (vereist)
└── page.tsx             # Startpagina
components/
├── ui/                  # Presentationeel (kan server of client zijn)
└── forms/               # Altijd client components (useState/events)
lib/
├── auth.ts
├── db.ts
└── actions/             # Server Actions
    └── user.ts
```

### Server vs. Client Components
```tsx
// Server Component (standaard) — draait op server, wordt nooit naar client gestuurd
// Kan: await fetch, DB lezen, omgevingsvariabelen benaderen
// Kan niet: useState, useEffect, browser API's, event handlers
export default async function UserProfile({ id }: { id: string }) {
  const user = await db.user.findUnique({ where: { id } })
  return <div>{user.name}</div>
}

// Client Component — voeg 'use client'-directive toe
'use client'
import { useState } from 'react'

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  return <button onClick={() => setCount(c => c + 1)}>{count} likes</button>
}
```

Regel: gebruik standaard Server Components. Voeg `'use client'` alleen toe wanneer je interactiviteit, browser API's of React hooks nodig hebt.

### Datafetchingpatronen
```tsx
// Server Component — directe async/await, geen useEffect, geen useState
export default async function PostList() {
  const posts = await db.post.findMany({ where: { published: true } })
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// Deduplicatie — React cache() wikkelt een functie zodat meerdere components
// die het in één render aanroepen één fetch delen
import { cache } from 'react'
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } })
})

// Statische generatie met revalidatie
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR — elke uur revalideren
  })
  return res.json()
}
```

### Server Actions
```tsx
// lib/actions/user.ts
'use server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const UpdateSchema = z.object({
  name: z.string().min(1),
})

export async function updateUser(formData: FormData) {
  const parsed = UpdateSchema.safeParse({ name: formData.get('name') })
  if (!parsed.success) return { error: parsed.error.flatten() }

  await db.user.update({ where: { id: getCurrentUserId() }, data: parsed.data })
  revalidatePath('/dashboard/profile')
  return { success: true }
}

// In een Server Component:
export default function ProfileForm({ user }: { user: User }) {
  return (
    <form action={updateUser}>
      <input name="name" defaultValue={user.name} />
      <button type="submit">Opslaan</button>
    </form>
  )
}
```

### Route Handlers
```ts
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    await handleCheckoutCompleted(event.data.object)
  }

  return NextResponse.json({ received: true })
}
```

### Middleware
```ts
// middleware.ts (root-niveau)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
```

### Parallelle en onderscheppende routes
```
app/
├── @modal/          # Parallelle route — geeft naast hoofdinhoud weer
│   └── (.)photo/    # Onderscheppende route — onderschept /photo/[id]
│       └── [id]/
│           └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── layout.tsx       # Accepteert { children, modal } als props
```

### Fout- en laadgrenzen
```tsx
// app/dashboard/loading.tsx — getoond tijdens Suspense
export default function Loading() {
  return <DashboardSkeleton />
}

// app/dashboard/error.tsx — foutgrens voor dit segment
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Opnieuw proberen</button>
    </div>
  )
}
```

### Omgevingsvariabelen
- `NEXT_PUBLIC_*` — blootgesteld aan de browser
- Alle andere — alleen server (nooit toegankelijk in Client Components)
- Importeer nooit een alleen-server omgevingsvariabele in een Client Component — het retourneert stilletjes `undefined`

## Voorbeeld

**Gebruiker:** Voeg een gepagineerde blogberichtenpagina toe op `/blog` die ophaalt vanuit PostgreSQL, met een "Nieuw bericht"-modal die opent op `/blog/new` maar niet wegnavigeert van de berichtenlijst.

**Verwachte output:**
- `app/blog/page.tsx` — Server Component, haalt berichten op met `db.post.findMany`, geeft `<PostList>` + `<Link href="/blog/new">` weer
- `app/@modal/(.)blog/new/page.tsx` — Onderscheppende route die een `<NewPostModal>` Client Component toont
- `app/blog/new/page.tsx` — Volledige paginafallback voor directe navigatie
- `app/layout.tsx` — Bijgewerkt om `modal`-parallelle routesleuf te accepteren en naast `children` weer te geven
- `lib/actions/post.ts` — `createPost` Server Action met Zod-validatie + `revalidatePath('/blog')`

---
