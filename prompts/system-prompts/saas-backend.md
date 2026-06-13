# CLAUDE.md Starter — SaaS Backend

Drop this into your project's `CLAUDE.md` and fill in the bracketed sections.

---

```markdown
# [Project Name] — Claude Code Instructions

## What this is
[One paragraph: what the product does, who uses it, what problem it solves]

## Stack
- Language: [TypeScript / Python / Go]
- Framework: [Express / FastAPI / Gin / NestJS]
- Database: [PostgreSQL via Prisma / raw pg / SQLAlchemy]
- Auth: [JWT with 15-min access tokens + 7-day refresh tokens / Clerk / Auth0]
- Cache: [Redis]
- Queue: [BullMQ / SQS / Celery]
- Deployment: [AWS ECS / Fly.io / Railway]

## Project structure
src/
├── api/          ← Route handlers — thin, delegate to services
├── services/     ← Business logic — no HTTP concerns
├── db/           ← Database queries — no business logic
├── middleware/   ← Auth, rate limiting, error handling
├── models/       ← Type definitions and schemas
└── utils/        ← Pure functions, no side effects

## Conventions
- Route handlers are thin: validate input, call service, return response
- Services contain all business logic: they do not know about HTTP
- DB layer contains only queries: no business logic, no HTTP concerns
- All database access goes through the db/ layer — never call ORM directly from services
- Errors propagate upward with context — never swallow silently
- All API routes return: 200 (success), 201 (created), 204 (no content), 400 (bad input), 401 (unauth), 403 (forbidden), 404 (not found), 409 (conflict), 422 (validation), 500 (unexpected)

## Decisions (do not re-discuss)
- [Auth mechanism decided: JWT, no sessions]
- [ORM choice: Prisma — no raw SQL except for complex analytics queries]
- [Error format: { error: string, code: string } — never change the shape]
- [No barrel files — import directly from source]

## Testing
- Integration tests hit a real test database — no DB mocks
- Unit tests for pure business logic in services/
- Test file: [filename].test.ts next to the source file
- Run: npm test

## Commands
- npm run dev — start development server with hot reload
- npm test — run all tests
- npm run build — production build
- npm run lint — ESLint + Prettier check
- npm run db:migrate — run pending migrations
- npm run db:seed — seed development data

## Never do
- Never put business logic in route handlers
- Never call the database from route handlers directly
- Never return raw database errors to clients
- Never commit .env files
- Never use `any` type in TypeScript
```

---
