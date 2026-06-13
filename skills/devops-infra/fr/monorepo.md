---
name: monorepo
description: "Monorepo tooling: Turborepo, Nx, pnpm workspaces, shared packages, task pipelines, affected builds, CI optimisation"
---

> 🇫🇷 Version française. [English version](../monorepo.md).

# Compétence Monorepo

## Quand activer
- Mise en place d'un monorepo de zéro (Turborepo, Nx, ou pnpm workspaces)
- Ajout d'un nouveau package ou d'une application à un monorepo existant
- Configuration des pipelines de tâches (dépendances build → test → lint)
- Optimisation de la CI pour ne builder/tester que les packages affectés
- Partage de code entre packages (composants UI, utilitaires, types)
- Dépannage du linking de workspace ou des problèmes de peer dependency

## Quand NE PAS utiliser
- Projets single-app — les monorepos ajoutent une surcharge d'outillage qui n'est pas justifiée
- Quand les équipes ont réellement besoin de cycles de release et de propriété séparés — envisagez polyrepo
- Quand le codebase est assez petit pour qu'un seul `package.json` suffise

## Instructions

### Turborepo — recommandé pour la plupart des équipes

```bash
# Créer un nouveau monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# Ajouter à un projet existant
npx turbo@latest init
```

**Structure de répertoire :**
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

**turbo.json — pipeline de tâches :**
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

**pnpm-workspace.yaml :**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**package.json racine :**
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

### Packages partagés

**packages/ui — bibliothèque de composants partagés :**
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

**Utiliser le package partagé dans une application :**
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

**packages/config — configuration d'outillage partagée :**
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

### Commandes Turborepo courantes

```bash
# Exécuter une tâche sur tous les packages
turbo build

# Exécuter pour un package spécifique et ses dépendances
turbo build --filter=web

# Exécuter pour tous les packages qui dépendent de @myapp/ui
turbo build --filter=...\@myapp/ui

# Exécuter pour les packages modifiés depuis la branche main
turbo build --filter=[main]

# Voir ce qui s'exécuterait (dry run)
turbo build --dry

# Exécuter sans cache (forcer un build frais)
turbo build --force

# Vider le cache
turbo clean
```

### Nx (meilleur pour les grandes organisations, riche en plugins)

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
# Commandes Nx
nx build web                        # build une application
nx affected:build                   # build uniquement les modifications
nx graph                            # visualiser le graphe de dépendances
nx generate @nx/react:library ui    # créer une bibliothèque
```

### Optimisation CI avec le cache distant Turborepo

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

      # Cache distant : partager le cache de build entre les runs CI
      - run: pnpm turbo build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

**Cache distant Turborepo** (vercel.com/docs/monorepos/remote-caching) :
- Partage les artefacts de build entre les machines CI et les membres de l'équipe
- Gratuit avec Vercel ; auto-hébergeable avec `@turborepo/remote-cache`
- ~60-90% de réduction du temps CI en cas de cache hit

### Ajouter une nouvelle application ou un nouveau package

```bash
# Nouvelle application Next.js
cd apps
pnpm create next-app@latest dashboard
cd dashboard
# Ajouter des dépendances workspace
pnpm add @myapp/ui @myapp/utils

# Nouveau package partagé
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

### Règles de dépendance

Gardez les dépendances explicites et directionnelles :

```
apps/ → packages/  ✅  (les apps peuvent dépendre des packages partagés)
packages/ → packages/  ✅  (les packages peuvent dépendre d'autres packages)
packages/ → apps/  ❌  (le code partagé ne doit pas dépendre des apps)
apps/ → apps/  ❌  (les apps doivent être indépendantes)
```

Appliquez avec les règles de limites de module de Nx ou ESLint `import/no-restricted-paths`.

## Exemple

**Utilisateur :** Ajouter un package partagé `@myapp/auth` à un monorepo Turborepo qui exporte des utilitaires JWT et un hook React `useAuth` — consommés à la fois par l'application Next.js web et l'API Express.

**Résultat attendu :**
- `packages/auth/package.json` — `@myapp/auth`, exports `./jwt` et `./react`
- `packages/auth/src/jwt.ts` — `signToken()`, `verifyToken()`, `type JWTPayload`
- `packages/auth/src/react.tsx` — `'use client'`, hook `useAuth()`, `AuthProvider`
- `apps/web/package.json` — `@myapp/auth: workspace:*`
- `apps/api/package.json` — `@myapp/auth: workspace:*`
- `turbo.json` — `build` dépend de `^build` pour que auth se build avant les consommateurs

---
