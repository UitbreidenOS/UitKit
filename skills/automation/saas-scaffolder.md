---
name: saas-scaffolder
description: "SaaS project scaffolder: generate a complete production-ready SaaS codebase from a description — Next.js, auth, database, payments, email, and deployment configured"
updated: 2026-06-13
---

# SaaS Scaffolder Skill

## When to activate
- Starting a new SaaS product from scratch
- Need a production-ready starter with auth, billing, and email wired up
- Want to skip boilerplate and start with working infrastructure
- Building a proof-of-concept that needs to be shippable

## When NOT to use
- Adding a feature to an existing codebase — use the relevant skill directly
- Non-SaaS projects (static sites, mobile apps, CLI tools) — use the appropriate skill
- When you need fine-grained control over every dependency choice from the start

## Instructions

### Full SaaS scaffold

```
Scaffold a complete SaaS application.

Product: [name and one-line description]
Stack preferences:
  - Framework: [Next.js 15 App Router (default) / other]
  - Auth: [Better Auth (default) / Clerk / NextAuth]
  - Database: [PostgreSQL + Drizzle (default) / Prisma / MongoDB]
  - Hosting DB: [Neon (default) / Supabase / PlanetScale]
  - Payments: [Stripe (default) / Paddle / none]
  - Email: [Resend (default) / SendGrid / none]
  - Styling: [Tailwind + shadcn/ui (default)]
  - Deploy: [Railway (default) / Vercel / Fly.io]

Generate:
1. Complete directory structure
2. All configuration files (next.config.ts, drizzle.config.ts, etc.)
3. Database schema for [core entities]
4. Auth setup with Google + email/password
5. Stripe subscription with [plans described]
6. All required .env variables documented
7. First-run setup commands

Output as: file tree + key file contents
```

### Default tech stack (recommended for speed)

```
The fastest path from zero to shippable:

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

Full stack generated in one command:
npx create-t3-app@latest  # T3 stack (Next.js + Drizzle + tRPC)
# Then add Better Auth, Stripe, Resend on top
```

### Stripe subscriptions setup

```
Set up Stripe subscription billing for [plans].

Plans: [e.g. Starter $19/mo, Pro $49/mo, Enterprise $199/mo]

Files to generate:
1. lib/stripe.ts — Stripe client + product/price IDs
2. app/api/webhooks/stripe/route.ts — webhook handler
3. db/schema.ts additions — subscriptions table
4. app/(auth)/billing/page.tsx — billing management page
5. lib/subscription.ts — helper functions

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

Generate Stripe setup for my specific plans.
```

### Environment variables

```
Generate the complete .env.example for [stack].

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

## Example

**User:** Scaffold a SaaS tool for invoice tracking. Users sign in with Google, have a free tier (5 invoices) and a paid tier ($19/mo, unlimited). Send email when invoice is paid.

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

Key commands to get started:
```bash
npm install
cp .env.example .env    # fill in values
npx drizzle-kit migrate # run initial migration
npm run dev             # start at localhost:3000
```

---
