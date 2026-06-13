---
name: monorepo
description: "Monorepo tooling: Turborepo, Nx, pnpm workspaces, shared packages, task pipelines, affected builds, CI optimisation"
---

> 🇩🇪 Deutsche Version. [Englische Version](../monorepo.md).

# Monorepo Skill

## Wann aktivieren
- Einrichten eines Monorepos von Grund auf (Turborepo, Nx oder pnpm workspaces)
- Hinzufügen eines neuen Pakets oder einer App zu einem bestehenden Monorepo
- Konfiguration von Task-Pipelines (Build → Test → Lint-Abhängigkeiten)
- CI optimieren, um nur betroffene Pakete zu bauen/testen
- Code zwischen Paketen teilen (UI-Komponenten, Utilities, Typen)
- Fehlerbehebung bei Workspace-Linking oder Peer-Dependency-Problemen

## Wann NICHT verwenden
- Einzelne App-Projekte — Monorepos fügen Tooling-Overhead hinzu, der nicht gerechtfertigt ist
- Wenn Teams wirklich separate Release-Zyklen und Ownership benötigen — Polyrepo erwägen
- Wenn die Codebasis klein genug ist, dass ein einziges `package.json` ausreicht

## Anweisungen

### Turborepo — empfohlen für die meisten Teams

```bash
# Ein neues Monorepo aufsetzen
npx create-turbo@latest my-monorepo
cd my-monorepo

# Zu einem bestehenden Projekt hinzufügen
npx turbo@latest init
```

**Verzeichnisstruktur:**
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

**turbo.json — Task-Pipeline:**
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

### Gemeinsame Pakete

**packages/ui — gemeinsame Komponentenbibliothek:**
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

**Das gemeinsame Paket in einer App verwenden:**
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

**packages/config — gemeinsame Tooling-Konfiguration:**
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

### Häufige Turborepo-Befehle

```bash
# Eine Aufgabe über alle Pakete ausführen
turbo build

# Für ein bestimmtes Paket und seine Abhängigkeiten ausführen
turbo build --filter=web

# Für alle Pakete ausführen, die von @myapp/ui abhängen
turbo build --filter=...\@myapp/ui

# Für geänderte Pakete seit dem main-Branch ausführen
turbo build --filter=[main]

# Anzeigen, was ausgeführt würde (Probelauf)
turbo build --dry

# Ohne Cache ausführen (frischen Build erzwingen)
turbo build --force

# Cache leeren
turbo clean
```

### Nx (besser für große Organisationen, plugin-intensiv)

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
# Nx-Befehle
nx build web                        # eine App bauen
nx affected:build                   # nur Geändertes bauen
nx graph                            # Abhängigkeitsgraph visualisieren
nx generate @nx/react:library ui    # eine Bibliothek generieren
```

### CI-Optimierung mit Turborepo Remote Cache

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

      # Remote Cache: Build-Cache über CI-Läufe hinweg teilen
      - run: pnpm turbo build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

**Turborepo Remote Cache** (vercel.com/docs/monorepos/remote-caching):
- Teilt Build-Artefakte zwischen CI-Maschinen und Teammitgliedern
- Kostenlos mit Vercel; selbst-hostbar mit `@turborepo/remote-cache`
- ~60-90% CI-Zeitreduktion bei Cache-Hit

### Eine neue App oder ein neues Paket hinzufügen

```bash
# Neue Next.js-App
cd apps
pnpm create next-app@latest dashboard
cd dashboard
# Workspace-Abhängigkeiten hinzufügen
pnpm add @myapp/ui @myapp/utils

# Neues gemeinsames Paket
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

### Abhängigkeitsregeln

Abhängigkeiten explizit und gerichtet halten:

```
apps/ → packages/  ✅  (Apps können von gemeinsamen Paketen abhängen)
packages/ → packages/  ✅  (Pakete können von anderen Paketen abhängen)
packages/ → apps/  ❌  (gemeinsamer Code darf nicht von Apps abhängen)
apps/ → apps/  ❌  (Apps sollten unabhängig sein)
```

Mit Nx's Modulgrenzregeln oder ESLint `import/no-restricted-paths` durchsetzen.

## Beispiel

**Nutzer:** Füge ein gemeinsames `@myapp/auth`-Paket zu einem Turborepo-Monorepo hinzu, das JWT-Utilities und einen React `useAuth`-Hook exportiert — von der Next.js-Web-App und der Express-API verwendet.

**Erwartete Ausgabe:**
- `packages/auth/package.json` — `@myapp/auth`, exportiert `./jwt` und `./react`
- `packages/auth/src/jwt.ts` — `signToken()`, `verifyToken()`, `type JWTPayload`
- `packages/auth/src/react.tsx` — `'use client'`, `useAuth()`-Hook, `AuthProvider`
- `apps/web/package.json` — `@myapp/auth: workspace:*`
- `apps/api/package.json` — `@myapp/auth: workspace:*`
- `turbo.json` — `build` hängt von `^build` ab, damit auth vor den Konsumenten gebaut wird

---
