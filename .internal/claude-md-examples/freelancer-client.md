# CLAUDE.md — Freelancer Client Projects (Annotated Example)
> Isolation-first template for a freelancer who context-switches between multiple client codebases daily.

<!-- ANNOTATION: Opening lines establish identity immediately. A freelancer's biggest CLAUDE.md
     problem is context bleed — Claude must know whose codebase it is in, what stack, and
     what billing/delivery constraints apply before it touches anything. Be blunt here. -->
# CLAUDE.md — Client: Meridian Logistics / Project: Route Optimizer API

This repository belongs to **Meridian Logistics** (client engagement, started 2024-03).
All code here is client property. Do not reference patterns, credentials, or business logic
from other client projects when assisting in this repo.

Freelancer contact: tushar@example.dev
Client contact: ops@meridianlogistics.example

---

<!-- ANNOTATION: Stack section is critical for a freelancer template. Claude must not
     suggest tools the client has not approved or that would add unlicensed dependencies.
     Pin versions where the client has locked them — freelancers rarely control CI. -->
## Stack & Tools

- **Runtime:** Node.js 20 (LTS) — do not suggest upgrading without client approval
- **Framework:** Fastify 4.x (not Express — the client explicitly chose Fastify for perf)
- **Database:** PostgreSQL 15 via `pg` driver; migrations managed by `node-pg-migrate`
- **Auth:** JWT (RS256) issued by client's existing SSO — no third-party auth libraries
- **Infra:** AWS ECS Fargate; deploys triggered by GitHub Actions (`.github/workflows/`)
- **Testing:** Vitest; coverage threshold 80% enforced in CI
- **Linting:** ESLint flat config (`eslint.config.mjs`); Prettier via `@biomejs/biome`
- **Package manager:** `pnpm` — never use `npm install` or `yarn` in this repo

Do not introduce new dependencies without a line in `CHANGELOG.md` and client sign-off.

---

<!-- ANNOTATION: Key conventions section replaces the need to re-explain project standards
     on every task. For freelancers this is especially important — you are often the only
     one who knows why a convention exists, so document the reason, not just the rule. -->
## Key Conventions

### File layout
```
src/
  routes/       # One file per resource (e.g. routes/shipments.js)
  services/     # Business logic — routes must not query the DB directly
  db/
    migrations/ # node-pg-migrate files, timestamped
    queries/    # Named SQL query files imported by services
  middleware/   # Auth, error handler, rate-limit
  config.js     # Single config entry-point — reads from env only
```

### Route handlers
- Return raw data objects; let the reply serializer handle JSON shaping.
- Always validate input with Fastify's built-in JSON Schema (`schema.body`, `schema.params`).
- Never throw inside a handler — use `reply.code(x).send({ error: ... })` or a custom
  `AppError` class from `src/errors.js`.

### Database access
- All queries live in `src/db/queries/`. Services import named query functions.
- Use parameterised queries everywhere — no string interpolation into SQL, ever.
- Transactions must use the `withTransaction(client, async (tx) => { ... })` helper.

### Commits
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:` prefixes required.
- Scope optional but encouraged: `fix(shipments): handle null ETA gracefully`.
- Never commit directly to `main` — open a PR even for trivial fixes (client policy).

### Environment variables
- All env vars are documented in `.env.example` — keep it current.
- Never hardcode values; never commit a `.env` file.
- Secrets live in AWS Secrets Manager; local dev uses a `.env` file (gitignored).

---

<!-- ANNOTATION: Freelancers often have delivery-aware constraints that a full-time employee
     would not bother writing down. Billing cycles, handoff windows, and client-specific
     processes belong here so Claude does not suggest work that falls outside scope. -->
## Delivery & Billing Context

- Engagement is **time-and-materials**, billed weekly.
- Scope changes require a change order — do not implement features outside the active sprint
  ticket without flagging them first.
- Sprint tickets live in Linear (workspace: `meridian`). Reference ticket IDs in PRs.
- The client has a **Monday morning deploy window** (09:00–11:00 UTC). Do not merge to main
  outside this window unless the issue is a production incident (P0).
- Handoff documentation goes in `docs/handoff/` — update it when closing a sprint.

---

<!-- ANNOTATION: What-not-to-do is the most skipped section in CLAUDE.md files and the
     most valuable for a freelancer. List things Claude might plausibly try that would
     violate client trust, break CI, or create scope creep. Be specific, not generic. -->
## What Not to Do

- Do not refactor code outside the files touched by the current task unless asked.
- Do not upgrade locked dependency versions (`pg`, `fastify`, `node-pg-migrate`) — the
  client's infra team manages those upgrades on their own schedule.
- Do not add logging beyond what is already in `src/middleware/logger.js` — the client
  ships logs to a third-party SIEM and extra log lines require their security review.
- Do not suggest Docker Compose changes — local dev setup is the client's ops team concern.
- Do not create `.claude/` directories or commit any Claude Code config into this repo.
- Do not read or reference files from sibling client directories on the local filesystem.
- Do not open browser tabs or make outbound HTTP requests to external services during
  development sessions — client network policy applies even in dev.

---

<!-- ANNOTATION: This section is unusual for a CLAUDE.md but essential for freelancers:
     explicit trust boundaries. Claude must know it operates as an extension of the
     freelancer, not as an autonomous agent with client-level authority. -->
## Trust & Authority Boundaries

Claude is assisting **the freelancer** (tushar), not the client directly. This means:

- Propose solutions; do not approve them on the client's behalf.
- If a task requires a decision the client must make (architecture change, data deletion,
  cost-affecting infra change), stop and surface it — do not proceed autonomously.
- The client has not granted Claude any production access. All prod commands must be run
  by a human after review.
- When generating code that touches PII (shipment addresses, driver data), add a comment
  flagging the data sensitivity so the freelancer can review before committing.

---

<!-- ANNOTATION: Unusual project-specific choice: explicit multi-client isolation reminder.
     This would not appear in a single-company codebase but is the defining feature of
     a freelancer template. It guards against cross-contamination when Claude has context
     from another session or repo open nearby. -->
## Multi-Client Isolation (Freelancer-Specific)

This is one of several client repositories on this machine. When working here:

- Draw on knowledge of this repo only. Other client codebases are confidential to their
  respective owners and must not be referenced, compared, or cited.
- If a pattern from another project seems relevant, describe it in general terms without
  naming the source client or project.
- If Claude Code's context window contains files from another client repo (e.g., via an
  accidental `/add`), flag it immediately rather than silently continuing.

---

## Quick Reference

| Task | Command |
|---|---|
| Start dev server | `pnpm dev` |
| Run tests | `pnpm test` |
| Run tests with coverage | `pnpm test:coverage` |
| Lint | `pnpm lint` |
| Create migration | `pnpm migrate:create <name>` |
| Apply migrations (local) | `pnpm migrate:up` |
