> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../nextjs.md).

# Next.js Skill

## Wann aktivieren
- Eine Next.js-Anwendung mit dem App Router bauen
- Zwischen Server Components und Client Components entscheiden
- Server Actions für Formularübermittlungen und Mutationen schreiben
- Route Handler einrichten (API-Endpunkte im App Router)
- Authentifizierung mit NextAuth oder einem JWT-Muster implementieren
- Middleware für Weiterleitungen und Auth Guards konfigurieren
- Datenabruf mit React `cache()` und `unstable_cache` optimieren
- Parallele Routes, abfangende Routes oder Route Groups verwenden

## Wann NICHT verwenden
- Pages Router-Projekte — die Muster unterscheiden sich erheblich
- Reine SPAs ohne Server-Rendering (Vite + React verwenden)
- NestJS oder Express-Backends — NestJS Skill verwenden
- Statische Seiten ohne dynamische Daten (Astro verwenden)

## Anweisungen

### App Router Verzeichnisstruktur
```
app/
├── (auth)/              # Route-Gruppe — kein URL-Segment
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx       # Auth-spezifisches Layout
├── (dashboard)/
│   ├── dashboard/
│   │   ├── page.tsx     # Server Component standardmäßig
│   │   └── loading.tsx  # Suspense-Grenze UI
│   └── layout.tsx
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts # Route Handler
├── layout.tsx           # Root-Layout (erforderlich)
└── page.tsx             # Startseite
components/
├── ui/                  # Präsentational (kann Server oder Client sein)
└── forms/               # Immer Client Components (useState/Events)
lib/
├── auth.ts
├── db.ts
└── actions/             # Server Actions
    └── user.ts
```

### Server vs. Client Components
```tsx
// Server Component (Standard) — läuft auf dem Server, wird nie an den Client gesendet
// Kann: await fetch, DB lesen, Umgebungsvariablen abrufen
// Kann nicht: useState, useEffect, Browser-APIs, Event-Handler
export default async function UserProfile({ id }: { id: string }) {
  const user = await db.user.findUnique({ where: { id } })
  return <div>{user.name}</div>
}

// Client Component — 'use client'-Direktive hinzufügen
'use client'
import { useState } from 'react'

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  return <button onClick={() => setCount(c => c + 1)}>{count} likes</button>
}
```

Regel: standardmäßig Server Components verwenden. `'use client'` nur hinzufügen, wenn Interaktivität, Browser-APIs oder React-Hooks benötigt werden.

### Datenabruf-Muster
```tsx
// Server Component — direktes async/await, kein useEffect, kein useState
export default async function PostList() {
  const posts = await db.post.findMany({ where: { published: true } })
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// Deduplizierung — React cache() umschließt eine Funktion, sodass mehrere Komponenten
// bei einem Render einen gemeinsamen Fetch teilen
import { cache } from 'react'
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } })
})

// Statische Generierung mit Revalidierung
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR — stündlich revalidieren
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

// In einer Server Component:
export default function ProfileForm({ user }: { user: User }) {
  return (
    <form action={updateUser}>
      <input name="name" defaultValue={user.name} />
      <button type="submit">Save</button>
    </form>
  )
}
```

### Route Handler
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
// middleware.ts (Root-Ebene)
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

### Parallele und abfangende Routes
```
app/
├── @modal/          # Parallele Route — wird neben dem Hauptinhalt gerendert
│   └── (.)photo/    # Abfangende Route — fängt /photo/[id] ab
│       └── [id]/
│           └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── layout.tsx       # Akzeptiert { children, modal } als Props
```

### Fehler- und Lade-Grenzen
```tsx
// app/dashboard/loading.tsx — während Suspense angezeigt
export default function Loading() {
  return <DashboardSkeleton />
}

// app/dashboard/error.tsx — Fehlergrenze für dieses Segment
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )
}
```

### Umgebungsvariablen
- `NEXT_PUBLIC_*` — dem Browser ausgesetzt
- Alle anderen — nur serverseitig (in Client Components nie zugänglich)
- Niemals eine server-only Umgebungsvariable in einer Client Component importieren — sie gibt `undefined` zurück

## Beispiel

**Benutzer:** Eine paginierte Blog-Posts-Seite bei `/blog` hinzufügen, die aus PostgreSQL abruft, mit einem "Neuer Post"-Modal, das bei `/blog/new` öffnet, aber nicht von der Posts-Liste wegnavigiert.

**Erwartete Ausgabe:**
- `app/blog/page.tsx` — Server Component, ruft Posts mit `db.post.findMany` ab, rendert `<PostList>` + `<Link href="/blog/new">`
- `app/@modal/(.)blog/new/page.tsx` — Abfangende Route zeigt eine `<NewPostModal>` Client Component
- `app/blog/new/page.tsx` — Vollseiten-Fallback für direkte Navigation
- `app/layout.tsx` — Aktualisiert, um `modal`-Parallele-Route-Slot zu akzeptieren und neben `children` zu rendern
- `lib/actions/post.ts` — `createPost` Server Action mit Zod-Validierung + `revalidatePath('/blog')`

---
