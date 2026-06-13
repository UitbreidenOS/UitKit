---
name: better-auth
description: "Better Auth: le framework d'authentification open-source pour Next.js/TypeScript — gestion de session, OAuth, 2FA, RBAC, adaptateurs Drizzle/Prisma, sans dépendance fournisseur"
---

> 🇫🇷 Version française. [English version](../better-auth.md).

# Compétence Better Auth

## Quand l'activer
- Configurer l'authentification dans un projet Next.js ou TypeScript depuis zéro
- Ajouter des fournisseurs OAuth (Google, GitHub, etc.) à une application existante
- Implémenter l'authentification 2FA, TOTP, ou par lien magique
- Configurer le contrôle d'accès basé sur les rôles (RBAC) ou l'auth par organisation/équipe
- Migrer depuis Clerk, Auth0 ou NextAuth en raison de coûts ou de dépendances fournisseur
- Intégrer l'auth avec Drizzle ORM ou Prisma

## Quand NE PAS utiliser
- Projets déjà sur NextAuth v5/Auth.js avec une auth fonctionnelle — le coût de migration est élevé
- Quand vous avez seulement besoin d'un simple token JWT et rien d'autre — trop complexe
- Projets non-TypeScript — Better Auth est TypeScript-first

## Pourquoi Better Auth pour la génération par IA

L'auth est le domaine n°1 où les LLMs hallucinent dangereusement — mauvais paramètres de cookie, en-têtes CSRF manquants, flux de redirection OAuth cassés. Le système de plugins modulaires de Better Auth permet à Claude d'injecter des blocs de configuration pré-testés pour 2FA, RBAC et OAuth sans générer de logique cryptographique depuis zéro. La recherche confirme : « une seule faille logique entraîne des violations de données catastrophiques. »

## Instructions

### Installation

```bash
npm install better-auth
```

### Configuration de la base de données (Drizzle)

```typescript
// db/auth-schema.ts — généré par la CLI Better Auth
// Exécuter : npx better-auth generate  (génère automatiquement ce fichier)
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

### Configuration de l'auth (serveur)

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
    twoFactor(),          // support 2FA/TOTP
    organization(),       // organisations multi-tenant
    admin(),              // panneau admin + gestion des utilisateurs
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7,  // 7 jours
    updateAge: 60 * 60 * 24,       // rafraîchir la session quotidiennement
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,              // mettre en cache la session pendant 5 minutes
    },
  },

  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
```

### Gestionnaire de route (Next.js App Router)

```typescript
// app/api/auth/[...all]/route.ts
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

export const { POST, GET } = toNextJsHandler(auth)
```

### Configuration du client

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

### Utilisation dans les composants

```tsx
'use client'
import { authClient } from '@/lib/auth-client'

// Connexion avec email/mot de passe
await authClient.signIn.email({ email, password })

// Connexion avec OAuth
await authClient.signIn.social({ provider: 'google' })

// Inscription
await authClient.signUp.email({ email, password, name })

// Déconnexion
await authClient.signOut()

// Obtenir la session (hook)
function ProfileButton() {
  const { data: session, isPending } = authClient.useSession()
  if (isPending) return <Spinner />
  if (!session) return <Link href="/login">Se connecter</Link>
  return <span>{session.user.name}</span>
}
```

### Accès à la session côté serveur

```typescript
// Dans les Server Components et Server Actions
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

// Server Component
export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return <div>Bienvenue {session.user.name}</div>
}

// Server Action
async function updateProfile(formData: FormData) {
  'use server'
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Non autorisé')
  // ...
}
```

### Middleware — protection des routes

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

### Authentification à deux facteurs (2FA)

```typescript
// Activer la 2FA pour un utilisateur
await authClient.twoFactor.enable({ password: currentPassword })

// Obtenir l'URI TOTP (pour le QR code)
const { data } = await authClient.twoFactor.getTotpUri({ password })

// Vérifier le code TOTP
await authClient.twoFactor.verifyTotp({ code: '123456' })

// Se connecter avec la 2FA
const result = await authClient.signIn.email({ email, password })
if (result.data?.twoFactorRedirect) {
  // Demander le code TOTP
  await authClient.twoFactor.verifyTotp({ code })
}
```

### Organisations (multi-tenant)

```typescript
// Créer une organisation
await authClient.organization.create({ name: 'Acme Corp', slug: 'acme' })

// Inviter un membre
await authClient.organization.inviteMember({
  email: 'colleague@acme.com',
  role: 'member',        // 'owner' | 'admin' | 'member'
  organizationId: org.id,
})

// Obtenir l'organisation active
const { data: activeOrg } = await authClient.organization.getActiveMember()

// Côté serveur : obtenir l'organisation depuis la session
const session = await auth.api.getSession({ headers: await headers() })
const orgId = session?.session.activeOrganizationId
```

### Commandes CLI

```bash
# Générer le schéma de base de données (crée auth-schema.ts)
npx better-auth generate

# Migrer la base de données (applique les tables auth)
npx better-auth migrate

# Ouvrir le tableau de bord admin (développement uniquement)
npx better-auth admin
```

## Exemple

**Utilisateur :** Ajouter Better Auth à un projet Next.js + Drizzle + Neon avec Google OAuth, email/mot de passe, vérification d'email, et protéger les routes `/dashboard`.

**Résultat attendu :**
- `db/auth-schema.ts` — tables user/session/account/verification générées
- `lib/auth.ts` — configuration `betterAuth()` avec `drizzleAdapter`, `emailAndPassword`, fournisseur social Google, vérification d'email
- `lib/auth-client.ts` — `createAuthClient()` avec URL de base
- `app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)`
- `middleware.ts` — vérification `getSessionCookie` sur `/dashboard/:path*`
- `app/login/page.tsx` — formulaire de connexion avec `authClient.signIn.email` + bouton Google

---
