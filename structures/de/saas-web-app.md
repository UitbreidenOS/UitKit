# SaaS Web App — Projektstruktur

> Für ein vollständiges SaaS-Engineering-Team, das Features in einem Next.js 14 + Supabase + Stripe Monorepo ausliefert und den Spec-to-Production-Workflow optimiert.

## Stack

- **Framework:** Next.js 14 (App Router, Server Components, Server Actions)
- **Sprache:** TypeScript 5.4+
- **Monorepo:** Turborepo 2.x mit pnpm Workspaces
- **Paketmanager:** pnpm 9+
- **Auth + Datenbank:** Supabase (PostgreSQL 15, GoTrue Auth, Row Level Security)
- **ORM:** Drizzle ORM 0.30+ mit `drizzle-kit` für Migrationen
- **Billing:** Stripe 14+ (Subscriptions, Customer Portal, Webhooks)
- **Deployment:** Vercel (Web App), Supabase Cloud (Datenbank + Auth)
- **Styling:** Tailwind CSS 3.4 + shadcn/ui (Radix UI Primitives)
- **E-Mail:** React Email + Resend
- **Unit Testing:** Vitest 1.x
- **E2E Testing:** Playwright 1.44+
- **CI/CD:** GitHub Actions (`ci.yml`, `preview.yml`, `release.yml`)
- **Lokales Supabase:** Docker Compose (supabase/docker)

## Verzeichnisbaum

```
saas-web-app/                             # Turborepo Monorepo Root
├── .claude/
│   ├── CLAUDE.md                         # Repo-Level-Anweisungen für Claude Code
│   ├── settings.json                     # MCP Server, Hooks, Berechtigungen
│   └── commands/
│       ├── new-feature.md                # /new-feature — spec → UI → route → migration → test
│       ├── add-migration.md              # /add-migration — Drizzle Schema Änderung + SQL Migration
│       ├── stripe-webhook.md             # /stripe-webhook — scaffold neuen Stripe Event Handler
│       ├── rls-policy.md                 # /rls-policy — RLS Policy für neue Tabelle generieren
│       └── env-audit.md                  # /env-audit — .env.example gegen aktuelle Envs differn
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Typecheck, Lint, Unit Tests auf jedem PR
│       ├── preview.yml                   # Vercel Preview Deploy + Playwright Smoke Tests
│       └── release.yml                   # Production Deploy triggert durch Semver Tag
├── apps/
│   └── web/                              # Next.js 14 Anwendung
│       ├── app/                          # App Router Root
│       │   ├── (auth)/                   # Route Group — kein persistentes Shell Layout
│       │   │   ├── login/
│       │   │   │   └── page.tsx          # Login Seite mit Supabase Magic Link / OAuth
│       │   │   ├── signup/
│       │   │   │   └── page.tsx
│       │   │   └── callback/
│       │   │       └── route.ts          # Supabase Auth Callback Handler
│       │   ├── (app)/                    # Route Group — authentifizierte App Shell
│       │   │   ├── layout.tsx            # Sidebar + Top Nav Shell, liest Session Server-seitig
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx
│       │   │   ├── settings/
│       │   │   │   ├── page.tsx          # Benutzerprofileinstellungen
│       │   │   │   └── billing/
│       │   │   │       └── page.tsx      # Stripe Customer Portal Umleitung
│       │   │   └── [feature]/            # Feature-spezifische Route — neue Features hier hinzufügen
│       │   │       ├── page.tsx
│       │   │       └── actions.ts        # Server Actions für dieses Feature
│       │   ├── api/
│       │   │   ├── webhooks/
│       │   │   │   └── stripe/
│       │   │   │       └── route.ts      # Stripe Webhook Receiver (Raw Body, Signature Verify)
│       │   │   └── health/
│       │   │       └── route.ts          # Uptime Check — gibt 200 + DB Ping zurück
│       │   ├── layout.tsx                # Root Layout: Fonts, ThemeProvider, Toaster
│       │   └── globals.css               # Tailwind Direktiven + CSS Custom Properties
│       ├── components/
│       │   ├── ui/                       # shadcn/ui Generierte Komponenten (nicht manuell bearbeiten)
│       │   │   ├── button.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── form.tsx
│       │   │   └── table.tsx
│       │   ├── features/                 # Feature-spezifische zusammengesetzte Komponenten
│       │   │   └── billing/
│       │   │       ├── PricingTable.tsx
│       │   │       └── SubscriptionBadge.tsx
│       │   └── layout/
│       │       ├── Sidebar.tsx
│       │       └── TopNav.tsx
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts             # Browser Supabase Client (Singleton)
│       │   │   ├── server.ts             # Server Supabase Client (Cookies-basiert)
│       │   │   └── middleware.ts         # Re-export für Middleware.ts Import
│       │   ├── stripe/
│       │   │   ├── client.ts             # Stripe SDK Instanz
│       │   │   ├── plans.ts              # Plan IDs, Price IDs nach Environment
│       │   │   └── webhooks.ts           # constructEvent + Typisierte Event Handler
│       │   ├── db/
│       │   │   └── index.ts              # Drizzle DB Instanz (Re-export von packages/database)
│       │   └── utils.ts                  # cn(), formatCurrency(), absoluteUrl()
│       ├── middleware.ts                  # Auth Guard: schützt (app) Routes, erneuert Session
│       ├── next.config.ts                # Image Domains, Env Validierung, Redirects
│       ├── tailwind.config.ts            # Erweitert gemeinsame Tailwind Konfiguration
│       ├── tsconfig.json                 # Erweitert Root Tsconfig, Path Aliases (@/)
│       └── package.json
├── packages/
│   ├── database/                         # Drizzle Schema, Migrationen, Seed
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts              # Users Tabelle — spiegelt auth.users via Trigger
│   │   │   │   ├── subscriptions.ts      # Stripe Subscription State pro User/Org
│   │   │   │   ├── organizations.ts      # Org Modell für Multi-Tenant Features
│   │   │   │   └── index.ts              # Re-exports aller Schema Tabellen
│   │   │   ├── db.ts                     # Drizzle Instanz: postgres() + drizzle(schema)
│   │   │   └── index.ts                  # Öffentlicher Package Entry Point
│   │   ├── migrations/
│   │   │   ├── 0001_create_users.sql
│   │   │   ├── 0002_create_subscriptions.sql
│   │   │   └── meta/
│   │   │       └── _journal.json         # Drizzle Migration Journal (nicht manuell bearbeiten)
│   │   ├── drizzle.config.ts             # DB URL von Env, out: ./migrations, schema: ./src/schema
│   │   ├── tsconfig.json
│   │   └── package.json
│   ├── emails/                           # React Email Templates
│   │   ├── src/
│   │   │   ├── WelcomeEmail.tsx          # Gesendet bei Signup
│   │   │   ├── TrialEndingEmail.tsx      # Gesendet 7 Tage vor Trial Ablauf
│   │   │   └── InvoicePaidEmail.tsx      # Gesendet bei Stripe invoice.payment_succeeded
│   │   ├── emails/                       # Dev Preview Verzeichnis (react-email dev)
│   │   └── package.json
│   └── ui/                              # Gemeinsame React Component Bibliothek
│       ├── src/
│       │   ├── components/
│       │   │   └── Logo.tsx
│       │   └── index.ts
│       ├── tailwind.config.ts            # Base Tailwind Konfiguration — erweitert von Apps
│       └── package.json
├── supabase/                             # Supabase Projekt Konfiguration
│   ├── migrations/                       # Supabase SQL Migrationen (Auth Triggers, RLS Policies)
│   │   ├── 20240101000000_init.sql       # Initiales Schema Bootstrap
│   │   └── 20240215000000_rls_policies.sql
│   ├── seed.sql                          # Lokaler Dev Seed: Test User, Plans, Orgs
│   └── config.toml                       # Supabase CLI Projekt Konfiguration (project_id, ports)
├── docker-compose.yml                    # Lokaler Supabase Stack: DB, Studio, Inbucket, Auth
├── turbo.json                            # Pipeline: build, dev, test, lint — Caching Konfiguration
├── .env.example                          # Alle erforderlichen Env Vars dokumentiert mit Beschreibungen
├── .env.local                            # Lokale Dev Overrides (Gitignoriert)
├── pnpm-workspace.yaml                   # Workspace Globs: apps/*, packages/*
├── tsconfig.json                         # Root Tsconfig: Strict, Path Aliases, Composite
└── package.json                          # Root: devDependencies, Turbo, Scripts
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `apps/web/middleware.ts` | Supabase Session Refresh + Route Protection mit `createServerClient`; leitet nicht authentifizierte Benutzer von `(app)` Routes zu `/login` um |
| `packages/database/drizzle.config.ts` | Teilt `drizzle-kit` mit, wo das Schema zu finden ist und wo Migrationen geschrieben werden; Datenbank URL muss `DATABASE_URL` sein (direkte Verbindung, nicht Pooler) |
| `apps/web/api/webhooks/stripe/route.ts` | Verifiziert Stripe Signatur mit `stripe.webhooks.constructEvent`, dispatcht zu typisierten Handler Funktionen pro Event Typ, gibt 200 schnell zurück |
| `packages/database/migrations/meta/_journal.json` | Drizzles interne Migration Ledger — nie manuell bearbeiten; immer `pnpm db:generate` verwenden um neue Migrationen zu erstellen |
| `turbo.json` | Definiert Task Graph: `build` hängt von `^build` ab; `dev` hat kein Cache; `test` läuft nach `build`; ermöglicht Remote Caching für CI |
| `supabase/config.toml` | Supabase CLI Konfiguration für lokalen Stack: Port Zuweisungen, Auth Provider aktiviert, SMTP Umleitung zu Inbucket |
| `.env.example` | Einzige Quelle der Wahrheit für alle Umgebungsvariablen — jede neue Env Var muss hier mit Kommentar hinzugefügt werden bevor Merge erfolgt |
| `.github/workflows/ci.yml` | Führt `pnpm turbo typecheck lint test` parallel via Turborepo Pipeline aus; postet fehlgeschlagene Checks als PR Annotationen |

## Quick Scaffold

```bash
# Voraussetzungen: Node 20+, pnpm 9+, Docker Desktop läuft

# Monorepo mit Turborepo erstellen
npx create-turbo@latest saas-web-app --package-manager pnpm
cd saas-web-app

# Next.js App hinzufügen
pnpm dlx create-next-app@14 apps/web \
  --typescript --tailwind --app --no-src-dir \
  --import-alias "@/*" --no-git

# Shared Packages hinzufügen
mkdir -p packages/database/src/schema packages/database/migrations/meta
mkdir -p packages/emails/src packages/emails/emails
mkdir -p packages/ui/src/components

# Drizzle in Database Package installieren
pnpm --filter @repo/database add drizzle-orm postgres
pnpm --filter @repo/database add -D drizzle-kit

# Supabase in Web App installieren
pnpm --filter web add @supabase/supabase-js @supabase/ssr

# Stripe in Web App installieren
pnpm --filter web add stripe @stripe/stripe-js

# React Email + Resend in Emails Package installieren
pnpm --filter @repo/emails add react-email @react-email/components resend

# shadcn/ui in Web App installieren
pnpm dlx shadcn-ui@latest init --cwd apps/web
pnpm dlx shadcn-ui@latest add button dialog form table --cwd apps/web

# Testing installieren
pnpm --filter web add -D vitest @vitejs/plugin-react playwright @playwright/test

# Supabase Lokalen Stack initialisieren
pnpm add -D supabase --workspace-root
pnpm supabase init
pnpm supabase start   # startet Docker Container

# GitHub Actions Workflows erstellen
mkdir -p .github/workflows
touch .github/workflows/ci.yml .github/workflows/preview.yml .github/workflows/release.yml

# Claude Code Konfiguration erstellen
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-feature.md
touch .claude/commands/add-migration.md
touch .claude/commands/stripe-webhook.md
touch .claude/commands/rls-policy.md
touch .claude/commands/env-audit.md

# .env.example erstellen
touch .env.example .env.local

# Claudient Skills installieren
npx claudient add skill backend/nextjs-app-router
npx claudient add skill backend/drizzle-orm
npx claudient add skill backend/supabase-rls
npx claudient add skill backend/stripe-webhooks
npx claudient add skill frontend/shadcn-ui
npx claudient add skill testing/vitest
npx claudient add skill testing/playwright
npx claudient add skill devops-infra/cicd

echo "SaaS Web App Monorepo gerüstet. Ausführen: pnpm dev"
```

## CLAUDE.md Template

```markdown
# SaaS Web App

Full-Stack SaaS Produkt auf einem Turborepo Monorepo. Next.js 14 App Router für das Frontend,
Supabase für Auth und PostgreSQL, Drizzle ORM für Schema Management, Stripe für Billing,
bereitgestellt auf Vercel. Alle Änderungen müssen CI vor dem Merge passieren.

## Stack

- Next.js 14 (App Router, Server Components, Server Actions)
- TypeScript 5.4, pnpm 9, Turborepo 2
- Supabase (Auth + PostgreSQL 15 mit RLS)
- Drizzle ORM 0.30 + drizzle-kit (Migrationen)
- Stripe 14 (Subscriptions, Webhooks, Customer Portal)
- Tailwind CSS 3.4 + shadcn/ui
- React Email + Resend
- Vitest (Unit), Playwright (E2E)
- GitHub Actions CI/CD → Vercel

## Monorepo Layout

- `apps/web/` — Next.js Anwendung; aller benutzerseitiger Code lebt hier
- `packages/database/` — Drizzle Schema + Migrationen; geteilt von allen Apps
- `packages/emails/` — React Email Templates; gerenedert und gesendet via Resend
- `packages/ui/` — Gemeinsame Komponenten (Logo, etc.); nicht shadcn/ui, diese leben in apps/web
- `supabase/` — SQL Migrationen für RLS Policies und Auth Triggers; Supabase CLI Konfiguration

## Ein Neues Feature Hinzufügen — Exakte Schritte

1. Schreibe einen Kurz-Spec Kommentar am Anfang der relevanten Datei oder ein `_SPEC.md` im Feature Dir
2. Erstelle die UI in `apps/web/app/(app)/[feature]/page.tsx`
3. Füge Server Actions in `apps/web/app/(app)/[feature]/actions.ts` hinzu
4. Füge oder erweitere Drizzle Schema in `packages/database/src/schema/` hinzu
5. Führe `pnpm db:generate` aus um die Migration SQL zu erstellen, dann `pnpm db:migrate`
6. Füge RLS Policies in `supabase/migrations/` hinzu wenn die Tabelle User-scoped ist
7. Schreibe Unit Tests mit Vitest; füge E2E Test in `apps/web/e2e/` hinzu wenn benutzerseitig
8. Verwende `/new-feature` Slash Command um Boilerplate für Schritte 2–7 zu gerüsten

## Datenbank Migrationen Ausführen

```bash
# Migration aus Schema Änderung generieren
pnpm --filter @repo/database run db:generate

# Auf lokales Supabase (Docker) anwenden
pnpm --filter @repo/database run db:migrate

# Supabase SQL Migrationen pushen (RLS, Triggers)
pnpm supabase db push

# Lokale DB zurücksetzen und erneut seeden
pnpm supabase db reset
```

## Drizzle Muster

- Importiere immer `db` von `@repo/database`, nie direkt in `apps/` instanziiert
- Verwende `.returning()` auf Insert/Update — Drizzle gibt Zeilen nicht standardmäßig zurück
- Transaktionen: `db.transaction(async (tx) => { ... })` — übergebe `tx` allen verschachtelten Aufrufen
- Relationen: definiere mit `relations()` in der Schema Datei, Query mit `db.query.*`
- Führe niemals Raw SQL von `apps/` aus — schreibe eine Query Funktion in `packages/database/src/`

## Stripe Webhook Handling

- Handler lebt bei `apps/web/app/api/webhooks/stripe/route.ts`
- Muss Raw Body lesen: `await req.text()` — verwende nicht `req.json()`
- Verifiziere mit `stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)`
- Jeder Event Typ bekommt seine eigene Handler Funktion; Importieren von `lib/stripe/webhooks.ts`
- Gebe `{ received: true }` mit Status 200 sofort nach Verifikation zurück
- Idempotency: überprüfe ob Event bereits verarbeitet wurde bevor auf DB geschrieben wird
- Verwende `/stripe-webhook` Slash Command um einen neuen Event Handler zu gerüsten

## Umgebungsvariablen nach Environment

| Variable | Lokal | Preview | Production |
|---|---|---|---|
| `DATABASE_URL` | Docker Compose URL | Supabase Branch DB | Supabase Main DB |
| `NEXT_PUBLIC_SUPABASE_URL` | http://localhost:54321 | Preview Projekt URL | Production Projekt URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Lokaler Anon Key | Preview Anon Key | Production Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Lokaler Service Role | Preview Service Role | Production Service Role |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | CLI Lokaler Listener Secret | Vercel Webhook Secret | Vercel Webhook Secret |
| `RESEND_API_KEY` | Test Key oder Skip | Test Key | Production Key |

Alle Env Vars müssen in `.env.example` mit einem Beschreibungs-Kommentar sein bevor Merge erfolgt.

## Auth Konventionen

- `middleware.ts` bei `apps/web/` behandelt Session Refresh und Route Protection
- Server Komponenten: verwende `createServerClient` von `@supabase/ssr` mit Cookie Store
- Client Komponenten: verwende `createBrowserClient` von `@supabase/ssr`
- Greifen nie auf `supabase.auth.getUser()` in einer Client Komponente für geschützte Daten zu
- RLS ist die letzte Security Layer — schreibe immer Policies für neue Tabellen

## Was Nicht Zu Tun

- Importiere nicht von `packages/database` innerhalb `packages/ui` oder `packages/emails`
- Verwende nicht `drizzle-kit push` in Production — erzeuge immer Migrationen
- Rufe Stripe API nicht direkt von Client Komponenten auf — verwende Server Actions
- Committe nicht `.env.local` oder irgendeine Datei mit echten API Keys
- Bearbeite nicht `packages/database/migrations/meta/_journal.json` von Hand
```

## MCP Server

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

## Empfohlene Hooks

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
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */schema/*.ts && \"$f\" == */packages/database/* ]]; then echo \"[HOOK] Schema geändert — denke daran auszuführen: pnpm --filter @repo/database run db:generate\" >&2; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"db:migrate\"; then echo \"[HOOK] Migration läuft — stelle sicher dass lokales Supabase läuft: pnpm supabase status\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Skills zum Installieren

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

## Verwandt

- [Full-Stack Next.js Anleitung](../guides/nextjs-app-router.md)
- [Stripe Integration Workflow](../workflows/stripe-billing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
