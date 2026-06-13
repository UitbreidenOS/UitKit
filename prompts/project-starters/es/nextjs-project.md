> 🇪🇸 Esta es la traducción en español. [Versión en inglés](../nextjs-project.md).

# Iniciador de Proyecto: Next.js

Usa este prompt para arrancar un nuevo proyecto Next.js con Claude Code.

---

## Prompt de inicio

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

## Convenciones clave a aplicar

Agrega a CLAUDE.md después del bootstrap:

```markdown
## Convenciones de Next.js
- Server Components por defecto — agrega 'use client' solo cuando sea necesario (manejadores de eventos, hooks, APIs del navegador)
- Server Actions para mutations — nunca llames a rutas de API desde Server Components
- Nunca importes código solo del servidor en Client Components (usa el límite del directorio server/)
- Las rutas de API solo para: webhooks, callbacks de OAuth, respuestas con streaming
- Cliente Prisma: singleton en lib/db.ts — nunca instancies inline
- Todo el acceso a la base de datos en server/ — nunca en Client Components
```

---

## Qué hacer a continuación

Después de que el esqueleto funcione:

1. Configura la autenticación: "Configure [Clerk/NextAuth] with the auth routes we set up"
2. Agrega la primera página: "Create a dashboard page showing [resource] with a data table"
3. Agrega la primera mutation: "Add a server action to create [resource] with form validation"

---
