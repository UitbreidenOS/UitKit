> 🇫🇷 This is the French translation. [English version](../nextjs.md).

# Compétence Next.js

## Quand activer
- Construire une application Next.js avec l'App Router
- Décider entre les Server Components et les Client Components
- Rédiger des Server Actions pour les soumissions de formulaires et les mutations
- Configurer des route handlers (endpoints API dans l'App Router)
- Implémenter l'authentification avec NextAuth ou un pattern JWT
- Configurer le middleware pour les redirections et les guards d'auth
- Optimiser la récupération de données avec `cache()` et `unstable_cache` de React
- Utiliser les routes parallèles, les routes d'interception ou les groupes de routes

## Quand NE PAS utiliser
- Projets Pages Router — les patterns diffèrent significativement
- SPAs pures sans rendu serveur (utiliser Vite + React)
- Backends NestJS ou Express — utiliser la compétence NestJS
- Sites statiques sans données dynamiques (utiliser Astro)

## Instructions

### Structure des répertoires App Router
```
app/
├── (auth)/              # Groupe de routes — pas de segment URL
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx       # Layout spécifique à l'auth
├── (dashboard)/
│   ├── dashboard/
│   │   ├── page.tsx     # Server Component par défaut
│   │   └── loading.tsx  # UI de la boundary Suspense
│   └── layout.tsx
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts # Route Handler
├── layout.tsx           # Layout racine (requis)
└── page.tsx             # Page d'accueil
components/
├── ui/                  # Présentationnels (peuvent être server ou client)
└── forms/               # Toujours des client components (useState/événements)
lib/
├── auth.ts
├── db.ts
└── actions/             # Server Actions
    └── user.ts
```

### Server Components vs. Client Components
```tsx
// Server Component (défaut) — s'exécute sur le serveur, jamais envoyé au client
// Peut : await fetch, lire la DB, accéder aux variables d'environnement
// Ne peut pas : useState, useEffect, APIs navigateur, gestionnaires d'événements
export default async function UserProfile({ id }: { id: string }) {
  const user = await db.user.findUnique({ where: { id } })
  return <div>{user.name}</div>
}

// Client Component — ajouter la directive 'use client'
'use client'
import { useState } from 'react'

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  return <button onClick={() => setCount(c => c + 1)}>{count} likes</button>
}
```

Règle : par défaut Server Components. Ajouter `'use client'` uniquement quand vous avez besoin d'interactivité, d'APIs navigateur ou de hooks React.

### Patterns de récupération de données
```tsx
// Server Component — async/await direct, pas de useEffect, pas de useState
export default async function PostList() {
  const posts = await db.post.findMany({ where: { published: true } })
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// Déduplication — React cache() enveloppe une fonction pour que plusieurs composants
// l'appelant dans un même rendu partagent une seule requête
import { cache } from 'react'
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } })
})

// Génération statique avec revalidation
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR — revalider toutes les heures
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

// Dans un Server Component :
export default function ProfileForm({ user }: { user: User }) {
  return (
    <form action={updateUser}>
      <input name="name" defaultValue={user.name} />
      <button type="submit">Save</button>
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
// middleware.ts (au niveau racine)
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

### Routes parallèles et d'interception
```
app/
├── @modal/          # Route parallèle — s'affiche à côté du contenu principal
│   └── (.)photo/    # Route d'interception — intercepte /photo/[id]
│       └── [id]/
│           └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── layout.tsx       # Accepte { children, modal } comme props
```

### Boundaries d'erreur et de chargement
```tsx
// app/dashboard/loading.tsx — affiché pendant Suspense
export default function Loading() {
  return <DashboardSkeleton />
}

// app/dashboard/error.tsx — boundary d'erreur pour ce segment
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

### Variables d'environnement
- `NEXT_PUBLIC_*` — exposées au navigateur
- Toutes les autres — côté serveur uniquement (jamais accessibles dans les Client Components)
- Ne jamais importer une variable d'environnement server-only dans un Client Component — elle retourne `undefined` silencieusement

## Exemple

**Utilisateur :** Ajouter une page de blog paginée à `/blog` qui récupère depuis PostgreSQL, avec une modale "Nouvel article" qui s'ouvre à `/blog/new` sans naviguer hors de la liste des articles.

**Sortie attendue :**
- `app/blog/page.tsx` — Server Component, récupère les articles avec `db.post.findMany`, affiche `<PostList>` + `<Link href="/blog/new">`
- `app/@modal/(.)blog/new/page.tsx` — Route d'interception affichant un Client Component `<NewPostModal>`
- `app/blog/new/page.tsx` — Page de repli pour la navigation directe
- `app/layout.tsx` — Mis à jour pour accepter le slot `modal` de la route parallèle et l'afficher aux côtés de `children`
- `lib/actions/post.ts` — Server Action `createPost` avec validation Zod + `revalidatePath('/blog')`

---
