> 🇩🇪 Dies ist die deutsche Übersetzung. [Englische Version](../nextjs-project.md).

# Projekt-Starter: Next.js

Diesen Prompt verwenden, um ein neues Next.js-Projekt mit Claude Code zu starten.

---

## Kickoff-Prompt

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

## Zu erzwingende Schlüsselkonventionen

Nach dem Bootstrap zu CLAUDE.md hinzufügen:

```markdown
## Next.js Konventionen
- Server Components standardmäßig — 'use client' nur hinzufügen, wenn benötigt (Event-Handler, Hooks, Browser-APIs)
- Server Actions für Mutationen — niemals API-Routes aus Server Components aufrufen
- Niemals server-only Code in Client Components importieren (server/-Verzeichnisgrenze verwenden)
- API-Routes nur für: Webhooks, OAuth-Callbacks, Streaming-Antworten
- Prisma Client: Singleton in lib/db.ts — niemals inline instanziieren
- Alle Datenbankzugriffe in server/ — niemals in Client Components
```

---

## Was als nächstes tun

Nachdem das Skeleton läuft:

1. Auth einrichten: "[Clerk/NextAuth] mit den eingerichteten Auth-Routes konfigurieren"
2. Erste Seite hinzufügen: "Eine Dashboard-Seite erstellen, die [Ressource] mit einer Datentabelle zeigt"
3. Erste Mutation hinzufügen: "Eine Server Action zum Erstellen von [Ressource] mit Formularvalidierung hinzufügen"

---
