> 🇳🇱 Dit is de Nederlandse vertaling. [Engelse versie](../nextjs-project.md).

# Project Starter: Next.js

Gebruik deze prompt om een nieuw Next.js-project op te starten met Claude Code.

---

## Opstartprompt

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

## Toe te passen conventies

Voeg toe aan CLAUDE.md na bootstrap:

```markdown
## Next.js conventies
- Server Components standaard — voeg 'use client' alleen toe wanneer nodig (event handlers, hooks, browser API's)
- Server Actions voor mutaties — roep API-routes nooit aan vanuit Server Components
- Importeer nooit alleen-server-code in Client Components (gebruik server/-directory-grens)
- API-routes alleen voor: webhooks, OAuth callbacks, streamingantwoorden
- Prisma client: singleton in lib/db.ts — nooit inline instantiëren
- Alle databasetoegang in server/ — nooit in Client Components
```

---

## Wat hierna te doen

Nadat het skelet draait:

1. Auth instellen: "Configureer [Clerk/NextAuth] met de auth-routes die we hebben ingesteld"
2. Eerste pagina toevoegen: "Maak een dashboardpagina die [resource] toont met een datatabella"
3. Eerste mutatie toevoegen: "Voeg een server action toe om [resource] aan te maken met formuliervalidatie"

---
