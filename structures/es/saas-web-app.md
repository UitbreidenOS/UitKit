# SaaS Web App — Estructura del Proyecto

> Para un equipo de ingeniería SaaS full-stack que entrega funcionalidades en un monorepo Next.js 14 + Supabase + Stripe, optimizando el flujo de trabajo de especificación a producción.

## Stack

- **Framework:** Next.js 14 (App Router, Server Components, Server Actions)
- **Language:** TypeScript 5.4+
- **Monorepo:** Turborepo 2.x con espacios de trabajo de pnpm
- **Package manager:** pnpm 9+
- **Auth + Database:** Supabase (PostgreSQL 15, GoTrue auth, Row Level Security)
- **ORM:** Drizzle ORM 0.30+ con `drizzle-kit` para migraciones
- **Billing:** Stripe 14+ (Subscriptions, Customer Portal, webhooks)
- **Deployment:** Vercel (web app), Supabase Cloud (database + auth)
- **Styling:** Tailwind CSS 3.4 + shadcn/ui (Radix UI primitives)
- **Email:** React Email + Resend
- **Unit testing:** Vitest 1.x
- **E2E testing:** Playwright 1.44+
- **CI/CD:** GitHub Actions (`ci.yml`, `preview.yml`, `release.yml`)
- **Local Supabase:** Docker Compose (supabase/docker)

## Árbol de directorios

```
saas-web-app/                             # Raíz del monorepo Turborepo
├── .claude/
│   ├── CLAUDE.md                         # Instrucciones a nivel de repositorio para Claude Code
│   ├── settings.json                     # Servidores MCP, hooks, permisos
│   └── commands/
│       ├── new-feature.md                # /new-feature — spec → UI → route → migration → test
│       ├── add-migration.md              # /add-migration — Cambio de esquema Drizzle + migración SQL
│       ├── stripe-webhook.md             # /stripe-webhook — scaffold nuevo manejador de eventos Stripe
│       ├── rls-policy.md                 # /rls-policy — generar política RLS para nueva tabla
│       └── env-audit.md                  # /env-audit — diff .env.example contra envs actuales
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Typecheck, lint, pruebas unitarias en cada PR
│       ├── preview.yml                   # Deploy de vista previa en Vercel + pruebas de humo de Playwright
│       └── release.yml                   # Deploy de producción disparado por etiqueta semver
├── apps/
│   └── web/                              # Aplicación Next.js 14
│       ├── app/                          # Raíz del App Router
│       │   ├── (auth)/                   # Grupo de rutas — sin diseño de shell persistente
│       │   │   ├── login/
│       │   │   │   └── page.tsx          # Página de inicio de sesión con enlace mágico de Supabase / OAuth
│       │   │   ├── signup/
│       │   │   │   └── page.tsx
│       │   │   └── callback/
│       │   │       └── route.ts          # Manejador de devolución de llamada de autenticación de Supabase
│       │   ├── (app)/                    # Grupo de rutas — shell de aplicación autenticado
│       │   │   ├── layout.tsx            # Shell de barra lateral + navegación superior, lee sesión del lado del servidor
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx
│       │   │   ├── settings/
│       │   │   │   ├── page.tsx          # Configuración de perfil de usuario
│       │   │   │   └── billing/
│       │   │   │       └── page.tsx      # Redirección del Portal de Clientes de Stripe
│       │   │   └── [feature]/            # Ruta específica de función — añade nuevas funciones aquí
│       │   │       ├── page.tsx
│       │   │       └── actions.ts        # Acciones de servidor para esta función
│       │   ├── api/
│       │   │   ├── webhooks/
│       │   │   │   └── stripe/
│       │   │   │       └── route.ts      # Receptor de webhook de Stripe (cuerpo sin procesar, verificación de firma)
│       │   │   └── health/
│       │   │       └── route.ts          # Comprobación de tiempo de actividad — devuelve 200 + ping de BD
│       │   ├── layout.tsx                # Diseño raíz: fuentes, ThemeProvider, Toaster
│       │   └── globals.css               # Directivas Tailwind + propiedades CSS personalizadas
│       ├── components/
│       │   ├── ui/                       # Componentes generados de shadcn/ui (no editar manualmente)
│       │   │   ├── button.tsx
│       │   │   ├── dialog.tsx
│       │   │   ├── form.tsx
│       │   │   └── table.tsx
│       │   ├── features/                 # Componentes compuestos específicos de funciones
│       │   │   └── billing/
│       │   │       ├── PricingTable.tsx
│       │   │       └── SubscriptionBadge.tsx
│       │   └── layout/
│       │       ├── Sidebar.tsx
│       │       └── TopNav.tsx
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts             # Cliente de Supabase del navegador (singleton)
│       │   │   ├── server.ts             # Cliente de Supabase del servidor (basado en cookies)
│       │   │   └── middleware.ts         # Re-exportar para importación middleware.ts
│       │   ├── stripe/
│       │   │   ├── client.ts             # Instancia del SDK de Stripe
│       │   │   ├── plans.ts              # IDs de planes, IDs de precios por entorno
│       │   │   └── webhooks.ts           # constructEvent + manejadores de eventos tipados
│       │   ├── db/
│       │   │   └── index.ts              # Instancia de BD de Drizzle (re-exportar desde packages/database)
│       │   └── utils.ts                  # cn(), formatCurrency(), absoluteUrl()
│       ├── middleware.ts                  # Guardia de autenticación: protege rutas (app), actualiza sesión
│       ├── next.config.ts                # Dominios de imagen, validación de env, redirecciones
│       ├── tailwind.config.ts            # Extiende configuración compartida de Tailwind
│       ├── tsconfig.json                 # Extiende tsconfig raíz, alias de ruta (@/)
│       └── package.json
├── packages/
│   ├── database/                         # Esquema de Drizzle, migraciones, seed
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── users.ts              # Tabla de usuarios — espeja auth.users mediante trigger
│   │   │   │   ├── subscriptions.ts      # Estado de suscripción de Stripe por usuario/org
│   │   │   │   ├── organizations.ts      # Modelo de organización para funciones multiinquilino
│   │   │   │   └── index.ts              # Re-exporta todas las tablas de esquema
│   │   │   ├── db.ts                     # Instancia de Drizzle: postgres() + drizzle(schema)
│       │   │   └── index.ts                  # Punto de entrada público del paquete
│       │   ├── migrations/
│       │   │   ├── 0001_create_users.sql
│       │   │   ├── 0002_create_subscriptions.sql
│       │   │   └── meta/
│       │   │       └── _journal.json         # Diario de migraciones de Drizzle (no editar manualmente)
│       │   ├── drizzle.config.ts             # URL de BD desde env, out: ./migrations, schema: ./src/schema
│       │   ├── tsconfig.json
│       │   └── package.json
│   ├── emails/                               # Plantillas de React Email
│   │   ├── src/
│   │   │   ├── WelcomeEmail.tsx              # Enviado en la suscripción
│   │   │   ├── TrialEndingEmail.tsx          # Enviado 7 días antes de que expire el período de prueba
│   │   │   └── InvoicePaidEmail.tsx          # Enviado en Stripe invoice.payment_succeeded
│   │   ├── emails/                           # Directorio de vista previa de desarrollo (react-email dev)
│   │   └── package.json
│   └── ui/                                  # Biblioteca de componentes React compartida
│       ├── src/
│       │   ├── components/
│       │   │   └── Logo.tsx
│       │   └── index.ts
│       ├── tailwind.config.ts                # Configuración base de Tailwind — extendida por aplicaciones
│       └── package.json
├── supabase/                             # Configuración del proyecto Supabase
│   ├── migrations/                       # Migraciones SQL de Supabase (triggers de autenticación, políticas RLS)
│   │   ├── 20240101000000_init.sql       # Bootstrap de esquema inicial
│   │   └── 20240215000000_rls_policies.sql
│   ├── seed.sql                          # Seed de desarrollo local: usuarios de prueba, planes, orgs
│   └── config.toml                       # Configuración del proyecto CLI de Supabase (project_id, ports)
├── docker-compose.yml                    # Stack de Supabase local: db, studio, inbucket, auth
├── turbo.json                            # Pipeline: build, dev, test, lint — configuración de caché
├── .env.example                          # Todas las variables de entorno requeridas documentadas con descripciones
├── .env.local                            # Overrides de desarrollo local (gitignored)
├── pnpm-workspace.yaml                   # Globs de espacio de trabajo: apps/*, packages/*
├── tsconfig.json                         # tsconfig raíz: strict, alias de ruta, composite
└── package.json                          # Raíz: devDependencies, turbo, scripts
```

## Archivos clave explicados

| Ruta | Propósito |
|---|---|
| `apps/web/middleware.ts` | Actualización de sesión de Supabase + protección de rutas usando `createServerClient`; redirige usuarios no autenticados desde rutas `(app)` a `/login` |
| `packages/database/drizzle.config.ts` | Indica a `drizzle-kit` dónde encontrar el esquema y dónde escribir migraciones; la URL de BD debe ser `DATABASE_URL` (conexión directa, no agrupador) |
| `apps/web/api/webhooks/stripe/route.ts` | Verifica la firma de Stripe con `stripe.webhooks.constructEvent`, distribuye a funciones manejadoras tipadas por tipo de evento, devuelve 200 rápidamente |
| `packages/database/migrations/meta/_journal.json` | Ledger de migración interno de Drizzle — nunca editar a mano; siempre usar `pnpm db:generate` para crear nuevas migraciones |
| `turbo.json` | Define el gráfico de tareas: `build` depende de `^build`; `dev` sin caché; `test` se ejecuta después de `build`; habilita caché remoto para CI |
| `supabase/config.toml` | Configuración del CLI de Supabase para stack local: asignaciones de puerto, proveedores de autenticación habilitados, redirección de SMTP a Inbucket |
| `.env.example` | Única fuente de verdad para todas las variables de entorno — cada nueva variable de entorno debe añadirse aquí con un comentario antes de fusionar |
| `.github/workflows/ci.yml` | Ejecuta `pnpm turbo typecheck lint test` en paralelo mediante pipeline de Turborepo; publica comprobaciones fallidas como anotaciones de PR |

## Andamio rápido

```bash
# Requisitos previos: Node 20+, pnpm 9+, Docker Desktop en ejecución

# Crear monorepo con Turborepo
npx create-turbo@latest saas-web-app --package-manager pnpm
cd saas-web-app

# Agregar aplicación Next.js
pnpm dlx create-next-app@14 apps/web \
  --typescript --tailwind --app --no-src-dir \
  --import-alias "@/*" --no-git

# Agregar paquetes compartidos
mkdir -p packages/database/src/schema packages/database/migrations/meta
mkdir -p packages/emails/src packages/emails/emails
mkdir -p packages/ui/src/components

# Instalar Drizzle en paquete de base de datos
pnpm --filter @repo/database add drizzle-orm postgres
pnpm --filter @repo/database add -D drizzle-kit

# Instalar Supabase en aplicación web
pnpm --filter web add @supabase/supabase-js @supabase/ssr

# Instalar Stripe en aplicación web
pnpm --filter web add stripe @stripe/stripe-js

# Instalar React Email + Resend en paquete de emails
pnpm --filter @repo/emails add react-email @react-email/components resend

# Instalar shadcn/ui en aplicación web
pnpm dlx shadcn-ui@latest init --cwd apps/web
pnpm dlx shadcn-ui@latest add button dialog form table --cwd apps/web

# Instalar pruebas
pnpm --filter web add -D vitest @vitejs/plugin-react playwright @playwright/test

# Inicializar stack local de Supabase
pnpm add -D supabase --workspace-root
pnpm supabase init
pnpm supabase start   # inicia contenedores Docker

# Crear flujos de trabajo de GitHub Actions
mkdir -p .github/workflows
touch .github/workflows/ci.yml .github/workflows/preview.yml .github/workflows/release.yml

# Crear configuración de Claude Code
mkdir -p .claude/commands
touch .claude/CLAUDE.md .claude/settings.json
touch .claude/commands/new-feature.md
touch .claude/commands/add-migration.md
touch .claude/commands/stripe-webhook.md
touch .claude/commands/rls-policy.md
touch .claude/commands/env-audit.md

# Crear .env.example
touch .env.example .env.local

# Instalar habilidades de Claudient
npx claudient add skill backend/nextjs-app-router
npx claudient add skill backend/drizzle-orm
npx claudient add skill backend/supabase-rls
npx claudient add skill backend/stripe-webhooks
npx claudient add skill frontend/shadcn-ui
npx claudient add skill testing/vitest
npx claudient add skill testing/playwright
npx claudient add skill devops-infra/cicd

echo "Monorepo de aplicación web SaaS andamiado. Ejecutar: pnpm dev"
```

## Plantilla CLAUDE.md

```markdown
# SaaS Web App

Producto SaaS full-stack en un monorepo Turborepo. Next.js 14 App Router para el frontend,
Supabase para autenticación y PostgreSQL, Drizzle ORM para gestión de esquemas, Stripe para facturación,
implementado en Vercel. Todos los cambios deben pasar CI antes de fusionarse.

## Stack

- Next.js 14 (App Router, Server Components, Server Actions)
- TypeScript 5.4, pnpm 9, Turborepo 2
- Supabase (auth + PostgreSQL 15 con RLS)
- Drizzle ORM 0.30 + drizzle-kit (migraciones)
- Stripe 14 (Subscriptions, webhooks, Customer Portal)
- Tailwind CSS 3.4 + shadcn/ui
- React Email + Resend
- Vitest (unit), Playwright (E2E)
- GitHub Actions CI/CD → Vercel

## Diseño del monorepo

- `apps/web/` — Aplicación Next.js; todo código visible al usuario vive aquí
- `packages/database/` — Esquema de Drizzle + migraciones; compartido por todas las aplicaciones
- `packages/emails/` — Plantillas de React Email; renderizadas y enviadas vía Resend
- `packages/ui/` — componentes compartidos (Logo, etc.); no shadcn/ui, esos viven en apps/web
- `supabase/` — Migraciones SQL para políticas RLS y triggers de autenticación; configuración del CLI de Supabase

## Agregar una nueva función — pasos exactos

1. Escribir un comentario de especificación breve al principio del archivo relevante o un `_SPEC.md` en el directorio de funciones
2. Construir la UI en `apps/web/app/(app)/[feature]/page.tsx`
3. Agregar Acciones de Servidor en `apps/web/app/(app)/[feature]/actions.ts`
4. Agregar o extender esquema de Drizzle en `packages/database/src/schema/`
5. Ejecutar `pnpm db:generate` para crear la migración SQL, luego `pnpm db:migrate`
6. Agregar políticas RLS en `supabase/migrations/` si la tabla tiene alcance de usuario
7. Escribir pruebas unitarias con Vitest; agregar prueba E2E en `apps/web/e2e/` si es visible al usuario
8. Usar comando de barra `/new-feature` para andamiar código boilerplate para los pasos 2–7

## Ejecutar migraciones de base de datos

```bash
# Generar migración desde cambio de esquema
pnpm --filter @repo/database run db:generate

# Aplicar a Supabase local (Docker)
pnpm --filter @repo/database run db:migrate

# Empujar migraciones SQL de Supabase (RLS, triggers)
pnpm supabase db push

# Reiniciar BD local y re-seed
pnpm supabase db reset
```

## Patrones de Drizzle

- Siempre importar `db` desde `@repo/database`, nunca instanciar directamente en `apps/`
- Usar `.returning()` en insert/update — Drizzle no devuelve filas por defecto
- Transacciones: `db.transaction(async (tx) => { ... })` — pasar `tx` a todas las llamadas anidadas
- Relaciones: definir con `relations()` en el archivo de esquema, consultar con `db.query.*`
- Nunca ejecutar SQL sin procesar desde `apps/` — escribir una función de consulta en `packages/database/src/`

## Manejo de webhook de Stripe

- El manejador vive en `apps/web/app/api/webhooks/stripe/route.ts`
- Debe leer cuerpo sin procesar: `await req.text()` — no usar `req.json()`
- Verificar con `stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)`
- Cada tipo de evento obtiene su propia función manejadora; importar desde `lib/stripe/webhooks.ts`
- Devolver `{ received: true }` con estado 200 inmediatamente después de la verificación
- Idempotencia: comprobar si el evento ya fue procesado antes de escribir en BD
- Usar comando de barra `/stripe-webhook` para andamiar un nuevo manejador de eventos

## Variables de entorno por entorno

| Variable | Local | Preview | Production |
|---|---|---|---|
| `DATABASE_URL` | URL de Docker Compose | BD de rama de Supabase | BD principal de Supabase |
| `NEXT_PUBLIC_SUPABASE_URL` | http://localhost:54321 | URL del proyecto de vista previa | URL del proyecto de producción |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon local | Clave anon de vista previa | Clave anon de producción |
| `SUPABASE_SERVICE_ROLE_KEY` | Rol de servicio local | Rol de servicio de vista previa | Rol de servicio de producción |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_test_...` | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | Secreto del oyente local del CLI | Secreto de webhook de Vercel | Secreto de webhook de Vercel |
| `RESEND_API_KEY` | Clave de prueba u omitir | Clave de prueba | Clave de producción |

Todas las variables de entorno deben estar en `.env.example` con un comentario de descripción antes de fusionar.

## Convenciones de autenticación

- `middleware.ts` en `apps/web/` maneja la actualización de sesión y la protección de rutas
- Componentes de servidor: usar `createServerClient` desde `@supabase/ssr` con almacén de cookies
- Componentes de cliente: usar `createBrowserClient` desde `@supabase/ssr`
- Nunca acceder a `supabase.auth.getUser()` en un componente de cliente para datos protegidos
- RLS es la capa de seguridad final — siempre escribir políticas para nuevas tablas

## Qué no hacer

- No importar desde `packages/database` dentro de `packages/ui` o `packages/emails`
- No usar `drizzle-kit push` en producción — siempre generar migraciones
- No llamar directamente a la API de Stripe desde componentes de cliente — usar Acciones de Servidor
- No hacer commit de `.env.local` o ningún archivo que contenga claves API reales
- No editar `packages/database/migrations/meta/_journal.json` a mano
```

## Servidores MCP

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/yourname/saas-web-app"
      ]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "POSTGRES_CONNECTION_STRING": "postgresql://postgres:postgres@localhost:54322/postgres"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp-server"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
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
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == *.tsx || \"$f\" == *.ts ]]; then npx prettier --write \"$f\" 2>/dev/null || true; fi'"
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'f=\"$CLAUDE_TOOL_INPUT_FILE_PATH\"; if [[ \"$f\" == */schema/*.ts && \"$f\" == */packages/database/* ]]; then echo \"[HOOK] Esquema cambiado — recuerda ejecutar: pnpm --filter @repo/database run db:generate\" >&2; fi'"
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
            "command": "bash -c 'if echo \"$CLAUDE_TOOL_INPUT_COMMAND\" | grep -q \"db:migrate\"; then echo \"[HOOK] Ejecutando migración — asegurar que Supabase local esté en ejecución: pnpm supabase status\" >&2; fi'"
          }
        ]
      }
    ]
  }
}
```

## Habilidades para instalar

```bash
npx claudient add skill backend/nextjs-app-router
npx claudient add skill backend/drizzle-orm
npx claudient add skill backend/supabase-rls
npx claudient add skill backend/stripe-webhooks
npx claudient add skill frontend/shadcn-ui
npx claudient add skill frontend/react-email
npx claudient add skill testing/vitest
npx claudient add skill testing/playwright
npx claudient add skill devops-infra/cicd
npx claudient add skill devops-infra/vercel
```

## Relacionado

- [Guía Completa de Next.js](../guides/nextjs-app-router.md)
- [Flujo de Trabajo de Integración de Stripe](../workflows/stripe-billing.md)

---

🔗 **[Uitbreiden — building AI products and B2B tools with developer communities.](https://uitbreiden.com/)**
📺 **[Subscribe to our YouTube Channel for more deep dives](https://www.youtube.com/channel/UCcvK8pHyqeR7Q_0lYkuHlUg)**
