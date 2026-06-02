# Monorepo (Turborepo + pnpm) — Projektstruktur

> Für Full-Stack-TypeScript-Teams, die mehrere Apps und gemeinsame Pakete in einem Repository verwalten — optimiert für konsistente Builds, atomares Versionieren und parallele CI über alle Workspaces hinweg.

## Stack

- **Task-Orchestrierung:** Turborepo 2.x (Remote-Caching, Pipeline-Abhängigkeitsgraph)
- **Paketmanager:** pnpm 9.x mit Workspaces (`pnpm-workspace.yaml`)
- **Sprache:** TypeScript 5.x (Strict Mode über alle Pakete)
- **Web-App:** Next.js 14 (App Router, RSC, Turbopack)
- **Dokumentations-Website:** Astro 4.x (Content Collections, MDX)
- **Paket-Bundler:** tsup 8.x (ESM + CJS Dual-Output für gemeinsame Pakete)
- **Komponentenbibliothek:** React 18 + Radix UI Primitives (in `packages/ui`)
- **Datenbank-ORM:** Prisma 5.x oder Drizzle ORM 0.30+ (in `packages/database`)
- **Email:** React Email 2.x + Resend SDK (in `packages/emails`)
- **Versionierung:** Changesets 2.x (Semantische Versions-Bumps + CHANGELOG-Generierung)
- **Linting:** ESLint 9.x mit gemeinsamer Flat Config aus `packages/config/eslint`
- **Formatierung:** Prettier 3.x mit gemeinsamer Config aus `packages/config/prettier`
- **Unit-Testing:** Vitest 1.x (jedes Paket/jede App führt ihre eigene Suite aus)
- **E2E-Testing:** Playwright 1.x (läuft gegen `apps/web` Staging-Build)
- **CI/CD:** GitHub Actions (Lint + Typecheck + Test + Build + Release Pipeline)

## Verzeichnisbaum

```
my-monorepo/
├── .changeset/                          # Changeset-Metadaten-Dateien
│   ├── config.json                      # Changeset-Konfiguration: baseBranch, access, changelog
│   └── README.md                        # Auto-generiert von changeset init
├── .github/
│   └── workflows/
│       ├── ci.yml                       # PR-Checks: lint, typecheck, test, build
│       ├── release.yml                  # Ausgelöst bei main Push: veröffentlicht Pakete
│       └── preview.yml                  # Vercel/Cloudflare Preview-Deploy auf PR
├── .claude/
│   ├── settings.json                    # MCP-Server, Hooks, Berechtigungen
│   └── commands/
│       ├── add-package.md               # /add-package — Gerüst für neuen packages/ Eintrag
│       ├── add-app.md                   # /add-app — Gerüst für neuen apps/ Eintrag
│       ├── changeset.md                 # /changeset — leitet durch Bump-Typ und schreibt Changeset-Datei
│       ├── turbo-graph.md               # /turbo-graph — erklärt Pipeline-Reihenfolge für gegebene Task
│       └── sync-configs.md              # /sync-configs — propagiert Konfigurationsänderungen über alle Workspaces
├── apps/
│   ├── web/                             # Next.js 14 App (App Router)
│   │   ├── .env.local                   # Lokale Umgebungsvariablen (gitignored)
│   │   ├── .env.example                 # Committed Umgebungsvariablen-Template
│   │   ├── next.config.ts               # Next.js Config — transpilePackages für Workspace-Deps
│   │   ├── tsconfig.json                # Erweitert ../../packages/config/typescript/nextjs.json
│   │   ├── package.json                 # name: "@acme/web", scripts: dev/build/start/lint
│   │   ├── vitest.config.ts             # Unit-Test-Konfiguration (jsdom Umgebung)
│   │   ├── playwright.config.ts         # E2E-Konfiguration — baseURL, projects (chromium/firefox/webkit)
│   │   ├── public/                      # Statische Assets
│   │   └── src/
│   │       ├── app/                     # Next.js App Router Root
│   │       │   ├── layout.tsx           # Root-Layout — Fonts, Provider, Metadaten
│   │       │   ├── page.tsx             # Startseite (RSC)
│   │       │   ├── (auth)/              # Route-Gruppe: Login, Signup, Passwort vergessen
│   │       │   ├── (dashboard)/         # Route-Gruppe: geschützte Seiten hinter Middleware
│   │       │   └── api/                 # Route Handler
│   │       │       ├── health/route.ts  # GET /api/health — Verfügbarkeitsprüfung
│   │       │       └── webhooks/        # Stripe, Resend, GitHub Webhook Handler
│   │       ├── components/              # App-lokale Komponenten (nicht gemeinsam genutzt)
│   │       ├── hooks/                   # Custom React Hooks
│   │       ├── lib/                     # Utilities: auth.ts, db.ts, stripe.ts
│   │       └── tests/
│   │           ├── unit/                # Vitest Unit-Tests
│   │           └── e2e/                 # Playwright Specs
│   └── docs/                            # Astro 4 Dokumentations-Website
│       ├── astro.config.ts              # Astro-Konfiguration: mdx(), sitemap(), starlight()
│       ├── tsconfig.json                # Erweitert ../../packages/config/typescript/base.json
│       ├── package.json                 # name: "@acme/docs"
│       └── src/
│           ├── content/
│           │   ├── config.ts            # Content Collection Schemas
│           │   └── docs/                # MDX Dokumentationsseiten
│           ├── components/              # Astro/React Komponenten für Docs
│           └── pages/                   # Dateibasierte Routen (index, 404, blog)
├── packages/
│   ├── ui/                              # Gemeinsame React-Komponentenbibliothek
│   │   ├── package.json                 # name: "@acme/ui", exports map für jede Komponente
│   │   ├── tsconfig.json                # Erweitert ../config/typescript/react-library.json
│   │   ├── tsup.config.ts               # Erstellt ESM + CJS + .d.ts für jeden Export-Eintrag
│   │   ├── vitest.config.ts             # Komponenten-Unit-Tests (jsdom)
│   │   └── src/
│   │       ├── index.ts                 # Re-exportiert alle öffentlichen Komponenten
│   │       ├── button/
│   │       │   ├── button.tsx           # Button Primitive (Radix Slot)
│   │       │   ├── button.test.tsx      # Vitest + Testing Library Tests
│   │       │   └── index.ts             # Named Export
│   │       ├── dialog/
│   │       ├── input/
│   │       ├── table/
│   │       └── theme/
│   │           ├── tokens.ts            # Design Tokens (Farben, Abstände, Radien)
│   │           └── provider.tsx         # ThemeProvider wrapping CSS vars
│   ├── database/                        # Prisma / Drizzle Schema und Client
│   │   ├── package.json                 # name: "@acme/database"
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts            # DB-Verbindung, Schema-Pfad, Migrations-Output-Dir
│   │   ├── src/
│   │   │   ├── index.ts                 # Exports: db client, schema, helpers
│   │   │   ├── client.ts                # Drizzle Client Initialisierung (neon/postgres)
│   │   │   ├── schema/
│   │   │   │   ├── users.ts             # users Tabellendefinition
│   │   │   │   ├── posts.ts             # posts Tabellendefinition
│   │   │   │   └── index.ts             # Barrel Re-export
│   │   │   └── migrations/              # SQL Migration-Dateien (generiert von drizzle-kit)
│   │   └── seed.ts                      # Dev Seed Script: pnpm --filter database db:seed
│   ├── emails/                          # React Email Templates + Resend Integration
│   │   ├── package.json                 # name: "@acme/emails"
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   └── src/
│   │       ├── index.ts                 # Exportiert sendEmail() Helper und alle Templates
│   │       ├── client.ts                # Resend SDK Client
│   │       ├── templates/
│   │       │   ├── welcome.tsx          # Willkommens-Email (React Email)
│   │       │   ├── reset-password.tsx   # Passwort-Reset-Email
│   │       │   └── invoice.tsx          # Rechnung / Quittungs-Email
│   │       └── utils/
│   │           └── render.ts            # render() Wrapper mit Klartext-Fallback
│   └── config/                          # Gemeinsame Tooling Configs — kein Runtime-Code
│       ├── package.json                 # name: "@acme/config"
│       ├── eslint/
│       │   ├── index.js                 # Basis Flat Config: typescript, import, jsx-a11y
│       │   ├── next.js                  # Erweitert base + next/core-web-vitals
│       │   └── react-library.js         # Erweitert Basis für Non-Next React Libraries
│       ├── typescript/
│       │   ├── base.json                # Strikte TS Basis: noUncheckedIndexedAccess, exactOptionalPropertyTypes
│       │   ├── nextjs.json              # Erweitert Basis + Next.js Plugin Types
│       │   └── react-library.json       # Erweitert Basis für Library Builds (bundler moduleResolution)
│       └── prettier/
│           └── index.js                 # Gemeinsame Prettier Config (printWidth 100, singleQuote)
├── turbo.json                           # Pipeline: build, lint, test, typecheck, dev Tasks
├── pnpm-workspace.yaml                  # Workspace Globs: apps/*, packages/*
├── package.json                         # Root Package: private, scripts (lint, build, test, release)
├── .eslintrc.js                         # Root ESLint erweitert @acme/config/eslint
├── .prettierrc.js                       # Root Prettier erweitert @acme/config/prettier
└── .gitignore                           # node_modules, .turbo, dist, .next, .env.local
```

## Wichtige Dateien erklärt

| Pfad | Zweck |
|---|---|
| `turbo.json` | Definiert den Task-Abhängigkeitsgraph — `build` hängt von upstream `build` ab, `test` hängt von `build` ab, `dev` führt alle Apps parallel ohne Cache aus |
| `pnpm-workspace.yaml` | Deklariert Workspace-Pakete (`apps/*`, `packages/*`) damit pnpm lokale Deps durch Symlink verlinkt |
| `.changeset/config.json` | Konfiguriert Changeset: `baseBranch: "main"`, `access: "restricted"` für private Pakete, `changelog: "@changesets/changelog-github"` |
| `packages/config/typescript/base.json` | Single Source of Truth für TS Striktheit — alle anderen tsconfigs erweitern dies |
| `packages/config/eslint/index.js` | Gemeinsame ESLint Flat Config importiert von jedem Workspace `eslint.config.js` |
| `apps/web/next.config.ts` | Muss `transpilePackages: ["@acme/ui"]` auflisten damit Next.js Workspace JSX kompiliert |
| `packages/database/drizzle.config.ts` | Zeigt drizzle-kit auf das Schema Dir und target DB URL; verwendet von `db:generate` und `db:migrate` |
| `.github/workflows/release.yml` | Führt `changeset publish` nach `pnpm build` auf main aus — veröffentlicht nur Pakete mit pending Changesets |

## Schnelles Gerüst

```bash
# 1. Initialisiere Repo und Workspace
mkdir my-monorepo && cd my-monorepo
git init
pnpm init

# 2. Installiere Turborepo
pnpm add -D turbo --workspace-root

# 3. Erstelle Workspace Config
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

# 4. Gerüst Verzeichnisstruktur
mkdir -p apps/web apps/docs
mkdir -p packages/ui/src packages/database/src/schema packages/database/src/migrations
mkdir -p packages/emails/src/templates packages/config/eslint packages/config/typescript packages/config/prettier
mkdir -p .changeset .github/workflows .claude/commands

# 5. Erstelle jeden Workspace package.json
echo '{"name":"@acme/web","version":"0.0.1","private":true,"scripts":{"dev":"next dev","build":"next build","lint":"eslint ."}}' > apps/web/package.json
echo '{"name":"@acme/docs","version":"0.0.1","private":true,"scripts":{"dev":"astro dev","build":"astro build"}}' > apps/docs/package.json
echo '{"name":"@acme/ui","version":"0.0.1","main":"./dist/index.js","types":"./dist/index.d.ts","scripts":{"build":"tsup"}}' > packages/ui/package.json
echo '{"name":"@acme/database","version":"0.0.1","scripts":{"db:generate":"drizzle-kit generate","db:migrate":"drizzle-kit migrate","db:seed":"tsx seed.ts"}}' > packages/database/package.json
echo '{"name":"@acme/emails","version":"0.0.1","scripts":{"build":"tsup"}}' > packages/emails/package.json
echo '{"name":"@acme/config","version":"0.0.1","private":true}' > packages/config/package.json

# 6. Initialisiere Changesets
pnpm dlx @changesets/cli init

# 7. Installiere Root Dev Dependencies
pnpm add -D typescript eslint prettier vitest playwright -w

# 8. Installiere Workspace-spezifische Deps
pnpm --filter @acme/web add next react react-dom @acme/ui @acme/database
pnpm --filter @acme/web add -D @acme/config tsup vitest
pnpm --filter @acme/docs add astro
pnpm --filter @acme/ui add react radix-ui
pnpm --filter @acme/ui add -D tsup vitest @testing-library/react
pnpm --filter @acme/database add drizzle-orm @neondatabase/serverless
pnpm --filter @acme/database add -D drizzle-kit tsx
pnpm --filter @acme/emails add react-email @react-email/components resend
pnpm --filter @acme/emails add -D tsup

# 9. Füge Claudient Projekt-Befehle hinzu
npx claudient add command add-package
npx claudient add command add-app
npx claudient add command changeset-guide
```

## CLAUDE.md Template

```markdown
# Mein Monorepo

Dies ist ein Turborepo + pnpm Monorepo mit mehreren Apps und gemeinsamen Paketen.
Alle Pakete sind TypeScript Strict. Erstelle niemals Dateien außerhalb von apps/ oder packages/ ohne diese Datei zu aktualisieren.

## Stack

- Turborepo 2.x — Task-Orchestrierung und Remote-Caching
- pnpm 9.x — Paketmanager mit Workspaces
- TypeScript 5.x Strict — alle Pakete
- Next.js 14 (App Router) — apps/web
- Astro 4.x — apps/docs
- tsup — packages/ui und packages/emails Build
- Drizzle ORM + Neon — packages/database
- React Email + Resend — packages/emails
- Changesets — Versionierung und Changelog
- Vitest — Unit-Tests in jedem Paket
- Playwright — E2E-Tests in apps/web

## Häufige Tasks

```bash
# Führe alle Apps im Dev-Modus aus (parallel, über Turborepo)
pnpm dev

# Erstelle alles in korrekter Abhängigkeitsreihenfolge
pnpm build

# Führe alle Unit-Tests aus
pnpm test

# Führe Playwright E2E gegen apps/web aus
pnpm --filter @acme/web test:e2e

# Typecheck das gesamte Monorepo
pnpm typecheck

# Lint alles
pnpm lint

# Füge eine neue Dependency zu einem spezifischen Workspace hinzu
pnpm --filter @acme/web add zod

# Füge ein gemeinsames Workspace-Paket als Dependency hinzu
pnpm --filter @acme/web add @acme/ui

# Generiere eine DB-Migration nach Schema-Änderung
pnpm --filter @acme/database db:generate

# Führe Migrations gegen die target DB aus
pnpm --filter @acme/database db:migrate

# Erstelle einen Changeset für eine Paket-Änderung
pnpm changeset

# Versioniere alle Pakete mit pending Changesets (nur CI)
pnpm changeset version

# Veröffentliche Pakete auf npm (nur CI, läuft in release.yml)
pnpm changeset publish
```

## Füge ein neues Paket hinzu

1. Erstelle `packages/<name>/` mit `package.json` (name: `@acme/<name>`)
2. Füge einen `tsconfig.json` hinzu der `../../packages/config/typescript/base.json` erweitert
3. Füge einen `tsup.config.ts` hinzu wenn das Paket ein Build-Artefakt produziert
4. Füge das Paket zur `build` Pipeline in `turbo.json` hinzu wenn es einen Build-Schritt hat
5. Führe `pnpm install` vom Repo-Root aus um den Workspace zu registrieren
6. Füge das Paket als Dependency in jedem Consumer mit `pnpm --filter @acme/<consumer> add @acme/<name>` hinzu

## Füge eine neue App hinzu

1. Erstelle `apps/<name>/` mit einem `package.json` (name: `@acme/<name>`)
2. Füge einen `tsconfig.json` hinzu der die passende Config aus `packages/config/typescript/` erweitert
3. Registriere `dev`, `build`, `lint`, `typecheck` Scripts in `package.json`
4. Aktualisiere `turbo.json` Pipeline wenn die App nicht-Standard Task-Abhängigkeiten hat
5. Füge ein Vercel Projekt oder Cloudflare Pages Projekt für Deployments hinzu

## Changeset Release Workflow

1. Mache Code-Änderungen über ein oder mehrere Pakete
2. Führe `pnpm changeset` aus — wähle betroffene Pakete und Bump-Typ (patch/minor/major)
3. Committe die generierte `.changeset/<hash>.md` Datei zusammen mit Code-Änderungen
4. Wenn der PR auf main merged, führt der `release.yml` Workflow `changeset version` dann `changeset publish` aus
5. Der Workflow erstellt einen "Version Packages" PR wenn Pakete Versions-Bumps brauchen

## Gemeinsame Config Vererbung

- TypeScript: jeder tsconfig.json hat `"extends": "../../packages/config/typescript/<variant>.json"`
- ESLint: jeder eslint.config.js importiert von `@acme/config/eslint/<variant>`
- Prettier: root `.prettierrc.js` exportiert `require("@acme/config/prettier")`
- Überschreibe niemals `strict`, `noUncheckedIndexedAccess` oder `exactOptionalPropertyTypes` — eröffne zuerst eine Discussion

## Turborepo Pipeline Regeln

- `build` gibt zu `dist/` und `.next/` aus — diese werden von Turborepo gecacht
- `test` hängt von `^build` ab — alle upstream Pakete müssen bauen bevor Tests laufen
- `lint` und `typecheck` laufen parallel ohne upstream Abhängigkeit
- `dev` hat `"cache": false` und `"persistent": true` — es cached niemals und läuft weiter
- Füge neue Tasks zu `turbo.json` hinzu bevor du Scripts zu package.json hinzufügst

## Konventionen

- Paketnamen müssen `@acme/<name>` folgen — keine Ausnahmen
- Alle Exports müssen durch einen Barrel `src/index.ts` gehen — keine Deep Imports von Consumern
- Datenbank-Schema-Änderungen benötigen eine Migration-Datei — bearbeite niemals existierende Migration SQL
- Umgebungsvariablen leben in `apps/web/.env.local` (gitignored) und `.env.example` (committed)
- React-Komponenten in packages/ui müssen Server-Komponenten-kompatibel sein (kein use client wenn nicht nötig)
```

## MCP Server

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/Users/you/my-monorepo"],
      "description": "Read/write access to the full monorepo tree"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      },
      "description": "Create PRs, read issues, review Actions run logs"
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "${DATABASE_URL}"],
      "description": "Query the Neon/Postgres database directly for schema inspection and data debugging"
    }
  }
}
```

## Empfohlene Hooks

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const f=process.env.CLAUDE_TOOL_RESULT_FILE_PATH; if(f&&(f.endsWith('.ts')||f.endsWith('.tsx')))require('child_process').execSync('pnpm prettier --write '+f,{stdio:'inherit'})\"",
            "description": "Auto-format TypeScript/TSX files with Prettier immediately after Claude writes them"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const f=process.env.CLAUDE_TOOL_RESULT_FILE_PATH; if(f&&f.includes('packages/database/src/schema'))console.log('REMINDER: schema changed — run: pnpm --filter @acme/database db:generate')\"",
            "description": "Remind developer to generate a migration whenever a Drizzle schema file is written"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"const i=JSON.parse(process.env.CLAUDE_TOOL_INPUT||'{}'); if((i.command||'').includes('npm install')||( i.command||'').includes('yarn add'))process.exit(1)\"",
            "description": "Block npm install and yarn add — enforce pnpm as the only package manager"
          }
        ]
      }
    ]
  }
}
```

## Skills zum Installieren

```bash
# TypeScript und Node.js Entwicklung
npx claudient add skill backend/typescript/tsup-library
npx claudient add skill backend/typescript/strict-tsconfig

# Next.js App Entwicklung
npx claudient add skill frontend/nextjs/app-router
npx claudient add skill frontend/nextjs/server-components

# Datenbank und Migrations
npx claudient add skill backend/database/drizzle-schema
npx claudient add skill backend/database/migrations-workflow

# Testing
npx claudient add skill testing/vitest-unit
npx claudient add skill testing/playwright-e2e

# Monorepo und CI
npx claudient add skill devops/turborepo-pipeline
npx claudient add skill devops/changesets-release
npx claudient add skill devops/github-actions-ci

# Code-Qualität
npx claudient add skill productivity/code-review
npx claudient add skill productivity/pr-description
```

## Verwandt

- [Turborepo Pipeline Guide](../guides/turborepo-pipelines.md)
- [Changeset Release Workflow](../workflows/changeset-release.md)
- [Shared TypeScript Config Guide](../guides/shared-tsconfig.md)
- [pnpm Workspace Dependency Management](../guides/pnpm-workspaces.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
