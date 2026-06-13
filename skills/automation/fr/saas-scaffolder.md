---
name: saas-scaffolder
description: "Échafaudage de projet SaaS : générer une base de code SaaS complète et prête pour la production à partir d'une description — Next.js, authentification, base de données, paiements, email et déploiement configurés"
---

# SaaS Scaffolder Skill

## Quand activer
- Démarrer un nouveau produit SaaS à partir de zéro
- Besoin d'un starter prêt pour la production avec authentification, facturation et email intégrés
- Vouloir ignorer le code passe-partout et commencer avec une infrastructure fonctionnelle
- Construire une preuve de concept qui doit être commercialisable

## Quand ne PAS utiliser
- Ajouter une fonctionnalité à une base de code existante — utiliser la compétence appropriée directement
- Projets non-SaaS (sites statiques, applications mobiles, outils CLI) — utiliser la compétence appropriée
- Quand vous avez besoin d'un contrôle fin sur chaque choix de dépendance dès le départ

## Instructions

### Échafaudage SaaS complet

```
Échafauder une application SaaS complète.

Product: [nom et description en une ligne]
Stack preferences:
  - Framework: [Next.js 15 App Router (par défaut) / autre]
  - Auth: [Better Auth (par défaut) / Clerk / NextAuth]
  - Database: [PostgreSQL + Drizzle (par défaut) / Prisma / MongoDB]
  - Hosting DB: [Neon (par défaut) / Supabase / PlanetScale]
  - Payments: [Stripe (par défaut) / Paddle / none]
  - Email: [Resend (par défaut) / SendGrid / none]
  - Styling: [Tailwind + shadcn/ui (par défaut)]
  - Deploy: [Railway (par défaut) / Vercel / Fly.io]

Générer:
1. Structure de répertoire complète
2. Tous les fichiers de configuration (next.config.ts, drizzle.config.ts, etc.)
3. Schéma de base de données pour [entités principales]
4. Configuration de l'authentification avec Google + email/mot de passe
5. Abonnement Stripe avec [plans décrits]
6. Toutes les variables .env requises documentées
7. Commandes de configuration de première exécution

Output as: file tree + key file contents
```

### Pile technologique par défaut (recommandée pour la vitesse)

```
Le chemin le plus rapide de zéro à commercialisable:

Framework: Next.js 15 (App Router + Server Actions)
  Why: full-stack, no separate API, Vercel AI SDK built-in

Auth: Better Auth
  Why: open source, no vendor lock-in, built-in Drizzle adapter

Database: PostgreSQL via Drizzle ORM + Neon
  Why: serverless postgres with branching, TypeScript-first ORM

Payments: Stripe
  Why: best docs, webhook reliability, subscription management

Email: Resend + React Email
  Why: best developer experience, React components for templates

UI: Tailwind CSS + shadcn/ui
  Why: accessible components Claude can read and modify

Deploy: Railway
  Why: git push deploys, managed database, PR previews

Pile complète générée en une commande:
npx create-t3-app@latest  # T3 stack (Next.js + Drizzle + tRPC)
# Then add Better Auth, Stripe, Resend on top
```

### Configuration d'abonnements Stripe

```
Configurer la facturation par abonnement Stripe pour [plans].

Plans: [p.ex. Starter $19/mo, Pro $49/mo, Enterprise $199/mo]

Fichiers à générer:
1. lib/stripe.ts — Client Stripe + ID de produit/prix
2. app/api/webhooks/stripe/route.ts — gestionnaire de webhook
3. db/schema.ts additions — table d'abonnements
4. app/(auth)/billing/page.tsx — page de gestion de facturation
5. lib/subscription.ts — fonctions d'aide

// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 1900,  // cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: ['Up to 5 projects', '10,000 API calls/month'],
  },
  pro: {
    name: 'Pro',
    price: 4900,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: ['Unlimited projects', '100,000 API calls/month', 'Priority support'],
  },
} as const

// app/api/webhooks/stripe/route.ts
import { NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }
  
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      await db.update(users)
        .set({
          stripeCustomerId: session.customer as string,
          stripePriceId: session.metadata?.priceId,
          stripeCurrentPeriodEnd: new Date(
            (await stripe.subscriptions.retrieve(session.subscription as string))
              .current_period_end * 1000
          ),
        })
        .where(eq(users.id, session.metadata!.userId))
      break
    }
    case 'invoice.payment_failed': {
      // Handle payment failure — restrict access
      break
    }
  }
  
  return new Response(null, { status: 200 })
}

Générer la configuration Stripe pour mes plans spécifiques.
```

### Variables d'environnement

```
Générer le .env.example complet pour [stack].

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/myapp_dev
DATABASE_URL_DIRECT=postgresql://user:password@localhost:5432/myapp_dev

# Auth (Better Auth)
BETTER_AUTH_SECRET=generate-with-openssl-rand-hex-32
BETTER_AUTH_URL=http://localhost:3000

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (Resend)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@yourdomain.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Exemple

**User:** Échafauder un outil SaaS pour le suivi des factures. Les utilisateurs se connectent avec Google, ont un niveau gratuit (5 factures) et un niveau payant ($19/mo, illimité). Envoyer un email quand une facture est payée.

**Claude's scaffold output:**

```
Directory structure:
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── billing/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   └── invoices/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── api/
│   │   ├── auth/[...all]/route.ts    ← Better Auth handler
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   └── layout.tsx
├── db/
│   └── schema.ts                     ← users, invoices, subscriptions tables
├── lib/
│   ├── auth.ts                        ← Better Auth config
│   ├── db.ts                          ← Drizzle client
│   ├── stripe.ts                      ← Stripe client + plan config
│   └── email.ts                       ← Resend client
├── emails/
│   └── InvoicePaidEmail.tsx           ← React Email template
├── drizzle.config.ts
├── .env.example
└── package.json
```

Commandes clés pour commencer:
```bash
npm install
cp .env.example .env    # remplir les valeurs
npx drizzle-kit migrate # exécuter la migration initiale
npm run dev             # démarrer à localhost:3000
```

---
