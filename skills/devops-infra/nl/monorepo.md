---
name: monorepo
description: "Monorepo tooling: Turborepo, Nx, pnpm workspaces, shared packages, task pipelines, affected builds, CI optimisation"
---

> 🇳🇱 Nederlandse versie. [Engelse versie](../monorepo.md).

# Monorepo Skill

## Wanneer activeren
- Een monorepo van scratch opzetten (Turborepo, Nx of pnpm workspaces)
- Een nieuw pakket of app toevoegen aan een bestaand monorepo
- Task pipelines configureren (build → test → lint-afhankelijkheden)
- CI optimaliseren om alleen aangetaste pakketten te bouwen/testen
- Code delen tussen pakketten (UI-componenten, utilities, typen)
- Problemen oplossen met workspace-linking of peer dependency-problemen

## Wanneer NIET gebruiken
- Single-app projecten — monorepo's voegen tooling-overhead toe die niet gerechtvaardigd is
- Wanneer teams echt aparte release-cycli en eigenaarschap nodig hebben — overweeg polyrepo
- Wanneer de codebase klein genoeg is dat één `package.json` prima werkt

## Instructies

### Turborepo — aanbevolen voor de meeste teams

```bash
# Een nieuw monorepo aanmaken
npx create-turbo@latest my-monorepo
cd my-monorepo

# Toevoegen aan bestaand project
npx turbo@latest init
```

**Directorystructuur:**
```
my-monorepo/
├── turbo.json              # task pipeline config
├── package.json            # workspace root
├── pnpm-workspace.yaml     # workspace declaration
├── apps/
│   ├── web/                # Next.js app
│   │   └── package.json
│   └── api/                # FastAPI / Express
│       └── package.json
└── packages/
    ├── ui/                 # shared React components
    │   └── package.json
    ├── config/             # shared ESLint, TS config
    │   └── package.json
    └── utils/              # shared utilities and types
        └── package.json
```

**turbo.json — task pipeline:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],     // build dependencies first (^)
      "inputs": ["src/**", "package.json"],
      "outputs": [".next/**", "dist/**"]
    },
    "test": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "tests/**"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "dependsOn": [],             // no dependency — run in parallel
      "inputs": ["src/**", "*.config.*"]
    },
    "dev": {
      "persistent": true,          // long-running, don't cache
      "cache": false
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**Root package.json:**
```json
{
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "latest"
  },
  "packageManager": "pnpm@9.0.0"
}
```

### Gedeelde pakketten

**packages/ui — gedeelde componentenbibliotheek:**
```json
{
  "name": "@myapp/ui",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

```typescript
// packages/ui/src/index.ts
export { Button } from './components/Button'
export { Input } from './components/Input'
export type { ButtonProps } from './components/Button'
```

**Het gedeelde pakket gebruiken in een app:**
```json
// apps/web/package.json
{
  "dependencies": {
    "@myapp/ui": "workspace:*",   // links to local package
    "@myapp/utils": "workspace:*"
  }
}
```

```typescript
// apps/web/src/page.tsx
import { Button } from '@myapp/ui'
```

**packages/config — gedeelde tooling-configuratie:**
```json
// packages/config/package.json
{
  "name": "@myapp/config",
  "files": ["eslint-preset.js", "tsconfig.base.json"]
}
```

```json
// packages/config/tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

```json
// apps/web/tsconfig.json
{
  "extends": "@myapp/config/tsconfig.base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }]
  },
  "include": ["src", "next-env.d.ts"]
}
```

### Veelgebruikte Turborepo-opdrachten

```bash
# Een taak uitvoeren over alle pakketten
turbo build

# Uitvoeren voor een specifiek pakket en zijn afhankelijkheden
turbo build --filter=web

# Uitvoeren voor alle pakketten die afhankelijk zijn van @myapp/ui
turbo build --filter=...\@myapp/ui

# Uitvoeren voor gewijzigde pakketten sinds de main-branch
turbo build --filter=[main]

# Bekijken wat er zou draaien (droge run)
turbo build --dry

# Uitvoeren zonder cache (verse build forceren)
turbo build --force

# Cache wissen
turbo clean
```

### Nx (beter voor grote organisaties, plugin-intensief)

```bash
npx create-nx-workspace@latest myapp --preset=ts
```

```json
// nx.json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "cache": true
    },
    "test": { "cache": true },
    "lint": { "cache": true }
  },
  "affected": {
    "defaultBase": "main"
  }
}
```

```bash
# Nx-opdrachten
nx build web                        # één app bouwen
nx affected:build                   # alleen gewijzigde bouwen
nx graph                            # afhankelijkheidsgraph visualiseren
nx generate @nx/react:library ui    # een bibliotheek genereren
```

### CI-optimalisatie met Turborepo Remote Cache

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2  # needed for affected detection

      - uses: pnpm/action-setup@v3

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - run: pnpm install --frozen-lockfile

      # Remote cache: build-cache delen tussen CI-runs
      - run: pnpm turbo build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

**Turborepo Remote Cache** (vercel.com/docs/monorepos/remote-caching):
- Deelt build-artefacten tussen CI-machines en teamleden
- Gratis met Vercel; zelf te hosten met `@turborepo/remote-cache`
- ~60-90% CI-tijdreductie bij cache hit

### Een nieuwe app of nieuw pakket toevoegen

```bash
# Nieuwe Next.js-app
cd apps
pnpm create next-app@latest dashboard
cd dashboard
# Workspace-afhankelijkheden toevoegen
pnpm add @myapp/ui @myapp/utils

# Nieuw gedeeld pakket
mkdir -p packages/validators/src
cat > packages/validators/package.json << 'EOF'
{
  "name": "@myapp/validators",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "exports": { ".": "./src/index.ts" }
}
EOF
```

### Afhankelijkheidsregels

Afhankelijkheden expliciet en directioneel houden:

```
apps/ → packages/  ✅  (apps kunnen afhankelijk zijn van gedeelde pakketten)
packages/ → packages/  ✅  (pakketten kunnen afhankelijk zijn van andere pakketten)
packages/ → apps/  ❌  (gedeelde code mag niet afhankelijk zijn van apps)
apps/ → apps/  ❌  (apps moeten onafhankelijk zijn)
```

Afdwingen met Nx's modulegrensregels of ESLint `import/no-restricted-paths`.

## Voorbeeld

**Gebruiker:** Voeg een gedeeld `@myapp/auth`-pakket toe aan een Turborepo-monorepo dat JWT-utilities en een React `useAuth`-hook exporteert — gebruikt door zowel de Next.js-webapp als de Express-API.

**Verwachte uitvoer:**
- `packages/auth/package.json` — `@myapp/auth`, exporteert `./jwt` en `./react`
- `packages/auth/src/jwt.ts` — `signToken()`, `verifyToken()`, `type JWTPayload`
- `packages/auth/src/react.tsx` — `'use client'`, `useAuth()`-hook, `AuthProvider`
- `apps/web/package.json` — `@myapp/auth: workspace:*`
- `apps/api/package.json` — `@myapp/auth: workspace:*`
- `turbo.json` — `build` is afhankelijk van `^build` zodat auth voor de gebruikers wordt gebouwd

---
