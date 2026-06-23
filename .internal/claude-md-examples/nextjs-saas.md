# CLAUDE.md — Next.js 14 SaaS (Annotated Example)
> Monorepo with App Router, Supabase auth/DB, Stripe billing, and a separate marketing site — shows how to scope Claude's behavior across multiple apps in one repo.

<!-- ANNOTATION: The opening sentence names the exact stack versions. Claude uses this to pick the right APIs, patterns, and imports automatically. "Next.js 14 App Router" immediately rules out Pages Router patterns. -->
This is a Next.js 14 App Router monorepo. The stack is: Next.js 14 (App Router only — no Pages Router), Supabase (auth + Postgres), Stripe (billing), Tailwind CSS, shadcn/ui, TypeScript strict mode, Turborepo for build orchestration.

<!-- ANNOTATION: Naming the monorepo layout up front means Claude won't propose wrong import paths or run commands from the wrong working directory. -->
## Repository Layout

```
apps/
  web/          # Main SaaS app — Next.js 14
  marketing/    # Marketing site — Next.js 14 (static export)
packages/
  ui/           # shadcn/ui component library
  db/           # Supabase client + generated types
  stripe/       # Stripe helpers and webhook handlers
  config/       # Shared ESLint, TypeScript, Tailwind configs
```

<!-- ANNOTATION: Telling Claude which app is "primary" prevents it from accidentally editing marketing/ when the user says "the app". Explicit > implicit for directory context. -->
## Primary App

When the user says "the app" or "the dashboard", they mean `apps/web/`. Marketing site changes will be explicitly prefixed with "marketing".

## Commands

<!-- ANNOTATION: Always list the exact dev/build/test commands. Claude will suggest these to the user and use them in verification steps. Without this, it falls back to npm which may be wrong. -->
```bash
# From repo root
pnpm dev              # Runs all apps via Turborepo
pnpm dev --filter web # Runs only the SaaS app
pnpm build            # Full production build
pnpm test             # Vitest across all packages
pnpm lint             # ESLint across all packages
pnpm typecheck        # tsc --noEmit across all packages
```

## TypeScript Rules

<!-- ANNOTATION: "strict mode + no any" is a constraint Claude must respect. Without stating it, Claude may reach for `any` when types are complex. The "write the type or ask" rule gives Claude a clear fallback behavior. -->
- TypeScript strict mode is on everywhere
- No `any` — write the type or ask the user to clarify
- All Supabase query results must be typed via the generated types in `packages/db/types.ts`
- Zod schemas live in `lib/validations/` and are the single source of truth for form + API validation

## Next.js App Router Conventions

<!-- ANNOTATION: App Router has sharp edges — server vs client components, data fetching patterns, route handlers vs server actions. Spelling these out prevents Claude from using outdated Pages Router patterns or mixing server/client incorrectly. -->
- Default to Server Components. Add `"use client"` only when state, effects, or browser APIs are needed
- Data fetching happens in Server Components or Server Actions — never in `useEffect`
- Route handlers (`app/api/`) are for webhooks and third-party callbacks only. Business logic uses Server Actions
- `app/` layouts are `async` by default; do not make root layout a Client Component
- Metadata is set via `export const metadata` or `generateMetadata()`, never via `<Head>`

## Supabase Patterns

<!-- ANNOTATION: Supabase has two client types (browser vs server) and RLS policies that must be respected. Claude needs to know which client to reach for in which context, and that bypassing RLS is a security issue, not a convenience. -->
- Use `createServerClient` (from `@supabase/ssr`) in Server Components and Route Handlers
- Use `createBrowserClient` in Client Components
- Never use the service role key client-side — it bypasses RLS
- RLS policies are the authorization layer. Do not add application-level permission checks that duplicate RLS
- All schema migrations live in `supabase/migrations/` — never edit the DB directly

## Stripe Integration

<!-- ANNOTATION: Stripe webhook handling has a specific security requirement (signature verification). Noting this prevents Claude from writing a webhook handler that skips the check. -->
- Stripe webhook handler is at `apps/web/app/api/webhooks/stripe/route.ts`
- Always verify the webhook signature with `stripe.webhooks.constructEvent()` before processing
- Subscription state is synced to Supabase via webhooks — do not read it directly from Stripe in hot paths
- Price IDs are in `packages/stripe/prices.ts` — never hardcode them inline

## Styling

- Tailwind CSS only — no CSS Modules, no styled-components
- Component variants use `cva` from `class-variance-authority`
- shadcn/ui components are in `packages/ui/components/` — extend, don't re-implement

## Testing

<!-- ANNOTATION: Specifying test scope per layer prevents Claude from writing e2e tests for a pure utility function or unit tests for an integration point. -->
- Unit tests: Vitest — pure functions, utilities, validation schemas
- Integration tests: Vitest + Supabase local — server actions, DB queries
- E2e tests: Playwright — critical flows only (signup, checkout, core feature)
- Do not mock Supabase in integration tests — use the local Supabase instance

## Environment Variables

<!-- ANNOTATION: Listing which vars are public vs private prevents the critical mistake of exposing the service role key to the browser. Claude will respect this split. -->
- `NEXT_PUBLIC_*` vars are safe for the browser
- `SUPABASE_SERVICE_ROLE_KEY` is server-only — never reference it in Client Components
- `.env.local` is gitignored. `.env.example` is the reference — keep it updated

## What Not To Do

<!-- ANNOTATION: The "what not to do" section is where hard-won lessons live. Each item here represents a real failure mode. Naming them explicitly gives Claude a checklist of anti-patterns to avoid, not just a description of the happy path. -->
- Do not use `getServerSideProps` or `getStaticProps` — this is App Router only
- Do not use the Supabase service role key in any client-side code
- Do not call `stripe.customers.retrieve()` in a Server Component render path — cache or use synced DB data
- Do not add a new shadcn component to `apps/web/` — it belongs in `packages/ui/`
- Do not bypass TypeScript errors with `// @ts-ignore` — fix the type
- Do not commit `.env.local` or any file containing secrets
