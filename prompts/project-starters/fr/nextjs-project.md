> 🇫🇷 This is the French translation. [English version](../nextjs-project.md).

# Starter de Projet : Next.js

Utilisez ce prompt pour lancer un nouveau projet Next.js avec Claude Code.

---

## Prompt de démarrage

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

## Conventions clés à appliquer

À ajouter dans CLAUDE.md après le bootstrap :

```markdown
## Conventions Next.js
- Server Components par défaut — ajouter 'use client' uniquement quand nécessaire (gestionnaires d'événements, hooks, APIs navigateur)
- Server Actions pour les mutations — ne jamais appeler les routes API depuis les Server Components
- Ne jamais importer du code server-only dans les Client Components (utiliser la frontière du répertoire server/)
- Routes API uniquement pour : webhooks, callbacks OAuth, réponses en streaming
- Client Prisma : singleton dans lib/db.ts — ne jamais instancier inline
- Tous les accès à la base de données dans server/ — jamais dans les Client Components
```

---

## Que faire ensuite

Une fois le squelette en cours d'exécution :

1. Configurer l'auth : "Configure [Clerk/NextAuth] with the auth routes we set up"
2. Ajouter la première page : "Create a dashboard page showing [resource] with a data table"
3. Ajouter la première mutation : "Add a server action to create [resource] with form validation"

---
