---
name: trpc
description: "tRPC end-to-end type-safe APIs: T3 Stack setup, routers, procedures, Zod validation, React Query integration, middleware, subscriptions"
---

> 🇩🇪 Deutsche Version. [Englische Version](../trpc.md).

# tRPC-Kompetenz

## Wann aktivieren
- Aufbau des T3 Stacks (Next.js + tRPC + Drizzle/Prisma + TypeScript)
- End-to-End-Typsicherheit zwischen Next.js-Frontend und -Backend ohne REST oder GraphQL
- Schreiben typsicherer API-Prozeduren mit Zod-Eingabevalidierung
- Einrichtung von tRPC mit React Query für Datenabruf in React
- Hinzufügen von Middleware (Auth, Ratenlimitierung, Protokollierung) zu tRPC-Prozeduren

## Wann NICHT verwenden
- APIs für Nicht-TypeScript-Clients (mobile Apps, Drittparteien) — stattdessen REST verwenden
- Öffentliche APIs — tRPC ist für Full-Stack-TypeScript in derselben Codebasis ausgelegt
- Wenn die Flexibilität von GraphQL benötigt wird — die GraphQL-Kompetenz verwenden

## Anweisungen

### Installation (T3 Stack)

```bash
# Vollständige T3 Stack-App erstellen
npx create-t3-app@latest my-app

# Oder tRPC zu bestehendem Next.js hinzufügen
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
```

### Projektstruktur

```
src/
├── server/
│   ├── trpc.ts          # tRPC-Instanz, Kontext, Middleware
│   ├── routers/
│   │   ├── _app.ts      # Root-Router (kombiniert alle Router)
│   │   ├── user.ts      # Benutzer-Prozeduren
│   │   └── post.ts      # Beitrag-Prozeduren
├── app/
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts   # Next.js App Router Handler
└── trpc/
    └── client.ts        # Client-seitige tRPC-Einrichtung
```

### tRPC-Instanz-Setup

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { db } from '@/db'

// Kontext — verfügbar für alle Prozeduren
export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await getServerSession()
  return { db, session, headers: opts.headers }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,  // verarbeitet Date, Map, Set-Serialisierung
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

// Basisprozeduren
export const router = t.router
export const publicProcedure = t.procedure

// Geschützte Prozedur — erfordert Authentifizierung
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, session: ctx.session } })
})
export const protectedProcedure = t.procedure.use(isAuthed)

// Ratenlimitierte Prozedur
const rateLimit = t.middleware(async ({ ctx, next }) => {
  const userId = ctx.session?.user?.id ?? ctx.headers.get('x-forwarded-for')
  const key = `ratelimit:${userId}`
  const count = await redis.incr(key)
  if (count === 1) await redis.expire(key, 60)
  if (count > 100) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })
  return next()
})
export const rateLimitedProcedure = publicProcedure.use(rateLimit)
```

### Prozeduren definieren (Abfragen und Mutationen)

```typescript
// server/routers/user.ts
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const userRouter = router({
  // Abfrage — GET-Äquivalent
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        columns: { id: true, name: true, email: true, createdAt: true },
      })
      if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      return user
    }),

  // Abfrage — Liste mit Paginierung
  list: protectedProcedure
    .input(z.object({
      cursor: z.string().optional(),
      limit: z.number().int().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.query.users.findMany({
        limit: input.limit + 1,
        where: input.cursor ? gt(users.id, input.cursor) : undefined,
        orderBy: asc(users.id),
      })
      const hasMore = items.length > input.limit
      return {
        items: items.slice(0, input.limit),
        nextCursor: hasMore ? items[input.limit - 1].id : null,
      }
    }),

  // Mutation — POST/PUT-Äquivalent
  update: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100).optional(),
      bio:  z.string().max(500).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.session.user.id))
        .returning()
      return updated
    }),

  // Mutation — Löschen
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.id !== input.id) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      await ctx.db.delete(users).where(eq(users.id, input.id))
      return { success: true }
    }),
})
```

### Root-Router

```typescript
// server/routers/_app.ts
import { router } from '../trpc'
import { userRouter } from './user'
import { postRouter } from './post'

export const appRouter = router({
  user: userRouter,
  post: postRouter,
})

export type AppRouter = typeof appRouter
```

### Next.js App Router Handler

```typescript
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/trpc'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers }),
    onError: process.env.NODE_ENV === 'development'
      ? ({ path, error }) => console.error(`tRPC error on ${path}:`, error)
      : undefined,
  })

export { handler as GET, handler as POST }
```

### Client-seitige Einrichtung

```typescript
// trpc/client.ts
import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@/server/routers/_app'

export const trpc = createTRPCReact<AppRouter>()

// app/providers.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import { trpc } from '@/trpc/client'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: '/api/trpc', transformer: superjson })],
    })
  )
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}
```

### Verwendung in React-Komponenten

```tsx
'use client'
import { trpc } from '@/trpc/client'

function UserProfile({ userId }: { userId: string }) {
  // Abfrage — typsicher, automatischer Abruf, React Query darunter
  const { data: user, isLoading, error } = trpc.user.getById.useQuery({ id: userId })

  // Mutation
  const updateMutation = trpc.user.update.useMutation({
    onSuccess: () => {
      trpc.useUtils().user.getById.invalidate({ id: userId })
    },
  })

  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => updateMutation.mutate({ name: 'New Name' })}>
        {updateMutation.isPending ? 'Saving...' : 'Update'}
      </button>
    </div>
  )
}
```

### Server-seitige Aufrufe (Server Components / Server Actions)

```typescript
// In Server Components — Prozeduren direkt ohne HTTP aufrufen
import { createCaller } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/trpc'

export default async function Page() {
  const ctx = await createTRPCContext({ headers: new Headers() })
  const caller = createCaller(ctx)
  const user = await caller.user.getById({ id: '123' })
  return <div>{user.name}</div>
}
```

## Beispiel

**Benutzer:** Einen `tasks`-Router zu einer T3-App hinzufügen — erstellen, auflisten (paginiert), abschließen, löschen — mit erforderlicher Authentifizierung, Zod-Validierung und einer React-Komponente, die alle vier Prozeduren verwendet.

**Erwartetes Ergebnis:**
- `server/routers/task.ts` — 4 Prozeduren, alle mit `protectedProcedure`
- `server/routers/_app.ts` — aktualisiert mit `task: taskRouter`
- `components/TaskList.tsx` — `useQuery` für Liste, `useMutation` für erstellen/abschließen/löschen, optimistische Updates bei `onMutate`

---
