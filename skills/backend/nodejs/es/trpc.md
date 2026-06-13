---
name: trpc
description: "tRPC end-to-end type-safe APIs: T3 Stack setup, routers, procedures, Zod validation, React Query integration, middleware, subscriptions"
---

> 🇪🇸 Versión en español. [Versión en inglés](../trpc.md).

# Habilidad tRPC

## Cuándo activar
- Construir el T3 Stack (Next.js + tRPC + Drizzle/Prisma + TypeScript)
- Querer seguridad de tipos de extremo a extremo entre su frontend y backend de Next.js sin REST ni GraphQL
- Escribir procedimientos de API con seguridad de tipos con validación de entrada Zod
- Configurar tRPC con React Query para la obtención de datos en React
- Agregar middleware (auth, limitación de velocidad, registro) a los procedimientos tRPC

## Cuándo NO usar
- APIs consumidas por clientes no-TypeScript (aplicaciones móviles, terceros) — usar REST en su lugar
- APIs públicas — tRPC está diseñado para TypeScript full-stack en la misma base de código
- Cuando se necesita la flexibilidad de GraphQL — usar la habilidad GraphQL

## Instrucciones

### Instalación (T3 Stack)

```bash
# Crear una aplicación T3 Stack completa
npx create-t3-app@latest my-app

# O agregar tRPC a Next.js existente
npm install @trpc/server @trpc/client @trpc/react-query @tanstack/react-query zod
```

### Estructura del proyecto

```
src/
├── server/
│   ├── trpc.ts          # instancia tRPC, contexto, middleware
│   ├── routers/
│   │   ├── _app.ts      # Router raíz (combina todos los routers)
│   │   ├── user.ts      # Procedimientos de usuario
│   │   └── post.ts      # Procedimientos de publicación
├── app/
│   └── api/
│       └── trpc/
│           └── [trpc]/
│               └── route.ts   # Controlador App Router de Next.js
└── trpc/
    └── client.ts        # Configuración tRPC del lado del cliente
```

### Configuración de la instancia tRPC

```typescript
// server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server'
import { getServerSession } from 'next-auth'
import type { Session } from 'next-auth'
import superjson from 'superjson'
import { ZodError } from 'zod'
import { db } from '@/db'

// Contexto — disponible para todos los procedimientos
export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await getServerSession()
  return { db, session, headers: opts.headers }
}

type Context = Awaited<ReturnType<typeof createTRPCContext>>

const t = initTRPC.context<Context>().create({
  transformer: superjson,  // maneja la serialización de Date, Map, Set
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

// Procedimientos base
export const router = t.router
export const publicProcedure = t.procedure

// Procedimiento protegido — requiere autenticación
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, session: ctx.session } })
})
export const protectedProcedure = t.procedure.use(isAuthed)

// Procedimiento con limitación de velocidad
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

### Definición de procedimientos (consultas y mutaciones)

```typescript
// server/routers/user.ts
import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { TRPCError } from '@trpc/server'

export const userRouter = router({
  // Consulta — equivalente a GET
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

  // Consulta — lista con paginación
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

  // Mutación — equivalente a POST/PUT
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

  // Mutación — eliminar
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

### Router raíz

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

### Controlador App Router de Next.js

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

### Configuración del lado del cliente

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

### Uso en componentes React

```tsx
'use client'
import { trpc } from '@/trpc/client'

function UserProfile({ userId }: { userId: string }) {
  // Consulta — con seguridad de tipos, se obtiene automáticamente, React Query por debajo
  const { data: user, isLoading, error } = trpc.user.getById.useQuery({ id: userId })

  // Mutación
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

### Llamadas del lado del servidor (Server Components / Server Actions)

```typescript
// En Server Components — llamar procedimientos directamente sin HTTP
import { createCaller } from '@/server/routers/_app'
import { createTRPCContext } from '@/server/trpc'

export default async function Page() {
  const ctx = await createTRPCContext({ headers: new Headers() })
  const caller = createCaller(ctx)
  const user = await caller.user.getById({ id: '123' })
  return <div>{user.name}</div>
}
```

## Ejemplo

**Usuario:** Agregar un router `tasks` a una aplicación T3 — crear, listar (paginado), completar, eliminar — con autenticación requerida, validación Zod, y un componente React que use los cuatro procedimientos.

**Resultado esperado:**
- `server/routers/task.ts` — 4 procedimientos, todos usando `protectedProcedure`
- `server/routers/_app.ts` — actualizado para incluir `task: taskRouter`
- `components/TaskList.tsx` — `useQuery` para lista, `useMutation` para crear/completar/eliminar, actualizaciones optimistas en `onMutate`

---
