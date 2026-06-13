# Project Starter: Next.js

Use this prompt to kick off a new Next.js project with Claude Code.

---

## Kickoff prompt

```
Bootstrap a new Next.js 15 project with production-ready defaults.

Project: [name and one-sentence description]
Stack: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
Database: PostgreSQL with Prisma
Auth: [Clerk / NextAuth.js / custom JWT]
Testing: Vitest + React Testing Library

Create the following structure:
src/
├── app/
│   ├── (auth)/           ← Auth routes (sign-in, sign-up)
│   ├── (dashboard)/      ← Protected routes
│   ├── api/              ← API route handlers
│   ├── layout.tsx        ← Root layout
│   └── page.tsx          ← Landing page
├── components/
│   ├── ui/               ← shadcn/ui components (auto-generated)
│   └── [feature]/        ← Feature-specific components
├── lib/
│   ├── db.ts             ← Prisma client singleton
│   ├── auth.ts           ← Auth utilities
│   └── utils.ts          ← cn() and shared utilities
├── server/               ← Server-only code (no client imports)
│   └── actions/          ← Server actions
└── types/                ← Shared TypeScript types

prisma/
├── schema.prisma
└── migrations/

Start with:
1. Show the full directory structure
2. package.json with pinned versions
3. tsconfig.json and tailwind.config.ts
4. Root layout.tsx and a working landing page
5. Prisma schema with a User model
6. Verify it runs: npm run dev

Do not add features yet — skeleton only.
```

---

## Key conventions to enforce

Add to CLAUDE.md after bootstrap:

```markdown
## Next.js conventions
- Server Components by default — add 'use client' only when needed (event handlers, hooks, browser APIs)
- Server Actions for mutations — never call API routes from Server Components
- Never import server-only code in Client Components (use server/ directory boundary)
- API routes only for: webhooks, OAuth callbacks, streaming responses
- Prisma client: singleton in lib/db.ts — never instantiate inline
- All database access in server/ — never in Client Components
```

---

## What to do next

After the skeleton runs:

1. Set up auth: "Configure [Clerk/NextAuth] with the auth routes we set up"
2. Add first page: "Create a dashboard page showing [resource] with a data table"
3. Add first mutation: "Add a server action to create [resource] with form validation"

---
