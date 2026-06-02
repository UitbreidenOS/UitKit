# Monorepo (Turborepo + pnpm) — Estructura del Proyecto

> Para equipos de TypeScript full-stack que manejan múltiples aplicaciones y paquetes compartidos en un único repositorio — optimizando compilaciones consistentes, versionado atómico e integración continua paralela en cada espacio de trabajo.

## Stack

- **Orquestación de tareas:** Turborepo 2.x (almacenamiento remoto en caché, grafo de dependencias de pipeline)
- **Gestor de paquetes:** pnpm 9.x con espacios de trabajo (`pnpm-workspace.yaml`)
- **Lenguaje:** TypeScript 5.x (modo estricto en todos los paquetes)
- **Aplicación web:** Next.js 14 (App Router, RSC, Turbopack)
- **Sitio de documentación:** Astro 4.x (colecciones de contenido, MDX)
- **Empaquetador:** tsup 8.x (salida dual ESM + CJS para paquetes compartidos)
- **Librería de componentes:** React 18 + primitivos Radix UI (en `packages/ui`)
- **ORM de base de datos:** Prisma 5.x o Drizzle ORM 0.30+ (en `packages/database`)
- **Email:** React Email 2.x + Resend SDK (en `packages/emails`)
- **Versionado:** Changesets 2.x (bumps de versión semántica + generación de CHANGELOG)
- **Linting:** ESLint 9.x con configuración plana compartida desde `packages/config/eslint`
- **Formato:** Prettier 3.x con configuración compartida desde `packages/config/prettier`
- **Pruebas unitarias:** Vitest 1.x (cada paquete/aplicación ejecuta su propia suite)
- **Pruebas E2E:** Playwright 1.x (se ejecuta contra la compilación de staging de `apps/web`)
- **CI/CD:** GitHub Actions (pipeline de lint + typecheck + test + build + release)

## Árbol de directorios

```
my-monorepo/
├── .changeset/                          # Archivos de metadatos de Changeset
│   ├── config.json                      # Configuración de Changeset: baseBranch, access, changelog
│   └── README.md                        # Auto-generado por changeset init
├── .github/
│   └── workflows/
│       ├── ci.yml                       # Verificaciones de PR: lint, typecheck, test, build
│       ├── release.yml                  # Activado en push a main: publica paquetes
│       └── preview.yml                  # Vercel/Cloudflare preview deploy en PR
├── .claude/
│   ├── settings.json                    # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── add-package.md               # /add-package — scaffolding para nueva entrada en packages/
│       ├── add-app.md                   # /add-app — scaffolding para nueva entrada en apps/
│       ├── changeset.md                 # /changeset — guía a través del tipo de bump y escribe archivo changeset
│       ├── turbo-graph.md               # /turbo-graph — explica el orden del pipeline para una tarea dada
│       └── sync-configs.md              # /sync-configs — propaga cambios de configuración en todos los espacios de trabajo
├── apps/
│   ├── web/                             # Aplicación Next.js 14 (App Router)
│   │   ├── .env.local                   # Variables de entorno locales (gitignored)
│   │   ├── .env.example                 # Plantilla de variables de entorno comprometida
│   │   ├── next.config.ts               # Configuración de Next.js — transpilePackages para deps del espacio de trabajo
│   │   ├── tsconfig.json                # Extiende ../../packages/config/typescript/nextjs.json
│   │   ├── package.json                 # nombre: "@acme/web", scripts: dev/build/start/lint
│   │   ├── vitest.config.ts             # Configuración de pruebas unitarias (entorno jsdom)
│   │   ├── playwright.config.ts         # Configuración E2E — baseURL, proyectos (chromium/firefox/webkit)
│   │   ├── public/                      # Activos estáticos
│   │   └── src/
│   │       ├── app/                     # Raíz de Next.js App Router
│   │       │   ├── layout.tsx           # Layout raíz — fuentes, proveedores, metadatos
│   │       │   ├── page.tsx             # Página de inicio (RSC)
│   │       │   ├── (auth)/              # Grupo de rutas: login, signup, forgot-password
│   │       │   ├── (dashboard)/         # Grupo de rutas: páginas protegidas detrás de middleware
│   │       │   └── api/                 # Controladores de rutas
│   │       │       ├── health/route.ts  # GET /api/health — verificación de tiempo de actividad
│   │       │       └── webhooks/        # Controladores de webhooks de Stripe, Resend, GitHub
│   │       ├── components/              # Componentes locales de la aplicación (no compartidos)
│   │       ├── hooks/                   # Hooks React personalizados
│   │       ├── lib/                     # Utilidades: auth.ts, db.ts, stripe.ts
│   │       └── tests/
│   │           ├── unit/                # Pruebas unitarias de Vitest
│   │           └── e2e/                 # Especificaciones de Playwright
│   └── docs/                            # Sitio de documentación Astro 4
│       ├── astro.config.ts              # Configuración de Astro: mdx(), sitemap(), starlight()
│       ├── tsconfig.json                # Extiende ../../packages/config/typescript/base.json
│       ├── package.json                 # nombre: "@acme/docs"
│       └── src/
│           ├── content/
│           │   ├── config.ts            # Esquemas de colecciones de contenido
│           │   └── docs/                # Páginas de documentación MDX
│           ├── components/              # Componentes Astro/React para documentación
│           └── pages/                   # Rutas basadas en archivos (index, 404, blog)
├── packages/
│   ├── ui/                              # Librería compartida de componentes React
│   │   ├── package.json                 # nombre: "@acme/ui", mapa de exports para cada componente
│   │   ├── tsconfig.json                # Extiende ../config/typescript/react-library.json
│   │   ├── tsup.config.ts               # Construye ESM + CJS + .d.ts para cada entrada de export
│   │   ├── vitest.config.ts             # Pruebas unitarias de componentes (jsdom)
│   │   └── src/
│   │       ├── index.ts                 # Re-exporta todos los componentes públicos
│   │       ├── button/
│   │       │   ├── button.tsx           # Primitivo de Button (Radix Slot)
│   │       │   ├── button.test.tsx      # Pruebas de Vitest + Testing Library
│   │       │   └── index.ts             # Export nombrado
│   │       ├── dialog/
│   │       ├── input/
│   │       ├── table/
│   │       └── theme/
│   │           ├── tokens.ts            # Tokens de diseño (colores, espaciado, radii)
│   │           └── provider.tsx         # ThemeProvider envolviendo variables CSS
│   ├── database/                        # Esquema y cliente de Prisma / Drizzle
│   │   ├── package.json                 # nombre: "@acme/database"
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts            # Conexión a BD, ruta de esquema, dir de salida de migraciones
│   │   ├── src/
│   │   │   ├── index.ts                 # Exporta: cliente db, esquema, helpers
│   │   │   ├── client.ts                # Inicialización de cliente Drizzle (neon/postgres)
│   │   │   ├── schema/
│   │   │   │   ├── users.ts             # Definición de tabla users
│   │   │   │   ├── posts.ts             # Definición de tabla posts
│   │   │   │   └── index.ts             # Re-export de barril
│   │   │   └── migrations/              # Archivos de migración SQL (generados por drizzle-kit)
│   │   └── seed.ts                      # Script de seed de dev: pnpm --filter database db:seed
│   ├── emails/                          # Plantillas de React Email + integración de Resend
│   │   ├── package.json                 # nombre: "@acme/emails"
│   │   ├── tsconfig.json
│   │   ├── tsup.config.ts
│   │   └── src/
│   │       ├── index.ts                 # Exporta helper sendEmail() y todas las plantillas
│   │       ├── client.ts                # Cliente de Resend SDK
│   │       ├── templates/
│   │       │   ├── welcome.tsx          # Email de bienvenida (React Email)
│   │       │   ├── reset-password.tsx   # Email de reseteo de contraseña
│   │       │   └── invoice.tsx          # Email de factura / recibido
│   │       └── utils/
│   │           └── render.ts            # Wrapper render() con fallback de texto plano
│   └── config/                          # Configuraciones de herramientas compartidas — sin código en tiempo de ejecución
│       ├── package.json                 # nombre: "@acme/config"
│       ├── eslint/
│       │   ├── index.js                 # Configuración plana base: typescript, import, jsx-a11y
│       │   ├── next.js                  # Extiende base + next/core-web-vitals
│       │   └── react-library.js         # Extiende base para librerías React no-Next
│       ├── typescript/
│       │   ├── base.json                # Base TS estricta: noUncheckedIndexedAccess, exactOptionalPropertyTypes
│       │   ├── nextjs.json              # Extiende base + tipos de plugin de Next.js
│       │   └── react-library.json       # Extiende base para compilaciones de librería (bundler moduleResolution)
│       └── prettier/
│           └── index.js                 # Configuración de Prettier compartida (printWidth 100, singleQuote)
├── turbo.json                           # Pipeline: build, lint, test, typecheck, dev tasks
├── pnpm-workspace.yaml                  # Globs de espacio de trabajo: apps/*, packages/*
├── package.json                         # Paquete raíz: private, scripts (lint, build, test, release)
├── .eslintrc.js                         # ESLint raíz extendiendo @acme/config/eslint
├── .prettierrc.js                       # Prettier raíz extendiendo @acme/config/prettier
└── .gitignore                           # node_modules, .turbo, dist, .next, .env.local
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `turbo.json` | Define el grafo de dependencias de tareas — `build` depende de `build` upstream, `test` depende de `build`, `dev` ejecuta todas las aplicaciones en paralelo sin caché |
| `pnpm-workspace.yaml` | Declara paquetes de espacio de trabajo (`apps/*`, `packages/*`) para que pnpm vincule deps locales por symlink |
| `.changeset/config.json` | Configura changeset: `baseBranch: "main"`, `access: "restricted"` para paquetes privados, `changelog: "@changesets/changelog-github"` |
| `packages/config/typescript/base.json` | Fuente única de verdad para TS strictness — todos los otros tsconfigs extienden esto |
| `packages/config/eslint/index.js` | Configuración plana de ESLint compartida importada por cada `eslint.config.js` del espacio de trabajo |
| `apps/web/next.config.ts` | Debe listar `transpilePackages: ["@acme/ui"]` para que Next.js compile JSX del espacio de trabajo |
| `packages/database/drizzle.config.ts` | Apunta drizzle-kit al dir de esquema y URL de BD objetivo; utilizado por `db:generate` y `db:migrate` |
| `.github/workflows/release.yml` | Ejecuta `changeset publish` después de `pnpm build` en main — solo publica paquetes con changesets pendientes |

## Scaffold rápido

```bash
# 1. Inicializar repo y espacio de trabajo
mkdir my-monorepo && cd my-monorepo
git init
pnpm init

# 2. Instalar Turborepo
pnpm add -D turbo --workspace-root

# 3. Crear configuración de espacio de trabajo
cat > pnpm-workspace.yaml << 'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

# 4. Scaffold estructura de directorios
mkdir -p apps/web apps/docs
mkdir -p packages/ui/src packages/database/src/schema packages/database/src/migrations
mkdir -p packages/emails/src/templates packages/config/eslint packages/config/typescript packages/config/prettier
mkdir -p .changeset .github/workflows .claude/commands

# 5. Crear package.json para cada paquete del espacio de trabajo
echo '{"name":"@acme/web","version":"0.0.1","private":true,"scripts":{"dev":"next dev","build":"next build","lint":"eslint ."}}' > apps/web/package.json
echo '{"name":"@acme/docs","version":"0.0.1","private":true,"scripts":{"dev":"astro dev","build":"astro build"}}' > apps/docs/package.json
echo '{"name":"@acme/ui","version":"0.0.1","main":"./dist/index.js","types":"./dist/index.d.ts","scripts":{"build":"tsup"}}' > packages/ui/package.json
echo '{"name":"@acme/database","version":"0.0.1","scripts":{"db:generate":"drizzle-kit generate","db:migrate":"drizzle-kit migrate","db:seed":"tsx seed.ts"}}' > packages/database/package.json
echo '{"name":"@acme/emails","version":"0.0.1","scripts":{"build":"tsup"}}' > packages/emails/package.json
echo '{"name":"@acme/config","version":"0.0.1","private":true}' > packages/config/package.json

# 6. Inicializar Changesets
pnpm dlx @changesets/cli init

# 7. Instalar dependencias dev raíz
pnpm add -D typescript eslint prettier vitest playwright -w

# 8. Instalar deps específicas del espacio de trabajo
pnpm --filter @acme/web add next react react-dom @acme/ui @acme/database
pnpm --filter @acme/web add -D @acme/config tsup vitest
pnpm --filter @acme/docs add astro
pnpm --filter @acme/ui add react radix-ui
pnpm --filter @acme/ui add -D tsup vitest @testing-library/react
pnpm --filter @acme/database add drizzle-orm @neondatabase/serverless
pnpm --filter @acme/database add -D drizzle-kit tsx
pnpm --filter @acme/emails add react-email @react-email/components resend
pnpm --filter @acme/emails add -D tsup

# 9. Agregar comandos del proyecto Claudient
npx claudient add command add-package
npx claudient add command add-app
npx claudient add command changeset-guide
```

## Plantilla CLAUDE.md

```markdown
# Mi Monorepo

Este es un monorepo Turborepo + pnpm que contiene múltiples aplicaciones y paquetes compartidos.
Todos los paquetes son TypeScript strict. Nunca crees archivos fuera de apps/ o packages/ sin actualizar este archivo.

## Stack

- Turborepo 2.x — orquestación de tareas y almacenamiento remoto en caché
- pnpm 9.x — gestor de paquetes con espacios de trabajo
- TypeScript 5.x strict — todos los paquetes
- Next.js 14 (App Router) — apps/web
- Astro 4.x — apps/docs
- tsup — compilación de packages/ui y packages/emails
- Drizzle ORM + Neon — packages/database
- React Email + Resend — packages/emails
- Changesets — versionado y changelog
- Vitest — pruebas unitarias en cada paquete
- Playwright — pruebas E2E en apps/web

## Tareas comunes

```bash
# Ejecutar todas las aplicaciones en modo dev (paralelo, vía Turborepo)
pnpm dev

# Compilar todo en el orden correcto de dependencias
pnpm build

# Ejecutar todas las pruebas unitarias
pnpm test

# Ejecutar Playwright E2E contra apps/web
pnpm --filter @acme/web test:e2e

# Verificar tipos en todo el monorepo
pnpm typecheck

# Lint en todo
pnpm lint

# Agregar una nueva dependencia a un espacio de trabajo específico
pnpm --filter @acme/web add zod

# Agregar un paquete de espacio de trabajo compartido como dependencia
pnpm --filter @acme/web add @acme/ui

# Generar una migración de BD después del cambio de esquema
pnpm --filter @acme/database db:generate

# Ejecutar migraciones contra la BD objetivo
pnpm --filter @acme/database db:migrate

# Crear un changeset para un cambio de paquete
pnpm changeset

# Versionar todos los paquetes con changesets pendientes (CI solo)
pnpm changeset version

# Publicar paquetes a npm (CI solo, ejecuta en release.yml)
pnpm changeset publish
```

## Agregar un nuevo paquete

1. Crear `packages/<nombre>/` con `package.json` (nombre: `@acme/<nombre>`)
2. Agregar un `tsconfig.json` extendiendo `../../packages/config/typescript/base.json`
3. Agregar un `tsup.config.ts` si el paquete produce un artefacto de compilación
4. Agregar el paquete al pipeline `build` en `turbo.json` si tiene un paso de compilación
5. Ejecutar `pnpm install` desde la raíz del repo para registrar el espacio de trabajo
6. Agregar el paquete como dependencia en cualquier consumidor con `pnpm --filter @acme/<consumidor> add @acme/<nombre>`

## Agregar una nueva aplicación

1. Crear `apps/<nombre>/` con un `package.json` (nombre: `@acme/<nombre>`)
2. Agregar un `tsconfig.json` extendiendo la configuración apropiada desde `packages/config/typescript/`
3. Registrar scripts `dev`, `build`, `lint`, `typecheck` en `package.json`
4. Actualizar `turbo.json` pipeline si la aplicación tiene dependencias de tareas no estándar
5. Agregar un proyecto Vercel o Cloudflare Pages para despliegues

## Flujo de trabajo de lanzamiento de Changeset

1. Hacer cambios de código en uno o más paquetes
2. Ejecutar `pnpm changeset` — seleccionar paquetes afectados y tipo de bump (patch/minor/major)
3. Hacer commit del archivo `.changeset/<hash>.md` generado junto con los cambios de código
4. Cuando el PR se fusiona con main, el flujo de trabajo `release.yml` ejecuta `changeset version` luego `changeset publish`
5. El flujo de trabajo crea un PR de "Version Packages" si los paquetes necesitan bumps de versión

## Herencia de configuración compartida

- TypeScript: cada tsconfig.json tiene `"extends": "../../packages/config/typescript/<variante>.json"`
- ESLint: cada eslint.config.js importa desde `@acme/config/eslint/<variante>`
- Prettier: root `.prettierrc.js` exporta `require("@acme/config/prettier")`
- Nunca anules `strict`, `noUncheckedIndexedAccess`, o `exactOptionalPropertyTypes` — abre una discusión primero

## Reglas del pipeline de Turborepo

- `build` produce salida a `dist/` y `.next/` — estos son almacenados en caché por Turborepo
- `test` depende de `^build` — todos los paquetes upstream deben compilar antes de que se ejecuten las pruebas
- `lint` y `typecheck` se ejecutan en paralelo sin dependencia upstream
- `dev` tiene `"cache": false` y `"persistent": true` — nunca almacena en caché y sigue ejecutándose
- Agregar nuevas tareas a `turbo.json` antes de agregar scripts a package.json

## Convenciones

- Los nombres de paquetes deben seguir `@acme/<nombre>` — sin excepciones
- Todas las exportaciones deben pasar por un barril `src/index.ts` — no importaciones profundas de consumidores
- Los cambios de esquema de base de datos requieren un archivo de migración — nunca edites SQL de migración existente
- Las variables de entorno viven en `apps/web/.env.local` (gitignored) y `.env.example` (committed)
- Los componentes React en packages/ui deben ser compatibles con server-component (no use client a menos que sea necesario)
```

## Servidores MCP

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

## Hooks recomendados

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

## Skills a instalar

```bash
# Desarrollo de TypeScript y Node.js
npx claudient add skill backend/typescript/tsup-library
npx claudient add skill backend/typescript/strict-tsconfig

# Desarrollo de aplicación Next.js
npx claudient add skill frontend/nextjs/app-router
npx claudient add skill frontend/nextjs/server-components

# Base de datos y migraciones
npx claudient add skill backend/database/drizzle-schema
npx claudient add skill backend/database/migrations-workflow

# Testing
npx claudient add skill testing/vitest-unit
npx claudient add skill testing/playwright-e2e

# Monorepo e CI
npx claudient add skill devops/turborepo-pipeline
npx claudient add skill devops/changesets-release
npx claudient add skill devops/github-actions-ci

# Calidad de código
npx claudient add skill productivity/code-review
npx claudient add skill productivity/pr-description
```

## Relacionado

- [Turborepo pipeline guide](../guides/turborepo-pipelines.md)
- [Changeset release workflow](../workflows/changeset-release.md)
- [Shared TypeScript config guide](../guides/shared-tsconfig.md)
- [pnpm workspace dependency management](../guides/pnpm-workspaces.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
