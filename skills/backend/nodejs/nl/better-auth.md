---
name: better-auth
description: "Better Auth: het open-source auth-framework voor Next.js/TypeScript — sessiebeheer, OAuth, 2FA, RBAC, Drizzle/Prisma-adapters, geen vendor lock-in"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../better-auth.md).

# Better Auth Skill

## Wanneer activeren
- Authenticatie instellen in een Next.js- of TypeScript-project vanaf nul
- OAuth-providers (Google, GitHub, etc.) toevoegen aan een bestaande app
- 2FA, TOTP of magic link-authenticatie implementeren
- Rolgebaseerde toegangscontrole (RBAC) of organisatie-/teamauth instellen
- Migreren van Clerk, Auth0 of NextAuth vanwege kosten of vendor lock-in
- Auth integreren met Drizzle ORM of Prisma

## Wanneer NIET gebruiken
- Projecten die al draaien op NextAuth v5/Auth.js met werkende auth — migratiekosten zijn hoog
- Wanneer u alleen een eenvoudig JWT-token nodig heeft en niets anders — te zwaar
- Niet-TypeScript-projecten — Better Auth is TypeScript-first

## Waarom Better Auth voor AI-generatie

Auth is het #1-gebied waar LLMs gevaarlijk hallucineren — onjuiste cookie-instellingen, ontbrekende CSRF-headers, kapotte OAuth-redirectflows. Het modulaire pluginsysteem van Better Auth stelt Claude in staat om vooraf geteste configuratieblokken voor 2FA, RBAC en OAuth te injecteren zonder cryptografische logica van scratch te genereren. Onderzoek bevestigt: "één logische fout leidt tot catastrofale datalekken."

## Instructies

### Installatie

```bash
npm install better-auth
```

### Database-instelling (Drizzle)

```typescript
// db/auth-schema.ts — gegenereerd door Better Auth CLI
// Uitvoeren: npx better-auth generate  (genereert dit automatisch)
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

### Auth-configuratie (server)

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
    twoFactor(),          // 2FA/TOTP-ondersteuning
    organization(),       // multi-tenant organisaties
    admin(),              // admin-paneel + gebruikersbeheer
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 dagen
    updateAge: 60 * 60 * 24,       // sessie dagelijks vernieuwen
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,              // sessie 5 minuten cachen
    },
  },

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
```

### Route handler (Next.js App Router)

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)
```

### Clientinstelling

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

### Gebruik in componenten

```tsx
'use client'
import { authClient } from '@/lib/auth-client'

// Inloggen met e-mail/wachtwoord
await authClient.signIn.email({ email, password })

// Inloggen met OAuth
await authClient.signIn.social({ provider: 'google' })

// Registreren
await authClient.signUp.email({ email, password, name })

// Uitloggen
await authClient.signOut()

// Sessie ophalen (hook)
function ProfileButton() {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <Spinner />
  if (!session) return <Link href="/login">Inloggen</Link>
  return <span>{session.user.name}</span>
}
```

### Serversijdige sessietoegang

```typescript
// In Server Components en Server Actions
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Server Component
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return <div>Welkom {session.user.name}</div>
}

// Server Action
async function updateProfile(formData: FormData) {
  'use server'
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Niet geautoriseerd')
  // ...
}
```

### Middleware — routebeveiliging

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

### Twee-factorauthenticatie (2FA)

```typescript
// 2FA inschakelen voor een gebruiker
await authClient.twoFactor.enable({ password: currentPassword })

// TOTP URI ophalen (voor QR-code)
const { data } = await authClient.twoFactor.getTotpUri({ password })

// TOTP-code verifiëren
await authClient.twoFactor.verifyTotp({ code: '123456' })

// Inloggen met 2FA
const result = await authClient.signIn.email({ email, password })
if (result.data?.twoFactorRedirect) {
  // TOTP-code opvragen
  await authClient.twoFactor.verifyTotp({ code })
}
```

### Organisaties (multi-tenant)

```typescript
// Een organisatie aanmaken
await authClient.organization.create({ name: 'Acme Corp', slug: 'acme' })

// Een lid uitnodigen
await authClient.organization.inviteMember({
  email: 'colleague@acme.com',
  role: 'member',        // 'owner' | 'admin' | 'member'
  organizationId: org.id,
})

// Actieve organisatie ophalen
const { data: activeOrg } = await authClient.organization.getActiveMember()

// Serversijds: organisatie uit sessie ophalen
const session = await auth.api.getSession({ headers: await headers() })
const orgId = session?.session.activeOrganizationId
```

### CLI-opdrachten

```bash
# Databaseschema genereren (maakt auth-schema.ts aan)
npx better-auth generate

# Database migreren (past auth-tabellen toe)
npx better-auth migrate

# Admin-dashboard openen (alleen ontwikkeling)
npx better-auth admin
```

## Voorbeeld

**Gebruiker:** Better Auth toevoegen aan een Next.js + Drizzle + Neon project met Google OAuth, e-mail/wachtwoord, e-mailverificatie, en `/dashboard`-routes beveiligen.

**Verwachte uitvoer:**
- `db/auth-schema.ts` — gegenereerde user/session/account/verification tabellen
- `lib/auth.ts` — `betterAuth()`-configuratie met `drizzleAdapter`, `emailAndPassword`, Google social provider, e-mailverificatie
- `lib/auth-client.ts` — `createAuthClient()` met basis-URL
- `app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)`
- `middleware.ts` — `getSessionCookie`-controle op `/dashboard/:path*`
- `app/login/page.tsx` — aanmeldingsformulier met `authClient.signIn.email` + Google-knop

---
