---
name: monorepo
description: "Monorepo tooling: Turborepo, Nx, pnpm workspaces, shared packages, task pipelines, affected builds, CI optimisation"
---

> 🇪🇸 Versión en español. [Versión en inglés](../monorepo.md).

# Skill Monorepo

## Cuándo activar
- Configurar un monorepo desde cero (Turborepo, Nx o pnpm workspaces)
- Agregar un nuevo paquete o app a un monorepo existente
- Configurar pipelines de tareas (dependencias build → test → lint)
- Optimizar CI para solo construir/probar paquetes afectados
- Compartir código entre paquetes (componentes UI, utilidades, tipos)
- Solucionar problemas de vinculación de workspace o dependencias peer

## Cuándo NO usar
- Proyectos de una sola app — los monorepos agregan sobrecarga de herramientas que no está justificada
- Cuando los equipos genuinamente necesitan ciclos de lanzamiento y propiedad separados — considerar polyrepo
- Cuando la base de código es lo suficientemente pequeña para que un solo `package.json` funcione bien

## Instrucciones

### Turborepo — recomendado para la mayoría de los equipos

```bash
# Crear un nuevo monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# Agregar a un proyecto existente
npx turbo@latest init
```

**Estructura de directorios:**
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

**turbo.json — pipeline de tareas:**
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

**package.json raíz:**
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

### Paquetes compartidos

**packages/ui — biblioteca de componentes compartidos:**
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

**Usar el paquete compartido en una app:**
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

**packages/config — configuración de herramientas compartida:**
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

### Comandos comunes de Turborepo

```bash
# Ejecutar una tarea en todos los paquetes
turbo build

# Ejecutar para un paquete específico y sus dependencias
turbo build --filter=web

# Ejecutar para todos los paquetes que dependen de @myapp/ui
turbo build --filter=...\@myapp/ui

# Ejecutar para paquetes modificados desde la rama main
turbo build --filter=[main]

# Ver qué se ejecutaría (ejecución en seco)
turbo build --dry

# Ejecutar sin caché (forzar build fresco)
turbo build --force

# Limpiar el caché
turbo clean
```

### Nx (mejor para grandes organizaciones, con muchos plugins)

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
# Comandos de Nx
nx build web                        # construir una app
nx affected:build                   # construir solo los cambios
nx graph                            # visualizar el grafo de dependencias
nx generate @nx/react:library ui    # generar una biblioteca
```

### Optimización de CI con Turborepo Remote Cache

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

      # Caché remoto: compartir caché de build entre ejecuciones de CI
      - run: pnpm turbo build test lint
        env:
          TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
          TURBO_TEAM: ${{ vars.TURBO_TEAM }}
```

**Turborepo Remote Cache** (vercel.com/docs/monorepos/remote-caching):
- Comparte artefactos de build entre máquinas de CI y miembros del equipo
- Gratuito con Vercel; auto-hosteable con `@turborepo/remote-cache`
- ~60-90% de reducción del tiempo de CI en caso de cache hit

### Agregar una nueva app o paquete

```bash
# Nueva app Next.js
cd apps
pnpm create next-app@latest dashboard
cd dashboard
# Agregar dependencias workspace
pnpm add @myapp/ui @myapp/utils

# Nuevo paquete compartido
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

### Reglas de dependencia

Mantener las dependencias explícitas y direccionales:

```
apps/ → packages/  ✅  (las apps pueden depender de paquetes compartidos)
packages/ → packages/  ✅  (los paquetes pueden depender de otros paquetes)
packages/ → apps/  ❌  (el código compartido no debe depender de apps)
apps/ → apps/  ❌  (las apps deben ser independientes)
```

Aplicar con las reglas de límites de módulo de Nx o ESLint `import/no-restricted-paths`.

## Ejemplo

**Usuario:** Agregar un paquete compartido `@myapp/auth` a un monorepo Turborepo que exporte utilidades JWT y un hook React `useAuth` — consumidos tanto por la app web Next.js como por la API Express.

**Salida esperada:**
- `packages/auth/package.json` — `@myapp/auth`, exporta `./jwt` y `./react`
- `packages/auth/src/jwt.ts` — `signToken()`, `verifyToken()`, `type JWTPayload`
- `packages/auth/src/react.tsx` — `'use client'`, hook `useAuth()`, `AuthProvider`
- `apps/web/package.json` — `@myapp/auth: workspace:*`
- `apps/api/package.json` — `@myapp/auth: workspace:*`
- `turbo.json` — `build` depende de `^build` para que auth se construya antes que los consumidores

---
