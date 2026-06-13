---
name: better-auth
description: "Better Auth: el framework de autenticación open-source para Next.js/TypeScript — gestión de sesiones, OAuth, 2FA, RBAC, adaptadores Drizzle/Prisma, sin dependencia de proveedor"
---

> 🇪🇸 Versión en español. [Versión en inglés](../better-auth.md).

# Skill Better Auth

## Cuándo activar
- Configurar autenticación en un proyecto Next.js o TypeScript desde cero
- Agregar proveedores OAuth (Google, GitHub, etc.) a una aplicación existente
- Implementar autenticación 2FA, TOTP o por enlace mágico
- Configurar control de acceso basado en roles (RBAC) o auth por organización/equipo
- Migrar desde Clerk, Auth0 o NextAuth por costos o dependencia del proveedor
- Integrar auth con Drizzle ORM o Prisma

## Cuándo NO usar
- Proyectos que ya usan NextAuth v5/Auth.js con auth funcionando — el costo de migración es alto
- Cuando solo se necesita un token JWT simple y nada más — demasiado complejo
- Proyectos que no usan TypeScript — Better Auth es TypeScript-first

## Por qué Better Auth para generación por IA

La auth es el área #1 donde los LLMs alucinan peligrosamente — configuraciones de cookie incorrectas, cabeceras CSRF faltantes, flujos de redirección OAuth rotos. El sistema de plugins modulares de Better Auth permite a Claude inyectar bloques de configuración pre-probados para 2FA, RBAC y OAuth sin generar lógica criptográfica desde cero. La investigación confirma: "un solo error lógico resulta en brechas de datos catastróficas."

## Instrucciones

### Instalación

```bash
npm install better-auth
```

### Configuración de la base de datos (Drizzle)

```typescript
// db/auth-schema.ts — generado por la CLI de Better Auth
// Ejecutar: npx better-auth generate  (genera esto automáticamente)
import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id:            text('id').primaryKey(),
  name:          text('name').notNull(),
  email:         text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image:         text('image'),
  createdAt:     timestamp('created_at').notNull(),
  updatedAt:     timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
  id:             text('id').primaryKey(),
  expiresAt:      timestamp('expires_at').notNull(),
  token:          text('token').notNull().unique(),
  ipAddress:      text('ip_address'),
  userAgent:      text('user_agent'),
  userId:         text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt:      timestamp('created_at').notNull(),
  updatedAt:      timestamp('updated_at').notNull(),
})

export const account = pgTable('account', {
  id:                   text('id').primaryKey(),
  accountId:            text('account_id').notNull(),
  providerId:           text('provider_id').notNull(),
  userId:               text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken:          text('access_token'),
  refreshToken:         text('refresh_token'),
  idToken:              text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  scope:                text('scope'),
  password:             text('password'),
  createdAt:            timestamp('created_at').notNull(),
  updatedAt:            timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id:         text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value:      text('value').notNull(),
  expiresAt:  timestamp('expires_at').notNull(),
  createdAt:  timestamp('created_at'),
  updatedAt:  timestamp('updated_at'),
})
```

### Configuración de auth (servidor)

```typescript
// lib/auth.ts
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { twoFactor, organization, admin } from 'better-auth/plugins'
import { db } from '@/db'
import * as schema from '@/db/auth-schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [
    twoFactor(),          // soporte 2FA/TOTP
    organization(),       // organizaciones multi-tenant
    admin(),              // panel de admin + gestión de usuarios
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 días
    updateAge: 60 * 60 * 24,       // renovar sesión diariamente
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,              // cachear sesión por 5 minutos
    },
  },

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
```

### Manejador de ruta (Next.js App Router)

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)
```

### Configuración del cliente

```typescript
// lib/auth-client.ts
import { createAuthClient } from 'better-auth/react'
import { twoFactorClient, organizationClient, adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    twoFactorClient(),
    organizationClient(),
    adminClient(),
  ],
})

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} = authClient
```

### Uso en componentes

```tsx
'use client'
import { authClient } from '@/lib/auth-client'

// Iniciar sesión con email/contraseña
await authClient.signIn.email({ email, password })

// Iniciar sesión con OAuth
await authClient.signIn.social({ provider: 'google' })

// Registrarse
await authClient.signUp.email({ email, password, name })

// Cerrar sesión
await authClient.signOut()

// Obtener sesión (hook)
function ProfileButton() {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <Spinner />
  if (!session) return <Link href="/login">Iniciar sesión</Link>
  return <span>{session.user.name}</span>
}
```

### Acceso a la sesión del lado del servidor

```typescript
// En Server Components y Server Actions
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Server Component
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return <div>Bienvenido {session.user.name}</div>
}

// Server Action
async function updateProfile(formData: FormData) {
  'use server'
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('No autorizado')
  // ...
}
```

### Middleware — protección de rutas

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)

  if (!sessionCookie && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

### Autenticación de dos factores (2FA)

```typescript
// Habilitar 2FA para un usuario
await authClient.twoFactor.enable({ password: currentPassword })

// Obtener URI TOTP (para código QR)
const { data } = await authClient.twoFactor.getTotpUri({ password })

// Verificar código TOTP
await authClient.twoFactor.verifyTotp({ code: '123456' })

// Iniciar sesión con 2FA
const result = await authClient.signIn.email({ email, password })
if (result.data?.twoFactorRedirect) {
  // Solicitar código TOTP
  await authClient.twoFactor.verifyTotp({ code })
}
```

### Organizaciones (multi-tenant)

```typescript
// Crear una organización
await authClient.organization.create({ name: 'Acme Corp', slug: 'acme' })

// Invitar a un miembro
await authClient.organization.inviteMember({
  email: 'colleague@acme.com',
  role: 'member',        // 'owner' | 'admin' | 'member'
  organizationId: org.id,
})

// Obtener la organización activa
const { data: activeOrg } = await authClient.organization.getActiveMember()

// Del lado del servidor: obtener organización desde la sesión
const session = await auth.api.getSession({ headers: await headers() })
const orgId = session?.session.activeOrganizationId
```

### Comandos CLI

```bash
# Generar esquema de base de datos (crea auth-schema.ts)
npx better-auth generate

# Migrar base de datos (aplica tablas de auth)
npx better-auth migrate

# Abrir panel de administración (solo desarrollo)
npx better-auth admin
```

## Ejemplo

**Usuario:** Agregar Better Auth a un proyecto Next.js + Drizzle + Neon con Google OAuth, email/contraseña, verificación de email, y proteger las rutas `/dashboard`.

**Resultado esperado:**
- `db/auth-schema.ts` — tablas user/session/account/verification generadas
- `lib/auth.ts` — configuración `betterAuth()` con `drizzleAdapter`, `emailAndPassword`, proveedor social de Google, verificación de email
- `lib/auth-client.ts` — `createAuthClient()` con URL base
- `app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)`
- `middleware.ts` — verificación `getSessionCookie` en `/dashboard/:path*`
- `app/login/page.tsx` — formulario de inicio de sesión con `authClient.signIn.email` + botón de Google

---
