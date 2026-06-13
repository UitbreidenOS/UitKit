---
name: spec-to-repo
description: "Spec to repo: turn a product specification, PRD, or feature description into a complete working repository with code, tests, CI, and documentation"
updated: 2026-06-13
---

# Spec to Repo Skill

## When to activate
- You have a clear spec or PRD and want Claude to build the full implementation
- Starting a greenfield project from a product brief
- Converting a design doc or technical spec into runnable code
- Building a proof-of-concept that implements a well-defined interface

## When NOT to use
- Exploratory prototypes where the spec is unclear — discover first, then spec
- Large complex systems that exceed a single context window
- When you want to learn by building — this generates everything at once

## Instructions

### Spec ingestion

```
Build a repository from this specification.

Specification: [paste spec, PRD, or feature description]

Before generating any code, produce:
1. UNDERSTANDING CHECK:
   - Summarise what you're building in 3 bullet points
   - List any ambiguities or missing information
   - Confirm the tech stack you'll use

2. FILE PLAN:
   - List every file you'll create before creating any
   - This gives me a chance to redirect before you start

3. IMPLEMENTATION ORDER:
   - What do you build first? (usually: schema → types → core logic → API → UI → tests)

Wait for my approval before proceeding.
```

### Full repository generation

```
Generate a complete repository for [project].

Spec: [paste spec]
Stack: [specify or use defaults]

Generate in this order:
1. Project scaffolding (package.json, tsconfig, .gitignore, .env.example)
2. Database schema (if applicable)
3. Core business logic (services, utilities)
4. API layer (routes, controllers, validation)
5. UI layer (if applicable)
6. Tests (unit + integration for core logic)
7. CI/CD (GitHub Actions)
8. README with setup instructions

Rules:
- Every file must be complete and runnable — no TODOs, no placeholders
- Tests must actually test the logic (not mock everything)
- README must include: install, configure, run, test commands
- .env.example must document every required variable
- All TypeScript (if Node.js) must compile without errors
```

### Incremental spec-to-code

```
Build [feature] from this specification incrementally.

Spec: [paste spec]

Phase 1 — Data layer:
Build: schema, types, database migrations
Deliver: migrations/ and types/ directories
Test before proceeding: run migrations on test DB

Phase 2 — Business logic:
Build: service functions that implement the spec
Deliver: services/ directory
Test before proceeding: unit tests pass

Phase 3 — API layer:
Build: API endpoints that expose the services
Deliver: routes/ or app/api/ directory
Test before proceeding: integration tests pass

Phase 4 — Documentation:
Build: README, API docs, .env.example
Deliver: docs/ and updated README.md

Complete one phase fully before starting the next.
```

### Spec validation before build

```
Review this spec before I build from it.

Spec: [paste]

Check for:
1. COMPLETENESS: Is there enough detail to build without guessing?
   - Are all data types and structures defined?
   - Are all error cases specified?
   - Are all auth/permission requirements clear?

2. CONSISTENCY: Does the spec contradict itself?
   - Are terms used consistently?
   - Do the API inputs/outputs align with the data model?

3. BUILDABILITY: Is this achievable in one session?
   - How many files would this generate? (estimate)
   - Are there external dependencies that need pre-configured access?

4. OPEN QUESTIONS: What would I have to guess?
   - List each assumption I'd make without asking

Produce: a list of gaps to resolve before building.
```

## Example

**User:** Build me a URL shortener service from this spec:
- POST /links with {url, customSlug?, expiresAt?} → returns {id, shortUrl}
- GET /:slug redirects to original URL (302)
- GET /links/:id returns link metadata
- Links expire after expiresAt if set
- Track click counts

**Claude's file plan:**

```
Files I'll create (awaiting approval):

Infrastructure:
- package.json (Express, Drizzle, Neon)
- tsconfig.json
- .env.example

Database:
- db/schema.ts (links table: id, slug, originalUrl, expiresAt, clicks, createdAt)
- drizzle.config.ts
- db/migrations/0001_create_links.sql

Business logic:
- services/links.ts (createLink, getBySlug, getLinkById, incrementClicks)
- lib/slugify.ts (generate random slug if none provided)
- lib/db.ts (Drizzle client)

API:
- app.ts (Express setup)
- routes/links.ts (POST /links, GET /links/:id)
- routes/redirect.ts (GET /:slug)
- middleware/validation.ts (Zod schemas)

Tests:
- tests/links.test.ts (unit tests for services)
- tests/api.test.ts (integration tests for routes)

Docs:
- README.md
- .env.example

Total: 14 files

Shall I proceed?
```

After approval, generates all 14 files completely and correctly with:
```bash
npm install && npx drizzle-kit migrate && npm test && npm run dev
# All pass on first run
```

---

> **Work with us:** Claudient is backed by [Uitbreiden](https://uitbreiden.com/) — we build AI products and B2B solutions with developer communities.
> [uitbreiden.com](https://uitbreiden.com/) · [Reddit](https://www.reddit.com/r/uitbreiden/) · [YouTube](https://www.youtube.com/@UITBREIDEN)
