---
name: better-auth
description: "Better Auth: das Open-Source-Auth-Framework für Next.js/TypeScript — Session-Management, OAuth, 2FA, RBAC, Drizzle/Prisma-Adapter, keine Anbieter-Bindung"
---

> 🇩🇪 Deutsche Version. [Englische Version](../better-auth.md).

# Better Auth Skill

## Wann aktivieren
- Authentifizierung in einem Next.js- oder TypeScript-Projekt von Grund auf einrichten
- OAuth-Anbieter (Google, GitHub, etc.) zu einer bestehenden App hinzufügen
- 2FA, TOTP oder Magic-Link-Authentifizierung implementieren
- Rollenbasierte Zugriffskontrolle (RBAC) oder Organisations-/Team-Auth einrichten
- Von Clerk, Auth0 oder NextAuth aufgrund von Kosten oder Anbieter-Bindung migrieren
- Auth mit Drizzle ORM oder Prisma integrieren

## Wann NICHT verwenden
- Projekte, die bereits NextAuth v5/Auth.js mit funktionierender Auth haben — Migrationskosten sind hoch
- Wenn nur ein einfaches JWT-Token benötigt wird und nichts anderes — überdimensioniert
- Nicht-TypeScript-Projekte — Better Auth ist TypeScript-first

## Warum Better Auth für KI-Generierung

Auth ist der Bereich Nr. 1, in dem LLMs gefährlich halluzinieren — falsche Cookie-Einstellungen, fehlende CSRF-Header, fehlerhafte OAuth-Redirect-Flows. Das modulare Plugin-System von Better Auth ermöglicht es Claude, vorgefertigte Konfigurationsblöcke für 2FA, RBAC und OAuth einzufügen, ohne kryptografische Logik von Grund auf zu generieren. Die Forschung bestätigt: „Ein einziger Logikfehler führt zu katastrophalen Datenschutzverletzungen."

## Anweisungen

### Installation

```bash
npm install better-auth
```

### Datenbank-Setup (Drizzle)

```typescript
// db/auth-schema.ts — generiert durch Better Auth CLI
// Ausführen: npx better-auth generate  (generiert dies automatisch)
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

### Auth-Konfiguration (Server)

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
    twoFactor(),          // 2FA/TOTP-Unterstützung
    organization(),       // Multi-Tenant-Organisationen
    admin(),              // Admin-Panel + Benutzerverwaltung
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 Tage
    updateAge: 60 * 60 * 24,       // Session täglich erneuern
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,              // Session für 5 Minuten cachen
    },
  },

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
```

### Route Handler (Next.js App Router)

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)
```

### Client-Setup

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

### Verwendung in Komponenten

```tsx
'use client'
import { authClient } from '@/lib/auth-client'

// Anmelden mit E-Mail/Passwort
await authClient.signIn.email({ email, password })

// Anmelden mit OAuth
await authClient.signIn.social({ provider: 'google' })

// Registrieren
await authClient.signUp.email({ email, password, name })

// Abmelden
await authClient.signOut()

// Session abrufen (Hook)
function ProfileButton() {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <Spinner />
  if (!session) return <Link href="/login">Anmelden</Link>
  return <span>{session.user.name}</span>
}
```

### Server-seitiger Session-Zugriff

```typescript
// In Server Components und Server Actions
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Server Component
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return <div>Willkommen {session.user.name}</div>
}

// Server Action
async function updateProfile(formData: FormData) {
  'use server'
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Nicht autorisiert')
  // ...
}
```

### Middleware — Routenschutz

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

### Zwei-Faktor-Authentifizierung (2FA)

```typescript
// 2FA für einen Benutzer aktivieren
await authClient.twoFactor.enable({ password: currentPassword })

// TOTP-URI abrufen (für QR-Code)
const { data } = await authClient.twoFactor.getTotpUri({ password })

// TOTP-Code verifizieren
await authClient.twoFactor.verifyTotp({ code: '123456' })

// Mit 2FA anmelden
const result = await authClient.signIn.email({ email, password })
if (result.data?.twoFactorRedirect) {
  // TOTP-Code abfragen
  await authClient.twoFactor.verifyTotp({ code })
}
```

### Organisationen (Multi-Tenant)

```typescript
// Eine Organisation erstellen
await authClient.organization.create({ name: 'Acme Corp', slug: 'acme' })

// Ein Mitglied einladen
await authClient.organization.inviteMember({
  email: 'colleague@acme.com',
  role: 'member',        // 'owner' | 'admin' | 'member'
  organizationId: org.id,
})

// Aktive Organisation abrufen
const { data: activeOrg } = await authClient.organization.getActiveMember()

// Server-seitig: Organisation aus Session abrufen
const session = await auth.api.getSession({ headers: await headers() })
const orgId = session?.session.activeOrganizationId
```

### CLI-Befehle

```bash
# Datenbankschema generieren (erstellt auth-schema.ts)
npx better-auth generate

# Datenbank migrieren (wendet Auth-Tabellen an)
npx better-auth migrate

# Admin-Dashboard öffnen (nur Entwicklung)
npx better-auth admin
```

## Beispiel

**Benutzer:** Better Auth zu einem Next.js + Drizzle + Neon Projekt hinzufügen mit Google OAuth, E-Mail/Passwort, E-Mail-Verifizierung und Schutz der `/dashboard`-Routen.

**Erwartete Ausgabe:**
- `db/auth-schema.ts` — generierte user/session/account/verification Tabellen
- `lib/auth.ts` — `betterAuth()`-Konfiguration mit `drizzleAdapter`, `emailAndPassword`, Google Social Provider, E-Mail-Verifizierung
- `lib/auth-client.ts` — `createAuthClient()` mit Basis-URL
- `app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)`
- `middleware.ts` — `getSessionCookie`-Prüfung auf `/dashboard/:path*`
- `app/login/page.tsx` — Anmeldeformular mit `authClient.signIn.email` + Google-Button

---
