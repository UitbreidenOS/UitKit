# SaaS Web App — Projectstructuur

> Voor een full-stack SaaS engineering team dat features levert op een Next.js 14 + Supabase + Stripe monorepo, geoptimaliseerd voor een spec-naar-productie workflow.

## Stack

- **Framework:** Next.js 14 (App Router, Server Components, Server Actions)
- **Taal:** TypeScript 5.4+
- **Monorepo:** Turborepo 2.x met pnpm workspaces
- **Pakketbeheerder:** pnpm 9+
- **Auth + Database:** Supabase (PostgreSQL 15, GoTrue auth, Row Level Security)
- **ORM:** Drizzle ORM 0.30+ met `drizzle-kit` voor migraties
- **Facturering:** Stripe 14+ (Abonnementen, Customer Portal, webhooks)
- **Deployment:** Vercel (web app), Supabase Cloud (database + auth)
- **Styling:** Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives)
- **Email:** React Email + Resend
- **Unit testen:** Vitest 1.x
- **E2E testen:** Playwright 1.44+
- **CI/CD:** GitHub Actions (`ci.yml`, `preview.yml`, `release.yml`)
- **Lokale Supabase:** Docker Compose (supabase/docker)

## Mappenstructuur

```
saas-web-app/                             # Turborepo monorepo root
├── .claude/
│   ├── CLAUDE.md                         # Repo-level instructions for Claude Code
│   ├── settings.json                     # MCP servers, hooks, permissions
│   └── commands/
│       ├── new-feature.md                # /new-feature — spec → UI → route → migration → test
│       ├── add-migration.md              # /add-migration — Drizzle schema change + SQL migration
│       ├── stripe-webhook.md             # /stripe-webhook — scaffold new Stripe event handler
│       ├── rls-policy.md                 # /rls-policy — generate RLS policy for new table
│       └── env-audit.md                  # /env-audit — diff .env.example against actual envs
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Typecheck, lint, unit tests on every PR
│       ├── preview.yml                   # Vercel preview deploy + Playwright smoke tests
│       └── release.yml                   # Production deploy triggered by semver tag
├── apps/
│   └── web/                              # Next.js 14 application
│       ├── app/                          # App Router root
│       │   ├── (auth)/                   # Route group — no persistent shell layout
│       │   │   ├── login/
│       │   │   │   └── page.tsx          # Login page with Supabase magic link / OAuth
│       │   │   ├── signup/
│       │   │   │   └── page.tsx
│       │   │   └── callback/
│       │   │       └── route.ts          # Supabase auth callback handler
│       │   ├── (app)/                    # Route group — authenticated app shell
│       │   │   ├── layout.tsx            # Sidebar + top nav shell, reads session server-side
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx
│       │   │   ├── settings/
│       │   │   │   ├── page.tsx          # User profile settings
│       │   │   │   └── billing/
│       │   │   │       └── page.tsx      # Stripe Customer Portal redirect
│       │   │   └── [feature]/            # Feature-specific route — add new features here
│       │   │       ├── page.tsx
│       │   │       └── actions.ts        # Server Actions for this feature
│       │   ├── api/
│       │   │   ├── webhooks/
│       │   │   │   └── stripe/
│       │   │   │       └── route.ts      # Stripe webhook receiver (raw body, signature verify)
│       │   │   └── health/
│       │   │       └── route.ts          # Uptime check — returns 200 + DB ping
│       │   ├── layout.tsx                # Root layout: fonts, ThemeProvider, Toaster
│       │   └── globals.css               # Tailwind directives + CSS custom properties
│       ├── components/
│       │   ├── ui/                       # shadcn/ui generated components (do not edit manually)
│       │   │   ├── button.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── form.tsx
│       │   │   └── table.tsx
│       │   ├── features/                 # Feature-specific composite components
│       │   │   └── billing/
│       │   │       ├── PricingTable.tsx
│       │   │       └── SubscriptionBadge.tsx
│       │   └── layout/
│       │       ├── Sidebar.tsx
│       │       └── TopNav.tsx
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts             # Browser Supabase client (singleton)
│       │   │   ├── server.ts             # Server Supabase client (cookies-based)
│       │   │   └── middleware.ts         # Re-export for middleware.ts import
│       │   ├── stripe/
│       │   │   ├── client.ts             # Stripe SDK instance
│       │   │   ├── plans.ts              # Plan IDs, price IDs by environment
│       │   │   └── webhooks.ts           # constructEvent + typed event handlers
│       │   ├── db/
│       │   │   └── index.ts              # Drizzle db instance (re-export from packages/database)
│       │   └── utils.ts                  # cn(), formatCurrency(), absoluteUrl()
│       ├── middleware.ts                  # Auth guard: protects (app) routes, refreshes session
│       ├── next.config.ts                # Image domains, env validation, redirects
│       ├── tailwind.config.ts            # Extends shared Tailwind config
│       ├── tsconfig.json                 # Extends root tsconfig, path aliases (@/)
│       └── package.json
├── packages/
│   ├── database/                         # Drizzle schema, migrations, seed
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts              # users table — mirrors auth.users via trigger
│   │   │   │   ├── subscriptions.ts      # Stripe subscription state per user/org
│   │   │   │   ├── organizations.ts      # Org model for multi-tenant features
│   │   │   │   └── index.ts              # Re-exports all schema tables
│   │   │   ├── db.ts                     # Drizzle instance: postgres() + drizzle(schema)
│   │   │   └── index.ts                  # Public package entry point
│   │   ├── migrations/
│   │   │   ├── 0001_create_users.sql
│   │   │   ├── 0002_create_subscriptions.sql
│   │   │   └── meta/
│   │   │       └── _journal.json         # Drizzle migration journal (do not edit manually)
│   │   ├── drizzle.config.ts             # DB URL from env, out: ./migrations, schema: ./src/schema
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── emails/                           # React Email templates
│   │   ├── src/
│   │   │   ├── WelcomeEmail.tsx          # Sent on signup
│   │   │   ├── TrialEndingEmail.tsx      # Sent 7 days before trial expires
│   │   │   └── InvoicePaidEmail.tsx      # Sent on Stripe invoice.payment_succeeded
│   │   ├── emails/                       # Dev preview directory (react-email dev)
│   │   └── package.json
│   └── ui/                              # Shared React component library
│       ├── src/
│       │   ├── components/
│       │   │   └── Logo.tsx
│       │   └── index.ts
│       ├── tailwind.config.ts            # Base Tailwind config — extended by apps
│       └── package.json
├── supabase/                             # Supabase project config
│   ├── migrations/                       # Supabase SQL migrations (auth triggers, RLS policies)
│   │   ├── 20240101000000_init.sql       # Initial schema bootstrap
│   │   └── 20240215000000_rls_policies.sql
│   ├── seed.sql                          # Local dev seed: test users, plans, orgs
│   └── config.toml                       # Supabase CLI project config (project_id, ports)
├── docker-compose.yml                    # Local Supabase stack: db, studio, inbucket, auth
├── turbo.json                            # Pipeline: build, dev, test, lint — caching config
├── .env.example                          # All required env vars documented with descriptions
├── .env.local                            # Local dev overrides (gitignored)
├── pnpm-workspace.yaml                   # Workspace globs: apps/*, packages/*
├── tsconfig.json                         # Root tsconfig: strict, path aliases, composite
└── package.json                          # Root: devDependencies, turbo, scripts
```

## Belangrijkste bestanden uitgelegd

| Pad | Doel |
|---|---|
| `apps/web/middleware.ts` | Supabase session refresh + route protection using `createServerClient`; redirects unauthenticated users from `(app)` routes to `/login` |
| `packages/database/drizzle.config.ts` | Tells `drizzle-kit` where to find the schema and where to write migrations; database URL must be `DATABASE_URL` (direct connection, not pooler) |
| `apps/web/api/webhooks/stripe/route.ts` | Verifies Stripe signature with `stripe.webhooks.constructEvent`, dispatches to typed handler functions per event type, returns 200 fast |
| `packages/database/migrations/meta/_journal.json` | Drizzle's internal migration ledger — never edit by hand; always use `pnpm db:generate` to create new migrations |
| `turbo.json` | Defines task graph: `build` depends on `^build`; `dev` has no cache; `test` runs after `build`; enables remote caching for CI |
| `supabase/config.toml` | Supabase CLI config for local stack: port assignments, auth providers enabled, SMTP redirect to Inbucket |
| `.env.example` | Single source of truth for all environment variables — every new env var must be added here with a comment before merging |
| `.github/workflows/ci.yml` | Runs `pnpm turbo typecheck lint test` in parallel via Turborepo pipeline; posts failing checks as PR annotations |

## Snelle opzet

```bash
# Vereisten: Node 20+, pnpm 9+, Docker Desktop running

# Create monorepo with Turborepo
npx create-turbo@latest saas-web-app --package-manager pnpm
cd saas-web-app

# Add Next.js app
pnpm dlx create-next-app@14 apps/web \
  --typescript --tailwind --app --no-src-dir \
  --import-alias "@/*" --no-git

# Add shared packages
mkdir -p packages/database/src/schema packages/database/migrations/meta
mkdir -p packages/emails/src packages/emails/emails
mkdir -p packages/ui/src/components

# Install Drizzle in database package
pnpm --filter @repo/database add drizzle-orm postgres
pnpm --filter @repo/database add -D drizzle-kit

# Install Supabase in web app
pnpm --filter web add @supabase/supabase-js @supabase/ssr

# Install Stripe in web app
pnpm --filter web add stripe @stripe/stripe-js

# Install React Email + Resend in emails package
pnpm --filter @repo/emails add react-email @react-email/components resend

# Install shadcn/ui in web app
pnpm dlx shadcn-ui@latest init --cwd apps/web
pnpm dlx shadcn-ui@latest add button dialog form table --cwd apps/web

# Install testing
pnpm --filter web add -D vitest @vitejs/plugin-react playwright @playwright/test

# Initialize Supabase local stack
pnpm add -D supabase --workspace-root
pnpm supabase init
pnpm supabase start   # starts Docker containers

# Create GitHub Actions workflows
mkdir -p .github/workflows
touch .github/workflows/ci.yml .github/workflows/preview.yml .github/workflows/release.yml

# Create Claude Code config
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-feature.md
touch .claude/commands/add-migration.md
touch .claude/commands/stripe-webhook.md
touch .claude/commands/rls-policy.md
touch .claude/commands/env-audit.md

# Create .env.example
touch .env.example .env.local

# Install Claudient skills
npx claudient add skill backend/nextjs-app-router
npx claudient add skill backend/drizzle-orm
npx claudient add skill backend/supabase-rls
npx claudient add skill backend/stripe-webhooks
npx claudient add skill frontend/shadcn-ui
npx claudient add skill testing/vitest
npx claudient add skill testing/playwright
npx claudient add skill devops-infra/cicd

echo "SaaS web app monorepo scaffolded. Run: pnpm dev"
```

## CLAUDE.md sjabloon

```markdown
# SaaS Web App

Full-stack SaaS product op een Turborepo monorepo. Next.js 14 App Router voor de frontend,
Supabase voor auth en PostgreSQL, Drizzle ORM voor schema management, Stripe voor facturering,
geïmplementeerd op Vercel. Alle wijzigingen moeten CI passeren voordat ze worden samengevoegd.

## Stack

- Next.js 14 (App Router, Server Components, Server Actions)
- TypeScript 5.4, pnpm 9, Turborepo 2
- Supabase (auth + PostgreSQL 15 with RLS)
- Drizzle ORM 0.30 + drizzle-kit (migrations)
- Stripe 14 (Subscriptions, webhooks, Customer Portal)
- Tailwind CSS 3.4 + shadcn/ui
- React Email + Resend
- Vitest (unit), Playwright (E2E)
- GitHub Actions CI/CD → Vercel

## Monorepo layout

- `apps/web/` — Next.js application; all user-facing code lives here
- `packages/database/` — Drizzle schema + migrations; shared by all apps
- `packages/emails/` — React Email templates; rendered and sent via Resend
- `packages/ui/` — shared components (Logo, etc.); not shadcn/ui, those live in apps/web
- `supabase/` — SQL migrations for RLS policies and auth triggers; Supabase CLI config

## Nieuwe feature toevoegen — exacte stappen

1. Write a brief spec comment at the top of the relevant file or a `_SPEC.md` in the feature dir
2. Build the UI in `apps/web/app/(app)/[feature]/page.tsx`
3. Add Server Actions in `apps/web/app/(app)/[feature]/actions.ts`
4. Add or extend Drizzle schema in `packages/database/src/schema/`
5. Run `pnpm db:generate` to create the migration SQL, then `pnpm db:migrate`
6. Add RLS policies in `supabase/migrations/` if the table is user-scoped
7. Write unit tests with Vitest; add E2E test in `apps/web/e2e/` if user-facing
8. Use `/new-feature` slash command to scaffold boilerplate for steps 2–7

## Database migraties uitvoeren

```bash
# Generate migration from schema change
pnpm --filter @repo/database run db:generate

# Apply to local Supabase (Docker)
pnpm --filter @repo/database run db:migrate

# Push Supabase SQL migrations (RLS, triggers)
pnpm supabase db push

# Reset local DB and re-seed
pnpm supabase db reset
```

## Drizzle patronen

- Always import `db` from `@repo/database`, never instantiate directly in `apps/`
- Use `.returning()` on insert/update — Drizzle does not return rows by default
- Transactions: `db.transaction(async (tx) => { ... })` — pass `tx` to all nested calls
- Relations: define with `relations()` in the schema file, query with `db.query.*`
- Never run raw SQL from `apps/` — write a query function in `packages/database/src/`

## Stripe webhook handling

- Handler lives at `apps/web/app/api/webhooks/stripe/route.ts`
- Must read raw body: `await req.text()` — do not use `req.json()`
- Verify with `stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)`
- Each event type gets its own handler function; import from `lib/stripe/webhooks.ts`
- Return `{ received: true }` with status 200 immediately after verification
- Idempotency: check if event was already processed before writing to DB
- Use `/stripe-webhook` slash command to scaffold a new event handler

## Omgevingsvariabelen per omgeving

| Variabele | Lokaal | Preview | Productie |
|---|---|---|---|
| `DATABASE_URL` | Docker Compose URL | Supabase branch DB | Supabase main DB |
| `NEXT_PUBLIC_SUPABASE_URL` | http://localhost:54321 | Preview project URL | Production project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Local anon key | Preview anon key | Production anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Local service role | Preview service role | Production service role |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | CLI local listener secret | Vercel webhook secret | Vercel webhook secret |
| `RESEND_API_KEY` | Test key or skip | Test key | Production key |

All env vars must be in `.env.example` with a description comment before merging.

## Auth conventies

- `middleware.ts` at `apps/web/` handles session refresh and route protection
- Server components: use `createServerClient` from `@supabase/ssr` with cookie store
- Client components: use `createBrowserClient` from `@supabase/ssr`
- Never access `supabase.auth.getUser()` in a client component for protected data
- RLS is the final security layer — always write policies for new tables

## Wat niet te doen

- Do not import from `packages/database` inside `packages/ui` or `packages/emails`
- Do not use `drizzle-kit push` in production — always generate migrations
- Do not call Stripe API directly from client components — use Server Actions
- Do not commit `.env.local` or any file containing real API keys
- Do not edit `packages/database/migrations/meta/_journal.json` by hand
```

## MCP servers

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/saas-web-app"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres:postgres@localhost:54322/postgres"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

## Aanbevolen hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.tsx || \"$f\" == *.ts ]]; then npx prettier --write \"$f\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */schema/*.ts && \"$f\" == */packages/database/* ]]; then echo \"[HOOK] Schema changed — remember to run: pnpm --filter @repo/database run db:generate\" >&2; fi'"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"db:migrate\"; then echo \"[HOOK] Running migration — ensure local Supabase is running: pnpm supabase status\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills om te installeren

```bash
npx claudient add skill backend/nextjs-app-router
npx claudient add skill backend/drizzle-orm
npx claudient add skill backend/supabase-rls
npx claudient add skill backend/stripe-webhooks
npx claudient add skill frontend/shadcn-ui
npx claudient add skill frontend/react-email
npx claudient add skill testing/vitest
npx claudient add skill testing/playwright
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel
```

## Verwante

- [Full-Stack Next.js Guide](../guides/nextjs-app-router.md)
- [Stripe Integration Workflow](../workflows/stripe-billing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
