> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../nextjs.md).

# Skill de Next.js

## Cuándo activar
- Construir una aplicación Next.js usando el App Router
- Decidir entre Server Components y Client Components
- Escribir Server Actions para envíos de formularios y mutations
- Configurar route handlers (endpoints de API en App Router)
- Implementar autenticación con NextAuth o un patrón JWT
- Configurar middleware para redirecciones y guardas de autenticación
- Optimizar la obtención de datos con `cache()` y `unstable_cache` de React
- Usar rutas paralelas, rutas interceptadas o grupos de rutas

## Cuándo NO usar
- Proyectos con Pages Router — los patrones difieren significativamente
- SPAs puras sin renderizado en servidor (usar Vite + React)
- Backends NestJS o Express — usar el skill de NestJS
- Sitios estáticos sin datos dinámicos (usar Astro)

## Instrucciones

### Estructura de directorios del App Router
```
app/
├── (auth)/              # Grupo de rutas — sin segmento de URL
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx       # Layout específico de autenticación
├── (dashboard)/
│   ├── dashboard/
│   │   ├── page.tsx     # Server Component por defecto
│   │   └── loading.tsx  # UI del límite de Suspense
│   └── layout.tsx
├── api/
│   └── webhooks/
│       └── stripe/
│           └── route.ts # Route Handler
├── layout.tsx           # Layout raíz (requerido)
└── page.tsx             # Página de inicio
components/
├── ui/                  # Presentacional (puede ser server o client)
└── forms/               # Siempre Client Components (useState/eventos)
lib/
├── auth.ts
├── db.ts
└── actions/             # Server Actions
    └── user.ts
```

### Server vs. Client Components
```tsx
// Server Component (por defecto) — se ejecuta en el servidor, nunca se envía al cliente
// Puede: await fetch, leer BD, acceder a variables de entorno
// No puede: useState, useEffect, APIs del navegador, manejadores de eventos
export default async function UserProfile({ id }: { id: string }) {
  const user = await db.user.findUnique({ where: { id } })
  return <div>{user.name}</div>
}

// Client Component — agregar directiva 'use client'
'use client'
import { useState } from 'react'

export function LikeButton({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount)
  return <button onClick={() => setCount(c => c + 1)}>{count} likes</button>
}
```

Regla: por defecto usar Server Components. Agregar `'use client'` solo cuando se necesita interactividad, APIs del navegador o hooks de React.

### Patrones de obtención de datos
```tsx
// Server Component — async/await directo, sin useEffect, sin useState
export default async function PostList() {
  const posts = await db.post.findMany({ where: { published: true } })
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}

// Deduplicación — React cache() envuelve una función para que múltiples componentes
// que la llamen en un render compartan una sola fetch
import { cache } from 'react'
export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } })
})

// Generación estática con revalidación
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 }, // ISR — revalidar cada hora
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

// En un Server Component:
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
// middleware.ts (nivel raíz)
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

### Rutas paralelas e interceptadas
```
app/
├── @modal/          # Ruta paralela — se renderiza junto al contenido principal
│   └── (.)photo/    # Ruta interceptada — intercepta /photo/[id]
│       └── [id]/
│           └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── layout.tsx       # Acepta { children, modal } como props
```

### Límites de error y carga
```tsx
// app/dashboard/loading.tsx — mostrado durante Suspense
export default function Loading() {
  return <DashboardSkeleton />
}

// app/dashboard/error.tsx — límite de error para este segmento
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

### Variables de entorno
- `NEXT_PUBLIC_*` — expuestas al navegador
- Todo lo demás — solo servidor (nunca accesible en Client Components)
- Nunca importes una variable de entorno solo del servidor dentro de un Client Component — devuelve `undefined` silenciosamente

## Ejemplo

**Usuario:** Agregar una página de publicaciones de blog paginada en `/blog` que obtiene de PostgreSQL, con un modal "Nueva Publicación" que se abre en `/blog/new` pero no navega fuera de la lista de publicaciones.

**Salida esperada:**
- `app/blog/page.tsx` — Server Component, obtiene posts con `db.post.findMany`, renderiza `<PostList>` + `<Link href="/blog/new">`
- `app/@modal/(.)blog/new/page.tsx` — Ruta interceptada mostrando un Client Component `<NewPostModal>`
- `app/blog/new/page.tsx` — Fallback a página completa para navegación directa
- `app/layout.tsx` — Actualizado para aceptar el slot de ruta paralela `modal` y renderizarlo junto a `children`
- `lib/actions/post.ts` — Server Action `createPost` con validación Zod + `revalidatePath('/blog')`

---
