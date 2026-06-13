---
name: monorepo
description: "Monorepo tooling: Turborepo, Nx, pnpm workspaces, shared packages, task pipelines, affected builds, CI optimisation"
updated: 2026-06-13
---

# Monorepo Skill

## When to activate
- Setting up a monorepo from scratch (Turborepo, Nx, or pnpm workspaces)
- Adding a new package or app to an existing monorepo
- Configuring task pipelines (build → test → lint dependencies)
- Optimising CI to only build/test affected packages
- Sharing code between packages (ui components, utilities, types)
- Troubleshooting workspace linking or peer dependency issues

## When NOT to use
- Single-app projects — monorepos add tooling overhead that isn't justified
- When teams genuinely need separate release cycles and ownership — consider polyrepo
- When the codebase is small enough that one `package.json` works fine

## Instructions

### Turborepo — recommended for most teams

```bash
# Scaffold a new monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# Add to existing project
npx turbo@latest init
```

**Directory structure:**
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

### Shared packages

**packages/ui — shared component library:**
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

**Using the shared package in an app:**
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

**packages/config — shared tooling config:**
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

### Common Turborepo commands

```bash
# Run a task across all packages
turbo build

# Run for a specific package and its dependencies
turbo build --filter=web

# Run for all packages that depend on @myapp/ui
turbo build --filter=...\@myapp/ui

# Run for changed packages since main branch
turbo build --filter=[main]

# See what would run (dry run)
turbo build --dry

# Run with no cache (force fresh build)
turbo build --force

# Clear the cache
turbo clean
```

### Nx (better for large orgs, plugin-heavy)

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
# Nx commands
nx build web                        # build one app
nx affected:build                   # build only changed
nx graph                            # visualise dependency graph
nx generate @nx/react:library ui    # scaffold a library
```

### CI optimisation with Turborepo Remote Cache

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

      # Remote cache: share build cache across CI runs
      - run: pnpm turbo build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

**Turborepo Remote Cache** (vercel.com/docs/monorepos/remote-caching):
- Shares build artifacts across CI machines and team members
- Free with Vercel; self-hostable with `@turborepo/remote-cache`
- ~60-90% CI time reduction on cache hit

### Adding a new app or package

```bash
# New Next.js app
cd apps
pnpm create next-app@latest dashboard
cd dashboard
# Add workspace deps
pnpm add @myapp/ui @myapp/utils

# New shared package
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

### Dependency rules

Keep dependencies explicit and directional:

```
apps/ → packages/  ✅  (apps can depend on shared packages)
packages/ → packages/  ✅  (packages can depend on other packages)
packages/ → apps/  ❌  (shared code must not depend on apps)
apps/ → apps/  ❌  (apps should be independent)
```

Enforce with Nx's module boundary rules or ESLint `import/no-restricted-paths`.

## Example

**User:** Add a shared `@myapp/auth` package to a Turborepo monorepo that exports JWT utilities and a React `useAuth` hook — consumed by both the Next.js web app and the Express API.

**Expected output:**
- `packages/auth/package.json` — `@myapp/auth`, exports `./jwt` and `./react`
- `packages/auth/src/jwt.ts` — `signToken()`, `verifyToken()`, `type JWTPayload`
- `packages/auth/src/react.tsx` — `'use client'`, `useAuth()` hook, `AuthProvider`
- `apps/web/package.json` — `@myapp/auth: workspace:*`
- `apps/api/package.json` — `@myapp/auth: workspace:*`
- `turbo.json` — `build` depends on `^build` so auth builds before consumers

---
