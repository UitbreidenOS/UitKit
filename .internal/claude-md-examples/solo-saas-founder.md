# CLAUDE.md — Solo SaaS Founder (Annotated Example)
> Solo founder moving fast across every layer of the stack — shows how to calibrate Claude for high velocity, minimal ceremony, and a pragmatic bias toward shipping over perfection.

<!-- ANNOTATION: The opening paragraph establishes the operating philosophy. A solo founder has different tradeoffs than a team: speed over process, pragmatism over purity. This framing licenses Claude to skip ceremony (no lengthy PR descriptions, no RFC docs) that would slow a solo operator down. -->
This is a solo founder project. I am the only engineer, designer, and operator. Optimize for speed and correctness over process. Skip ceremony: no PR templates, no RFC documents, no architecture review. If something works and is reasonably maintainable, it is good enough. Ask only when genuinely blocked.

## Stack

- Next.js 14 App Router (TypeScript, Tailwind, shadcn/ui)
- Supabase (Postgres + Auth + Storage + Edge Functions)
- Stripe (subscriptions + one-time payments)
- Resend (transactional email)
- Vercel (hosting + cron jobs)
- Linear (issues — reference ticket numbers in commits)

## My Velocity Rules

<!-- ANNOTATION: These rules are the explicit calibration for a solo operator. Claude's default behavior tilts toward thoroughness — this file tilts it back toward velocity. Each rule removes a default behavior that would slow a solo founder down. -->
- Default to writing code, not asking for clarification — make a reasonable assumption and note it
- Write the simplest implementation that solves the problem
- Do not add abstractions, layers, or patterns I didn't ask for
- Do not add tests unless I ask — I will add them when the feature stabilizes
- Do not refactor surrounding code when fixing a bug — fix only the bug

## Current Focus

<!-- ANNOTATION: "Current focus" is a dynamic section the founder updates. It tells Claude where to direct energy and prevents it from optimizing the wrong part of the product. -->
This week I'm focused on: onboarding flow and reducing time-to-value for new signups. Anything that doesn't serve that focus can wait.

## Tech Debt I Know About (Don't Re-Explain)

<!-- ANNOTATION: This is a powerful pattern for solo founders. Claude will sometimes point out known issues. Listing acknowledged tech debt prevents it from lecturing about things the founder already knows and has consciously deferred. -->
- The `app/api/webhooks/` handlers are not idempotent yet — known, will fix before scaling
- No proper error boundaries on some dashboard pages — known
- The email templates are hardcoded strings in route handlers — known, will move to Resend templates
- Test coverage is ~0% — known and intentional for now

## What "Done" Means

<!-- ANNOTATION: "Done" criteria for a solo founder are different from a team. Claude should not treat missing tests or missing documentation as blockers unless this file says they are. -->
A feature is done when:
1. It works for the happy path
2. It doesn't break existing features
3. The UI looks reasonable on mobile and desktop
4. I've manually tested it once

It does not need tests, documentation, or a code review to be "done".

## Conventions I Actually Use

- File naming: `kebab-case` everywhere
- DB functions: prefix with the domain (`user_`, `billing_`, `content_`)
- One Supabase server client per route handler — no singleton
- Environment variables in `.env.local` — never committed
- Commits: `feat: description` or `fix: description` — no ceremony beyond that

## Shortcuts I Endorse

<!-- ANNOTATION: Explicitly listing acceptable shortcuts is rare but valuable. It gives Claude permission to use patterns a strict team would reject, while keeping the list bounded so it doesn't use ALL shortcuts. -->
These shortcuts are intentional and fine for now:
- `// TODO:` comments instead of Linear tickets for small items
- Supabase `anon` client in Server Components when RLS covers it
- Hardcoded copy in JSX — I'll extract it when I add i18n
- `console.log` left in dev code — stripped by Vercel in production

## Things I Do Care About

<!-- ANNOTATION: This section is the counterbalance. Even a fast-moving solo founder has non-negotiables. Listing them tells Claude where to be thorough even when the general guidance says to go fast. -->
- Security: no exposed secrets, no SQL injection, no XSS
- Stripe webhooks must verify signatures — always
- Supabase RLS policies must be correct — always
- No breaking changes to the public API without a migration path

## What Not To Do

- Do not suggest adding a test suite, CI pipeline, or code review process unless I ask
- Do not refactor working code during a bug fix
- Do not add error handling for impossible cases
- Do not write jsdoc comments on obvious functions
- Do not suggest infrastructure changes (Docker, k8s, separate services) — Vercel + Supabase is the stack
